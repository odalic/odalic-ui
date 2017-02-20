(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** ioc
     *  Description:
     *      (Very) simplified implementation of 'inversion of control' pattern.
     *
     *  Usage:
     *      # Defining a new module in the configuration file (modules.json)
     *      {
     *          "name": "my-module",
     *          "source": "../../templates/testing/mytestingmodule.js",
     *          "args": ['Hello World!', 'Hello, IoC!'],
     *          "description": "This module is just for testing purposes only."
     *      }
     *
     *
     *      # Defining the module in a corresponding file ("../../templates/testing/mytestingmodule.js")
     *      $.defineModule(function (str1, str2) {
     *          return 'This module returns a string.' + str1 + str2;
     *      });
     *
     *
     *      # Using the module
     *      var myString = ioc['my-module'];
     */
    var currentFolder = $.getPathForRelativePath('');
    app.service('ioc', function () {

        var args = [];
        var defined = [];
        var result = {};

        /** Use this function to define a new module.
         *  Note a single file may use this function only once.
         *
         * @param task A function which should return an object being the defined module.
         */
        $.defineModule = function(task) {
             defined.push(task.apply(task, args));
        };

        // Load the modules file
        $.getJSONSync(currentFolder + 'modules.json', function (json) {
            json.forEach(function (module) {
                args = module.args;
                var last = defined.length;
                $.getScriptSync(currentFolder + module.source, function () {
                    var diff = defined.length - last;
                    if (diff == 1) {
                        result[module.name] = defined[defined.length - 1];
                    } else if (diff > 1) {
                        throw new Error("Fatal error: multiple module definitions in a single file " + module.source);
                    } else {
                        console.warn("Warning: no module definitions in a file " + module.source);
                    }
                });
            });
        });

        return result;
    });

})();