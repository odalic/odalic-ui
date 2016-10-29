(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Reporting service.
     *  A service for reporting updates on any page. No need to use any specialized directive.
     *
     *  Usage:
     *  var r = report($scope);         // To prevent unwanted instantiation, call report only once per controller.
     *  r.initialize();                 // Not necessary, but may speed things a little bit.
     *  r.error(response);              // Display an error message for a REST response that resulted in an error.
     *
     *  Example:
     *  report($scope).error({status: 409, type: 'MESSAGE', payload: "A long, very long, very, very, uselessly, long, text describing the issue. Will be automatically shortened."});
     *
     */
    var currentFolder = $.getPathForRelativePath('');
    app.service('report', function (requests, $compile) {
        return function (scope) {
            // Initialization
            var initialized = false;
            var initBegin = false;
            var init = function () {
                if (initBegin) {
                    return;
                }
                initBegin = true;

                // Load the template
                requests.quickRequest(currentFolder + 'templates/errormodal.html', 'GET',
                    function (response) {
                        initErrorModal(response.data);
                    },
                    function (response) {
                        throw new Error('Could not initialize reporting service. Could not load the error-modal template.');
                    }
                );

                // Inject the template
                function initErrorModal(template) {
                    var delay = 100;
                    window.setTimeout(function () {
                        var mainCnt = $('main-cnt');
                        if (!mainCnt) {
                            throw new Error('Could not initialize reporting service. Could not find the "main-cnt" element.');
                        }

                        var modal = $compile(template)(scope);
                        mainCnt.append(modal);

                        window.setTimeout(function () {
                            initialized = true;
                        }, delay);
                    }, delay);
                }
            };

            // REST error reporting
            var resterror = function (response) {
                // Regarding the REST API.
                if (typeof(response) !== 'object') {
                    throw new Error('Fatal error in report service: response is not an object.')
                }

                // Fill
                scope.report.errormodal.status = response.status;

                var description = (response.type === 'MESSAGE') ? response.payload : response.payload.text;
                scope.report.errormodal.description = text.dotted(description, 30);

                // Human-readable description
                var decider = Math.floor(response.status / 100);
                switch (decider) {
                    case 2:
                        throw new Error('Report service: The status code does not indicate any sort of error.');
                    case 3:
                        throw new Error('Report service: The status code indicates redirection.');
                    case 4:
                        switch (response.status) {
                            case 404:
                                scope.report.errormodal.hrd = 'You seem to be trying to use a resource that no longer exists. Try reloading the page.';
                                break;
                            case 409:
                                scope.report.errormodal.hrd = 'You are too quick for us to process your request. Be patient! Or try reloading the page.';
                                break;
                            default:
                                scope.report.errormodal.hrd = 'We are not sure about the exact cause of the error but it seems you are to blame.';
                                break;
                        }
                        break;
                    case 5:
                        scope.report.errormodal.hrd = 'It seems the error is on our side. Sorry. Maybe you can report the issue?';
                        break;
                    default:
                        throw new Error('Report service: Unrecognized status code.');
                }

                // Display the error
                scope.report.errormodal.open();
            };

            // The service
            return {
                initialize: function () {
                    if (!initialized) {
                        init();
                    }
                },

                ready: function (action) {
                    this.initialize();

                    if (initialized) {
                        action();
                    } else {
                        var delay = 100;
                        var f = function () {
                            if (!initialized) {
                                window.setTimeout(f, delay);
                            } else {
                                action();
                            }
                        };
                        window.setTimeout(f, delay);
                    }
                },

                error: function (response) {
                    this.ready(function () {
                        resterror(response);
                    });
                }
            };
        };
    });

})();