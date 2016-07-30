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
                    Object.defineProperties(this, {
                        id: {
                            get: function() {
                                return _id;
                            },
                            set: function (value) {
                                _id = value;
                            }
                        }
                    });

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
                    Object.defineProperties(this, {
                        id: {
                            get: function() {
                                return this.source + this.target;
                            }
                        }
                    });

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
                g.edges.addItem(new link('n2', 'n3'));
                g.edges.addItem(new link('n3', 'n1'));
            }
        }
    });

})();