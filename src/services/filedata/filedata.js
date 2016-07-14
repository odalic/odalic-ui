(function () {

    // Main module
    var app = angular.module('odalic-app');

    // A service for reading data from files in a convenient way
    app.service('filedata', function () {

        /** Reads a local file using an <input type="file" /> element.
         *  Returns the data in base64 format using a callback function (asynchronous).
         *
         * @param inputFileElementId    An id of the input file element to read the file from.
         * @param callback              A function accepting 1 parameter: the data in base64 format.
         *
         */
        this.readBase64 = function (inputFileElementId, callback) {
            var reader = new FileReader();

            reader.onload = function (e) {
                var data = this.result.substring(this.result.indexOf(",") + 1);
                callback(data);
            };

            reader.readAsDataURL(document.getElementById(inputFileElementId).files[0]);
        }

        /** Clears the specified <input type="file" /> control.
         *
         * @param inputFileElementId    An id of the input file element to clear.
         *
         */
        this.clearInputFile = function (inputFileElementId) {
            var e = document.getElementById(inputFileElementId);
            e.parentNode.replaceChild(e.cloneNode(true), e);
        };

    });

})();