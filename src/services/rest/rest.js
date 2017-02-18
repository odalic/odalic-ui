(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** rest
     *  Description:
     *      AJAX requests as in compliance with the REST API specification for the server.
     *
     *  Usage:
     *      # Example 1: Importing file configuration
     *      // s, f: success/failure functions (for when the request succeeds or fails)
     *      rest.tasks.name(taskId).configuration.import(filedata.fileObject('concreteFile')).exec(s, f);
     *
     *
     *      # Example 2: Retrieving a file
     *      rest.files.name('Books.csv').retrieve.exec(f, s);
     *
     */
    app.service('rest', function (requests, ioc) {

        return ioc['rest'](requests);

    });

})();