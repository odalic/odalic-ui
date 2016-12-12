(function () {

    // Main module
    var app = angular.module('odalic-app');

    // directive represets ui-select box for classification and disambiguation
    //data - contains data related to cell of table, it means a classifications and disambiguations from result

    var currentFolder = $.getPathForRelativePath('');
    app.directive('cDSelectBox', function () {
        return {

            restrict: 'E',
            scope: {
                selectedPosition: '=',
                locked: '=',
                knowledgeBase: '@',
                data: '='
            },


            templateUrl: currentFolder + 'cdselectbox.html',
            link: function ($scope, iElement, iAttrs) {

                $scope.lodLiveBrowserIcon = "graphics/link.png";


                // locks cell after  user change
                $scope.lockCell = function () {
                    $scope.locked.tableCells[$scope.selectedPosition.row][$scope.selectedPosition.column] = 1;
                };

                // Changes the selected item, if the user selects a different item. It stimulates one selected item in a multiple select box.
                // Multiple select box has better features
                $scope.switchChosen = function (newSelection, knowledgeBase) {
                    $scope.data.chosen[knowledgeBase] = [newSelection];

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
                        //candidates from the concrete cell of table
                        var candidates = $scope.data.candidates[selectedKB];

                        //gets from candidates only  array of URLs
                        var urlList = candidates.map(function (candidate) {
                            return candidate.entity.resource;
                        });


                        //adds new concept if is not included
                        if (!urlList.includes(event.data.data)) {
                            //new concept
                            var newObj = {
                                "entity": {"resource": event.data.data, "label": ""},
                                "score": {"value": 0}
                            };

                            //adds new concept to others results
                            candidates.push(newObj);
                            $scope.data.chosen[selectedKB] = [newObj]
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