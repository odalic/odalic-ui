/** For displaying locks on edges
 *
 * @param d3sel  D3 selection of the element that should contain the lock
 *
 * @constructor
 */
var lock = function (d3sel) {
    // Parent D3 selection containing us
    var _parent = d3sel;

    // Label containing the lock symbol
    var _label = null;

    // Additional properties
    var _ymodif = null;
    var _xmodif = null;
    var _width = null;
    var _height = null;
    var _visible = null;

    // Attach the lock to a node
    this.attach = function () {
        if (_label !== null) {
            throw new Error("Lock already initialized");
        }

        _label =
            _parent
                .append('text')
                .style('cursor', 'pointer')
                .attr('font-family', 'FontAwesome')
                .attr('font-size', 20);

        // Set additional properties of the lock
        this.setVisibility(true);
        var bbox = _label.node().getBBox();
        _width = bbox.width;
        _height = bbox.height;
        this.setVisibility(false);
        _ymodif = 0;
        _xmodif = 1;
    };

    // Allows to modify the standard vertical positioning of the lock
    this.modifyY = function (value) {
        _ymodif = value;
    };

    // Allows to modify the standard horizontal positioning of the lock (2 values: 1, -1)
    this.modifyX = function (value) {
        if (![1, -1].includes(value)) {
            throw new Error("Only (1, -1) values are accepted when using modifyX on lock.");
        }
        _xmodif = value;
    };

    // Update the lock (needs to be called each tick)
    this.update = function (x1, y1, x2, y2) {
        if (_label === null) {
            throw new Error('The lock was not initialized (attach function was not called).');
        }

        // Compute angle and position our lock correctly onto the edge
        var angle = eucgeom.angle2p(x1, y1, x2, y2);
        var modif = 1;
        if ((angle >= 90) && (angle <= 270)) {
            angle += 180;
            modif = -1;
        }

        // Does our label text fit on the edge?
        var dist = eucgeom.dist2p(x1, y1, x2, y2);
        var realDist = dist - 32*2 - 10;
        if (realDist < 50) {
            // Hide
            _label.text('');
        } else {
            // Show, if not overloaded otherwise from an outside
            if (_visible) {
                this.setVisibility(true);
            }
        }

        // On which side of the edge will the label be positioned?
        var xpos = (_xmodif == 1) ? 45 : (dist-45);

        // Set the position
        _label
            .attr('transform', function() {
                return 'translate(' + x2 + ', ' + y2 + ') rotate(' + angle + ' 0, 0)';
            })
            .attr('dx', modif*xpos - _width/2)
            .attr('dy', _ymodif*(_height/2) + 8);
    };

    // Shows or hides the lock
    this.setVisibility = function (visible) {
        if (visible) {
            _label.text('\uf023');
            _visible = visible;
        } else {
            _label.text('');
            _visible = visible;
        }
    };

    // Detach and remove the lock
    this.detach = function () {
        _label.remove();
        _label = null;
        _width = null;
        _height = null;
        _visible = null;
        _ymodif = null;
    };
};