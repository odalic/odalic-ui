(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Loading icon directive.
     *
     *  Usage: <loadico bind="myvar" size="2">Content to be hidden until loaded</loadico>
     *
     *  Option 1:
     *  $scope.myvar.load = function(callback) {
     *      PerformAjaxRequest(callback, function() { ...error... });
     *  }
     *
     *  Option 2:
     *  PerformAjaxRequest(function() { $scope.myvar.show = true; }, function() { ...error... });
     *
     *  Styling:
     *  <loadico bind="myvar" size="2" center="true" showtxt="false">Content</loadico>
     *
     */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('loadico', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'loadico.html',
            transclude: true,
            scope: {
                bind: '='
            },
            link: function (scope, iElement, iAttrs) {

                // Initialize
                if (!scope.bind) {
                    scope.bind = {};
                }

                // Settings
                var settings = [
                    { name: 'size', defaultv: 1 },
                    { name: 'show', defaultv: false },
                    { name: 'load', defaultv: null }
                ];

                settings.forEach(function (si) {
                    if (si.name in iAttrs) {
                        scope.bind[si.name] = iAttrs[si.name];
                    } else if (!(si.name in scope.bind)) {
                        scope.bind[si.name] = si.defaultv;
                    }
                });

                // Size
                scope.size = function () {
                    var sn = settings[0].name;
                    var dv = settings[0].defaultv;

                    var val = scope.bind[sn];
                    if ((val < 1) || (val > 5)) {
                        scope.bind[sn] = dv;
                    }

                    return ('fa-' + val + 'x');
                };

                // Additional styling (true/false attributes)
                var attribs = [
                    { name: 'center', sname: 'toCenter' },
                    { name: 'showtxt', sname: 'textShown' }
                ];
                attribs.forEach(function (i) {
                    if (i.name in iAttrs) {
                        scope[i.sname] = iAttrs[i.name];
                    } else {
                        scope[i.sname] = false;
                    }
                });

                // Visibility
                scope.loaded = false;
                scope.$watch('bind.show', function(newValue, oldValue) {
                    if (typeof(newValue) !== 'boolean') {
                        throw new Error('Not supported argument on { show } for loadico directive.');
                    }

                    scope.loaded = newValue;
                });


                // Loading
                scope.$watch('bind.load', function(newValue, oldValue) {
                    if (newValue != null) {
                        if (typeof(newValue) !== 'function') {
                            throw new Error('Not supported argument on { load } for loadico directive.');
                        }

                        // When the content is loaded, show it and hide the icon
                        newValue(function () {
                            scope.bind.show = true;

                            if (!scope.$$phase) {
                                scope.$apply();
                            }
                        });
                    }
                });
            }
        }
    });

})();