(function () {

    // Main module
    var app = angular.module('odalic-app');

    //shows modal window with details of relation
    app.controller('psetconfig-ctrl', function ($scope, $uibModalInstance, data) {
        $scope.text = data.test;

        // On close
        $scope.close = $uibModalInstance.close;
    });
})();