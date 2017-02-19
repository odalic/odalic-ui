/** An implementation of 'unordered array', i.e. the items are never sorted, but allows for O(1) adding/removal of items */
var unorderedarr = function () {

    /* Private members */
    /* *************** */
    var arrmap = {};



    /* Public members */
    /* ************** */

    /** The array.
     *
     * @type {Array}
     */
    this.arr = [];



    /* Public methods */
    /* ************** */

    /** Returns whether an item with a corresponding id is present.
     *
     * @param id            id of the item
     * @returns {boolean}   whether is the item present
     */
    this.isPresent = function(id) {
        return (arrmap[id] !== undefined);
    };

    /** Returns an index to the array of the given item id.
     *
     * @param id            id of the item
     * @returns {number}    index of the item in the array
     */
    this.indexOf = function(id) {
        if (!this.isPresent(id)) {
            return -1;
        }

        return arrmap[id];
    }

    /** Adds an item to the array
     *
     * @param item          An item to add; must implement id getter
     */
    this.addItem = function (item) {
        if (item.id === undefined) {
            throw new Error('Item does not implement id getter');
        }

        this.arr.push(item);
        arrmap[item.id] = this.arr.length - 1;
    };

    /** Removes an item with a corresponding id from the array
     *
     * @param id            id of the item
     */
    this.removeItem = function (id) {
        if (!this.isPresent(id)) {
            throw new Error('Item not present: ' + id);
        }

        var i = arrmap[id];
        var j = this.arr.length - 1;
        if (i < j) {
            var id_new = this.arr[j].id;

            arrmap[id_new] = i;
            this.arr[i] = this.arr[j];
        }
        delete arrmap[id];
        this.arr.pop();
    };
}