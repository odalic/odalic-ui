(function () {

    /** authh
     *  Description:
     *      A helper service to deal with signing up and logging into an account.
     */

    // Main module
    var app = angular.module('odalic-app');
    app.service('authh', function ($auth) {

        var _username = null;
        var _password = null;

        /** Save credentials for future reference
         *
         * @param username  Username
         * @param password  Password
         */
        this.saveCredentials = function (username, password) {
            if (!username || !password) {
                throw new Error('Both username and password need to be set.');
            }

            _username = username;
            _password = password;
        };

        /** Clears the saved credentials.
         */
        this.clearCredentials = function () {
            _username = null;
            _password = null;
        };

        /** Returns whether an automatic login is configured.
         *
         * @returns {boolean} True if automatic login is configured.
         */
        this.isAutomaticLogin = function () {
            return text.safeBool(constants.configurables.signup.automaticLogin, false);
        };

        /** Automatically logs into the account, provided the credentials were saved.
         *
         */
        this.login = function (success, failure) {
            if (_username && _password) {
                $auth.login({
                    email: _username,
                    password: _password
                }).then(function(response) {
                    $auth.setToken(response.data.payload.token);
                    objhelp.callDefined(success, response);
                }).catch(function(response) {
                    objhelp.callDefined(failure, response);
                });
            }

            this.clearCredentials();
        };

    });

})();