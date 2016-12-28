(function () {


    // Main module
    var app = angular.module('odalic-app');

    // lock directive
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

                //region suggestion from primaryKB
                $scope.suggestions = {};

                //sets parameters for the alert directive
                $scope.serverResponse= {
                    type: 'success',
                    visible: false
                };


                //adds new suggestion into ruesult
                $scope.addSuggestions = function (suggestion) {
                    //locks concreate cell
                    $scope.locked.tableCells[$scope.selectedPosition.row][$scope.selectedPosition.column] = 1;

                    //object in result format
                    var newObj = {
                        "entity": {"resource": suggestion.resource, "label": suggestion.label},
                        "score": {"value": 0}
                    };

                    if ($scope.selectedPosition.row == -1) {
                        //adds classification  into result
                        $scope.result.headerAnnotations[$scope.selectedPosition.column].candidates[$scope.knowledgeBase].push(newObj);
                        $scope.result.headerAnnotations[$scope.selectedPosition.column].chosen[$scope.knowledgeBase]= [newObj];
                    }
                    else {
                        //adds dissabmbiguation into result
                        $scope.result.cellAnnotations[$scope.selectedPosition.row][$scope.selectedPosition.column].candidates[$scope. knowledgeBase].push(newObj);
                        $scope.result.cellAnnotations[$scope.selectedPosition.row][$scope.selectedPosition.column].chosen[$scope.knowledgeBase] = [newObj]
                    }
                }



                //gets suggestions from server based on user string input
                $scope.getSuggestions = function (string, limit) {
                    $scope.suggestions = {};
                    $scope.serverResponse.visible= false;

                    $scope.waitForSuggestions = true;

                    var currentTimeStamp =  new Date().getTime();
                    rest.base($scope.knowledgeBase).entities.query(string).limit(limit).stamp(currentTimeStamp).retrieve.exec(
                        // Success, inject into the scope
                        function (response) {
                            $scope.waitForSuggestions = false;
                            $scope.suggestions = response;
                            // TODO: Works only once. As soon as you add the result,
                            // it breaks.
                            if ($scope.suggestions.length > 0) {
                                $scope.suggestion = $scope.suggestions[0];
                            }
                            success();
                        },

                        // Error
                        function (response) {
                            // var info = JSON.parse(response.data);
                            $scope.waitForSuggestions = false;
                            fail(response.data);
                        }
                    );

                }
                //endregion

                //sets parameters for the alert directive
                var success = function()
                {
                    $scope.serverResponse.type = 'success';
                    $scope.serverResponse.visible = true;
                    $scope.messege = "Search results arrived";
                }

                //sets parameters for the alert directive
                var fail = function(info)
                {
                    $scope.serverResponse.type = 'error';
                    $scope.serverResponse.visible = true;
                    $scope.messege = info.payload.text;
                }


            }
        }
    }]);

})();
