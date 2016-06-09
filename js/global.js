//
// TODO: For now I have no idea how to include a file that would carry this script. Angular is executed right after page-load and thus the script must be loaded prior to the page-load.
// An idea: dynamically inject ng-app and ng-controller attributes from the index.html.
//
angular.module('odalic-app', ['ngRoute']);            // TODO: Remove and uncomment later.
(function () {

    // Declare the mapping between routes, templates and their controllers
    // TODO: this should also be declared in a json file, but the loading would be asynchronous, which is not feasible
    var mapping = [
        ['/', 'pages/home/home.html', 'odalic-home-ctrl'],
        ['/test', 'pages/test.html', 'odalic-test-ctrl']
    ];

    // Main module
    var app = angular.module('odalic-app');

    // Create the root controller
    app.controller('odalic-root-ctrl', function ($scope) { /* ... */ });

    // Configure the route
    app.config(function ($routeProvider) {
        mapping.forEach(function (item) {
            // Set a template for a given route
            $routeProvider.when(item[0], {
                templateUrl: item[1],
                controller: item[2]
            });
        });
    });

    // Create controllers for each page
    mapping.forEach(function (item) {
        app.controller(item[2], function ($scope) { /* ... */ });
    });

})();



// 
// Warning: The scripts are loaded asynchronously.
//
(function () {

    // Declaration of dependencies
    var dependencies = [
        //"js/controllers/controllers.js",  // TODO: any ideas?
        "js/navbar/navbar.js"
    ];

    // Describe the angular module dependencies
    //var app = angular.module('odalic-app', ['ngRoute']);

    // Load declared scripts
    dependencies.forEach(function (dependency) {
        $.getScript(dependency, function () { /* Purposely empty. */ })
    });

})();