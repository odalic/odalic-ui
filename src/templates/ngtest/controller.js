(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Create a controller for ngtest
    var currentFolder = $.getPathForRelativePath('');
    app.controller('odalic-ngtest-ctrl', function ($scope, $auth, $http) {

        $scope.myauth = function() {
            $auth.authenticate('google')
                .then(function(response) {
                    console.log('Connected!');
                    console.log(response);
                })
                .catch(function(response) {
                    console.log('Failure!');
                    console.log(response);
                });
        };

        $scope.testauth = function() {
            console.log($auth.isAuthenticated());
            console.log($auth.getToken());
            console.log($auth.getPayload());
        };
        
        $scope.testconn = function () {
            // TODO: Everything needs to be rewritten to use "$http" as its 'ajax-middleware' in rest services
            $http({
                method: 'GET',
                url: '/meh'
                //skipAuthorization: true
            });
        };

        $scope.basicauth = function () {
            var user = {
                email: 'istvan.satmari@gmail.com',
                password: 'example'
            };

            $auth.login(user)
                .then(function(response) {
                    console.log('login successful!');
                    console.log(response);
                })
                .catch(function(response) {
                    console.log('login failure!');
                    console.log(response);
                });
        };
    });

})();