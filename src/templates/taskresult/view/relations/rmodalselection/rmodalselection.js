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


        //locks relation
        $scope.lockRelation = function () {
            $scope.locked.graphEdges[$scope.selectedRelation.column1][$scope.selectedRelation.column2] = 1;
        };

    });
})();