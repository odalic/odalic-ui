(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Current folder
    var currentFolder = $.getPathForRelativePath('');

    // Create a controller for task-creation screen
    app.controller('odalic-kbconfig-ctrl', function ($scope, $uibModal, $routeParams, filedata, rest, formsval, reporth) {

        // TODO: buttons v ramci table na predicate sets mozu vyhodit vynimku
        // TODO: ukladanie dat (prechod medzi predsets config - zrejme pouzit chain, kedze len 2 obrazovky)
        // TODO: pokial je v route zadana sucasna kb
        // TODO: pokial je v route propertySets zadana sucasna PS

        // Initialization
        $scope.predicateSetsProxy = {};
        $scope.alerts = [];
        $scope.confirm = {};
        $scope.predicateSetsAlerts = [];
        formsval.toScope($scope);

        // Data mapping
        $scope.pageVariables = {
            name: new String(),
            description: new String(),
            sparqlEndpoint: new String(),
            type: 'dbpedia',
            cachePath: new String(),
            stoplistPath: new String(),
            fulltextMode: 'nofulltext',
            languageSuffix: new String(),
            classTypeMode: 'direct',
            instanceOfPred: new String(),
            domainPred: new String(),
            rangePred: new String(),
            selectMode: 'autodetect',
            get predicateSets() {
                var ps = [];
                $scope.predicateSets.forEach(function (record) {
                    if (record.selected) {
                        ps.push(record);
                    }
                });

                return ps;
            },
            insertEnabled: false,
            insertGraph: new String(),
            schemaPrefix: new String(),
            resourcePrefix: new String(),
            defaultClass: new String(),
            labelPred: new String(),
            altLabelPred: new String(),
            subclassOfPred: new String(),
            subpropertyOfPred: new String(),
            subpropertyOfPred: new String(),
            propertyType: new String(),
        };

        // Load predicate sets
        var loadPredicateSets = function () {
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
        };

        // Predicate sets initialization
        $scope.predicateSets = [];
        loadPredicateSets();

        // Configure a predicate set
        $scope.fconfigure = function (psID) {
            window.location.href = text.urlConcat('#', 'setproperties', psID);
        };

        // Remove a predicate set
        $scope.fremove = function (psID) {
            // TODO: Remove
            loadPredicateSets();
        };

        // Add to predicate sets
        $scope.psAdd = function () {
            // TODO: Save current state
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

            // Creation
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
            var response = { data: { payload: { text: "This is only a DEMO." } } };
            $scope.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.saveFailure'], response.data));
            f();
        };

    });

})();