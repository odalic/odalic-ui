/** Edge creator, for displaying creation of a new edge
 *
 * @param d3sel  D3 selection of the element that should contain the edge
 *
 * @constructor
 */
var edgecreator = function (d3sel) {
    // save the parent element that contains us
    var _parent = d3sel;

    // a d3 selection of the element representing us, the edge
    var _link = null;

    // updates position of the element
    var update = function (x, y) {
        _link
            .attr('x2', x)
            .attr('y2', y);
    };

    // _ref
    var _ref = this;

    // dragging
    this.dragging = {
        start: function (x, y) {
            _link =
                d3sel
                    .insert('line', ':first-child')
                    .attr('stroke-width', '3')
                    .attr('stroke', '#555')
                    .attr('x1', x)
                    .attr('y1', y);

            update(x, y);
        },
        drag: function (x, y) {
            update(x, y);
        },
        end: function (x, y) {
            // empty
        }
    };

    // removal of the element
    this.remove = function () {
        _link.remove();
        _link = null;
    }
}