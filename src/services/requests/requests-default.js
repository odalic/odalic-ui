$.defineModule(function () {
    // Preparations
    var parse = function (response) {
        var r = response.data;
        if (typeof(r) !== 'object') {
            r = JSON.parse(r);
        }

        var res = {};
        var addarg1 = undefined;
        var addarg2 = undefined;

        if (r.type === 'DATA') {
            res = r.payload;
        }
        else if (r.type === 'MESSAGE') {
            res = r.payload.text;
            addarg1 = r.payload.additionalResources;
            addarg2 = r.payload.debugContent;
        }

        return {
            result: res,
            argument1: addarg1,
            argument2: addarg2
        }
    };

    // Module
    return {
        // Default success function in each ajax request
        success: function (response, f) {
            var data = parse(response);
            f(data.result, data.argument1, data.argument2);
        },

        // Default failure function in each ajax request
        failure: function (response, f) {
            // Unauthorized?
            if (response.status === 401) {
                window.location.href = '#/login';
            }
            // Otherwise custom handler
            else {
                f(response);
            }
        }
    };
});