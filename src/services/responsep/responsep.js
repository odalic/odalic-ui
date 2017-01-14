(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** A service for parsing a generic server response.
     *  Should be versatile and able to handle several scenarios.
     *
     *  Usage: var obj = responsep(responseObject);
     *  Returns an object of the following format:
     *  {
     *      status - status code
     *      result - main returned object or message
     *      description - usually more detailed description of an error, if happened
     *      otherdata - miscellaneous data, rarely present
     *      message - generic message generated from the status code
     *  }
     *
     *  Each of the properties of the object may be null, so beware.
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
                        bimsg = 'According to the server, everything is OK.';
                        break;
                    case 3:
                        bimsg = 'The server indicates redirection.';
                        break;
                    case 4:
                        switch (response.status) {
                            case 404:
                                bimsg = 'You seem to be trying to use a resource that no longer exists.';
                                break;
                            case 409:
                                bimsg = 'You seem to be trying to start a same action multiple times.';
                                break;
                            default:
                                bimsg = 'We are not sure about the exact cause of the error, but it seems you are to blame.';
                                break;
                        }
                        break;
                    case 5:
                        bimsg = 'The server was unable to process the request for unknown reasons.';
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