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
                //Exporting to JSON / CSV / RDF
                $scope.exporting = {
                    json: function () {
                        window.open(rest.tasks.name($scope.taskID).result.export.json.address());
                    },
                    csv: function () {
                        window.open(rest.tasks.name($scope.taskID).result.export.csv.address());
                    },
                    turtle: function () {
                        window.open(rest.tasks.name($scope.taskID).result.export.turtle.address());
                    },
                    jsonld: function () {
                        window.open(rest.tasks.name($scope.taskID).result.export.jsonld.address());
                    }
                };
            }
        }
    }]);

})();