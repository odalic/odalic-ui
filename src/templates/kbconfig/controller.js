(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Current folder
    var currentFolder = $.getPathForRelativePath('');

    // Create a controller for task-creation screen
    app.controller('odalic-kbconfig-ctrl', function ($scope, $location, $routeParams, rest, formsval, reporth, persist, datamap) {

        // Initialization
        $scope.dataload = {};
        $scope.predicateSetsProxy = {};
        $scope.alerts = [];
        $scope.confirm = {};
        $scope.predicateSetsAlerts = [];
        $scope.modalEmptyEndpoint = {};
        $scope.active = 0;
        formsval.toScope($scope);

        // Are we editing an existing configuration, or creating a new one?
        $scope.edited = $routeParams['kbid'];
        $scope.editing = !!$scope.edited;
        $scope.cloning = false;
        if ($scope.editing) {
            // Maybe we are just cloning an existing configuration?
            var urlParts = $location.absUrl().split('/');
            if (urlParts[urlParts.length - 2] === 'clone') {
                $scope.editing = false;
                $scope.cloning = true;
            }
        }

        // Predicate sets
        $scope.predicateSets = {
            data: [],
            load: function (callback) {
                rest.pcg.list.all().exec(
                    // Success
                    function (response) {
                        // Copy the data
                        $scope.predicateSets.data = response;

                        // Update pagination directive
                        $scope.predicateSetsProxy.model = $scope.predicateSets.data;
                        $scope.$broadcast('pagination');

                        // Callback
                        objhelp.callDefined(callback);
                    },
                    // Failure
                    function (response) {
                        $scope.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.loadFailure'], response.data));
                    }
                );
            },
            getIndex: function (psID) {
                var data = $scope.predicateSets.data;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].id === psID) {
                        return i;
                    }
                }

                return -1;
            },
            remove: function (psID, callback) {
                rest.pcg.name(psID).remove.exec(
                    // Success
                    function (response) {
                        // Remove from the array
                        var ps = $scope.predicateSets;
                        ps.data.splice(ps.getIndex(psID), 1);

                        // Callback
                        objhelp.callDefined(callback);
                    },
                    // Failure
                    function (response) {
                        $scope.predicateSetsAlerts.push('error', reporth.constrErrorMsg($scope['msgtxt.removeFailure'], response.data));
                    }
                );
            },
            getSelected: function () {
                var ps = [];
                $scope.predicateSets.data.forEach(function (item) {
                    if (item.selected === true) {
                        ps.push(item.id);
                    }
                });

                return ps;
            },
            setSelected: function (idArray) {
                // Fill a data structure for easing the search
                var selected = {};
                idArray.forEach(function (item) {
                    selected[item] = true;
                });

                // Set 'selected' property
                $scope.predicateSets.data.forEach(function (item) {
                    item.selected = !!(item.id in selected);
                });
            }
        };

        // Page variables
        $scope.pageVariables = {
            identifier: text.empty(),
            description: text.empty(),
            endpoint: text.empty(),
            method: 'fulltext',
            languageTag: 'en',
            skippedAttributes: [],
            skippedClasses: [],
            predicateSets: [],
            insertEnabled: false,
            insertGraph: text.empty(),
            userClassesPrefix: text.empty(),
            userResourcePrefix: text.empty(),
            login: text.empty(),
            password: text.empty(),
            type: {},
            keyValuePairs: []
        };

        // Data mapping
        var mapper = (function () {
            var mapFromList = function (item, index) {
                return item.value;
            };
            var mapToList = function (item, index) {
                return {
                    id: index,
                    value: item
                };
            };

            return datamap.create([
                ['identifier', 'name'],
                ['description', 'description'],
                ['endpoint', 'endpoint'],
                ['method', 'textSearchingMethod'],
                ['languageTag', 'languageTag'],
                ['skippedAttributes', 'skippedAttributes', mapFromList, mapToList],
                ['skippedClasses', 'skippedClasses', mapFromList, mapToList],
                ['insertEnabled', 'insertEnabled'],
                ['insertGraph', 'insertGraph'],
                ['userClassesPrefix', 'userClassesPrefix'],
                ['userResourcePrefix', 'userResourcesPrefix'],
                //['login', 'login'],
                //['password', 'password'],

                // Selected predicate sets
                ['predicateSets', 'selectedGroups', '1->2', function (object1) {
                    return $scope.predicateSets.getSelected();
                }],
                ['predicateSets', 'selectedGroups', '2->1', function (object2) {
                    $scope.predicateSets.setSelected(object2);
                    return $scope.predicateSets.data;
                }],

                // Type
                ['type', 'advancedType', '1->2', function (object1) {
                    return object1.name;
                }],
                ['type', 'advancedType', '2->1', function (object2) {
                    var kv = $scope.keyValues;
                    return kv.data[kv.getIndex(object2)];
                }],

                // Custom key-value pairs
                ['keyValuePairs', 'advancedProperties', '1->2', function (object1) {
                    var object2 = {};
                    object1.forEach(function (item) {
                        object2[item.key] = item.value;
                    });

                    return object2;
                }],
                ['keyValuePairs', 'advancedProperties', '2->1', function (object2) {
                    var object1 = [];
                    objhelp.objForEach(object2, function (key, value) {
                        object1.push({
                            key: key,
                            value: value,
                            comment: text.empty()
                        });
                    });

                    return object1;
                }]
            ]);
        })();

        // Key-values
        $scope.keyValues = {
            data: [],
            load: function (callback) {
                rest.abt.list.exec(
                    // Success
                    function (response) {
                        // Copy the data
                        $scope.keyValues.data = response;

                        // Callback
                        objhelp.callDefined(callback);
                    },
                    // Failure
                    function (response) {
                        $scope.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.loadFailure'], response.data));
                    }
                );
            },
            getIndex: function (name) {
                var data = $scope.keyValues.data;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].name === name) {
                        return i;
                    }
                }

                return -1;
            }
        };

        // Save state
        var saveState = function () {
            var context = persist.context.create('kbconfig');
            context.routeParam = $scope.edited;
            context.wasCloning = $scope.cloning;
            context.pageVariables = objhelp.objCopy($scope.pageVariables, 0);
            context.predicateSetsVariables = $scope.predicateSets.getSelected();
        };

        // Open an end-point URL
        $scope.fopenEndPoint = function () {
            window.open($scope.pageVariables.endpoint);
        };

        // Configure a predicate set
        $scope.fconfigure = function (psID) {
            // Save state
            saveState();

            // Redirect to the corresponding screen
            window.location.href = text.urlConcat('#', 'setproperties', psID);
        };

        // Remove a predicate set
        $scope.fremove = function (psID) {
            $scope.predicateSets.remove(psID, function () {
                // Update pagination directive
                $scope.$broadcast('pagination');
            });
        };

        // Add to predicate sets
        $scope.psAdd = function () {
            // Save state
            saveState();

            // Redirect to the corresponding screen
            window.location.href = '#/setproperties/';
        };

        // Autodetection
        $scope.psAutodetect = function (f) {
            var endpoint = $scope.pageVariables.endpoint;

            // Endpoint set?
            if (endpoint) {
                rest.pcg.list.endpoint(endpoint).exec(
                    // Success
                    function (response) {
                        // Construct the array of "set predicates"
                        var ps = [];
                        response.forEach(function (item) {
                            ps.push(item.id);
                        });

                        // Set selected
                        $scope.predicateSets.setSelected(ps);
                        f();
                    },
                    // Failure
                    function (response) {
                        $scope.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.autodetectFailure'], response.data));
                        f();
                    }
                );
            }
            // Endpoint not set => warn the user
            else {
                $scope.modalEmptyEndpoint.open();
                f();
            }
        };

        // Fill key-values table with default data
        $scope.kvFill = function () {
            var pv = $scope.pageVariables;
            var type = pv.type;

            var result = [];
            type.keys.forEach(function (key) {
                result.push({
                    key: key,
                    value: text.safe(type.keysToDefaultValues[key]),
                    comment: text.safe(type.keysToComments[key])
                });
            });

            pv.keyValuePairs = result;
        };

        // Add to key-values
        $scope.kvAdd = function () {
            $scope.pageVariables.keyValuePairs.push({
                key: text.empty(),
                value: text.empty(),
                comment: text.empty()
            });
        };

        // Remove from key-values
        $scope.kvRemove = function (record) {
            var kvp = $scope.pageVariables.keyValuePairs;
            kvp.splice(kvp.indexOf(record), 1);
        };

        // Cancel
        $scope.cancel = function () {
            window.location.href = '#/kblist/';
        };

        // Save
        $scope.save = function (f) {
            // Validate the form
            if (!formsval.validateNonNested($scope.kbConfigForm)) {
                f();
                return;
            }

            // Generic preparations
            var kbID = $scope.pageVariables.identifier;

            // Editing
            if ($scope.editing) {
                rest.bases.name(kbID).create(mapper.mapToObject2($scope.pageVariables)).exec(
                    // Success
                    function (response) {
                        $scope.cancel();
                    },
                    // Failure
                    function (response) {
                        $scope.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.saveFailure'], response.data));
                        f();
                    }
                );
            }
            // Creating
            else {
                var create = function () {
                    rest.bases.name(kbID).create(mapper.mapToObject2($scope.pageVariables)).exec(
                        // Success
                        function (response) {
                            $scope.cancel();
                        },
                        // Failure
                        function (response) {
                            $scope.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.saveFailure'], response.data));
                            f();
                        }
                    );
                };

                // Handle overwrites
                rest.bases.name(kbID).exists(
                    function () {
                        $scope.confirm.open(function (response) {
                            if (response === true) {
                                create();
                            } else {
                                f();
                                if (!$scope.$$phase) {
                                    $scope.$apply();
                                }
                            }
                        });
                    },
                    create
                );
            }
        };

        // Firefox password pre-fill 'bugfix' (or hack)
        $scope.changeToPassword = (function() {
            var changed = false;

            return function () {
                if (!changed) {
                    var element = document.getElementsByName('kbcpassword')[0];
                    element.type = 'password';
                    changed = true;
                }
            };
        })();

        // Data loading
        (function () {
            // Additional actions once all the data is loaded
            var afterLoad = function () {
                persist.context.remove('kbconfig');
                $scope.dataload.show = true;
            };

            // Load the data to table of "Predicate and Class Groups"
            $scope.predicateSets.load(function () {

            // Load the data for 'advanced type' combobox
            $scope.keyValues.load(function () {

                // Gather data
                var hasContext = persist.context.contains('kbconfig');
                var context = objhelp.getFirstArg(persist.context.get('kbconfig'), {});
                var routeParam = $scope.edited;

                // Option 1: the page was already visited and has a saved state
                if (hasContext && (context.routeParam === routeParam)) {
                    // Load data from the saved state
                    $scope.pageVariables = objhelp.objCopy(context.pageVariables, 0);
                    $scope.predicateSets.setSelected(context.predicateSetsVariables);

                    // Special case: selected type (cannot copy an object; must be an object reference for ng-options)
                    var kv = $scope.keyValues;
                    $scope.pageVariables.type = kv.data[kv.getIndex($scope.pageVariables.type.name)];

                    // Change the active tab to 'Search'
                    $scope.active = 1;

                    // Everything loaded and set
                    afterLoad();

                    // Scroll to the bottom of the page once DOM is loaded
                    // Yes, I know this is ugly, but it gets the job done - in JS there is only 1 thread, so after
                    // angular performs its digest cycle, the following is immediately called due to call order
                    window.setTimeout(function () {
                        window.scrollTo(0, document.body.scrollHeight);
                    }, 1);
                }
                // Option 2: we are editing an existing knowledge base configuration
                else if (routeParam) {
                    // Load data from the server
                    var kbID = routeParam;
                    rest.bases.name(kbID).retrieve.exec(
                        // Success
                        function (response) {
                            // Load data
                            $scope.pageVariables = mapper.mapToObject1(response);

                            // Everything loaded
                            afterLoad();
                        },

                        // Failure
                        function (response) {
                            $scope.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.loadFailure'], response.data));
                            afterLoad();
                        }
                    );
                }
                // Option 3: we are creating a completely new knowledge base configuration
                else {
                    // Special case: selected type default to first type
                    $scope.pageVariables.type = $scope.keyValues.data[0];

                    afterLoad();
                }

            })});
        })();

        // Redirect to login screen if not logged
        rest.users.test.automatic.exec(objhelp.emptyFunction);

    });

})();