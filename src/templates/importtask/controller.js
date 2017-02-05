(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Create a controller for task import screen
    app.controller('odalic-importtask-ctrl', function ($scope, filedata, rest, formsval, reporth) {

        // Initialization
        formsval.toScope($scope);

        // Form controls
        $scope.taskImport = {
            alerts: {},
            identifier: new String(),

            // Button "import" action
            import: function (f, callback) {
                // Validate
                if (!formsval.validate($scope.taskImportForm)) {
                    f();
                    return;
                }

                // Prepare
                var taskId = $scope.taskImport.identifier;

                // Send REST request for task import
                rest.tasks.name(taskId).configuration.import(filedata.fileObject('concreteFile')).exec(
                    // Success
                    function (response) {
                        // Don't handle if further action was specified
                        if (callback) {
                            callback();
                            return;
                        }

                        // The task has been created, redirect to the task configurations screen
                        window.location.href = text.urlConcat('#/taskconfigs/', taskId);
                    },

                    // Failure
                    function (response) {
                        $scope.taskImport.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.createFailure'], response.data));
                        f();
                    }
                );
            },

            // Button "import and run" action
            importAndRun: function (f) {
                $scope.taskImport.create(f, function () {
                    // Prepare
                    var taskId = $scope.taskImport.identifier;

                    // Start the task
                    rest.tasks.name(taskId).execute.exec(
                        // Execution started successfully
                        function (response) {
                            window.location.href = text.urlConcat('#/taskconfigs/', taskId);
                        },

                        // Error while starting the execution
                        function (response) {
                            $scope.taskImport.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.startFailure'], response.data));
                            f();
                        }
                    );
                });
            }
        };

    });

})();