(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Alert-group directive, for displaying bootstrap several alerts below each other.
     *  Usage: <alert-group bind="myvar" disappearing="5" />
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
     *  Attribute "disappearing":
     *      After what amount of seconds should the alerts automatically disappear.
     *      When omitted or set to 0, the alerts stay there forever until closed by a user.
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
                // Implementation
                scope.messages = {
                    // Automatically disappearing alerts
                    alerttimeout: null,

                    // Messages to display
                    alerts: [],

                    // Text messages injected from template
                    txt: {},

                    // Pushing an alert message
                    push: function (type, text) {
                        var _ref = this;
                        var _alert = {
                            type: type,
                            visible: true,
                            text: text,
                            ghost: false,
                            close: function () {
                                _ref.alerts.splice(_ref.alerts.indexOf(this), 1);
                                this.ghost = true;
                            }
                        };

                        // push
                        _ref.alerts.push(_alert);

                        // automatically disappearing?
                        if (_ref.alerttimeout) {
                            window.setTimeout(function () {
                                if (!_alert.ghost) {
                                    _alert.close();
                                }

                                // Render changes
                                scope.$apply();
                            }, _ref.alerttimeout  * 1000);
                        }
                    },

                    // Clear any previous alerts
                    clear: function () {
                        this.alerts.forEach(function (item) {
                            item.close();
                        });
                    }
                };

                // Automatically disappearing alerts?
                if ('disappearing' in iAttrs) {
                    var tt = text.safeInt(iAttrs['disappearing'], 0);
                    if (tt > 0) {
                        scope.messages.alerttimeout = tt;
                    }
                }

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