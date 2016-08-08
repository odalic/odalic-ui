(function () {

    // Main module
    var app = angular.module('odalic-app');


    app.filter('chosenCandidates', function () {
        return function (candidates) {
            var chosen = [];
            for (var knowledgeBase in candidates) {
                var KBcandidates = candidates[knowledgeBase];
                for (var i = 0; i < KBcandidates.length; i++) {
                    if (KBcandidates[i].chosen == true) {
                        chosen.push(KBcandidates[i].entity.resource);
                    }

                }
            }

            return chosen.join();
        };
    });

    // Create a controller for taskconfig
    app.controller('taskresult-ctrl', function ($scope, $window, sharedata, requests, ioc) {


        //$scope.primaryKB = sharedata.get("PrimaryKB");
        //$scope.chosenKBs = sharedata.get("ChosenKBs");
        $scope.primaryKB = "DBpedia";
        $scope.chosenKBs = ["DBpedia"];
        // Loading the input CSV file
        var loadInput = function (input) {
            Papa.parse(input, {
                worker: true,
                complete: function (inputFile) {
                    var inputFileRows = [];
                    for (var i = 1; i < inputFile.data.length; i++) {
                        inputFileRows.push(inputFile.data[i]);
                    }

                    // Inject into the scope
                    $scope.$apply(function () {
                        $scope.inputFile = {
                            "columns": inputFile.data[0],
                            "rows": inputFileRows
                        };
                    });
                }
            });
        };

        // Load the input CSV file and the result
        var loader = ioc['taskresult/loader'];
        loader.sharedata = sharedata;
        loader.requests = requests;
        loader.getCSV(function(data) {
            loadInput(data);
        });
        loader.getJSON(function(data) {
            $scope.result = data;
        });

        // Bylo presunuto z $.getJSONSync (metoda byla jen temporarni)
        // Prosim, nemenit (pokud neni zavazny duvod) nacitavani "input CSV file" a "result".
        // Taky tam nic nepripisovat (opet: jen ze zavazneho duvodu).


        //objects which saves users setting 
        $scope.feedback = {};
        $scope.ignoredColumn = {};
        $scope.noDisambiguationColumn = {};
        $scope.noDisambiguationCell = {};
        $scope.currentItems = {};

        // Providing feedback
        $scope.subjectColumn = $scope.result.subjectColumnPosition.index;    // Defaultly selected subject column



        //sets selection boxes from  classification and disambiguation of algorithm
        //sets header of table       
        $scope.currentItems['-1'] = {};
        for (var i = 0; i < $scope.result.headerAnnotations.length; i++) {
            var cell = $scope.result.headerAnnotations[i].candidates;
            var selectedCandidates = [];
            $scope.currentItems['-1'][i] = {};
            for (var kb in cell) {
                for (var k = 0; k < cell[kb].length; k++) {
                    if (cell[kb][k].chosen == true) {
                        selectedCandidates.push(cell[kb][k].entity);
                    }
                }
                $scope.currentItems['-1'][i][kb] = selectedCandidates;
            }
        }
        //set cells of table
        for (var i = 0; i < $scope.result.cellAnnotations.length; i++) {
            $scope.currentItems[i] = {};
            var row = $scope.result.cellAnnotations[i];
            for (var j = 0; j < row.length; j++) {
                $scope.currentItems[i][j] = {};
                var cell = row[j].candidates;
                if (cell != {}) {
                    for (var kb in cell) {
                        var selectedCandidates = []
                        for (var k = 0; k < cell[kb].length; k++) {
                            if (cell[kb][k].chosen == true) {
                                selectedCandidates.push(cell[kb][k].entity);
                            }
                        }
                        $scope.currentItems[i][j][kb] = selectedCandidates;
                    }
                }
            }
        }

        $scope.setFeedback = function () {
            //sets subjectColumn
            //"subjectColumnPosition": { "index": 3 }
            //TODO mozna pouzit nejakou funkci na tvoreni vic levlu objektu, nebo mozna zbytecne slozita struktura
            $scope.feedback.subjectColumnPosition = {};
            $scope.feedback.subjectColumnPosition.index = $scope.subjectColumn;

            //sets ignored columns
            //"columnIgnores": [ { position: { index: 6 } },...]
            $scope.feedback.columnIgnores = [];
            for (var columnNumber in $scope.ignoredColumn) {
                if ($scope.ignoredColumn[columnNumber] == true) {
                    $scope.feedback.columnIgnores.push({ position: { index: columnNumber } });
                }

            }


            //sets changed classification
            //"classifications": [{
            //    position: { index: 5 },
            //    annotation: {"candidates": {"dbpedia": [{"entity": { "resource": "http://bleble.com", "label": "Ble" }, "likelihood": { "value": 0.5 },"chosen":true;}, ...],    "wikidata": ...,},

            $scope.feedback.classifications = [];

            for (var columnNumber in $scope.currentItems[-1]) {
                changed = false;
                for (var KB in $scope.currentItems[-1][columnNumber]) {
                    userChanges = $scope.currentItems[-1][columnNumber][KB];
                    inputSetting = $scope.result.headerAnnotations[columnNumber].candidates[KB];

                    changed = findUserChanges(userChanges, inputSetting, -1, columnNumber, changed, KB);
                }
                // sets feedback, if user changed some clasification in headers of table
                if (changed) {
                    var changedClassification = {};

                    changedClassification.position = {};
                    changedClassification.position.index = columnNumber;

                    changedClassification.annotation = {};
                    changedClassification.annotation.candidates = {};

                    cell = $scope.result.headerAnnotations[columnNumber].candidates;
                    setFeedbackChanges(changedClassification, -1, columnNumber, cell);

                    $scope.feedback.classifications.push(changedClassification);

                }

            }

            //sets the skipped column -disambiguations
            //"columnAmbiguities": [{ position: { index: 6 } },...],
            $scope.feedback.columnAmbiguities = [];
            for (var columnNumber in $scope.noDisambiguationColumn) {
                if ($scope.noDisambiguationColumn[columnNumber] == true) {
                    $scope.feedback.columnAmbiguities.push({ position: { index: columnNumber } });
                }

            }

            //sets the skipped cell disambiguations
            //"ambiguities": [{ position: { rowPosition: { index: 6 }, columnPosition: { index: 6 } } }, ...],
            $scope.feedback.ambiguities = [];
            for (var rowNumber in $scope.noDisambiguationCell) {
                for (var columnNumber in $scope.noDisambiguationCell[rowNumber]) {
                    if ($scope.noDisambiguationCell[rowNumber][columnNumber] == true) {
                        $scope.feedback.ambiguities.push({ position: { rowPosition: { index: rowNumber }, columnPosition: { index: columnNumber } } });

                    }

                }
            }

            //sets changed disambiguations
            //"disambiguations": [{
            //    position: { positionRow:{ index: 5 }, positionColumn{index :6}},
            //    annotation: {"candidates": {"dbpedia": [{"entity": { "resource": "http://bleble.com", "label": "Ble" }, "likelihood": { "value": 0.5 },"chosen":true;}, ...],    "wikidata": ...,},

            $scope.feedback.disambiguations = [];
            for (var rowNumber in $scope.currentItems) {

                if (rowNumber == -1)
                    continue;

                for (var columnNumber in $scope.currentItems[rowNumber]) {
                    changed = false;
                    for (var KB in $scope.currentItems[rowNumber][columnNumber]) {
                        userChanges = $scope.currentItems[rowNumber][columnNumber][KB];
                        inputSetting = $scope.result.cellAnnotations[rowNumber][columnNumber].candidates[KB];
                        changed = findUserChanges(userChanges, inputSetting, rowNumber, columnNumber, changed, KB);
                    }
                    // sets feedback, if user changed some disambiguation in cell of table
                    if (changed) {
                        var changedDisambiguation = {};

                        changedDisambiguation.position = {};
                        changedDisambiguation.position.rowPosition = {};
                        changedDisambiguation.position.rowPosition.index = rowNumber;

                        changedDisambiguation.position.columnPosition = {};
                        changedDisambiguation.position.columnPosition.index = columnNumber;

                        cell = $scope.result.cellAnnotations[rowNumber][columnNumber].candidates;
                        setFeedbackChanges(changedDisambiguation, rowNumber, columnNumber, cell);

                        $scope.feedback.disambiguations.push(changedDisambiguation);

                    }

                }


            }
            $scope.feedback.cellRelations = [];

            $scope.feedback.columnRelations = [];

            //sends feedback to server
            //TODO udelat jako globalni konfiguracni promennou
            var feedbackUrl = "http://localhost:8080/odalic/tasks/" + sharedata.get("TaskID") + "/configuration/feedback"

            requests.reqJSON({
                method: "PUT",
                address: feedbackUrl,
                formData: $scope.feedback,
                success: function (response) {
                    alert("Feedback was saved.");
                    $window.location.href = "#/createnewtask";
                },
                failure: function (response) {
                    alert("Fail.");
                }
            });

        }



        //TODO mozna predpocitat pri kazde zmene - rozmyslet
        function findUserChanges(userChanges, inputSetting, rowNumber, columnNumber, changed, KB) {

            if (KB != "other") {
                for (var i = 0; i < inputSetting.length; i++) {

                    //TODO mozna rychleji
                    //detectes user's changed classification
                    if (userChanges.map(function(c) { return c.resource; }).includes(inputSetting[i].entity.resource)) {
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
                //TODO asi jinak protoze je mozna potreba sjednotit currentItems.other z ""  na  [""]
                if (!($scope.currentItems[rowNumber][columnNumber]["other"][0].resource == "")) {
                    changed = true;
                }
            }
            return changed;
        }

        //
        function setFeedbackChanges(changedSelection, rowNumber, columnNumber, cell) {
            changedSelection.annotation = {};
            changedSelection.annotation.candidates = {};

            feedbackCandidates = changedSelection.annotation.candidates;

            for (var KB in $scope.currentItems[rowNumber][columnNumber]) {
                feedbackCandidates[KB] = [];

                if (KB == "other") {
                    feedbackCandidates["other"].push(
                       {
                           "entity": { "resource": $scope.currentItems[rowNumber][columnNumber][KB][0].resource, "label": "" },
                           "likelihood": { "value": 0 },
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

        // VIEW
        $scope.state = 1;                       // Default VIEW
        $scope.states = new Array(3);			// How many of VIEWs there are; Must be an array, because the angular ng-repeat does not iterate over integers
        $scope.setState = function (index) {    // Change the VIEW
            // Check ranges
            if ((index >= 0) && (index < $scope.states.length)) {
                $scope.state = index;
            }
        };


        // Table cell selection
        $scope.selectedPosition = {
            column: -1,
            row: -1
        };


        $scope.selectSubjectColumn = function (column) {
            if ($scope.subjectColumn == column) {
                $scope.subjectColumn = -1;
            }
            else {
                $scope.subjectColumn = column;
            }

        };

        $scope.selectPosition = function (column, row) {

            $scope.selectedPosition.column = column;
            $scope.selectedPosition.row = row;
        }

        $scope.backgroundColor = function (KB) {
            angle = 360 / $scope.chosenKBs.length;
            index = $scope.chosenKBs.indexOf(KB);
            color = "hsla(" + angle * index + ", 100%, 75%,0.5)";
             return { "background-color": color };
  
        }


        //TODO mozna online detekce zmeny jinak je to k nicemu
        $scope.change = function (chosenValues, kb) {                       // Changes the values in the table according to the selected classification and disambiguation (which is wrong; it should change the result file, see the "chosen" attribute)
            //var r = $scope.selectedPosition.row;
            //var c = $scope.selectedPosition.column;





            ////saves changed indexes of selection
            //// Table header selected
            //if (r == -1) {
            //    var chosenKnowledgeBase = $scope.result.headerAnnotations[c].candidates[kb];
            //    changedIndexes[r][c][chosenKnowledgeBase] = [];
            //    for (var i = 0; i < chosenKnowledgeBase.length; i++) {
            //        //TODO mozna to jde rychleji protoze je to stejne serazene??
            //        if (chosenValues.includes(chosenKnowledgeBase[i].entity.resource)) {
            //            if (chosenKnowledgeBase[i].chosen == false){
            //                changedIndexes[chosenKnowledgeBase].push = i;
            //            }
            //        }
            //    }

            //}
            //// Non-header cell selected
            //else {
            //    var chosenKnowledgeBase = $scope.result.cellAnnotations[r][c].candidates[kb];
            //    changedIndexes[r][c][chosenKnowledgeBase] = [];
            //    for (var i = 0; i < chosenKnowledgeBase.length; i++) {
            //        //TODO mozna to jde rychleji protoze je to stejne serazene??
            //        if (chosenValues.includes(chosenKnowledgeBase[i].entity.resource)) {
            //            if (chosenKnowledgeBase[i].chosen == false) {
            //                changedIndexes[chosenKnowledgeBase].push = i;
            //            }
            //        }

            //    }
            //}
        };


    });

})();
