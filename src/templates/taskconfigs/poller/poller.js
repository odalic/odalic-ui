var pollerComponent = function (rest) {

    var states = {};
    var tasksnum = 0;
    var handled = null;
    var toadd = [];
    var toremove = [];

    var notifier = null;
    var bgtask = null;

    // Adds tasks from 'toadd' array to 'states'
    var addprepared = function () {
        toadd.forEach(function (item) {
            if ((item in states)) {
                return;
            }

            states[item] = {
                state: null
            };
            tasksnum++;
        });
        toadd = [];
    };

    // Poll for a single task's state and save to the 'states' object
    var pollsingle = function (taskId) {
        // Poll for the specified task's state
        rest.tasks.name(taskId).state.retrieve.exec(
            // Success
            function (response) {
                var state = response;

                // Has the state changed?
                if (states[taskId].state != state) {
                    states[taskId].state = state;

                    // Notify an outsider
                    if (notifier !== null) {
                        notifier(taskId, state);
                    }
                }

                // The task has been handled; are we the last one to be handled?
                if (++handled == tasksnum) {
                    // Handle "ToAdd" tasks
                    addprepared();

                    // Handle "ToRemove" tasks
                    toremove.forEach(function (item) {
                        if (!(item in states)) {
                            return;
                        }
                        delete states[item];
                        tasksnum--;
                    });
                    toremove = [];

                    handled = null;
                }
            },
            // Failure
            function (response) {
                // Ignored.
            }
        );
    };

    // Poll for all of the tasks' states
    var poll = function () {
        // The tasks are still 'handling' from a previous call? => Dismiss.
        if (handled !== null) {
            return;
        }

        // Are there any tasks to handle?
        if (tasksnum === 0) {
            if (toadd.length > 0) {
                addprepared();
            } else {
                return;
            }
        }

        handled = 0;
        objhelp.objForEach(states, function (taskId, obj) {
            pollsingle(taskId);
        });
    };

    return {
        /** Start tracking the specified tasks.
         *
         * @param taskIds Either array of task IDs, or a single task ID.
         */
        watch: function (taskIds) {
            if(Object.prototype.toString.call(taskIds) !== '[object Array]') {
                taskIds = [taskIds];
            }

            taskIds.forEach(function (taskId) {
                if (!(taskId in states)) {
                    toadd.push(taskId);
                }
            });
        },

        /** Stop tracking the specified (single) task.
         *
         * @param taskId A single task id.
         */
        unwatch: function (taskId) {
            if (taskId in states) {
                toremove.push(taskId);
            }
        },

        /** Begins continuous polling of the tasks' states.
         *
         * @param delay         Amount of time in milliseconds between pollings.
         * @param notifcallback Callback function to call when a particular task's state is updated.
         *                      Has to accept 2 parameters: (taskId, state).
         *
         */
        beginTracking: function (delay, notifcallback) {
            notifier = notifcallback;

            bgtaskf = function () {
                poll();
                bgtask = setTimeout(bgtaskf, delay);
            };
            bgtask = setTimeout(bgtaskf, delay);
        },

        /** Stops the continuous polling of the tasks' states.
         *
         */
        endTracking: function () {
            clearTimeout(bgtask);
        }
    };

};