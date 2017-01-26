(function () {

    // Main module
    var app = angular.module('odalic-app');

    app.controller('rSelectionController', function ($scope, $uibModalInstance, rest, data) {

        $scope.gvdata = data.gvdata;
        $scope.primaryKB = data.primaryKB;
        $scope.locked = data.locked;
        $scope.selectedRelation =data.selectedRelation;
        $scope.result = data.result;
        $scope.openRProposal = data.openRProposal;
        $scope.chosenKBs = data.chosenKBs;
        $scope.close = $uibModalInstance.close;


        //creates levels of json if they are missing
        objhelp.objRecurAccess($scope.result.columnRelationAnnotations, $scope.selectedRelation.column1, $scope.selectedRelation.column2, 'candidates');
        var currentRelation = $scope.result.columnRelationAnnotations[$scope.selectedRelation.column1][$scope.selectedRelation.column2];
        objhelp.objRecurAccess(currentRelation, 'chosen');
        for(var i in  $scope.chosenKBs)
        {
            var KB =  $scope.chosenKBs[i];
            if (!currentRelation.candidates.hasOwnProperty( KB)) {
                currentRelation.candidates[KB] = [];
            }

            if (!currentRelation.chosen.hasOwnProperty(KB)) {
                currentRelation.chosen[KB] = [];
            }
        }

        //locks relation
        $scope.lockRelation = function () {
            $scope.locked.graphEdges[$scope.selectedRelation.column1][$scope.selectedRelation.column2] = 1;
        };

    });
})();