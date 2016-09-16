(function () {

    // Main module
    var app = angular.module('odalic-app');

    // footer directive
    var currentFolder = $.getPathForRelativePath('');
    app.directive('alert', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'alert.html',
            scope: {
                bind: '='
            },
            transclude: true,
            link: function (scope, iElement, iAttrs) {
                // Initialize
                if (!scope.bind) {
                    scope.bind = {};
                }
                var defaults = {
                    type: 'neutral',
                    visible: true
                };
                objForEach(defaults, function (key, value) {
                    if (!(key in scope.bind)) {
                        scope.bind[key] = value;
                    }
                });

                // Type of the alert
                var mapping = {
                    neutral: 'alert-info',
                    success: 'alert-success',
                    error: 'alert-danger',
                    warning: 'alert-warning'
                };
                scope.type = function () {
                    return mapping[scope.bind.type];
                };

                // Closing the alert
                scope.hide = function () {
                    if (scope.bind.close) {
                        scope.bind.close();
                    } else {
                        scope.bind.visible = !scope.bind.visible;
                    }
                };
            }
        }
    });

})();