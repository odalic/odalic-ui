(function () {

    // Main module
    var app = angular.module('odalic-app');

    app.controller('cDProposeController', function ($scope, $uibModalInstance, rest, data) {
        $scope.selectedPosition = data.selectedPosition;
        $scope.result = data.result;
        $scope.locked = data.locked;
        $scope.primaryKB = data.primaryKB;

        $scope.serverResponse= {
            type: 'success',
             visible: false
         };


        //region proposal settings
        $scope.setProposal = function (proposal) {

            if(proposal.suffixUrl == "" )
            {

            }
            if(proposal.label)
            {

            }
            //TOTO prefix kde ho vezmu co s nim?????
            var prefixUrl = "";

            var url = proposal.suffixUrl;



            //joins alternative labels
            var alternativeLabels = [];

            if (proposal.alternativeLabel != null) {
                alternativeLabels.push(proposal.alternativeLabel)
            }
            if (proposal.alternativeLabel2 != null) {
                alternativeLabels.push(proposal.alternativeLabel2)
            }


            $scope.newObj = {
                "entity": {"resource": url, "label": proposal.label},
                "score": {"value": 0}
            };
            $scope.locked.tableCells[$scope.selectedPosition.row][$scope.selectedPosition.column] = 1;

            if ($scope.selectedPosition.row == -1) {

                //object in restapi format for classes
                var obj = {
                    "label": proposal.label,
                    "alternativeLabels": alternativeLabels,
                    "suffix": url,
                    "superClass": null
                     // "superClass": proposal.superClass
                };
                classes(obj)
            }
            else {


                //object in restapi format for resources
                var obj = {
                    "label": proposal.label,
                    "alternativeLabels": alternativeLabels,
                    "suffix": url,
                    "classes": []
                    // "superClass": $scope.result.headerAnnotations[selectedPosition.column]
                };
                resources(obj)

            }

        };
        //endregion

        //saves new propose class
        var classes = function (obj) {
            var currentTimeStamp =  new Date().getTime();
            rest.base($scope.primaryKB).entities.classes.stamp(currentTimeStamp).update(obj).exec(
                // Success, inject into the scope
                function (response) {

                    //adds classification into rusult
                    $scope.result.headerAnnotations[$scope.selectedPosition.column].candidates[$scope.primaryKB].push($scope.newObj);
                    $scope.result.headerAnnotations[$scope.selectedPosition.column].chosen[$scope.primaryKB] = [$scope.newObj];

                    $scope.serverResponse.type = 'success';
                    $scope.serverResponse.visible = true;
                    $scope.messege = "Propose was saved"
                },
                // Error
                function (response) {
                    var info = JSON.parse(response.data);
                    if (currentTimeStamp.toString()==  info.stamp) {
                        $scope.serverResponse.type = 'error';
                        $scope.serverResponse.visible = true;
                        $scope.messege = info.payload.text;
                     }
                }
            );
        };

        //saves new propose resource
        var resources = function (obj) {
            var currentTimeStamp =  new Date().getTime();
            rest.base($scope.primaryKB).entities.resources.stamp(currentTimeStamp).update(obj).exec(
                function (response) {


                    $scope.serverResponse.type = 'success';
                    $scope.serverResponse.visible = true;
                    $scope.messege = "Propose was saved";
                    //adds disambiguation into result
                    $scope.result.cellAnnotations[$scope.selectedPosition.row][$scope.selectedPosition.column].candidates[$scope.primaryKB].push($scope.newObj);
                    $scope.result.cellAnnotations[$scope.selectedPosition.row][$scope.selectedPosition.column].chosen[$scope.primaryKB] = [$scope.newObj];

                },
                // Error
                function (response) {
                    var info = JSON.parse(response.data);
                    if (currentTimeStamp.toString()==  info.stamp) {
                        $scope.serverResponse.type = 'error';
                        $scope.serverResponse.visible = true;
                        $scope.messege = info.payload.text;
                    }
                }
            );
        };
    });


})();
