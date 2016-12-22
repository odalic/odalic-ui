(function () {

    // Main module
    var app = angular.module('odalic-app');

    //displays selectboxes for classifications/disambiguations
    var currentFolder = $.getPathForRelativePath('');
    app.directive('cDSelecting', function () {
        return {
            restrict: 'E',
            scope: {
                selectedPosition: '=',
                locked: '=',
                primaryKB: '@',
                result: '=',
                openModal: '='
            },
            templateUrl: currentFolder + 'cdselecting.html',
            link: function ($scope, iElement, iAttrs) {

                //returns a correct data for select boxes
                $scope.data = function() {
                    if ($scope.selectedPosition.row == -1) {
                        return $scope.result.headerAnnotations[$scope.selectedPosition.column]
                    }
                    else {
                        return $scope.result.cellAnnotations[$scope.selectedPosition.row][$scope.selectedPosition.column]
                    }
                }
            }
        }
    });

})();