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
                    var lockStrFormer = null;

                    timed.ready(function () {
                        return !!lockStructure.tableCells && !!lockStructure.graphEdges;
                    }, function () {

                        // Counts
                        var rowCount = $scope.result.cellAnnotations.length;
                        var columnCount = $scope.result.cellAnnotations[0].length;

                        // Copy the locked structure for further comparisons
                        lockStrFormer = objhelp.objRecurCopy($scope.locked);

                        $scope.$watch(function() {
                            $scope.feedbackChanged = objhelp.objCompare(lockStructure, lockStrFormer).length > 0;
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