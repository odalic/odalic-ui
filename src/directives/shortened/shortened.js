(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** shortened
     *  Description:
     *      Shortens a long text, displaying only several first characters.
     *      Additionally provides a 'Show more' button which clicking upon shows the whole text.
     *
     *  Usage:
     *      # Example 1
     *      - template -
     *      <shortened text="textobj" length="30" class="bold"/>
     *
     *      - controller -
     *      $scope.textobj = 'A long text ...';
     *
     *
     *      # Example 2
     *      - template -
     *      <shortened text="textobj" short-class="normal" expand-class="bold"/>
     *
     *      - controller -
     *      $scope.textobj = 'A long text ...';
     *
     *  Arguments:
     *      text
     *      - String variable on a current scope.
     *
     *      length (optional)
     *      - Amount of characters to display for the shortened variant of the text. By default 50 characters are shown.
     *
     *      class (optional)
     *      - Styling of the text.
     *
     *      short-class (optional)
     *      - Styling of the non-expanded text.
     *
     *      expand-class (optional)
     *      - Styling of the expanded text.
     */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('shortened', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'shortened.html',
            scope: {
                text: '='
            },
            transclude: true,
            link: function (scope, iElement, iAttrs) {
                // Length attribute
                var length = 50;
                if ('length' in iAttrs) {
                    length = parseInt(iAttrs['length']);
                }

                // Class attribute
                if ('class' in iAttrs) {
                    scope.sclass1 = iAttrs['class'];
                    scope.sclass2 = iAttrs['class'];
                }
                if ('short-pre' in iAttrs) {
                    scope.sclass1 = iAttrs['short-class'];
                }
                if ('expand-pre' in iAttrs) {
                    scope.sclass2 = iAttrs['expand-class'];
                }

                // Set the shortened text
                scope.shtext = text.dotted(scope.text, length);

                // Expansion
                var ignrange = 20;
                scope.expanded = (scope.shtext.length + ignrange >= length) && (!scope.text.includes('\n'));

                scope.expand = function () {
                    scope.expanded = true;
                };
                scope.trim = function () {
                    scope.expanded = false;
                };
            }
        }
    });

})();