// Deals with the table updates
var tableComponent = function (scope, rest, reporth) {

    var mirror = {};

    var updateMirror = function () {
        mirror = {};
        for (var i = 0; i < scope.files.length; ++i) {
            (function (j) {
                var file = scope.files[j];

                // Add to 'mirror'
                mirror[file.id] = j;
            })(i);
        }
    };

    return {
        refreshList: function (callback) {
            rest.files.list.exec(
                // Success
                function (response) {
                    scope.files = response;
                    updateMirror();

                    if (callback) {
                        callback();
                    }

                    // Update pagination directive
                    scope.filesProxy.model = scope.files;
                    scope.$broadcast('pagination');

                    // Display the table
                    scope.dataload.show = true;
                },
                // Error
                function (response) {
                    scope.files = [];
                    mirror = {};
                }
            );
        },

        removeRecord: function (fileId, callback) {
            if (fileId in mirror) {
                scope.files.splice(mirror[fileId], 1);
                updateMirror();

                if (callback) {
                    callback();
                }

                // Update pagination directive
                scope.$broadcast('pagination');
            }
        }
    };
};