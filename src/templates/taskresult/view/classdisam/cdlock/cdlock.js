(function () {

    // Main module
    var app = angular.module('odalic-app');

    //shows and switch lock icons in the page with relations
    //row determines row in the classification/disambiguation table(-1 represents header row with classifications)
    //columns determines in the classification/disambiguation table
    var currentFolder = $.getPathForRelativePath('');
    var currentFolder = $.getPathForRelativePath('');
    app.directive('cDLock', function () {
        return {
            restrict: 'E',
            scope: {
                locked: '=',
                row: '@',
                column: '@'
            },

            templateUrl: currentFolder + 'cdlock.html',
            link: function (scope, iElement, iAttrs) {

                // returns the state of lock
                scope.isLocked = function()
                {
                    return  scope.locked[scope.row][scope.column];
                }

                // switchs lock/unlock
                scope.changeLocking = function($event)
                {
                    // TODO nefunguje ven
                    $event.stopPropagation();
                    scope.locked[scope.row][scope.column] ^= 1;
                }
            }
        }
    });

})();