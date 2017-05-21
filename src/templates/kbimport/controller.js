(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Create a controller for knowledge base import screen
    app.controller('odalic-kbimport-ctrl', function ($scope, filedata, rest, formsval, reporth) {

        // Initialization
        formsval.toScope($scope);
        $scope.confirm = {};

        // Form controls
        $scope.kbImport = {
            alerts: {},
            identifier: new String(),

            // Button "import" action
            import: function (f, callback) {
                // Validate
                if (!formsval.validate($scope.kbImportForm)) {
                    f();
                    return;
                }

                // Prepare
                var kbID = $scope.kbImport.identifier;

                // Send REST request for the import
                var process = function () {
                    rest.bases.name(kbID).import(filedata.fileObject('concreteFile')).exec(
                        // Success
                        function (response) {
                            // Don't handle if further action was specified
                            if (callback) {
                                callback();
                                return;
                            }

                            // Import successful, redirect to the knowledge base configurations screen
                            window.location.href = text.urlConcat('#/kblist/');
                        },

                        // Failure
                        function (response) {
                            $scope.kbImport.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.createFailure'], response.data));
                            f();
                        }
                    );
                };

                // Insert the configuration, if everything is OK
                rest.bases.name(kbID).exists(
                    // The configuration with the same name already exists => confirm overwrite
                    function () {
                        $scope.confirm.open(function (response) {
                            if (response === true) {
                                process();
                            } else {
                                f();
                                // Clicking outside of the modal is not registered by angular, but clicking on the modal button is => manually call digest cycle if necessary
                                if (!$scope.$$phase) {
                                    $scope.$apply();
                                }
                            }
                        });
                    },
                    // The configuration does not exist yet => create without any prompt
                    process
                );
            }
        };

        // Redirect to login screen if not logged
        rest.users.test.automatic.exec(objhelp.emptyFunction);

    });

})();