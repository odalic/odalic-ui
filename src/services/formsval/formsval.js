(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** formsval
     *  Description:
     *      Easing built-in angular support for forms validation.
     *
     *  Usage:
     *      # Ensuring proper form initialization (to be able to use the built-in angular support)
     *      - template -
     *      <form name="signupForm" ng-init="setForm(this, 'signupForm')">
     *
     *      - controller -
     *      formsval.toScope($scope);
     *
     *
     *      # Form validation
     *      var formValid = formsval.validate($scope.signupForm);
     */
    app.service('formsval', function () {

        /** Creates some useful functions and pushes them into the scope.
         *
         * @param scope Controller's scope.
         */
        this.toScope = function (scope) {
            /** Due to a bug with angular the form object is sometimes left uninitialized.
             *  Pattern to use in that case is the following one:
             *
             *  // Controller
             *  formsval.toScope($scope);
             *
             *  // Template
             *  <form name="myForm" ng-init="setForm(this, 'myForm')">
             *
             *  // Controller (again)
             *  var isValid = $scope.myForm.$valid;
             *  ...
             *
             * @param p     Template page
             * @param name  Name of the form
             */
            scope.setForm = function (p, name) {
                timed.ready(function () { return !!p[name]; }, function () {
                    scope[name] = p[name];
                });
            };
        };

        /** Returns whether a form is valid. Omits any nested forms.
         *  Sets dirty flag in the controls that report an error.
         *
         *  @param form        The form object to validate.
         *  @returns {boolean} Whether the form is valid.
         */
        this.validateNonNested = function (form) {
            var valid = true;

            // Force validation
            objhelp.objForEach(form.$error, function (key, value) {
                value.forEach(function (item) {
                    // Do not check nested forms
                    if (!('$submitted' in item)) {
                        item.$setDirty();
                        valid = false;
                    }
                })
            });

            // Return
            return valid;
        };

        /** Returns whether a form is valid.
        *  Sets dirty flag in the controls that report an error.
        *
        *  @param form        The form object to validate.
        *  @returns {boolean} Whether the form is valid.
        */
        this.validate = function (form) {
            var valid = true;

            // Force validation
            objhelp.objForEach(form.$error, function (key, value) {
                value.forEach(function (item) {
                    item.$setDirty();
                    valid = false;
                })
            });

            // Return
            return valid;
        };

    });

})();