(function () {

    // Main module
    var app = angular.module('odalic-app');

    //displays selectboxes for classifications/disambiguations
    var currentFolder = $.getPathForRelativePath('');
    app.directive('cDCheckBoxes', function () {
        return {
            restrict: 'E',
            scope: {
                selectedPosition: '=',
                locked: '=',
                flags: '='
            },
            templateUrl: currentFolder + 'cdcheckboxes.html',
            link: function ($scope, iElement, iAttrs) {

                // On checkbox check changed
                $scope.lockCell = function() {
                    $scope.locked.tableCells[$scope.selectedPosition.row][$scope.selectedPosition.column] = 1;
                };

                $scope.title ="";
                //controls if the column is not subject column (subject column cannot be ignored)
                $scope.isSubjectColumnLocked= function()
                {
                    var isColumnSubject = $scope.flags.isColumnSubject;

                    for(var kb in isColumnSubject)
                    {

                        if(isColumnSubject[kb][$scope.selectedPosition.column] == 1)
                        {
                            $scope.title="Subject column cannot be ignored. Column is set as subject column or is marked as compulsory column. "
                            return true;
                        }

                    }
                    $scope.title="";
                    return false;
                }
            }
        }
    });

})();