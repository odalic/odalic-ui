(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Create a controller for ngtest
    var currentFolder = $.getPathForRelativePath('');
    app.controller('odalic-signup-ctrl', function ($scope, formsval) {

        // Initialization
        formsval.toScope($scope);

        $scope.signup = {
            buttondis: false,
            signup: function (f) {
                //f();
            }
        };

    });

})();