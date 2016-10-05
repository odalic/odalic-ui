$.defineModule(function () {
    return function(rest) {
        return {
            getTasks: function (success, failure) {
                $.ajax({
                    async: false,
                    type: 'GET',
                    url: './test/samples/taskconfigs/tc1.json',
                    data: null,
                    success: function (response) {
                        success(JSON.parse(response));
                    },
                    error: function (response) {
                        failure(response);
                    },
                    dataType: 'text'
                });
            }
        };
    };
});