(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Compare-to directive.
     *  Usage:
     *
     *      <input type="password" name="password1" ng-model="signup.password" />
     *      <input type="password" name="password2" ng-model="signup.password2" compare-to="signup.password" />
     *
     *      <div ng-messages="signupForm.password2.$error" role="alert">
     *          <div ng-message="compare">Passwords do not match.</div>
     *      </div>
     *
     *  Note the model has to be set in "password2".
     */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('compareTo', function () {
        return {
            require: 'ngModel',
            scope: {
                otherValue: '=compareTo'
            },
            link: function (scope, iElement, iAttrs, ngModel) {

                // Add a new validation function before all of the other validators
                ngModel.$parsers.unshift(function (value) {
                    ngModel.$setValidity('compare', scope.otherValue === value);

                    // "Parsers change how view values will be saved in the model" => we simply return the value
                    return value;
                });

            }
        }
    });

})();