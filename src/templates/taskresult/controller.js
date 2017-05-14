(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Load submodules
    loadhelp.loadDefault();

    // Create a controller for taskconfig
    app.controller('taskresult-ctrl', function ($scope, $routeParams, $location, $window, requests, rest, responsep, $uibModal) {

        // The task's ID
        var TaskID = $routeParams['taskid'];
        $scope.taskID = TaskID;

        //region Initialization of objects which save user changes
        $scope.feedback = {};
        $scope.ignoredColumn = {};
        $scope.compulsory = {};
        $scope.noDisambiguationColumn = {};
        $scope.noDisambiguationCell = {};
        $scope.locked = {};
        $scope.isColumnSubject = {};

        $scope.selectedPosition = {
            column: -1,
            row: -1
        };

        $scope.selectedRelation = {
            column1: 0,
            column2: 0
        };

        $scope.inputFile = {
            'columns': [],
            'rows': []
        };
        //endregion

        //region Loading data from server
        (function () {

            // Initialization
            $scope.dataload = {};
            $scope.resview = 'undefined';

            // Phases enum
            var phases = {
                input: 1,
                result: 2,
                kb: 3,
                fb: 4
            };

            // Additional actions to take upon complete data load
            var actions = [];

            // To call when a certain phase is loaded
            var dataLoaded = (function () {
                var loads = {};

                return function (phase) {
                    loads[phase] = true;

                    // Are there any additional phases, or was everything already loaded?
                    var empty = true;
                    objhelp.objForEach(phases, function (key, value) {
                        if (!(value in loads)) {
                            empty = false;
                        }
                    });

                    // Everything was loaded => handle and then show the data
                    if (empty) {
                        actions.forEach(function (f) {
                            f();
                        });

                        $scope.resview = 'view';
                        $scope.dataload.show = true;

                        // Force rendering of the result wen testing
                        //$scope.$apply();
                    }
                };
            })();

            // To call when a certain phase fails
            var dataLoadFail = (function () {
                var called = false;

                return function (response) {
                    // May be called only once
                    if (called) {
                        return;
                    }
                    called = true;

                    // Prepare data to display
                    var ro = $scope.failurev = responsep(response);
                    ro.description = text.safe2(ro.description, '-');
                    ro.message = text.safe2(ro.message, '-');

                    // Switch to 'Failure' display
                    $scope.resview = 'failure';

                    // Show
                    $scope.dataload.show = true;
                };
            })();

            //region Download the input CSV file in a JSON format directly
            rest.tasks.name($scope.taskID).input.retrieve.exec(
                // Success, inject into the scope
                function (response) {
                    $scope.inputFile = {
                        'columns': response.headers,
                        'rows': response.rows
                    };

                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }

                    // Prepare data for pagination
                    actions.push(function () {
                        $scope.inputFileProxy = {
                            model: $scope.inputFile.rows
                        };
                    });

                    // Phase complete
                    dataLoaded(phases.input);
                },

                // Error
                function (response) {
                    dataLoadFail(response);
                }
            );
            //endregion

            //region Load the result
            rest.tasks.name($scope.taskID).result.retrieve.exec(
                // Success
                function (response) {
                    $scope.result = response;

                    // Prepare data for graphvis component and data cube
                    actions.push(function () {
                        setsData();
                        setsDataCube();
                    });
                    
                    // Phase complete
                    dataLoaded(phases.result);
                },

                // Fatal error, result not loaded or task resulted in an error
                function (response) {
                    dataLoadFail(response);
                }
            );
            //endregion

            //region Set knowledge bases
            rest.tasks.name($scope.taskID).retrieve.exec(
                // Success
                function (response) {
                    var config = response['configuration'];

                    // Chosen KBs
                    $scope.chosenKBs = [];
                    config['usedBases'].forEach(function (kb) {
                        $scope.chosenKBs.push(kb['name']);
                    });

                    // Primary KB
                    $scope.primaryKB = config['primaryBase']['name'];

                    // Statistical data flag
                    $scope.statistical = config['statistical'];

                    //statistical data have only 2 result pages (classification table and tables for data cube)
                    //nonstatistical data have 3 result pages(classification table, subject column page and relation graph)
                    if ($scope.statistical == true) {
                        $scope.numberOfPages = 1;
                    }
                    else {
                        $scope.numberOfPages = 2;
                    }

                    // Phase complete
                    dataLoaded(phases.kb);
                },

                // Error
                function (response) {
                    dataLoadFail(response);
                }
            );
            //endregion

            //region Load the last feedback
            rest.tasks.name($scope.taskID).feedback.retrieve.exec(
                function (response) {
                    $scope.serverFeedback = response;

                    // Feedback from server retrieved. Set the UI accordingly.
                    actions.push(function () {
                        setLockedFlags();
                        setIgnoreThings();
                    });

                    // Phase complete
                    dataLoaded(phases.fb);
                },
                // Error
                function (response) {
                    dataLoadFail(response);
                }
            );
            //endregion
        })();

        //prepares json for page with data cube
        setsDataCube = function () {
            if ($scope.statistical == true) {
                for (var index in $scope.result.statisticalAnnotations) {
                    var predicateObj = $scope.result.statisticalAnnotations[index];
                    var predicate = predicateObj.predicate;

                    //adds level candidate and chosen because of same interface as relation
                    predicate.candidates = {};
                    predicate.candidates[$scope.primaryKB] = angular.copy(predicate[$scope.primaryKB]);
                    predicate.chosen = {};
                    predicate.chosen[$scope.primaryKB] = angular.copy(predicate[$scope.primaryKB]);


                    var header = $scope.inputFile.columns[index];
                    //adds headers for data cube table
                    predicateObj.label = header;
                    //adds index because we need to know which item is modified
                    predicateObj.index = index;
                }
            }
        }

        $scope.serverFeedback = {};


        //region dependent on data from server
        //sets data for graph component
        $scope.currentRelations = {};
        setsData = function () {
            // TODO: Own relation? Takto?
            objhelp.objForEach($scope.result.columnRelationAnnotations, function (column1, collect1) {
                objhelp.objForEach(collect1, function (column2, collect2) {

                    // Create a fake candidate for custom relations
                    objhelp.objRecurAccess($scope.result, column1, column2, 'chosen')['other'] = [
                        {
                            "entity": {
                                "resource": "",
                                "label": ""
                            },
                            "score": 1
                        }
                    ];
                });
            });

            // Load the graphvis directive when the data is ready
            loadGraphVis();
        };

        setIgnoreThings = function () {

            // Column ignores
            var fbcignores = $scope.serverFeedback.columnIgnores;
            fbcignores.forEach(function (c) {
                $scope.ignoredColumn[c.position.index] = true;
            });

            var fbcCompulsory = $scope.serverFeedback.columnCompulsory;
            fbcCompulsory.forEach(function (c) {
                $scope.compulsory[c.position.index] = true;
            });

            // Column ambiguities
            var fbcambigs = $scope.serverFeedback.columnAmbiguities;
            fbcambigs.forEach(function (c) {
                $scope.noDisambiguationColumn[c.position.index] = true;
            });

            // Cell ambiguities
            var fblambigs = $scope.serverFeedback.ambiguities;
            fblambigs.forEach(function (l) {
                var r = l.position.rowPosition.index;
                var c = l.position.columnPosition.index;
                objhelp.objRecurAccess($scope.noDisambiguationCell, r)[c] = true;
            });




            var columnCount = $scope.result.cellAnnotations[0].length;

            //sets subject columns  flags from feedback
            for (var i in $scope.chosenKBs) {
                var kb = $scope.chosenKBs[i];
                $scope.isColumnSubject[kb] = {};
                for (var c = 0; c < columnCount; c++) {
                    var scp = $scope.serverFeedback.subjectColumnsPositions;
                    var rscp =  $scope.result.subjectColumnsPositions;
                    if ((scp.hasOwnProperty(kb) && scp[kb].some(function(e) {return e.index == c})) ||
                        (rscp.hasOwnProperty(kb) && rscp[kb].some(function(e) {return e.index == c}))) {
                        $scope.isColumnSubject[kb][c] = 1;
                    }
                    else {
                        $scope.isColumnSubject[kb][c] = 0;
                    }
                }
            }
        };

        setLockedFlags = function () {
            var columnCount = $scope.result.cellAnnotations[0].length;
            var rowCount = $scope.result.cellAnnotations.length;

            //default classification locking (set to 'no-lock')
            $scope.locked.tableCells = {};
            $scope.locked.tableCells[-1] = {};
            for (var c = 0; c < columnCount; c++) {
                $scope.locked.tableCells[-1][c] = 0;
            }

            //classification locking from server feedback
            for (var index in $scope.serverFeedback.classifications) {
                var column = $scope.serverFeedback.classifications[index].position.index;
                $scope.locked.tableCells[-1][column] = 1;
            }

            //default disambiguation locking (set to 'no-lock')
            for (var r = 0; r < rowCount; r++) {
                $scope.locked.tableCells[r] = {};
                for (var c = 0; c < columnCount; c++) {
                    $scope.locked.tableCells[r][c] = 0;
                }
            }

            //disambiguation locking from server feedback
            for (var index in  $scope.serverFeedback.disambiguations) {
                var row = $scope.serverFeedback.disambiguations[index].position.rowPosition.index;
                var column = $scope.serverFeedback.disambiguations[index].position.columnPosition.index;
                $scope.locked.tableCells[row][column] = 1;
            }


            //subject columns server locking
            $scope.locked.subjectColumns = {};
            for (var i in $scope.chosenKBs) {
                var kb = $scope.chosenKBs[i];
                $scope.locked.subjectColumns[kb] = {};
                for (var c = 0; c < columnCount; c++) {
                    var scp = $scope.serverFeedback.subjectColumnsPositions;
                    if (scp.hasOwnProperty(kb) && scp[kb].some(function(e) {return e.index == c})) {
                        $scope.locked.subjectColumns[kb][c] = 1;
                    }
                    else {
                        $scope.locked.subjectColumns[kb][c] = 0;
                    }
                }
            }



            //default relations locking (set to 'no-lock')
            $scope.locked.graphEdges = {};
            for (var c1 = 0; c1 < columnCount; c1++) {
                $scope.locked.graphEdges[c1] = {};
                for (var c2 = 0; c2 < columnCount; c2++) {
                    if (c1 != c2) {
                        $scope.locked.graphEdges[c1][c2] = 0;
                    }
                }
            }

            //default statistical locking (set to 'no-lock'
            $scope.locked.statisticalData = {};
            for (var c2 = 0; c2 < columnCount; c2++) {
                $scope.locked.statisticalData[c2] = 0;
            }

            //relations locking from server feedback
            var fbrel = $scope.serverFeedback.columnRelations;
            for (var index in fbrel) {
                var column1 = fbrel[index].position.first.index;
                var column2 = fbrel[index].position.second.index;
                $scope.locked.graphEdges[column1][column2] = 1;
            }

            var fbrel = $scope.serverFeedback.dataCubeComponents;
            for (var index in fbrel) {
                var column = fbrel[index].position.index;
                $scope.locked.statisticalData[column] = 1;
            }
        };
        //endregion
        // ****************************************
        // Loading of the necessary resources finishes here
        //endregion4


        // region Handling graphvis directive
        // **************************************
        function loadGraphVis() {
            // Initialization
            if (!$scope.gvdata) {
                $scope.gvdata = {};
            }

            // Set the necessary data
            $scope.gvdata.vertices = $scope['inputFile']['columns'];
            $scope.gvdata.result = $scope['result'];
            $scope.gvdata.edgeClick = function (c1, c2) {
                with ($scope.selectedRelation) {
                    column1 = c1;
                    column2 = c2;
                }

                if (!$scope.$$phase) {
                    $scope.$apply();
                }
                $scope.openRSelection();

            };

            // $scope.locked.graphEdges is not initialized at this point, therefore we will use a delayed initialization
            timed.ready(
                function () {
                    return (!!$scope['locked'] && !!$scope['locked']['graphEdges'])
                },
                function () {
                    $scope.gvdata.lockobj = $scope['locked']['graphEdges'];
                }
            );

            // Calls modelChanged on the currently selected relation.
            $scope.gvdata.mc = function () {
                $scope.gvdata.modelChanged(
                    $scope.selectedRelation.column1,
                    $scope.selectedRelation.column2
                );
            };
        }

        //calls cd proposal modal window
        $scope.openCDProposal = function () {
            $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: "src/templates/taskresult/view/classdisam/cdmodalproposal/cdproposalcontent/cdproposalcontent.html",
                controller: 'cDProposeController',
                resolve: {
                    data: function () {
                        return {
                            selectedPosition: $scope.selectedPosition,
                            result: $scope.result,
                            locked: $scope.locked,
                            primaryKB: $scope.primaryKB
                        }
                    }
                }
            });
        };

        //calls cd proposal modal window
        $scope.openRProposal = function (index) {
            //sets non existing chosen domain and range to empty string
            var chosenD = $scope.result.headerAnnotations[$scope.selectedRelation.column1].chosen[$scope.primaryKB];
            var domain = (chosenD.length == 0) ? "" : chosenD[0].entity.resource;

            var chosenR = $scope.result.headerAnnotations[$scope.selectedRelation.column2].chosen[$scope.primaryKB]
            var range = (chosenR.length == 0) ? "" : chosenR[0].entity.resource;

            $uibModal.open({
                templateUrl: "src/templates/taskresult/view/relations/rmodalselection/rmodalproposal/rmodalproposal.html",
                controller: 'rProposeController',
                resolve: {
                    data: function () {
                        return {
                            gvdata: $scope.gvdata,
                            selectedRelation: $scope.selectedRelation,
                            domain: domain,
                            range: range,
                            locked: function () {
                                $scope.locked.graphEdges[$scope.selectedRelation.column1][$scope.selectedRelation.column2] = 1
                            },
                            currentRelation: $scope.result.columnRelationAnnotations[$scope.selectedRelation.column1][$scope.selectedRelation.column2],
                            primaryKB: $scope.primaryKB
                        }
                    }
                }
            });
        };


        //calls cd selection modal window
        $scope.openCDSelection = function () {
            $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: "src/templates/taskresult/view/classdisam/cdmodalselection/cdmodalselection.html",
                controller: 'cDSelectionController',
                resolve: {
                    data: function () {
                        return {
                            selectedPosition: $scope.selectedPosition,
                            result: $scope.result,
                            locked: $scope.locked,
                            primaryKB: $scope.primaryKB,
                            openCDProposal: $scope.openCDProposal,
                            ignoredColumn: $scope.ignoredColumn,
                            compulsory: $scope.compulsory,
                            noDisambiguationCell: $scope.noDisambiguationCell,
                            noDisambiguationColumn: $scope.noDisambiguationColumn

                        }

                    }
                }

            });
        };

        //calls cd proposal modal window

        //calls r selection modal window
        $scope.openRSelection = function () {
            //creates levels of json if they are missing
            objhelp.objRecurAccess($scope.result.columnRelationAnnotations, $scope.selectedRelation.column1, $scope.selectedRelation.column2, 'candidates');
            var currentRelation = $scope.result.columnRelationAnnotations[$scope.selectedRelation.column1][$scope.selectedRelation.column2];
            objhelp.objRecurAccess(currentRelation, 'chosen');
            for (var i in  $scope.chosenKBs) {
                var KB = $scope.chosenKBs[i];
                if (!currentRelation.candidates.hasOwnProperty(KB)) {
                    currentRelation.candidates[KB] = [];
                }

                if (!currentRelation.chosen.hasOwnProperty(KB)) {
                    currentRelation.chosen[KB] = [];
                }
            }

            $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: "src/templates/taskresult/view/relations/rmodalselection/rmodalselection.html",
                controller: 'rSelectionController',
                resolve: {
                    data: function () {
                        return {
                            gvdata: $scope.gvdata,
                            primaryKB: $scope.primaryKB,
                            locked: $scope.locked.graphEdges[$scope.selectedRelation.column1],
                            selectedRelation: $scope.selectedRelation,
                            result: $scope.result,
                            currentRelation: currentRelation,
                            openRProposal: $scope.openRProposal,
                            chosenKBs: $scope.chosenKBs

                        }
                    }
                }

            });
        };
        
        // Miscellaneous functions
        $scope.miscellaneous = {
            goBack: function () {
                window.location.href = text.urlConcat('#', 'taskconfigs');
            },
            reexecute: function () {
                // Start the task
                rest.tasks.name($scope.taskID).execute.exec(
                    // Execution started successfully
                    function (response) {
                        window.location.href = '#/taskconfigs/' + $scope.taskID;
                    },

                    // Error while starting the execution
                    function (response) {
                        window.location.href = '#/taskconfigs/';
                    }
                );
            }
        };
    });

})();