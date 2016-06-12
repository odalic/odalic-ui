(function () {
        
    // Get the mappings declaration synchronously and configure the core angular settings
    $.getJSONSync($.getPathForRelativePath('mapping.json'), function (mapping) {
        // Main module
        var app = angular.module('odalic-app');
        
        // Create the root controller
        app.controller('odalic-root-ctrl', function ($scope) { /* ... */ });
        
        // Prepare some variables
        var currentFolder = $.getPathForRelativePath('');

        var templateFile = '/template.html';
        var ctrlFile = '/controller.js';

        var genericCtrlDeterminer = 'generic';
        var genericCtrlName = 'odalic-generic-ctrl';
        var genericCtrlId = 0;

        // Determine, whether a generic controller was specified for each template
        mapping.forEach(function (item) {
            if (item.controller == genericCtrlDeterminer) {
                item.genericCtrl = true;
                item.controller = genericCtrlName + (genericCtrlId++);
            } else {
                item.genericCtrl = false;
            }
        });

        // Configure routes
        app.config(function ($routeProvider) {
            mapping.forEach(function (item) {
                $routeProvider.when(item.route, {
                    templateUrl: currentFolder + item.folder + templateFile,
                    controller: item.controller
                });
            });
        });

        // Create controllers
        mapping.forEach(function (item) {
            // If the generic controller was specified, create one for the template
            if (item.genericCtrl) {
                app.controller(item.controller, function ($scope) { /* Purposely empty. */ });
            }
            // Otherwise delegate the controller creation to an external script
            else {
                $.getScriptSync(currentFolder + item.folder + ctrlFile, function () { /* Purposely empty. */ });
            }
        });
                
    });

})();