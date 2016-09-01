$.defineModule(function () {
    return {
        requests : null,
        sharedata : null,
        rest: null,
        getCSV : function(callback) {
            $.ajax({
                async: false,
                type: 'GET',
                url: './test/samples/input/i1.csv',
                data: null,
                success: function (response) {
                    callback(response);
                },
                dataType: "text"
            });
        },
        getJSON : function(callback) {
            $.getJSONSync('./test/samples/result/r1.json', function(res) {
                callback(res);
            });
        }
    };
});



