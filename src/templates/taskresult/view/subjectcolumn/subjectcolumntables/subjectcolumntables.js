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
                }


                $scope.isIgnored=function (index) {
                    return $scope.ignoredColumn.hasOwnProperty(index)?$scope.ignoredColumn[index]:0;
                }
                //sets locks and result after user change subject column
                $scope.selectSubjectColumn = function (column, kb) {
                    //controls if the column is not ignored ( ignored column cannot be subject column)
                    if ( $scope.isIgnored(column)) {
                        $scope.open[kb][column] = true;
                        return;
                    }


                    $scope.isColumnSubject[kb][column ] ^=1;
                    $scope.locked.subjectColumns[kb][column] ^= 1;

                    if($scope.isColumnSubject[kb][column ] != $scope.locked.subjectColumns[kb][column])
                    {
                        $scope.locked.subjectColumns[kb][column] = 0;
                    }
                    // var oldColumnIndex= $scope.result.subjectColumnPositions[kb].index;
                    // if (  $scope.locked.subjectColumns[kb][column]== 0 && oldColumnIndex != column) {
                    //
                    //
                    //     if( oldColumnIndex != -1){
                    //         $scope.locked.subjectColumns[kb][oldColumnIndex] = 0;
                    //     }
                    //
                    //     $scope.result.subjectColumnPositions[kb].index= column;
                    //     $scope.locked.subjectColumns[kb][column] = 1;
                    // }


                };

                //locks and unlocks the lock
                $scope.lockColumn = function(column, kb,$event) {
                    $event.stopPropagation();
                    $scope.locked.subjectColumns[kb][column] ^= 1;
                }


            }
        }
    });

})();