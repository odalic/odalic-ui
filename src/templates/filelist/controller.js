(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Create a controller for taskconfigs
    var currentFolder = $.getPathForRelativePath('');
    app.controller('odalic-filelist-ctrl', function ($scope, rest, reporth) {

        // Dealing with the table
        $.getScriptSync(currentFolder + 'table/table.js', function () {});
        var table = tableComponent($scope, rest, reporth);

        // Initialize
        $scope.fileconfig = {};
        $scope.files = [];
        $scope.messages = {};
        table.refreshList();

        // Pagination settings
        $scope.filesProxy = {
            perPage: 10
        };

        // Table button functions
        $scope.fdownload = function (fileId) {
            // TODO: header! taktiez nespravna adresa
            window.location = rest.files.name(fileId).retrieve.address();
        };

        $scope.fconfigure = function (fileId) {
            $scope.fileconfig.identifier = fileId;
            $scope.fileconfig.open();
        };

        $scope.fremove = function (fileId) {
            rest.files.name(fileId).remove.exec(
                // File removal finished successfully
                function (response) {
                    table.removeRecord(fileId);
                },
                // Error while removing the file
                function (response) {
                    $scope.messages.push('error', reporth.constrErrorMsg($scope['msgtxt.removeFailure'], response.data));
                }
            );
        };
    });

})();