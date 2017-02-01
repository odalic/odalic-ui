(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Configure routes
    app.config(function ($authProvider) {

        // Root
        var root = constants.addresses.odalicroot;

        // Configure
        $authProvider.loginUrl = text.urlConcat(root, 'users', 'authentications');
        $authProvider.signupUrl = text.urlConcat(root, 'users');

        // $authProvider.google({
        //     clientId: '526771567449-ope1mlfqrptemsqbgk4iae1e9j6728kf.apps.googleusercontent.com',
        //     url: 'authtest/index.htm',
        //     redirectUri: window.location.origin,
        //     responseType: 'token'
        // });

        // Custom
        // $authProvider.oauth2({
        //     name: 'foursquare',
        //     url: '/auth/foursquare',
        //     clientId: 'Foursquare Client ID',
        //     redirectUri: window.location.origin,
        //     authorizationEndpoint: 'https://foursquare.com/oauth2/authenticate',
        // });
    });

})();