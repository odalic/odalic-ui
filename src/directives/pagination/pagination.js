(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** pagination
     *  Description:
     *      A wrapper around ui-bootstrap's pagination directive for a simplified usage.
     *
     *  Usage:
     *      # Example 1
     *      - template -
     *      <span ng-repeat="word in myobj.getView()">{{ word }}</span>
     *
     *      <pagination bind="myobj" per-page="3"/>
     *
     *      - controller -
     *      $scope.myobj.model = ["Hi", "this", "is", "an", "array", "of", "words"];
     *
     *      // will show only 'words'
     *      $scope.myobj.setPage(2);
     *
     *  Arguments:
     *      per-page
     *      - Amount of items to be displayed on a single 'page'.
     *
     *      bind
     *      - An object on scope. Has to be defined (may be empty) and is filled by functions and properties automatically.
     *      Properties:
     *          - model (get/set): an array of all items
     *      Functions:
     *          - setPage(index): a 'page' to set the pagination to; counted from 0
     *          - getPage(): returns a current 'page' number
     *          - getPageForIndex(index): returns a page number (counted from 0) on which the item with the
     *          corresponding index would reside
     *          - getView(): returns a subarray of the 'model' consisting only of items corresponding to the current
     *          'page'
     *          - getModelIndex(viewIndex): index of the first item corresponding to the current page in the 'model'
     *          plus 'viewIndex' (e.g. for model ["Hi", "this", "is", "an", "array", "of", "words"] for page 2 and 3
     *          items per page, the index is 6 + 'viewIndex')
     */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('pagination', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'pagination.html',
            scope: {
                bind: '='
            },
            link: function (scope, iElement, iAttrs) {

                // Initialization
                scope.pgn = {};
                var perPage = text.safeInt(iAttrs['perPage'], 100);

                // Default values
                var data = [];
                var pages = 1;

                // Prepare data to use by the pagination directive
                var prepare = function () {
                    // Initialization
                    var _model = scope.bind.model;
                    if (_model) {
                        data = _model;
                        pages = Math.floor(data.length / perPage) + (data.length % perPage == 0 ? 0 : 1);
                    }
                    var current = objhelp.getFirstArg(scope.pgn.current, 1);

                    // Pagination data
                    scope.pgn = {
                        // Model (index shifted by 1)
                        current: current <= pages ? current : current - 1,

                        // Amount of pages (e.g.: 90 = 9, 91 = 10, 89 = 9, etc.)
                        total: pages * 10,

                        // Amount of 'buttons'
                        size: 4,

                        // On change
                        changed: function() {
                            // Empty so far...
                        }
                    };

                    // Additional actions
                    current = scope.pgn.current;
                };

                // Watch for changes
                prepare();
                scope.$watch('bind[model]', function(nv, ov) {
                    prepare();
                });

                // Fallback if watcher fails (only special customized cases)
                scope.$on('pagination', function (event, data) {
                    prepare();
                });

                // Public interface
                scope.bind.setPage = function (index) {
                    scope.pgn.current = index + 1;
                };

                scope.bind.getPage = function () {
                    return scope.pgn.current - 1;
                };

                scope.bind.getPageForIndex = function (index) {
                    return Math.floor(index / perPage);
                };

                scope.bind.getModelIndex = function (viewIndex) {
                    var index = scope.pgn.current - 1;
                    var startIndex = index * perPage;
                    return startIndex + viewIndex;
                };

                scope.bind.getView = function () {
                    var index = scope.pgn.current - 1;
                    var maxIndex = data.length;
                    var startIndex = index * perPage;
                    var endIndex = objhelp.test(startIndex + perPage, maxIndex, (new String).concat('<=', maxIndex));
                    return data.slice(startIndex, endIndex);
                };
            }
        }
    });

})();