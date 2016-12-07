(function () {

    // Main module
    var app = angular.module('odalic-app');

    //allows sends feedback, reexecute algorithm and scroll through results
    var currentFolder = $.getPathForRelativePath('');
    app.directive('controlButtons',['rest', function (rest) {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'controlButtons.html',
            link: function ($scope, iElement, iAttrs) {

                // TODO: [critical] Feedback saving not working when a user actually makes a change.
                var feedbackFunctions = {
                    sendFeedback: function (success, error) {
                        // Set the feedback according to UI
                        //region subjectsColumns
                        $scope.feedback.subjectColumnPositions = {};
                        for (var KB in  $scope.locked.subjectColumns) {
                            for (var columnIndex in $scope.locked.subjectColumns[KB]) {
                                if ($scope.locked.subjectColumns[KB][columnIndex] == 1) {
                                    $scope.feedback.subjectColumnPositions[KB] = {};
                                    $scope.feedback.subjectColumnPositions[KB] = {index: columnIndex}
                                }

                            }
                        }
                        //endregion

                        //region columnIgnores- sets ignored columns
                        //"columnIgnores": [ { position: { index: 6 } },...]
                        $scope.feedback.columnIgnores = [];
                        for (var columnNumber in $scope.ignoredColumn) {
                            if ($scope.ignoredColumn[columnNumber] == true) {
                                $scope.feedback.columnIgnores.push({position: {index: columnNumber}});
                            }
                        }
                        //endregion

                        //region classification
                        $scope.feedback.classifications = [];
                        for (var columnIndex in $scope.locked.tableCells[-1]) {
                            if ($scope.locked.tableCells[-1][columnIndex] == 1) {
                                var obj = {
                                    "position": {"index": columnIndex},
                                    "annotation": $scope.result.headerAnnotations[columnIndex]
                                };
                                $scope.feedback.classifications.push(obj);
                            }
                        }
                        //endregion

                        //region disambiguation
                        $scope.feedback.disambiguations = [];
                        for (var rowIndex in $scope.locked.tableCells) {
                            if (rowIndex != -1) {
                                for (var columnIndex in $scope.locked.tableCells[rowIndex]) {
                                    if ($scope.locked.tableCells[rowIndex][columnIndex] == 1) {
                                        var obj = {
                                            "position": {
                                                "rowPosition": {"index": rowIndex},
                                                "columnPosition": {"index": columnIndex}
                                            },
                                            "annotation": $scope.result.cellAnnotations[rowIndex][columnIndex]
                                        };
                                        $scope.feedback.disambiguations.push(obj);
                                    }
                                }
                            }
                        }
                        //endregion

                        //region columnAmbiguities-sets the skipped column -disambiguations
                        //"columnAmbiguities": [{ position: { index: 6 } },...],
                        $scope.feedback.columnAmbiguities = [];
                        for (var columnNumber in $scope.noDisambiguationColumn) {
                            if ($scope.noDisambiguationColumn[columnNumber] == true) {
                                $scope.feedback.columnAmbiguities.push({position: {index: columnNumber}});
                            }

                        }
                        //endregion

                        //region ambiguities-sets the skipped cell disambiguations
                        //"ambiguities": [{ position: { rowPosition: { index: 6 }, columnPosition: { index: 6 } } }, ...],
                        $scope.feedback.ambiguities = [];
                        for (var rowNumber in $scope.noDisambiguationCell) {
                            for (var columnNumber in $scope.noDisambiguationCell[rowNumber]) {
                                if ($scope.noDisambiguationCell[rowNumber][columnNumber] == true) {
                                    $scope.feedback.ambiguities.push({
                                        position: {
                                            rowPosition: {index: rowNumber},
                                            columnPosition: {index: columnNumber}
                                        }
                                    });
                                }

                            }
                        }
                        //endregion

                        //region relations
                        $scope.feedback.columnRelations = [];
                        for (var column1Index in $scope.locked.graphEdges) {
                            for (var column2Index in $scope.locked.graphEdges[column1Index]) {
                                if ($scope.locked.graphEdges[column1Index][column2Index] == 1) {
                                    var obj = {
                                        "position": {
                                            "first": {"index": column1Index},
                                            "second": {"index": column2Index}
                                        },
                                        "annotation": $scope.result.columnRelationAnnotations[column1Index][column2Index]
                                    };
                                    $scope.feedback.columnRelations.push(obj);
                                }
                            }
                        }
                        //endregion

                        // Send the feedback
                        rest.tasks.name($scope.taskID).feedback.store($scope.feedback).exec(success, error);
                    }
                };

                $scope.userFeedback = function () {
                    feedbackFunctions.sendFeedback(
                        // Success
                        function (response) {
                            // Feedback successfully sent.
                        },

                        // Failure
                        function (response) {
                            throw new Error('Error while trying to send the feedback.');
                        }
                    );
                };

                $scope.reexecute = function () {
                    // TODO: Error reporting should be improved.

                    // Send feedback
                    feedbackFunctions.sendFeedback(
                        // Feedback sent successfully
                        function (response) {
                            // Start the task
                            rest.tasks.name($scope.taskID).execute.exec(
                                // Execution started successfully
                                function (response) {
                                    window.location.href = '#/taskconfigs/' + $scope.taskID;
                                },

                                // Error while starting the execution
                                function (response) {
                                    throw new Error('Error while trying to run the task; cannot continue.');
                                }
                            );
                        },

                        // Failure while sending feedback
                        function (response) {
                            throw new Error('Error while saving feedback; cannot continue.');
                        }
                    );
                };

                //$scope.state = 0;                       // Default VIEW
                $scope.previousState = function () {
                    $scope.state--;
                };

                $scope.nextState = function () {
                    $scope.state++;
                };
            }
        }
    }]);

})();