(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Controller
    var currentFolder = $.getPathForRelativePath('');
    app.controller('odalic-chngpasswdcnf-ctrl', function ($scope, rest, $routeParams, $auth) {

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
        rest.users.password.confirm(token).exec(
            // Success
            function (response) {
                $auth.logout();
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