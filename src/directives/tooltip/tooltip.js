(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** tooltip
     *  Description:
     *      Provides a bootstrap's tooltip around HTML element(s) on mouse hover.
     *
     *  Usage:
     *      # Example 1
     *      - template -
     *      <tooltip source="myvar" place="top">
     *          <a class="btn btn-default">Button with tooltip</a>
     *      </tooltip>
     *
     *      - controller -
     *      $scope.myvar = "A text displayed on the tooltip";
     *
     *
     *      # Example 2
     *      - template -
     *      <tooltip msg="A text displayed on the tooltip" place="left">
     *          <a class="btn btn-default">Button with tooltip</a>
     *      </tooltip>
     *
     *  Arguments:
     *      source (optional)
     *      - String variable on a current scope, which is a source of the tooltip's text to display.
     *
     *      msg (optional)
     *      - A string to display on the tooltip.
     *
     *      place
     *      - Relative position of the tooltip from the element(s) the tooltip is wrapped around ('top', 'left',
     *      'right', 'bottom').
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