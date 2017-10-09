(function () {

  /** authh
   *  Description:
   *      A helper service to deal with signing up and logging into an account.
   */

    // Main module
  var app = angular.module('odalic-app');
  app.service('authh', function ($auth, $location) {

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

    /** Returns the currently configured login mode.
     *
     * @returns {string} The login mode, possible values are:
     *   - default: Logging in with the regular user account.
     *   - gitlab: Logging in with the user's Gitlab account.
     */
    this.getLoginMode = function () {
      return text.safe2(constants.configurables.signup.loginMode, 'default');
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

    /** Authenticate to a provider.
     *
     * @param provider  The ID of the provider of authenticate to.
     * @param redirect_path  The path to redirect the user to on success.
     */
    this.authenticate = function (provider, redirect_path) {
      $auth.authenticate(provider)
      // The authentication succeeded.
        .then(function(response) {
          $auth.setToken(response.access_token);
          if (redirect_path.length !== null) {
            $location.path(redirect_path);
          }
        })
        // The authentication failed.
        .catch(function(response) {
        });
    };

  });

})();