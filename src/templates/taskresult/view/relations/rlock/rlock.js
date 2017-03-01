(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Switchable lock icon in the modal with relations
     *
     *  Usage:
     *      <r-lock
     *          click="onClickAdditionalAction"
     *          locked="locked.graphEdges[selectedRelation.column1][selectedRelation.column2]"
     *       />
     */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('rLock', function () {
        return {
            restrict: 'E',
            scope: {
                click: '=',
                currentLock: '=',
                column2:'='
            },

            templateUrl: currentFolder + 'rlock.html',
            link: function ($scope, iElement, iAttrs) {

                // returns the state of lock
                $scope.isLocked = function() {
                    return $scope.currentLock[$scope.column2];
                };

                // switchs lock/unlock
                $scope.changeLocking = function($event) {
                    $scope.currentLock[$scope.column2] ^= 1;

                    // Additional action as declared in the 'click' attribute
                    if ('click' in $scope) {
                        $scope.click();
                    }
                };
            }
        }
    });

})();