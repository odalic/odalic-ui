(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Switchable lock icon in the modal with relations
     *
     *  Usage:
     *      <r-lock
     *          click="onClickAdditionalAction"
     *          locked="locked.graphEdges"
     *          column1="{{ selectedRelation.column1 }}"
     *          column2="{{ selectedRelation.column2 }}"
     *       />
     */
    //columns1 determines the first column of relation
    //columns2 determines the second column of relation
    var currentFolder = $.getPathForRelativePath('');
    app.directive('rLock', function () {
        return {
            restrict: 'E',
            scope: {
                click: '=',
                locked: '=',
                column1: '@',
                column2: '@'
            },

            templateUrl: currentFolder + 'rlock.html',
            link: function (scope, iElement, iAttrs) {

                // returns the state of lock
                scope.isLocked = function() {
                    return scope.locked[scope.column1][scope.column2];
                };

                // switchs lock/unlock
                scope.changeLocking = function($event) {
                    // TODO nefunguje ven
                    //$event.stopPropagation();
                    scope.locked[scope.column1][scope.column2] ^= 1;

                    // Additional action as declared in the 'click' attribute
                    if ('click' in scope) {
                        scope.click();
                    }
                };
            }
        }
    });

})();