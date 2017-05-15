(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** requests
     *  Description:
     *      A service for creating AJAX requests in a convenient way.
     *      Default behaviour is affected by 'requests' module (see ioc/modules.json).
     */
    app.service('requests', function ($http, ioc) {

        /** Format of "request_package" object parameter.
         *
         * {
         * 	method 		A string parameter. e.g. "PUT", "POST", etc.
         * 	address     URL to send the request to.
         * 	formData 	Object containing the data to send. May vary.
         * 	success		A callback function to call if the method succeeds.
         * 	failure		A callback function to call if the method fails.
         * }
         *
         */

        // A generic request.
        function generic_request(request_package, headers_package) {
            var timeStart = new Date().getTime();
            $http({
                method: request_package.method,
                url: request_package.address,
                headers: headers_package,
                transformResponse: [function (data) {
                    return data;
                }],
                data: request_package.formData,
                timeout: constants.configurables.requests.timeout
            }).then(
                function (response) {
                    ioc['requests'].success(response, request_package.success);
                },
                function (response, status) {
                    // Prepare
                    status = 'default';

                    // Did the request timeout?
                    var timeNow = new Date().getTime();
                    if (timeNow - timeStart >= constants.configurables.requests.timeout - 500) {
                        status = 'timeout';
                    }

                    // Handle
                    ioc['requests'].failure(response, request_package.failure, status);
                }
            );
        }

        /** A simple generic request wrapper.
         * Does not support more complicated headers.
         *
         * @param url           Url of the source
         * @param method        GET / POST / PUT / DELETE
         * @param success       Success function
         * @param failure       Failure function
         * @param acceptType    Content-type of data accepted (in header)
         * @param type          Content-type of data sent (in header)
         * @param data          Data to be sent to server
         */
        this.quickRequest = function (url, method, success, failure, acceptType, type, data) {
            generic_request({
                method: method,
                address: url,
                formData: data,
                success: success,
                failure: failure
            }, {
                'Content-Type': type,
                'Accept': acceptType
            });
        };

        /** Helps to prepare "multipart/form-data" payload.
         *
         * @return    JavaScript object with the following methods:
         *            {Object} attachJSON({string} key, {Object} data)
         *            {Object} attachCSV({string} key, {string} data)
         *            {Object} get()
         *
         */
        this.prepareMFD = function () {
            return (function () {
                var formData = new FormData();

                return {
                    attachJSON: function (key, jsonObject) {
                        formData.append(key, new Blob([JSON.stringify(jsonObject)], {type: "application/json"}));
                        return this;
                    },
                    attachCSV: function (key, dataBase64) {
                        formData.append(key, new Blob([dataBase64], {type: "text/csv"}));
                        return this;
                    },
                    attachGeneric: function (key, data) {
                        formData.append(key, data);
                        return this;
                    },
                    get: function () {
                        return formData;
                    }
                };
            })();
        };

        /** Performs a request while encoding the data in "multipart/form-data".
         *  Does not transform the response.
         *
         *    @param request_package        A request_package with formData containing FormData object.
         *
         */
        this.reqMFD = function (request_package) {
            generic_request(request_package, {'Content-Type': undefined});
        };

        /** Performs a request while encoding the data in "JSON".
         *  Does not transform the response.
         *
         *    @param request_package        A request_package with formData containing JSON object.
         *
         */
        this.reqJSON = function (request_package) {
            generic_request(request_package, {'Content-Type': 'application/json'});
        };

        /** Performs a generic request with MIME type set to 'text/csv'.
         *  Does not transform the response.
         *
         *    @param request_package        A generic request_package.
         *
         */
        this.reqCSV = function (request_package) {
            generic_request(request_package, {'Content-Type': 'text/csv', 'Accept': 'text/csv'});
        };

        /** Performs a generic request with MIME type set to 'text/turtle'.
         *  Does not transform the response.
         *
         *    @param request_package        A generic request_package.
         *
         */
        this.reqRDF = function (request_package) {
            generic_request(request_package, {'Content-Type': 'text/turtle', 'Accept': 'text/turtle'});
        };

        /** A simple generic request wrapper that ignores default
         *  behaviour specified by IOC.
         *  Serves ONLY for requests that are an exception from rules
         *  set by the server, e.g. wrapped response, etc.
         *
         * @param url           Url of the resource
         * @param method        GET / POST / PUT / DELETE
         * @param success       Success function
         * @param failure       Failure function
         * @param acceptType    Content-type of data accepted (in header)
         * @param type          Content-type of data sent (in header)
         * @param data          Data to be sent to server
         */
        this.pureRequest = function (url, method, success, failure, acceptType, type, data) {
            $http({
                method: method,
                url: url,
                headers: {
                    'Content-Type': type,
                    'Accept': acceptType
                },
                transformResponse: [function (data) {
                    return data;
                }],
                data: data
            }).then(success, failure);
        };
    });

})();