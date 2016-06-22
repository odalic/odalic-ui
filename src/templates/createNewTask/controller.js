(function () {

    // Main module
    var app = angular.module('odalic-app');
	
	// Settings
	var settings = {
		fileProvisionTypes : ['local', 'remote'],
		savedFiles : ['file-identifier-1', 'file-identifier-2', 'file-identifier-3']
	};

    // Create a controller for taskconfig
    app.controller('createnewtask-ctrl', function ($scope) {
		// fileProvision
		$scope.fileProvision = settings.fileProvisionTypes[0];
		
		// savedFiles
        $scope.savedFiles = settings.savedFiles;
    });

})();