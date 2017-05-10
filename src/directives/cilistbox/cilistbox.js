(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Custom-Items ListBox */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('cilistbox', function () {
        return {
            restrict: 'E',
            require: 'ngModel',
            templateUrl: currentFolder + 'cilistbox.html',
            scope: {
                size: '@',
                validator: '='
            },
            link: function (scope, iElement, iAttrs, ngModel) {

                // Local model
                scope.model = [];

                // On ngModel update
                ngModel.$render = function(){
                    scope.model = ngModel.$modelValue;
                };

                // Selected items for removal
                scope.selected = [];

                // Remove
                scope.remove = function () {
                    scope.model = sets.exclusion(scope.model, scope.selected, function (item) {
                        return item.id;
                    });

                    ngModel.$setViewValue(scope.model);
                };

                // An item to be added
                scope.newItem = new String();

                // Get a new index
                var getIndex = (function () {
                    var index = 0;

                    return function () {
                        index = Math.max(scope.model.length, index);
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
                    if (value.length == 0) {
                        return;
                    }
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
                    scope.model = sets.union(scope.model, [{
                        id: getIndex(),
                        value: value
                    }], function (item) {
                        return item.id;
                    });

                    // Update the ngModel
                    ngModel.$setViewValue(scope.model);

                    ngModel.$setViewValue(scope.model);

                    // Clear
                    scope.newItem = new String();
                    scope.illegal = false;
                };

            }
        }
    });

})();