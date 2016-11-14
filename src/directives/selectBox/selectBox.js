(function () {

    // Main module
    var app = angular.module('odalic-app');

    // lock directive
    var currentFolder = $.getPathForRelativePath('');
    app.directive('selectBox', function () {
        return {


            restrict: 'E',
            // scope:
            // {
            //     data : '=',
            //     column: '=',
            //     kb :'=',
            //     locked :'='
            // },


            templateUrl: currentFolder + 'selectBox.html',
            link: function ($scope, iElement, iAttrs) {
                $scope.knowledgeBase = $scope.$eval(iAttrs.knowledgeBase);

                $scope.lodLiveBrowserIcon = "graphics/link.png";


                // locks cell after change
                $scope.lockCell = function () {
                    $scope.locked.tableCells[$scope.selectedPosition.row][$scope.selectedPosition.column] = 1;
                };

                $scope.switchChosen = function (newSelection, knowledgeBase) {
                    $scope.result.cellAnnotations[$scope.selectedPosition.row][$scope.selectedPosition.column].chosen[knowledgeBase] = [newSelection];

                }


                //region LODLIVE communication
                // **************************************************
                //sets listener
                if (window.addEventListener) {
                    addEventListener("message", listener, false)
                } else {
                    attachEvent("onmessage", listener)
                }

                // saves context of odalic for communication
                var lodLiveIframe;
                var selectedKB;

                //creates iframe with lodLive application
                $scope.createIframe = function (endUrl, currentKB, $event) {
                    $event.stopPropagation();

                    selectedKB = currentKB;

                    //LodLive iframe
                    var allUrl = "../LodLive/app_en.html?" + endUrl.resource;
                    lodLiveIframe = document.createElement("IFRAME");
                    lodLiveIframe.setAttribute("src", allUrl);
                    document.body.appendChild(lodLiveIframe);

                };

                function listener(event) {
                    //TODO kontrola nefunguje event.origin ==null
                    // if ( event.origin !== "http://localhost:8080" )
                    //   return

                    // json result sends from lodlive: {action: close/returnUrl, data: "www.dbpedia..."}
                    if (event.data.action != 'close') {
                        var candidates;
                        //gets the current header or cell candidates by position
                        if ($scope.selectedPosition.row == -1) {
                            candidates = $scope.result.headerAnnotations[$scope.selectedPosition.column].candidates[selectedKB]
                        }
                        else {
                            candidates = $scope.result.cellAnnotations[$scope.selectedPosition.row][$scope.selectedPosition.column].candidates[selectedKB]
                        }

                        var urlList = candidates.map(function (candidate) {
                            return candidate.entity.resource;
                        });
                        //adds new concept
                        if (!urlList.includes(event.data.data)) {
                            var newObj = {
                                "entity": {"resource": event.data.data, "label": ""},
                                "score": {"value": 0}
                            };
                            candidates.push(newObj);

                            //sets selected urls in select boxes
                            if ($scope.selectedPosition.row == -1) {
                                //classification - multi choice is possible
                                $scope.result.headerAnnotations[$scope.selectedPosition.column].chosen[selectedKB].push(newObj)
                            }
                            else {
                                //disambiguation - only one choice is possible
                                $scope.result.cellAnnotations[$scope.selectedPosition.row][$scope.selectedPosition.column].chosen[selectedKB] = [newObj]
                            }
                            //TODO hlaska o pridani vlevy dolni rohu viz cvut angular
                        }
                        //TODO  hezci hlaska - o existenci vlevy dolni rohu viz cvut angular
                        else {
                            alert("This url is already in the selection. ")
                        }

                        $scope.$apply();

                    }

                    document.body.removeChild(lodLiveIframe);

                }

                //endregion


            }
        }
    });

})();