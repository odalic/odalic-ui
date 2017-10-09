(function () {

  // Main module
  var app = angular.module('odalic-app');

  /** Satellizer configuration */
  app.config(function ($authProvider) {

    // Root
    var root = constants.configurables.server.address;

    // Configure
    $authProvider.loginUrl = text.urlConcat(root, 'users', 'authentications');
    $authProvider.signupUrl = text.urlConcat(root, 'users');

    // Configure the GitLab authentication
    if (constants.configurables.signup.loginMode === 'gitlab') {
      $authProvider.oauth2({
        name: 'gitlab',
        clientId: constants.configurables.signup.gitlabApplicationId,
        redirectUri: constants.configurables.signup.gitlabApplicationRedirectUrl,
        authorizationEndpoint: constants.configurables.signup.gitlabUrl + '/oauth/authorize',
        responseType: 'token'
      });
    }

  });

})();