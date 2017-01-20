(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Create a controller for ngtest
    var currentFolder = $.getPathForRelativePath('');
    app.controller('odalic-ngtest-ctrl', function ($scope) {

        $scope.myobj = {};
        $scope.myobj.model = ["Hi", "this", "is", "an", "array", "of", "words"];
        $scope.myobj.perPage = 3;
    });

})();