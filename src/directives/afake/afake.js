(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** a-fake
     *  Description:
     *      Fake hyperlink element.
     *      Serves for downloading resources via AJAX (i.e. asynchronous) requests, which is not natively supported by
     *      browsers.
     *      Upon clicking the element, a spinner is displayed until the request is responded to. If a successful response
     *      is obtained, the resource may be downloaded as if clicked on an ordinary hyperlink.
     *
     *  Usage:
     *      # Example 1
     *      - template -
     *      <a-fake ajax="myajax" catcher="myerror" type="text/csv">Download</a-fake>
     *
     *      - controller -
     *      // ajax function must accept success and failure functions (only) and has to return the resource in successful case
     *      $scope.myajax = function (s, f) {
     *          rest.tasks.name(identifier).result.export.csv.exec(s, f);
     *      };
     *
     *      // catcher function should accept "response" parameter
     *      $scope.myerror = function (r) {
     *          console.error(r.data);
     *      };
     *
     *
     *      # Example 2
     *      - template -
     *      <!-- additional arguments may be provided to the ajax function via 'args' -->
     *      <a-fake ajax="myajax" args="'mytask'" type="text/csv">Download</a-fake>
     *
     *      - controller -
     *      $scope.myajax = function (s, f, arg) {
     *          rest.tasks.name(arg).result.export.csv.exec(s, f);
     *      };
     *
     *  Arguments:
     *      ajax
     *      - A function accepting 'success' and 'failure' functions as its parameters (futures), also optionally a
     *      third argument when using 'args' attribute. Note the function has to return a resource in the successful
     *      case of the same type as set in 'type' argument.
     *
     *      type
     *      - MIME type of the response in a successful case of the 'ajax' function
     *
     *      catcher
     *      - An error function if the 'ajax' function fails. A default handler for 'failure' case is provided by the
     *      a-fake directive itself (this is necessary to clean up certain resources), but for additional handling
     *      (such as displaying error message to a user) this may be used.
     *
     *      args (optional)
     *      - A third argument passed to the 'ajax' function. The 'args' parameter is evaluated on a current scope.
     *      (i.e. strings need to be put in apostrophes, etc.)
     */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('aFake', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'afake.html',
            transclude: true,
            scope: {
                ajax: '=',
                catcher: '=',
                args: '='
            },
            link: function (scope, iElement, iAttrs) {

                // Initialization
                scope.clicked = false;

                // On hyperlink click
                scope.handle = function () {
                    // Set loading icon
                    scope.clicked = true;

                    // Load the file
                    scope.ajax(
                        // Success
                        function (response) {
                            // Using HTML5 file API we create 'fake' URL to open
                            var windowUrl = window.URL || window.webkitURL;
                            var blob = new Blob([response.data], {
                                type: iAttrs['type']
                            });
                            var url = windowUrl.createObjectURL(blob);
                            window.open(url);
                            windowUrl.revokeObjectURL(url);

                            // Unset loading icon
                            scope.clicked = false;
                        },

                        // Failure
                        function (response) {
                            // Call failure function if passed
                            if (scope.catcher) {
                                scope.catcher(response);
                            }

                            // Unset loading icon
                            scope.clicked = false;
                        },

                        // Additional arguments
                        scope.args
                    );
                };

            }
        }
    });

})();