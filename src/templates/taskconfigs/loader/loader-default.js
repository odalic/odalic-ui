$.defineModule(function () {
    return function(rest) {
        return {
            getTasks: function (success, failure) {
                this.rest.tasks.exec(
                    // Success
                    function (response) {
                        // TODO when server is ready
                        success(response);
                    },
                    // Error
                    function (response) {
                        // TODO when server is ready
                        failure(response);
                    }
                );
            }
        };
    };
});