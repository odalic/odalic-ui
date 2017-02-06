(function () {

    // Main module
    var app = angular.module('odalic-app');

    //
    var currentFolder = $.getPathForRelativePath('');
    app.directive('taskInfo', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'taskinfo.html',
            scope: {
                result: '='
            },
            link: function ($scope, iElement, iAttrs) {
                // Initialization
                $scope.taskinfo = {
                    showWarning: true,
                    modal: {}
                };
            }
        }
    });

})();