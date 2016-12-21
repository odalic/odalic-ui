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
                result: '='
            },
            templateUrl: currentFolder + 'cdsuggestions.html',
            link: function ($scope, iElement, iAttrs) {

                //region suggestion from primaryKB
                $scope.suggestions = {};
                //sets parameters for the alert directive
                $scope.serverResponse= {
                    type: 'success',
                    visible: false
                };

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



                //for server data waiting
                $scope.waitForSuggestions = false;

                //gets suggestions from server based on user string input
                $scope.getSuggestions = function (string, limit) {
                    $scope.waitForSuggestions = true;

                    setTimeout(function(){
                        //do what you need here

                    var currentTimeStamp =  new Date().getTime();
                    rest.base($scope.knowledgeBase).entities.query(string).limit(limit).stamp(currentTimeStamp).retrieve.exec(
                        // Success, inject into the scope
                        function (response) {
                            var info =response.data;
                            //because of a delayed response server
                            if (currentTimeStamp.toString()==  info.stamp) {
                                alert("ok");
                            }
                            //success message
                            success();

                            $scope.locked.tableCells[$scope.selectedPosition.row][$scope.selectedPosition.column] = 1;

                            $scope.waitForSuggestions = false;

                            $scope.suggestions = response;

                            // TODO: Works only once. As soon as you add the result,
                            // it breaks.
                            if ($scope.suggestions.length > 0) {
                                $scope.suggestion = $scope.suggestions[0];
                            }
                        },

                        // Error
                        function (response) {
                            alert("spatne");
                            var info = JSON.parse(response.data);
                            //because of a delayed response server
                            if (currentTimeStamp.toString()==  info.stamp) {
                                //fail message
                                fail(info);
                            }
                        }
                    );
                    }, 4000);
                }
                //endregion
                //sets parameters for the alert directive
                var success = function()
                {
                    $scope.serverResponse.type = 'success';
                    $scope.serverResponse.visible = true;
                    $scope.messege = "Propose was saved";
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
