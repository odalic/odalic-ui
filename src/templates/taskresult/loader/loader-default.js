$.defineModule(function () {
    return function (sharedata, requests, rest) {
        return {
            getCSV : function(callback) {
                // Download the input CSV file in a JSON format directly
                rest.tasks.name(sharedata.get('TaskID')).input.retrieve.exec(
                    function (response) {
                        // Call the callback, which should handle the data and fill the table
                        var r = response;
                        callback({
                            'columns': r.headers,
                            'rows': r.rows
                        });
                    },
                    // Fatal error, table is empty
                    function (data) {
                        callback({
                            'columns': [],
                            'rows': []
                        });
                    }
                );
            },

            getJSON : function(callback) {
                callback(sharedata.get('Result'));
            },

            getKB: function () {
                return {
                    PrimaryKB: sharedata.get('PrimaryKB'),
                    ChosenKBs: sharedata.get('ChosenKBs')
                };
            }
        };
    };
});