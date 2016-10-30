(function () {
        
    // Get the mappings declaration synchronously and configure the core angular settings
    $.getJSONSync($.getPathForRelativePath('mapping.json'), function (mapping) {
        // Main module
        var app = angular.module('odalic-app');
        
        // Create the root controller
        app.controller('odalic-root-ctrl', function ($scope) { /* ... */ });
        
        // Prepare some variables
        var currentFolder = $.getPathForRelativePath('');
        var genericCtrlId = 0;

        // Configure
        mapping.forEach(function (item) {
            switch (item.controller) {
                case 'generic':
                    item.turl = currentFolder + item.folder + '/template.html';
                    item.ctrl = 'odalic-generic-ctrl' + (genericCtrlId++);
                    break;
                case 'reroute':
                    item.turl = currentFolder + '/reroute.html';
                    item.ctrl = 'rerouter-ctrl' + (genericCtrlId++);
                    break;
                default:
                    item.turl = currentFolder + item.folder + '/template.html';
                    item.ctrl = item.controller;
                    break;
            }
        });

        // Configure routes
        app.config(function ($routeProvider) {
            mapping.forEach(function (item) {
                $routeProvider.when(item.route, {
                    templateUrl: item.turl,
                    controller: item.ctrl
                });
            });
        });

        // Configure controllers
        var configured = {};
        mapping.forEach(function (item) {
            switch (item.controller) {
                case 'generic':
                    // Create an empty controller
                    app.controller(item.ctrl, function ($scope) {});
                    break;
                case 'reroute':
                    // Create a rerouting controller
                    app.controller(item.ctrl, function ($scope, $location) {
                        $scope.rdlink = '#/' + item.target;
                        $location.path(item.target).replace();
                    });
                    break;
                default:
                    // Delegate the controller creation to an external script
                    if (!(item.folder in configured)) {
                        $.getScriptSync(currentFolder + item.folder + '/controller.js', function () {});
                        configured[item.folder] = true;
                    }
                    break;
            }
        });
    });

})();