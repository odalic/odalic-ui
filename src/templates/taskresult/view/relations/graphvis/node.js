/** A node that can be attached to graph.
 *
 * @interface
 */
var inode = function (id) {};
inode.prototype.id = {
    get: function () {}
};
inode.prototype.attach = function () {};
inode.prototype.update = function () {};

/** Optional */
inode.prototype.mouseOver = function () {};
inode.prototype.mouseOut = function () {};
inode.prototype.mouseClick = function () {};
inode.prototype.mouseDoubleClick = function () {};
inode.prototype.dragging = {
    start: function () {},
    drag: function (x, y) {},
    end: function () {}
};



/** A wrapper of the node constructor.
 *  This is necessary so that the node is able to access certain resources, object(s), defined outside this file.
 *
 * @param gprops        object holding general graph properties common for both nodes and vertices
 * @returns {node}      a node constructor
 */
var nodeWrapper = function (gprops) {

    /** Node class
     *
     * @param id        id of the node
     *
     * @constructor
     * @implements {inode}
     */
    var node = function (id) {
        this.id = id;

        // central position
        var center = {
            get x() {
                var cx = gprops.graph.canvas.width / 2;
                return cx + (Math.random()-Math.random())*10;
            },
            get y() {
                var cy = gprops.graph.canvas.height / 2;
                return cy + (Math.random()-Math.random())*10;
            }
        };

        // position initialized to center
        this.x = center.x;
        this.y = center.y;

        // id
        this.id = id;

        // vars
        var _ref = this;
        var _parent = null;
        var _node = null;

        // settings
        var _radius = 32;

        // label
        var _label = null;
        var _labelText = null;
        this.setLabel = function (text) {
            _labelText = text;
            if (_label !== null) {
                _label.changeText(text);
                _label.update(_ref.x, _ref.y);
            }

            return _ref;
        };

        // graphical settings
        var gsettings = {
            stable: {
                free: {
                    r: constants.colors.ultralightorange,
                    l: constants.colors.black
                },
                fixed: {
                    r: constants.colors.orange,
                    l: constants.colors.white
                },
                linkcreation: {
                    r: constants.colors.yellow,
                    l: constants.colors.black
                },
                hover: {
                    r: constants.colors.lightorange,
                    l: constants.colors.black
                }
            },
            rColor: null,
            lColor: null,
            last: null,
            fill: function() {
                _node.attr('fill', this.rColor);
                _label.label.attr('fill', this.lColor);
            },
            setC: function (obj) {
                if (obj !== this.stable.hover) {
                    this.last = obj;
                }

                this.rColor = obj.r;
                this.lColor = obj.l;
                this.fill();
            }
        };

        // attach
        this.attach = function (d3sel) {
            _node =
                (_parent = d3sel)
                    .append('circle')
                    .attr('r', String(_radius))
                    .attr('stroke', constants.colors.black);

            _label = new nodelabel(d3sel);
            _label.setMaxWidth(_radius * 2);
            _label.attach(_ref.id);

            gsettings.setC(gsettings.stable.free);

            // set a position as well
            _ref.update();
        };

        // update
        this.update = function () {
            // prevent node escaping the canvas
            var canvas = gprops.graph.canvas;
            if (_ref.x < _radius)
                _ref.x = _radius + 1;
            if (_ref.x > canvas.width - _radius)
                _ref.x = canvas.width - _radius - 1;
            if (_ref.y < _radius)
                _ref.y = _radius + 1;
            if (_ref.y > canvas.height - _radius)
                _ref.y = canvas.height - _radius - 1;

            // update the visuals
            _node
                .attr('cx', _ref.x)
                .attr('cy', _ref.y);

            _label.update(_ref.x, _ref.y);
        };

        // remove
        this.remove = function () {
            _parent.remove();
            _parent = null;
            _label = null;
            _node = null;
        };

        // mouseOver
        this.mouseOver = function () {
            gprops.link.hoveredNode = _ref;
            gsettings.setC(gsettings.stable.hover);
        };

        // mouseOut
        this.mouseOut = function () {
            gprops.link.hoveredNode = null;
            gsettings.setC(gsettings.last);
        };

        /* Node inner states */
        /* ************** */
        var nodeFree = {
            enter: function () {
                _ref.fx = null;
                _ref.fy = null;
                gsettings.setC(gsettings.stable.free);
            }
        };

        var nodeFixed = {
            enter: function () {
                _ref.fx = _ref.x;
                _ref.fy = _ref.y;
                gsettings.setC(gsettings.stable.fixed);
            }
        };
        
        var nodeLinksCreation = {
            enter: function () {
                nodeFixed.enter();
            }
        };

        var innerStates = {
            NodeFree: 0,
            NodeFixed: 1,
            NodeLinksCreation: 2
        };

        var isStrategy = {};
        isStrategy[innerStates.NodeFree] = nodeFree;
        isStrategy[innerStates.NodeFixed] = nodeFixed;
        isStrategy[innerStates.NodeLinksCreation] = nodeLinksCreation;

        var _innerState = innerStates.NodeFree;
        Object.defineProperties(this, {
            innerState: {
                get: function () {
                    return _innerState;
                },
                set: function (value) {
                    if (_innerState != value) {
                        var handlerLeave = isStrategy[_innerState];
                        var handlerEnter = isStrategy[value];
                        var leave = 'leave';
                        var enter = 'enter';

                        if (leave in handlerLeave) {
                            handlerLeave[leave]();
                        }

                        _innerState = value;

                        if (enter in handlerEnter) {
                            handlerEnter[enter]();
                        }
                    }
                }
            }
        });

        var beforeLinkColor = null;

        /* Node dragging */
        /* ************** */
        var nodeDragging = {
            drag: function (x, y) {
                // Change and fix position
                _ref.innerState = innerStates.NodeFixed;
                _ref.fx = x;
                _ref.fy = y;
            },
            doubleClick: function () {
                _ref.innerState = innerStates.NodeFree;
            },
            stateEnter: function () {
                if (beforeLinkColor) {
                    gsettings.setC(beforeLinkColor);
                    beforeLinkColor = null;
                }
                if (_ref.innerState === innerStates.NodeLinksCreation) {
                    _ref.innerState = innerStates.NodeFree;
                }
            }
        };

        /* Link creation */
        /* ************** */
        var linkCreation = {
            edge: null,
            dragDiff: {
                x: null,
                y: null,
                count: function () {
                    var arr = [0, 0];
                    arr = d3.mouse(_node.node());
                    this.x = arr[0] - _ref.x;
                    this.y = arr[1] - _ref.y;
                }
            },
            start: function () {
                // Create a new edge representation
                this.edge = new edgecreator(d3.select(_parent.node().parentNode));
                this.edge.dragging.start(_ref.x, _ref.y);
                this.dragDiff.count();
            },
            drag: function (x, y) {
                // Update
                this.edge.dragging.drag(x + this.dragDiff.x, y + this.dragDiff.y);
            },
            end: function () {
                // Create an edge if applicable
                var gpref = gprops.link;
                if (gpref.hoveredNode !== null) {
                    gpref.create(_ref, gpref.hoveredNode);
                }

                // Remove the temporary edge
                this.edge.remove();
                this.edge = null;
            },
            stateEnter: function () {
                if (_ref.innerState === innerStates.NodeFree) {
                    _ref.innerState = innerStates.NodeLinksCreation;
                }
                beforeLinkColor = gsettings.last;
                gsettings.setC(gsettings.stable.linkcreation);
            }
        };

        /* Reset layout */
        /* ************** */
        var resetLayout = {
            stateEnter: function () {
                _ref.x = center.x;
                _ref.y = center.y;
                _ref.innerState = innerStates.NodeFree;
            }
        };

        /* Manipulation */
        /* ************** */
        var strategy = {};
        strategy[gprops.states.NodeDragging] = nodeDragging;
        strategy[gprops.states.LinkCreation] = linkCreation;
        strategy[gprops.states.ResetLayout] = resetLayout;

        var callForStrategy = function(functionName) {
            var str = strategy[gprops.state];
            var fn = functionName;
            if (fn in str) {
                str[fn].apply(str, Array.prototype.slice.call(arguments, 1));
            }
        };

        // mouseDoubleClick
        this.mouseDoubleClick = function () {
            callForStrategy('doubleClick');
        };

        // dragging
        this.dragging = {
            start: function () {
                callForStrategy('start');
            },
            drag: function (x, y) {
                callForStrategy('drag', x, y);
            },
            end: function () {
                callForStrategy('end');
            }
        };

        // stateEnter
        this.stateEnter = function () {
            callForStrategy('stateEnter');
        };
    };

    return node;
};