(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** shortstr
     *  Description:
     *      Filter for shortening strings using 'text.dotted' function.
     *
     *  Usage:
     *      # Example 1: Display only 20 characters of a given string
     *      {{ very_long_string | shortstr: 20 }}
     *
     *  Arguments:
     *      length
     *      - Amount of characters from the given string to display. If less than 5 is specified, '...' is returned
     *      (regardless of the number specified).
     */
    app.filter('shortstr', function () {
        return function (item, props) {
            if (props >= 5) {
                return text.dotted(item, props);
            } else {
                return '...';
            }
        };
    });

})();