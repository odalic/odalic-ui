(function () {

    // Main module
    var app = angular.module('odalic-app');
	
	// Create a controller for the loading screen
    app.controller('genericerror-ctrl', function ($scope, sharedata) {
		$scope.response = sharedata.get("Failure");
		sharedata.clear("Failure");
    });

})();