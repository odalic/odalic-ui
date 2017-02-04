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
     *  For submitting via enter:
     *      <form ng-submit="myobj.submit()">
     *      ...
     *      <button-load button-class="btn" action="myaction" disabled="myvar" bind="myobj" button-type="submit">Execute</button-load>
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
                bind: '=',
                buttonClass: '@',
                buttonType: '@'
            },
            link: function (scope, iElement, iAttrs) {

                // Initialization
                scope.dataload = {};
                scope.dataload.show = true;
                var setLoading = null;

                // On calling the action
                var actionCall = function () {
                    // Show loading icon
                    scope.dataload.show = false;
                    objhelp.callDefined(setLoading, true);

                    // Outer action accepting our future
                    scope['action'](function () {
                        scope.dataload.show = true;
                        objhelp.callDefined(setLoading, false);
                    });
                };

                // Interface for easing form submission
                if (scope.bind) {
                    // Submit action
                    scope.bind.loading = false;

                    // Define function setLoading
                    setLoading = function (isLoading) {
                        scope.bind.loading = isLoading;
                    };

                    // Public method - the specified action may be called by another event (if not called already)
                    scope.bind.submit = function () {
                        console.log("submit called");
                        if (!scope.bind.loading) {
                            actionCall();
                        }
                    };
                }

                // Button action
                scope.buttonClick = function () {
                    actionCall();
                };

            }
        }
    });

})();