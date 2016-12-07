(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Require directive.
     *
     *  Usage:
     *  <require src="myscript.js">
     *      Wrapped content
     *  </require>
     *
     *  Loads a requested script and displays the wrapped content afterwards.
     *  Note that if used in multiple places, the script is loaded multiple times.
     *
     */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('require', function ($compile) {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'require.html',
            transclude: true,
            scope: { /* Separated scope */ },
            link: function (scope, iElement, iAttrs) {

                // Wait before load...
                scope.loaded = false;

                // Load the requested resource
                $.getScript(iAttrs['src'], function () {
                    scope.loaded = true;
                });

            }
        }
    });

})();