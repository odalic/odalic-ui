(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Pagination directive, simplifying a usage of the bootstrap-ui pagination.
     *
     *  Usage:
     *      <span ng-repeat="word in myobj.getView()">
     *          {{ word }}
     *      </span>
     *      <pagination bind="myobj" />
     *
     *      $scope.myobj.model = ["Hi", "this", "is", "an", "array", "of", "words"];
     *      $scope.myobj.perPage = 3;
     *
     *      // Will show only 'words' (counted from 0)
     *      $scope.myobj.setPage(2);
     *
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
                var data = scope.bind.model;
                var perPage = scope.bind.perPage;
                var pages = Math.floor(data.length / perPage) + (data.length % perPage == 0 ? 0 : 1);

                // Pagination data
                scope.pgn = {
                    // Model (index shifted by 1)
                    current: 1,

                    // Amount of pages (e.g.: 90 = 9, 91 = 10, 89 = 9, etc.)
                    total: pages * 10,

                    // Amount of 'buttons'
                    size: 4,

                    // On change
                    changed: function() {
                        // Empty so far...
                    }
                };

                // Public interface
                scope.bind.setPage = function (index) {
                    scope.pgn.current = index + 1;
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