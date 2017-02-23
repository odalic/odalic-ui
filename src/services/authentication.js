(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Satellizer configuration */
    app.config(function ($authProvider) {

        // Root
        var root = constants.addresses.odalicroot;

        // Configure
        $authProvider.loginUrl = text.urlConcat(root, 'users', 'authentications');
        $authProvider.signupUrl = text.urlConcat(root, 'users');

    });

})();