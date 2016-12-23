(function () {

    // Main module
    var app = angular.module('odalic-app');

    var currentFolder = $.getPathForRelativePath('');
    app.directive('fileinput', function (rest, filedata) {
        return {
            restrict: 'E',
            scope: {
                bind: '=',
                form: '='
            },
            templateUrl: currentFolder + 'fileinput.html',
            link: function (scope, iElement, iAttrs) {
                scope.taskCreationFormReady = function () {
                    return !!scope.form;
                };

                // Initialization
                scope.files = {};
                scope.remoteFile = {};
                scope.messages = {};

                // File list
                scope.fileList = {
                    // List of (uploaded or attached) file identifiers
                    identifiers: [],

                    // Refresh the list of uploaded files
                    refresh: function (callback) {
                        var _ref = this;
                        rest.files.list.exec(
                            // Success
                            function (response) {
                                _ref.identifiers = response;
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

                    getIndex: function (identifier) {
                        var index = null;
                        for (var i = 0; i < this.identifiers.length; i++) {
                            if (this.identifiers[i].id === identifier) {
                                index = i;
                                break;
                            }
                        }
                        return index;
                    },

                    getID: function (index) {
                        return this.identifiers[index].id;
                    },

                    setSelected: function (index) {
                        this.selectedFile = this.identifiers[index];
                    }
                };

                // File uploading
                scope.fileUpload = {
                    // Id of the input-file element
                    inputFileId: 'concreteFile',

                    // Are we uploading a file at the moment?
                    uploadingFile: false,

                    // Button for file uploading disabled?
                    isUploadDisabled: true,

                    // Identifier of the file to be uploaded
                    identifier: String(),

                    // Automatically fill the 'identifier' when a file is selected
                    fillIdentifier: function () {
                        var name = filedata.fileName(this.inputFileId);
                        this.isUploadDisabled = !name;
                        if (!name) {
                            name = text.randomId();
                        }

                        this.identifier = name;
                        scope.$apply();
                    },

                    // Upload the selected file
                    uploadFile: function () {
                        // Reference to self
                        var _ref = this;

                        // The file is now uploading. Hide the 'upload' button to prevent multiple uploads.
                        _ref.uploadingFile = true;

                        // Uploading the file asynchronously
                        sendData = function (fileData) {
                            rest.files.name(_ref.identifier).create.upload(filedata.fileObject(_ref.inputFileId)).exec(
                                // Success
                                function () {
                                    // The file has been uploaded successfully => refresh the list of available files
                                    scope.fileList.refresh(function (succes) {
                                        // Display a success message
                                        scope.messages.push('success', scope['msgtxt.uploadSuccessful']);

                                        // Sets the newly uploaded file as the selected one
                                        scope.fileList.setSelected(scope.fileList.getIndex(_ref.identifier));

                                        // Clear the fields
                                        _ref.identifier = String();
                                        filedata.clearInputFile(_ref.inputFileId);

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
                                    scope.messages.push('error', String.concat(
                                        scope['msgtxt.uploadFailure'], ' ',
                                        scope['msgtxt.errorDescription'], ' ',
                                        text.dotted(JSON.parse(response.data).payload.text, 50)
                                    ));

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

                // Remote file attaching
                scope.fileAttach = {
                    // Are we attaching a file at the moment?
                    attachingFile: false,

                    // Identifier of the file to be attached
                    identifier: String(),

                    // Location of the file to be attached
                    location: String(),
                    // Attach the selected file
                    attachFile: function () {
                        // Reference to self
                        var _ref = this;

                        // The file is now attaching. Hide the 'attach' button to prevent multiple attachments.
                        _ref.attachingFile = true;

                        // Send the REST request
                        rest.files.name(_ref.identifier).create.remote(_ref.location).exec(
                            // Success
                            function () {
                                // The file has been attached successfully => refresh the list of available files
                                scope.fileList.refresh(function (succes) {
                                    // Display a success message
                                    scope.messages.push('success', scope['msgtxt.attachSuccessful']);

                                    // Sets the newly attached file as the selected one
                                    scope.fileList.setSelected(scope.fileList.getIndex(_ref.identifier));

                                    // Clear the fields
                                    _ref.identifier = String();
                                    _ref.location = scope['deflocation'];

                                    // Another file may be uploaded again
                                    _ref.attachingFile = false;
                                });
                            },
                            // Failure
                            function (response) {
                                // The file has not been attached => display an error message
                                scope.messages.push('error', String.concat(
                                    scope['msgtxt.attachFailure'], ' ',
                                    scope['msgtxt.errorDescription'], ' ',
                                    text.dotted(JSON.parse(response.data).payload.text, 50)
                                ));

                                // A file may be uploaded again
                                _ref.attachingFile = false;
                            }
                        );
                    }
                };

                // Additional actions
                scope.fileList.refresh();

                // Public interface
                scope.bind.isFileSelected = function () {
                    var fl = scope.fileList;
                    return !!fl.selectedFile && !!fl.selectedFile.id;
                };

                scope.bind.getSelectedFile = function () {
                    if (!scope.bind.isFileSelected()) {
                        throw new Error('fileinput component: No file selected.');
                    }
                    return scope.fileList.selectedFile.id;
                };

                scope.bind.setSelectedFile = function (id) {
                    var fl = scope.fileList;
                    if (typeof(id) === 'string') {
                        timed.ready(function () { return !!fl.identifiers && (fl.identifiers.length > 0); }, function () {
                            fl.setSelected(fl.getIndex(id));
                            scope.$apply();
                        });
                    } else {
                        throw new Error('fileinput component: Unsupported argument id.');
                    }
                };

                scope.bind.pushAlert = function(type, text) {
                    scope.messages.push(type, text);
                };
            }
        }
    });

})();