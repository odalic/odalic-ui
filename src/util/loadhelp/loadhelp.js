/** Helps with submodule loading.
 *
 *  Note the paths specified need to be relative.
 *  Note the functions here specified need not to be called from an inside of a controller.
 */
var loadhelp = {
    /** Loads submodules defined in an array.
     *
     *  @param sources An array of submodules' paths.
     */
    loadArray: function (sources) {
        sources.forEach(function (include) {
            $.getScriptSync($.getPathForRelativePath(include), function () { /* Empty. */ });
        });
    },

    /** Loads submodules defined in the given source.
     *
     *  @param source A path to a JSON file containing the submodules' paths.
     */
    loadSource: function (source) {
        var _ref = this;
        $.getJSONSync($.getPathForRelativePath(source), function (includes) {
            _ref.loadArray(includes);
        });
    },

    /** Loads submodules defined in a file 'components.json' contained within the same folder as the callef of this
     *  function.
     */
    loadDefault: function () {
        this.loadSource('components.json');
    }
};