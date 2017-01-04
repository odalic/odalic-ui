(function () {

    // Main module
    var app = angular.module('odalic-app');


    /** Generates row in a table
     *
     *  Usage:
     *        <tr c-d-table-row
     *        row="inputFile.columns"
     *        row-index="-1"
     *        concrete-data="result.headerAnnotations"
     *        selected-position="selectedPosition"
     *        locked-table-cells="locked.tableCells"
     *        chosen-k-bs="chosenKBs"
     *        primary-k-b="{{ primaryKB }}"
     *        proposal="openCDProposal">
     */

    // row-index determines number of row. Header row has a special number -1.
    // concrete-data determines data for a concrete row
    // selected-position determines a position of mouse cursor in table
    // locked-table-cells determines users changes in the table as  true / false values, if the user  did some
    // chosen-k-bs determines knowledge bases in the configuration of task
    // primary-k-b determines primary knowlege base in the task configuration
    // proposal contains function, which opens modal window for a proposing

    var currentFolder = $.getPathForRelativePath('');
    app.directive('cDTableRow', function () {
        return {
            restrict: 'A',
            scope: {
                row: '=',
                rowIndex: '=',
                concreteData: '=',
                selectedPosition: '=',
                lockedTableCells: '=',
                chosenKBs: '=',
                proposal: '=',
                primaryKB: '@'
            },
            templateUrl: currentFolder + 'cDTableRow.html',
            link: function (scope, iElement, iAttrs) {

                scope.selectPosition = function (row, column) {
                    scope.selectedPosition.column = column;
                    scope.selectedPosition.row = row;
                };

                scope.removeClass = function(data, columnIndex, itemIndex) {
                    data.splice(itemIndex, 1);
                    scope.lockedTableCells[scope.rowIndex][columnIndex] = 1;
                };

                scope.backgroundColor = function (KB) {
                    var index = scope.chosenKBs.indexOf(KB);
                    var color = constants.kbColorsArray[index];
                    return {"background-color": color, "border-radius": "5px", "opacity": "1"};
                };
            }
        }
    });

})();
