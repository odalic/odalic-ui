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
                                    requests.quickRequest(text.urlConcat(root, 'bases', kb, 'entities', type) + '?query=' + string + '&limit=' + countLimit, 'GET', success, failure);
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
                            address: text.urlConcat(root, 'bases', kb, 'entities', type),
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
            // Users service
            users: {
                /** Provides methods for handling a specific single user.
                 *
                 * @param identifier    A user's username string (e-mail).
                 */
                name: function (identifier) {
                    return {
                        /** Creates a new user. After thet, the user has to be 'confirmed' before being able to log into the system.
                         *
                         * @param data      Profile data in JSON, e.g.: { "password": "********" }
                         */
                        create: function (data) {
                            return {
                                exec: function (success, failure) {
                                    requests.reqJSON({
                                        method: 'POST',
                                        address: text.urlConcat(root, 'users'),
                                        formData: {
                                            email: objhelp.getFirstArg(identifier, data.email),
                                            password: data.password
                                        },
                                        success: success,
                                        failure: failure
                                    });
                                }
                            };
                        },

                        /** Logs user. Server responds with an issued token, if authorized.
                         *
                         *  @param password     The user's password.
                         */
                        log: function (password) {
                            return {
                                exec: function (success, failure) {
                                    requests.reqJSON({
                                        method: 'POST',
                                        address: text.urlConcat(root, 'users', 'authentications'),
                                        formData: {
                                            email: identifier,
                                            password: password
                                        },
                                        success: success,
                                        failure: failure
                                    });
                                }
                            };
                        },
                        password: {
                            replace: function (passwordOld, passwordNew) {
                                return {
                                    exec: function (success, failure) {
                                        requests.reqJSON({
                                            method: 'PUT',
                                            address: text.urlConcat(root, 'users', identifier, 'password'),
                                            formData: {
                                                oldPassword: passwordOld,
                                                newPassword: passwordNew
                                            },
                                            success: success,
                                            failure: failure
                                        });
                                    }
                                };
                            }
                        },

                        /** Retrieves current user's profile data. */
                        retrieve: {
                            exec: function (success, failure) {
                                requests.reqJSON({
                                    method: 'GET',
                                    address: text.urlConcat(root, 'users', identifier),
                                    formData: undefined,
                                    success: success,
                                    failure: failure
                                });
                            }
                        }
                    };
                },

                /** Confirms creation of a new user.
                 *
                 *  @param token    A string token. Usually provided by a user who got it in an e-mail.
                 */
                confirm: function (token) {
                    return {
                        exec: function (success, failure) {
                            requests.reqJSON({
                                method: 'POST',
                                address: text.urlConcat(root, 'users', 'confirmations'),
                                formData: {
                                    token: token
                                },
                                success: success,
                                failure: failure
                            });
                        }
                    };
                },
                password: {
                    /** Confirms password change.
                     *  Note that previously issued authentication tokens are invalidated after successful password change.
                     *
                     *  @param token    A string token. Usually provided by a user who got it in an e-mail.
                     */
                    confirm: function (token) {
                        return {
                            exec: function (success, failure) {
                                requests.reqJSON({
                                    method: 'POST',
                                    address: text.urlConcat(root, 'users', 'passwords', 'confirmations'),
                                    formData: {
                                        token: token
                                    },
                                    success: success,
                                    failure: failure
                                });
                            }
                        };
                    },
                },

                test: {
                    custom: {
                        exec: function (valid, expired, failure) {
                            // Test 3 times before proclaiming failure
                            var tryno = 0;
                            var tryfn = function () {
                                // Test with fake file listing request, which is protected
                                requests.pureRequest(text.urlConcat(root, 'files'), 'GET', valid, function (response) {
                                    if (response.status === 401) {
                                        expired(response);
                                    } else if (++tryno < 3) {
                                        tryfn();
                                    } else {
                                        failure(response);
                                    }
                                });
                            };
                            tryfn();
                        }
                    },

                    automatic: {
                        exec: function (success) {
                            requests.quickRequest(text.urlConcat(root, 'files'), 'GET', success, objhelp.emptyFunction);
                        }
                    }
                },

                /** Lists all available users.
                 *  May be called only by an administrator.
                 */
                list: {
                    exec: function (success, failure) {
                        requests.quickRequest(text.urlConcat(root, 'users'), 'GET', success, failure);
                    }
                }
            },

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
                                requests.quickRequest(text.urlConcat(root, 'files', identifier), 'DELETE', success, failure, 'application/json');
                            }
                        },
                        retrieve: {
                            exec: function (success, failure) {
                                requests.pureRequest(text.urlConcat(root, 'files', identifier), 'GET', success, failure, 'text/csv');
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
                        },
                        exists: function (yes, no) {
                            // Use get-file-configuration request for finding out whether the file exists or not
                            requests.reqJSON({
                                method: 'GET',
                                address: text.urlConcat(root, 'files', identifier, 'format'),
                                success: yes,
                                failure: no
                            });
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
                                requests.quickRequest(text.urlConcat(root, 'tasks', identifier), 'GET', success, failure, 'application/json');
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
                                    requests.quickRequest(text.urlConcat(root, 'tasks', identifier, 'configuration', 'feedback', 'input'), 'GET', success, failure, 'application/json');
                                }
                            }
                        },
                        result: {
                            retrieve: {
                                exec: function (success, failure) {
                                    requests.quickRequest(text.urlConcat(root, 'tasks', identifier, 'result'), 'GET', success, failure, 'application/json');
                                }
                            },
                            export: {
                                json: {
                                    address: function () {
                                        return text.urlConcat(root, 'tasks', identifier, 'result', 'annotated-table');
                                    },
                                    exec: function (success, failure) {
                                        requests.pureRequest(text.urlConcat(root, 'tasks', identifier, 'result', 'annotated-table'), 'GET', success, failure);
                                    }
                                },
                                csv: {
                                    address: function () {
                                        return text.urlConcat(root, 'tasks', identifier, 'result', 'csv-export');
                                    },
                                    exec: function (success, failure) {
                                        requests.pureRequest(text.urlConcat(root, 'tasks', identifier, 'result', 'csv-export'), 'GET', success, failure);
                                    }
                                },
                                turtle: {
                                    address: function () {
                                        return text.urlConcat(root, 'tasks', identifier, 'result', 'rdf-export', 'turtle');
                                    },
                                    exec: function (success, failure) {
                                        requests.pureRequest(text.urlConcat(root, 'tasks', identifier, 'result', 'rdf-export'), 'GET', success, failure, 'text/turtle');
                                    }
                                },
                                jsonld: {
                                    address: function () {
                                        return text.urlConcat(root, 'tasks', identifier, 'result', 'rdf-export', 'json-ld');
                                    },
                                    exec: function (success, failure) {
                                        requests.pureRequest(text.urlConcat(root, 'tasks', identifier, 'result', 'rdf-export'), 'GET', success, failure, 'application/ld+json', 'application/ld+json');
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
                                    requests.quickRequest(text.urlConcat(root, 'tasks', identifier, 'configuration', 'feedback'), 'GET', success, failure, 'application/json');
                                }
                            }
                        },
                        configuration: {
                            retrieve: {
                                exec: function (success, failure) {
                                    requests.pureRequest(text.urlConcat(root, 'tasks', identifier), 'GET', success, failure, 'text/turtle');
                                }
                            },
                            import: function (data) {
                                return {
                                    exec: function (success, failure) {
                                        requests.quickRequest(text.urlConcat(root, 'tasks', identifier), 'PUT', success, failure, 'application/json', 'text/turtle', data);
                                    }
                                }
                            }
                        },
                        exists: function (yes, no) {
                            // Use get-task-configuration request for finding out whether the task exists or not
                            requests.quickRequest(text.urlConcat(root, 'tasks', identifier), 'GET', yes, no, 'application/json');
                        }
                    };
                },
                list: {
                    exec: function (success, failure) {
                        requests.quickRequest(text.urlConcat(root, 'tasks') + '?states=true&orderedBy=created', 'GET', success, failure);
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
