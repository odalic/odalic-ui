(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Create a controller for task-creation screen
    app.controller('odalic-setproperties-ctrl', function ($scope, $routeParams, rest, formsval, reporth, persist, datamap) {

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
            name: text.empty(),
            labelPredicates: [],
            descPredicates: [],
            instanceofPredicates: [],
            classTypes: [],
            propertiesTypes: []
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
                ['name', 'id'],
                ['labelPredicates', 'labelPredicates', mapFromList, mapToList],
                ['descPredicates', 'descriptionPredicates', mapFromList, mapToList],
                ['instanceofPredicates', 'instanceOfPredicates', mapFromList, mapToList],
                ['classTypes', 'classTypes', mapFromList, mapToList],
                ['propertiesTypes', 'propertyTypes', mapFromList, mapToList]
            ]);
        })();

        // Cancel
        $scope.cancel = function () {
            // Was this page accessed from kbconfig?
            if (!persist.context.contains('kbconfig')) {
                window.location.href = text.urlConcat('#', 'kblist');
                return;
            }

            // Redirect back to KB definition
            var context = persist.context.get('kbconfig');
            if (context.wasCloning) {
                window.location.href = text.urlConcat('#', 'kbconfig', 'clone', text.safe(context.routeParam));
            } else {
                window.location.href = text.urlConcat('#', 'kbconfig', text.safe(context.routeParam));
            }
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
                rest.pcg.name(spID).create(mapper.mapToObject2($scope.pageVariables)).exec(
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
                    rest.pcg.name(spID).create(mapper.mapToObject2($scope.pageVariables)).exec(
                        // Success
                        function (response) {
                            // Redirect
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
                rest.pcg.name(spID).exists(
                    function () {
                        $scope.confirm.open(function (response) {
                            if (response === true) {
                                create();
                            } else {
                                f();

                                // Clicking outside of the modal is not registered by angular, but clicking on the modal button is => manually call digest cycle if necessary
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
                $scope.dataload.show = true;
            };

            // Option 1: Creating  a new definition
            if (!$scope.editing) {
                afterLoad();
            }
            // Option 2: Editing an existing definition
            else {
                // Load the data
                rest.pcg.name($scope.edited).retrieve.exec(
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
        })();

        // Redirect to login screen if not logged
        rest.users.test.automatic.exec(objhelp.emptyFunction);

    });

})();