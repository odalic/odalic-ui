(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Icon for closing of a modal window
     *
     *  Usage: <modal-closing modal-window="$uibModalInstance"/>
     */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('modalClosing', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'modalclosing.html',
            scope: {
                modalWindow: '='
            },
            link: function ($scope, iElement, iAttrs) {
                $scope.close = function()
                {
                    $scope.modalWindow.close();
                };
            }
        }
    });

})();