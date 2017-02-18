(function () {

    /** persist
     *  Description:
     *      Peristence service
     *
     *      Consider several templates/pages: tp1, tp2 and tp3.
     *      Let's say we want to share data between the pages.
     *      The data is created on tp1; upon accessing tp2 we get the data;
     *      The data may be changed in tp2; upon accessing tp3 we get the changed data.
     *      However, when a completely different page is accessed (e.g. /home), the chain is broken, the data is
     *      deleted and needs to be created again by accessing tp1.
     *
     *      This 'persistence service' provides such a mechanism.
     *      Where can it be useful?
     *      - when data needs to be created on 1 page and accessed on a 2nd one, i.e. a strict sequence of page
     *      accesses is defined (create-new-task -> loading -> task-result)
     *      - a single page is accessed, but it gets reloaded (warning: not 'refreshed', this service would not help
     *      there); it can be useful to save a long-running computation this way and just reload the result
     *
     *  Usage:
     *      # Accessing pages {tp1, tp2}
     *      - tp1 -
     *      // define a chain (all pages belonging to the chain need to define this; the chain is broken upon accessing a page which does not)
     *      var data = persist.chain('pagegroup').scope($scope);
     *
     *      $scope.mystate = data.callOnce(function () {
     *          // this message will appear only once (if the chain is not broken)
     *          console.log('long running computation...');
     *
     *          return 'Hello, World!';
     *      }, 'unique-function-name');
     *
     *      - tp2 -
     *      // define a chain
     *      var data = persist.chain('pagegroup').scope($scope);
     *
     *      // if the chain was broken, null is returned instead of 'Hello, World!'
     *      $scope.mystate = data.getFunctionData('unique-function-name');
     *
     *
     *      # Strict order of pages tp1 -> tp2 -> tp3
     *      - tp1 -
     *      // define a chain (we will define chain called 'pagegroup' solely on screens tp1, tp2, tp3 and nowhere else)
     *      var data = persist.chain('pagegroup').scope($scope);
     *
     *      // this is the first accessed page; save custom data
     *      data['where'] = 'tp1';
     *
     *      - tp2 -
     *      // define a chain
     *      var data = persist.chain('pagegroup').scope($scope);
     *
     *      // was a previous page tp1?
     *      if (data['where'] === 'tp1') {
     *          // this is the second accessed page
     *          data['where'] = 'tp2';
     *      }
     *
     *      - tp3 -
     *      // define a chain
     *      var data = persist.chain('pagegroup').scope($scope);
     *
     *      // was a previous page tp2?
     *      if (data['where'] === 'tp2') {
     *          // do something...
     *      }
     *
     *
     *      # Defining custom event handlers for screen change
     *      // define a chain (in this case does not play any major role)
     *      var data = persist.chain('pagegroup').scope($scope);
     *
     *      // defining a custom event (will get called automatically upon any screen change; watchers should be therefore cleared)
     *      data.window.watch(function (win) {
     *          if (win.current != win.history[0]) {
     *               console.log('Does anybody actually read this? I am curious.');
     *               win.clearWatchers();
     *          }
     *      });
     *
     *  Remarks:
     *      - This service does not work properly if rerouting mechanism is used.
     */

    // Main module
    var app = angular.module('odalic-app');
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

                    // When the page changes, save the address of the new page and call user defined callbacks
                    if (!('windowChangeDefined' in pr)) {
                        scope.$on('$locationChangeSuccess', function(evt, absNewUrl, absOldUrl) {
                            if (absOldUrl != pr.urlcurrent) {
                                throw new Error('Assertion failed on "persist" service. URL inconsistency.');
                            }
                            pr.urldesignated = absNewUrl;

                            // Call user defined callbacks
                            if (('windowChange' in pr) && ('data' in pr)) {
                                pr.data.window.history.push(absNewUrl);
                                pr.windowChange.forEach(function (callback) {
                                    callback(pr.data.window);
                                });
                            }
                        });
                        
                        pr.windowChangeDefined = true;
                    }

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
                            },

                            window: {
                                get current() {
                                    return $location.absUrl();
                                },

                                history: [pr.urlcurrent],

                                watch: function (callback) {
                                    if (!('windowChange' in pr)) {
                                        pr.windowChange = [];
                                    }

                                    pr.windowChange.push(callback);
                                },
                                
                                clearWatchers: function () {
                                    pr.windowChange = [];
                                }
                            }
                        };
                    } else {
                        pr.data.window.history.push(pr.urlcurrent);
                    }

                    // Return the data
                    return pr.data;
                }
            };
        };
    });

})();