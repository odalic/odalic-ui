(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Create a controller for taskconfigs
    var currentFolder = $.getPathForRelativePath('');
    app.controller('odalic-kblist-ctrl', function ($scope, rest, reporth) {

        // Initialize
        $scope.dataload = {};
        $scope.kbsProxy = {};

        // TODO: The manual show is only temporary
        $scope.dataload.show = true;

        // TODO: The placeholder KB list is only temporary
        $scope.kbsProxy.model = [
            {
                id: "kb1",
                name: "KB1",
                description: "KB1 description"
            },
            {
                id: "kb2",
                name: "KB2",
                description: "KB2 description"
            },
            {
                id: "kb3",
                name: "KB3",
                description: "KB3 description"
            }
        ];

        // // Dealing with the table
        // $.getScriptSync(currentFolder + 'table/table.js', function () {});
        // var table = tableComponent($scope, rest, reporth);
        //
        // // Initialize
        // $scope.fileconfig = {};
        // $scope.files = [];
        // $scope.messages = {};
        // $scope.dataload = {};
        // table.refreshList();
        //
        // // Table button functions
        // $scope.fdownload = function (f, s, identifier) {
        //     rest.files.name(identifier).retrieve.exec(f, s);
        // };
        //
        // $scope.fconfigure = function (fileId) {
        //     $scope.fileconfig.identifier = fileId;
        //     $scope.fileconfig.open();
        // };
        //
        // $scope.fremove = function (fileId) {
        //     rest.files.name(fileId).remove.exec(
        //         // File removal finished successfully
        //         function (response) {
        //             table.removeRecord(fileId);
        //         },
        //         // Error while removing the file
        //         function (response) {
        //             $scope.messages.push('error', reporth.constrErrorMsg($scope['msgtxt.removeFailure'], response.data));
        //         }
        //     );
        // };
        //
        // // Handling errors for file download
        // $scope.fileerror = function (response) {
        //     $scope.messages.push('error', reporth.constrErrorMsg($scope['msgtxt.downloadFailure'], response.data));
        // };
        //
        // // Miscellaneous
        // $scope.misc = {
        //     addNew: function () {
        //         window.location = text.urlConcat('#', 'addfile');
        //     }
        // };

    });

})();
