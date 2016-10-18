$.defineModule(function () {
    return {
        requests : null,
        sharedata : null,
        rest: null,
        getCSV : function(callback) {
            // Download the input CSV file in a JSON format directly
            this.rest.tasks.name(this.sharedata.get('TaskID')).input.retrieve.exec(
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
            callback(this.sharedata.get('Result'));
        },
        setKB: function () {
            // empty
        }
    };
});