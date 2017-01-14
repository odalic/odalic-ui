(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Shortened directive, for displaying long text, but shortened.
     *
     *  Usage: <shortened text="textobj" length="30" class="bold" />
     *      - text: text object in the current scope
     *      - length: to which length to shorten
     *      - class: styling
     *
     *  Advanced usage: <shortened text="textobj" short-class="normal" expand-class="bold" />
     *      - length attribute does not need to be set, neither does class attribute
     *      - short-class: styling of the non-expanded text
     *      - expand-class: styling of the expanded text
     *
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