(function () {

    // Main module
    var app = angular.module('odalic-app');

    // lock directive
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

                scope.isLocked = function()
                {
                    return  scope.locked[scope.row][scope.column];
                }

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