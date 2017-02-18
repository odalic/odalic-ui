(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** modal
     *  Description:
     *      Represents a modal window.
     *
     *  Usage:
     *      # Example 1
     *      - template -
     *      <modal bind="myObj" title="Title">Content</modal>
     *
     *      - controller -
     *      // opens the modal
     *      $scope.myObj.open();
     *
     *
     *      # Example 2
     *      - template -
     *      <modal bind="myObj"/>
     *
     *      - controller -
     *      // set the title and content of the modal
     *      $scope.myObj.title = "New title.";
     *      $scope.myObj.content = "<p>New content.</p>";
     *
     *
     *      # Example 3
     *      - template -
     *      <modal bind="myObj"/>
     *
     *      - controller -
     *      // opens the modal with title set to 't' and content set to 'c'
     *      $scope.myObj.open('t', 'c');
     *
     *      // this will not open the modal until the previous one is closed
     *      $scope.myObj.open('t1', 'c1');
     *
     *  Arguments:
     *      title (optional)
     *      - Modal window headline.
     *
     *      bind
     *      - An object on scope. Has to be defined (may be empty) and is filled by functions and properties automatically.
     *      Properties:
     *          - title (get/set): headline of the modal; may be null
     *          - content (get/set): content of the modal
     *      Functions:
     *          - open(): opens a new instance of the modal (if not already opened); several consequent modals may be
     *          opened
     *          - open(title, content): opens a new instance of the modal (if not already opened); sets content and
     *          title of the modal as in arguments; several consequent modals may be opened (each with different title
     *          and content set); note, the function changes the 'title' and 'content' properties of the 'bind' object
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
                        $('.modal-title', modTitle).html(display);
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

                // Closing the modal
                scope.close = function (state) {
                    modElem.modal('hide');
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