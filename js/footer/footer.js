(function () {

    // Main module
    var app = angular.module('odalic-app');

    // footer directive
    app.directive('footer', function () {
        return {
            restrict: 'E',
            templateUrl: "js/footer/footer.html",
            transclude: true
        }
    });    

})();