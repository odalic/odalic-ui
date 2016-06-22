(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Create a controller for taskconfig
    app.controller('taskResult-ctrl', function ($scope) {

        //TODO vstupni data z nahraneho souboru
        $scope.pokus = "ahoj";
        $scope.inputFile =
        {
            "columns":
            [
              "given_name",
              "surname",
            ],
            "results":
            [
              [
                "Joe",
                "Schmoe"
              ],
              [
                "Jane",
                "Doe"
              ]
            ]
        };

        $scope.selectColumn = function ($parentIndes) {
            $scope.selectedPosition = {
                column: $parentIndex,
            };
        }

        $scope.selectPosition = function ($parentIndex, $index) {
            $scope.selectedPosition = {
                parent: $parentIndex,
                index: $index
            };
        }
        $scope.result = 
            {

                "SubjectColumn": 7,

                "Values": {
                    
                    "Columns": [{ "Suggestions": ["http://adequate.at/concept/City", "http://adequate.at/concept/Country"] }],
                    
                    "Cells": [{ "Value": "Ptaha ","Suggestions": ["http://adequate.at/concept/Moscow", "http://adequate.at/concept/Prague"] }],

                    "Relations": [{ "Column1": 0, "Column2": 1, "Suggestions": ["http://adequate.at/concept/hasPopulation"] }]

                }
            }

    });

})();