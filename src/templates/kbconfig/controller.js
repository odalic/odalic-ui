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
            name: text.empty(),
            description: text.empty(),
            sparqlEndpoint: text.empty(),
            type: 'dbpedia',
            cachePath: text.empty(),
            stoplistPath: text.empty(),
            fulltextMode: 'nofulltext',
            languageSuffix: text.empty(),
            classTypeMode: 'direct',
            instanceOfPred: text.empty(),
            domainPred: text.empty(),
            rangePred: text.empty(),
            selectMode: 'autodetect',
            insertEnabled: false,
            insertGraph: text.empty(),
            schemaPrefix: text.empty(),
            resourcePrefix: text.empty(),
            defaultClass: text.empty(),
            labelPred: text.empty(),
            altLabelPred: text.empty(),
            subclassOfPred: text.empty(),
            subpropertyOfPred: text.empty(),
            subpropertyOfPred: text.empty(),
            propertyType: text.empty(),
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

        // Predicate sets initialization
        $scope.predicateSets = [];

        // Configure a predicate set
        $scope.fconfigure = function (psID) {
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
            var context = persist.context.create('kbconfig');
            context.routeParam = $scope.edited;
            context.pageVariables = objhelp.objCopy($scope.pageVariables, 0);
            context.predicateSetsVariables = $scope.predicateSetsVariables.getSelected();

            // Redirect to the corresponding screen
            window.location.href = '#/setproperties/';
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
                    // rest.kbs.name(kbID).exec(
                    //     // Success
                    //     function (response) {
                    //         $scope.pageVariables = objhelp.objCopy(response, 0);
                    //         afterLoad();
                    //     },
                    //
                    //     // Failure
                    //     function (response) {
                    //         $scope.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.loadFailure'], response.data));
                    //         afterLoad();
                    //     }
                    // );
                }
                // Option 3: we are creating a completely new knowledge base configuration
                else {
                    afterLoad();
                }
            });
        })();

    });

})();