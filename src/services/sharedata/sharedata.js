(function () {

    // Main module
    var app = angular.module('odalic-app');

    // A service for sharing data between pages
    app.service('sharedata', function () {
        var stateObject = {};

        // Saving data
        this.set = function (key, value) {
            stateObject[key] = value;
        }

        // Cleaning data
        this.clear = function (key) {
            delete stateObject[key];
        }

        // Retrieving data
        this.get = function (key) {
            return stateObject[key];
        }
    });

})();