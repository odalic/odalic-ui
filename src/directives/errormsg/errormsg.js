(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** error-msg directive for displaying error message when a form control validation fails. */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('errorMsg', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'errormsg.html',
            transclude: true,
            scope: {
                ngmsg: '@'
            },
            link: function (scope, iElement, iAttrs) {
                // Empty so far...
            }
        }
    });

})();