(function () {

    // Main module
    var app = angular.module('odalic-app');

    //
    var currentFolder = $.getPathForRelativePath('');
    app.directive('cDModalHead', function () {
        return {

            restrict: 'E',
            templateUrl: currentFolder + 'cdmodalhead.html',
            link: function (scope, iElement, iAttrs) {

            }
        }
    });

})();