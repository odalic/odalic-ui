(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** Modal directive.
     *  Usage: <modal bind="myObj" title="Title">Content</modal>
     *
     *  In controller we can now use the following:
     *  $scope.myObj.open();                            // Opens the modal.
     *  $scope.myObj.title = "New title.";              // Changes the title of the modal.
     *  $scope.myObj.content = "<p>New content.</p>";   // Changes the content of the modal.
     *
     *  The following opens the modal with title set to 't' and content set to 'c'.
     *  Beware, the method changes the title and content of the modal permanently.
     *  $scope.myObj.open('t', 'c');
     *
     *  We can even open multiple consecutive modals!
     *  Be careful though, since this can annoy a user.
     *  $scope.myObj.open('t0', 'c0');
     *  $scope.myObj.open('t1', 'c1');
     *
     *  Several modal directives are completely independent and may actually be opened simultaneously.
     *
     */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('modal', function () {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'modal.html',
            transclude: true,
            scope: {
                bind: '='
            },
            link: function (scope, iElement, iAttrs) {
                // Initialize
                if (!scope.bind) {
                    scope.bind = {};
                }

                // Check for consistency
                if (typeof(scope.bind) !== 'object') {
                    throw new Error('modal directive: bind attribute not set properly.');
                }

                // The element
                var modElem = $(iElement.get(0).childNodes[0]);
                var modTitle = $('.modal-header', modElem);
                var modBody = $('.modal-body .container-fluid', modElem);

                // Displaying / hiding the modal's title
                var setTitle = function (display) {
                    if (display) {
                        $('h2', modTitle).html(display);
                        modTitle.show();
                    } else {
                        modTitle.hide();
                    }
                };

                // Title of the modal
                var modHead = 'title';
                var headlineText = null;
                scope.$watch('bind.title', function(newValue, oldValue) {
                    setTitle(objhelp.getFirstArg(scope.bind[modHead], iAttrs[modHead]));
                });

                // The content of the modal
                var modContent = 'content';
                scope.$watch('bind.content', function(newValue, oldValue) {
                    var content = scope.bind[modContent];
                    if (content) {
                        modBody.html(content);
                    }
                });

                // Opening the modal
                var queue = [];
                var openModal = function () {
                    title = queue[0].title;
                    content = queue[0].content;

                    if (title) {
                        // We may be already in the digest cycle => we have to update the HTML manually
                        scope.bind[modHead] = title;
                        setTitle(title);
                    }
                    if (content) {
                        // We may be already in the digest cycle => we have to update the HTML manually
                        scope.bind[modContent] = content;
                        modBody.html(content);
                    }

                    modElem.modal();
                };
                scope.bind['open'] = function (title, content) {
                    queue.push({title: title, content: content});
                    openModal();
                };

                // On closing the modal
                modElem.on('hidden.bs.modal', function () {
                    queue.shift();

                    // Open the modal again if the queue is not empty
                    if (queue.length > 0) {
                        openModal();
                    }
                });
            }
        }
    });

})();