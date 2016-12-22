(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Load submodules
    loadhelp.loadDefault();

    //region filter for a string matching in the select boxes
    //works only for two hierarchy of json
    app.filter('propsFilter', function () {
        return function (items, props) {
            var out = [];
            if (angular.isArray(items)) {
                var keys = Object.keys(props);

                items.forEach(function (item) {
                    var itemMatches = false;

                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i].split('.');

                        var text = props[keys[i]].toLowerCase();

                        // lower Case nebezpecne
                        if (item[prop[0]][prop[1]].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        };
    });
    //endregion

    // Create a controller for taskconfig
    app.controller('taskresult-ctrl', function ($scope, $routeParams, $location, $window, sharedata, requests, rest, responsep, $uibModal) {

        // The task's ID
        var TaskID = $routeParams['taskid'];
        $scope.taskID = TaskID;

        //region Initialization of objects which save user changes
        $scope.feedback = {};
        $scope.ignoredColumn = {};
        $scope.noDisambiguationColumn = {};
        $scope.noDisambiguationCell = {};
        $scope.locked = {};

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
        $scope.result = {
            subjectColumnPositions: {
                index: 0
            },
            headerAnnotations: {},
            cellAnnotations: {}
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

                    // Prepare data for graphvis component
                    actions.push(setsData);

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
                    $scope.primaryKB = response['configuration']['primaryBase']['name'];

                    // Phase complete
                    dataLoaded(phases.kb);
                },

                // Error
                function (response) {
                    throw new Error('Task configuration could not have been loaded.');
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
                    throw new Error('Error loading server feedback. Cannot continue.');
                }
            );
            //endregion
        })();

        $scope.serverFeedback = {};


        // TODO: This will have to be rewritten: chosenKBs need to be part of the task somehow (its configuration), I guess
        $scope.chosenKBs = ["DBpedia", "DBpedia Clone", "German DBpedia"];
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

            //subject column server locking
            $scope.locked.subjectColumns = {};
            for (var i in $scope.chosenKBs) {
                var kb = $scope.chosenKBs[i];
                $scope.locked.subjectColumns[kb] = {};
                for (var c = 0; c < columnCount; c++) {
                    var scp = $scope.serverFeedback.subjectColumnPositions;
                    if (scp.hasOwnProperty(kb) && scp[kb].index == c) {
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

            //relations locking from server feedback
            var fbrel = $scope.serverFeedback.columnRelations;
            for (var index in fbrel) {
                var column1 = fbrel[index].position.first.index;
                var column2 = fbrel[index].position.second.index;
                $scope.locked.graphEdges[column1][column2] = 1;
            }
        };
        //endregion
        // ****************************************
        // Loading of the necessary resources finishes here
        //endregion4

        //TODO dat nekam do direktivy az se vyjasni own relace
        $scope.lockRelation = function () {
            $scope.locked.graphEdges[$scope.selectedRelation.column1][$scope.selectedRelation.column2] = 1;
        };

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

                $("#modalPredicates").modal();
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

    });

})();