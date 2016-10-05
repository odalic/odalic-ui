(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Create a controller for taskconfigs
    app.controller('odalic-taskconfigs-ctrl', function ($scope, ioc, rest) {

        // Initialize variables with empty values
        $scope.taskconfigs = [];

        // Load data to table
        var loader = ioc['taskconfigs/loader'](rest);

        loader.getTasks(
            function(data) {
                $scope.taskconfigs = data;
            },
            function (response) {
                throw new Error('Unexpected error while loading the task configurations.');
            }
        );
    });

})();