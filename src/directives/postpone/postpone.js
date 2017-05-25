(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Postpone DOM element creation */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('postpone', function ($compile) {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'postpone.html',
            transclude: true,
            scope: {
                condition: '=',
                delay: '@'
            },
            link: function (scope, iElement, iAttrs) {

                // The element is uninitialized at the beginning
                scope.ready = false;

                // Condition for element creation not set?
                if (typeof(scope.condition) === 'undefined') {
                    scope.condition = false;
                }

                // Timed element creation?
                if (scope.delay) {
                    // Wait the given time before allowing the DOM element to be created
                    window.setTimeout(function () {
                        scope.ready = true;
                        timed.digest(scope);
                    }, scope.delay);
                }

                // Once created, do not destroy again
                scope.$watch('condition', function() {
                    if (scope.condition) {
                        scope.ready = true;
                    }
                });

            }
        }
    });

})();