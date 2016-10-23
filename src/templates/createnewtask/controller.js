(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Settings
    var settings = {
        fileProvisionTypes: ['local', 'remote']
    };

    // Create a controller for task-creation screen
    app.controller('createnewtask-ctrl', function ($scope, $routeParams, filedata, rest) {

        // Initialization
        $scope.templFormat = {
            createTask: null,
            saveTask: null,
            creating: true
        };

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
        };

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
                        _ref.uploaded = response;
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
                        function () {
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
        $scope.templFormat.createTask = function () {
            // Validate the form
            if (!$scope.wholeForm.validate()) {
                return;
            }

            // Generic preparations
            var fileId = $scope.files.selectedFile.id;
            var taskId = $scope.taskCreation.identifier;

            // TODO: A loading icon should be displayed until the task is actually inserted on the server. If an error arises a tooltip / alert should be displayed.

            // Insert the task
            rest.tasks.name(taskId).create({
                id: String(taskId),
                created: (new Date()).toString("yyyy-MM-dd HH:mm"),
                configuration: {
                    input: fileId,
                    feedback: {
                        columnIgnores: [],
                        classifications: [],
                        columnAmbiguities: [],
                        ambiguities: [],
                        disambiguations: [],
                        columnRelations: []
                    },
                    primaryBase: {
                        name: $scope.primaryKB
                    }
                },
				description: text.safe($scope.description)
            }).exec(
                // Success
                function (response) {
                    // The task has been created, redirect to the task configurations screen
                    window.location.href = '#/taskconfigs/';
                },
                // Failure
                function (response) {
                    // TODO: What should happen when an error arises while trying to create the task...
                }
            );
        };

        // Task saving
        $scope.templFormat.saveTask = function () {
            // Validate the form
            if (!$scope.wholeForm.validate()) {
                return;
            }

            // Generic preparations
            var fileId = $scope.files.selectedFile.id;

            // TODO: A loading icon should be displayed until the task is actually inserted on the server. If an error arises a tooltip / alert should be displayed.

            // Insert the task
            rest.tasks.name($scope.taskCreation.identifier).replace({
                input: fileId,
                feedback: {
                    columnIgnores: [],
                    classifications: [],
                    columnAmbiguities: [],
                    ambiguities: [],
                    disambiguations: [],
                    columnRelations: []
                },
                primaryBase: {
                    name: $scope.primaryKB
                }
            }).exec(
                // Success
                function (response) {
                    // The task has been updated, redirect to the task configurations screen
                    window.location.href = '#/taskconfigs/';
                },
                // Failure
                function (response) {
                    // TODO: What should happen when an error arises while trying to modify the task...
                }
            );
        };

        // Preloading form controls (if applicable), or creation of a completely new task
        (function () {
            var TaskID = $routeParams['taskid'];
            if (TaskID) {
                rest.tasks.name(TaskID).retrieve.exec(
                    // Success
                    function (response) {
                        // Find the previously chosen file for the current task
                        var selectedFile = 0;
                        var uploaded = $scope.fileUpload.uploaded;
                        for (var i = 0; i < uploaded.length; ++i) {
                            if (uploaded[i].id === response.configuration.input) {
                                selectedFile = i;
                                break;
                            }
                        }

                        // Fill the controls
                        objRecurAccess($scope, 'taskCreation')['identifier'] = response.id;
                        $scope.fileProvision = 'local';
                        $scope.files.selectedFile = $scope.fileUpload.uploaded[selectedFile];
                        $scope.description = response.description;
                        $scope.templFormat.creating = false;
                    },

                    // Failure to load the task's config
                    function (response) {
                        // TODO
                    }
                );
            }
        })();

    });

})();