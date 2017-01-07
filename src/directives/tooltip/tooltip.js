(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Tooltip directive
     *  Usage:
     *      <tooltip source="myvar" place="top">
     *          <a class="btn btn-default">Button with tooltip</a>
     *      </tooltip>
     *
     *      ...
     *      $scope.myvar = "A text for tooltip";
     *
     *  Alternative:
     *      <tooltip msg="A text for tooltip" place="top">
     *          <a class="btn btn-default">Button with tooltip</a>
     *      </tooltip>
     */
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