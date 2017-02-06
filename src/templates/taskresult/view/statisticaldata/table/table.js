(function () {

    // Main module
    var app = angular.module('odalic-app');

    app.filter('get', function () {
        // function to invoke by Angular each time
        // Angular passes in the `items` which is our Array
        return function (items,primaryKB, type, headers) {
            // Create a new Array
            var filtered = [];
            // loop through existing Array
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                // check if the individual Array element begins with `a` or not
                if (item.component[primaryKB] == type) {
                    // push it into the Array if it does!
                    filtered.push(item);

                }
            }
            // boom, return the Array after iteration's complete
            return filtered;
        };
    });

    var currentFolder = $.getPathForRelativePath('');
    app.directive('sTable', function ($uibModal) {
        return {
            restrict: 'E',
            scope: {
                type: '=',
                result: '=',
                locked: '=',
                primaryKB:'=',
                typeIndex:'='
            },
            templateUrl: currentFolder + 'table.html',
            link: function ($scope, iElement, iAttrs) {

                $scope.gvdata={mc : function(){}, update: function(){}};
                $scope.moveToNone=function(predicateObj)
                {
                    predicateObj.component[$scope.primaryKB] = 'NONE'
                    $scope.locked[predicateObj.index]=1;
                }
                $scope.moveToType=function()
                {
                    $scope.pickedRow.component[$scope.primaryKB] = $scope.type
                    $scope.locked[ $scope.pickedRow.index]=1;
                }



                //calls cd proposal modal window
                $scope.openStatisticalRProposal = function (rowIndex) {
                    var locksLock = function() {
                        $scope.locked[rowIndex] = 1
                    };
                    $uibModal.open({
                        templateUrl: "src/templates/taskresult/view/relations/rmodalselection/rmodalproposal/rmodalproposal.html",
                        controller: 'rProposeController',
                        resolve: {
                            data: function () {
                                return {
                                    gvdata: $scope.gvdata,
                                    selectedRelation: {column1: $scope.typeIndex ,column2: rowIndex},
                                    range: "",
                                    domain: $scope.result.headerAnnotations[rowIndex].chosen[$scope.primaryKB][0].entity.resource,
                                    locked:  locksLock,
                                    currentRelation: $scope.result.statisticalAnnotations [rowIndex].predicate,
                                    primaryKB: $scope.primaryKB
                                }
                            }
                        }
                    });
                };

                $scope.openStaticalRSelection = function (rowIndex) {
                    $uibModal.open({
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: "src/templates/taskresult/view/relations/rmodalselection/rmodalselection.html",
                        controller: 'rSelectionController',
                        resolve: {
                            data: function () {
                                return {

                                    gvdata: $scope.gvdata,
                                    primaryKB: $scope.primaryKB,
                                    locked: $scope.locked,
                                    selectedRelation: {column1: $scope.typeIndex ,column2: rowIndex},
                                    result: $scope.result,
                                    currentRelation: $scope.result.statisticalAnnotations [rowIndex].predicate,
                                    openRProposal: $scope.openStatisticalRProposal,
                                    chosenKBs: []

                                }
                            }
                        }

                    });
                }
            }
        }
    });

})();
