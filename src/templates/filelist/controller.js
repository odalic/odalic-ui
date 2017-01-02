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
        $scope.files = [];
        $scope.messages = {};
        table.refreshList();

        // Table button functions
        $scope.fdownload = function (fileId) {
            // TODO
            //window.location = '#/taskresult/' + fileId;
        };

        $scope.fconfigure = function (fileId) {
            // TODO
            // window.location = '#/createnewtask/' + fileId;
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

        // Miscellaneous
        $scope.misc = {
            gotocnt: function () {
                // TODO
                // window.location.href = '#/createnewtask';
            }
        };
    });

})();