(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Create a controller for taskconfigs
    var currentFolder = $.getPathForRelativePath('');
    app.controller('odalic-kblist-ctrl', function ($scope, rest, reporth) {

        // Initialize
        $scope.dataload = {};
        $scope.kbs = [];
        $scope.kbsProxy = {};
        $scope.messages = {};

        // Dealing with the table
        $.getScriptSync(currentFolder + 'table/table.js', function () {});
        var table = tableComponent($scope, rest, reporth);

        // Load the initial data
        table.refreshList();

        // TODO: The placeholder actions have to be modified once the server API is ready
        $scope.fconfigure = function (kbID) {
            window.location.href = text.urlConcat('#', 'kbconfig', kbID);
        };

        $scope.fremove = function (kbID) {
            table.removeRecord(kbID);
        };

        $scope.fadd = function () {
            window.location.href = '#/kbconfig';
        };

        $scope.fimport = function () {
            window.location.href = '#/kbimport';
        };

        $scope.fdownload = function (s, f, kbID) {
            // TODO: tries to get ".data" from the actual response... is this OK? (not working well in testing environment)
            rest.bases.name(kbID).retrieve.exec(s, f);
        };
        $scope.configderror = function (response) {
            $scope.messages.push('error', reporth.constrErrorMsg($scope['msgtxt.configdFailure'], response.data));
        };

    });

})();
