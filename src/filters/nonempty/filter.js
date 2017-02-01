(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Filter for 'decorating' non-empty text.
     *  Usage:
     *      first{{ maybeGetString() | nonempty:', ' }}
     *      This will result in "first, example" or "first"; "example" being the string returned by "maybeGetString()".
     *
     *      Additionally may be used for appending text as well:
     *      first{{ maybeGetString() | nonempty:'before':'after' }}
     *
     */
    app.filter('nonempty', function () {
        return function (item, pre, post) {
            if (item && (item.length > 0)) {
                return (new String()).concat(text.safe(pre), item, text.safe(post));
            }
        };
    });

})();