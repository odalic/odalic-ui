(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Controller
    var currentFolder = $.getPathForRelativePath('');
    app.controller('odalic-signupcnf-ctrl', function ($scope, rest, $routeParams, $auth) {

        // Initialization
        $scope.dataload = {};
        $scope.status = 'default';
        $scope.confirmation = {
            alertSuccess: {
                type: 'success',
                visible: true
            },
            alertFailure: {
                type: 'error',
                visible: true
            }
        };

        // Actions to take upon page load
        var token = $routeParams['token'];

        // Send the token
        rest.users.confirm(token).exec(
            // Success
            function (response) {
                $scope.status = 'success';
                $scope.dataload.show = true;
                $auth.setToken(token);
            },

            // Failure
            function (response) {
                $scope.status = 'failure';
                $scope.dataload.show = true;
            }
        );

    });

})();