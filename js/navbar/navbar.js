(function () {

    // Main module
    var app = angular.module('odalic-app');

    // navbar directive
    app.directive('navbar', function () {
        return {
            restrict: 'E',
            templateUrl: "js/navbar/navbar.html",
            link: function (scope, iElement, iAttrs) {
                scope.selectedIndex = iAttrs.selected;

                $.getJSON(iAttrs.lmenu, function (json) {
                    scope.leftMenu = json;
                });

                $.getJSON(iAttrs.rmenu, function (json) {
                    scope.rightMenu = json;
                });
            }
        }
    });    

})();