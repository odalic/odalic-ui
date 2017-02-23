(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Create a controller for ngtest
    var currentFolder = $.getPathForRelativePath('');
    app.controller('odalic-login-ctrl', function ($scope, formsval, $auth, rest, reporth) {

        // Initialization
        formsval.toScope($scope);
        $scope.status = 'default';

        // Log in panel
        $scope.login = {
            alerts: {},
            username: new String(),
            password: new String(),
            logobj: {},
            login: function (f) {
                // Validate
                if (!formsval.validate($scope.loginForm)) {
                    f();
                    return;
                }

                // Log in
                var ref = $scope.login;
                $auth.login({
                    email: ref.username,
                    password: ref.password
                }).then(function(response) {
                    $scope.status = 'logged';
                    $auth.setToken(response.data.payload.token);
                }).catch(function(response) {
                    ref.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.failure'], response.data));
                    f();
                });
            }
        };

        // User already logged in
        $scope.logged = {
            alert: {},
            account: {
                getUsername: function () {
                    return $auth.getPayload()['sub'];
                }
            },
            logout: function () {
                $auth.logout();
                $scope.status = 'login';
            }
        };

        // Check if user is already logged in
        if ($auth.isAuthenticated()) {
            $scope.status = 'evaluating';
            rest.users.test.custom.exec(
                // Success
                function (response) {
                    $scope.status = 'logged';
                },
                // Token expired
                function (response) {
                    $auth.logout();
                    $scope.status = 'login';
                },
                // Failure while testing
                function (response) {
                    $auth.logout();
                    $scope.status = 'login';
                }
            );
        }

    });

})();