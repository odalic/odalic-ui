var text = {
    /** Uses heuristics to find key points for a given URI (domain, language, ...).
     *  Note that this is just an estimate, it may not be accurate.
     *  Please ensure the given address is in a correct form otherwise a non-sensible exception may be thrown.
     *
     * @param address       The address to split to key points
     * @returns {{protocol: string, domain: string, language: string, page: string}}
     */
    uri: function (address) {
        var arr = address.split(/[\:/.]+/);

        // Using heuristics here; everything is just an estimate
        var protocols = ['http', 'https'];
        var wwws = ['www', 'ww2'];

        var _protocol = protocols[0];
        var foundProtocol = false;
        protocols.forEach(function (item) {
            if (item == arr[0]) {
                _protocol = item;
                arr.shift();
            }
        });
        wwws.forEach(function (item) {
            if (item == arr[0]) {
                arr.shift();
            }
        });

        var _domain = arr[0];
        arr.shift();

        while (arr[0].length > 3) {
            arr.shift();
        }
        var _lang = arr[0];
        arr.shift();

        var _page = '';
        if (arr.length >= 1) {
            _page = arr[arr.length - 1];
            if (_page.includes('?')) {
                _page = _page.split('?')[0];

                var endings = ['htm', 'html', 'asp', 'jsp', 'php'];
                var foundend = false;
                endings.forEach(function (item) {
                    if (_page == item) {
                        foundend = true;
                    }
                });

                if (foundend) {
                    if (arr.length >= 2) {
                        _page = arr[arr.length - 2];
                    }
                }
            }
        }

        return {
            protocol: _protocol,
            domain: _domain,
            language: _lang,
            page: _page
        };
    },

    /** When a string is too long, use this function to trim it and put '...' in the middle.
     *
     * @param value     The string to trim
     * @param length    Length to trim the string to
     * @returns {*}     'Dotted' string
     */
    dotted: function (value, length) {
        var l = value.length;
        if (l <= length) {
            return value;
        }

        if (length < 5) {
            throw new Error('Conditional length too small; cannot proceed.');
        }

        // '..' vs. '...'
        var dotl = 3;
        var overlap = l - length;
        if ((length <= 6) || (overlap <= 2)) {
            dotl = 2;
        }

        // trim
        overlap += dotl;
        var _fhalf = value.slice(0, Math.floor(l/2) - Math.floor(overlap/2));
        var _shalf = value.slice(Math.floor(l/2) + 1 + Math.floor(overlap/2)
            + ((overlap % 2 == 0) ? 0 : 1));

        // concatenate
        return _fhalf + this.repeat('.', dotl) + _shalf;
    },

    /** Make a string by repeating it.
     *  e.g. repeat('hi', 3) gives 'hihihi'
     *
     * @param value     A string
     * @param count     How many times to repeat the string
     * @returns {*}     New string
     */
    repeat: function (value, count) {
        if (count <= 0) {
            throw new Error('Count must be greater than 0.');
        }

        var r = value;
        for (var i = 1; i < count; i++) {
            r += value;
        }
        return r;
    }
};