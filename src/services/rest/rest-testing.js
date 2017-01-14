$.defineModule(function () {
    return function (requests) {
        // Preparations
        var successf = function (success) {
            return function (response) {
                var r = response.data;
                var res = {};
                var addarg1 = undefined;
                var addarg2 = undefined;

                if (r.type === 'DATA') {
                    res = r.payload;
                }
                else if (r.type === 'MESSAGE') {
                    res = r.payload.text;
                    addarg1 = r.payload.additionalResources;
                    addarg2 = r.payload.debugContent;
                }
                success(res, addarg1, addarg2);
            };
        };

        var statem = {};
        $.getJSONSync('./test/samples/responses/get-state.json', function (response) {
            statem = response;
            objhelp.objForEach(statem, function (key, value) {
                value['current'] = value['begin'];
                value['fallback'] = value['begin'];
            });
        });

        var tr = {
            // Files service
            files: {
                name: function (identifier) {
                    return {
                        retrieve: {
                            exec: function (success, failure) {
                                $.getJSON('./test/samples/input/' + identifier, function (response) {
                                    success(response);
                                });
                            }
                        }
                    };
                },
                list: {
                    exec: function (success, failure) {
                        $.getJSON('./test/samples/responses/get-files.json', function (response) {
                            success(response);
                        });
                    }
                }
            },

            // Tasks service
            tasks: {
                name: function (identifier) {
                    return {
                        retrieve: {
                            exec: function (success, failure) {
                                $.getJSON('./test/samples/result/' + identifier + 'config.json', function (response) {
                                    success(response);
                                });
                            }
                        },
                        stop: {
                            exec: function (success, failure) {
                                if (!(identifier in statem)) {
                                    failure();
                                } else {
                                    var so = statem[identifier];

                                    if (so['current'] == tr.tasks.states.running) {
                                        so['current'] = so['fallback'];
                                        success();
                                    } else {
                                        failure();
                                    }
                                }
                            }
                        },
                        state: {
                            retrieve: {
                                exec: function (success, failure) {
                                    // Move onto next 'iteration' of state just for simulating polling of the task's state
                                    if (!(identifier in statem)) {
                                        failure();
                                    } else {
                                        var so = statem[identifier];

                                        if (--so['running'] <= 0) {
                                            so['current'] = so['end'];
                                            so['fallback'] = so['end'];
                                        }

                                        success(so['current']);
                                    }
                                }
                            }
                        },
                        input: {
                            retrieve: {
                                exec: function (success, failure) {
                                    $.getJSON('./test/samples/responses/get-tasks.json', function (response) {
                                        for (var i = 0; i < response.length; ++i) {
                                            if (response[i]['id'] == identifier) {
                                                var inputf = response[i]['configuration']['input'];

                                                $.ajax({
                                                    async: false,
                                                    type: 'GET',
                                                    url: './test/samples/input/' + inputf,
                                                    data: null,
                                                    success: function (response) {
                                                        Papa.parse(response, {
                                                            worker: true,
                                                            complete: function (inputFile) {
                                                                var inputFileColumns = inputFile.data[0];
                                                                var inputFileRows = [];
                                                                for (var i = 1; i < inputFile.data.length; i++) {
                                                                    inputFileRows.push(inputFile.data[i]);
                                                                }

                                                                // Call the callback, which should handle the data and fill the table
                                                                success({
                                                                    'headers': inputFileColumns,
                                                                    'rows': inputFileRows
                                                                });
                                                            }
                                                        });
                                                    },
                                                    dataType: 'text'
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        },
                        result: {
                            retrieve: {
                                exec: function (success, failure) {
                                    $.getJSON('./test/samples/result/' + identifier + '.json', function (response) {
                                        success(response);
                                    });
                                }
                            }
                        },
                        feedback: {
                            retrieve: {
                                exec: function (success, failure) {
                                    $.getJSON('./test/samples/result/' + identifier + 'feedback.json', function (response) {
                                        success(response);
                                    });
                                }
                            }
                        }
                    };
                },
                list: {
                    exec: function (success, failure) {
                        $.getJSON('./test/samples/responses/get-tasks.json', function (response) {
                            success(response);
                        });
                    }
                },
                states: {
                    ready: 'READY',
                    running: 'RUNNING',
                    warning: 'WARNING',
                    error: 'ERROR',
                    success: 'SUCCESS'
                }
            }
        };

        return tr;
    };
});