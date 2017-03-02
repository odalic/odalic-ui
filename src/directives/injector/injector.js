(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** injector
     *  Description:
     *      Injects a string into a variable on a current scope.
     *
     *  Usage:
     *      # Example 1
     *      - template -
     *      <injector for="myval">Hello, world!</injector>
     *
     *      - controller -
     *      // prints "Hello, world!"
     *      console.log($scope.myval);
     *
     *  Arguments:
     *      for
     *      - A name of a variable on a current scope to inject the string into.
     */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('injector', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'injector.html',
            transclude: true,
            link: function (scope, iElement, iAttrs) {
                var name = 'for';
                if (name in iAttrs) {
                    scope[iAttrs[name]] = $(iElement.get(0).childNodes[0].childNodes[0]).html();
                } else {
                    throw new Error('injector directive: nothing to inject the text for; no variable specified.');
                }
                $(iElement.get(0)).hide();
            }
        }
    });

})();