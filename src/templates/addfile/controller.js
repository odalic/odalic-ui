(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Create a controller for task import screen
    app.controller('odalic-addfile-ctrl', function ($scope, filedata, rest, formsval, reporth) {

        // Initialization
        formsval.toScope($scope);
        $scope.fileinput = {};

        // Controls
        $scope.addfl = {
            goBack: function () {
                window.location = text.urlConcat('#', 'filelist');
            }
        };

        // Redirect to login screen if not logged
        rest.users.test.automatic.exec(objhelp.emptyFunction);

    });

})();