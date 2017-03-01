(function () {

    // Main module
    var app = angular.module('odalic-app');


    app.filter('get', function () {
        return function (items, primaryKB, type, headers) {
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

    //generates table for measure or dimension
    var currentFolder = $.getPathForRelativePath('');
    app.directive('sTable', function ($uibModal) {
        return {
            restrict: 'E',
            scope: {
                type: '=',
                result: '=',
                locked: '=',
                primaryKB: '=',
                typeIndex: '=',
                chosenKBs: '='
            },
            templateUrl: currentFolder + 'table.html',
            link: function ($scope, iElement, iAttrs) {

                //sets color via knowledge base
                $scope.backgroundColor = function (KB) {
                    var index = $scope.chosenKBs.indexOf(KB);
                    var color = constants.kbColorsArray[index];
                    return {"background-color": color, "border-radius": "5px", "opacity": "1"};
                };
                //fictive object, because we used the functions designed for relations
                $scope.gvdata = {
                    mc: function () {
                    }, update: function () {
                    }
                };
                //sets data cube object as NONE
                $scope.moveToNone = function (predicateObj) {
                    predicateObj.component[$scope.primaryKB] = 'NONE'
                    $scope.locked[predicateObj.index] = 1;
                }
                //sets concrete type to object
                $scope.moveToType = function () {
                    $scope.pickedRow.component[$scope.primaryKB] = $scope.type
                    $scope.locked[$scope.pickedRow.index] = 1;
                }


                //calls cd proposal modal window to propose own predicate
                $scope.openStatisticalRProposal = function (rowIndex) {
                    var locksLock = function () {
                        $scope.locked[rowIndex] = 1
                    };
                    var chosen = $scope.result.headerAnnotations[rowIndex].chosen[$scope.primaryKB];
                    var range = (chosen.length == 0) ? "" : chosen[0].entity.prefixed;
                    $uibModal.open({
                        templateUrl: "src/templates/taskresult/view/relations/rmodalselection/rmodalproposal/rmodalproposal.html",
                        controller: 'rProposeController',
                        resolve: {
                            data: function () {
                                return {
                                    gvdata: $scope.gvdata,
                                    selectedRelation: {column1: $scope.typeIndex, column2: rowIndex},
                                    domain: "",
                                    range: range,
                                    locked: locksLock,
                                    currentRelation: $scope.result.statisticalAnnotations [rowIndex].predicate,
                                    primaryKB: $scope.primaryKB
                                }
                            }
                        }
                    });
                };
                //calls detail of chosen predicate
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
                                    selectedRelation: {column1: $scope.typeIndex, column2: rowIndex},
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
