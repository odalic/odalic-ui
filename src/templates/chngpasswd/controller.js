(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Controller
    var currentFolder = $.getPathForRelativePath('');
    app.controller('odalic-chngpasswd-ctrl', function ($scope, formsval, $auth, reporth, rest) {

        // Initialization
        formsval.toScope($scope);
        $scope.status = 'default';

        // Sign up panel
        $scope.cpasswd = {
            alerts: {},
            cpassword: new String(),
            password: new String(),
            password2: new String(),
            buttondis: false,
            confirm: function (f) {
                // Validate
                if (!formsval.validate($scope.cpasswdForm)) {
                    f();
                    return;
                }

                // Change a current user's password
                var ref = $scope.cpasswd;
                rest.users.name($auth.getPayload().sub).password.replace(ref.cpassword, ref.password).exec(
                    // Success
                    function(response) {
                        $scope.status = 'emsent';
                    },

                    // Failure
                    function(response) {
                        ref.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.failure'], response.data));
                        f();
                    }
                );
            }
        };

        // E-mail sent
        $scope.emsent = {
            alert: {
                type: 'success',
                visible: true
            }
        };

        // If not logged, redirect to login screen
        if (!$auth.isAuthenticated()) {
            window.location = '#/login';
        }

    });

})();