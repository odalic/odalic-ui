(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** include
     *  Description:
     *      Includes a portion of HTML code from an external resource.
     *
     *  Usage:
     *      # Example 1
     *      - template -
     *      <include src="src/templates/taskresult/template.html"/>
     *
     *
     *      # Example 2
     *      - template -
     *      <include src="myresource.html" for="obj"/>
     *      {{ obj }}
     *
     *
     *      # Example 3
     *      - template -
     *      <include res="obj"/>
     *
     *      - controller -
     *      $scope.obj = '<b>text</b>';
     *
     *
     *      # Example 4
     *      - template -
     *      <!-- resource other than HTML -->
     *      <include src="myresource.txt" type="text"/>
     *
     *  Arguments:
     *      src (optional)
     *      - Absolute path to the resource to be included.
     *
     *      for (optional)
     *      - Variable on a current scope to include the resource into. If specified, the resource is not included
     *      into the template.
     *
     *      res (optional)
     *      - Variable on a current scope to include the code from. Automatically watches the variable for changes,
     *      i.e. this is an equivalent of using '{{ variable }}' syntax.
     *
     *      type (optional)
     *      - Type of the resource. Has to be specified, if the resource is of a different type, than HTML.
     */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('include', function ($compile) {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'include.html',
            transclude: false,
            link: function (scope, iElement, iAttrs) {
                // Set HTML to the current element
                var sethtml = function (html) {
                    iElement.html(html);
                    $compile(iElement.contents())(scope);
                };

                // What should happen, when a resource is loaded
                var loaded = function (html) {
                    if ('for' in iAttrs) {
                        scope[iAttrs['for']] = html;
                        sethtml('');
                    } else {
                        sethtml(html);
                    }
                };

                // Load a resource, if specified
                if ('src' in iAttrs) {
                    var type = 'html';
                    if ('type' in iAttrs) {
                        type = iAttrs['type'];
                    }

                    $.get(iAttrs['src'], function(response) {
                        loaded(response);
                    }, type);
                }

                // Watch for a resource, if specified
                if ('res' in iAttrs) {
                    scope.$watch(iAttrs['res'], function(newValue, oldValue) {
                        sethtml(newValue);
                    });
                }
            }
        }
    });

})();