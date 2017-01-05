(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Alert-group directive, for displaying bootstrap several alerts below each other.
     *  Usage: <alert-group bind="myvar" />
     *
     *  $scope.myvar = {];
     *
     *  ...
     *  $scope.myvar.push('error', 'Something went wrong...');
     *  $scope.myvar.push('success', 'But also something succeeded!');
     *
     *  ...
     *  $scope.myvar.clear();
     *
     *  See alert directive for further details.
     */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('alertGroup', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'alertgroup.html',
            scope: {
                bind: '='
            },
            transclude: true,
            link: function (scope, iElement, iAttrs) {
                scope.messages = {
                    // Messages to display
                    alerts: [],

                    // Text messages injected from template
                    txt: {},

                    // Pushing an alert message
                    push: function (type, text) {
                        var _ref = this;
                        _ref.alerts.push({
                            type: type,
                            visible: true,
                            text: text,
                            close: function () {
                                _ref.alerts.splice(_ref.alerts.indexOf(this), 1);
                            }
                        });
                    },

                    // Clear any previous alerts
                    clear: function () {
                        this.alerts = [];
                    }
                };

                // Public interface
                scope.bind.push = function (type, text) {
                    scope.messages.push(type, text);
                };

                scope.bind.clear = function () {
                    scope.messages.clear();
                };
            }
        }
    });

})();