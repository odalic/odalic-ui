(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Controller
    var currentFolder = $.getPathForRelativePath('');
    app.controller('odalic-signupcnf-ctrl', function ($scope, rest, $routeParams, $auth, authh) {

        // Initialization
        $scope.dataload = {};
        $scope.status = 'default';
        $scope.confirmation = {
            alertSuccess: {},
            alertFailure: {}
        };

        // Actions to take upon page load
        var token = $routeParams['token'];

        // Send the token
        rest.users.confirm(token).exec(
            // Success
            function (response) {
                // Is the login automatic?
                if (authh.isAutomaticLogin()) {
                    console.warn('Warning: automatic login for e-mail confirmation version of signing up is not supported.');
                    //window.location = '#/login';
                }

                $scope.status = 'success';
                $scope.dataload.show = true;
            },

            // Failure
            function (response) {
                $scope.status = 'failure';
                $scope.dataload.show = true;
            }
        );

    });

})();