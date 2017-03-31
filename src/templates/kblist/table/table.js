// Deals with the table updates
var tableComponent = function (scope, rest, reporth) {

    var mirror = {};

    var updateMirror = function () {
        mirror = {};
        for (var i = 0; i < scope.kbs.length; ++i) {
            (function (j) {
                var kb = scope.kbs[j];

                // Add to 'mirror'
                mirror[kb.id] = j;
            })(i);
        }
    };

    return {
        refreshList: function (callback) {
            // TODO: The following statements should be wrapped around a corresponding REST request

            // TODO: The placeholder KB list is only temporary
            scope.kbs = [];
            for (var i = 0; i < 15; i++) {
                scope.kbs.push({
                    id: (new String()).concat("kb", i),
                    name: (new String()).concat("KB Name", " ", i),
                    description: (new String()).concat("KB Description", " ", i)
                });
            }

            updateMirror();

            if (callback) {
                callback();
            }

            // Update pagination directive
            scope.kbsProxy.model = scope.kbs;
            scope.$broadcast('pagination');

            // Display the table
            scope.dataload.show = true;

            // rest.files.list.exec(
            //     // Success
            //     function (response) {
            //         scope.files = response;
            //         updateMirror();
            //
            //         if (callback) {
            //             callback();
            //         }
            //
            //         // Update pagination directive
            //         scope.filesProxy.model = scope.files;
            //         scope.$broadcast('pagination');
            //
            //         // Display the table
            //         scope.dataload.show = true;
            //     },
            //     // Error
            //     function (response) {
            //         scope.files = [];
            //         mirror = {};
            //     }
            // );
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