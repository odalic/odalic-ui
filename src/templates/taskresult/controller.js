(function () {

    // Main module
    var app = angular.module('odalic-app');

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
                        ;
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
    app.controller('taskresult-ctrl', function ($scope, $routeParams, $location, $window, sharedata, requests, rest) {



            //region inits objects which saves users changes
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
            // TODO:
            // - The whole page should just display a "loading icon" until the result is loaded.
            // - Also it should be able to both display the result and an error message, if produced any.

            //region gets data from server
            // Loading of the necessary resources
            // ****************************************

            // The task's ID
            var TaskID = $routeParams['taskid'];
            // TODO: This is just a temporary solution; otherwise we get an error since result and inptu files are not ready at this point.
            // Išty myslím že tohle se řeší přes routering resolve, tím zajitíme že šablona se začne vykreslovat až přijdou data
            // tohle bych resila spolu s loginem, mozna bude pozdeji lepsi ten globalni routering zlokalnit
        // netreba -- ng-if rovno v DOM strome zakáže/pridá potrebné HTML elementy, ktoré sa nemajú šancu aktivovať predčasne
        // => loadico directive by mala fungovať správne
        // pozn. nefunguje s ng-show, ten len mení CSS style medzi hidden/visible

            // - this can be solved via putting everything in a <div> with something like ng-show attribute if result is loaded.
            // - the controller script must be edited appropiately as well.


            // Resource loading phases




        var phases = {
            result: {
                complete: false
            },
            input: {
                complete: false
            },
            kb: {
                complete: false
            },
            locks: {
                complete: false
            }
        };
        $scope.loadedData= 0;




            $scope.serverFeedback= {};



            //region Download the input CSV file in a JSON format directly
            rest.tasks.name(TaskID).input.retrieve.exec(
                // Success, inject into the scope
                function (response) {
                    $scope.inputFile = {
                        'columns': response.headers,
                        'rows': response.rows
                    };

                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    $scope.loadedData ++;

                    // Phase complete
                    phases.input.complete = true;
                },

                // Error
                function (response) {
                    // TODO: Deal with this somehow.
                }
            );
            //endregion

            //region Load the result
            rest.tasks.name(TaskID).result.retrieve.exec(
                // Success
                function (response) {
                    // TODO: $apply? or does this work alone? check.
                    $scope.result = response;
                   // console.log("///////////////////////////////////////////////////////////")
                   // console.log('result :\n'+JSON.stringify(result.cellAnnotations[1][1],null, 4));



                    // Phase complete
                    phases.result.complete = true;
                    setsData();
                    getFeedback()

                },

                // Fatal error, result not loaded or task resulted in an error
                function (response) {
                    // TODO
                    throw new Error('Task result could not have been loaded.');
                }
            );
            //endregion

            //region Set knowledge bases
            rest.tasks.name(TaskID).retrieve.exec(
                // Success
                function (response) {
                    // TODO: $apply? or does this work alone? check.
                    $scope.primaryKB = response['configuration']['primaryBase']['name'];

                    $scope.loadedData ++;

                    // Phase complete
                    phases.kb.complete = true;
                },

                // Error
                function (response) {
                    // TODO
                    throw new Error('Task configuration could not have been loaded.');
                }
            );
            //endregion


            // TODO: This will have to be rewritten: chosenKBs need to be part of the task somehow (its configuration), I guess
            $scope.chosenKBs = ["DBpedia", "DBpedia Clone", "German DBpedia"];
            //region dependent on data from server
            //sets data for graph component
            $scope.currentRelations = {};
            setsData = function () {
                // TODO: Own relation? Takto?
                objForEach($scope.result.columnRelationAnnotations, function (column1, collect1) {
                    objForEach(collect1, function (column2, collect2) {

                        // Create a fake candidate for custom relations
                        objRecurAccess($scope.result, column1, column2, 'chosen')['other'] = [
                            {
                                "entity": {
                                    "resource" : "",
                                    "label" : ""
                                },
                                "score": 1
                            }
                        ];
                    });
                });

                // Load the graphvis directive when the data is ready
                loadGraphVis();

                // Another data loaded
                $scope.loadedData ++;
            };


            getFeedback = function () {
                rest.tasks.name(TaskID).feedback.retrieve.exec(
                    function (response) {
                        $scope.serverFeedback = response
                        console.log("------------------------------------------------------------------------")
                        console.log('server feedback: \n '+JSON.stringify( $scope.serverFeedback,null, 4));
                        //alert("Feedback was saved")
                        setLockedFlags();
                        setIgnoreThings();
                    },
                    // Error
                    function (response) {
                        alert("Something is wrong. Please, try to again.")
                    }
                )


            }
            setIgnoreThings = function()
            {
                // for (var index in $scope.serverFeedback.columnIgnores) {
                //     $scope.ignoredColumn[$scope.serverFeedback.columnIgnores[index].position.index] = 1;
                // }
                //
                // for (var index in $scope.serverFeedback.columnAmbiguities) {
                //    $scope.noDisambiguationColumn[$scope.serverFeedback.columnAmbiguities[index].position.index] = 1;
                // }
                //
                // for (var index in $scope.serverFeedback.columnIgnores) {
                //     var row =$scope.serverFeedback.columnIgnores[index].rowPosition.index;
                //     var column =$scope.serverFeedback.columnIgnores[index].columnPosition.index;
                //     $scope.noDisambiguationCell[row][column] = 1;
                // }
                $scope.loadedData ++;

            };

            setLockedFlags = function () {


                var columnCount = $scope.result.cellAnnotations[0].length;
                var rowCount = $scope.result.cellAnnotations.length;


                //default classification locking
                $scope.locked.tableCells = {};
                $scope.locked.tableCells[-1] = {};
                for (var c = 0; c < columnCount; c++) {

                    $scope.locked.tableCells[-1][c] = 0;
                }
                //classification locking from server feedback
                for (var index in  $scope.serverFeedback.classifications)
                {
                    var column = $scope.serverFeedback.classifications[index].position.index;
                    $scope.locked.tableCells[-1][column] = 1;
                }


                //default disambiguation locking
                for (var r = 0; r < rowCount; r++) {
                    $scope.locked.tableCells[r] = {};
                    for (var c = 0; c < columnCount; c++) {
                        $scope.locked.tableCells[r][c] = 0;

                    }
                }
                //disambiguation locking from server feedback
                for (var index in  $scope.serverFeedback.disambiguations)
                {
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
                        if ($scope.serverFeedback.subjectColumnPositions.hasOwnProperty(kb) && $scope.serverFeedback.subjectColumnPositions[kb].index == c) {
                            $scope.locked.subjectColumns[kb][c] = 1;
                        }
                        else
                        {
                            $scope.locked.subjectColumns[kb][c] = 0;
                        }
                    }
                }



                //TODO isty : mozna predelat nevim jestli mam spravne poradi, predpokladam ze column1 je mensi nez column2
                $scope.locked.graphEdges = {};
                for (var r = 0; r < columnCount - 1; r++) {
                    $scope.locked.graphEdges[r] = {};
                    for (var c = r + 1; c < columnCount; c++) {
                        $scope.locked.graphEdges[r][c] = 0;
                    }
                }


                for (var index in  $scope.serverFeedback.columnRelations)
                {
                    var column1 = $scope.serverFeedback.columnRelations[index].position.first.index;
                    var column2 = $scope.serverFeedback.columnRelations[index].position.second.index;
                    $scope.locked.graphEdges[column1][column2] = 1;
                }

               // $scope.loadedData = true;

                $scope.loadedData ++;

            }
            //endregion
            // ****************************************
            // Loading of the necessary resources finishes here
            //endregion4


            $scope.lockCell = function()
            {
                $scope.locked.tableCells[$scope.selectedPosition.row][$scope.selectedPosition.column] = 1;
            };


            //region Relation ui-selectbox functions
            //TODO isty : stara struktura
            $scope.switchRelation = function (newSelection, knowledgeBase) {
                // TODO: remove, when bug corrected.
                console.log($scope.result.columnRelationAnnotations[$scope.selectedRelation.column1][$scope.selectedRelation.column2]);
            };

            $scope.lockRelation = function () {
                $scope.locked.graphEdges[$scope.selectedRelation.column1][$scope.selectedRelation.column2] = 1;
            };


            //endregion

            // region Handling graphvis directive
            // **************************************
            function loadGraphVis() {
                // Initialization
                if (!$scope.gvdata) {
                    $scope.gvdata= {};
                }

                // Set the necessary data
                $scope.gvdata.vertices = $scope['inputFile']['columns'];
                $scope.gvdata.result = $scope['result'];
                $scope.gvdata.lockobj = $scope['locked']['graphEdges'];
                $scope.gvdata.edgeClick = function (c1, c2) {
                    with ($scope.selectedRelation) {
                        column1 = c1;
                        column2 = c2;
                    };
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    $("#modalPredicates").modal();
                };

                // TODO: $scope.locked.graphEdges is not initialized at this point! This has to be changed.
                window.setTimeout(function () {
                    // Presumably 3 seconds is enough to initialize the data structure
                    console.warn('lockobj set. Note this is dangerous and should be changed as soon as possible.');
                    $scope.gvdata.lockobj = $scope['locked']['graphEdges'];
                }, 3000);

                // Calls modelChanged on the currently selected relation.
                $scope.gvdata.mc = function () {
                    $scope.gvdata.modelChanged(
                        $scope.selectedRelation.column1,
                        $scope.selectedRelation.column2
                    );
                };
            }
            // endregion


        }
    );

})
();