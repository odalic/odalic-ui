(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** AJAX Spinner */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('ajaxSpinner', function (reporth) {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'ajaxspinner.html',
            transclude: true,
            scope: {
                bind: '=',
                callback: '=',
                size: '@',
                idleIcon: '@'
            },
            link: function (scope, iElement, iAttrs) {

                // Initialization
                scope.loading = false;
                scope.failure = false;
                scope.failureMessage = text.empty();
                var index = 0;

                // Public API
                scope.bind = {
                    /** Pushes a new ajax function.
                     *  Only the last ajax call will be handled.
                     *
                     * @param ajax An ajax function accepting 'success' and 'failure' functions as its arguments.
                     */
                    set: function (ajax) {
                        // Prepare
                        scope.loading = true;
                        var myIndex = (++index);

                        // Call the AJAX function
                        ajax(
                            // Success
                            function (response) {
                                // Was loading not canceled by the user and are we the last?
                                if ((scope.loading) && (myIndex == index)) {
                                    scope.loading = false;
                                    scope.callback(response);
                                }
                            },

                            // Error
                            function (response) {
                                // Was loading not canceled by the user and are we the last?
                                if ((scope.loading) && (myIndex == index)) {
                                    scope.failure = true;
                                    scope.loading = false;
                                    scope.failureMessage = reporth.constrErrorMsg('An error occurred.', response.data);

                                    // Clear the warning icon in 3 seconds
                                    window.setTimeout(function () {
                                        // Is this the last ajax function call? Not to clear the error icon too soon.
                                        if (myIndex == index) {
                                            scope.failure = false;
                                        }
                                    }, 3000);
                                }
                            }
                        );
                    },

                    /** Unsets the pushed ajax functions from handling.
                     */
                    clear: function () {
                        scope.loading = false;
                        scope.failure = false;
                    }
                }

            }
        }
    });

})();