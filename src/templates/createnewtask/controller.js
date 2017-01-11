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

        //TODO smazat az bude na vyber,tj.
        //az to bude server umet, tak se dostupne kbs nastavi ze serveru

        //Supported knowledge bases
        // TODO: Temporarily this way! Improvement needed!
        // Fallback to default:
        $scope.kbs = {
            chosenKBs: [],
            availableKBs: [
                { name: 'DBpedia' },
                { name: 'DBpedia Clone' },
                { name: 'German DBpedia' }
            ],
            primaryKB: { name: 'DBpedia' }
        };
        rest.bases.list(false).exec(
            // Success
            function (response) {
                console.log(response);
                $scope.kbs.availableKBs = response;
            },

            // Failure
            function (response) {
                // Log and ignore. Hopefully won't happen.
                console.warn('Could not load KB list. Reponse:');
                console.warn(response);
            }
        );

        $scope.automaticSelectPrimaryKB = function () {
            var chosen = $scope.kbs.chosenKBs;
            if (chosen && (chosen.length > 0)) {
                $scope.kbs.primaryKB = chosen[0];
            }
        };



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