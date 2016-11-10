// Deals with the table updates with an exception of state polling
var tableComponent = function (scope, rest, reporting) {

    var mirror = {};
    var updateMirror = function () {
        mirror = {};

        for (var i = 0; i < scope.taskconfigs.length; ++i) {
            (function (j) {
                var task = scope.taskconfigs[j];

                // Add to 'mirror'
                mirror[task.id] = j;
            })(i);
        }
    };

    return {
        refreshList: function (callback) {
            rest.tasks.list.exec(
                // Success
                function (response) {
                    scope.taskconfigs = response;
                    updateMirror();

                    if (callback) {
                        callback();
                    }
                },
                // Error
                function (response) {
                    scope.taskconfigs = [];
                    mirror = {};
                }
            );
        },

        removeRecord: function (taskId, callback) {
            if (taskId in mirror) {
                scope.taskconfigs.splice(mirror[taskId], 1);
                updateMirror();

                if (callback) {
                    callback();
                }
            }
        },

        updateRecord: function (taskId, callback) {
            if (taskId in mirror) {
                rest.tasks.name(taskId).state.retrieve.exec(
                    function (response) {
                        scope.taskconfigs[mirror[taskId]].state = response;

                        if (callback) {
                            callback();
                        }
                    },

                    // Error
                    function (response) {
                        reporting.error(response);
                    }
                );
            }
        },

    };

};