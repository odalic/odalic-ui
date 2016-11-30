/** Executes forEach designed for objects.
 *  Only iterates via own object properties.
 *
 * @param obj           object to iterate
 * @param callback      a callback function that should accept the following arguments: "key", "value"
 */
var objForEach = function (obj, callback) {
    for (var item in obj) {
        if (obj.hasOwnProperty(item)) {
            callback(item, obj[item]);
        }
    }
};


/** Accesses any item (fist one) in the given object.
 *
 * @param obj           object to access an item of
 * @param callback      a callback function that should accept the following arguments: "key", "value"
 */
var objGetAny = function (obj, callback) {
    var accessed = false;

    for (var item in obj) {
        if (obj.hasOwnProperty(item)) {
            callback(item, obj[item]);
            accessed = true;
            return;
        }
    }

    if (!accessed) {
        throw new Error('The object is empty.');
    }
};


/** Returns the first argument that is defined - either non-null or true.
 *  If none such are available, null is returned.
 *
 * @returns {*}
 */
var getFirstArg = function () {
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i]) {
            return arguments[i];
        }
    }
    return null;
};


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
var objRecurAccess = function (obj) {
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
};


/** Copies contents of a one object into another.
 *  Omits the properties that are already defined in the second object.
 *
 * @param obj1 The object to copy.
 * @param obj2 The object to copy the first object to. Must not be null nor undefined.
 */
var objCopy = function (obj1, obj2) {
    if (!obj1) {
        return;
    }

    if (!obj2) {
        // JS does not support passing arguments by reference, so this has to be an error
        throw new Error('obj2 not an object.');
    }

    objForEach(obj1, function (key, value) {
        if (!obj2[key]) {
            obj2[key] = value;
        }
    });
};