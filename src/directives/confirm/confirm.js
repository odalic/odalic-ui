(function () {

    // Main module
    var app = angular.module('odalic-app');

    /* confirm
     * Description:
     *      Represents a confirmation modal window (acting as a yes/no dialog).
     *      A user may answer by using 'accept' or 'reject' buttons.
     *      If user clicks outside the modal, or uses 'x' button in the upper-right corner, the answer is assumed as if
     *      'reject' button was clicked.
     *
     * Usage:
     *      # Example 1
     *      - template -
     *      <confirm bind="myobj" title="Title">Is it nice outside?</confirm>
     *
     *      - controller -
     *      // initialize
     *      scope.myobj = {};
     *
     *      // on certain event open the modal
     *      $scope.myevent = function() {
     *          // opens the modal
     *          scope.myobj.open(function (response) {
     *              if (response) {
     *                  console.log('A user answered yes');
     *              } else {
     *                  console.log('A user answered no');
     *              }
     *          });
     *      };
     *
     * Arguments:
     *      title
     *      - A headline of the modal window.
     *
     *      bind
     *      - An object on scope. Has to be defined (as empty) and is filled by functions automatically.
     *      Functions:
     *         - open(callback): opens the modal; upon closing the modal 'callback' function is called automatically
     *         (with either true or false passed argument, depending on a user's choice)
     */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('confirm', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'confirm.html',
            transclude: true,
            scope: {
                title: '@',
                bind: '='
            },
            link: function (scope, iElement, iAttrs) {

                // Initialization
                var callbackCalled = false;
                var callback = null;

                // The element
                var modElem = $(iElement.get(0).childNodes[0]);

                // Closing the modal (via provided buttons)
                scope.close = function (state) {
                    modElem.modal('hide');
                    objhelp.callDefined(callback, state);
                    callbackCalled = true;
                };

                // Opening the modal (via public interface)
                scope.bind['open'] = function (f) {
                    callbackCalled = false;
                    callback = f;
                    modElem.modal();
                };

                // On modal close
                modElem.on('hidden.bs.modal', function () {
                    // For the case the modal is closed by other means than using the provided buttons
                    if (!callbackCalled) {
                        objhelp.callDefined(callback, false);
                    }
                    callbackCalled = true;
                });

            }
        }
    });

})();