(function () {    

    // Synchronous script loading
    $.getScriptSync = function (filepath, callback) {
        // Set the current filepath
        var oldURL = $.getCurrentPath;
        $.getCurrentPath = function () {
            return filepath;
        }

        // Load the script synchronously
        $.ajax({
            async: false,
            type: 'GET',
            url: filepath,
            data: null,
            success: callback,
            dataType: 'script'
        });

        // Set back the filepath
        $.getCurrentPath = oldURL;
    };

    // Synchronous JSON loading
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

    // Set the "currently executing script filepath" for the current script
    $.getCurrentPath = function () {
        var scriptTags = document.getElementsByTagName("script");
        return scriptTags[scriptTags.length - 1].src;
    };

    // Getting a relative filepath in a convenient way
    $.getPathForRelativePath = function (filePath) {
        var current = $.getCurrentPath();
        return current.substring(0, current.lastIndexOf('/')) + '/' + filePath;
    }
    
    // Define the angular module dependencies
    angular.module('odalic-app', ['ngRoute']);
    
    // Dependencies (loaded synchronously)
    $.getJSONSync($.getPathForRelativePath('require.json'), function (includes) {
        includes.forEach(function (include) {
            $.getScriptSync($.getPathForRelativePath(include), function () { /* Purposely empty. */ });
        });
    });

})();