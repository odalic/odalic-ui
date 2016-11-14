(function () {

    // Main module
    var app = angular.module('odalic-app');

    // lock directive
    var currentFolder = $.getPathForRelativePath('');
    app.directive('modalHead', function () {
        return {
            transclude : true,
            restrict: 'E',
            templateUrl: currentFolder + 'modalHead.html',
            link: function (scope, iElement, iAttrs) {

                scope.row = scope.$eval(iAttrs.row);
                scope.rowIndex = scope.$eval(iAttrs.rowIndex);
                scope.data = scope.$eval(iAttrs.data);
                // attrs.$observe('data', function(data) {
                //     scope.data = data;
                // });

                scope.selectPosition = function (row, column) {

                    scope.selectedPosition.column = column;
                    scope.selectedPosition.row = row;
                };


            }
        }
    });

})();