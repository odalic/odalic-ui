(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Create a controller for ngtest
    var currentFolder = $.getPathForRelativePath('');
    app.controller('odalic-ngtest-ctrl', function ($scope) {

        $scope.xx = {
            // model
            bigCurrentPage: 1,

            // max pages; (here: 90)
            bigTotalItems: 9 * 10,

            // amount of clickable buttons
            maxSize: 4,

            // on change
            pageChanged: function() {
                console.log('Page changed to: ' + this.bigCurrentPage);
            }
        };

        // ...so the paging component stays as it is
        // ...the displaying component will have to have ng-repeat set to a range determined by the paging component

        var allItems = [];
        var rng = 3; // 3 items per 'page'
        for (var i = 1; i <= 9*rng; i++) {
            allItems.push('Item #' + i);
        }

        $scope.getItems = function () {
            var index = $scope.xx.bigCurrentPage;

            // paging model -- starts with index 1, so shift it
            // we want to display exactly 3 items
            var indexStart = (index - 1) * rng;
            return allItems.slice(indexStart, indexStart + rng);
        };

    });

})();