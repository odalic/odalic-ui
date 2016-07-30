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

    // Override pushing vertices
    var _ref = this;
    this.vertices.addItem = (function (f) {
        return function (item) {
            f.call(_ref.vertices, item);
            simulation
                .nodes(_ref.vertices.arr);
        };
    })(_ref.vertices.addItem);

    // Override pushing edges
    this.edges.addItem = (function (f) {
        return function (item) {
            f.call(_ref.edges, item);

            console.log(_ref.edges.arr[0].source);

            simulation
                .force('link')
                .links(_ref.edges.arr);

            console.log(_ref.edges.arr[0].source);
        };
    })(_ref.edges.addItem);



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
        .force('link', d3.forceLink().id(function(d) { return d.id; }))
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(properties.width / 2, properties.height / 2))
        .nodes(this.vertices.arr)
        .on('tick', tickFunction);

    simulation
        .force('link')
        .links(this.edges.arr);
}