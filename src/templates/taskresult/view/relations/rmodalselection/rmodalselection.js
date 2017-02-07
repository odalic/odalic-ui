(function () {

    // Main module
    var app = angular.module('odalic-app');

    app.controller('rSelectionController', function ($scope, $uibModalInstance, rest, data) {
        $scope.selectedRelation =data.selectedRelation;
        $scope.gvdata = data.gvdata;
        $scope.primaryKB = data.primaryKB;
        $scope.locked = data.locked;
        $scope.result = data.result;
        $scope.openRProposal = data.openRProposal;
        $scope.chosenKBs = data.chosenKBs;
        $scope.currentRelation = data.currentRelation;
        $scope.close = $uibModalInstance.close;

        $scope.locksLock = function() {
            $scope.locked[$scope.selectedRelation.column2] = 1
        };
        // //locks relation
        // $scope.lockRelation = function () {
        //     $scope.currentLock = 1;
        // };

    });
})();