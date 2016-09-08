(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Settings
    var settings = {
        fileProvisionTypes: ['local', 'remote']
    };

    // Create a controller for task-creation screen
    app.controller('createnewtask-ctrl', function ($scope, $http, $window, sharedata, filedata, requests, rest) {

        // Files
        $scope.fileProvision = settings.fileProvisionTypes[0];
        $scope.files = {};
        $scope.remoteFile = {};


        //TODO smazat az bude na vyber,tj.
        //az to bude server umet, tak se dostupne kbs nastavi ze serveru

        //Supported knowledge bases
        $scope.availableKBs = ["DBpedia", "DBpedia Clone", "German DBpedia"];

        $scope.chosenKBs = ["DBpedia", "DBpedia Clone", "German DBpedia"];
        $scope.primaryKB = "DBpedia";

        $scope.automaticSelectPrimaryKB = function () {
            $scope.primaryKB = $scope.chosenKBs[0];
        }

        // File uploading
        $scope.fileUpload = {
            // Id of the input-file element
            inputFileId: 'concreteFile',

            // Are we uploading a file at the moment?
            uploadingFile: false,

            // Button for file uploading disabled?
            isUploadDisabled: true,

            // Identifier of the file to be uploaded
            identifier: String(),

            // Messages for a user
            alerts: [],

            // List of uploaded files
            uploaded: [],

            // Pushing an alert message for 'file upload'
            pushAlert: function (type, text) {
                var _ref = this;
                _ref.alerts.push({
                    type: type,
                    visible: true,
                    text: text,
                    close: function () {
                        _ref.alerts.splice(_ref.alerts.indexOf(this), 1);
                    }
                });
            },

            // Automatically fill the 'identifier' when a file is selected
            fillIdentifier: function () {
                var name = filedata.fileName(this.inputFileId);
                this.isUploadDisabled = !name;
                if (!name) {
                    name = text.randomId();
                }

                this.identifier = name;
                $scope.$apply();
            },

            // Refresh the list of uploaded files
            refreshUploaded: function (callback) {
                var _ref = this;
                rest.files.list.exec(
                    // Success
                    function (response) {
                        _ref.uploaded = response.data;
                        if (callback) {
                            callback(true);
                        }
                    },
                    // Failure
                    function failure(response) {
                        if (callback) {
                            callback(false);
                        }
                    }
                );
            },

            // Validates the file uploading part of the form; returns true, if it is safe to proceed with the file upload
            validate: function () {
                // Clear previous alerts
                this.alerts = [];
                var valid = true;

                // Local file selected?
                if (!filedata.filePresent(this.inputFileId)) {
                    this.pushAlert('error', 'No local file selected for the upload.');
                    valid = false;
                }

                // Identifier set?
                if (!this.identifier) {
                    this.pushAlert('error', 'Identifier must not be empty.');
                    valid = false;
                }

                return valid;
            },

            // Upload the selected file
            uploadFile: function () {
                // Validate
                if (!this.validate()) {
                    return;
                }

                // Reference to self
                var _ref = this;

                // The file is now uploading. Hide the 'upload' button to prevent multiple uploads.
                _ref.uploadingFile = true;

                // Uploading the file asynchronously
                sendData = function (fileData) {
                    rest.files.name(_ref.identifier).create(filedata.fileObject(_ref.inputFileId)).exec(
                        // Success
                        function (response) {
                            // The file has been uploaded successfully => refresh the list of available files
                            _ref.refreshUploaded(function (succes) {
                                // Succes parameter ignored.

                                // Display a success message
                                _ref.pushAlert('success', 'The file has been successfully uploaded.');

                                // Sets the newly uploaded file as the selected one
                                var uploadedFileIndex = _ref.uploaded.map(function (file) {
                                    return file.id;
                                }).indexOf(_ref.identifier);
                                $scope.files.selectedFile = _ref.uploaded[uploadedFileIndex];

                                // Clear the fields
                                _ref.identifier = String();
                                filedata.clearInputFile("concreteFile");

                                // Another file may be uploaded again
                                _ref.uploadingFile = false;
				_ref.isUploadDisabled = true;

                                // Clear chosen file
                                angular.element("input[type='file']").val(null);
                            });
                        },
                        // Failure
                        function (response) {
                            // The file has not been uploaded => display an error message
                            _ref.pushAlert('error', 'An error occured while uploading the file. Details: ' + text.dotted(response, 50));

                            // A file may be uploaded again
                            _ref.uploadingFile = false;
                        }
                    );
                };

                // Read the file and send the data to server
                filedata.readBase64(_ref.inputFileId, function (fileData) {
                    sendData(fileData);
                });
            }
        };
        $scope.fileUpload.refreshUploaded();

        $scope.wholeForm = {
            // Messages for a user
            alerts: [],

            // Pushing an alert message for 'the whole form'
            pushAlert: function (type, text) {
                var _ref = this;
                _ref.alerts.push({
                    type: type,
                    visible: true,
                    text: text,
                    close: function () {
                        _ref.alerts.splice(_ref.alerts.indexOf(this), 1);
                    }
                });
            },

            // Validation of the form, whether everything is correctly filled; returns true, if it is safe to proceed
            validate: function () {
                // Clear previous alerts
                this.alerts = [];
                var valid = true;

                // Task name set?
                if (!objRecurAccess($scope, 'taskCreation')['identifier']) {
                    valid = false;
                    this.pushAlert('error', 'Task name not set.');
                }

                // File selected?
                switch ($scope.fileProvision) {
                    case 'local':
                        if (!objRecurAccess($scope, 'files', 'selectedFile')['id']) {
                            valid = false;
                            this.pushAlert('error', 'No file selected.');
                        }
                        break;
                    case 'remote':
                        if (!objRecurAccess($scope, 'remoteFile')['location']) {
                            valid = false;
                            this.pushAlert('error', 'No remote file specified.');
                        }
                        break;
                }

                return valid;
            }
        };


        // Task creation
        $scope.createTask = function () {
            // Validate the form
            if (!$scope.wholeForm.validate()) {
                return;
            }

            // Generic preparations
            var fileId = $scope.files.selectedFile.id;

            // Immediately redirect to a loading screen
            $window.location.href = "#/loading";

            // For displaying error messages when a failure of one of the requests occurs
            var requestError = function (response) {
                sharedata.set("Failure", response.data);
                $window.location.href = "#/genericerror";
            };

            // A request for retrieval of an executed task's result
            var reqGetResult = function () {
                rest.tasks.name($scope.taskCreation.identifier).result.retrieve.exec(
                    // Success
                    function (response) {
                        //TODO predelat pro vice tasku bezicich zaroven??
                        // Save the result and redirect
                        sharedata.set("Result", response.data);
                        // Save the task ID
                        sharedata.set("TaskID", $scope.taskCreation.identifier);
                        $window.location.href = "#/taskresult";
                    },
                    // Failure
                    // TODO: Uncomment this
                    //failure : requestError
                    function () {
                        // TODO: This is just a temporary solution until a problem with REST file upload is resolved
                        $.getJSONSync("src/templates/taskresult/sample_result.json", function (sample) {
                            sharedata.set("Result", sample);
                        });
                        $window.location.href = "#/taskresult";
                    }
                );
            };

            // A request for executing the prepared task
            var reqStartTask = function () {
                rest.tasks.name($scope.taskCreation.identifier).execute.exec(
                    // Success
                    function (response) {
                        reqGetResult();
                    },
                    // Failure
                    requestError
                );
            };

            // Start with a request for inserting a task
            rest.tasks.name($scope.taskCreation.identifier).create({
                id: String($scope.taskCreation.identifier),
                created: "2000-01-01 00:00",
                configuration: {
                    input: fileId,
                    feedback: {
                        columnIgnores: [],
                        classifications: [],
                        columnAmbiguities: [],
                        ambiguities: [],
                        disambiguations: [],
                        cellRelations: [],
                        columnRelations: []
                    },
                    primary_base: {
                        name: $scope.primaryKB
                    }
                }
            }).exec(
                // Success
                function () {
                    //TODO predelat pro vice tasku bezicich zaroven??
                    // Save the chosen input file identifier
                    sharedata.set("Input", $scope.files.selectedFile.id);
                    sharedata.set("PrimaryKB", $scope.primaryKB);
                    sharedata.set("ChosenKBs", $scope.chosenKBs);
                    reqStartTask();
                },
                // Failure
                requestError
            );
        }
    });

})();
