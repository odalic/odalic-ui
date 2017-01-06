(function () {

    // Main module
    var app = angular.module('odalic-app');

    app.controller('rProposeController', function ($scope, $uibModalInstance, rest, data) {
        $scope.selectedRelation = data.selectedRelation;
        $scope.result = data.result;
        $scope.locked = data.locked;
        $scope.primaryKB = data.primaryKB;
        $scope.gvdata = data.gvdata;

        //sets parameters for the alert directive
        $scope.serverResponse= {
            type: 'success',
            visible: false
        };

        //region proposal settings
        $scope.setProposal = function (proposal) {

            // Is proposal defined?
            if (proposal) {

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


                //object in rest api format for classes
                var obj = {
                    "label": proposal.label,
                    "alternativeLabels": alternativeLabels,
                    "suffix": url,
                    "superClass": null
                    // "superClass": proposal.superClass
                };
                properties(obj);

            }


        };
        //endregion

        //saves new propose properties
        var properties = function (obj) {
            rest.base($scope.primaryKB).entities.properties.update(obj).exec(
                // Success, inject into the scope
                function (response) {

                    var edge = $scope.result.cellAnnotations[$scope.selectedRelation.row][$scope.selectedRelation.column];

                    //adds classification into result
                    edge.candidates[$scope.primaryKB].push($scope.newObj);
                    edge.chosen[$scope.primaryKB] = [$scope.newObj];
                    $scope.gvdata.mc();

                    //locks
                    $scope.locked.graphEdges[$scope.selectedRelation.row][$scope.selectedRelation.column] = 1;
                    $scope.gvdata.update();

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

        //sets parameters for the alert directive
        var success = function () {
            $scope.serverResponse.type = 'success';
            $scope.serverResponse.visible = true;
            $scope.messege = "Propose was saved";
        }
        //sets parameters for the alert directive
        var fail = function (info) {
            $scope.serverResponse.type = 'error';
            $scope.serverResponse.visible = true;
            $scope.messege = info.payload.text;
        }

    });


})();
