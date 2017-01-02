(function () {

    // Main module
    var app = angular.module('odalic-app');

    app.controller('cDProposeController', function ($scope, $uibModalInstance, rest, data) {
        $scope.selectedPosition = data.selectedPosition;
        $scope.result = data.result;
        $scope.locked = data.locked;
        $scope.primaryKB = data.primaryKB;

        //sets parameters for the alert directive
        $scope.serverResponse= {
            type: 'success',
            visible: false
        };

        $scope.missingColumnClass= {
            type: 'error',
            visible: true
        };

        $scope.columnClass = $scope.result.headerAnnotations[$scope.selectedPosition.column].chosen[$scope.primaryKB];
        $scope.disableDisambCondition =   $scope.selectedPosition.row != -1 &&  $scope.columnClass.length==0
        //region proposal settings
        $scope.setProposal = function (proposal) {


            // Is proposal defined?
            if (proposal) {
                //TOTO prefix kde ho vezmu co s nim?????
                var prefixUrl = "";

                var url = proposal.suffixUrl;

                //joins alternative labels
                var alternativeLabels = [];

                if (proposal.alternativeLabel != null) {
                    alternativeLabels.push(proposal.alternativeLabel);
                }
                if (proposal.alternativeLabel2 != null) {
                    alternativeLabels.push(proposal.alternativeLabel2);
                }

                $scope.newObj = {
                    "entity": {
                        "resource": url,
                        "label": proposal.label
                    },
                    "score": {
                        "value": 0
                    }
                };
                $scope.locked.tableCells[$scope.selectedPosition.row][$scope.selectedPosition.column] = 1;

                if ($scope.selectedPosition.row == -1) {

                    //object in rest api format for classes
                    var obj = {
                        "label": proposal.label,
                        "alternativeLabels": alternativeLabels,
                        "suffix": url,
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

            // Either way we close the modal upon the click
            // $uibModalInstance.close();
        };
        //endregion

        //saves new propose class
        var classes = function (obj) {
            var currentTimeStamp =  new Date().getTime();
            rest.base($scope.primaryKB).entities.classes.stamp(currentTimeStamp).update(obj).exec(
                // Success, inject into the scope
                function (response) {

                    //adds classification into result
                    $scope.result.headerAnnotations[$scope.selectedPosition.column].candidates[$scope.primaryKB].push($scope.newObj);
                    $scope.result.headerAnnotations[$scope.selectedPosition.column].chosen[$scope.primaryKB] = [$scope.newObj];

                    //success message
                    success();

                },
                // Error
                function (response) {
                    //because of a delayed response server
                    var info = JSON.parse(response.data);
                    if (currentTimeStamp.toString()==  info.stamp) {
                       fail(info);
                     }
                }
            );
        };

        //saves new propose resource
        var resources = function (obj) {
            var currentTimeStamp =  new Date().getTime();
            rest.base($scope.primaryKB).entities.resources.stamp(currentTimeStamp).update(obj).exec(
                function (response) {
                    //adds disambiguation into result
                    $scope.result.cellAnnotations[$scope.selectedPosition.row][$scope.selectedPosition.column].candidates[$scope.primaryKB].push($scope.newObj);
                    $scope.result.cellAnnotations[$scope.selectedPosition.row][$scope.selectedPosition.column].chosen[$scope.primaryKB] = [$scope.newObj];

                    //success message
                    success();
                },
                // Error
                function (response) {
                    var info = JSON.parse(response.data);
                    //because of a delayed response server
                    if (currentTimeStamp.toString()==  info.stamp) {
                        //fail message
                        fail(info);
                    }
                }
            );
        };

        //sets parameters for the alert directive
        var success = function()
        {
            $scope.serverResponse.type = 'success';
            $scope.serverResponse.visible = true;
            $scope.messege = "Propose was saved";
        }
        //sets parameters for the alert directive
        var fail = function(info)
        {
            $scope.serverResponse.type = 'error';
            $scope.serverResponse.visible = true;
            $scope.messege = info.payload.text;
        }

    });


})();
