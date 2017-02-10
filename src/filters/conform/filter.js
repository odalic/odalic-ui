(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Filter for making a given string 'conform' to given characters.
     *  Note the syntax similar as in regular expressions.
     *
     *  Usage:
     *      {{ 'my_string' | conform:'a-zA-Z' }}
     *      Results in: 'mystring'
     *
     *  Note the filter is not very optimized. Not suitable for long strings!
     */
    app.filter('conform', function () {
        return function (item, allowed) {
            // Construct a regular expression
            var r = new RegExp((new String()).concat('^[', allowed, ']$'));

            // Construct new string
            var result = new String();
            for (var i = 0; i < item.length; i++) {
                var c = item.charAt(i);
                if (r.test(c)) {
                    result += c;
                }
            }

            return result;
        };
    });

})();