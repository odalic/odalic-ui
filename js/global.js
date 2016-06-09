(function () {    

    // Synchronous script loading
    $.getScriptSync = function (filepath, callback) {
        $.ajax({
            async: false,
            type: 'GET',
            url: filepath,
            data: null,
            success: callback,
            dataType: 'script'
        });
    };

    // Synchronous script loading
    $.getJSONSync = function (filepath, callback) {
        $.ajax({
            async: false,
            type: 'GET',
            url: filepath,
            data: null,
            success: callback,
            dataType: 'json'
        });
    };

    // Define the angular module dependencies
    angular.module('odalic-app', ['ngRoute']);
    
    // Critical dependencies (loaded synchronously)
    $.getJSONSync('js/require.json', function (includes) {
        includes.forEach(function (include) {
            $.getScriptSync(include, function () { /* Purposely empty. */ });
        });
    });

    // Important dependencies (loaded partially asynchronously)
    $.getJSONSync('js/include.json', function (includes) {
        includes.forEach(function (include) {
            $.getScript(include, function () { /* Purposely empty. */ });
        });
    });

})();