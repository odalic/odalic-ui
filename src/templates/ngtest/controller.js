(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Create a controller for ngtest
    var currentFolder = $.getPathForRelativePath('');
    app.controller('odalic-ngtest-ctrl', function ($scope, $auth, $http, rest) {

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

        $scope.logout = function() {
            $auth.logout();
            console.log($auth.isAuthenticated());
            console.log($auth.getToken());
            console.log($auth.getPayload());
        };
        
        $scope.testconn = function () {
            $http({
                method: 'GET',
                url: 'http://localhost:8080/odalic/files'
                //skipAuthorization: true
            }).then(
                function (response) {
                    console.log('success response');
                    console.log(response);
                },
                function (response) {
                    console.log('failure response');
                    console.log(response);
                }
            );
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

        // Testing fake-link
        $scope.testfile = function (s, f) {
            rest.tasks.name('i1').result.export.csv.exec(s, f);
        };
        $scope.myerror = function (r) {
            console.error(r);
        };
    });

})();