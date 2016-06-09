(function () {

    // Main module
    var app = angular.module('odalic-app');

    // main-cnt directive
    app.directive('mainCnt', function () {
        return {
            restrict: 'E',
            templateUrl: "js/maincnt/maincnt.html",
            transclude: true
        }
    });    

})();