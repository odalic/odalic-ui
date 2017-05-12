(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Subcomponent for displaying buttons (send feedback, reexecute, ...)
    // and handling feedback sending
    var currentFolder = $.getPathForRelativePath('');
    app.directive('controlButtons', ['rest', 'reporth', function (rest, reporth) {
        return {
            restrict: 'E',
            templateUrl: currentFolder + 'controlbuttons.html',
            link: function ($scope, iElement, iAttrs) {
                // Initialization
                $scope.messages = {};

                // Set the feedback according to UI
                sendFeedback = function (success, error) {
                    // Subjects columns
                    $scope.feedback.subjectColumnPositions = {};
                    $scope.feedback.subjectColumnsPositions = {};
                    for (var KB in $scope.locked.subjectColumns) {
                        for (var columnIndex in $scope.locked.subjectColumns[KB]) {
                            // column is locked and it is the main subject column (column can be locked with other (not main) subject columns)
                            if ($scope.locked.subjectColumns[KB][columnIndex] ==1) {
                                if(!$scope.feedback.subjectColumnsPositions.hasOwnProperty(KB))
                                {
                                    $scope.feedback.subjectColumnsPositions[KB]=[];
                                }
                                $scope.feedback.subjectColumnsPositions[KB].push({
                                    index: columnIndex

                                })
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

                    // Compulsory columns
                    $scope.feedback.columnCompulsory = [];
                    for (var columnNumber in $scope.compulsory) {
                        if ($scope.compulsory[columnNumber] == true) {
                            $scope.feedback.columnCompulsory.push({position: {index: columnNumber}});
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

                    //data cube feedback without candidates and chosen
                    $scope.feedback.dataCubeComponents = [];
                    for (var index in $scope.locked.statisticalData) {
                        var lock = $scope.locked.statisticalData[index];
                        if (lock == 1) {
                            var predicateObj = $scope.result.statisticalAnnotations[index];
                            var newPredicate = angular.copy(predicateObj.predicate);

                            delete newPredicate.chosen;
                            delete newPredicate.candidates;

                            var obj = {
                                "position": {"index": index},
                                "annotation": {
                                    "component": predicateObj.component,
                                    "predicate": newPredicate
                                }

                            };
                            obj.annotation.predicate[$scope.primaryKB] = angular.copy(predicateObj.predicate.chosen[$scope.primaryKB]);

                            $scope.feedback.dataCubeComponents.push(obj);
                        }
                    }

                    // Send the feedback
                    rest.tasks.name($scope.taskID).feedback.store($scope.feedback).exec(success, error);
                };

                // Save feedback
                $scope.saveFeedback = function (f) {
                    sendFeedback(
                        // Feedback sent successfully
                        function (response) {
                            f();
                            $scope.messages.push('success', $scope['msgtxt.feedbackSaved']);
                        },

                        // Failure while sending feedback
                        function (response) {
                            f();
                            $scope.messages.push('error', reporth.constrErrorMsg($scope['msgtxt.sendFailure'], response.data));
                        }
                    );
                };

                // Reexecute
                $scope.reexecute = function (f) {
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
                                    f();
                                    $scope.messages.push('error', reporth.constrErrorMsg($scope['msgtxt.startFailure'], response.data));
                                }
                            );
                        },

                        // Failure while sending feedback
                        function (response) {
                            f();
                            $scope.messages.push('error', reporth.constrErrorMsg($scope['msgtxt.sendFailure'], response.data));
                        }
                    );
                };
            }
        }
    }]);

})();