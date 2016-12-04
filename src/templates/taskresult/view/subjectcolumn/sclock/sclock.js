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
                column: '@'
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
                    // TODO nefunguje ven
                    //$event.stopPropagation();
                    scope.locked[scope.kB][scope.column] ^= 1;
                }
            }
        }
    });

})();