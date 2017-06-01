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
            },

            templateUrl: currentFolder + 'sclock.html',
            link: function (scope, iElement, iAttrs) {

                // returns the state of lock
                scope.isLocked = function()
                {
                        return  scope.locked[scope.kB];
                }

                // switchs lock/unlock
                scope.changeLocking = function($event)
                {
                    $event.stopPropagation();
                    scope.locked[scope.kB]^=  1;
                }
            }
        }
    });

})();