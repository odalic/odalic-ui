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
    app.controller('taskresult-ctrl', function ($scope, sharedata, requests) {

        // Loading the input CSV file
		var loadInput = function(input) {
			Papa.parse(input, {
				worker: true,
				complete: function (inputFile) {
					var inputFileRows = [];
					for (var i = 1; i < inputFile.data.length; i++) {
						inputFileRows.push(inputFile.data[i]);
					}
	
					// Inject into the scope
					$scope.$apply(function() {
						$scope.inputFile = {
							"columns" : inputFile.data[0],
							"rows" : inputFileRows
						};
					});
				}
			});
		};
		
		// Download the input CSV file and then load it
		requests.reqCSV({
			method : "GET",
			address : sharedata.get("Input"),
			formData : 'unspecified',
			success : function(response) {
				loadInput(response.data);
				sharedata.clear("Input");
			},
			failure : function(response) {
				// Failure
			}
		});

		
		// Load the result
		$scope.result = JSON.parse(sharedata.get("Result"));
		sharedata.clear("Result");
		

        // Bylo presunuto z $.getJSONSync (metoda byla jen temporarni)
		// Prosim, nemenit (pokud neni zavazny duvod) nacitavani "input CSV file" a "result".
		// Taky tam nic nepripisovat (opet: jen ze zavazneho duvodu).
		$scope.currentItems = {};
		for (var i = 0; i < $scope.result.headerAnnotations.length; i++) {
			var cell = $scope.result.headerAnnotations[i].candidates;
			var selectedCandidates = [];
			for (var kb in cell) {
				for (var k = 0; k < cell[kb].length; k++) {
					if (cell[kb][k].chosen == true) {
						selectedCandidates.push(cell[kb][k].entity.resource);
					}
				}
				$scope.currentItems['-1,' + i + ',' + kb] = selectedCandidates;
			}
		}
		for (var i = 0; i < $scope.result.cellAnnotations.length; i++) {
			var row = $scope.result.cellAnnotations[i];
			for (var j = 0; j < row.length; j++) {
				var cell = row[j].candidates;
				if (cell != {}) {
					for (var kb in cell) {
						var selectedCandidates = []
						for (var k = 0; k < cell[kb].length; k++) {
							if (cell[kb][k].chosen == true) {
								selectedCandidates.push(cell[kb][k].entity.resource);
							}
						}
						$scope.currentItems[i + ',' + j + ',' + kb] = selectedCandidates;
					}
				}
			}
		}
        function initSelectionBoxes() {
            alert("ddd");
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


        // Providing feedback
        $scope.subjectColumn = $scope.result.subjectColumnPosition.index;                           // Defaultly selected subject column
        $scope.initSelection = function (row, column) {
            alert("BB");
            return 0;
        }
        $scope.change = function (chosenValues, kb) {                // Changes the values in the table according to the selected classification and disambiguation (which is wrong; it should change the result file, see the "chosen" attribute)
            var r = $scope.selectedPosition.row;
            var c = $scope.selectedPosition.column;

            // Table header selected
            if (r == -1) {
                var chosenKnowledgeBase = $scope.result.headerAnnotations[c].candidates[kb];

                for (var i = 0; i < chosenKnowledgeBase.length ; i++) {
                    if (chosenValues.includes(chosenKnowledgeBase[i].entity.resource)) {
                        chosenKnowledgeBase[i].chosen = true;
                    }
                    else {
                        chosenKnowledgeBase[i].chosen = false;
                    }
                }

            }
                // Non-header cell selected
            else {
                var chosenKnowledgeBase = $scope.result.cellAnnotations[r][c].candidates[kb];

                for (var i = 0; i < chosenKnowledgeBase.length ; i++) {
                    if (chosenValues.includes(chosenKnowledgeBase[i].entity.resource)) {
                        chosenKnowledgeBase[i].chosen = true;
                    }
                    else {
                        chosenKnowledgeBase[i].chosen = false;
                    }
                }
            }
        };


    });

})();