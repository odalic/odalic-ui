(function () {

    // Main module
    var app = angular.module('odalic-app');

    app.controller('cDProposeController', function ($scope, $uibModalInstance, rest, data) {
        $scope.selectedPosition = data.selectedPosition;
        $scope.result = data.result;
        $scope.locked = data.locked;
        $scope.primaryKB = data.primaryKB;

        //region proposal settings
        $scope.setProposal = function (proposal) {

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

            //object in result format
            var newObj = {
                "entity": {"resource": url, "label": proposal.label},
                "score": {"value": 0}
            };

            $scope.locked.tableCells[$scope.selectedPosition.row][$scope.selectedPosition.column] = 1;

            if ($scope.selectedPosition.row == -1) {

                //adds classification into rusult
                $scope.result.headerAnnotations[$scope.selectedPosition.column].candidates[$scope.primaryKB].push(newObj);
                $scope.result.headerAnnotations[$scope.selectedPosition.column].chosen[$scope.primaryKB].push(newObj);

                //object in restapi format for classes
                var obj = {
                    "label": proposal.label,
                    "alternativeLabels": alternativeLabels,
                    "suffix": url,
                    "superClass": null
                    // "superClass": proposal.superClass
                }
                classes(obj)
            }
            else {
                //adds disambiguation into result
                $scope.result.cellAnnotations[$scope.selectedPosition.row][$scope.selectedPosition.column].candidates[$scope.primaryKB].push(newObj);
                $scope.result.cellAnnotations[$scope.selectedPosition.row][$scope.selectedPosition.column].chosen[$scope.primaryKB] = [newObj]

                //object in restapi format for resources
                var obj = {
                    "label": proposal.label,
                    "alternativeLabels": alternativeLabels,
                    "suffix": url,
                    "classes": []
                    // "superClass": $scope.result.headerAnnotations[selectedPosition.column]
                }
                resources(obj)

            }

        }
        //endregion
        var classes = function (obj) {
            console.log("sends classes" + JSON.stringify(obj, null, 4));
            rest.base($scope.primaryKB).entities.classes.update(obj).exec(
                // Success, inject into the scope
                function (response) {
                },
                // Error
                function (response) {
                    alert("Something is wrong. Please, try to again.")
                }
            );
        };
        var resources = function (obj) {
            console.log("sends resource" + JSON.stringify(obj, null, 4));
            rest.base($scope.primaryKB).entities.resources.update(obj).exec(
                // Success, inject into the scope
                function (response) {
                },
                // Error
                function (response) {
                    alert("Something is wrong. Please, try to again.")
                }
            );
        };
    });


})();
