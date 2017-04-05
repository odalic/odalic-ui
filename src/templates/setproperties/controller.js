(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Create a controller for task-creation screen
    app.controller('odalic-setproperties-ctrl', function ($scope, $routeParams, rest, formsval, reporth, persist) {

        // TODO: loadico pre kblist

        // Initialize
        formsval.toScope($scope);
        $scope.alerts = [];
        $scope.confirm = {};
        $scope.dataload = {};

        // Are we editing an existing definition, or creating a new one?
        $scope.edited = $routeParams['spid'];
        $scope.editing = !!$scope.edited;

        // Variables
        $scope.pageVariables = {
            name: new String(),
            labelPredicates: [],
            descPredicates: [{
                id: 0,
                value: 'http://dbpedia.org/ontology/abstract'
            }],
            instanceofPredicates: [{
                id: 0,
                value: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
            }],
            classTypes: [{
                id: 0,
                value: 'http://www.w3.org/2000/01/rdf-schema#Class'
            }, {
                id: 1,
                value: 'http://www.w3.org/2002/07/owl#Class'
            }],
            propertiesTypes: [{
                id: 0,
                value: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'
            }, {
                id: 1,
                value: 'http://www.w3.org/2002/07/owl#DatatypeProperty'
            }, {
                id: 2,
                value: 'http://www.w3.org/2002/07/owl#ObjectProperty'
            }]
        };

        // Cancel
        $scope.cancel = function () {
            // Was this page accessed from kbconfig?
            if (!persist.context.contains('kbconfig')) {
                window.location.href = text.urlConcat('#', 'kblist');
                return;
            }

            // Redirect back to KB definition
            window.location.href = text.urlConcat('#', 'kbconfig', text.safe(persist.context.get('kbconfig').routeParam));
        };

        // Save
        $scope.save = function (f) {
            // Validate the form
            if (!formsval.validateNonNested($scope.setPropertiesForm)) {
                f();
                return;
            }

            // Generic preparations
            var spID = $scope.pageVariables.name;

            // Editing
            if ($scope.editing) {
                // rest.tasks.name(spID).exec(
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
                    // rest.tasks.name(taskId).create($scope.getTaskObject()).exec(
                    //     // Success
                    //     function (response) {
                    //         // Redirect
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
                // rest.tasks.name(spID).exists(
                //     function () {
                //         $scope.confirm.open(function (response) {
                //             if (response === true) {
                //                 create();
                //             } else {
                //                 f();
                //
                //                 // Clicking outside of the modal is not registered by angular, but clicking on the modal button is => manually call digest cycle if necessary
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
                $scope.dataload.show = true;
            };

            // Option 1: Creating  a new definition
            if (!$scope.editing) {
                afterLoad();
            }
            // Option 2: Editing an existing definition
            else {
                // rest.kbs.name(kbID).exec(
                //     // Success
                //     function (response) {
                //         $scope.pageVariables = objhelp.objCopy(response);
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

        })();

    });

})();