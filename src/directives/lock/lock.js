(function () {

    // Main module
    var app = angular.module('odalic-app');

    // lock directive
    var currentFolder = $.getPathForRelativePath('');
    app.directive('lock', function () {
        return {
            restrict: 'E',
            scope: {
                locked: '=',
                firstParametr: '@',
                secondParametr: '@'
            },

            templateUrl: currentFolder + 'lock.html',
            link: function (scope, iElement, iAttrs) {

                scope.isLocked = function()
                {
                    // if(scope.secondParametr==-1) {
                    //    // {alert("dd")}
                    // }
                        return  scope.locked[scope.firstParametr][scope.secondParametr];
                }

                scope.changeLocking = function($event)
                {
                    // TODO nefunguje ven
                    $event.stopPropagation();
                    // alert(JSON.stringify(scope.locked))
                    // alert(scope.firstParametr+" " +scope.secondParametr+" " +scope.locked[scope.firstParametr][scope.secondParametr])
                    scope.locked[scope.firstParametr][scope.secondParametr] ^= 1;
                }
            }
        }
    });

})();