(function () {

    // Main module
    var app = angular.module('odalic-app');

    // A service for reading data from files in a convenient way
    app.service('filedata', function () {
        // Reference to self
        var _ref = this;

        /** Reads a local file using an <input type="file" /> element.
         *  Returns the data in base64 format using a callback function (asynchronous).
         *
         * @param inputFileElementId    An id of the input file element to read the file from.
         * @param callback              A function accepting 1 parameter: the data in base64 format.
         * @param failure               An optional function to call in case of a failure.
         *
         */
        this.readBase64 = function (inputFileElementId, callback, failure) {
            var reader = new FileReader();

            reader.onload = function (e) {
                var data = this.result.substring(this.result.indexOf(",") + 1);
                callback(data);
            };

            var dd = document.getElementById(inputFileElementId).files[0];
            if (typeof(dd) == 'object') {
                reader.readAsDataURL(dd);
            } else {
                if (failure) {
                    failure('No file selected');
                }
            }
        };

        /** Returns whether a file has been chosen for an upload.
         *
         * @param inputFileElementId    An id of the input file element to check.
         * @returns {boolean}           Whether a file has been selected or not.
         */
        this.filePresent = function (inputFileElementId) {
            return document.getElementById(inputFileElementId).files.length > 0;
        };

        /** Returns a file object of an input-file element.
         *
         * @param inputFileElementId    An id of the input file element to check.
         * @returns {*}                 File object  or null, if no file is selected.
         */
        this.fileObject = function (inputFileElementId) {
            if (_ref.filePresent(inputFileElementId)) {
                return document.getElementById(inputFileElementId).files[0];
            }

            return null;
        };

        /** Returns a name of a selected file.
         *
         * @param inputFileElementId    An id of the input file element to check.
         * @returns {*}                 Name of the file or null, if no file is selected.
         */
        this.fileName = function (inputFileElementId) {
            var res = _ref.fileObject(inputFileElementId);
            if (res) {
                return res.name;
            };

            return null;
        };

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