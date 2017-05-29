(function () {

    // Main module
    var app = angular.module('odalic-app');

    //calls rest api function for export of data
    var currentFolder = $.getPathForRelativePath('');
    app.directive('export', ['rest',function (rest) {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'export.html',
            link: function ($scope, iElement, iAttrs) {
                // Initialization
                $scope.feedbackChanged = false;

                // Watch for any feedback changes, in which case the buttons get disabled
                (function () {
                    var lockStructure = $scope.locked;

                    timed.ready(function () {
                        return !!lockStructure.tableCells && !!lockStructure.graphEdges && !!$scope.getCurrentSettings;
                    }, function () {

                        // Copy the locked structure for further comparisons
                        var lockStrFormer = objhelp.objCopy($scope.locked);

                        // Copy the current settings for further comparisons
                        var settingsFormer = objhelp.objCopy($scope.getCurrentSettings());

                        $scope.$watch(function() {
                            $scope.feedbackChanged =
                                objhelp.objCompare(lockStructure, lockStrFormer).length > 0 ||
                                objhelp.objCompare($scope.getCurrentSettings(), settingsFormer).length > 0;
                        });

                    });
                })();

                // Button actions: exporting to JSON / CSV / RDF
                $scope.exporting = {
                    json: function (s, f) {
                        rest.tasks.name($scope.taskID).result.export.json.exec(s, f);
                    },
                    csv: function (s, f) {
                        rest.tasks.name($scope.taskID).result.export.csv.exec(s, f);
                    },
                    turtle: function (s, f) {
                        rest.tasks.name($scope.taskID).result.export.turtle.exec(s, f);
                    },
                    jsonld: function (s, f) {
                        rest.tasks.name($scope.taskID).result.export.jsonld.exec(s, f);
                    }
                };
            }
        }
    }]);

})();