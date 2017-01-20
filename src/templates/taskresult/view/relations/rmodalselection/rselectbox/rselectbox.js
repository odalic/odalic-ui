(function () {

    // Main module
    var app = angular.module('odalic-app');

    // lock directive
    var currentFolder = $.getPathForRelativePath('');
    app.directive('rSelectBox', function () {
        return {

            restrict: 'E',
            scope:
            {
                gvdata:'=',
                selectedRelation: '=',
                locked: '=',
                knowledgeBase: '@',
                result: '='
            },


            templateUrl: currentFolder + 'rselectbox.html',
            link: function ($scope, iElement, iAttrs) {

                $scope.switchRelation = function (newSelection, knowledgeBase) {
                    $scope.result.columnRelationAnnotations[$scope.selectedRelation.column1][$scope.selectedRelation.column2].chosen[knowledgeBase] = [newSelection];
                    $scope.gvdata.mc();
                };

                $scope.lockRelation = function () {
                    $scope.locked.graphEdges[$scope.selectedRelation.column1][$scope.selectedRelation.column2] = 1;
                    $scope.gvdata.update();
                };
            }
        }
    });

})();