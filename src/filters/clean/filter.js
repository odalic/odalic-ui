(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Filter for cleaning blacklisted characters from a given string.
     *
     * Usage:
     *      {{ 'mystring' | clean:'sri' }}
     *      Results in: 'mytng'
     *
     */
    app.filter('clean', function () {
        return function (item, blacklist) {
            // Check for consistency
            if (!blacklist) {
                return item;
            }

            // Create hashtable from blacklisted characters
            var blacklisted = {};
            for (var i = 0; i < blacklist.length; i++) {
                var c = blacklist.charAt(i);
                blacklisted[c] = true;
            }

            // Construct new string
            var result = new String();
            for (var i = 0; i < item.length; i++) {
                var c = item.charAt(i);
                if (!(c in blacklisted)) {
                    result += c;
                }
            }

            return result;
        };
    });

})();