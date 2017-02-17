(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Icon for closing of a modal window
     *
     *  Usage: <modal-closing closing-function="close"/>
     *
     *  Providing additional arguments for the closing function:
     *  <modal-closing closing-function="close" args="[1, 2, 3]"/>
     */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('modalClosing', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'modalclosing.html',
            scope: {
                closingFunction: '=',
                args: '='
            },
            link: function ($scope, iElement, iAttrs) {
                $scope.close = function() {
                    $scope.closingFunction.apply(null, objhelp.getFirstArg($scope.args, []));
                };
            }
        }
    });

})();