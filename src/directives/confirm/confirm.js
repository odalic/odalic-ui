(function () {

    // Main module
    var app = angular.module('odalic-app');

    /* Confirmation modal.
     * Usage:
     *      <confirm bind="myobj" title="Title" />
     *
     *      scope.myobj = {};
     *      ...
     *
     *      // opens the modal
     *      scope.myobj.open(function (response) {
     *          // called back upon modal close
     *      });
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