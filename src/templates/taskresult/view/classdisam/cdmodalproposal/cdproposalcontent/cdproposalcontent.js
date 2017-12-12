(function () {

    // Main module
    var app = angular.module('odalic-app');

    //allows to propose own classification or disambiguation
    app.controller('cDProposeController', function ($scope, $uibModalInstance, rest, data) {
        $scope.selectedPosition = data.selectedPosition;
        $scope.result = data.result;
        $scope.locked = data.locked;
        $scope.primaryKB = data.primaryKB;
        $scope.close = $uibModalInstance.close;


        //sets parameters for the alert directive
        $scope.serverResponse = {
            visible: false
        };

        $scope.missingColumnClass = {};

        $scope.dialogTitle = function()
        {

            if ($scope.selectedPosition.row == -1) {
                return "classification";
            }
            else{
                return "disambiguation";
            }

        }

        $scope.columnClass = $scope.result.headerAnnotations[$scope.selectedPosition.column].chosen[$scope.primaryKB];

        $scope.disableDisambCondition = $scope.selectedPosition.row != -1 && $scope.columnClass.length == 0

        //region proposal settings
        $scope.setProposal = function (proposal) {


            // Is proposal defined?
            if (proposal && $scope.cDProposeForm.$valid) {

                var url = proposal.suffixUrl;

                if (url == null || url.length == 0) {
                    url = proposal.label;
                }

                //joins alternative labels
                var alternativeLabels = [];

                if (proposal.alternativeLabel != null) {
                    alternativeLabels.push(proposal.alternativeLabel);
                }
                if (proposal.alternativeLabel2 != null) {
                    alternativeLabels.push(proposal.alternativeLabel2);
                }

                if ($scope.selectedPosition.row == -1) {

                    //object in rest api format for classes
                    var obj = {
                        "label": proposal.label,
                        "alternativeLabels": alternativeLabels,
                        "suffix": url,   //by default it is equal to proposal.label, but could be changed if needed
                        "superClass": null
                        // "superClass": proposal.superClass
                    };
                    classes(obj);
                }
                else {
                    //object in rest api format for resources
                    var obj = {
                        "label": proposal.label,
                        "alternativeLabels": alternativeLabels,
                        "suffix": url,
                        "classes": [$scope.result.headerAnnotations[$scope.selectedPosition.column].chosen[$scope.primaryKB][0].entity]
                    };
                    resources(obj);
                }
            }
        };
        //endregion

        //saves new propose class
        var classes = function (obj) {

            rest.base($scope.primaryKB).entities.classes.update(obj).exec(
                // Success, inject into the scope
                function (response) {
                    var newObj = {
                        "entity": response,
                        "score": {
                            "value": null
                        }
                    };

                    var currentClassification =  $scope.result.headerAnnotations[$scope.selectedPosition.column];
                    //adds classification into rusult
                    currentClassification.candidates[$scope.primaryKB].push(newObj);
                    currentClassification.chosen[$scope.primaryKB] = [newObj];

                    //locks cell
                    $scope.locked.tableCells[$scope.selectedPosition.row][$scope.selectedPosition.column] = 1;

                    //deletes form fields
                    $scope.proposal = {};

                    //success message
                    success();
                },
                // Error
                function (response) {
                    //because of a delayed response server
                    var info = JSON.parse(response.data);
                    fail(info);
                }
            );
        };

        //saves new propose resource
        var resources = function (obj) {
            rest.base($scope.primaryKB).entities.resources.update(obj).exec(
                function (response) {
                    var newObj = {
                        "entity": response,
                        "score": {
                            "value": null
                        }
                    };

                    var currentDisambiguation = $scope.result.cellAnnotations[$scope.selectedPosition.row][$scope.selectedPosition.column];
                    //adds disambiguation into result
                    currentDisambiguation.candidates[$scope.primaryKB].push(newObj);
                    currentDisambiguation.chosen[$scope.primaryKB] = [newObj];


                    //locks cell
                    $scope.locked.tableCells[$scope.selectedPosition.row][$scope.selectedPosition.column] = 1;

                    //deletes form fields
                    $scope.proposal = {};

                    //success message
                    success();
                },
                // Error
                function (response) {
                    var info = JSON.parse(response.data);
                    //fail message
                    fail(info);
                }
            );
        };

        //sets parameters for the alert directive
        var success = function () {
            $scope.serverResponse.type = 'success';
            $scope.serverResponse.visible = true;
            $scope.messege = "Proposed resource was successfully saved in the knowledge base";
        }
        //sets parameters for the alert directive
        var fail = function (info) {
            $scope.serverResponse.type = 'error';
            $scope.serverResponse.visible = true;
            $scope.messege = info.payload.text;
        }
    });
})();
