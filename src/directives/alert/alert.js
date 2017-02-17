(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Aler directive, for displaying bootstrap alert panel.
     *  Usage: <alert bind="myvar" type="neutral">Hooray!</alert>
     *
     *  $scope.myvar = {
     *      close: function() {
     *          // Action on close
     *      }
     *  };
     *
     *  If function close is defined, it is called on alert close.
     *  If it is not defined, the default action is called ("visible = false;").
     *
     *  Available types:
     *  'neutral', 'success', 'error', 'warning'
     *
     *  Non-closable alert: <alert bind="myvar" closable="false">Hooray!</alert>
     *
     *  All settings available from a controller:
     *  $scope.myvar = {
     *      type: 'success',
     *      visible: false
     *      close: function() {
     *          // Action on close
     *      }
     *  };
     *
     *  Neither 'type' nor 'visible' have to be specified
     *  Note the alert is visible by default.
     *  Also note, the HTML attributes are prioritized to settings from a controller.
     *
     */
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
                var defaults = {
                    type: 'neutral',
                    visible: true
                };
                objhelp.objForEach(defaults, function (key, value) {
                    if (!(key in scope.bind)) {
                        scope.bind[key] = value;
                    }
                });

                // Attribute type present in HTML?
                if ('type' in iAttrs) {
                    scope.bind.type = iAttrs['type'];
                }

                // Closable?
                scope.closable = true;
                var closable = 'closable';
                if ((closable in iAttrs) && (iAttrs[closable] === 'false')) {
                    scope.closable = false;
                }

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