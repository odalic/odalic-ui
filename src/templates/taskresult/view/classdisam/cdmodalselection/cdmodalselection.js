(function () {

    // Main module
    var app = angular.module('odalic-app');

    //sets modal window with details of table cells
    app.controller('cDSelectionController', function ($scope, $uibModalInstance, rest, data) {
        $scope.selectedPosition = data.selectedPosition;
        $scope.result = data.result;
        $scope.locked = data.locked;
        $scope.primaryKB = data.primaryKB;
        $scope.openCDProposal = data.openCDProposal;
        $scope.flags = data.flags;
        $scope.close = $uibModalInstance.close;





    });


})();



