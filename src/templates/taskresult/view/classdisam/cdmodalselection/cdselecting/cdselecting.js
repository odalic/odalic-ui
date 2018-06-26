(function () {

    // Main module
    var app = angular.module('odalic-app');

    //displays selectboxes and search dialog for classifications/disambiguations
    var currentFolder = $.getPathForRelativePath('');
    app.directive('cDSelecting',['rest','$uibModal',function (rest,$uibModal) {
        return {
            restrict: 'E',
            scope: {
                selectedPosition: '=',
                locked: '=',
                primaryKB: '@',
                result: '=',
                openCDProposal: '='
            },
            templateUrl: currentFolder + 'cdselecting.html',
            link: function ($scope, iElement, iAttrs) {

                //returns a correct data for select boxes
                $scope.data = function() {
                    if ($scope.selectedPosition.row === -1) {
                        return $scope.result.headerAnnotations[$scope.selectedPosition.column]
                    }
                    else {
                        return $scope.result.cellAnnotations[$scope.selectedPosition.row][$scope.selectedPosition.column]
                    }
                };

                $scope.openCDProposal = function () {
                    $uibModal.open({
                        templateUrl: "src/templates/taskresult/view/classdisam/cdmodalproposal/cdproposalcontent/cdproposalcontent.html",
                        controller: 'cDProposeController',
                        resolve: {
                            data: function () {
                                return {
                                    selectedPosition: $scope.selectedPosition,
                                    result: $scope.result,
                                    locked: $scope.locked,
                                    primaryKB: $scope.primaryKB,
                                    multiple: false
                                }
                            }
                        }

                    });
                };

                $scope.openCDSuggestions = function (knowledgeBase) {
                    $uibModal.open({
                        templateUrl: "src/templates/taskresult/view/classdisam/cdmodalselection/cdsuggestions/cdsuggestions.html",
                        controller: 'cDSuggestions',
                        resolve: {
                            data: function () {
                                return {
                                    selectedPosition: $scope.selectedPosition,
                                    result: $scope.result,
                                    locked: $scope.locked,
                                    knowledgeBase: knowledgeBase

                                }
                            }
                        }

                    });
                }
            }
        }
    }]);

})();