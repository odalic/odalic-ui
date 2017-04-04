(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Custom-Items ListBox */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('cilistbox', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'cilistbox.html',
            scope: {
                size: '@',
                ngModel: '='
            },
            link: function (scope, iElement, iAttrs) {

                // Selected items for removal
                scope.selected = [];

                // Remove
                scope.remove = function () {
                    scope.ngModel = sets.exclusion(scope.ngModel, scope.selected, function (item) {
                        return item.id;
                    });
                };

                // An item to be added
                scope.newItem = new String();

                // Get a new index
                var getIndex = (function () {
                    var index = scope.ngModel.length;

                    return function() {
                        return index++;
                    };
                })();

                // Add a new item
                scope.add = function () {
                    scope.ngModel.push({
                        id: getIndex(),
                        value: scope.newItem
                    });
                    scope.newItem = new String();
                };

            }
        }
    });

})();