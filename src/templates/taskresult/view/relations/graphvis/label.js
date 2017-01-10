/** For displaying labels
 *
 * @param d3sel  D3 selection of the element that should contain the label
 *
 * @constructor
 */
var label = function (d3sel) {
    // _ref
    var _ref = this;

    // save the parent element that contains us
    var _parent = d3sel;

    // variables
    var _label = null;
    var _lwidth = null;
    var _lheight = null;
    var _text = null;

    // events
    var _event = {
        mouseClick: [],
        mouseOver: [],
        mouseOut: [],
        call: function(obj) {
            obj.forEach(function (callback) {
                callback(_label);
            });
        },
        attach: function () {
            [
                ['click', 'mouseClick'],
                ['mouseover', 'mouseOver'],
                ['mouseout', 'mouseOut']
            ].forEach(function (ev) {
                _label.on(ev[0], function () {
                    _event.call(_event[ev[1]]);
                });
            });
        }
    };
    this.event = {
        mouseClick: function (callback) {
            _event.mouseClick.push(callback);
        },
        mouseOver: function (callback) {
            _event.mouseOver.push(callback);
        },
        mouseOut: function (callback) {
            _event.mouseOut.push(callback);
        }
    };

    // attaches (shows) the label if not already attached
    this.attach = function (text) {
        if (_label !== null) {
            return;
        }

        _label =
            _parent
                .append('text')
                .style('cursor', 'default')
                .attr('font-size', 15)
                .attr('stroke-width', 3)
                .attr('fill', constants.colors.almostblack);

        _ref.changeText(text);
        _event.attach();

        this.update();
    };

    // removes (hides) the label
    this.remove = function () {
        _label.remove();
        _label = null;
    };

    // changes the displayed text
    this.changeText = function (text) {
        if (_label !== null) {
            _label.text(text);

            var bbox = _label.node().getBBox();
            _lwidth = bbox.width;
            _lheight = bbox.height;
            _text = text;
        }
    };

    // updates position and rotation of the label
    this.update = function (x, y) {
        if (_label === null) {
            throw new Error('Label not attached');
        }

        if (!(x && y)) {
            return;
        }

        _label
            .attr('transform', function() {
                return 'translate(' + x + ', ' + y + ')';
            })
            .attr('dx', -_lwidth/2)
            .attr('dy', _lheight/4);
    };

    // shows or hides the label
    this.toggleDisplay = function (show) {
        if (show) {
            _label.text(_text);
        } else {
            _label.text('');
        }
    };

    // properties
    Object.defineProperties(this, {
        // accessing the text element itself
        label: {
            get: function () {
                return _label;
            }
        },
        // width of the label
        width: {
            get: function () {
                return _lwidth;
            }
        },
        // height of the label
        height: {
            get: function () {
                return _lheight;
            }
        },
        // label text
        text: {
            get: function () {
                return _text;
            }
        }
    });
};


/** Node label, for displaying node labels.
 *
 * @param d3sel  D3 selection of the element that should contain the label
 *
 * @constructor
 * @extends {label}
 */
var nodelabel = function (d3sel) {
    // inherit
    var ll = new label(d3sel);

    // automatic font decreasing
    var _mwidth = null;
    var _basefont = 15;
    var _nowfont = _basefont;
    var _minfont = 10;

    // changes text; does not exceed the maximum allowed width
    ll.changeText = (function(f) {
        return function (labelText) {
            var label = ll.label;
            f.call(ll, labelText);

            // binary search for finding an optimal font-size
            var up = _basefont;
            var down = _minfont;
            while (down <= up) {
                _nowfont = (up + down) / 2;

                // try using the new font-size and test, whether it is OK
                label.attr('font-size', _nowfont);
                f.call(ll, labelText);
                if (ll.width > _mwidth) {
                    up = _nowfont - 1;
                } else {
                    down = _nowfont + 1;
                }
            }

            // still exceeding bounds?
            if (ll.width > _mwidth) {
                // binary search for shortened text
                var dup = labelText.length;
                var ddown = 5;
                while (ddown <= dup) {
                    var dmid = (dup + ddown) / 2;
                    f.call(ll, text.shortened(labelText, dmid));
                    if (ll.width > _mwidth) {
                        dup = dmid - 1;
                    } else {
                        ddown = dmid + 1;
                    }
                }
            }
        }
    })(ll.changeText);

    // attach override
    ll.attach = (function(f) {
        return function(text) {
            f.call(ll, text);
            ll.changeText(text);
            ll.update();
        }
    })(ll.attach);

    // sets maximum allowed width for the current label
    ll.setMaxWidth = function (width) {
        _mwidth = width;
    };

    return ll;
};


/** Edge label, for displaying edge labels
 *
 * @param d3sel  D3 selection of the element that should contain the label
 *
 * @constructor
 * @extends {label}
 */
var edgelabel = function (d3sel) {
    // _ref
    var _ref = this;

    // inherit
    label.call(this, d3sel);

    // setting arrows at the end of the label, e.g. 'myLabel >>'; use multiplicator to indicate a reversed label
    var _angleModif = null;
    var _arrows = {
        side1: ' >>',
        side2: '<< ',
        mult: 1,
        text: null,
        update: function () {
            if (!this.text) {
                return;
            }

            switch (_angleModif*this.mult) {
                case -1:
                    _ref.changeText(this.text + this.side1, 'arrows');
                    break;
                case 1:
                    _ref.changeText(this.side2 + this.text, 'arrows');
                    break;
            }
        }
    };
    this.setArrows = function (side1, side2, multiplicator) {
        if ((side1 && side2) !== null) {
            _arrows.side1 = side1;
            _arrows.side2 = side2;
        }

        if (multiplicator) {
            _arrows.mult = multiplicator;
        }
        _arrows.update();
    };

    // override changeText; allow for saving the original
    var _btext = null;
    var _bwidth = null;
    var changeTextNS = (function (f) {
        return function (text) {
            f.call(_ref, text);
        };
    })(_ref.changeText);
    this.changeText = (function (f) {
        return function (text, invoker) {
            f.call(_ref, text);
            _btext = text;
            _bwidth = _ref.width;

            if (invoker !== 'arrows') {
                _arrows.text = text;
                _arrows.update();
            }
        };
    })(_ref.changeText);

    // modifying y-position
    var _ymodif = 1;
    this.modifyY = function (value) {
        _ymodif = value;
    };

    // updates position and rotation of the label
    this.update = function (x1, y1, x2, y2) {
        if (this.label === null) {
            throw new Error('Label not attached');
        }

        if (!(x1 && x2 && y1 && y2)) {
            return;
        }

        // compute angle and position our label correctly onto the edge
        var angle = eucgeom.angle2p(x1, y1, x2, y2);
        var modif = 1;
        if ((angle >= 90) && (angle <= 270)) {
            angle += 180;
            modif = -1;
        }

        // compute text if modif has changed
        if (_angleModif != modif) {
            _angleModif = modif;
            _arrows.update();
        }

        // does our label text fit on the edge?
        var dist = eucgeom.dist2p(x1, y1, x2, y2);
        var realDist = dist - 32*2 - 10;
        if (realDist < _bwidth) {
            // is it even worth trimming?
            if (realDist < 50) {
                if (this.text !== '') {
                    changeTextNS('');
                }
            } else {
                changeTextNS(text.dotted(_btext, Math.floor(realDist / 7)));
            }
        } else {
            if (_btext !== this.text) {
                changeTextNS(_btext);
            }
        }

        this.label
            .attr('transform', function() {
                return 'translate(' + x2 + ', ' + y2 + ') rotate(' + angle + ' 0, 0)';
            })
            .attr('dx', modif*dist/2 - this.width/2)
            .attr('dy', -_ymodif*this.height/2 + 5);
    };
};