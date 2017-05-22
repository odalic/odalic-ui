(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Bootstrap's abbr, but clickable (to display on handheld devices). */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('abbrc', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'abbrc.html',
            transclude: true,
            scope: {
                msg: '@'
            },
            link: function (scope, iElement, iAttrs) {

                // Apply the tooltip on click
                $(iElement.get(0)).tooltip({
                    title: text.safe(scope.msg),
                    placement: 'bottom',
                    trigger: 'click'
                });

            }
        }
    });

})();