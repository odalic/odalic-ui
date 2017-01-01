(function () {


    // Main module
    var app = angular.module('odalic-app');

    // suggestions directive
    var currentFolder = $.getPathForRelativePath('');
    app.directive('cDSuggestions', ['rest', function (rest) {
        return {
            restrict: 'E',
            scope: {
                selectedPosition: '=',
                locked: '=',
                knowledgeBase: '@',
                result: '=',
            },
            templateUrl: currentFolder + 'cdsuggestions.html',
            link: function ($scope, iElement, iAttrs) {

                //for server data waiting
                $scope.waitForSuggestions = false;


                //sets parameters for the alert directive
                $scope.serverResponse = {
                    type: 'success',
                    visible: false
                };


                //adds new suggestion into ruesult
                $scope.addSuggestions = function (suggestion) {
                    $scope.serverResponse.visible = false;

                    //object in result format
                    var newObj = {
                        "entity": {"resource": suggestion.resource, "label": suggestion.label},
                        "score": {"value": 0}
                    };

                    if ($scope.selectedPosition.row == -1) {
                        //adds classification  into result
                        var currentCell = $scope.result.headerAnnotations[$scope.selectedPosition.column];
                        var candidates = currentCell.candidates[$scope.knowledgeBase];

                        //gets from candidates only  array of URLs
                        var urlList = candidates.map(function (candidate) {
                            return candidate.entity.resource;
                        });

                        //tests  url duplicity
                        if (!urlList.includes(suggestion.resource)) {
                            //adds new classification among the candidates in a current cell and sets it as the selected candidate
                            candidates.push(newObj);
                            currentCell.chosen[$scope.knowledgeBase] = [newObj];

                            //locks current cell
                            $scope.locked.tableCells[$scope.selectedPosition.row][$scope.selectedPosition.column] = 1;

                            alertMessage('success','This entity was added.');
                        }
                        else {
                            alertMessage('error','This entity is already added');
                        }
                    }
                    else {
                        var currentCell = $scope.result.cellAnnotations[$scope.selectedPosition.row][$scope.selectedPosition.column];
                        var candidates = currentCell.candidates[$scope.knowledgeBase];
                        //gets from candidates only  array of URLs
                        var urlList = candidates.map(function (candidate) {
                            return candidate.entity.resource;
                        });

                        //tests  url duplicity
                        if (!urlList.includes(suggestion.resource)) {
                            //adds new dissabmbiguation among the candidates in a current cell and sets it as the selected candidate
                            candidates.push(newObj);
                            currentCell.chosen[$scope.knowledgeBase] = [newObj];
                            //locks current cell
                            $scope.locked.tableCells[$scope.selectedPosition.row][$scope.selectedPosition.column] = 1;
                            alertMessage('success','This entity was added.');
                        }
                        else {
                            alertMessage('error','This entity is already added');
                        }
                    }
                }


                //gets suggestions from server based on user string input
                $scope.getSuggestions = function (string, limit) {
                    $scope.suggestions = {};
                    $scope.serverResponse.visible = false;

                    $scope.waitForSuggestions = true;



                    if ($scope.selectedPosition.row == -1) {
                        //GET http://example.com/{base}/entities/classes?query=Pra&limit=20
                        rest.base($scope.knowledgeBase).entities.classes.query(string).limit(limit).retrieve.exec(
                            // Success, inject into the scope
                            successFunction(),
                            // Error
                            errorFunction()
                        );
                    } else {
                        //GET http://example.com/{base}/entities/resources?query=Pra&limit=20
                        rest.base($scope.knowledgeBase).entities.resources.query(string).limit(limit).retrieve.exec(
                            // Success, inject into the scope
                            successFunction(),
                            // Error
                            errorFunction()
                        );

                    }
                }

                //rest api success function
                var successFunction = function () {
                    return function (response) {
                        //shuts loading icon
                        //TODO may be use loadico directive
                        $scope.waitForSuggestions = false;

                        $scope.suggestions = response;

                        //shows first entity in the select box if some suggestions are found
                        if ($scope.suggestions.length > 0) {
                            $scope.suggestion = $scope.suggestions[0];
                        }
                        alertMessage('success','Search results arrived. Search found '+ $scope.suggestions.length+' suggestins.' );
                    };
                };

                //rest api fail function
                var errorFunction = function () {
                    return function (response) {
                        $scope.waitForSuggestions = false;
                        alertMessage('error',response.data.payload.text)
                    }
                };

                //sets type and text for alert message
                var alertMessage = function(type, messageText)
                {
                    $scope.serverResponse.type = type;
                    $scope.serverResponse.visible = true;
                    $scope.message = messageText ;
                }
            }
        }
    }
    ]);

})();
