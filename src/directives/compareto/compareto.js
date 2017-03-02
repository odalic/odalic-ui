(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** compare-to
     *  Description:
     *      Compares value of a current control with another one. If the values differ, sets validity of "compare" to
     *      false.
     *      To be used only with ng-messages directive.
     *
     *  Usage:
     *      # Example 1
     *      - template -
     *      <input type="password" name="password1" ng-model="signup.password" />
     *      <input type="password" name="password2" ng-model="signup.password2" compare-to="signup.password"/>
     *
     *      <div ng-messages="signupForm.password2.$error" role="alert">
     *          <div ng-message="compare">Passwords do not match.</div>
     *      </div>
     *
     *  Arguments:
     *      compare-to
     *      - A model to compare a current model's value against. Note the model has to be set in a current control.
     */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('compareTo', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                otherValue: '=compareTo'
            },
            link: function (scope, iElement, iAttrs, ngModel) {

                // Validator name
                var vname = 'compare';

                // Validation function
                var tester = function (value) {
                    var result = scope.otherValue === value;
                    ngModel.$setValidity(vname, result);
                    return result;
                };

                // Add a new validation function before all of the other validators
                ngModel.$validators[vname] = tester;
                ngModel.$parsers.unshift(function (value) {
                    // Set validity upon change
                    tester(value);

                    // "Parsers change how view values will be saved in the model" => we simply return the value
                    return value;
                });

            }
        }
    });

})();