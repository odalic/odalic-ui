(function () {

    // Main module
    var app = angular.module('odalic-app');

    //represents page with subject column tables
    var currentFolder = $.getPathForRelativePath('');
    app.directive('subjectColumnTables', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'subjectcolumntables.html',
            link: function ($scope, iElement, iAttrs) {


                $scope.open = {};

                for (var kb in $scope.locked.subjectColumns) {
                    $scope.open[kb] = {};
                    for (var column in $scope.locked.subjectColumns[kb]) {
                        $scope.open[kb][column] = false;
                    }
                };


                function isIgnored (index) {
                    return $scope.flags.ignoredColumn.hasOwnProperty(index)?$scope.flags.ignoredColumn[index]:0;
                };

                var isAnyColumnMarked = function(table)
                {
                    for(columnNumber in table)
                    {
                        if(table[columnNumber]==1)
                        {
                            return true;
                        }
                    }
                    return false;
                };
                //sets locks and result after user change subject column
                $scope.selectSubjectColumn = function (column, kb) {
                    //controls if the column is not ignored ( ignored column cannot be subject column)
                    if ( isIgnored(column)) {
                        $scope.open[kb][column] = true;
                        return;
                    }


                    var table = $scope.flags.isColumnSubject[kb];
                    table[column]^=1;

                    //if we cancel the last marked column so we unlock  the lock, otherwise we lock the lock
                    if(table[column] == 0 && !isAnyColumnMarked(table) )
                    {
                        $scope.locked.subjectColumns[kb] = 0;
                    }
                    else {
                        $scope.locked.subjectColumns[kb] = 1;
                    }
                };

                //locks and unlocks the lock
                $scope.lockColumn = function(column, kb,$event) {
                    $event.stopPropagation();
                    $scope.locked.subjectColumns[kb] = 1;
                };

                $scope.columnStyle = function (kb, columnNumber) {
                    var userChoice = $scope.flags.isColumnSubject[kb][columnNumber];
                    var result = $scope.flags.resultingSubjectColumns[kb][columnNumber];
                    if(userChoice  && result ) {
                        return {"background-color": "WhiteSmoke", "color": "red"};
                    }
                    if(userChoice){
                        return {"background-color": "WhiteSmoke"};
                    }
                    if(result) {
                        return {"color": "red"};
                    }
                };


            }
        }
    });

})();