/** Support time-based functions */
var timed = {
    /** Calls a user-defined function once a given condition returns true.
     *  This method should be used for scenarios like testing whether a certain object is defined, if the object takes
     *  longer to initialize.
     *
     * @param cnd   A condition to evaluate (function returning boolean).
     * @param f     A function to call once the condition returns true.
     */
    ready: function (cnd, f) {
        var delay = 128;

        var ff = function () {
            if (cnd()) {
                f();
            } else {
                delay *= 2;
                window.setTimeout(ff, delay);
            }
        };

        ff();
    },

    /** Calls a user-defined function once the digest cycle completes.
     *  This is not an accurate function and should be used with caution.
     *
     *  Our understanding of the angular's digest cycle is that it takes place in a 'background worker'.
     *  JavaScript, however, only allows for 1 thread running concurrently, which means that planning
     *  a function for a 'background worker' makes it execute only after all of the previously planned functions
     *  for the 'background worker' have been already handled.
     *  Note the 'background worker' is a term used not accurately in this scenario, since this is a simple
     *  JavaScript timeout function, but the behaviour is rather similar.
     *
     * @param handler The function to execute once the digest cycle completes.
     */
    executeAfterDigest: function (handler) {
        window.setTimeout(function () {
            handler();
        }, 1);
    },

    /** Calls the angular digest cycle if possible.
     *
     * @param scope The current angular scope.
     */
    digest: function (scope) {
        if (!scope.$root.$$phase) {
            scope.$apply();
        }
    },

    /** Calls the angular digest cycle twice.
     *  Should be used with extra caution.
     *
     *  Why? In very rare cases, digest cycle may 'omit' visual changes and DOM manipulations even though
     *  corresponding model variables have been already updated. This usually happens when inside of a loop of updates.
     *
     * @param scope The current angular scope.
     */
    strongDigest: function (scope) {
        if (!scope.$root.$$phase) {
            scope.$apply();
        }
        window.setTimeout(function () {
            scope.$apply();
        }, 1);
    }
};