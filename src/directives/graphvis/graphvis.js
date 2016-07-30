(function () {

    // Main module
    var app = angular.module('odalic-app');

    // graphvis directive
    var currentFolder = $.getPathForRelativePath('');
    app.directive('graphvis', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'graphvis.html',
            link: function (scope, iElement, iAtttrs) {

                // Load the necessary modules
                var toLoad = [
                    'graphcore.js'
                ];
                toLoad.forEach(function (item) {
                    $.getScriptSync(currentFolder + item, function () {
                        /* Purposefully empty. */
                    });
                });

                /** Node class
                 *
                 * @param id  id of the node
                 *
                 * @constructor
                 * @implements {inode}
                 */
                var node = function (id) {
                    this.id = id;

                    // position initialized to [0, 0]
                    this.x = 0;
                    this.y = 0;

                    // id
                    var _id = id;
                    this.id = {
                        get: function () {
                            return _id;
                        },
                        set: function (value) {
                            _id = value;
                        }
                    };

                    // _ref
                    var _ref = this;

                    // attach
                    var _parent = undefined;
                    var _node = undefined;
                    this.attach = function (d3sel) {
                        _node =
                            (_parent = d3sel)
                                .append('circle')
                                .attr('r', '5')
                                .attr('fill', 'red');

                        // set a position as well
                        _ref.update();
                    };

                    // update
                    this.update = function () {
                        _node
                            .attr('cx', _ref.x)
                            .attr('cy', _ref.y);
                    }
                };

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

                    // id
                    this.id = {
                        get: function () {
                            return this.source+this.target;
                        }
                    };

                    // _ref
                    var _ref = this;

                    // attach
                    var _parent = undefined;
                    var _link = undefined;
                    this.attach = function (d3sel) {
                        _link =
                            (_parent = d3sel)
                                .append('line')
                                .attr('stroke-width', '1')
                                .attr('stroke', '#999');

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
                    }
                };

                // Create a root <svg> element
                var svg = d3.select(iElement.get(0))
                    .append('svg')
                    .attr('width', 400)
                    .attr('height', 500);

                // Create a graph
                var g = new graph(svg);

                g.vertices.addItem(new node('n1'));
                g.vertices.addItem(new node('n2'));
                g.vertices.addItem(new node('n3'));
                g.edges.addItem(new link('n1', 'n2'));

                //var simulation = d3.forceSimulation()
                //    .force("link", d3.forceLink().id(function(d) { return d.id; }))
                //    .force("charge", d3.forceManyBody())
                //    .force("center", d3.forceCenter(scope.svg.width / 2, scope.svg.height / 2));
                //
                //var graph = {
                //    vertices: [
                //        {id: 'n1'},
                //        {id: 'n2'},
                //        {id: 'n3'},
                //        {id: 'n4'},
                //        {id: 'n5'}
                //    ],
                //    edges: [
                //        {source: 'n1', target: 'n2'},
                //        {source: 'n2', target: 'n3'},
                //        {source: 'n3', target: 'n4'},
                //        {source: 'n4', target: 'n2'}
                //    ]
                //};
                //
                //var links = svg
                //    .append('g')
                //    .attr('class', 'links')                                             // Styling
                //    .selectAll('line')
                //    .data(graph.edges)
                //    .enter()
                //    .append('line')
                //    .attr('stroke-width', '1');                                         // Styling
                //
                //
                //var nodes = svg
                //    .append('g')
                //    .attr('class', 'nodes')                                             // Styling
                //    .selectAll('circle')
                //    .data(graph.vertices)
                //    .enter()
                //    .append('circle')
                //    .attr('r', 5)                                                       // Styling
                //    .attr('fill', 'red');                                               // Styling
                //
                //
                //var tickFunction = function() {
                //    links
                //        .attr("x1", function(d) { return d.source.x; })
                //        .attr("y1", function(d) { return d.source.y; })
                //        .attr("x2", function(d) { return d.target.x; })
                //        .attr("y2", function(d) { return d.target.y; });
                //
                //    nodes
                //        .attr("cx", function(d) { return d.x; })
                //        .attr("cy", function(d) { return d.y; });
                //};
                //
                //simulation
                //    .nodes(graph.vertices)
                //    .on("tick", tickFunction);
                //
                //simulation.force("link")
                //    .links(graph.edges);
            }
        }
    });

})();