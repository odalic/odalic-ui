(function () {

    // Main module
    var app = angular.module('odalic-app');

    // lock directive
    var currentFolder = $.getPathForRelativePath('');
    app.directive('rSuggestions', ['rest', function (rest) {
        return {
            restrict: 'E',
            scope: {
                selectedPosition: '=',
                locked: '=',
                primaryKB: '@',
                result: '='
            },
            templateUrl: currentFolder + 'rsuggestions.html',
            link: function ($scope, iElement, iAttrs) {

                //region suggestion from primaryKB
                // Initialization
                $scope.suggestions = {};
                $scope.reporting = {};

                $scope.addSuggestions = function (suggestion) {
                    $scope.locked.graphEdges[$scope.selectedRelation.column1][$scope.selectedRelation.column2] = 1;

                    var newObj = {
                        "entity": {"resource": suggestion.resource, "label": suggestion.label},
                        "score": {"value": 0}
                    };

                    $scope.result.columnRelationAnnotations[$scope.selectedRelation.column1][$scope.selectedRelation.column2].candidates[$scope.primaryKB].push(newObj);
                    $scope.result.columnRelationAnnotations[$scope.selectedRelation.column1][$scope.selectedRelation.column2].chosen[$scope.primaryKB] = [newObj]
                   // $scope.currentRelations[$scope.selectedRelation.column1][$scope.selectedRelation.column2][$scope.primaryKB].push(newObj.entity)
                };

                //for server data waiting
                $scope.waitForSuggestions = false;

                //gets suggestions from server based on user string input
                $scope.getSuggestions = function (string, limit) {
                    $scope.waitForSuggestions = true;
                    rest.base($scope.primaryKB).entities.query(string).limit(limit).retrieve.exec(
                        // Success, inject into the scope
                        function (response) {
                            $scope.waitForSuggestions = false;

                            console.log('suggestings from server: '+JSON.stringify(response,null, 4));
                            $scope.suggestions = response;

                            // TODO: Works only once. As soon as you add the result,
                            // it breaks.
                            if ($scope.suggestions.length > 0) {
                                $scope.suggestion = $scope.suggestions[0];
                            }
                        },

                        // Error
                        function (response) {
                            $scope.reporting.push('error', reporth.constrErrorMsg($scope['rtxt.finderror'], response.data));
                            $scope.waitForSuggestions = false;
                        }
                    );
                }
                //endregion



            }
        }
    }]);

})();
