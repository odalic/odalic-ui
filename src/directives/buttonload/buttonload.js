(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Button with loading icon directive.
     *
     *  Usage:
     *      <button-load button-class="btn" action="myaction" disabled="myvar">Execute</button-load>
     *
     *      // The action has to accept the future!
     *      $scope.myaction = function(f) {
     *          // Lengthy calculations...
     *          ...
     *
     *          // On finish the future has to be called
     *          f();
     *      };
     *
     *      // Disabled? (Must be set!)
     *      $scope.myvar = false;
     *
     *  Note that for styling the directive should be wrapped around an element with form-group class.
     *
     */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('buttonLoad', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'buttonload.html',
            transclude: true,
            scope: {
                action: '=',
                disabled: '=',
                buttonClass: '@'
            },
            link: function (scope, iElement, iAttrs) {

                // Initialization
                scope.dataload = {};
                scope.dataload.show = true;

                // Button action
                scope.buttonClick = function () {
                    // Show loading icon
                    scope.dataload.show = false;

                    // Outer action accepting our future
                    scope['action'](function () {
                        scope.dataload.show = true;
                    });
                };
            }
        }
    });

})();