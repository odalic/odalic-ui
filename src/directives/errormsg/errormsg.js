(function () {

    // Main module
    var app = angular.module('odalic-app');

    /** error-msg
     *  Description:
     *      Serves only for visual representation of ng-messages when evaluated to error (or invalid).
     *
     *  Usage:
     *      # Example 1
     *      - template -
     *      <input type="text" name="taskIdentifier" ng-model="identifier" required>
     *
     *      <div ng-messages="myform.taskIdentifier.$error" role="alert">
     *          <div ng-message="required"><error-msg>Task name must not be empty.</error-msg></div>
     *      </div>
     *
     *  Arguments:
     *      none
     */
    var currentFolder = $.getPathForRelativePath('');
    app.directive('errorMsg', function ($compile) {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'errormsg.html',
            transclude: true,
            link: function (scope, iElement, iAttrs) {
                // Empty so far...
            }
        }
    });

})();