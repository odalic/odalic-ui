(function () {

    // Main module
    var app = angular.module('odalic-app');

    // tooltip directive
    var currentFolder = $.getPathForRelativePath('');
    app.directive('tooltip', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'tooltip.html',
            transclude: true,
            link: function (scope, iElement, iAttrs) {
                // Title of the tooltip
                var msgText = 'msg';
                var msgSource = 'source';
                var text = null;

                if (msgText in iAttrs) {
                    text = iAttrs[msgText];
                } else if (msgSource in iAttrs) {
                    text = scope[iAttrs[msgSource]];
                } else {
                    throw new Error('tooltip directive: display text not set.');
                }

                // Positioning
                var placeText = 'place';
                var place = 'top';
                if (placeText in iAttrs) {
                    place = iAttrs[placeText];
                }

                // Apply the tooltip
                $(iElement.get(0).childNodes[0]).tooltip({
                    title: text,
                    animation: true,
                    placement: place
                });
            }
        }
    });

})();