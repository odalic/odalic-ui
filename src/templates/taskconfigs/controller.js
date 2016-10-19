(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Create a controller for taskconfigs
    var currentFolder = $.getPathForRelativePath('');
    app.controller('odalic-taskconfigs-ctrl', function ($scope, rest, $window) {

        // Dealing with the table
        $.getScriptSync(currentFolder + 'table/table.js', function () {});
        var table = tableComponent($scope, rest);

        // Dealing with the state updates
        $.getScriptSync(currentFolder + 'table/statepoll.js', function () {});
        var statepoll = statepollComponent($scope, rest);

        // Initialize
        $scope.taskconfigs = [];
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
                    // Ignored
                }
            );
        };

        $scope.frerun = function (taskId) {
            // TODO: No rest method for the function
        };

        $scope.fstop = function (taskId) {
            rest.tasks.name(taskId).stop.exec(
                // Execution stopped successfully
                function (response) {
                    table.updateRecord(taskId);
                },
                // Error while stopping the execution
                function (response) {
                    // Ignored.
                }
            );
        };

        $scope.fresult = function (taskId) {
            // TODO:
        };

        $scope.fclear = function (taskId) {
            // TODO: No rest method for the function
        };

        $scope.fconfigure = function (taskId) {
            $window.location.href = "#/createnewtask/" + taskId;
        };

        $scope.fremove = function (taskId) {
            rest.tasks.name(taskId).remove.exec(
                // Task removal finished successfully
                function (response) {
                    table.removeRecord(taskId);
                },
                // Error while removing the task
                function (response) {
                    // Ignored.
                }
            );
        };

        // TODO: Automatically cancel polling when the page is changed. Use persist service?
        // TODO: Task configs /taskId, by malo nacitat data o danom tasku (jeho konfiguraciu).
        // TODO: Prechod na taskresult. Tu je to komplikovanejsie; navrhujem, aby taskresult screen prijimal v ramci path argument taskId a podla toho sa nacitali data. Zaroven by sa tam vyriesilo, ze pokial je dany task este running, tak to skonci s chybou.
    });

})();