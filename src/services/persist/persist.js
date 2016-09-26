(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Peristence service
     *
     *  Consider several templates/pages: tp1, tp2 and tp3.
     *  Let's say we want to share data between the pages.
     *  The data is created on tp1; upon accessing tp2 we get the data;
     *  The data may be changed in tp2; upon accessing tp3 we get the changed data.
     *  However, when a completely different page is accessed (e.g. /home), the chain is broken,
     *  the data is deleted and needs to be created again by accessing tp1.
     *
     *  This 'persistence service' provides such a mechanism.
     *  Where can it be useful?
     *  - when data needs to be created on 1 page and accessed on a 2nd one,
     *   i.e. a strict sequence of page accesses is defined
     *   (create-new-task, task-result)
     *  - a single page is accessed, but it gets reloaded (warning: not 'refreshed',
     *   the service would not help there); it can be useful to save a long-running
     *   computation this way and just reload the result
     *
     *
     *  Usage:
     *  - tp1:
     *  // define a chain
     *  var data = persist.chain('pagegroup').scope($scope);
     *
     *  $scope.mystate = data.callOnce(function () {
     *      // this message will appear only once, until the chain is broken:
     *      console.log('long running computation...');
     *
     *      return 'Hello, World!';
     *  }, 'unique-function-name');
     *
     * - tp2:
     *  // chain
     *  var data = persist.chain('pagegroup').scope($scope);
     *
     *  // if the chain was broken, null is returned instead of 'Hello, World!'
     *  $scope.mystate = data.getFunctionData('unique-function-name');
     *
     *
     *  Info: 'data' is an object, i.e. own properties may be defined.
     *
     *  Warning: Each page in a chain has to access the function
     *   'persist.chain('mychain').scope($scope);', otherwise the data gets destroyed.
     *
     *  Warning: The service will not work properly if rerouting is used between pages
     *   in a chain.
     */
    app.service('persist', function ($location) {

        var pers = {};

        this.chain = function (id) {
            if (!(id in pers)) {
                pers[id] = {};
            }
            var pr = pers[id];

            return {
                scope: function (scope) {
                    // Save the current address
                    pr.urlcurrent = $location.absUrl();

                    // Designated URL set (from a previous call)?
                    if (!('urldesignated' in pr)) {
                        pr.urldesignated = null;
                    }

                    // When the page changes, save the address of the new page
                    scope.$on('$locationChangeSuccess', function(evt, absNewUrl, absOldUrl) {
                        if (absOldUrl != pr.urlcurrent) {
                            throw new Error('Assertion failed on "persist" service. URL inconsistency.');
                        }
                        pr.urldesignated = absNewUrl;
                    });

                    // Clear data? (Are we the 'expected' page?)
                    if (pr.urlcurrent !== pr.urldesignated) {
                        pr.data = {
                            functionData: {},
                            callOnce: function (f, key) {
                                if (!key) {
                                    // Not recommended - requires EC6 support!
                                    key = f.name;
                                    if (!key) {
                                        throw new Error('Could not derive a key from a function implicitly in "persist" -> "callOnce".');
                                    }
                                }

                                if (!(key in this.functionData)) {
                                    var res = f();

                                    if (typeof(res) !== 'undefined') {
                                        this.functionData[key] = res;
                                    } else {
                                        this.functionData[key] = null;
                                    }
                                }
                                return this.functionData[key];
                            },

                            getFunctionData: function (key) {
                                if (!(key in this.functionData)) {
                                    return null;
                                }
                                return this.functionData[key];
                            }
                        };
                    }

                    // Return the data
                    return pr.data;
                }
            };
        };
    });

})();