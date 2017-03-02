(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** modal-closing
     *  Description:
     *      Represents an 'x' button of modal windows (for closing modal windows).
     *
     *  Usage:
     *      # Example 1
     *      - template -
     *      <modal-closing closing-function="close"/>
     *
     *      - controller -
     *      $scope.close = function() {
     *          // close the modal
     *      };
     *
     *
     *      # Example 2
     *      - template -
     *      <modal-closing closing-function="close" args="[1, 2, 3]"/>
     *
     *      - controller -
     *      $scope.close = function(a, b, c) {
     *          // close the modal
     *      };
     *
     *  Arguments:
     *      closing-function
     *      - A function to call upon clicking the 'x' button.
     *
     *      args (optional)
     *      - An array or arguments to pass to the 'closing-function'.
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