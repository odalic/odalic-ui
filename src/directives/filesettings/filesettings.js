(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** FileSettings directive.
     *  This is a common subcomponent for handling file configurations, such as delimiters, CSV header, etc.
     *  It has a form of a modal window.
     *
     *  Usage:
     *      <file-settings bind="myvar"/>
     *
     *      scope.myvar.identifier = "awesome_movies";
     *      scope.myvar.open();
     *
     */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('fileSettings', function (rest, reporth) {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'filesettings.html',
            transclude: true,
            scope: {
                bind: '='
            },
            link: function (scope, iElement, iAttrs) {

                // Initialization
                scope.dataload = {};
                scope.messages = {};
                scope.settings = {
                    encoding: {
                        options: ['UTF-8', 'windows-1250', 'windows-1252', 'windows-1552', 'iso-8859-2', 'iso-8859-1', 'custom']
                    },
                    delimiter: {
                        options: [';', ',', '|', 'custom']
                    },
                    escape: {
                        options: ['\\', 'custom']
                    },
                    comment: {
                        options: ['#', '//', 'custom']
                    },
                    quote: {
                        options: ['"', '\'', 'custom']
                    }
                };

                var identifier = null;
                var mirrorSelect = objhelp.tsmirror([
                    ['encoding', 'charset'],
                    ['delimiter', 'delimiter'],
                    ['quote', 'quoteCharacter'],
                    ['escape', 'escapeCharacter'],
                    ['comment', 'commentMarker']
                ]);
                var mirrorChkBox = objhelp.tsmirror([
                    ['emptylinesignore', 'emptyLinesIgnored'],
                    ['headercaseignore', 'headerCaseIgnored']
                ]);

                // The root element
                var modElem = $(iElement.get(0).childNodes[0]);

                // Supporting functions
                var supportf = {
                    /** setOption('encoding', 'UTF-9') */
                    setOption: function (model, option) {
                        var ss = scope.settings[model];
                        if (option) {
                            var ff = text.findInclude(ss.options, option);

                            if (ff) {
                                ss.selection = ff;
                                return;
                            } else {
                                ss.selection = 'custom';
                                ss.value = option;
                            }
                        } else {
                            // Selected 'none'
                            ss.selection = '';
                        }
                    },

                    /** getOption('encoding') */
                    getOption: function (model) {
                        var ss = scope.settings[model];

                        var selection = ss.selection;
                        if (selection !== 'custom') {
                            return selection;
                        } else {
                            return ss.value;
                        }
                    },

                    /** getData('emptyLinesIgnored') - for retrieving from both checkboxes and selects */
                    getData: function (model) {
                        var result = null;

                        if (model in mirrorSelect.second) {
                            // Select
                            result = this.getOption(model);
                        } else if (model in mirrorChkBox.second) {
                            // Checkbox
                            result = scope.settings[model];
                        }

                        if (result === '') {
                            result = null;
                        }
                        return result;
                    },

                    /** setData('emptyLinesIgnored', true) - for setting data to both checkboxes and selects */
                    setData: function (model, data) {
                        if (model in mirrorSelect.second) {
                            // Select
                            this.setOption(model, data);
                            return true;
                        } else if (model in mirrorChkBox.second) {
                            // Checkbox
                            scope.settings[model] = objhelp.test(data, false, '!== null');
                            return true;
                        }

                        return false;
                    },

                    /** mirrorFromServer('emptyLinesIgnored') */
                    mirrorFromServer: function (model) {
                        return objhelp.getFirstArg(mirrorSelect.first[model], mirrorChkBox.first[model]);
                    },

                    /** mirrorToServer('emptylinesignore') */
                    mirrorToServer: function (model) {
                        return objhelp.getFirstArg(mirrorSelect.second[model], mirrorChkBox.second[model]);
                    }
                };

                // Initialization on opening
                var onOpen = function () {
                    // Load the configuration
                    rest.files.name(identifier).configuration.retrieve.exec(
                        // Success
                        function (response) {
                            objhelp.objForEach(response, function (key, value) {
                                supportf.setData(supportf.mirrorFromServer(key), value);
                            });
                            scope.dataload.show = true;
                        },

                        // Failure loading the configuration
                        function (response) {
                            scope.messages.push('error', reporth.constrErrorMsg(scope['msgtxt.loadFailure'], response.data));
                        }
                    );
                };

                // Sending changes to server
                var onSave = function (success, failure) {
                    // Load the configuration into an object
                    var props = ['charset',
                        'commentMarker',
                        'delimiter',
                        'emptyLinesIgnored',
                        'escapeCharacter',
                        'headerCaseIgnored',
                        'quoteCharacter'
                    ];

                    var toSend = {};
                    props.forEach(function (item) {
                        toSend[item] = supportf.getData(supportf.mirrorFromServer(item));
                    });

                    // Save the configuration
                    rest.files.name(identifier).configuration.replace(toSend).exec(success, failure);
                };

                // Buttons
                scope.dismiss = function () {
                    modElem.modal('hide');
                };

                scope.close = function () {
                    scope.dismiss();
                }

                scope.save = function (future) {
                    onSave(
                        // Success => close the modal
                        function (response) {
                            scope.dismiss();
                            future();
                        },
                        // Failure while sending data => display an error
                        function (response) {
                            scope.messages.push('error', reporth.constrErrorMsg(scope['msgtxt.saveFailure'], response.data));
                            future();
                        }
                    );
                };

                // On closing the modal
                modElem.on('hidden.bs.modal', function () {
                    // no action necessary, for now...
                });

                // Public interface
                scope.bind['open'] = function () {
                    // Opening the modal
                    identifier = scope.bind['identifier'];
                    modElem.modal();
                    onOpen();
                };
            }
        }
    });

})();