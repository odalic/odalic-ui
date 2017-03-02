(function () {

    // Main module
    var app = angular.module('odalic-app');

    //sets title for modal window
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