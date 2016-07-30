/** A link that can be attached to graph.
 *
 * @interface
 */
var ilink = function (sourceId, targetId) {}
ilink.prototype.id = {
    get: function () {}
};
ilink.prototype.attach = function () {};
ilink.prototype.update = function () {};