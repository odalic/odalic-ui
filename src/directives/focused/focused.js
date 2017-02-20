(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** focused
     *  Description:
     *      Sets focus to a control in which it is used.
     *
     *  Usage:
     *      # Example 1
     *      - template -
     *      <input type="text" focused/>
     *
     *  Arguments:
     *      none
     */
    app.directive('focused', function () {
        return {
            restrict: 'A',
            scope: {},
            link: function (scope, iElement, iAttrs) {
                iElement[0].focus();
            }
        }
    });

})();