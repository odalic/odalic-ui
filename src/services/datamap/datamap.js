(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Simplification of mapping data between controller variables and JSONs exchanged with the server. */
    var currentFolder = $.getPathForRelativePath('');
    app.service('datamap', function () {

        /** Given a data mapping specification, returns an object consisting of 2 methods:
         *  function mapToObject2 (object1)
         *  - maps a given object in the first format to a new object in the second format
         *  function mapToObject1 (object2)
         *  - maps a given object in the second format to a new object in the first format
         *
         *  Specification:
         *  - suppose we have the following 'first object':
         *  {
         *      "name": "DBpedia",
         *      "labelPreds": [{
         *          id: 0,
         *          name: "http://dbpedia.org/property/name"
         *      }, {
         *          id: 1,
         *          name: "http://dbpedia.org/property/something"
         *      }],
         *      "comments": "Anything"
         *  }
         *
         *  - suppose we have the following 'second object':
         *  {
         *      "id": "DBpedia",
         *      "labelPredicates": ["http://dbpedia.org/property/name", "http://dbpedia.org/property/something"]
         *  }
         *
         *  - the mapping may look like this:
         *  [
         *      // A primitive 1:1 value mapping
         *      ['name', 'id'],
         *
         *      // An array of n items to a different array of n items mapping
         *      ['labelPreds', 'labelPredicates',
         *          // Selector of items from the first object array to the second object array
         *          function(item, index) {
         *              return item.value;
         *          }
         *          // Selector of items from the second object array to the first object array
         *          function(item, index) {
         *              return {
         *                  id: index,
         *                  value: item
         *              };
         *          }
         *      ]
         *
         *      // The property "comments" is ignored, so we do not specify it here
         *  ]
         *
         *  - additionally, the specification supports:
         *      - if selector returns 'undefined', no item is pushed into the array (therefore it is possible to
         *        'reduce' amount of items during mapping from one object to another)
         *      - for custom cases it is possible to specify a custom '1-way mapping' in the following way:
         *        ['name', 'id', '1->2',
         *          function(name) {
         *              return (new String()).concat('*', name, '*');
         *          }
         *        ]
         *        - the third item has to be either '1->2' or '2->1' depending on the way of the mapping (from the
         *        first to the second object, or from the second object to the first one)
         *
         * @param settings A specification to create the two methods from.
         * @returns {{mapToObject1: datamap.mapToObject1, mapToObject2: datamap.mapToObject2}}
         */
        this.create = function (settings) {
            // Primitives mappings
            var primitiveMapping1 = {};
            var primitiveMapping2 = {};

            // Array mappings
            var arrayMapping1 = {};
            var arrayMapping2 = {};

            // 1-way mappings
            var owMapping1 = {};
            var owMapping2 = {};

            settings.forEach(function (setting) {
                // Store settings to better data structures for searching
                var name1 = setting[0];
                var name2 = setting[1];

                // 1-way mapping?
                if ((setting.length == 4) && (typeof (setting[2]) === 'string')) {
                    var way = setting[2];
                    var owMapping = null;
                    switch (way) {
                        case '1->2':
                            owMapping = owMapping1;
                            break;
                        case '2->1':
                            owMapping = owMapping2;
                            break;
                        default:
                            throw new Error('Unknown way of 1-way data mapping. Please, use either "1->2" or "2->1".');
                    }

                    var transformer = setting[3];
                    owMapping[name1] = {
                        name: name2,
                        transformer: transformer
                    };
                }
                // Array mapping?
                else if (setting.length == 4) {
                    var selector1 = setting[2];
                    var selector2 = setting[3];

                    arrayMapping1[name1] = {
                        name: name2,
                        selector: selector1
                    };
                    arrayMapping2[name2] = {
                        name: name1,
                        selector: selector2
                    };
                }
                // Primitive mapping?
                else {
                    primitiveMapping1[name1] = name2;
                    primitiveMapping2[name2] = name1;
                }
            });

            var map = function (way, object1) {
                // Decide which way to use
                var primitiveMapping = null;
                var arrayMapping = null;
                var owMapping = null;
                switch (way) {
                    case '1->2':
                        primitiveMapping = primitiveMapping1;
                        arrayMapping = arrayMapping1;
                        owMapping = owMapping1;
                        break;
                    case '2->1':
                        primitiveMapping = primitiveMapping2;
                        arrayMapping = arrayMapping2;
                        owMapping = owMapping2;
                        break;
                }

                // Result
                var object2 = {};

                // Construct the result
                objhelp.objForEach(object1, function (key, value) {
                    // Primitive mapping?
                    if (key in primitiveMapping) {
                        var name2 = primitiveMapping[key];
                        object2[name2] = value;
                    }
                    // Array mapping?
                    else if (key in arrayMapping) {
                        var name2 = arrayMapping[key].name;
                        var selector = arrayMapping[key].selector;

                        var obj2Array = object2[name2] = [];
                        var index = 0;
                        value.forEach(function (item) {
                            var item2 = selector(item, index++);
                            if (typeof (item) !== 'undefined') {
                                obj2Array.push(item2);
                            }
                        });
                    }
                    // 1-way mapping?
                    else if (key in owMapping) {
                        var name2 = owMapping[key].name;
                        var transformer = owMapping[key].transformer;
                        object2[name2] = transformer(value);
                    }
                });

                return object2;
            };

            // Provide methods for data mapping
            return {
                mapToObject1: function (object2) {
                    return map('2->1', object2);
                },
                mapToObject2: function (object1) {
                    return map('1->2', object1);
                }
            };
        };

    });

})();