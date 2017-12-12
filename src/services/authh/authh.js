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


    this.isCustomAuthenticated = function () {
       //copy cookie to local store
        //this.setCookie("satellizer_token", "1f19495443e6a687ab9b6df58889f1239ae5d7bfae706b696c6df22e79c0aee1", 1);
        var auth = this.getCookie("satellizer_token");
        if (auth != "") {
            localStorage.setItem("satellizer_token", auth);
        }
        return $auth.isAuthenticated();
    }


    this.getCookie = function(cname) {
          var name = cname + "=";
          var ca = document.cookie.split(';');
          for(var i = 0; i < ca.length; i++) {
              var c = ca[i];
              while (c.charAt(0) == ' ') {
                  c = c.substring(1);
              }
              if (c.indexOf(name) == 0) {
                  return c.substring(name.length, c.length);
              }
          }
          return "";
      }

      this.setCookie = function (cname, cvalue, exdays) {
          var d = new Date();
          d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
          var expires = "expires="+d.toUTCString();
          document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      }


  });

})();


