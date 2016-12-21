(function () {

    // Main module
    var app = angular.module('odalic-app');

    app.controller('cDSelectionController', function ($scope, $uibModalInstance, rest, data) {
        $scope.selectedPosition = data.selectedPosition;
        $scope.result = data.result;
        $scope.locked = data.locked;
        $scope.primaryKB = data.primaryKB;
        $scope.proposal = data.proposal;
        $scope.ignoredColumn = data.ignoredColumn;
        $scope.noDisambiguationCell = data.noDisambiguationCell;
        $scope.noDisambiguationColumn = $scope.noDisambiguationColumn;


    });


})();



