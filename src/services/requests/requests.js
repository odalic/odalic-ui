(function () {

    // Main module
    var app = angular.module('odalic-app');

    // A service for creating REST requests in a convenient way
    app.service('requests', function ($http) {

		/** Format of "request_package" object parameter.
		 * 
		 * {
		 * 	method 		A string parameter. e.g. "PUT", "POST", etc.
		 * 	formData 	Object containing the data to send. May vary.
		 * 	success		A callback function to call if the method succeeds.
		 * 	failure		A callback function to call if the method fails.
		 * }
		 *
		 */
		 
		 // A generic request.
		 function generic_request(request_package, headers_package) {
			 $http({
				method : request_package.method,
				url : request_package.address,
				headers : headers_package,
				transformResponse: [function (data) {
					return data;
				}],
				data : request_package.formData
			}).then(
				function(response) { 
					request_package.success(response) 
				},
				function(response) { 
					request_package.failure(response) 
				}
			);
		 }
		 
		/** Helps to prepare "multipart/form-data" payload.
		 *
		 * @return 	JavaScript object.
		 *				JSObject attachJSON(String key, JSObject data)
		 *				JSObject attachCSV(String key, String /format: base64/ data)
		 *				FormData get()
		 * 
		 */
		this.prepareMFD = function() {
			return (function() {
				var formData = new FormData();		
				
				return {
					attachJSON : function(key, jsonObject) {
						formData.append(key, new Blob([JSON.stringify(jsonObject)], { type : "application/json" }));
						return this;
					},
					attachCSV : function(key, dataBase64) {
						formData.append(key, new Blob([dataBase64], { type : "text/csv" }));
						return this;
					},
					attachGeneric : function(key, data) {
						formData.append(key, data);
						return this;
					},
					get : function() {
						return formData;
					}
				};
			})();
		}
		
		/** Performs a request while encoding the data in "multipart/form-data".
		 *	Does not transform the response.
		 *
		 * 	@param request_package		A request_package with formData containing FormData object.
		 *
		 */
		this.reqMFD = function(request_package) {
			generic_request(request_package, { 'Content-Type' : undefined });
		};
		
		/** Performs a request while encoding the data in "JSON".
		 *	Does not transform the response.
		 *
		 * 	@param request_package		A request_package with formData containing JSON object.
		 *
		 */
		this.reqJSON = function(request_package) {
			generic_request(request_package, { 'Content-Type' : 'application/json' });
		};
		
		/** Performs a generic request with MIME type set to 'text/csv'.
		 *	Does not transform the response.
		 *
		 * 	@param request_package		A generic request_package.
		 *
		 */
		this.reqCSV = function(request_package) {
			generic_request(request_package, { 'Content-Type' : 'text/csv', 'Accept' : 'text/csv' });
		};
		
	});
	
})();