(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** reporth
     *  Description:
     *      A helper service for reporting errors to a user.
     *      This is mostly for asynchronous requests to which server responded with an error. The response is parsed
     *      and returned as a string of a format similar to this: 'Error details: <<error description, max 150 chars>>'.
     *
     *  Usage:
     *      # Usage for a typical scenario with alert-group directive
     *      rest.tasks.name(taskid).create(myFile).exec(
     *          // Success
     *          function (response) {
     *              ...
     *          },
     *          // Failure
     *          function (response) {
     *              // An alert will be pushed with a description similar to this: 'An error occured. Error details: <<desc>>'
     *              $scope.wholeForm.alerts.push('error', reporth.constrErrorMsg('An error occured.', response.data));
     *          }
     *      );
     */
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
                text.safe(info), ' Error details: ', text.dotted(objhelp.getFirstArg(parsed.payload.text, parsed.payload.debugContent, '(No debug info attached...)'), 150)
            );
        };
    });

})();