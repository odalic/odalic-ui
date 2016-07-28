$.defineModule(function () {
    return {
        requests : null,
        sharedata : null,
        getCSV : function(callback) {
            // Download the input CSV file and then load it
            this.requests.reqCSV({
                method: "GET",
                address: this.sharedata.get("Input"),
                formData: 'unspecified',
                success: function (response) {
                    callback(response.data);
                    this.sharedata.clear("Input");
                },
                failure: function (response) {
                    // Failure
                }
            });
        },
        getJSON : function(callback) {
            callback(JSON.parse(this.sharedata.get("Result")));
            this.sharedata.clear("Result");
        }
    };
});