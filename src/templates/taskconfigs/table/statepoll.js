var currentFolder = $.getPathForRelativePath('');

// Deals with the table updates,specifically tasks' state polling
var statepollComponent = function (scope, rest) {

    $.getScriptSync(currentFolder + '../poller/poller.js', function () {});
    var poller = pollerComponent(rest);

    return {
        setPolling: function () {
            var mirror = {};

            for (var i = 0; i < scope.taskconfigs.length; ++i) {
                (function (j) {
                    var task = scope.taskconfigs[j];

                    // Add to 'mirror'
                    mirror[task.id] = j;

                    // Track only the tasks that are running
                    if (task.state === rest.tasks.states.running) {
                        poller.watch(task.id);
                    }
                })(i);
            }

            poller.beginTracking(3000, function (taskId, state) {
                scope.taskconfigs[mirror[taskId]].state = state;
                // TODO: It must propagate to table. $apply?

                if (state !== rest.tasks.states.running) {
                    poller.unwatch(taskId);
                }
            });
        },

        watch: function (taskId) {
            poller.watch(taskId);
        }
    };

};
