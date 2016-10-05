(function () {

    // Main module
    var app = angular.module('odalic-app');

    // injector directive
    var currentFolder = $.getPathForRelativePath('');
    app.directive('injector', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'injector.html',
            transclude: true,
            link: function (scope, iElement, iAttrs) {
                var name = 'for';
                if (name in iAttrs) {
                    scope[iAttrs[name]] = $(iElement.get(0).childNodes[0].childNodes[0]).html();
                } else {
                    throw new Error('injector directive: nothing to inject the text for; no variable specified.');
                }
                $(iElement.get(0)).hide();
            }
        }
    });

})();