// Deals with the table updates with an exception of state polling
var tableComponent = function (scope, rest) {

    var mirror = {};
    var updateMirror = function () {
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
                    callback();
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
                delete mirror[taskId];
                callback();
            }
        },

        updateRecord: function (taskId, callback) {
            if (taskId in mirror) {
                var errorf = function (response) {
                    // Ignored for now.
                };

                rest.tasks.name(taskId).retrieve.exec(
                    // Success
                    function (response) {
                        var tasko = response;
                        rest.tasks.name(taskId).state.retrieve.exec(
                            function (response) {
                                tasko.state = response;
                                scope.taskconfigs[mirror[taskId]] = tasko;
                                callback();
                            },
                            // Error
                            errorf
                        );
                    },
                    // Error
                    errorf
                );
            }
        },

    };

};