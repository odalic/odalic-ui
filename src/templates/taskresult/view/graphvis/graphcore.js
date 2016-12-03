/** Creates a new graph simulation.

 *  Terminology:
 *      vertex = node
 *      edge = link
 *
 * @param svgSelection      A D3-selection-wrapper of a <svg> element, where the graph will be placed.
 */
var graph = function(svgSelection, graphSettings) {
    // Reference to self
    var _ref = this;

    /* Public members */
    /* ************** */

    /** The graph's vertices.
     *  The vertices must implement {inode} interface.
     *
     * @type {unorderedarr}
     */
    this.vertices = new unorderedarr();
    
    /** The graph's edges.
     *  The edges must implement {ilink} interface.
     *
     * @type {unorderedarr}
     */
    this.edges = new unorderedarr();

    /** Finds a specified edge in the graph.
     *
     * @param vertex1  First vertex id.
     * @param vertex2  The second vertex id.
     *
     * @returns        The specified edge if found, otherwise null.
     */
    this.edges.find = function(vertex1, vertex2) {
        var _ret = null;
        _ref.edges.arr.forEach(function(edge) {
            var _orients = edge.orient.orientations;
            var _orient = edge.orient.orientation;

            if ((edge.source.id == vertex1) && (edge.target.id == vertex2)) {
                if ((_orient === _orients.normal) || (_orient === _orients.double)) {
                    _ret = edge;
                }
            } else if ((edge.source.id == vertex2) && (edge.target.id == vertex1)) {
                if ((_orient === _orients.reversed) || (_orient === _orients.double)) {
                    _ret = edge;
                }
            }
        });

        return _ret;
    };

    /** Forces the graph to reupdate.
     *  May be useful e.g. when a new node/link is added to force the graph to redraw.
     *
     */
    this.forceUpdate = null;


    /* Private members */
    /* *************** */
    var svg = svgSelection;
    var simulation = d3.forceSimulation();

    var linksGroup = svg
        .append('g')
        .attr('class', 'links');

    var nodesGroup = svg
        .append('g')
        .attr('class', 'nodes');

    var properties = {
        get width() {
            return svg.attr('width');
        },
        get height() {
            return svg.attr('height');
        }
    };

    var tickFunction = function() {
        // Attaching events events that are actually defined in a datum
        var attachEvs = function (evs, sel, dat) {
            evs.forEach(function (ev) {
                if (ev[1] in dat) {
                    sel.on(ev[0], function () {
                        dat[ev[1]]();
                    });
                }
            });
        };

        // Nodes
        nodesGroup
            .selectAll('g.node')
            .data(_ref.vertices.arr)
            .each(function (d, i) {
                d.update();
            })
            .enter()
            .append('g')
            .attr('class', 'node')
            .each(function (d, i) {
                var sel = d3.select(this);

                // Create a new node
                d.attach(sel);

                // Attach defined events
                var evs = [
                    ['mouseover', 'mouseOver'],
                    ['mouseout', 'mouseOut'],
                    ['click', 'mouseClick'],
                    ['dblclick', 'mouseDoubleClick']
                ];
                attachEvs(evs, sel, d);

                // Attach dragging event
                var dragCnt = 'dragging';
                var dragEvs = ['start', 'drag', 'end'];
                if (dragCnt in d) {
                    sel.call(
                        d3.drag()
                            .on('start', function (d) {
                                if (!d3.event.active) {
                                    simulation.alphaTarget(0.3).restart();
                                }
                                d[dragCnt][dragEvs[0]]();
                            })
                            .on('drag', function (d) {
                                d[dragCnt][dragEvs[1]](d3.event.x, d3.event.y);
                            })
                            .on('end', function (d) {
                                if (!d3.event.active) {
                                    simulation.alphaTarget(0);
                                }
                                d[dragCnt][dragEvs[2]]();
                            })
                    );
                }
            })
            .exit()
            .remove();

        // Links
        linksGroup
            .selectAll('g.link')
            .data(_ref.edges.arr)
            .each(function (d, i) {
                d.update();
            })
            .enter()
            .append('g')
            .attr('class', 'link')
            .each(function (d, i) {
                var sel = d3.select(this);

                // Create a new link
                d.attach(sel);

                // Attach defined events
                var evs = [
                    ['mouseover', 'mouseOver'],
                    ['mouseout', 'mouseOut'],
                    ['click', 'mouseClick'],
                    ['dblclick', 'mouseDoubleClick']
                ];
                attachEvs(evs, sel, d);
            });
    };

    var forceLink = function (graph) {
        return d3
            .forceLink(graph.edges.arr)
            .distance(graphSettings.linksDistance);
    };



    /* Construction */
    /* ************ */
    simulation
        //.force('center', d3.forceCenter(
        //    properties.width / 2,
        //    properties.height / 2)
        //)
        .force('collide', d3.forceCollide()
            .radius(graphSettings.collision.radius)
            .strength(graphSettings.collision.strength)
        )
        .force('link', forceLink(this))
        .force('charge', d3.forceManyBody()
            .strength(graphSettings.manyBody.strength)
        )
        .force('forceX', d3.forceX(properties.width / 2)
            .strength(graphSettings.centering.strength)
        )
        .force('forceY', d3.forceY(properties.height / 2)
            .strength(graphSettings.centering.strength)
        )
        .alphaDecay(graphSettings.decay.alpha)
        .velocityDecay(graphSettings.decay.velocity)
        .nodes(this.vertices.arr)
        .on('tick', tickFunction);

    // Override pushing vertices
    this.vertices.addItem = (function (f) {
        return function (item) {
            f.call(_ref.vertices, item);
            simulation
                .nodes(_ref.vertices.arr);
        };
    })(_ref.vertices.addItem);

    // Override pushing edges
    this.edges.idCount = 0;
    this.edges.addItem = (function (f) {
        return function (item) {
            // Convert vertex string ids to indices in the vertex array
            if (typeof(item.source) === 'string') {
                item.source = _ref.vertices.indexOf(item.source);
            }
            if (typeof(item.target) === 'string') {
                item.target = _ref.vertices.indexOf(item.target);
            }

            // Check for consistency
            if (item.source == item.target) {
                throw new Error('Cannot add an edge of type "{v, v}" (same vertex).');
            }
            if (_ref.edges.find(_ref.vertices.arr[item.source].id, _ref.vertices.arr[item.target].id) !== null) {
                throw new Error('The edge already exists.');
            }

            // Opposite direction edge case
            var _opp = _ref.edges.find(_ref.vertices.arr[item.target].id, _ref.vertices.arr[item.source].id);
            if (_opp !== null) {
                _opp.orient.orientation = _opp.orient.orientations.double;
                return _opp;
            }

            // Push the edge
            item.id = _ref.edges.idCount++;
            f.call(_ref.edges, item);
            simulation
                .force('link', forceLink(_ref));
        };
    })(_ref.edges.addItem);

    // Override removing edges
    this.edges.removeItem = (function (f) {
        return function (vertex1, vertex2) {
            if (!(vertex1 && vertex2)) {
                throw new Error('Illegal arguments. Required arguments: (vertex1_id, vertex2_id)');
            }

            var e = _ref.edges.find(vertex1, vertex2);
            if (e === null) {
                throw new Error('The specified edge does not exist. Cannot delete.');
            }

            // Differentiate between cases when an edge is bidirectional vs. unidirectional
            var eorient = e.orient.orientation;
            var eorients = e.orient.orientations;
            if (eorient == eorients.double) {
                if (e.source.id === vertex1) {
                    e.orient.orientation = eorients.reversed;
                } else {
                    e.orient.orientation = eorients.normal;
                }
            } else {
                _ref.edges.arr[_ref.edges.indexOf(e.id)].remove();
                f.call(_ref.edges, e.id);
                simulation
                    .force('link', forceLink(_ref));
            }
        }
    })(_ref.edges.removeItem);

    // Override removing vertices
    this.vertices.removeItem = (function (f) {
        return function (item) {
            // Delete any edges attached to the corresponding vertex
            var toDelete = [];
            _ref.edges.arr.forEach(function(edge) {
                if ((edge.source.id == item) || (edge.target.id == item)) {
                    toDelete.push(edge.id);
                }
            });
            toDelete.forEach(function(edgeId) {
                _ref.edges.removeItem(edgeId);
            });

            // Finally remove the vertex
            _ref.vertices.arr[_ref.vertices.indexOf(item)].remove();
            f.call(_ref.vertices, item);
            simulation
                .nodes(_ref.vertices.arr);
        };
    })(_ref.vertices.removeItem);

    // Define forceUpdate method
    this.forceUpdate = function () {
        tickFunction();
    }
};