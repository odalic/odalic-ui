(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** tooltip for buttons.. sorta
     */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('btnexplain', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'btnexplain.html',
            transclude: true,
            scope: {
                msg: '@'
            },
            link: objhelp.emptyFunction
        }
    });

})();