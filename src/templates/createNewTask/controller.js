(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Create a controller for taskconfig
    app.controller('createnewtask-ctrl', function ($scope) {
		$scope.fileProvision = "uploaded";
		
        $scope.savedFiles = [];
    });

})();