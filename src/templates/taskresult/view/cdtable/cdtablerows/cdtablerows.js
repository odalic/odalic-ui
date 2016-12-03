(function () {

    // Main module
    var app = angular.module('odalic-app');

    // lock directive
    var currentFolder = $.getPathForRelativePath('');
    app.directive('cDTableRows', function () {
        return {
            restrict: 'A',
            scope: {
                row: '=',
                rowIndex: '=',
                concreteData: '=',
                selectedPosition: '=',
                lockedTableCells: '=',
                chosenKBs: '=',
                primaryKB:'@'
            },
            templateUrl: currentFolder + 'cDTableRows.html',
            link: function (scope, iElement, iAttrs) {


                scope.selectPosition = function (row, column) {
                    scope.selectedPosition.column = column;
                    scope.selectedPosition.row = row;
                };

                scope.removeClass = function(data, columnIndex, itemIndex)
                {
                    //console.log( scope.selectedPosition.row+ " " + scope.selectedPosition.column +" "+ itemIndex +" "+ JSON.stringify(data));
                    //console.log( scope.rowIndex + " " + columnIndex +" "+ itemIndex +" "+ JSON.stringify(data));

                    data.splice(itemIndex, 1);
                    scope.lockedTableCells[scope.rowIndex][columnIndex] = 1;

                }

                scope.backgroundColor = function (KB) {
                    var index = scope.chosenKBs.indexOf(KB);
                    var color = KBconstants.colorsArray[index];
                    return {"background-color": color, "border-radius": "5px", "opacity": "1"};
                };


            }
        }
    });

})();
