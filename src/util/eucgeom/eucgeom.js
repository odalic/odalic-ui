var eucgeom = {
    /** Computes 2nd power of a number */
    sqr: function (n) {
        return n*n;
    },

    /** Computes an angle for a line given by 2 points [x1, y1], [x2, y2] */
    angle2p: function (x1, y1, x2, y2) {
        var cx = x2-x1;
        var cy = y1-y2;
        return angle = 180 - Math.atan2(cy, cx) * 180 / Math.PI;
    },

    /** Computes a distance between 2 points [x1, y1] and [x2, y2] */
    dist2p: function (x1, y1, x2, y2) {
        return Math.sqrt(this.sqr(x2-x1) + this.sqr(y1-y2));
    }
};