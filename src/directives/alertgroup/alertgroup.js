(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** alert-group
     *  Description:
     *      A group of alert directives.
     *      Serves for displaying a chain of messages (e.g. when several requests may go wrong).
     *      The alerts may be set to automatically disappear after a while.
     *
     *  Usage:
     *      # Example 1
     *      - template -
     *      <!-- displays messages for 5 seconds -->
     *      <alert-group bind="myvar" disappearing="5" />
     *
     *      - controller -
     *      // initialize
     *      $scope.myvar = {];
     *
     *      // on certain event add new messages
     *      $scope.myevent = function() {
     *          $scope.myvar.push('error', 'Something went wrong...');
     *          $scope.myvar.push('success', '...but something also succeeded!');
     *      };
     *
     *      // on another event clear
     *      $scope.myevent2 = function() {
     *          $scope.myvar.clear();
     *      }
     *
     *  Arguments:
     *      bind
     *      - An object on scope. May be empty, but has to be defined.
     *      Functions:
     *          - push(type, msg): adds a new alert to the group of type 'type' with message 'msg'
     *          - clear(): removes all current alerts from the group
     *
     *      disappearing (optional)
     *      - Time interval (seconds) for individual alerts to disappear.
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