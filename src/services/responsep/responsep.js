(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** responsep
     *  Description:
     *      A service for parsing a generic server response.
     *      Should be versatile and able to handle several scenarios.
     *
     *  Usage:
     *      # Example 01
     *      var obj = responsep(responseObject);

     *      // Returns an object of the following format:
     *      // {
     *      //   status - status code
     *      //   result - main returned object or message
     *      //   description - usually more detailed description of an error, if happened
     *      //   otherdata - miscellaneous data, rarely present
     *      //   message - generic message generated from the status code
     *      // }
     *
     *  Remarks:
     *      - Each of the properties of the object returned may be null.
     */
    app.service('responsep', function () {
        return function (response) {
            var status = null;
            var result = null;
            var descr = null;
            var odata = null;
            var bimsg = null;

            if (response) {
                // Preprocessing
                if ('data' in response) {
                    response = response.data;
                    if (typeof(response) !== 'object') {
                        response = JSON.parse(response);
                    }
                }

                // Status
                status = response.status;

                // Generic message for the give status code
                var decider = Math.floor(response.status / 100);
                switch (decider) {
                    case 2:
                        bimsg = 'According to the server everything is OK.';
                        break;
                    case 3:
                        bimsg = 'The server indicates redirection.';
                        break;
                    case 4:
                        switch (response.status) {
                            case 404:
                                bimsg = 'The client attempted to access a resource that (no longer) exists. See the reported cause for more details.';
                                break;
                            case 409:
                                bimsg = 'The server received conflicting requests. See the reported cause for more details.';
                                break;
                            default:
                                bimsg = 'Unknown client-caused error. See the reported cause for more details.';
                                break;
                        }
                        break;
                    case 5:
                        bimsg = 'A server-side error occured. See the reported cause for more details.';
                        break;
                    default:
                        return;
                };

                // Payload type
                if (response.type === 'DATA') {
                    result = response.payload;
                }

                if (response.type === 'MESSAGE') {
                    var resobj = response.payload;
                    result = resobj.text;
                    descr = resobj.debugContent;
                    odata = resobj.additionalResources;
                }
            }

            return {
                status: status,
                result: result,
                description: descr,
                otherdata: odata,
                message: bimsg
            };
        };
    });

})();
