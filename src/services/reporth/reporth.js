(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** A helper service for reporting errors to a user. */
    var currentFolder = $.getPathForRelativePath('');
    app.service('reporth', function () {
        /** Constructs a quick string similar to the following example:
         *  <info> Error details: <response details - up to 50 characters>
         *
         * @param info          Text regarding the issue.
         * @param response      Response from the server (usually response.data has to be passed).
         * @returns {String}    The error message.
         */
        this.constrErrorMsg = function (info, response) {
            // Empty response?
            if (!response) {
                return (new String()).concat(
                    text.safe(info), ' (Server responded with empty message...)'
                );
            }

            // Normal flow
            var parsed = (typeof(response) === 'object') ? response : JSON.parse(response);

            return (new String()).concat(
                text.safe(info), ' Error details: ', text.dotted(parsed.payload.text, 50)
            );
        };
    });

})();