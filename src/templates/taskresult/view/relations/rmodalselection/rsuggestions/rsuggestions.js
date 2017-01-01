(function () {

    // Main module
    var app = angular.module('odalic-app');

    // lock directive
    var currentFolder = $.getPathForRelativePath('');
    app.directive('rSuggestions', ['rest', function (rest) {
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

                $scope.addSuggestions = function (suggestion) {

                    var newObj = {
                        "entity": {"resource": suggestion.resource, "label": suggestion.label},
                        "score": {"value": 0}
                    };

                    var currentRelation = $scope.result.columnRelationAnnotations[$scope.selectedRelation.column1][$scope.selectedRelation.column2];
                    var candidates = currentRelation.candidates[$scope.knowledgeBase];

                    //gets from candidates only  array of URLs
                    var urlList = candidates.map(function (candidate) {
                        return candidate.entity.resource;
                    });

                    //tests  url duplicity
                    if (!urlList.includes(suggestion.resource)) {
                        //adds new relation among the candidates in a current cell and sets it as the selected candidate
                        candidates.push(newObj);
                        currentRelation.chosen[$scope.knowledgeBase] = [newObj];
                        //locks current relation
                        $scope.locked.graphEdges[$scope.selectedRelation.column1][$scope.selectedRelation.column2] = 1;

                        gvdata.mc();
                        gvdata.update();
                        alertMessage('success','This entity was added.');
                    }
                    else {
                        alertMessage('error','This entity is already added');
                    }

                }

                //for server data waiting
                $scope.waitForSuggestions = false;

                //gets suggestions from server based on user string input
                $scope.getSuggestions = function (string, limit) {
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
                            alertMessage('success','Search results arrived. Search found '+ $scope.suggestions.length+' suggestins.' );
                        },

                        // Error
                        function (response) {
                            $scope.waitForSuggestions = false;
                            alertMessage('error',response.data.payload.text)
                        }
                    );
                }

                //sets type and text for alert message
                var alertMessage = function(type, messageText)
                {
                    $scope.serverResponse.type = type;
                    $scope.serverResponse.visible = true;
                    $scope.message = messageText ;
                }

            }
        }
    }]);

})();
