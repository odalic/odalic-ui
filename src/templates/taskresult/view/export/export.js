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

                // Watch for any feedback changes
                (function () {
                    var rowCount = $scope.result.cellAnnotations.length;
                    var columnCount = $scope.result.cellAnnotations[0].length;

                    var watcharr = [
                        {
                            ilength: rowCount,
                            jlength: columnCount,
                            lockedstr: $scope.locked.tableCells
                        },
                        {
                            ilength: columnCount,
                            jlength: columnCount,
                            lockedstr: $scope.locked.graphEdges
                        }
                    ];

                    watcharr.forEach(function (wobj) {
                        for (var i = 0; i < wobj.ilength; i++) {
                            for (var j = 0; j < wobj.jlength; j++) {
                                // Defined lock at [i, j]?
                                if (typeof(wobj.lockedstr[i][j]) !== 'undefined') {
                                    (function (_i, _j) {
                                        var wexpr = String(wobj.lockedstr[_i][_j]);
                                        $scope.$watch(wexpr, function(newValue, oldValue) {
                                            $scope.feedbackChanged = true;
                                        });
                                    })(i, j);
                                }
                            }
                        }
                    });
                });

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