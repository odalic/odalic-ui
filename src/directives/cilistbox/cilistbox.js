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
                ngModel: '=',
                validator: '='
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

                    return function () {
                        return index++;
                    };
                })();

                // Validation successful?
                scope.illegal = false;

                // Add a new item
                scope.add = function () {
                    var validator = scope.validator;
                    var value = scope.newItem;

                    // Validate
                    if (validator) {
                        var msg = validator(value);
                        if (msg !== true) {
                            if (msg !== false) {
                                scope.errorMessage = msg;
                            }
                            scope.illegal = true;
                            return;
                        }
                    }

                    // Add
                    scope.ngModel.push({
                        id: getIndex(),
                        value: value
                    });

                    // Clear
                    scope.newItem = new String();
                    scope.illegal = false;
                };

            }
        }
    });

})();