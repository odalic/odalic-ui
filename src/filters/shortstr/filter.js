(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Filter for shortening strings using text.dotted method.
     *  Usage:
     *  {{ 'item' | shortstr: 20 }}
     *  ...where '20' is an exemplar maximal length allowed for the corresponding string 'item'.
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