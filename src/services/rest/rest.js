(function () {

    // Main module
    var app = angular.module('odalic-app');

    // A REST service methods
    app.service('rest', function (requests) {
        var root = constants.addresses.odalicroot;

        // Files service
        this.files = {
            name: function (identifier) {
                return {
                    create: function (data) {
                        return {
                            exec: function (success, failure) {
                                var url = text.urlConcat(root, 'files', identifier);
                                requests.reqMFD({
                                    method: 'PUT',
                                    address: url,
                                    formData: requests.prepareMFD()
                                        .attachJSON('file', {
                                            id: String(identifier),
                                            uploaded: '2000-01-01 00:00',
                                            owner: 'default',
                                            location: url
                                        })
                                        .attachGeneric('input', /*document.getElementById("concreteFile").files[0]*/ data)
                                        .get(),
                                    success: success,
                                    failure: failure
                                });
                            }
                        };
                    },
                    remove: {
                        exec: function (success, failure) {
                            requests.quickRequest(text.urlConcat(root, 'files', identifier), 'DELETE', success, failure);
                        }
                    },
                    retrieve: {
                        exec: function (success, failure) {
                            requests.reqCSV({
                                method: 'GET',
                                address: text.urlConcat(root, 'files', identifier),
                                formData: 'unspecified',
                                success: success,
                                failure: failure
                            });
                        }
                    }
                };
            },
            list: {
                exec: function (success, failure) {
                    requests.quickRequest(text.urlConcat(root, 'files'), 'GET', success, failure);
                }
            }
        };

        // Tasks service
        this.tasks = {
            name: function(identifier) {
                return {
                    create: function (data) {
                        return {
                            exec: function (success, failure) {
                                requests.reqJSON({
                                    method: 'PUT',
                                    address: text.urlConcat(root, 'tasks', identifier),
                                    formData: data,
                                    success: success,
                                    failure: failure
                                });
                            }
                        }
                    },
                    remove: {
                        exec: function (success, failure) {
                            requests.quickRequest(text.urlConcat(root, 'tasks', identifier), 'DELETE', success, failure);
                        }
                    },
                    retrieve: {
                        exec: function (success, failure) {
                            requests.quickRequest(text.urlConcat(root, 'tasks', identifier), 'GET', success, failure);
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
                                success: success,
                                failure: failure
                            });
                        }
                    },
                    input: {
                        retrieve: {
                            exec: function (success, failure) {
                                requests.reqJSON({
                                    method: 'GET',
                                    address: text.urlConcat(root, 'tasks', identifier, 'configuration', 'feedback', 'input'),
                                    formData: undefined,
                                    success: success,
                                    failure: failure
                                });
                            }
                        }
                    },
                    result: {
                        retrieve: {
                            exec: function (success, failure) {
                                requests.reqJSON({
                                    method: 'GET',
                                    address: text.urlConcat(root, 'tasks', identifier, 'result'),
                                    formData: undefined,
                                    success: success,
                                    failure: failure
                                });
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
                            rdf: {
                                address: function () {
                                    return text.urlConcat(root, 'tasks', identifier, 'result', 'rdf-export');
                                }
                            }
                        }
                    },
                    feedback: {
                        store: function(data) {
                            return {
                                exec: function (success, failure) {
                                    requests.reqJSON({
                                        method: 'PUT',
                                        address: text.urlConcat(root, 'tasks', identifier, 'configuration', 'feedback'),
                                        formData: data,
                                        success: success,
                                        failure: failure
                                    });
                                }
                            };
                        }
                    }
                };
            }
        };

    });

})();