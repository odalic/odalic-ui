(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Filtering number */
    app.filter('nullOrNumber', function ($filter) {
        return function (input, fractionSize) {
            if (input == null) {
                return new String();
            } else {
                return $filter('number')(input, fractionSize);
            }
        };
    });

})();