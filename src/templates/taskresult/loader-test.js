$.defineModule(function () {
    return {
        requests : null,
        sharedata : null,
        rest: null,
        getCSV : function (callback) {
            // Load the local CSV file and parse it via PapaParse library
            $.ajax({
                async: false,
                type: 'GET',
                url: './test/samples/input/i1.csv',
                data: null,
                success: function (response) {
                    Papa.parse(response, {
                        worker: true,
                        complete: function (inputFile) {
                            var inputFileRows = [];
                            for (var i = 1; i < inputFile.data.length; i++) {
                                inputFileRows.push(inputFile.data[i]);
                            }

                            // Call the callback, which should handle the data and fill the table
                            callback({
                                'columns': inputFile.data[0],
                                'rows': inputFileRows
                            });
                        }
                    });
                },
                dataType: 'text'
            });
        },
        getJSON: function (callback) {
            $.getJSONSync('./test/samples/result/r1.json', function (res) {
                callback(res);
            });
        },
        setKB: function () {
            this.sharedata.set('PrimaryKB', 'DBpedia');
            this.sharedata.set('ChosenKBs', ["DBpedia"]);
        }
    };
});