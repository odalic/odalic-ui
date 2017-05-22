(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Controller
    var currentFolder = $.getPathForRelativePath('');
    app.controller('odalic-signup-ctrl', function ($scope, formsval, $auth, reporth) {

        // Initialization
        formsval.toScope($scope);
        $scope.status = 'default';

        // Sign up panel
        $scope.signup = {
            alerts: {},
            username: new String(),
            password: new String(),
            password2: new String(),
            signobj: {},
            signup: function (f) {
                // Validate
                if (!formsval.validate($scope.signupForm)) {
                    f();
                    return;
                }

                // Create a new user
                var ref = $scope.signup;
                $auth.signup({
                    email: ref.username,
                    password: ref.password
                }).then(function(response) {
                    // E-mail confirmation required?
                    if (text.safe(constants.configurables.signup.emailConfirmation).toUpperCase() === 'TRUE') {
                        $scope.status = 'emsent';
                    }
                    // E-mail confirmation not required
                    else {
                        $scope.status = 'nonemail';
                    }
                }).catch(function(response) {
                    ref.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.failure'], response.data));
                    f();
                });
            }
        };

        // E-mail sent
        $scope.emsent = {
            alert: {}
        };

        // Non-email version
        $scope.nonemail = {
            alert: {}
        };

        // Redirect to login screen, if already logged
        if ($auth.isAuthenticated()) {
            window.location = '#/login';
        }

    });

})();