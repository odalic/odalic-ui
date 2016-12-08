/** Helps with submodule loading.
 *
 *  Note that all paths need to be relative and functions need not to be called from an inside of a controller.
 */
var loadhelp = {
    /** Loads submodules defined in an array.
     *
     * @param sources An array of submodules' paths.
     */
    loadArray: function (sources) {
        sources.forEach(function (include) {
            $.getScriptSync($.getPathForRelativePath(include), function () { /* Empty. */ });
        });
    },

    /** Loads submodules defined in the given source.
     *
     *  @param source A JSON file containing the submodules' paths.
     */
    loadSource: function (source) {
        var _ref = this;
        $.getJSONSync($.getPathForRelativePath(source), function (includes) {
            _ref.loadArray(includes);
        });
    },

    /** Loads submodules defined in components.json */
    loadDefault: function () {
        this.loadSource('components.json');
    }
};