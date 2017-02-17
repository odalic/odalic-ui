(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Injector directive.
     *  Injects a value set in an HTML template into a corresponding controller.
     *  Usage:
     *      <injector for="myval">Hello, world!</injector>
     *
     *      ...
     *      console.log($scope.myval); // Prints "Hello, world!"
     *
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