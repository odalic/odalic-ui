$.defineModule(function () {
    return function (requests) {
        // Preparations
        var root = constants.addresses.odalicroot;

        // Classification/disambiguation/relation suggestions
        var searchRequest = function (kb, type) {
            return function (string) {
                return {
                    limit: function (countLimit) {
                        return {
                            retrieve: {
                                exec: function (success, failure) {
                                    requests.quickRequest(text.urlConcat(root, kb, 'entities', type) + '?query=' + string + '&limit=' + countLimit, 'GET', success, failure);
                                }
                            }
                        };
                    }
                };
            };
        };

        // Classification/disambiguation/relation proposal
        var proposeRequest = function(kb, type) {
            return function (data) {
                return {
                    exec: function (success, failure) {
                        requests.reqJSON({
                            method: 'POST',
                            address: text.urlConcat(root, kb, 'entities', type),
                            formData: data,
                            success: success,
                            failure: failure
                        });
                    }
                };
            };
        };

        // Module
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
                                            success: success,
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
                                            success: success,
                                            failure: failure
                                        });
                                    }
                                }
                            }
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
                            },
                            address: function () {
                                return text.urlConcat(root, 'files', identifier, 'data');
                            }
                        },
                        configuration: {
                            retrieve: {
                                exec: function (success, failure) {
                                    requests.reqJSON({
                                        method: 'GET',
                                        address: text.urlConcat(root, 'files', identifier, 'format'),
                                        formData: null,
                                        success: success,
                                        failure: failure
                                    });
                                }
                            },
                            replace: function (data) {
                                return {
                                    exec: function (success, failure) {
                                        requests.reqJSON({
                                            method: 'PUT',
                                            address: text.urlConcat(root, 'files', identifier, 'format'),
                                            formData: data,
                                            success: success,
                                            failure: failure
                                        });
                                    }
                                }
                            }
                        }
                    };
                },
                list: {
                    exec: function (success, failure) {
                        requests.quickRequest(text.urlConcat(root, 'files'), 'GET', success, failure);
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
                                        success: success,
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
                        stop: {
                            exec: function (success, failure) {
                                requests.quickRequest(text.urlConcat(root, 'tasks', identifier, 'execution'), 'DELETE', success, failure);
                            }
                        },
                        state: {
                            retrieve: {
                                exec: function (success, failure) {
                                    requests.quickRequest(text.urlConcat(root, 'tasks', identifier, 'state'), 'GET', success, failure);
                                }
                            }
                        },
                        input: {
                            retrieve: {
                                exec: function (success, failure) {
                                    requests.quickRequest(text.urlConcat(root, 'tasks', identifier, 'configuration', 'feedback', 'input'), 'GET', success, failure);
                                }
                            }
                        },
                        result: {
                            retrieve: {
                                exec: function (success, failure) {
                                    requests.quickRequest(text.urlConcat(root, 'tasks', identifier, 'result'), 'GET', success, failure);
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
                                            success: success,
                                            failure: failure
                                        });
                                    }
                                };
                            },
                            retrieve: {
                                exec: function (success, failure) {
                                    requests.quickRequest(text.urlConcat(root, 'tasks', identifier, 'configuration', 'feedback'), 'GET', success, failure);
                                }
                            }
                        }
                    };
                },
                list: {
                    exec: function (success, failure) {
                        requests.quickRequest(text.urlConcat(root, 'tasks') + '?states=true', 'GET', success, failure);
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

            // Knowledge bases service
            bases: {
                list: function (modifiable) {
                    return {
                        exec: function (success, failure) {
                            requests.quickRequest(text.urlConcat(root, (new String()).concat('bases', '?modifiable=', modifiable)), 'GET', success, failure);
                        }
                    }
                }
            },


            base: function (kb) {
                return {
                    entities: {
                        classes: {
                            //GET http://example.com/{base}/entities/classes?query=Cit&limit=20
                            query: searchRequest(kb, 'classes'),

                            //POST http://example.com/{base}/entities/classes
                            update: proposeRequest(kb, 'classes')
                        },
                        resources: {
                            //GET http://example.com/{base}/entities/resources?query=Pra&limit=20
                            query: searchRequest(kb, 'resources'),

                            //POST http://example.com/{base}/entities/resources
                            update: proposeRequest(kb, 'resources')
                        },
                        properties: {
                            //GET http://example.com/{base}/entities/properties?query=cap&limit=20
                            query: searchRequest(kb, 'properties'),

                            //POST http://example.com/{base}/entities/properties
                            update: proposeRequest(kb, 'properties')
                        }
                    }
                };
            }
        };
    };
});