$.defineModule(function () {
    return {
        // Default success function in each ajax request
        success: function (response, f) {
            f(response);
        },

        // Default failure function in each ajax request
        failure: function (response, f) {
            f(response);
        }
    };
});