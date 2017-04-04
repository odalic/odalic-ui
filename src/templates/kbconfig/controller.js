(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Current folder
    var currentFolder = $.getPathForRelativePath('');

    // Create a controller for task-creation screen
    app.controller('odalic-kbconfig-ctrl', function ($scope, $uibModal, $routeParams, filedata, rest, formsval, reporth) {

        // TODO: asi to bude chciet pagination na predicate sets
        // TODO: confirm modal pri prepisani configu, save + cancel buttons
        // TODO: ukladanie dat (prechod medzi predsets config - zrejme pouzit chain, kedze len 2 obrazovky)
        // TODO: pokial je v route zadana sucasna kb
        // TODO: pokial je v route propertySets zadana sucasna PS

        // Initialization
        $scope.predicateSetsProxy = {};
        formsval.toScope($scope);

        // Data mapping
        $scope.pageVariables = {
            name: new String(),
            description: new String(),
            sparqlEndpoint: new String(),
            type: 'dbpedia',
            cachePath: new String(),
            stoplistPath: new String(),
            fulltextMode: 'nofulltext',
            languageSuffix: new String(),
            classTypeMode: 'direct',
            instanceOfPred: new String(),
            domainPred: new String(),
            rangePred: new String(),
            selectMode: 'autodetect',
            get predicateSets() {
                var ps = [];
                $scope.predicateSets.forEach(function (record) {
                    if (record.selected) {
                        ps.push(record);
                    }
                });

                return ps;
            },
            insertEnabled: false,
            insertGraph: new String(),
            schemaPrefix: new String(),
            resourcePrefix: new String(),
            defaultClass: new String(),
            labelPred: new String(),
            altLabelPred: new String(),
            subclassOfPred: new String(),
            subpropertyOfPred: new String(),
            subpropertyOfPred: new String(),
            propertyType: new String(),
        };

        // Load predicate sets
        var loadPredicateSets = function () {
            // TODO: The placeholder predicate sets is only temporary
            $scope.predicateSets = [];
            for (var i = 0; i < 15; i++) {
                $scope.predicateSets.push({
                    selected: (Math.random()*2 > 1) ? true : false,
                    name: (new String()).concat('PS Name', ' ', i)
                });
            }

            // Update pagination directive
            $scope.predicateSetsProxy.model = $scope.predicateSets;
            $scope.$broadcast('pagination');
        };

        // Predicate sets initialization
        $scope.predicateSets = [];
        loadPredicateSets();

        // Configure a predicate set
        $scope.fconfigure = function (psID) {
            window.location.href = text.urlConcat('#', 'setproperties/', psID);
        };

        // Remove a predicate set
        $scope.fremove = function (psID) {
            // TODO: Remove
            loadPredicateSets();
        };

        // Add to predicate sets
        $scope.psAdd = function () {
            // TODO: Save current state
            window.location.href = '#/setproperties/';
        };

        // // Initialization
        // $scope.taskCreation = {};
        // $scope.templFormat = {
        //     createTask: null,
        //     saveTask: null,
        //     creating: true
        // };
        // $scope.linesLimit = {};
        // $scope.fileinput = {};
        // $scope.statistical = {};
        // $scope.confirm = {};
        //
        // // Additional variables
        // var kbListLoaded = false;
        // var formerTaskObj = {};
        //
        // // Dealing with knowledge bases
        // (function () {
        //     // Supported knowledge bases
        //     $scope.kbs = {
        //         modifiableSelectedKBs: [],      // KBs that a primary base can be chosen from
        //         chosenKBs: [],                  // KBs that were selected
        //
        //         availableKBs: [],               // All KBs
        //         modifiableKBs: [],              // KBs that can serve as a primary base
        //         primaryKB: null,
        //
        //         // Change list of available KBs that can serve as a primary base upon selection change
        //         selectionChanged: function () {
        //             var ref = this;
        //             ref.modifiableSelectedKBs = [];
        //
        //             // Not the optimal algorithm, but the amount of KBs is assumed to be small
        //             if (ref.modifiableKBs) {
        //                 ref.modifiableKBs.forEach(function (modifiableKB) {
        //                     if (ref.chosenKBs) {
        //                         ref.chosenKBs.forEach(function (kb) {
        //                             if (kb.name === modifiableKB.name) {
        //                                 ref.modifiableSelectedKBs.push(modifiableKB);
        //                             }
        //                         });
        //                     }
        //                 });
        //             }
        //         },
        //
        //         // Updates "chosenKBs" and "primaryKB" according to arguments (string names of KBs); chosenKBs has to be an array
        //         setBases: function (chosenKBs, primaryKB) {
        //             if (!this.availableKBs) {
        //                 return;
        //             }
        //
        //             var ref = this;
        //             var chosenKBsObjs = [];
        //
        //             // Again not the most optimal approach, but should not matter...
        //             chosenKBs.forEach(function (kbString) {
        //                 ref.availableKBs.forEach(function (kbObj) {
        //                     if (kbObj.name === kbString.name) {
        //                         chosenKBsObjs.push(kbObj);
        //                     }
        //                 })
        //             });
        //
        //             ref.chosenKBs = chosenKBsObjs;
        //             ref.selectionChanged();
        //
        //             // Find the primary base among "modifiableKBs" list
        //             if (ref.modifiableKBs) {
        //                 ref.modifiableKBs.forEach(function (kbObj) {
        //                     if (kbObj.name === primaryKB.name) {
        //                         ref.primaryKB = kbObj;
        //                     }
        //                 })
        //             }
        //         }
        //     };
        //
        //     // Retrieve the list of KBs from server
        //     rest.bases.list(false).exec(
        //         // Success
        //         function (response) {
        //             // Set available KBs
        //             $scope.kbs.availableKBs = response;
        //
        //             // Retrieve list of KBs that can serve as a primary KB
        //             rest.bases.list(true).exec(
        //                 // Success
        //                 function (response) {
        //                     $scope.kbs.modifiableKBs = response;
        //                     kbListLoaded = true;
        //                 },
        //
        //                 // Failure
        //                 function (response) {
        //                     $scope.wholeForm.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.kbLoadFailure'], response.data));
        //                     kbListLoaded = true;
        //                 }
        //             );
        //         },
        //         // Failure
        //         function (response) {
        //             $scope.wholeForm.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.kbLoadFailure'], response.data));
        //             kbListLoaded = true;
        //         }
        //     );
        // })();
        //
        // $scope.wholeForm = {
        //     // Messages for a user
        //     alerts: {},
        //
        //     // Validation of the form, whether everything is correctly filled; returns true, if it is safe to proceed
        //     validate: function () {
        //         return formsval.validateNonNested($scope.taskCreationForm);
        //     },
        //
        //     getTaskObject: function (forcedFeedback) {
        //         var fileId = $scope.fileinput.getSelectedFile();
        //         var taskId = $scope.taskCreation.identifier;
        //         var emptyFeedback = {
        //             columnIgnores: [],
        //             classifications: [],
        //             columnAmbiguities: [],
        //             ambiguities: [],
        //             disambiguations: [],
        //             columnRelations: []
        //         };
        //
        //         return {
        //             id: String(taskId),
        //             created: (new Date()).toString("yyyy-MM-dd HH:mm"),
        //             configuration: {
        //                 input: fileId,
        //                 feedback: objhelp.getFirstArg(forcedFeedback, emptyFeedback),
        //                 primaryBase: {
        //                     name: $scope.kbs.primaryKB.name
        //                 },
        //                 usedBases: $scope.kbs.chosenKBs,
        //                 rowsLimit: ($scope.linesLimit.selection == 'some') ? objhelp.test(text.safeInt($scope.linesLimit.value, null), null, '>= 1') : null,
        //                 statistical: $scope.statistical.value
        //             },
        //             description: text.safe($scope.taskCreation.description)
        //         };
        //     }
        // };
        //
        // // Running task upon save/creation
        // var runTask = function (errorMsg) {
        //     // Prepare
        //     var taskId = $scope.taskCreation.identifier;
        //     var handler = function () {
        //         // Just continue to the taskconfigs screen
        //         window.location.href = '#/taskconfigs/' + taskId;
        //     };
        //
        //     // Start the task
        //     rest.tasks.name(taskId).execute.exec(
        //         // Execution started successfully
        //         function (response) {
        //             handler();
        //         },
        //         // Error while starting the execution
        //         function (response) {
        //             $scope.wholeForm.alerts.push('error', reporth.constrErrorMsg($scope[errorMsg], response.data));
        //             f();
        //         }
        //     );
        // };
        //
        // // Task creation
        // $scope.templFormat.createTask = function (f, callback) {
        //     // Validate the form
        //     if (!$scope.wholeForm.validate()) {
        //         f();
        //         return;
        //     }
        //
        //     // Generic preparations
        //     var taskId = $scope.taskCreation.identifier;
        //
        //     // Task creation
        //     var create = function () {
        //         rest.tasks.name(taskId).create($scope.wholeForm.getTaskObject()).exec(
        //             // Success
        //             function (response) {
        //                 // Don't handle if further action was specified
        //                 if (callback) {
        //                     callback();
        //                     return;
        //                 }
        //
        //                 // The task has been created, redirect to the task configurations screen
        //                 window.location.href = '#/taskconfigs/' + taskId;
        //             },
        //             // Failure
        //             function (response) {
        //                 $scope.wholeForm.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.createFailure'], response.data));
        //                 f();
        //             }
        //         );
        //     };
        //
        //     // Insert the task, if everything is OK
        //     rest.tasks.name(taskId).exists(
        //         // The task already exists => confirm overwrite
        //         function () {
        //             $scope.confirm.open(function (response) {
        //                 if (response === true) {
        //                     create();
        //                 } else {
        //                     f();
        //
        //                     // Clicking outside of the modal is not registered by angular, but clicking on the modal button is => manually call digest cycle if necessary
        //                     if (!$scope.$$phase) {
        //                         $scope.$apply();
        //                     }
        //                 }
        //             });
        //         },
        //
        //         // The task does not exist yet => create without any prompt
        //         create
        //     );
        // };
        //
        // // Task creation + run
        // $scope.templFormat.createAndRun = function (f) {
        //     $scope.templFormat.createTask(f, function () {
        //         runTask('msgtxt.startFailure');
        //     });
        // };
        //
        // // Task saving
        // $scope.templFormat.saveTask = function (f, callback) {
        //     // Validate the form
        //     if (!$scope.wholeForm.validate()) {
        //         f();
        //         return;
        //     }
        //
        //     // Generic preparations
        //     var taskid = $scope.taskCreation.identifier;
        //     var taskObj = $scope.wholeForm.getTaskObject();
        //     var taskObjDiff = objhelp.objCompare(formerTaskObj, taskObj);
        //
        //     // On error
        //     var error = function (response) {
        //         $scope.wholeForm.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.saveFailure'], response.data));
        //         f();
        //     };
        //
        //     // Inserting the task
        //     var insert = function (taskObj) {
        //         rest.tasks.name(taskid).create(taskObj).exec(
        //             // Success
        //             function (response) {
        //                 // Don't handle if further action was specified
        //                 if (callback) {
        //                     callback();
        //                     return;
        //                 }
        //
        //                 // The task has been updated, redirect to the task configurations screen
        //                 window.location.href = '#/taskconfigs/' + $scope.taskCreation.identifier;
        //             },
        //             // Failure
        //             function (response) {
        //                 error(response);
        //             }
        //         );
        //     };
        //
        //     // Possible to save the task without nullifying already-computed result?
        //     if ((taskObjDiff.length <= 1) &&
        //         (taskObjDiff.length == 0 || taskObjDiff[0] == 'description')) {
        //         // Load the current feedback and then use it to create a new task object
        //         rest.tasks.name(taskid).feedback.retrieve.exec(
        //             // Success
        //             function (response) {
        //                 insert($scope.wholeForm.getTaskObject(response));
        //             },
        //             // Failure
        //             function (response) {
        //                 error(response);
        //             }
        //         );
        //     } else {
        //         // Save the task using empty feedback
        //         insert(taskObj);
        //     }
        // };
        //
        // // Task save + run
        // $scope.templFormat.saveAndRun = function (f) {
        //     $scope.templFormat.saveTask(f, function () {
        //         runTask('msgtxt.startFailure');
        //     });
        // };
        //
        // // Going back
        // $scope.templFormat.goBack = function () {
        //     window.location.href = text.urlConcat('#', 'taskconfigs', $scope.templFormat.creating ? new String() : text.safe($scope.taskCreation.identifier));
        // };
        //
        // // Preloading form controls (if applicable), or creation of a completely new task
        // (function () {
        //     var TaskID = $routeParams['taskid'];
        //     if (TaskID) {
        //         rest.tasks.name(TaskID).retrieve.exec(
        //             // Success
        //             function (response) {
        //                 // $scope.apply after all timed tasks are finished
        //                 var timedTasks = 2;
        //
        //                 // We are now editing an existing task, not creating a new one
        //                 var config = response.configuration;
        //                 $scope.templFormat.creating = false;
        //
        //                 // Basic settings
        //                 objhelp.objRecurAccess($scope, 'taskCreation')['identifier'] = response.id;
        //                 $scope.taskCreation.description = response.description;
        //                 $scope.statistical.value = config.statistical;
        //
        //                 // Selected file
        //                 timed.ready(function () {
        //                     return !!$scope.fileinput.setSelectedFile;
        //                 }, function () {
        //                     $scope.fileinput.setSelectedFile(config.input);
        //                     timedTasks--;
        //                 });
        //
        //                 // Selected knowledge bases
        //                 timed.ready(function () {
        //                     return kbListLoaded;
        //                 }, function () {
        //                     $scope.kbs.setBases(config.usedBases, config.primaryBase);
        //                     timedTasks--;
        //                 });
        //
        //                 // Lines limit
        //                 if (config.rowsLimit) {
        //                     $scope.linesLimit = {
        //                         selection: 'some',
        //                         value: config.rowsLimit
        //                     };
        //                 }
        //
        //                 // When all of the timed tasks are finished, update
        //                 timed.ready(function () {
        //                     return timedTasks <= 0;
        //                 }, function () {
        //                     formerTaskObj = $scope.wholeForm.getTaskObject();
        //                     if (!$scope.$$phase) {
        //                         $scope.$apply();
        //                     }
        //                 });
        //             },
        //
        //             // Failure to load the task's config
        //             function (response) {
        //                 $scope.wholeForm.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.loadFailure'], response.data));
        //             }
        //         );
        //     }
        // })();

    });

})();