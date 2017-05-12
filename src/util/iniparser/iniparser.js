/** A simple INI file style parser */
var iniparser = {
    /** Parses the given textual data in INI format.
     *  Returns an object similar to the following example:
     *  ; Beginning of the configuration file
     *  key1=value1
     *
     *  [section1]
     *  key1=value1
     *  ; End of the configuration file
     *
     *  result = {
     *      key1: value1,
     *      section1: {
     *          key1: value1
     *      }
     *  };
     *
     * @param data   Textual data in INI format.
     * @returns {{}} The parsed data.
     */
    parse: function (data) {
        // Credits go to http://stackoverflow.com/questions/3870019/javascript-parser-for-a-string-which-contains-ini-data
        var regex = {
            section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
            param: /^\s*([^=]+?)\s*=\s*(.*?)\s*$/,
            comment: /^\s*;.*$/
        };

        var value = {};
        var lines = data.split(/[\r\n]+/);
        var section = null;

        lines.forEach(function(line) {
            // The current line in the file is a comment
            if (regex.comment.test(line)) {
                return;
            }
            // The current line in the file is a key=value
            else if (regex.param.test(line)) {
                var match = line.match(regex.param);
                if (section) {
                    value[section][match[1]] = match[2];
                } else {
                    value[match[1]] = match[2];
                }
            }
            // The current line in the file is a [section]
            else if (regex.section.test(line)) {
                var match = line.match(regex.section);
                value[match[1]] = {};
                section = match[1];
            }
            // The current line in the file is an empty line and nullifies section
            else if (line.length == 0 && section) {
                section = null;
            }
        });

        return value;
    }
};