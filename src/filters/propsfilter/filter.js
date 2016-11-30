(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Filter
    app.filter('propsFilter', function () {
        return function (items, props) {
            var out = [];

            if (angular.isArray(items)) {
                var keys = Object.keys(props);

                items.forEach(function (item) {
                    var itemMatches = false;

                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i].split('.');

                        var text = props[keys[i]].toLowerCase();

                        // TODO: Kata, meaning of this?
                        // lower Case nebezpecne
                        if (item[prop[0]][prop[1]].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        };
    });

})();