(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Create a controller for taskconfigs
    var currentFolder = $.getPathForRelativePath('');
    app.controller('odalic-taskconfigs-ctrl', function ($scope, $routeParams, rest, persist, reporth) {

        // Dealing with the table
        $.getScriptSync(currentFolder + 'table/table.js', function () {});
        var table = tableComponent($scope, rest, reporth);

        // Dealing with the state updates
        $.getScriptSync(currentFolder + 'table/statepoll.js', function () {});
        var statepoll = statepollComponent($scope, rest, persist);

        // Initialize
        $scope.taskconfigs = [];
        $scope.messages = {};

        // Pagination settings
        $scope.taskconfigsProxy = {
            perPage: 10
        };

        // Load the data into the table
        table.refreshList(statepoll.setPolling);

        // Table button functions
        $scope.frun = function (taskId) {
            rest.tasks.name(taskId).execute.exec(
                // Execution started successfully
                function (response) {
                    table.updateRecord(taskId);
                    statepoll.watch(taskId);
                },
                // Error while starting the execution
                function (response) {
                    $scope.messages.push('error', reporth.constrErrorMsg($scope['msgtxt.startFailure'], response.data));
                }
            );
        };

        $scope.fstop = function (taskId) {
            rest.tasks.name(taskId).stop.exec(
                // Execution stopped successfully
                function (response) {
                    table.updateRecord(taskId);
                },
                // Error while stopping the execution
                function (response) {
                    $scope.messages.push('error', reporth.constrErrorMsg($scope['msgtxt.stopFailure'], response.data));
                }
            );
        };

        $scope.fresult = function (taskId) {
            window.location = '#/taskresult/' + taskId;
        };

        $scope.fdownload = function (s, f, taskId) {
            rest.tasks.name(taskId).configuration.retrieve.exec(s, f);
        };

        $scope.fconfigure = function (taskId) {
            window.location = '#/createnewtask/' + taskId;
        };

        $scope.fremove = function (taskId) {
            rest.tasks.name(taskId).remove.exec(
                // Task removal finished successfully
                function (response) {
                    table.removeRecord(taskId);
                },
                // Error while removing the task
                function (response) {
                    $scope.messages.push('error', reporth.constrErrorMsg($scope['msgtxt.removeFailure'], response.data));
                }
            );
        };

        // Handling configuration download error
        $scope.configderror = function (response) {
            $scope.messages.push('error', reporth.constrErrorMsg($scope['msgtxt.configdFailure'], response.data));
        };

        // Miscellaneous
        $scope.misc = {
            gotocnt: function () {
                window.location.href = '#/createnewtask';
            },

            selected: $routeParams['taskid']
        };
    });

})();