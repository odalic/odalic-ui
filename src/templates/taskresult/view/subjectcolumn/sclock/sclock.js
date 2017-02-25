(function () {

    // Main module
    var app = angular.module('odalic-app');

    //shows and switch lock icons in the subject column tables
    //kB determines the table,in which is shown the chosen subject column of the concrete knowledge base
    //column determines the culumn in the that table
    var currentFolder = $.getPathForRelativePath('');
    app.directive('sCLock', function () {
        return {
            restrict: 'E',
            scope: {
                locked: '=',
                kB: '@',
                column: '@',
                ignored:'='
            },

            templateUrl: currentFolder + 'sclock.html',
            link: function (scope, iElement, iAttrs) {

                // returns the state of lock
                scope.isLocked = function()
                {
                        return  scope.locked[scope.kB][scope.column];
                }

                // switchs lock/unlock
                scope.changeLocking = function($event)
                {
                   if(scope.ignored == 0) {
                       scope.locked[scope.kB][scope.column] ^= 1;
                   }
                }
            }
        }
    });

})();