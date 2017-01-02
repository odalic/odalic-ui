(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Timed directive.
     *
     *  Usage: <frankctive for="myFunction">Content to bring to live when myFunction finally returns true.</frankctive>
     *
     *  // Controller
     *  $scope.myFunction = function() {
     *      return $scope.loaded;
     *  }
     *
     */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('frankctive', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'frankctive.html',
            transclude: true,
            scope: {
                for: '='
            },
            link: function (scope, iElement, iAttrs) {
                // Initialize
                scope.loaded = false;

                // Wait until ready
                timed.ready(scope['for'], function () {
                    scope.loaded = true;
                });
            }
        }
    });

})();