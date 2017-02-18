(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** alert
     *  Description:
     *      A simplification of bootstrap's alerts.
     *      Serves mostly visual purpose (i.e. displaying messages to a user) with (optional) possibility to be closed.
     *
     *  Usage:
     *      # Example 1
     *      - template -
     *      <alert bind="myvar" type="neutral">Hooray!</alert>
     *
     *      - controller -
     *      $scope.myvar = {
     *          // function called upon a user closing the alert
     *          close: function() {
     *            $scope.myvar.visible = false;
     *          }
     *      };
     *
     *
     *      # Example 2
     *      - template -
     *      <!-- this alert may not be closed -->
     *      <alert bind="myvar" closable="false" type="success">Hooray!</alert>
     *
     *      - controller -
     *      // the alert still needs to be initialized due to the nature how it works
     *      $scope.myvar = {};
     *
     *
     *      # Example 3
     *      - template -
     *      <alert bind="myvar">Hooray!</alert>
     *
     *      - controller -
     *      // initialize to hidden
     *      $scope.myvar = {
     *          type: 'success',
     *          visible: 'false'
     *      };
     *
     *      // on certain event (e.g. mapped to a button click) display the alert
     *      $scope.myevent = function() {
     *          $scope.myvar.visible = true;
     *      }
     *
     *  Arguments:
     *      bind
     *      - An object on scope. May be empty, but has to be defined.
     *      Properties:
     *          - type (get/set): equivalent to 'type' argument
     *          - visible (get/set): whether is the alert currently visible, or not; by default set to true
     *          - close (set): a function, if provided, will be called upon a user closing the alert, if not, a default
     *          close action is taken instead (which simply sets 'visible' to false)
     *
     *      type (optional)
     *      - A type of the alert (affects color scheme of the alert). May be 'neutral', 'success', 'error' or
     *      'warning'.
     *
     *      closable (optional)
     *      - If provided and set to false, the alert is not closable by a user.
     */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('alert', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'alert.html',
            scope: {
                bind: '='
            },
            transclude: true,
            link: function (scope, iElement, iAttrs) {
                // Initialize
                var defaults = {
                    type: 'neutral',
                    visible: true
                };
                objhelp.objForEach(defaults, function (key, value) {
                    if (!(key in scope.bind)) {
                        scope.bind[key] = value;
                    }
                });

                // Attribute type present in HTML?
                if ('type' in iAttrs) {
                    scope.bind.type = iAttrs['type'];
                }

                // Closable?
                scope.closable = true;
                var closable = 'closable';
                if ((closable in iAttrs) && (iAttrs[closable] === 'false')) {
                    scope.closable = false;
                }

                // Type of the alert
                var mapping = {
                    neutral: 'alert-info',
                    success: 'alert-success',
                    error: 'alert-danger',
                    warning: 'alert-warning'
                };
                scope.type = function () {
                    return mapping[scope.bind.type];
                };

                // Closing the alert
                scope.hide = function () {
                    if (scope.bind.close) {
                        scope.bind.close();
                    } else {
                        scope.bind.visible = !scope.bind.visible;
                    }
                };
            }
        }
    });

})();