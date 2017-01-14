var eventbuilder = {
    /** Creates a simple object for different events.
     *  Usage:
     *      var evs = eventbuilder.build(['click', 'hover'])
     *
     *      // Subscribe to click event
     *      var hndl = function() {
     *          alert('Hi!');
     *      };
     *      evs.click.pushHandler(hndl);
     *
     *      // Call the event handlers for click event
     *      evs.click.callHandlers();
     *
     *      // Remove handler
     *      evs.click.removeHandler(hndl);
     *
     *      // Remove all handlers
     *      evs.click.clearHandlers();
     *
     * @param eventNames Array of event names (of strings).
     * @returns {{}}     The object.
     */
    build: function (eventNames) {
        var result = {};
        eventNames.forEach(function (name) {
            if (typeof(name) !== 'string') {
                throw new Error('eventbuilder: event name not a string.');
            }
            
            var handlers = [];
            result[name] = {
                callHandlers: function () {
                    handlers.forEach(function (handler) {
                        handler();
                    });
                },

                clearHandlers: function () {
                    handlers = [];
                },
                
                pushHandler: function (handler) {
                    handlers.push(handler);
                },
                
                removeHandler: function (handler) {
                    var index = handlers.indexOf(handler);
                    if (index != -1) {
                        handlers.splice(index, 1);
                    }
                }
            };
        });

        return result;
    }
};