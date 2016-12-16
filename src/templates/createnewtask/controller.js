(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Load submodules
    loadhelp.loadDefault();

    // Create a controller for task-creation screen
    app.controller('createnewtask-ctrl', function ($scope, $routeParams, filedata, rest, report) {

        // Template initialization
        $scope['taskCreation'] = {};

        // Initialization
        var reporting = report($scope);

        $scope.templFormat = {
            createTask: null,
            saveTask: null,
            creating: true
        };

        $scope.fileinput = {};

        $scope.alerts = {
            taskCreation: {
                identifier: {
                    type: 'error',
                    visible: false
                }
            }
        };

        //TODO smazat az bude na vyber,tj.
        //az to bude server umet, tak se dostupne kbs nastavi ze serveru

        //Supported knowledge bases
        $scope.availableKBs = ["DBpedia", "DBpedia Clone", "German DBpedia"];

        $scope.chosenKBs = ["DBpedia", "DBpedia Clone", "German DBpedia"];
        $scope.primaryKB = "DBpedia";

        $scope.automaticSelectPrimaryKB = function () {
            $scope.primaryKB = $scope.chosenKBs[0];
        };

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
                if (!objhelp.objRecurAccess($scope, 'taskCreation')['identifier']) {
                    valid = false;
                    $scope.alerts.taskCreation.identifier.visible = true;
                }

                // File selected?
                switch ($scope.fileProvision) {
                    case 'local':
                        if (!$scope.fileinput.isFileSelected()) {
                            valid = false;
                            $scope.fileinput.pushAlert('error', 'No file selected.');
                        }
                        break;
                    case 'remote':
                        if (!objhelp.objRecurAccess($scope, 'remoteFile')['location']) {
                            valid = false;
                            this.pushAlert('error', 'No remote file specified.');
                        }
                        break;
                }

                return valid;
            }
        };

        // Task creation
        $scope.templFormat.createTask = function (callback) {
            // Validate the form
            if (!$scope.wholeForm.validate()) {
                return;
            }

            // Generic preparations
            var fileId = $scope.fileinput.getSelectedFile();
            var taskId = $scope.taskCreation.identifier;

            // TODO: A loading icon should be displayed until the task is actually inserted on the server. If an error arises a tooltip / alert should be displayed.

            // Insert the task
            rest.tasks.name(taskId).create({
                id: String(taskId),
                created: (new Date()).toString(constants.formats.date),
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
				description: text.safe($scope.taskCreation.description)
            }).exec(
                // Success
                function (response) {
                    // Don't handle if further action was specified
                    if (callback) {
                        callback();
                        return;
                    }

                    // The task has been created, redirect to the task configurations screen
                    window.location.href = '#/taskconfigs/' + taskId;
                },
                // Failure
                function (response) {
                    reporting.error(response);
                }
            );
        };
        
        // Task creation + run
        $scope.templFormat.createAndRun = function () {
            $scope.templFormat.createTask(function () {
                // Prepare
                var taskId = $scope.taskCreation.identifier;
                var handler = function () {
                    // Just continue to the taskconfigs screen
                    window.location.href = '#/taskconfigs/' + taskId;
                };

                // Start the task
                rest.tasks.name(taskId).execute.exec(
                    // Execution started successfully
                    function (response) {
                        handler();
                    },
                    // Error while starting the execution
                    function (response) {
                        reporting.error(response);
                        handler();
                    }
                );
            });
        };

        // Task saving
        $scope.templFormat.saveTask = function () {
            // Validate the form
            if (!$scope.wholeForm.validate()) {
                return;
            }

            // Generic preparations
            var fileId = $scope.fileinput.getSelectedFile();
			var taskid = $scope.taskCreation.identifier;

            // TODO: A loading icon should be displayed until the task is actually inserted on the server. If an error arises a tooltip / alert should be displayed.

            // Insert the task
			rest.tasks.name(taskid).create({
				id: String(taskid),
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
				description: text.safe($scope.taskCreation.description)
            }).exec(
                // Success
                function (response) {
                    // The task has been updated, redirect to the task configurations screen
                    window.location.href = '#/taskconfigs/' + $scope.taskCreation.identifier;
                },
                // Failure
                function (response) {
                    reporting.error(response);
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
                        timed.ready(function () { return !!$scope.fileinput.setSelectedFile; }, function () {
                            $scope.fileinput.setSelectedFile(response.configuration.input);
                        });

                        // Fill the controls
                        objhelp.objRecurAccess($scope, 'taskCreation')['identifier'] = response.id;
                        $scope.taskCreation.description = response.description;
                        $scope.templFormat.creating = false;
                    },

                    // Failure to load the task's config
                    function (response) {
                        reporting.error(response);
                    }
                );
            }
        })();

    });

})();