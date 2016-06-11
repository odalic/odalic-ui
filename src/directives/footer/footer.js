(function () {

    // Main module
    var app = angular.module('odalic-app');

    // footer directive
    var currentFolder = $.getPathForRelativePath('');
    app.directive('footer', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'footer.html',
            transclude: true
        }
    });    

})();