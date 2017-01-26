(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Icon for closing of a modal window
     *
     *  Usage: <modal-closing close-function = "close"/>
     */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('modalClosing', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'modalclosing.html',
            scope: {
                closingFunction: '='
            },
            link: function ($scope, iElement, iAttrs) {
                $scope.close = function()
                {
                    $scope.closingFunction();
                };
            }
        }
    });

})();