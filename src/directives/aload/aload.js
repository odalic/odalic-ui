(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** aload */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('aLoad', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'aload.html',
            transclude: true,
            scope: {
                action: '='
            },
            link: function (scope, iElement, iAttrs) {
                // Initialization
                scope.clicked = false;

                // On hyperlink click
                scope.handle = function () {
                    // Show loading icon
                    scope.clicked = true;

                    // Outer action accepting our future
                    scope['action'](function () {
                        scope.clicked = false;
                    });
                };
            }
        }
    });

})();