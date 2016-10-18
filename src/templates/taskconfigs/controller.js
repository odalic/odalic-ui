(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Create a controller for taskconfigs
    var currentFolder = $.getPathForRelativePath('');
    app.controller('odalic-taskconfigs-ctrl', function ($scope, ioc, rest) {

        // Initialize variables with empty values
        $scope.taskconfigs = [];

        // Polling the tasks' states
        $.getScriptSync(currentFolder + 'poller/poller.js', function () {});
        var poller = pollerComponent(rest);
        var setPolling = function () {
            var mirror = {};

            for (var i = 0; i < $scope.taskconfigs.length; ++i) {
                (function (j) {
                    var task = $scope.taskconfigs[j];

                    // Add to 'mirror'
                    mirror[task.id] = j;

                    // Track only the tasks that are running
                    if (task.status === 'running') {
                        poller.watch(task.id);
                    }
                })(i);
            }

            poller.beginTracking(3000, function (taskId, state) {
                $scope.taskconfigs[mirror[taskId]].status = state;
                // TODO: It must propagate to table. $apply?

                if (state !== 'running') {
                    poller.unwatch(taskId);
                }
            });
        };
        // TODO: Automatically cancel polling when the page is changed. Use persist service?
        // TODO: When a task changes to 'running', start tracking it.

        // TODO list (additional tasks):
        // - start a task
        // - when a task finishes, a result must be retrievable by cliking on an icon
        // - redirect to task configuration (and load data)
        // - remove a task and update the list visually (may be done by a simple JS - just remove a row)
        // - functionality: rerun, clear the result (buttons)

        // Load data to table
        var loader = ioc['taskconfigs/loader'](rest);
        loader.getTasks(
            function(data) {
                $scope.taskconfigs = data;
                setPolling();
            },
            function (response) {
                throw new Error('Unexpected error while loading the task configurations.');
            }
        );
    });

})();