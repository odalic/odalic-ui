(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Create a controller for taskconfig
    app.controller('taskresult-ctrl', function ($scope, sharedata) {

        // Simulate loading a CSV file (the table) into the scope
        Papa.parse("src/templates/taskresult/sample_input.csv",
			{
			    header: false,
			    download: true,
			    complete: function (inputFile) {
			        var inputFileRows = [];
			        for (var i = 1; i < inputFile.data.length; i++) {
			            inputFileRows.push(inputFile.data[i]);
			        }

			        // Inject into the scope
			        $scope.inputFile = {
			            "columns": inputFile.data[0],
			            "rows": inputFileRows
			        };
			    }
			}
		);


        // Simulate loading of the result
        $.getJSONSync("src/templates/taskresult/sample_result.json", function (sample) {
            $scope.result = sample;
        });


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

        $scope.selectPosition = function (column, row) {
            $scope.selectedPosition.column = column;
            $scope.selectedPosition.row = row;
        }


        // Providing feedback
        $scope.subjectColumn = 0;                           // Defaultly selected subject column

        $scope.change = function (obj, kb) {                // Changes the values in the table according to the selected classification and disambiguation (which is wrong; it should change the result file, see the "chosen" attribute)
            var r = $scope.selectedPosition.row;
            var c = $scope.selectedPosition.column;

            // Table header selected
            if (r == -1) {
                $scope.inputFile.columns[c][kb] = obj;
            }
            // Non-header cell selected
            else {
                $scope.inputFile.rows[r][c][kb] = obj;
            }
        };


        // I don't know what this is:
        $scope.list1 = { title: 'AngularJS - Drag Me' };
        $scope.list2 = {};
        $scope.pokus = 0;
    });

})();