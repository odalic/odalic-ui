(function () {    

    // Synchronous script loading
    $.getScriptSync = function (filepath, callback, failure) {
        // Set the current filepath
        var oldURL = $.getCurrentPath;
        $.getCurrentPath = function () {
            return filepath;
        };

        // Load the script synchronously
        $.ajax({
            async: false,
            type: 'GET',
            url: filepath,
            data: null,
            success: callback,
            error: function(a, b, c) {
                if (failure) {
                    failure(a, b, c);
                }
            },
            dataType: 'script'
        });

        // Set back the filepath
        $.getCurrentPath = oldURL;
    };

    // Synchronous JSON loading
    $.getJSONSync = function (filepath, callback, failure) {
        $.ajax({
            async: false,
            type: 'GET',
            url: filepath,
            data: null,
            success: callback,
            error: function(a, b, c) {
                if (failure) {
                    failure(a, b, c);
                }
            },
            dataType: 'json'
        });
    };

    // Set the "currently executing script filepath" for the current script
    $.getCurrentPath = function () {
        var scriptTags = document.getElementsByTagName("script");
        return scriptTags[scriptTags.length - 1].src;
    };

    // Getting a relative filepath in a convenient way
    $.getPathForRelativePath = function (filePath) {
        var current = $.getCurrentPath();
        return current.substring(0, current.lastIndexOf('/')) + '/' + filePath;
    };

    // Angular module dependencies
    angular.module('odalic-app', [
        'ngRoute',
        'ngSanitize',
        'ui.select',
        'ui.bootstrap',
        'ngMessages',
        'ngAnimate',
        'satellizer'
    ]);

    // Dependencies (loaded synchronously)
    $.getJSONSync($.getPathForRelativePath('require.json'), function (includes) {
        includes.forEach(function (include) {
            $.getScriptSync($.getPathForRelativePath(include), function () { /* Purposely empty. */ });
        });
    });

})();