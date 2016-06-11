(function () {

    // Main module
    var app = angular.module('odalic-app');

    // main-cnt directive
    var currentFolder = $.getPathForRelativePath('');
    app.directive('mainCnt', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'maincnt.html',
            transclude: true
        }
    });    

})();