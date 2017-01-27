(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Create a controller for ngtest
    var currentFolder = $.getPathForRelativePath('');
    app.controller('odalic-login-ctrl', function ($scope, formsval) {

        // Initialization
        formsval.toScope($scope);

        $scope.login = {
            buttondis: false,
            login: function (f) {
                //f();
            }
        };

    });

})();