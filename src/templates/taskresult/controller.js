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
                column1: -1,
                column2: -1
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
                }
            };

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

                    // Phase complete
                    phases.result.complete = true;
                    setsData();
                    setsLockedFlags();
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
            //TODO isty :  k predelani/smazani
            //sets data for graph component
            $scope.currentRelations = {};
            setsData = function () {
                objForEach($scope.result.columnRelationAnnotations, function (column1, collect1) {
                    objForEach(collect1, function (column2, collect2) {
                        objForEach(collect2['chosen'], function (kb, collect3) {
                            var selectedCandidates = [];
                            collect3.forEach(function (item) {
                                selectedCandidates.push(item['entity']);
                            });
                            objRecurAccess($scope.currentRelations, column1, column2)[kb] = selectedCandidates;
                        });
                    });
                });


            }

            setsLockedFlags = function () {
                var columnCount = $scope.result.cellAnnotations[0].length;
                var rowCount = $scope.result.cellAnnotations.length;
                $scope.locked.tableCells = {};
                $scope.locked.tableCells[-1] = {};
                for (var c = 0; c < columnCount; c++) {
                    $scope.locked.tableCells[-1][c] = 0;
                }
                for (var r = 0; r < rowCount; r++) {
                    $scope.locked.tableCells[r] = {};

                    for (var c = 0; c < columnCount; c++) {
                        $scope.locked.tableCells[r][c] = 0;
                    }
                }

                $scope.locked.subjectColumns = {};
                for (var i in $scope.chosenKBs) {
                    var kb = $scope.chosenKBs[i];
                    $scope.locked.subjectColumns[kb] = {};
                    for (var c = 0; c < columnCount; c++) {
                        $scope.locked.subjectColumns[kb][c] = 0;
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
            }
            //endregion
            // ****************************************
            // Loading of the necessary resources finishes here
            //endregion


            //region proposal settings
            $scope.setProposal = function () {
                var url = proposal.prefixUrl + proposal.sufixUrl;
                var alternativeLabels = [proposal.alternativeLabel, proposal.alternativeLabel]

                if (selectedPosition.row == -1) {

                    var obj = {
                        "label": proposal.label,
                        "alternativeLabels": alternativeLabels,
                        " suffix": url,
                        "superClass": proposal.superClass
                    }
                }
                else {
                    //http://example.com/base/entities/classes
                    // rest.base($scope.primaryKB).entities.
                    var obj = {
                        "label": proposal.label,
                        "alternativeLabels": alternativeLabels,
                        "suffix": url,
                        "superClass": $scope.result.headerAnnotations[selectedPosition.column]
                    }

                }

                // {  "classes" : [{"resource" : "https://www.wikidata.org/wiki/Class:C1080", "label" : "City" }, ...]}
            }
            //endregion

            //region suggestion from primaryKB
            $scope.suggestions = {};

            $scope.addSuggestions = function (suggestion) {

                $scope.locked.tableCells[$scope.selectedPosition.row][$scope.selectedPosition.column] = 1;

                var newObj = {
                    "entity": {"resource": suggestion.resource, "label": suggestion.label},
                    "score": {"value": 0}
                };
                alert(JSON.stringify(newObj));

                if ($scope.selectedPosition.row == -1) {
                    $scope.result.headerAnnotations[$scope.selectedPosition.column].candidates[$scope.primaryKB].push(newObj);
                    $scope.result.headerAnnotations[$scope.selectedPosition.column].chosen[$scope.primaryKB].push(newObj);
                }
                else {
                    $scope.result.cellAnnotations[$scope.selectedPosition.row][$scope.selectedPosition.column].candidates[$scope.primaryKB].push(newObj);
                    $scope.result.cellAnnotations[$scope.selectedPosition.row][$scope.selectedPosition.column].chosen[$scope.primaryKB] = [newObj]
                }
            }

            $scope.getSuggestions = function (string, limit) {
                //alert(string)
                // $scope.suggestions = [{
                //     "resource": "https://www.wikidata.org/wiki/Property:P1082",
                //     "label": "has population"
                // },
                //     {"resource": "https://www.wikidata.org/wiki/Property:P12", "label": "has pation"},
                //     {"resource": "https://www.a.org/wiki/Property:P1082", "label": "has "}];
                rest.base($scope.primaryKB).query(string).limit(limit).retrieve.exec(
                    // Success, inject into the scope
                    function (response) {
                        $scope.suggestions = response;
                        alert("a")
                        alert(JSON.stringify($scope.suggestions))

                        // if (!$scope.$$phase) {
                        //     $scope.$apply();
                        // }

                        // Phase complete
                        // phases.input.complete = true;
                    },

                    // Error
                    function (response) {
                        alert("aaaa")
                        // TODO: Deal with this somehow.
                    }
                );
            }
            //endregion

            // TODO: [critical] Feedback saving not working when a user actually makes a change.
            var feedbackFunctions = {
                //region sendFeedback
                sendFeedback: function (success, error) {

                    //region subjectsColumns
                    $scope.feedback.subjectColumnPosition = {};
                    for (var KB in  $scope.locked.subjectColumns) {
                        for (var columnIndex in $scope.locked.subjectColumns[KB]) {
                            if ($scope.locked.subjectColumns[KB][columnIndex] == 1) {
                                $scope.feedback.subjectColumnPosition[KB] = {};
                                $scope.feedback.subjectColumnPosition[KB] = {position: {index: columnIndex}}
                            }

                        }
                    }
                    //endregion

                    //region columnIgnores- sets ignored columns
                    //"columnIgnores": [ { position: { index: 6 } },...]
                    $scope.feedback.columnIgnores = [];
                    for (var columnNumber in $scope.ignoredColumn) {
                        if ($scope.ignoredColumn[columnNumber] == true) {
                            $scope.feedback.columnIgnores.push({position: {index: columnNumber}});
                        }
                    }
                    //endregion

                    //region classification
                    $scope.feedback.classifications = [];
                    for (var columnIndex in $scope.locked.tableCells[-1]) {
                        if ($scope.locked.tableCells[-1][columnIndex] == 1) {
                            var obj = {
                                "position": {"index": columnIndex},
                                "annotation": $scope.result.headerAnnotations[columnIndex]
                            };
                            $scope.feedback.classifications.push(obj);
                        }
                    }
                    //endregion

                    //region disambiguation
                    $scope.feedback.disambiguations = [];
                    for (var rowIndex in $scope.locked.tableCells) {
                        for (var columnIndex in $scope.locked.tableCells[rowIndex]) {
                            if ($scope.locked.tableCells[rowIndex][columnIndex] == 1) {
                                var obj = {
                                    "position": {
                                        "rowPosition": {"index": rowIndex},
                                        "columnPosition": {"index": columnIndex}
                                    },
                                    "annotation": $scope.result.cellAnnotations[rowIndex][columnIndex]
                                };
                                $scope.feedback.disambiguations.push(obj);
                            }

                        }
                    }
                    //endregion

                    //region columnAmbiguities-sets the skipped column -disambiguations
                    //"columnAmbiguities": [{ position: { index: 6 } },...],
                    $scope.feedback.columnAmbiguities = [];
                    for (var columnNumber in $scope.noDisambiguationColumn) {
                        if ($scope.noDisambiguationColumn[columnNumber] == true) {
                            $scope.feedback.columnAmbiguities.push({position: {index: columnNumber}});
                        }

                    }
                    //endregion

                    //region ambiguities-sets the skipped cell disambiguations
                    //"ambiguities": [{ position: { rowPosition: { index: 6 }, columnPosition: { index: 6 } } }, ...],
                    $scope.feedback.ambiguities = [];
                    for (var rowNumber in $scope.noDisambiguationCell) {
                        for (var columnNumber in $scope.noDisambiguationCell[rowNumber]) {
                            if ($scope.noDisambiguationCell[rowNumber][columnNumber] == true) {
                                $scope.feedback.ambiguities.push({
                                    position: {
                                        rowPosition: {index: rowNumber},
                                        columnPosition: {index: columnNumber}
                                    }
                                });

                            }

                        }
                    }
                    //endregion

                    //region relations
                    $scope.feedback.columnRelations = [];
                    objForEach($scope.currentRelations, function (column1, collect1) {
                        objForEach(collect1, function (column2, collect2) {
                            changed = false;
                            objForEach(collect2, function (kb, item) {
                                userChanges = item;
                                inputSetting = $scope.result['columnRelationAnnotations'][column1][column2]['candidates'][kb];
                                changed = findUserChanges(userChanges, inputSetting, column1, column2, changed, kb, 'forRelations');
                            });

                            // TODO: Kata, prosim, checkni, ci toto vyhovuje.
                            if (changed) {
                                var changedRelation = {
                                    position: {
                                        column1position: {
                                            index: column1
                                        },
                                        column2position: {
                                            index: column2
                                        }
                                    }
                                };

                                var rel = $scope.result['columnRelationAnnotations'][column1][column2]['candidates'];
                                setFeedbackChanges(changedRelation, column1, column2, rel, 'forRelations');
                                $scope.feedback.columnRelations.push(changedRelation);
                            }
                        });
                    });
                    //endregion

                    //region sends feedback to server
                    rest.tasks.name(TaskID).feedback.store($scope.feedback).exec(success, error);
                    //endregion
                }
                //endregion
            };

            //region feedback
            $scope.userFeedback = function () {
                feedbackFunctions.sendFeedback(
                    // Success
                    function (response) {
                        alert("Feedback was saved.");
                    },

                    // Failure
                    function (response) {
                        alert("Error.");
                    }
                );
            };
            //endregion

            //region reexecute
            $scope.reexecute = function () {
                // TODO: Error reporting should be improved.

                // Send feedback
                feedbackFunctions.sendFeedback(
                    // Feedback sent successfully
                    function (response) {
                        // Start the task
                        rest.tasks.name(TaskID).execute.exec(
                            // Execution started successfully
                            function (response) {
                                window.location.href = '#/taskconfigs/' + TaskID;
                            },

                            // Error while starting the execution
                            function (response) {
                                throw new Error('Error while trying to run the task; cannot continue.');
                            }
                        );
                    },

                    // Failure while sending feedback
                    function (response) {
                        throw new Error('Error while saving feedback; cannot continue.');
                    }
                );
            };
            //endregion

            //region old feedback function
            //TODO zatim nechat jsou na tom zavisle relations pak smazat
            function findUserChanges(userChanges, inputSetting, rowNumber, columnNumber, changed, KB, forRelations) {

                if (KB != "other") {
                    for (var i = 0; i < inputSetting.length; i++) {

                        //TODO mozna rychleji
                        //detectes user's changed classification
                        if (userChanges.map(function (c) {
                                return c.resource;
                            }).includes(inputSetting[i].entity.resource)) {
                            // changedIndexes[KB].push(i);
                            if (inputSetting[i].chosen == false) {
                                changed = true;
                                inputSetting[i].chosen = true;
                            }
                        }
                        else {
                            if (inputSetting[i].chosen == true) {
                                changed = true;
                                inputSetting[i].chosen = false;
                            }
                        }
                    }
                }
                else {
                    // TODO: Aby nebol zbytocny chaos, len som dopisal 1 argument, aby sa nic nemuselo menit v tvojom kode (funkcie su variadicke v JS)
                    if (typeof (forRelations) === 'undefined') {
                        // If "forRelations" argument is not passed in the function call, handle the situation the old way
                        // TODO asi jinak protoze je mozna potreba sjednotit currentItems.other z ""  na  [""]
                        if (!($scope.currentItems[rowNumber][columnNumber]["other"][0].resource == "")) {
                            changed = true;
                        }
                    } else {
                        // Otherwise handle it specifically for relations
                        // TODO: Kata, checkni, ci takto si to predstavujes.
                        if (!($scope.currentRelations[rowNumber][columnNumber]["other"][0].resource == "")) {       // This will work, though "rowNumber" in this case is "column1" and "columnNumber" is "column2"
                            changed = true;
                        }
                    }
                }
                return changed;
            }

            //TODO zatim nechat jsou na tom zavisle relations pak smazat
            function setFeedbackChanges(changedSelection, rowNumber, columnNumber, cell, forRelations) {
                changedSelection.annotation = {};
                changedSelection.annotation.candidates = {};

                feedbackCandidates = changedSelection.annotation.candidates;

                // TODO: Rovnaky princip, ako vyssie pri findUserChanges; forRelations je nepovinny argument. (to len pre informaciu; tento komentarmozes potom zmazat)
                var collection = null;
                if (typeof (forRelations) === 'undefined') {
                    // Handle basic case
                    collection = $scope.currentItems[rowNumber][columnNumber];
                } else {
                    // Specifically when relations are to be handled
                    collection = $scope.currentRelations[rowNumber][columnNumber];      // 'rowNumber' as a 'column1' and 'columnNumber' as a 'column2'
                }

                for (var KB in collection) {
                    feedbackCandidates[KB] = [];

                    if (KB == "other") {
                        feedbackCandidates["other"].push(
                            {
                                "entity": {
                                    "resource": collection[KB][0].resource,
                                    "label": ""
                                },
                                "likelihood": {"value": 0},
                                "chosen": true
                            }
                        );

                    }
                    else {
                        //TODO mozna jinak
                        for (var i = 0; i < cell[KB].length; i++) {
                            feedbackCandidates[KB].push(
                                cell[KB][i]
                            );


                        }
                    }
                }


            }

            //endregion

            //region state of page
            $scope.state = 1;                       // Default VIEW
            $scope.previousState = function () {
                $scope.state--;
            };

            $scope.nextState = function () {
                $scope.state++;
            };
            //endregion

            //region Relation ui-selectbox functions
            //TODO isty : stara struktura
            $scope.switchRelation = function (newSelection, knowledgeBase) {
                $scope.currentRelations[$scope.selectedRelation.column1][$scope.selectedRelation.column2][knowledgeBase] = [newSelection];
            }

            $scope.lockRelation = function () {
                $scope.locked.graphEdges[$scope.selectedRelation.column1][$scope.selectedRelation.column2] = 1;
            }

            //endregion

            // region Sharing data between graphvis directive and this controller
            // **************************************
            // Store date to sharedata service
            $scope.gvscope = 'gv_scope';
            sharedata.set($scope.gvscope, $scope);

            // Functionalities connected to the modal window for graphvis directive
            $scope.gvmodal = {
                /** A function to be injected from the graphvis directive */
                modelChanged: null,

                /** Opens a modal window.
                 *
                 * @param c1    Index of the firt column.
                 * @param c2    Index of the second column.
                 */
                open: function (c1, c2) {
                    with ($scope.selectedRelation) {
                        column1 = c1;
                        column2 = c2;
                    }
                    ;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    $("#modalPredicates").modal();
                },

                /** Called from taskresult template when a change in model occurs. */
                modalPredicatesChange: function () {
                    this.modelChanged(
                        $scope.selectedRelation.column1,
                        $scope.selectedRelation.column2
                    )
                }
            };
            // endregion

            // region Exporting to JSON / CSV / RDF
            // **************************************
            $scope.exporting = {
                json: function () {
                    window.open(rest.tasks.name(TaskID).result.export.json.address());
                },
                csv: function () {
                    window.open(rest.tasks.name(TaskID).result.export.csv.address());
                },
                turtle: function () {
                    window.open(rest.tasks.name(TaskID).result.export.turtle.address());
                },
                jsonld: function () {
                    window.open(rest.tasks.name(TaskID).result.export.jsonld.address());
                }
            };
            // endregion
        }
    );

})
();