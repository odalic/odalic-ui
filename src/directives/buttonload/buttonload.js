(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** button-load
     *  Description:
     *      A button which changes to spinner icon upon a click.
     *      Serves for visual representation of long operations. Once the executed operation finishes, the button may
     *      be changed back to normal.
     *
     *  Usage:
     *      # Example 1
     *      - template -
     *      <button-load button-class="btn odalic-cursor-pointer" action="myaction" disabled="false">Start</button-load>
     *
     *      - controller -
     *      $scope.myaction = function(f) {
     *          // Lengthy calculations...
     *          ...
     *
     *          // When finished we change button back to normal
     *          f();
     *      };
     *
     *
     *      # Example 2
     *      - template -
     *      <!-- acting as submit -->
     *      <form ng-submit="myobj.submit()">
     *          <button-load action="myaction" disabled="false" bind="myobj" button-type="submit">Submit</button-load>
     *      </form>
     *
     *      - controller -
     *      // initialize bind object
     *      $cope.myobj = {};
     *
     *      // action same as before
     *      $scope.myaction = function(f) {
     *          // Lengthy calculations...
     *          ...
     *
     *          // When finished we change button back to normal
     *          f();
     *      };
     *
     *  Arguments:
     *      button-class (optional)
     *      - Classes applied on the button (styling).
     *
     *      disabled
     *      - An expression evaluated on a current scope. Controls whether the button is disabled or not.
     *
     *      action
     *      - A function accepting a function as its first argument. The function should be called once a long operation
     *      finished to change the button back to normal (from spinner icon to which it was changed upon a first click).
     *
     *      bind (optional)
     *      - An object on scope. Has to be defined (as empty) when this argument is provided. It is automatically
     *      filled by the directive so it can be used e.g. by ng-submit directive for submitting forms. Note when using
     *      for submitting forms, button-type argument should be set to "submit".
     *      Functions:
     *          - submit(): if the button is not in 'spinner' state, calls 'action' and puts the button into 'spinner'
     *          state
     *
     *      button-type (optional)
     *      - Type of the button (e.g. submit). By default type is set to 'button'.
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