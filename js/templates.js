/*
 * TODO: Create declarative mapping instead of an imperative one.
 */

var app = angular.module('odalic-app', ['ngRoute']);

// configure our routes
app.config(function ($routeProvider) {

    $routeProvider

        // Home page
        .when('/', {
            templateUrl: 'templates/home.html',
            controller: 'odalic-home-ctrl'
        })

        // Test page
        .when('/test', {
            templateUrl: 'templates/test.html',
            controller: 'odalic-test-ctrl'
        })

});

// Create the controller for the root
app.controller('odalic-root-ctrl', function ($scope) {
    // ...
});

// Create the controller for the home
app.controller('odalic-home-ctrl', function ($scope) {
    // ...
});

// Create the controller for the test
app.controller('odalic-test-ctrl', function ($scope) {
    // ...
});