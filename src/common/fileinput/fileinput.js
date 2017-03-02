(function () {

    // Main module
    var app = angular.module('odalic-app');

    var currentFolder = $.getPathForRelativePath('');
    app.directive('fileinput', function ($filter, rest, filedata, reporth, formsval) {
        return {
            restrict: 'E',
            scope: {
                bind: '=',
                form: '='
            },
            templateUrl: currentFolder + 'fileinput.html',
            link: function (scope, iElement, iAttrs) {

                // Is the form ready?
                scope.taskCreationFormReady = function () {
                    return !!scope.form;
                };

                // Initialization
                formsval.toScope(scope);
                scope.confirm = {};
                scope.files = {};
                scope.remoteFile = {};
                scope.messages = {};
                scope.fileconfig = {};

                // File list
                scope.fileList = {
                    // File selection enabled?
                    fileSelection: (iAttrs['selection'] === 'true'),

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

                // Miscellaneous
                var testOverwrite = function (fileId, process, fallback) {
                    rest.files.name(fileId).exists(
                        // The file already exists => confirm overwrite
                        function () {
                            scope.confirm.open(function (response) {
                                if (response === true) {
                                    process();
                                } else {
                                    // Overwrite rejected => do some 'cleaning'
                                    fallback();

                                    // Clicking outside of the modal is not registered by angular, but clicking on the modal button is => manually call digest cycle if necessary
                                    if (!scope.$root.$$phase) {
                                        scope.$apply();
                                    }
                                }
                            });
                        },
                        // The file does not exist yet => continue without any prompt
                        process
                    );
                };

                // File uploading
                scope.fileUpload = {
                    // Id of the input-file element
                    inputFileId: 'concreteFile',

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

                        this.identifier =  $filter('conform')(name, '-a-zA-Z0-9_., ');
                        if (!scope.$$phase) {
                            scope.$apply();
                        }
                    },

                    // Upload the selected file
                    uploadFile: function (f) {
                        // Validate
                        if (!formsval.validate(scope.localFileForm)) {
                            f();
                            return;
                        }

                        // Reference to self
                        var _ref = scope.fileUpload;

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
                                        _ref.identifier = new String();
                                        filedata.clearInputFile(_ref.inputFileId);
                                        scope.form.localFileForm.$setPristine();

                                        // Another file may be uploaded again
                                        f();
                                        _ref.isUploadDisabled = true;

                                        // Clear chosen file
                                        angular.element("input[type='file']").val(null);
                                    });
                                },
                                // Failure
                                function (response) {
                                    // The file has not been uploaded => display an error message
                                    scope.messages.push('error', reporth.constrErrorMsg(scope['msgtxt.uploadFailure'], response.data));

                                    // A file may be uploaded again
                                    f();
                                }
                            );
                        };

                        // Read the file and send the data to server
                        var process = function () {
                            filedata.readBase64(_ref.inputFileId,
                                // Success
                                function (fileData) {
                                    sendData(fileData);
                                },
                                // Failure
                                function (response) {
                                    scope.messages.push('error', (new String()).concat(scope['msgtxt.uploadFailure'], ' ', response));

                                    // A file may be uploaded again
                                    f();
                                }
                            );
                        };

                        // Insert the file, if everything is OK
                        testOverwrite(_ref.identifier, process, f);
                    }
                };

                // Remote file attaching
                scope.fileAttach = {
                    // Identifier of the file to be attached
                    identifier: String(),

                    // Location of the file to be attached
                    location: String(),

                    // Attach the selected file
                    attachFile: function (f) {
                        // Reference to self
                        var _ref = scope.fileAttach;

                        // Send the REST request
                        var process = function () {
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
                                        _ref.identifier = new String();
                                        _ref.location = scope['deflocation'];
                                        scope.form.remoteFileForm.$setPristine();

                                        // Another file may be uploaded again
                                        f();
                                    });
                                },
                                // Failure
                                function (response) {
                                    // The file has not been attached => display an error message
                                    scope.messages.push('error', reporth.constrErrorMsg(scope['msgtxt.attachFailure'], response.data));

                                    // A file may be uploaded again
                                    f();
                                }
                            );
                        };

                        // Attach the file, if everything is OK
                        testOverwrite(_ref.identifier, process, f);
                    }
                };

                // File configuration
                scope.configureFile = function () {
                    scope.fileconfig.identifier = scope.bind.getSelectedFile();
                    scope.fileconfig.open();
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