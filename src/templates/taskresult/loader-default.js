$.defineModule(function () {
    return {
        requests : null,
        sharedata : null,
        rest: null,
        getCSV : function(callback) {
            // Download the input CSV file and then load it
            this.rest.files.name(this.sharedata.get('Input')).retrieve.exec(
                // Success
                function (response) {
                    callback(response.data);
                    //this.sharedata.clear("Input");
                },
                // Failure
                function (response) {
                    // Empty
                }
            );
        },
        getJSON : function(callback) {
            callback(JSON.parse(this.sharedata.get('Result')));
            //this.sharedata.clear("Result");
        },
        setKB: function () {
        }
};
});