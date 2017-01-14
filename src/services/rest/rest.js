(function () {

    // Main module
    var app = angular.module('odalic-app');

    // A REST service methods
    app.service('rest', function (requests, ioc) {

        return ioc['rest'](requests);

    });

})();