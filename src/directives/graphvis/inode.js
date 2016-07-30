/** A node that can be attached to graph.
 *
 * @interface
 */
var inode = function (id) {}
inode.prototype.id = {
    get: function () {}
};
inode.prototype.attach = function () {};
inode.prototype.update = function () {};