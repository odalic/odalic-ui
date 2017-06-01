(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** ui-select search filter
     */
    app.filter('uissearch', function () {
        return function (items, props) {
            var result = [];
            items.forEach(function (item) {
                var itemPassed = false;

                // Check for match in the props object
                var check = function (checkAgainst, objToCheck) {
                    objhelp.objForEach(checkAgainst, function (key, value) {
                        // It is enough for the item to be equal to any string in the defined properties
                        if (!itemPassed) {
                            if (key in objToCheck) {
                                // Call check recursively, if got an object in the properties
                                if (typeof(value) === 'object') {
                                    check(value, objToCheck[key]);
                                }
                                // Otherwise check for substring match
                                else if (objToCheck[key].toLowerCase().includes(value.toLowerCase())) {
                                    itemPassed = true;
                                }
                            }
                        }
                    });
                };
                check(props, item);

                if (itemPassed) {
                    result.push(item);
                }
            });

            return result;
        };
    });

})();