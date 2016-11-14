(function () {

    // Main module
    var app = angular.module('odalic-app');

    // lock directive
    var currentFolder = $.getPathForRelativePath('');
    app.directive('subjectColumnTables', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'subjectcolumntables.html',
            link: function ($scope, iElement, iAttrs) {
                //region subject column

                $scope.selectSubjectColumn = function (column, kb) {
                    if ($scope.result.subjectColumnPositions[kb].index != column) {
                        $scope.locked.subjectColumns[kb][$scope.result.subjectColumnPositions[kb].index] = 0;
                        $scope.result.subjectColumnPositions[kb].index = column;
                        $scope.locked.subjectColumns[kb][column] = 1;
                    }

                };
                //endregion

            }
        }
    });

})();