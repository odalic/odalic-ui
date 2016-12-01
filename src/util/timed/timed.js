var timed = {
    /** Calls a user-defined function once a given condition returns true.
     *  This method should be used for scenarios like testing whether a certain object is defined.
     *  Polling a state is an example of 'anti-usage' of the method.
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
    }
};