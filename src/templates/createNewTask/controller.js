(function () {

    // Main module
    var app = angular.module('odalic-app');
	
	// Settings
	var settings = {
		fileProvisionTypes : ['local', 'remote'],
		savedFiles : ['file-identifier-1', 'file-identifier-2', 'file-identifier-3']
	};

    // Create a controller for task-creation screen
    app.controller('createnewtask-ctrl', function ($scope, $http, $window, sharedata) {
		// fileProvision
		$scope.fileProvision = settings.fileProvisionTypes[0];
		
		// savedFiles
        $scope.savedFiles = settings.savedFiles;
		
		
		// uploadFile
		$scope.uploadingFile = false;
		$scope.uploadFileError = false;
		
		$scope.uploadFileErrorClose = function() {
			$scope.uploadFileError = false;
		}
		
		$scope.uploadFile = function() {
			// The file is now uploading. Hide the 'upload' button to prevent multiple uploads.
			$scope.uploadingFile = true;
			
			// Upload the file asynchronously
			$http({
				method : "POST",
				url : "not-specified-yet",
			}).then(
				// The file has been uploaded successfully => refresh the list of available files
				function success(response) {
					// $scope.savedFiles = ['something'];
					$scope.uploadingFile = false;
				},
				// The file has not been uploaded => display an error message
				function failure(response) {
					$scope.uploadFileError = true;
					$scope.uploadingFile = false;
				}
			);
		}
		
		
		// createTask
		$scope.createTask = function() {
			// Validate the form
			if (!$scope.taskCreationForm.$valid) {
				alert("Form validation failed.");
				return;
			}
			
			// Immediately redirect to a loading screen
			$window.location.href = "#/loading";
			
			// Send an asynchronous request with the task's data
			$http({
				method : "POST",
				url : "not-specified-yet",
			}).then(
				// The task has finished and returned data => save the data and redirect to a result screen
				function success(response) {
					sharedata.set("example", "succes");
					$window.location.href = "#/taskresult";
				},
				// There was a failure => save the data concerning response and redirect to an error screen
				function failure(response) {
					sharedata.set("example", "failure");
					$window.location.href = "#/taskresult";
				}
			);
		}
    });

})();