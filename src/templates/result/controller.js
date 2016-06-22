(function () {

    // Main module
    var app = angular.module('odalic-app');
	
	// Create a controller for the result screen
    app.controller('result-ctrl', function ($scope, sharedata) {
		
		$scope.responseText = sharedata.get("example");
		
    });

})();