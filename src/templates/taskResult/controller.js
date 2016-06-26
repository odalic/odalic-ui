(function () {

    // Main module
    var app = angular.module('odalic-app');

    //TODO sipkova navigace
    //app.directive('keyTrap', function () {
    //    alert("dffsd");
    //    return function (scope, elem) {
    //        elem.bind('keydown', function (event) {
    //            scope.$broadcast('keydown', event.keyCode);
    //        });
    //    };
    //});

    // Create a controller for taskconfig
    app.controller('taskresult-ctrl', function ($scope, sharedata) {

		// TODO: sharedata will be needed to load resulting data from a previous AJAX request
        //$scope.responseText = sharedata.get("example");
		
        //TODO vstupni data z nahraneho souboru
        $scope.inputFile =
        {
            "columns":
            [
              ["given_name"],
              ["surname"],
              ["number"],
              ["bla"]
            ],
            "results":
            [
              [
                ["Joe"],
                ["Schmoe"],
                ["5"],
                ["fjdslfjlds"]

              ],
              [
                ["Jane"],
                ["Doe"],
                ["5"],
                ["jfkldsjfl"]
              ],
              [
                ["bla"],
                ["blabla"],
                ["5"],
                ["fjdslfjlsdkljf"]
              ]
            ]
        };

        $scope.pokus = 0;

        $scope.subjectColumn = 0;



        $scope.change = function (obj) {
            if ($scope.selectedPosition.row == -1)
            { $scope.inputFile.results[$scope.selectedPosition.row][$scope.selectedPosition.column]; }
            else
            {

                var value = $scope.inputFile.results[$scope.selectedPosition.row][$scope.selectedPosition.column];


                $scope.inputFile.results[$scope.selectedPosition.row][$scope.selectedPosition.column].property = obj;

            }

        };

        $scope.myFunct = function () {

            if (keyEvent.which === 38)
                $scope.pokus++;

        }
		
		
		// View selection
		$scope.state = 0;
		$scope.states = new Array(3);			// Must be an array, because the angular ng-repeat does not operate over integers
		$scope.setState = function (index) {
			
			// Check ranges
			if ((index >= 0) && (index < $scope.states.length)) {
				$scope.state = index;
			}
			
			// Is saving the variable this way necessary?
			/*if ($scope.state == 0) {
                $scope.subjectColumn = $scope.selectedPosition.column;
            }
            if ($scope.state == 1) {
                //uloz zmeny pro klasifikaci a disambigulaci
            }
            if ($scope.state == 2) {
                //uloz zmeny pro vztahy a odesli
            }*/
			
			// I mean, you can access it anytime, see this in the "developer mode":
			console.log($scope.selectedPosition.column);
			
			//presmerovani kam??
			
		};

		



        $scope.selectPosition = function ($column, $row) {
            $scope.selectedPosition = {
                column: $column,
                row: $row
            };
        }
        $scope.result =
            {

                "SubjectColumn": 7,

                "Values": {

                    "Columns": [{ "Suggestions": ["http://adequate.at/concept/City", "http://adequate.at/concept/Country"] }],

                    "Cells": [
                                  [
                                       { "Suggestions": ["http://adequate.at/concept/Joe"] },

                                       { "Suggestions": ["http://adequate.at/concept/Schmoe"] },
                                       { "Suggestions": [] },
                                       { "Suggestions": [] }

                                  ],
                                  [
                                       { "Suggestions": ["http://adequate.at/concept/Jane", "http://adequate.at/concept/Jana"] },


                                       { "Suggestions": ["http://adequate.at/concept/Schmoe", "http://adequate.at/concept/Srna"] },
                                       { "Suggestions": [] },
                                       { "Suggestions": [] }
                                  ],
                                  [
                                        { "Suggestions": ["http://adequate.at/concept/bla", "http://adequate.at/concept/bla2"] },
                                        { "Suggestions": ["http://adequate.at/concept/blabla", "http://adequate.at/concept/blabla2"] },
                                        { "Suggestions": [] },
                                        { "Suggestions": [] }
                                  ]
                             ],



                  "Relations": [{ "Column1": 0, "Column2": 1, "Suggestions": ["http://adequate.at/concept/hasPopulation"] }]

                }
            }

    });



})();