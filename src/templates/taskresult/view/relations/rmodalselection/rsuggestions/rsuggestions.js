(function () {

    // Main module
    var app = angular.module('odalic-app');

    // lock directive
    var currentFolder = $.getPathForRelativePath('');
    app.directive('rSuggestions', ['rest', 'reporth', function (rest, reporth) {
        return {
            restrict: 'E',
            scope: {
                selectedRelation: '=',
                locked: '=',
                knowledgeBase: '@',
                result: '=',
                gvdata: '='
            },
            templateUrl: currentFolder + 'rsuggestions.html',
            link: function ($scope, iElement, iAttrs) {

                //sets parameters for the alert directive
                $scope.serverResponse = {
                    type: 'success',
                    visible: false
                };


                //region suggestion from primaryKB
                // Initialization
                $scope.suggestions = [];
                $scope.reporting = {};

                $scope.addSuggestions = function (suggestion) {

                    $scope.reporting.clear();
                    var newObj = {
                        "entity": {"resource": suggestion.resource, "label": suggestion.label},
                        "score": {"value": null}
                    };

                    var currentRelation = $scope.result.columnRelationAnnotations[$scope.selectedRelation.column1][$scope.selectedRelation.column2];
                    var candidates = currentRelation.candidates[$scope.knowledgeBase];

                    //finds already existing resource
                    var alreadyExist = candidates.find(function (candidate) {
                        return candidate.entity.resource == suggestion.resource
                    });

                    //tests duplicity
                    if (alreadyExist == null) {
                        //adds new relation among the candidates in a current cell and sets it as the selected candidate
                        candidates.push(newObj);
                        currentRelation.chosen[$scope.knowledgeBase] = [newObj];
                    }
                    else {
                        currentRelation.chosen[$scope.knowledgeBase] = [newObj];
                    }

                    $scope.gvdata.mc();

                    //locks current relation
                    $scope.locked.graphEdges[$scope.selectedRelation.column1][$scope.selectedRelation.column2] = 1;
                    $scope.gvdata.update();

                    //deletes form
                    $scope.suggestions ={};
                    $scope.string="";

                    $scope.reporting.push('success', 'The relation is used.');
                }


                //for server data waiting
                $scope.waitForSuggestions = false;

                //gets suggestions from server based on user string input
                $scope.getSuggestions = function (string, limit) {
                    $scope.suggestions = [];
                    $scope.reporting.clear();
                    $scope.waitForSuggestions = true;

                    rest.base($scope.knowledgeBase).entities.properties.query(string).limit(limit).retrieve.exec(
                        // Success, inject into the scope
                        function (response) {
                            //shuts loading icon
                            //TODO may be use loadico directive
                            $scope.waitForSuggestions = false;

                            $scope.suggestions = response;

                            //shows first entity in the select box if some suggestions are found
                            if ($scope.suggestions.length > 0) {
                                $scope.suggestion = $scope.suggestions[0];
                            }
                            // alertMessage('success','Search results arrived. Search found '+ $scope.suggestions.length+' suggestins.' );
                            $scope.reporting.push('success', 'Search results arrived. Search found ' + $scope.suggestions.length + ' suggestins.');

                        },

                        // Error
                        function (response) {
                            $scope.reporting.push('error', reporth.constrErrorMsg($scope['rtxt.finderror'], response.data));
                            $scope.waitForSuggestions = false;
                        }
                    );
                }

            }
        }
    }]);

})();
