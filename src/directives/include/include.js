(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Include directive.
     *
     *  Usage 1: <include src="myresource.html"/>
     *   Includes the requested resource into a template.
     *
     *  Usage 2: <include src="myresource.html" for="obj" />
     *   Includes the requested resource into a variable "$scope.obj".
     *
     *  Usage 3: <include res="obj" />
     *   Includes a resource from "$scope.obj" into a template.
     *   Automatically watches "obj" for changes.
     *
     *  Notice: When using a different resource than HTML, you have to specify "type":
     *  <include src="myresource.txt" type="text"/>
     *
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