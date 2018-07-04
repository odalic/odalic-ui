(function () {

    // Main module
    var app = angular.module('odalic-app');


    /** Generates row in a table
     *
     *  Usage:
     *        <div ng-class="'cdTable'"
     *        c-d-table
     *        input-file="inputFile"
     *        input-file-proxy="inputFileProxy"
     *        result="result"
     *        selected-position="selectedPosition"
     *        locked-table-cells="locked.tableCells"
     *        chosen-k-bs="chosenKBs"
     *        primary-k-b="{{ primaryKB }}"
     *        proposal="openCDProposal"
     *        suggestion="openCDSelection"
     *        column-types="result.columnProcessingAnnotations">
     *        </div>
     */

        // row-index determines number of row. Header row has a special number -1.
        // concrete-data determines data for a concrete row
        // selected-position determines a position of mouse cursor in table
        // locked-table-cells determines users changes in the table as  true / false values, if the user  did some
        // chosen-k-bs determines knowledge bases in the configuration of task
        // primary-k-b determines primary knowlege base in the task configuration
        // proposal contains function, which opens modal window for a proposing

    var currentFolder = $.getPathForRelativePath('');
    app.directive('cDTable', ['rest',function (rest) {
        return {
            restrict: 'A',
            scope: {
                inputFile: '=',
                inputFileProxy: '=',
                result: '=',
                selectedPosition: '=',
                lockedTableCells: '=',
                chosenKBs: '=',
                proposal: '=',
                suggestion: '=',
                columnTypes: '=',
                primaryKB: '@'
            },
            templateUrl: currentFolder + 'cdtable.html',
            link: function ($scope, iElement, iAttrs) {
                $scope.messages = {};

                $scope.multiProposal = function () {
                    var proposed_values = {};
                    for (var currentRowIndex = 0; currentRowIndex < $scope.result.cellAnnotations.length; currentRowIndex++) {
                        var cellAnnotationsRow = $scope.result.cellAnnotations[currentRowIndex];
                        if (cellAnnotationsRow[$scope.selectedPosition.column].chosen[$scope.primaryKB].length !== 0) {
                            proposed_values[$scope.inputFile.rows[currentRowIndex][$scope.selectedPosition.column]] = true;
                        }
                    }

                    var rowsToPropose = [];
                    for (currentRowIndex = 0; currentRowIndex < $scope.result.cellAnnotations.length; currentRowIndex++) {
                        cellAnnotationsRow = $scope.result.cellAnnotations[currentRowIndex];
                        if (cellAnnotationsRow[$scope.selectedPosition.column].chosen[$scope.primaryKB].length === 0 && !proposed_values.hasOwnProperty($scope.inputFile.rows[currentRowIndex][$scope.selectedPosition.column])) {
                            rowsToPropose.push(currentRowIndex);
                            proposed_values[$scope.inputFile.rows[currentRowIndex][$scope.selectedPosition.column]] = true;
                        }
                    }

                    rowsToPropose.forEach(function(rowPosition) {
                        var label = $scope.inputFile.rows[rowPosition][$scope.selectedPosition.column];
                        var obj = {
                            "label": label,
                            "alternativeLabels": [],
                            "suffix": encodeURI(label),
                            "classes": [$scope.result.headerAnnotations[$scope.selectedPosition.column].chosen[$scope.primaryKB][0].entity]
                        };

                        rest.base($scope.primaryKB).entities.resources.update(obj).exec(
                            function (response) {
                                var newObj = {
                                    "entity": response,
                                    "score": {
                                        "value": null
                                    }
                                };

                                var currentDisambiguation = $scope.result.cellAnnotations[rowPosition][$scope.selectedPosition.column];
                                //adds disambiguation into result
                                currentDisambiguation.candidates[$scope.primaryKB].push(newObj);
                                currentDisambiguation.chosen[$scope.primaryKB] = [newObj];

                                //locks cell
                                $scope.lockedTableCells[rowPosition][$scope.selectedPosition.column] = 1;
                                $scope.messages.push('success', 'Successfully saved proposed resource "' + response.label + '" in the knowledge base.');
                            },
                            // Error
                            function (response) {
                                $scope.messages.push('error', 'Error while saving a proposed resource in the knowledge base.');
                            }
                        );
                    });
                };
            }
        }
    }]);

})();
