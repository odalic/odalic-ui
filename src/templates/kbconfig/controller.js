(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Current folder
    var currentFolder = $.getPathForRelativePath('');

    // Create a controller for task-creation screen
    app.controller('odalic-kbconfig-ctrl', function ($scope, $routeParams, rest, formsval, reporth, persist, datamap) {

        // Initialization
        $scope.dataload = {};
        $scope.predicateSetsProxy = {};
        $scope.alerts = [];
        $scope.confirm = {};
        $scope.predicateSetsAlerts = [];
        formsval.toScope($scope);

        // Are we editing an existing configuration, or creating a new one?
        $scope.edited = $routeParams['kbid'];
        $scope.editing = !!$scope.edited;

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
            getSelected: function() {
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
            identifier: 'DBpedia',
            description: text.empty(),
            endpoint: text.empty(),
            method: 'fulltext',
            languageTag: 'en',
            skippedAttributes: [{
                id: 0,
                value: 'http://www.w3.org/ns/prov#wasDerivedFrom'
            }, {
                id: 1,
                value: 'http://xmlns.com/foaf/0.1/isPrimaryTopicOf'
            }],
            skippedClasses: [{
                id: 0,
                value: 'http://www.w3.org/2002/07/owl#Thing'
            }, {
                id: 1,
                value: 'http://www.w3.org/2004/02/skos/core#Concept'
            }, {
                id: 2,
                value: 'http://www.opengis.net/gml/_Feature'
            }],
            predicateSets: [],
            insertEnabled: false,
            insertGraph: 'http://odalic.eu/',
            userClassesPrefix: 'http://odalic.eu/schema',
            userResourcePrefix: 'http://odalic.eu/resource',
            login: text.empty(),
            password: text.empty(),
            type: 'sparql',
            keyValuePairs: [{
                key: 'eu.odalic.default.class',
                value: 'http://www.w3.org/2002/07/owl#Thing',
                comment: 'The top of the class hierarchy.'
            }]
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
                ['type', 'advancedType'],
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

        // Save state
        var saveState = function () {
            var context = persist.context.create('kbconfig');
            context.routeParam = $scope.edited;
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
                scope.$broadcast('pagination');
            });
        };

        // Add to predicate sets
        $scope.psAdd = function () {
            // Save state
            saveState();

            // Redirect to the corresponding screen
            window.location.href = '#/setproperties/';
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
            var kbID = $scope.pageVariables.name;

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

        // Data loading
        (function () {
            // Additional actions once all the data is loaded
            var afterLoad = function () {
                persist.context.remove('kbconfig');
                $scope.dataload.show = true;
            };

            // Load the data to table of "Predicate and Class Groups"
            $scope.predicateSets.load(function () {
                // Gather data
                var hasContext = persist.context.contains('kbconfig');
                var context = objhelp.getFirstArg(persist.context.get('kbconfig'), {});
                var routeParam = $scope.edited;

                // Option 1: the page was already visited and has a saved state
                if (hasContext && (context.routeParam === routeParam)) {
                    // Load data from the saved state
                    $scope.pageVariables = objhelp.objCopy(context.pageVariables, 0);
                    $scope.predicateSets.setSelected(context.predicateSetsVariables);
                    afterLoad();
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
                    afterLoad();
                }
            });
        })();

    });

})();