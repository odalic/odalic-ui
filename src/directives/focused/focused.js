(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Making input control focused.
     *  Usage:
     *      <input type="text" ng-model="identifier" focused/>
     */
    app.directive('focused', function () {
        return {
            restrict: 'A',
            scope: {
                model: '=focused'
            },
            link: function (scope, iElement, iAttrs) {

                // Behaviour depending on the attribute 'model'
                if (typeof(scope.model) !== 'undefined') {
                    // Initialization
                    var focusfn = function (focused) {
                        if (focused === true) {
                            window.setTimeout(function () {
                                iElement[0].focus();
                            });
                        }
                    };

                    // Watch for the corresponding value
                    scope.$watch(scope.model, function (value) {
                        focusfn(value);
                    });

                    // On losing focus change the value
                    iElement.bind('blur', function () {
                        scope.$apply(scope.model.assign(scope, false));
                    });

                    // Start focused?
                    focusfn(scope.model);
                } else {
                    // Set focus automatically if the attribute is not set
                    iElement[0].focus();
                }

            }
        }
    });

})();