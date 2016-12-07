(function () {

    // Main module
    var app = angular.module('odalic-app');

    //shows and switch lock icons in the page with relations
    //columns1 determines the first column of relation
    //columns2 determines the second column of relation
    var currentFolder = $.getPathForRelativePath('');
    app.directive('rLock', function () {
        return {
            restrict: 'E',
            scope: {
                locked: '=',
                column1: '@',
                column2: '@'
            },

            templateUrl: currentFolder + 'rlock.html',
            link: function (scope, iElement, iAttrs) {

                // returns the state of lock
                scope.isLocked = function()
                {
                        return  scope.locked[scope.column1][scope.column2];
                }

                // switchs lock/unlock
                scope.changeLocking = function($event)
                {
                    // TODO nefunguje ven
                    //$event.stopPropagation();
                    scope.locked[scope.column1][scope.column2] ^= 1;
                }
            }
        }
    });

})();