(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Create a controller for task-creation screen
    app.controller('odalic-setproperties-ctrl', function ($scope, $uibModal, $routeParams, filedata, rest, formsval, reporth) {

        // Initialize
        $scope.labelPredicates = [
            { id: 0, value: 'pred1' },
            { id: 1, value: 'pred2' }
        ];

        $scope.test = function () {
            console.log($scope.labelPredicates);
        };

    });

})();