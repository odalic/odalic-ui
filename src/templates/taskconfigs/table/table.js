// Deals with the table updates with an exception of state polling
var tableComponent = function (scope, rest, reporth) {

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
    
    // Supporting functions
    scope.table = {
        getPrimaryKB: function (taskconfig) {
            return taskconfig.configuration.primaryBase.name;
        },

        getNonPrimaryKBs: function (taskconfig) {
            var config = taskconfig.configuration;
            return objhelp.select(sets.exclusion([config.primaryBase], config.usedBases, function (item) {
                return item.name;
            }), function (item) {
                return item.name
            })
        }
    };

    return {
        refreshList: function (callback) {
            rest.tasks.list.exec(
                // Success
                function (response) {
                    scope.taskconfigs = response;
                    console.log('taskconfigs table: updating taskconfigs scope variable');
                    updateMirror();

                    if (callback) {
                        callback();
                    }

                    if (!scope.$$phase) {
                        console.log('taskconfigs table: scope apply called');
                        scope.$apply();
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

                    // Error while updating the task
                    function (response) {
                        scope.messages.push('error', reporth.constrErrorMsg(scope['msgtxt.taskdataFailure'], response.data));
                    }
                );
            }
        },

    };

};