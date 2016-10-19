var pollerComponent = function (rest) {

    var states = {};
    var tasksnum = 0;
    var handled = null;
    var toadd = [];
    var toremove = [];

    var notifier = null;
    var bgtask = null;

    // Adds tasks from 'toadd' array to 'states'
    var addprepared = function (taskId) {
        toadd.forEach(function (item) {
            if ((item in states)) {
                return;
            }

            states[taskId] = {
                state: null
            };
            tasksnum++;
        });
    };

    // Poll for a single task's state and save to the 'states' object
    var pollsingle = function (taskId) {
        // Poll for the specified task's state
        rest.tasks.name(taskId).state.retrieve.exec(
            // Success
            function (response) {
                var res = response;
                var state = res.state;

                // Has the state changed?
                if (state != states[taskId].state) {
                    states[taskId].state = state;

                    // Notify an outsider
                    if (notifier !== null) {
                        notifier(taskId, state);
                    }
                }

                // The task has been handled; are we the last one to be handled?
                if (++handled == tasksnum) {
                    // Handle "ToAdd" tasks
                    addprepared(taskId);

                    // Handle "ToRemove" tasks
                    toremove.forEach(function (item) {
                        if (!(item in states)) {
                            return;
                        }

                        delete states[taskId];
                        tasksnum--;
                    });

                    handled = null;
                };
            },
            // Failure
            function (response) {
                // Ignored.
            }
        );
    };

    // Poll for all of the tasks' states
    var poll = function () {
        // The tasks are still 'handling' from a previous call; dismiss
        if (handled !== null) {
            return;
        }

        // Are there even any tasks to handle?
        if (tasksnum === 0) {
            if (toadd.length > 0) {
                addprepared();
            } else {
                return;
            }
        }

        handled = 0;
        objForEach(states, function (taskId, obj) {
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
            if(Object.prototype.toString.call(taskIds) !== '[object Array]') {
                throw new Error('Only 1 task may be unwatched at once.');
            }

            if (taskId in states) {
                toremove.push(taskId);
            }
        },

        /** Begins continuous polling of the tasks' states.
         *
         * @param delay         Amount of time in milliseconds between pollings.
         * @param notifcallback Callback function to call when a particular task's state is updated.
         *                      Has to accept 2 parameters: (taskId, state).
         */
        beginTracking: function (delay, notifcallback) {
            notifier = notifcallback;

            bgtask = setTimeout(function () {
                poll();
            }, delay);
        },

        /** Stops the continuous polling of the tasks' states.
         *
         */
        endTracking: function () {
            clearTimeout(bgtask);
        }
    };

};