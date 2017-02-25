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
                    if ( $scope.isIgnored(column)) {
                        $scope.open[kb][column] = true;
                        return;
                    }
                    if ($scope.result.subjectColumnPositions[kb].index != column) {

                        $scope.locked.subjectColumns[kb][$scope.result.subjectColumnPositions[kb].index] = 0;
                        $scope.result.subjectColumnPositions[kb].index = column;
                        $scope.locked.subjectColumns[kb][column] = 1;
                    }

                };
            }
        }
    });

})();