(function () {

  // Main module
  var app = angular.module('odalic-app');

  // navbar directive
  var currentFolder = $.getPathForRelativePath('');
  app.directive('navbar', function ($auth, authh) {
    return {
      restrict: 'E',
      templateUrl: currentFolder + 'navbar.html',
      link: function (scope, iElement, iAttrs) {
        scope.selected = iAttrs.selected;

        $.getJSONSync(currentFolder + iAttrs.lmenu, function (json) {
          scope.leftMenu = json;
        });

        $.getJSONSync(currentFolder + iAttrs.rmenu, function (json) {
          scope.rightMenu = json;
        });

        // Custom conditions for right buttons (display or hide?)
        scope.conditioned = function (item) {
          // Note we cannot use filters here since they are evaluated by angular only once! (but the login status may change anytime)
          if ('condition' in item) {
            return scope.$eval(item['condition']);
          }

          return true;
        };

        // Additional settings for custom conditions
        scope.$auth = $auth;
        scope.authh = authh;

        scope.authenticate = function(provider) {
          authh.authenticate(provider, '/login');
        };
      }
    }
  });

})();