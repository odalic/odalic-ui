(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Create a controller for taskconfig
    app.controller('odalic-taskconfig-ctrl', function ($scope) {
        // Tab starting with 'taskdef'
        $scope.tab = "taskdef";
    });

})();