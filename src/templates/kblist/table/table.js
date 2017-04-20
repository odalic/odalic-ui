// Deals with the table updates
var tableComponent = function (scope, rest, reporth) {

    var mirror = {};

    var updateMirror = function () {
        mirror = {};
        for (var i = 0; i < scope.kbs.length; ++i) {
            (function (j) {
                var kb = scope.kbs[j];

                // Add to 'mirror'
                mirror[kb.name] = j;
            })(i);
        }
    };

    return {
        refreshList: function (callback) {
            // TODO: Modifiable?
            rest.bases.list(false).exec(
                // Success
                function (response) {
                    scope.kbs = response;
                    updateMirror();

                    if (callback) {
                        callback();
                    }

                    // Update pagination directive
                    scope.kbsProxy.model = scope.kbs;
                    scope.$broadcast('pagination');

                    // Display the table
                    scope.dataload.show = true;
                },
                // Error
                function (response) {
                    scope.kbs = [];
                    mirror = {};
                }
            );
        },

        removeRecord: function (kbID, callback) {
            if (kbID in mirror) {
                scope.kbs.splice(mirror[kbID], 1);
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