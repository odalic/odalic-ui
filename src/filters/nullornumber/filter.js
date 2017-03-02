(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** null-or-number
     *  Description:
     *      Returns an empty string if the given string is null, or a number using built-in angular 'number' filter.
     */
    app.filter('nullOrNumber', function ($filter) {
        return function (input, fractionSize) {
            if (input == null) {
                return "";
            } else {
                return $filter('number')(input, fractionSize);
            }
        };
    });

})();