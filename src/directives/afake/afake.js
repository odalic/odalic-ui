(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Fake hyperlink directive.
     *  Usage:
     *      <a-fake ajax="myajax" catcher="myerror" type="text/csv">Download</a-fake>
     *
     *      // ajax function must accept success and failure functions (only) and has to return the resource in successful case
     *      $scope.myajax = function (s, f) {
     *          rest.tasks.name(identifier).result.export.csv.exec(s, f);
     *      };
     *
     *      // catcher function must accept "response" parameter
     *      $scope.myerror = function (r) {
     *          console.error(r.data);
     *      };
     *
     *  Sometimes it may be necessary to provide additional arguments to pass to the ajax function.
     *  It can be done like this:
     *      <a-fake ajax="myajax" args="'mytask'" type="text/csv">Download</a-fake>
     *
     *      $scope.myajax = function (s, f, arg) {
     *          rest.tasks.name(arg).result.export.csv.exec(s, f);
     *      };
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