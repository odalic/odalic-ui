$.defineModule(function () {
    return function (requests) {
        // Preparations
        var root = constants.addresses.odalicroot;
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

        return {
            // Files service
            files: {
                name: function (identifier) {
                    return {
                        create: {
                            upload: function (data) {
                                return {
                                    exec: function (success, failure) {
                                        var url = text.urlConcat(root, 'files', identifier);
                                        requests.reqMFD({
                                            method: 'PUT',
                                            address: url,
                                            formData: requests.prepareMFD()
                                                .attachJSON('file', {
                                                    id: String(identifier),
                                                    uploaded: (new Date()).toString(constants.formats.date),
                                                    owner: 'default',
                                                    location: url
                                                })
                                                .attachGeneric('input', data)
                                                .get(),
                                            success: successf(success),
                                            failure: failure
                                        });
                                    }
                                };
                            },
                            remote: function (location) {
                                return {
                                    exec: function (success, failure) {
                                        requests.reqJSON({
                                            method: 'PUT',
                                            address: text.urlConcat(root, 'files', identifier),
                                            formData: {
                                                location: location
                                            },
                                            success: successf(success),
                                            failure: failure
                                        });
                                    }
                                }
                            }
                        },
                        remove: {
                            exec: function (success, failure) {
                                requests.quickRequest(text.urlConcat(root, 'files', identifier), 'DELETE', successf(success), failure);
                            }
                        },
                        retrieve: {
                            exec: function (success, failure) {
                                requests.reqCSV({
                                    method: 'GET',
                                    address: text.urlConcat(root, 'files', identifier),
                                    formData: 'unspecified',
                                    success: successf(success),
                                    failure: failure
                                });
                            }
                        }
                    };
                },
                list: {
                    exec: function (success, failure) {
                        requests.quickRequest(text.urlConcat(root, 'files'), 'GET', successf(success), failure);
                    }
                }
            },

            // Tasks service
            tasks: {
                name: function (identifier) {
                    return {
                        create: function (data) {
                            return {
                                exec: function (success, failure) {
                                    requests.reqJSON({
                                        method: 'PUT',
                                        address: text.urlConcat(root, 'tasks', identifier),
                                        formData: data,
                                        success: successf(success),
                                        failure: failure
                                    });
                                }
                            }
                        },
                        replace: function (data) {
                            return {
                                exec: function (success, failure) {
                                    requests.reqJSON({
                                        method: 'PUT',
                                        address: text.urlConcat(root, 'tasks', identifier, 'configuration'),
                                        formData: data,
                                        success: successf(success),
                                        failure: failure
                                    });
                                }
                            }
                        },
                        remove: {
                            exec: function (success, failure) {
                                requests.quickRequest(text.urlConcat(root, 'tasks', identifier), 'DELETE', successf(success), failure);
                            }
                        },
                        retrieve: {
                            exec: function (success, failure) {
                                requests.quickRequest(text.urlConcat(root, 'tasks', identifier), 'GET', successf(success), failure);
                            }
                        },
                        execute: {
                            exec: function (success, failure) {
                                requests.reqJSON({
                                    method: 'PUT',
                                    address: text.urlConcat(root, 'tasks', identifier, 'execution'),
                                    formData: {
                                        draft: false
                                    },
                                    success: successf(success),
                                    failure: failure
                                });
                            }
                        },
                        stop: {
                            exec: function (success, failure) {
                                requests.quickRequest(text.urlConcat(root, 'tasks', identifier, 'execution'), 'DELETE', successf(success), failure);
                            }
                        },
                        state: {
                            retrieve: {
                                exec: function (success, failure) {
                                    requests.quickRequest(text.urlConcat(root, 'tasks', identifier, 'state'), 'GET', successf(success), failure);
                                }
                            }
                        },
                        input: {
                            retrieve: {
                                exec: function (success, failure) {
                                    requests.quickRequest(text.urlConcat(root, 'tasks', identifier, 'configuration', 'feedback', 'input'), 'GET', successf(success), failure);
                                }
                            }
                        },
                        result: {
                            retrieve: {
                                exec: function (success, failure) {
                                    requests.quickRequest(text.urlConcat(root, 'tasks', identifier, 'result'), 'GET', successf(success), failure);
                                }
                            },
                            export: {
                                json: {
                                    address: function () {
                                        return text.urlConcat(root, 'tasks', identifier, 'result', 'annotated-table');
                                    }
                                },
                                csv: {
                                    address: function () {
                                        return text.urlConcat(root, 'tasks', identifier, 'result', 'csv-export');
                                    }
                                },
                                turtle: {
                                    address: function () {
                                        return text.urlConcat(root, 'tasks', identifier, 'result', 'rdf-export', 'turtle');
                                    }
                                },
                                jsonld: {
                                    address: function () {
                                        return text.urlConcat(root, 'tasks', identifier, 'result', 'rdf-export', 'json-ld');
                                    }
                                }
                            }
                        },
                        feedback: {
                            store: function (data) {
                                return {
                                    exec: function (success, failure) {
                                        requests.reqJSON({
                                            method: 'PUT',
                                            address: text.urlConcat(root, 'tasks', identifier, 'configuration', 'feedback'),
                                            formData: data,
                                            success: successf(success),
                                            failure: failure
                                        });
                                    }
                                };
                            },
                            retrieve: {
                                exec: function (success, failure) {
                                    requests.quickRequest(text.urlConcat(root, 'tasks', identifier, 'configuration', 'feedback'), 'GET', successf(success), failure);
                                }
                            },
                        }
                    };
                },
                list: {
                    exec: function (success, failure) {
                        requests.quickRequest(text.urlConcat(root, 'tasks') + '?states=true', 'GET', successf(success), failure);
                    }
                },
                states: {
                    ready: 'READY',
                    running: 'RUNNING',
                    warning: 'WARNING',
                    error: 'ERROR',
                    success: 'SUCCESS'
                }
            },

            // GET http://example.com/base/entities?query=Pra&limit=20
            base: function (kb) {
                return {
                    entities: {
                        query: function (string) {
                            return {
                                limit: function (countLimit) {
                                    return {
                                       stamp: function (stamp) {
                                            return {
                                                retrieve: {
                                                    exec: function (success, failure) {
                                                        console.log(text.urlConcat(root, kb, 'entities') + '?query=' + string + '&limit=' + countLimit+'&stamp='+stamp, 'GET');
                                                        requests.quickRequest(text.urlConcat(root, kb, 'entities') + '?query=' + string + '&limit=' + countLimit+'&stamp='+stamp, 'GET', successf(success), failure);
                                                    },
                                                },
                                            };
                                        },
                                    };
                                },
                            };
                        },
                        classes: {
                            update: function (data) {
                                return {
                                    exec: function (success, failure) {
                                        console.log( text.urlConcat(root, kb, 'entities', 'classes'));
                                        requests.reqJSON({
                                            method: 'POST',
                                            address: text.urlConcat(root, kb, 'entities', 'classes'),
                                            formData: data,
                                            success: successf(success),
                                            failure: failure
                                        });
                                    },
                                };
                            },
                        },
                        resources: {
                            update: function (data) {
                                return {
                                    exec: function (success, failure) {
                                        console.log( text.urlConcat(root, kb, 'entities', 'resources'));
                                        requests.reqJSON({
                                            method: 'POST',
                                            address: text.urlConcat(root, kb, 'entities', 'resources'),
                                            formData: data,
                                            success: successf(success),
                                            failure: failure
                                        });
                                    },
                                };
                            },
                        },
                    },
                };
            },
        };
    };
})
;