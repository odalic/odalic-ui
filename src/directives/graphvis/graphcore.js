/** Creates a new graph simulation.

 *  Terminology:
 *      vertex = node
 *      edge = link
 *
 * @param svgSelection      A D3-selection-wrapper of a <svg> element, where the graph will be placed.
 */
var graph = function(svgSelection) {

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
                d.attach(d3.select(this));
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
                d.attach(d3.select(this));
            })
            .exit()
            .remove();
    };



    /* Construction */
    /* ************ */
    simulation
        .force('link', d3.forceLink(this.edges.arr))
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(properties.width / 2, properties.height / 2))
        .nodes(this.vertices.arr)
        .on('tick', tickFunction);

    // Override pushing vertices
    var _ref = this;
    this.vertices.addItem = (function (f) {
        return function (item) {
            f.call(_ref.vertices, item);
            simulation
                .nodes(_ref.vertices.arr);
        };
    })(_ref.vertices.addItem);

    // Override removing vertices
    this.vertices.removeItem = (function (f) {
        return function (item) {
            f.call(_ref.vertices, item);
            simulation
                .nodes(_ref.vertices.arr);
        };
    })(_ref.vertices.removeItem);

    // Override pushing edges
    this.edges.addItem = (function (f) {
        return function (item) {
            if (typeof(item.source) === 'string') {
                item.source = _ref.vertices.indexOf(item.source);
            }
            if (typeof(item.target) === 'string') {
                item.target = _ref.vertices.indexOf(item.target);
            }

            f.call(_ref.edges, item);
            simulation
                .force('link', d3.forceLink(_ref.edges.arr));
        };
    })(_ref.edges.addItem);

    // Override removing edges
    this.edges.removeItem = (function (f) {
        return function (item) {
            f.call(_ref.edges, item);
            simulation
                .force('link', d3.forceLink(_ref.edges.arr));
        };
    })(_ref.edges.removeItem);
}