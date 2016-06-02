var app = angular.module('odalic-app', ['ngRoute']);

// Declare the mapping between routes, templates and their controllers
var mapping = [
    ['/', 'templates/home.html', 'odalic-home-ctrl'],
    ['/test', 'templates/test.html', 'odalic-test-ctrl']
];

// Create the controller for the root
app.controller('odalic-root-ctrl', function ($scope) {
    // ...
});

// Configure the routes
app.config(function ($routeProvider) {
    mapping.forEach(function (item) {

        // Set a template for a given route
        $routeProvider.when(item[0], {
            templateUrl: item[1],
            controller: item[2]
        });

        // Create a controller for a given page
        app.controller(item[2], function ($scope) {
            // ...
            // The implementation may be left empty for now.
            // ...
        });

    });
});