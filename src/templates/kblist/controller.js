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
            var response = { data: { payload: { text: "This is only a DEMO." } } };
            $scope.messages.push('error', reporth.constrErrorMsg($scope['msgtxt.unknownFailure'], response.data));
        };

        $scope.fremove = function (kbID) {
            table.removeRecord(kbID);
        };

        $scope.fadd = function () {
            var response = { data: { payload: { text: "This is only a DEMO." } } };
            $scope.messages.push('error', reporth.constrErrorMsg($scope['msgtxt.unknownFailure'], response.data));
        };

        $scope.fdownload = function (s, f, kbID) {
            //rest.tasks.name(kbID).configuration.retrieve.exec(s, f);
            f({ data: { payload: { text: "This is only a DEMO." } } });
        };
        $scope.configderror = function (response) {
            $scope.messages.push('error', reporth.constrErrorMsg($scope['msgtxt.configdFailure'], response.data));
        };

    });

})();
