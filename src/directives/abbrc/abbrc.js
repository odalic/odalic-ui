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

                $(iElement.get(0)).click(function () {
                    var text = $(this).find('.odalic-note');
                    if (!text.length) {
                        var abbr = $(this.childNodes[0]);

                        // Add the note
                        $(this).append('<span class="odalic-note">' + abbr.attr('title') + '</span>');

                        // Set the position right below the text
                        var position = abbr.position();
                        var height = abbr.height();
                        //var outerWidth = abbr.outerWidth();
                        $(this).find('.odalic-note').css({
                            top: (position.top + height) + 'px',
                            left: (position.left) + 'px'
                        })
                    } else {
                        text.remove();
                    }
                });

            }
        }
    });

})();