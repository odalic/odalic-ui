(function () {

    // Main module
    var app = angular.module('odalic-app');

    //displays selectboxes for classifications/disambiguations
    var currentFolder = $.getPathForRelativePath('');
    app.directive('cDCheckBoxes', function () {
        return {
            restrict: 'E',
            scope: {
                selectedPosition: '=',
                locked: '=',
                ignoredColumn: '=',
                noDisambiguationColumn: '=',
                noDisambiguationCell: '=',
            },
            templateUrl: currentFolder + 'cdcheckboxes.html',
            link: function ($scope, iElement, iAttrs) {

                // On checkbox check changed
                $scope.lockCell = function() {
                    $scope.locked.tableCells[$scope.selectedPosition.row][$scope.selectedPosition.column] = 1;
                    console.log($scope.ignoredColumn);
                };
            }
        }
    });

})();