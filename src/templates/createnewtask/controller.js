(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Load submodules
    loadhelp.loadDefault();

    // Create a controller for task-creation screen
    app.controller('createnewtask-ctrl', function ($scope, $routeParams, filedata, rest, formsval, reporth) {

        // Template initialization
        $scope['taskCreation'] = {};

        // Initialization
        $scope.templFormat = {
            createTask: null,
            saveTask: null,
            creating: true
        };
        $scope.linesLimit = {};
        $scope.fileinput = {};
        formsval.toScope($scope);

        // Dealing with knowledge bases
        (function () {
            // Supported knowledge bases
            $scope.kbs = {
                modifiableSelectedKBs: [],      // KBs that a primary base can be chosen from
                chosenKBs: [],                  // KBs that were selected

                availableKBs: [],               // All KBs
                modifiableKBs: [],              // KBs that can serve as a primary base
                primaryKB: null,
                
                // Change list of available KBs that can serve as a primary base upon selection change
                selectionChanged: function () {
                    var ref = this;
                    ref.modifiableSelectedKBs = [];

                    // Not the optimal algorithm, but the amount of KBs is assumed to be small
                    if (ref.modifiableKBs) {
                        ref.modifiableKBs.forEach(function (modifiableKB) {
                            if (ref.chosenKBs) {
                                ref.chosenKBs.forEach(function (kb) {
                                    if (kb.name === modifiableKB.name) {
                                        ref.modifiableSelectedKBs.push(modifiableKB);
                                    }
                                });
                            }
                        });
                    }
                }
            };

            // Retrieve the list of KBs from server
            rest.bases.list(false).exec(
                // Success
                function (response) {
                    // Set available KBs
                    $scope.kbs.availableKBs = response;

                    // Retrieve list of KBs that can serve as a primary KB
                    rest.bases.list(true).exec(
                        // Success
                        function (response) {
                            $scope.kbs.modifiableKBs = response;
                        },

                        // Failure
                        function (response) {
                            $scope.wholeForm.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.kbLoadFailure'], response.data));
                        }
                    );
                },
                // Failure
                function (response) {
                    $scope.wholeForm.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.kbLoadFailure'], response.data));
                }
            );
        })();

        $scope.wholeForm = {
            // Messages for a user
            alerts: {},

            // Validation of the form, whether everything is correctly filled; returns true, if it is safe to proceed
            validate: function () {
                return formsval.validateNonNested($scope.taskCreationForm);
            },

            getTaskObject: function () {
                var fileId = $scope.fileinput.getSelectedFile();
                var taskId = $scope.taskCreation.identifier;

                return {
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
                            name: $scope.kbs.primaryKB.name
                        },
                        rowsLimit: ($scope.linesLimit.selection == 'some') ? objhelp.test(text.safeInt($scope.linesLimit.value, null), null, '>= 1') : null
                    },
                    description: text.safe($scope.taskCreation.description)
                };
            }
        };

        // Task creation
        $scope.templFormat.createTask = function (callback) {
            // Validate the form
            if (!$scope.wholeForm.validate()) {
                return;
            }

            // Generic preparations
            var taskId = $scope.taskCreation.identifier;

            // TODO: A loading icon should be displayed until the task is actually inserted on the server. If an error arises a tooltip / alert should be displayed.

            // Insert the task
            rest.tasks.name(taskId).create($scope.wholeForm.getTaskObject()).exec(
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
                    $scope.wholeForm.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.createFailure'], response.data));
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
                        $scope.wholeForm.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.startFailure'], response.data));
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
            var taskid = $scope.taskCreation.identifier;

            // TODO: A loading icon should be displayed until the task is actually inserted on the server. If an error arises a tooltip / alert should be displayed.

            // Insert the task
            rest.tasks.name(taskid).create($scope.wholeForm.getTaskObject()).exec(
                // Success
                function (response) {
                    // The task has been updated, redirect to the task configurations screen
                    window.location.href = '#/taskconfigs/' + $scope.taskCreation.identifier;
                },
                // Failure
                function (response) {
                    $scope.wholeForm.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.saveFailure'], response.data));
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
                        // We are now editing an existing task, not creating a new one
                        var config = response.configuration;
                        $scope.templFormat.creating = false;

                        // Basic settings
                        objhelp.objRecurAccess($scope, 'taskCreation')['identifier'] = response.id;
                        $scope.taskCreation.description = response.description;

                        // Selected file
                        timed.ready(function () {
                            return !!$scope.fileinput.setSelectedFile;
                        }, function () {
                            $scope.fileinput.setSelectedFile(config.input);
                        });

                        // Lines limit
                        if (config.rowsLimit) {
                            $scope.linesLimit = {
                                selection: 'some',
                                value: config.rowsLimit
                            };
                        }
                    },

                    // Failure to load the task's config
                    function (response) {
                        $scope.wholeForm.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.loadFailure'], response.data));
                    }
                );
            }
        })();

    });

})();