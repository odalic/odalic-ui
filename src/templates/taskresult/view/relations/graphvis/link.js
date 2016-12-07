/** A link that can be attached to graph.
 *
 * @interface
 */
var ilink = function (sourceId, targetId) {};
ilink.prototype.source = null;                      // Either inode.id or number.
ilink.prototype.target = null;                      // Either inode.id or number.

ilink.prototype.attach = function () {};
ilink.prototype.update = function () {};
ilink.prototype.remove = function () {};
ilink.prototype.orient = {
    orientations: {
        normal: 0,
        double: 1,
        reversed: 2
    },
    orientation: 0
};

/** Optional */
ilink.prototype.mouseOver = function () {};
ilink.prototype.mouseOut = function () {};
ilink.prototype.mouseClick = function () {};
ilink.prototype.mouseDoubleClick = function () {};



/** A wrapper of the link constructor.
 *  This is necessary so that the link is able to access certain resources, object(s), defined outside this file.
 *
 * @param gprops        object holding general graph properties common for both nodes and vertices
 * @returns {node}      a link constructor
 */
var linkWrapper = function (gprops) {

    /** Link class
     *
     * @param sourceId  id of a source node
     * @param targetId  id of a target node
     *
     * @constructor
     * @implements {ilink}
     */
    var link = function (sourceId, targetId) {

        // nodes the link is attached to
        this.source = sourceId;
        this.target = targetId;

        // private members
        var _ref = this;
        var _parent = null;
        var _link = null;

        // label
        var _label = {
            labels: [],
            locks: [],
            labelTypes: {
                labelNormalDir: 0,
                labelReversedDir: 1
            },
            attach: function (d3sel) {
                for (var i = 0; i < 2; i++) {
                    var _l = new edgelabel(d3sel);
                    _l.attach('');

                    var _lock = new lock(d3sel);
                    _lock.attach();

                    var dir = null;
                    var mod = null;

                    switch (i) {
                        case this.labelTypes.labelNormalDir:
                            dir = [_ref.source, _ref.target];
                            _l.modifyY(-1);
                            _lock.modifyY(1);
                            break;
                        case this.labelTypes.labelReversedDir:
                            dir = [_ref.target, _ref.source];
                            _l.modifyY(1);
                            _l.setArrows(null, null, -1);
                            _lock.modifyY(-1);
                            _lock.modifyX(-1);
                            break;
                    }

                    // 2-way data binding to 'locks' data structure
                    (function (d, l) {
                        // initialization
                        var outlocked = function () {
                            return gprops.link.getLock(d[0], d[1]);
                        };
                        l.setLock(outlocked());

                        // when user clicks the lock
                        _lock.onClick(function () {
                            var locked = !outlocked();
                            gprops.link.setLock(d[0], d[1], locked);
                            l.setLock(locked);
                        });

                        // when the 'locks' data structure is updated from an outside
                        _lock.onUpdate(function () {
                            l.setLock(outlocked());
                        });
                    })(dir, _lock);

                    // set events
                    (function (d) {
                        _l.event.mouseClick(function () {
                            gprops.link.settings(d[0], d[1]);
                        });
                        _l.event.mouseOver(function (label) {
                            label.attr('fill', constants.colors.orange);
                        });
                        _l.event.mouseOut(function (label) {
                            label.attr('fill', constants.colors.almostblack);
                        });
                    })(dir);

                    // push
                    this.labels.push(_l);
                    this.locks.push(_lock);
                }
            },
            update: function () {
                // Update labels and locks
                var toUpdate = [this.labels, this.locks];
                toUpdate.forEach(function (array) {
                    array.forEach(function (_l) {
                        _l.update(
                            _ref.source.x, _ref.source.y,
                            _ref.target.x, _ref.target.y);
                    });
                });
            },
            remove: function () {
                this.labels = [];
                this.locks = [];
            }
        };
        this.setLabel = function (text, vertex1, vertex2) {
            // Which label are we setting text to?
            var v1 = _ref.source.id;
            var v2 = _ref.target.id;
            if ((v1 == vertex1) && (v2 == vertex2)) {
                _label.labels[_label.labelTypes.labelNormalDir].changeText(text);
            } else if ((v1 == vertex2) && (v2 == vertex1)) {
                _label.labels[_label.labelTypes.labelReversedDir].changeText(text);
            }
            _label.update();
        };

        // orientation
        (function () {
            var _orient = null;
            var _markerEnd = function (enabled) {
                var val = enabled ? 'url(#line-arrow-end)' : '';
                _link.attr('marker-end', val);
            };
            var _markerStart = function (enabled) {
                var val = enabled ? 'url(#line-arrow-start)' : '';
                _link.attr('marker-start', val);
            };

            _ref.orient = {
                orientations: {
                    normal: 0,
                    double: 1,
                    reversed: 2
                },
                set orientation(value) {
                    if (_orient != value) {
                        _orient = value;

                        var showHideLabels = function (normalDir, reversDir) {
                            if (_label.labels.length >= 2) {
                                _label.labels[_label.labelTypes.labelNormalDir].toggleDisplay(normalDir);
                                _label.labels[_label.labelTypes.labelReversedDir].toggleDisplay(reversDir);

                                _label.locks[_label.labelTypes.labelNormalDir].setVisibility(normalDir);
                                _label.locks[_label.labelTypes.labelReversedDir].setVisibility(reversDir);
                            }
                        };

                        switch (_orient) {
                            case this.orientations.normal:
                                _markerEnd(true);
                                _markerStart(false);
                                showHideLabels(true, false);
                                break;
                            case this.orientations.reversed:
                                _markerEnd(false);
                                _markerStart(true);
                                showHideLabels(false, true);
                                break;
                            case this.orientations.double:
                                _markerEnd(true);
                                _markerStart(true);
                                showHideLabels(true, true);
                                break;
                        }
                    }
                },
                get orientation() {
                    return _orient;
                }
            };
        })();

        // attach
        this.attach = function (d3sel) {
            _link =
                (_parent = d3sel)
                    .append('line')
                    .attr('stroke-width', '2')
                    .attr('stroke', constants.colors.black);

            _label.attach(d3sel);
            this.orient.orientation = this.orient.orientations.normal;

            // set a position as well
            this.update();
        };

        // update
        this.update = function () {
            _link
                .attr('x1', _ref.source.x)
                .attr('y1', _ref.source.y)
                .attr('x2', _ref.target.x)
                .attr('y2', _ref.target.y);

            _label.update();
        };

        // remove
        this.remove = function () {
            _parent.remove();
            _label.remove();
            _parent = null;
            _link = null;
        };
    };

    return link;
};