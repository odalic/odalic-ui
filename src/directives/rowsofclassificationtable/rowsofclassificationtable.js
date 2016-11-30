(function () {

    // Main module
    var app = angular.module('odalic-app');

    // lock directive
    var currentFolder = $.getPathForRelativePath('');
    app.directive('rowsOfClassificationTable', function () {
        return {
            restrict: 'A',
            templateUrl: currentFolder + 'rowsofclassificationtable.html',
            link: function (scope, iElement, iAttrs) {
                scope.row = scope.$eval(iAttrs.row);
                scope.rowIndex = scope.$eval(iAttrs.rowIndex);
                scope.concreteData = scope.$eval(iAttrs.data);
                // iAttrs.$observe('data', function(data) {
                //     scope.data = data;
                // });

                //
                scope.selectPosition = function (row, column) {
                    // alert("dd");
                    scope.selectedPosition.column = column;
                    scope.selectedPosition.row = row;
                };

                scope.removeClass = function(data, columnIndex, itemIndex)
                {
                    //console.log( scope.selectedPosition.row+ " " + scope.selectedPosition.column +" "+ itemIndex +" "+ JSON.stringify(data));
                    //console.log( scope.rowIndex + " " + columnIndex +" "+ itemIndex +" "+ JSON.stringify(data));

                    data.splice(itemIndex, 1);
                    scope.locked.tableCells[scope.rowIndex][columnIndex] = 1;

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
