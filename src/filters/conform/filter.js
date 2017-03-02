(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** conform
     *  Description:
     *      A filter for making a given string 'conform' to given characters, i.e. removes characters from the given
     *      string that are not allowed (what characters are allowed is specified by a second given string).
     *
     *  Usage:
     *      # Example 1: Allow only alphas
     *      - template -
     *      <!-- results in: 'mystring' -->
     *      {{ 'my_string' | conform:'a-zA-Z' }}
     *
     *
     *      # Example 2: Allow only hyphen (-), space and numbers
     *      this.identifier =  $filter('conform')(name, '-0-9 ');
     *
     *  Arguments:
     *      allowed
     *      - Enumerated allowed characters, or using a range ('0-9'). Note if hyphen is allowed, it needs to be at the
     *      beginning of the string.
     *
     *  Remarks:
     *      - The filter is not very optimized. Not suitable for very long strings.
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