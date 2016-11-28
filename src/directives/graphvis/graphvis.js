(function () {

    // Main module
    var app = angular.module('odalic-app');

    // graphvis directive
    var currentFolder = $.getPathForRelativePath('');
    app.directive('graphvis', function (sharedata) {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'graphvis.html',
            scope: {
                bind: '='
            },
            link: function (scope, iElement, iAtttrs) {

                // Public interface via 'bind'
                // *******************************
                var pif = {
                    /** An event handler when an edge is clicked on.
                     *  The function has to accept 2 arguments (column1, column2).
                     *  Presumably for modal opening.
                     */
                    edgeClick: null,

                    /** Array of columns names.
                     *  Must be in correct order, i.e. $scope['inputFile']['columns'] is suitable.
                     */
                    vertices: null,

                    /** The structure holding the whole result.
                     *  Yes, this is a tight coupling, but at this point it's really not worth it to do something about it.
                     */
                    result: null,

                    /** Signalling a model change to graphvis. */
                    modelChanged: function (column1, column2) {},
                };

                // Copy the interface into 'bind'
                if (!scope.bind) {
                    scope.bind = {};
                }
                objCopy(pif, scope.bind);


                // Private
                // *******************************
                // Load the necessary modules
                var toLoad = ['graphcore.js', 'node.js', 'link.js', 'label.js', 'edgecreator.js'];
                toLoad.forEach(function (item) {
                    $.getScriptSync(currentFolder + item, function () {
                        /* Purposefully empty. */
                    });
                });

                // Create a root <svg> element
                var svg = d3.select(iElement.get(0).childNodes[2])
                    .append('svg')
                    .attr('width', 1200)
                    .attr('height', 550);

                // Create a marker (arrow)
                (function () {
                    var defs = svg.append('defs');
                    defs
                        .append('marker')
                        .attrs({
                            'id': 'line-arrow-end',
                            'viewBox': '0 0 10 10',
                            'refX': 49,
                            'refY': 5,
                            'markerUnits': 'strokeWidth',
                            'orient': 'auto',
                            'markerWidth': 4,
                            'markerHeight': 4,
                            'xoverflow': 'visible'
                        })
                        .append('path')
                        .attr('d', 'M 0 0 L 10 5 L 0 10 z');
                    defs
                        .append('marker')
                        .attrs({
                            'id': 'line-arrow-start',
                            'viewBox': '0 0 10 10',
                            'refX': -41,
                            'refY': 5,
                            'markerUnits': 'strokeWidth',
                            'orient': 'auto',
                            'markerWidth': 4,
                            'markerHeight': 4,
                            'xoverflow': 'visible'
                        })
                        .append('path')
                        .attr('d', 'M -2 5 L 8 0 L 8 10 z');
                })();

                // Create a graph
                var g = new graph(svg, {
                    decay: {
                        velocity: 0.05,
                        alpha: 0.02,
                    },
                    collision: {
                        radius: 75,
                        strength: 0.1
                    },
                    centering: {
                        strength: 0.1
                    },
                    linksDistance: 330,
                    manyBody: {
                        strength: 0
                    }
                });

                // General graph state, properties and functions
                var gprops = (function () {
                    var _state = 0;
                    return {
                        states: {
                            NodeDragging: 0,
                            LinkCreation: 1,
                            ResetLayout: 2
                        },
                        get state() {
                            return _state;
                        },
                        set state(value) {
                            if (_state != value) {
                                _state = value;

                                // Call each vertex and edge and inform it about the state update
                                var arrs = [g.vertices.arr, g.edges.arr];
                                arrs.forEach(function (arr) {
                                    arr.forEach(function (item) {
                                        var fn = 'stateEnter';
                                        if (fn in item) {
                                            item[fn]();
                                        }
                                    });
                                });
                            }
                        },
                        link: {
                            create: function (node1, node2) {
                                var column1 = g.vertices.indexOf(node1.id);
                                var column2 = g.vertices.indexOf(node2.id);
                                if (column1 !== column2) {
                                    scope.bind.edgeClick(column1, column2);
                                }
                            },
                            settings: function (node1, node2) {
                                var column1 = g.vertices.indexOf(node1.id);
                                var column2 = g.vertices.indexOf(node2.id);
                                if (column1 !== column2) {
                                    scope.bind.edgeClick(column1, column2);
                                }
                            },
                            hoveredNode: null
                        },
                        graph: {
                            canvas: {
                                get width() {
                                    return svg.attr('width');
                                },
                                get height() {
                                    return svg.attr('height');
                                }
                            }
                        }
                    };
                })();

                // Set state; reset layout button
                (function () {
                    // Set state
                    scope.setDraggingDis = function () {
                        return (gprops.state === gprops.states.NodeDragging)
                    };
                    scope.setDragging = function () {
                        gprops.state = gprops.states.NodeDragging;
                    };
                    scope.setLinkCreationDis = function () {
                        return (gprops.state === gprops.states.LinkCreation)
                    };
                    scope.setLinkCreation = function () {
                        gprops.state = gprops.states.LinkCreation;
                    };

                    // Reset layout button
                    scope.resetLayoutDis = function () {
                        return (gprops.state !== gprops.states.NodeDragging);
                    };
                    scope.resetLayout = function () {
                        if (!scope.resetLayoutDis()) {
                            gprops.state = gprops.states.ResetLayout;
                            gprops.state = gprops.states.NodeDragging;
                        }
                    };
                })();

                // Prepare
                var node = nodeWrapper(gprops);
                var link = linkWrapper(gprops);

                // Generate vertices
                scope.bind.vertices.forEach(function (item) {
                    g.vertices.addItem(new node(item));
                });

                // Edges model reflection; generate edges
                (function () {
                    var modelChanged = function (column1, column2) {
                        var vertex1 = g.vertices.arr[column1].id;
                        var vertex2 = g.vertices.arr[column2].id;

                        var selection = scope.bind.result['columnRelationAnnotations'][column1][column2]['chosen'];

                        var e = g.edges.find(vertex1, vertex2);
                        var labels = [];

                        // Construct predicate label for a given KB and a candidate
                        var handleCandidate = function (kb, candidate) {
                            var concept = candidate['label'];
                            if (!concept) {
                                var resource = candidate['resource'];
                                try {
                                    concept = text.uri(resource).page;
                                } catch (e) {
                                    concept = text.dotted(resource, 20);
                                }
                            }
                            labels.push(kb + ':' + concept);
                        };

                        // Retrieve selected predicate labels
                        objForEach(selection, function (kb, scArr) {
                            if (kb === 'other') {
                                if (scArr && scArr[0]['entity']['resource']) {
                                    handleCandidate(kb, scArr[0]['entity']);
                                }
                                return;
                            }

                            scArr.forEach(function (candidate) {
                                handleCandidate(kb, candidate['entity']);
                            });
                        });

                        // Set the label
                        if (labels.length > 0) {
                            if (e === null) {
                                e = new link(column1, column2);
                                var _e = g.edges.addItem(e);
                                e = _e ? _e : e;
                                g.forceUpdate();
                            }
                            e.setLabel(labels.join(', '), vertex1, vertex2);
                        }
                        // Remove the whole edge as there are no selected relations
                        else {
                            if (e !== null) {
                                g.edges.removeItem(vertex1, vertex2);
                            }
                        }
                    };

                    // Set the event handler for model changes
                    scope.bind.modelChanged = function (column1, column2) {
                        modelChanged(column1, column2);
                    };

                    // Generate first edges the similar way
                    objForEach(scope.bind.result['columnRelationAnnotations'], function (column1, cl1) {
                        objForEach(cl1, function (column2, cl2) {
                            modelChanged(parseInt(column1), parseInt(column2));
                        });
                    });
                })();
            }
        }
    });

})();
