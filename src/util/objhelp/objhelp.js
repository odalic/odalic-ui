/** Miscellaneous support functions for JavaScript object handling */
var objhelp = {
    /** Executes forEach designed for objects.
     *  Only iterates via own object properties.
     *
     * @param obj           object to iterate
     * @param callback      a callback function that should accept the following arguments: "key", "value"
     */
    objForEach: function (obj, callback) {
        for (var item in obj) {
            if (obj.hasOwnProperty(item)) {
                callback(item, obj[item]);
            }
        }
    },

    /** Returns the first argument that is defined - either non-null or true.
     *  If none such are available, null is returned.
     *  The function is variadic.
     *
     * @returns {*}
     */
    getFirstArg: function () {
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i]) {
                return arguments[i];
            }
        }
        return null;
    },

    /** Accesses safely an object recursively with defined keys. This function is variadic.
     *
     *  Example 1:
     *      var myObj = { key1: {}, nothing: null };
     *      objRecurAccess(myObj, 'key1', 'key2', 'key3');
     *  Resulting object:
     *      myObj = { key1: { key2: { key3: {} } }, nothing: null }
     *
     *  Example 2:
     *      var myObj = {};
     *      objRecurAccess(myObj, 'key1', 'key2', 'key3')['key4'] = 'Hello';
     *  Resulting object:
     *      myObj = { key1: { key2: { key3: { key4: 'Hello' } } } }
     *
     * @param obj       the object to access
     * @returns {*}     the requested item (may be created a new)
     */
    objRecurAccess: function (obj) {
        if (arguments.length < 2) {
            throw new Error('Illegal number of arguments. Must contain at least 1 key.');
        }

        var _obj = obj;
        if (typeof(_obj) !== 'object') {
            throw new Error('Passed argument is not an object; cannot proceed.');
        }

        var args = arguments;
        for (;;) {
            args = Array.prototype.slice.call(args, 1);
            if (args.length <= 0) {
                return _obj;
            }

            var key = args[0];
            if (!(key in _obj)) {
                _obj[key] = {};
            } else {
                if (typeof(_obj[key]) !== 'object') {
                    throw new Error('The passed object contains property ' + key + ', but it is not an object.');
                }
            }
            _obj = _obj[key];
        }
    },

    /** Copies contents of a one object into another.
     *  Omits the properties that are already defined in the second object.
     *  Beware, the copy is non-recursive.
     *
     * @param obj1 The object to copy.
     * @param obj2 The object to copy the first object to. Must not be null nor undefined.
     */
    objCopy: function (obj1, obj2) {
        if (!obj1) {
            return;
        }

        if (!obj2) {
            // JS does not support passing arguments by reference, so this has to be an error
            throw new Error('obj2 not an object.');
        }

        this.objForEach(obj1, function (key, value) {
            if (!obj2[key]) {
                obj2[key] = value;
            }
        });
    },

    /** Recursive comparison of values of 2 objects.
     *  An array of properties, in which the two objects differ, is returned.
     *
     * @param obj1      First object.
     * @param obj2      Second object, to compare against the first one.
     * @returns {Array} Array of properties, in which the objects differ.
     */
    objCompare: function (obj1, obj2) {
        // Check passed arguments
        if (!obj1 || !obj2 || (typeof(obj1) !== 'object') || (typeof(obj2) !== 'object')) {
            throw new Error('objCompare: illegal arguments');
        }

        // Gather all properties, being either in obj1 or obj2
        var props = [];
        var included = {};
        var gatherProperties = function (obj) {
            objhelp.objForEach(obj, function (key, value) {
                if (!(key in included)) {
                    included[key] = true;
                    props.push(key);
                }
            });
        };
        gatherProperties(obj1);
        gatherProperties(obj2);

        // Compare
        var differences = [];
        props.forEach(function (key) {
            // Property present in both objects?
            if (!(key in obj2) || !(key in obj1)) {
                differences.push(key);
            } else {
                // Property differs in objects?
                var value1 = obj1[key];
                var value2 = obj2[key];

                // Recursive object comparison?
                if ((typeof(value1) === 'object') && (typeof(value2) === 'object')) {
                    // Non-null values?
                    if (!!value1 && !!value2) {
                        var r = objhelp.objCompare(value1, value2);
                        r.forEach(function (item) {
                            differences.push(new String().concat(key, '.', item));
                        });
                    } else {
                        // Both are null?
                        if (!value1 != !value2) {
                            differences.push(key);
                        }
                    }
                } else {
                    if (value1 != value2) {
                        differences.push(key);
                    }
                }
            }
        });

        // Result
        return differences;
    },

    /** Performs a test of a passed argument by passed tests.
     *  If the argument passes all of the passed tests, it is returned, otherwise the fallback is returned.
     *  Example:
     *      var i = objhelp.test(3, 'alternative', '> 0', '<= 3');  // i is equal to 3
     *      var j = objhelp.test(3, 'alternative', '> 0', '< 3');   // j is equal to 'alternative'
     *
     *  Note that if the argument is undefined or null, the fallback is returned.
     *
     * @param arg       The argument to test.
     * @param fallback  Fallback to use when the argument does not pass any of tests.
     * {params String}  Any amount of tests in the following format: '< 0', '=== true', etc.
     * @returns {*}     The argument or the fallback.
     */
    test: function (arg, fallback) {
        // If undefined or null, return fallback
        if (!arg) {
            return fallback;
        }

        // Remove first argument
        var args = Array.prototype.slice.call(arguments, 1);

        // Test
        for (;;) {
            args = Array.prototype.slice.call(args, 1);
            if (args.length <= 0) {
                return arg;
            }

            var tt = (new String()).concat(String(arg), ' ', args[0]);
            if (!eval(tt)) {
                return fallback;
            }
        }
    },

    /** Creates a two-sided mirror from an array.
     *  Example:
     *      var m = objhelp.tsmirros([['1', 'a'], ['2', 'b'], ['3', 'c']]);
     *      var i = m.second['2'];  // i is equal to 'b'
     *      var j = m.first['c'];   // j is equal to '3'
     *
     * @param arr                           Array to create a mirror from.
     * @returns {{first: {}, second: {}}}   The created mirror.
     */
    tsmirror: function (arr) {
        var mirror = {
            first: {},
            second: {}
        };
        arr.forEach(function (item) {
            mirror.first[item[1]] = item[0];
            mirror.second[item[0]] = item[1];
        });

        return mirror;
    },

    /** Returns an array created from items of a passed array using a selector function.
     *  This is basically a map function.
     *  Example:
     *      var newArr = objhelp.select(arr, function(item) {
     *          return item.id;
     *      });
     *
     * @param arr           An original array.
     * @param selector      Function applicable on each array item.
     * @returns {Array}     A new array.
     */
    select: function (arr, selector) {
        var result = [];
        arr.forEach(function (item) {
            result.push(selector(item));
        });

        return result;
    },

    /** Calls a function passed as an argument, if defined.
     *  Any amount of arguments to be passed to the function may be specified.
     *  Example:
     *      var s = objhelp.callDefined(text.safe, 'My string');
     *
     * @param f     Function to call if defined.
     * @returns {*} Undefined, if function is undefined, or what "f" would return.
     */
    callDefined: function (f) {
        // If undefined or null, return
        if (!f) {
            return;
        }

        var args = Array.prototype.splice.call(arguments, 1);
        return f.apply(null, args);
    },

    /** Function that does... nothing.
     *
     */
    emptyFunction: function () {

    }
};
