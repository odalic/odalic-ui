(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Current folder
    var currentFolder = $.getPathForRelativePath('');

    // Create a controller for task-creation screen
    app.controller('odalic-kbconfig-ctrl', function ($scope, $routeParams, rest, formsval, reporth, persist) {

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

        // Data mapping
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
        $scope.predicateSetsVariables = {
            getSelected: function() {
                var ps = [];
                $scope.predicateSets.forEach(function (record) {
                    if (record.selected) {
                        ps.push(record);
                    }
                });

                return ps;
            },

            setSelected: function(ps) {
                selected = {};
                objhelp.objForEach(ps, function (index, record) {
                    selected[record.name] = true;
                });

                $scope.predicateSets.forEach(function (record) {
                    record.selected = (selected[record.name] === true);
                });
            }
        };

        // Load predicate sets
        var loadPredicateSets = function (callback) {
            // TODO: The placeholder predicate sets is only temporary
            $scope.predicateSets = [];
            for (var i = 0; i < 15; i++) {
                $scope.predicateSets.push({
                    selected: (Math.random()*2 > 1) ? true : false,
                    name: (new String()).concat('PS Name', ' ', i)
                });
            }

            // Update pagination directive
            $scope.predicateSetsProxy.model = $scope.predicateSets;
            $scope.$broadcast('pagination');

            callback();
        };

        // Save state
        var saveState = function () {
            var context = persist.context.create('kbconfig');
            context.routeParam = $scope.edited;
            context.pageVariables = objhelp.objCopy($scope.pageVariables, 0);
            context.predicateSetsVariables = $scope.predicateSetsVariables.getSelected();
        };

        // Open an end-point URL
        $scope.fopenEndPoint = function () {
            window.open($scope.pageVariables.endpoint);
        };

        // Predicate sets initialization
        $scope.predicateSets = [];

        // Configure a predicate set
        $scope.fconfigure = function (psID) {
            // Save state
            saveState();

            // Redirect to the corresponding screen
            window.location.href = text.urlConcat('#', 'setproperties', psID);
        };

        // Remove a predicate set
        $scope.fremove = function (psID) {
            // TODO: The action is only temporary
            var response = { data: { payload: { text: "This is only a DEMO." } } };
            $scope.predicateSetsAlerts.push('error', reporth.constrErrorMsg($scope['msgtxt.removeFailure'], response.data));
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
                // rest.kbs.name(kbID).save().exec(
                //     // Success
                //     function (response) {
                //         $scope.cancel();
                //     },
                //     // Failure
                //     function (response) {
                //         $scope.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.saveFailure'], response.data));
                //         f();
                //     }
                // );

                // TODO: The action is only temporary
                var response = { data: { payload: { text: "(Editing) This is only a DEMO." } } };
                $scope.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.saveFailure'], response.data));
                f();
            }
            // Creating
            else {
                var create = function () {
                    // rest.kbs.name(kbID).create().exec(
                    //     // Success
                    //     function (response) {
                    //         $scope.cancel();
                    //     },
                    //     // Failure
                    //     function (response) {
                    //         $scope.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.saveFailure'], response.data));
                    //         f();
                    //     }
                    // );
                };

                // Handle overwrites
                // rest.kbs.name(kbID).exists(
                //     function () {
                //         $scope.confirm.open(function (response) {
                //             if (response === true) {
                //                 create();
                //             } else {
                //                 f();
                //                 if (!$scope.$$phase) {
                //                     $scope.$apply();
                //                 }
                //             }
                //         });
                //     },
                //     create
                // );

                // TODO: The action is only temporary
                var response = { data: { payload: { text: "(Creation) This is only a DEMO." } } };
                $scope.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.saveFailure'], response.data));
                f();
            }
        };

        // Data loading
        (function () {
            // Additional actions once all the data is loaded
            var afterLoad = function () {
                persist.context.remove('kbconfig');
                $scope.dataload.show = true;
            };

            loadPredicateSets(function () {
                // Gather data
                var hasContext = persist.context.contains('kbconfig');
                var context = objhelp.getFirstArg(persist.context.get('kbconfig'), {});
                var routeParam = $scope.edited;

                // Option 1: the page was already visited and has a saved state
                if (hasContext && (context.routeParam === routeParam)) {
                    // Load data from the saved state
                    $scope.pageVariables = objhelp.objCopy(context.pageVariables, 0);
                    $scope.predicateSetsVariables.setSelected(context.predicateSetsVariables);
                    afterLoad();
                }
                // Option 2: we are editing an existing knowledge base configuration
                else if (routeParam) {
                    // Load data from the server
                    var kbID = routeParam;
                    rest.bases.name(kbID).retrieve.exec(
                        // Success
                        function (response) {
                            // TODO: dokoncit toto (namapuj data)
                            var pv = $scope.pageVariables;

                            pv.identifier = response['name'];
                            pv.endpoint = response['endpoint'];
                            pv.description = response['description'];
                            pv.method = response['textSearchingMethod'];
                            pv.languageTag = response['languageTag'];
                            pv.insertEnabled = response['insertEnabled'];
                            pv.insertGraph = response['insertGraph'];
                            pv.userClassesPrefix = response['userClassesPrefix'];
                            pv.userResourcePrefix = response['userResourcesPrefix'];
                            pv.type = response['advancedType'];

                            // TODO: Not described yet
                            pv.login = response['login'];
                            pv.password = response['password'];

                            // {
                            //     "skippedAttributes": ["http://www.w3.org/ns/prov#wasDerivedFrom", "http://www.w3.org/ns/prov#isDerivedFrom"],
                            //     "skippedClasses": ["http://www.w3.org/2002/07/owl#Thing"],
                            //     "advancedProperties": {
                            //         "eu.odalic.custom.key": "custom value"
                            //     }
                            //
                            //     // PSGroups
                            //     "selectedGroups": ["RDF"],
                            // }
                            //
                            // // Data mapping
                            // $scope.pageVariables = {
                            //     skippedAttributes: [{
                            //         id: 0,
                            //         value: 'http://www.w3.org/ns/prov#wasDerivedFrom'
                            //     }, {
                            //         id: 1,
                            //         value: 'http://xmlns.com/foaf/0.1/isPrimaryTopicOf'
                            //     }],
                            //     skippedClasses: [{
                            //         id: 0,
                            //         value: 'http://www.w3.org/2002/07/owl#Thing'
                            //     }, {
                            //         id: 1,
                            //         value: 'http://www.w3.org/2004/02/skos/core#Concept'
                            //     }, {
                            //         id: 2,
                            //         value: 'http://www.opengis.net/gml/_Feature'
                            //     }],
                            //     keyValuePairs: [{
                            //         key: 'eu.odalic.default.class',
                            //         value: 'http://www.w3.org/2002/07/owl#Thing',
                            //         comment: 'The top of the class hierarchy.'
                            //     }]
                            // };

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