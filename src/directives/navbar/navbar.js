(function () {

    // Main module
    var app = angular.module('odalic-app');

    // navbar directive
    var currentFolder = $.getPathForRelativePath('');
    app.directive('navbar', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'navbar.html',
            link: function (scope, iElement, iAttrs) {
                scope.selectedIndex = iAttrs.selected;

                $.getJSONSync(currentFolder + iAttrs.lmenu, function (json) {
                    scope.leftMenu = json;
                });

                $.getJSONSync(currentFolder + iAttrs.rmenu, function (json) {
                    scope.rightMenu = json;
                });
            }
        }
    });

})();