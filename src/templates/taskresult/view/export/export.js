(function () {

    // Main module
    var app = angular.module('odalic-app');

    // lock directive
    var currentFolder = $.getPathForRelativePath('');
    app.directive('export', function () {
        return {
            restrict: 'E',

            templateUrl: currentFolder + 'export.html',
            link: function ($scope, iElement, iAttrs) {
                // region Exporting to JSON / CSV / RDF
                // **************************************
                $scope.exporting = {
                    json: function () {
                        window.open(rest.tasks.name(TaskID).result.export.json.address());
                    },
                    csv: function () {
                        window.open(rest.tasks.name(TaskID).result.export.csv.address());
                    },
                    turtle: function () {
                        window.open(rest.tasks.name(TaskID).result.export.turtle.address());
                    },
                    jsonld: function () {
                        window.open(rest.tasks.name(TaskID).result.export.jsonld.address());
                    }
                };
                // endregion
            }
        }
    });

})();