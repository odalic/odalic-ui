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
                currentRelation: '=',
                knowledgeBase: '@',
                currentLock:'='
            },


            templateUrl: currentFolder + 'rselectbox.html',
            link: function ($scope, iElement, iAttrs) {

                $scope.switchRelation = function (newSelection, knowledgeBase) {
                    $scope.currentRelation.chosen[knowledgeBase] = [newSelection];
                    $scope.gvdata.mc();
                };

                $scope.lockRelation = function () {
                    $scope.currentLock();
                    $scope.gvdata.update();
                };
            }
        }
    });

})();
