(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Subcomponent for displaying buttons (send feedback, reexecute, ...)
    // and handling feedback sending
    var currentFolder = $.getPathForRelativePath('');
    app.directive('controlButtons',['rest', function (rest) {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'controlButtons.html',
            link: function ($scope, iElement, iAttrs) {
                // TODO: [critical] Feedback saving not working when a user actually makes a change.
                // Set the feedback according to UI
                sendFeedback = function (success, error) {
                    // Subjects columns
                    $scope.feedback.subjectColumnPositions = {};
                    for (var KB in $scope.locked.subjectColumns) {
                        for (var columnIndex in $scope.locked.subjectColumns[KB]) {
                            if ($scope.locked.subjectColumns[KB][columnIndex] == 1) {
                                $scope.feedback.subjectColumnPositions[KB] = {
                                    index: columnIndex
                                }
                            }
                        }
                    }

                    // Ignored columns
                    $scope.feedback.columnIgnores = [];
                    for (var columnNumber in $scope.ignoredColumn) {
                        if ($scope.ignoredColumn[columnNumber] == true) {
                            $scope.feedback.columnIgnores.push({position: {index: columnNumber}});
                        }
                    }

                    // Classifications
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

                    // Disambiguations
                    $scope.feedback.disambiguations = [];
                    for (var rowIndex in $scope.locked.tableCells) {
                        if (rowIndex != -1) {
                            for (var columnIndex in $scope.locked.tableCells[rowIndex]) {
                                if ($scope.locked.tableCells[rowIndex][columnIndex] == 1) {
                                    var obj = {
                                        "position": {
                                            "rowPosition": {
                                                "index": rowIndex
                                            },
                                            "columnPosition": {
                                                "index": columnIndex
                                            }
                                        },
                                        "annotation": $scope.result.cellAnnotations[rowIndex][columnIndex]
                                    };
                                    $scope.feedback.disambiguations.push(obj);
                                }
                            }
                        }
                    }

                    // Column ambiguities
                    $scope.feedback.columnAmbiguities = [];
                    for (var columnNumber in $scope.noDisambiguationColumn) {
                        if ($scope.noDisambiguationColumn[columnNumber] == true) {
                            $scope.feedback.columnAmbiguities.push({position: {index: columnNumber}});
                        }

                    }

                    // Ambiguities
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

                    // Relations
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

                    // Send the feedback
                    rest.tasks.name($scope.taskID).feedback.store($scope.feedback).exec(success, error);
                };



                // Reexecute
                $scope.reexecute = function () {
                    // TODO: Error reporting should be improved.

                    // Send feedback
                    sendFeedback(
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
            }
        }
    }]);

})();