(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('helpico', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'helpico.html',
            scope: {
                msg: '@'
            },
            link: objhelp.emptyFunction
        }
    });

})();