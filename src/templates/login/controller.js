(function () {

  // Main module
  var app = angular.module('odalic-app');

  // Create a controller for ngtest
  var currentFolder = $.getPathForRelativePath('');
  app.controller('odalic-login-ctrl', function ($scope, formsval, $auth, rest, reporth, authh) {

    // Initialization
    formsval.toScope($scope);
    $scope.status = 'default';

    // Log in panel
    $scope.login = {
      alerts: {},
      username: new String(),
      password: new String(),
      logobj: {},
      login: function (f) {
        // Validate
        if (!formsval.validate($scope.loginForm)) {
          f();
          return;
        }

        // Log in
        var ref = $scope.login;
        authh.saveCredentials(ref.username, ref.password);
        authh.login(
          // Success
          function (response) {
            $scope.status = 'logged';
          },
          // Failure
          function (response) {
            ref.alerts.push('error', reporth.constrErrorMsg($scope['msgtxt.failure'], response.data));
            f();
          }
        );
      }
    };

    // User already logged in
    $scope.logged = {
      alert: {},
      account: {
        getUsername: function () {
          return $auth.getPayload()['sub'];
        },
        getToken: function () {
          return $auth.getToken();
        }
      },
      logout: function () {
        $auth.logout();

        // Redirect to start page on logout.
        if (authh.getLoginMode() === 'gitlab') {
          window.location = '#/';
        }
        else {
          $scope.status = 'login';
        }
      }
    };

    // Automatic login
    var handleAutomaticLogin = function () {
      if (authh.isAutomaticLogin()) {
        authh.login(
          // Success
          function (response) {
            $scope.status = 'logged';
          },
          // Failure
          function (response) {
            $scope.status = 'login';
          }
        );
      }
      else {
        $scope.status = 'login';
      }
    };

    // Check if user is already logged in
    if (authh.isCustomAuthenticated()) {
      $scope.status = 'evaluating';
      rest.users.test.custom.exec(
        // Success
        function (response) {
          $scope.status = 'logged';
        },
        // Token expired
        function (response) {
          $auth.logout();
          $scope.status = 'login';
        },
        // Failure while testing
        function (response) {
          $auth.logout();
          $scope.status = 'login';
        }
      );
    } else {
      handleAutomaticLogin();
    }

    // Redirect to start page if not logged in.
    if (($scope.status === 'default' || $scope.status === 'login') && authh.getLoginMode() === 'gitlab') {
      window.location = '#/';
    }
  });

})();
