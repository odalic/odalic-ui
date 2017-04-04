(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Create a controller for task import screen
    app.controller('odalic-kbimport-ctrl', function ($scope, filedata, rest, formsval, reporth) {

        // // Initialization
        // formsval.toScope($scope);
        // $scope.confirm = {};
        //
        // // Form controls
        // $scope.taskImport = {
        //     alerts: {},
        //     identifier: new String(),
        //
        //     // Button "import" action
        //     import: function (f, callback) {
        //         // Validate
        //         if (!formsval.validate($scope.taskImportForm)) {
        //             f();
        //             return;
        //         }
        //
        //         // Prepare
        //         var taskId = $scope.taskImport.identifier;
        //
        //         // Send REST request for task import
        //         var process = function () {
        //             rest.tasks.name(taskId).configuration.import(filedata.fileObject('concreteFile')).exec(
        //                 // Success
        //                 function (response) {
        //                     // Don't handle if further action was specified
        //                     if (callback) {
        //                         callback();
        //                         return;
        //                     }
        //
        //                     // The task has been created, redirect to the task configurations screen
        //                     window.location.href = text.urlConcat('#/taskconfigs/', taskId);
        //                 },
        //
        //                 // Failure
        //                 function (response) {
        //                     $scope.taskImport.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.createFailure'], response.data));
        //                     f();
        //                 }
        //             );
        //         };
        //
        //         // Insert the task, if everything is OK
        //         rest.tasks.name(taskId).exists(
        //             // The task already exists => confirm overwrite
        //             function () {
        //                 $scope.confirm.open(function (response) {
        //                     if (response === true) {
        //                         process();
        //                     } else {
        //                         f();
        //                         // Clicking outside of the modal is not registered by angular, but clicking on the modal button is => manually call digest cycle if necessary
        //                         if (!$scope.$$phase) {
        //                             $scope.$apply();
        //                         }
        //                     }
        //                 });
        //             },
        //             // The task does not exist yet => create without any prompt
        //             process
        //         );
        //     },
        //
        //     // Button "import and run" action
        //     importAndRun: function (f) {
        //         $scope.taskImport.import(f, function () {
        //             // Prepare
        //             var taskId = $scope.taskImport.identifier;
        //
        //             // Start the task
        //             rest.tasks.name(taskId).execute.exec(
        //                 // Execution started successfully
        //                 function (response) {
        //                     window.location.href = text.urlConcat('#/taskconfigs/', taskId);
        //                 },
        //
        //                 // Error while starting the execution
        //                 function (response) {
        //                     $scope.taskImport.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.startFailure'], response.data));
        //                     f();
        //                 }
        //             );
        //         });
        //     }
        // };
        //
        // // Redirect to login screen if not logged
        // rest.users.test.automatic.exec(objhelp.emptyFunction);

    });

})();