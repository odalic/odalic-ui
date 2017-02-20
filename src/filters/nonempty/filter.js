(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** nonempty
     *  Description:
     *      A filter for 'decorating' non-empty text.
     *      This is useful when dealing with separators, but it is not yet known whether one will be needed, since the
     *      string to be separated may be empty, as demonstrated by an example:
     *
     *      <!-- item2 may be empty, so the comma may not be needed after all -->
     *      {{ item1 }}, {{ item2 }}
     *
     *  Usage:
     *      # Example 1: Separation of two strings
     *      first{{ maybe_string | nonempty:', ' }}
     *
     *      # Example 2: Decorated string from both sides
     *      {{ maybe_string | nonempty:'before':'after' }}
     *
     *  Arguments:
     *      before
     *      - A string to prepend the string with if the given string is not empty.
     *
     *      append
     *      - A string to put after the given string if the given string is not empty.
     */
    app.filter('nonempty', function () {
        return function (item, pre, post) {
            if (item && (item.length > 0)) {
                return (new String()).concat(text.safe(pre), item, text.safe(post));
            }
        };
    });

})();