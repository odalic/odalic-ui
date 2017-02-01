var sets = {
    /** Returns an array of objects present in both of passed arrays.
     *
     * @param arr1          First array. Has to contain unique items.
     * @param arr2          Second array. Has to contain unique items.
     * @param accessor      If arrays contain objects, accessor is a function that has to return a unique ID for each unique object.
     * @returns {Array}     The intersecting objects.
     */
    intersection: function (arr1, arr2, accessor) {
        var result = [];
        var hash = {};
        var access = objhelp.getFirstArg(accessor, function (item) {
            return item
        });

        arr1.forEach(function (item) {
            hash[access(item)] = true;
        });
        arr2.forEach(function (item) {
            if (access(item) in hash) {
                result.push(item);
            }
        });

        return result;
    },

    /** Returns an array of objects present in first or second array, but not both.
     *
     * @param arr1          First array. Has to contain unique items.
     * @param arr2          Second array. Has to contain unique items.
     * @param accessor      If arrays contain objects, accessor is a function that has to return a unique ID for each unique object.
     * @returns {Array}     The exclusion of objects.
     */
    exclusion: function (arr1, arr2, accessor) {
        var result = [];
        var hash = {};
        var access = objhelp.getFirstArg(accessor, function (item) {
            return item
        });


        arr1.forEach(function (item) {
            hash[access(item)] = 1;
        });
        arr2.forEach(function (item) {
            var key = access(item);
            if (key in hash) {
                hash[key]++;
            } else {
                hash[key] = 1;
            }
        });

        (new Array()).concat(arr1, arr2).forEach(function (item) {
            if (hash[access(item)] === 1) {
                result.push(item);
            }
        });

        return result;
    }
};