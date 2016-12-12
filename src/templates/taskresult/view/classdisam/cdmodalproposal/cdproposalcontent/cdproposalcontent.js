(function () {

    // Main module
    var app = angular.module('odalic-app');

    // lock directive
    var currentFolder = $.getPathForRelativePath('');
    app.directive('cDProposalContent', ['rest', function (rest) {
        return {
            restrict: 'E',
            scope: {
                selectedPosition: '=',
                locked: '=',
                primaryKB: '@',
                result: '='
            },
            templateUrl: currentFolder + 'cdproposalcontent.html',
            link: function ($scope, iElement, iAttrs) {

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
                    // alert(JSON.stringify(newObj));
                    //TODO spis dve funkce + opakujici se kod s sugestion
                    // if ($scope.state == 2) {
                    //     $scope.locked.graphEdges[$scope.selectedRelation.column1][$scope.selectedRelation.column2] = 1;
                    //
                    //
                    //     $scope.result.columnRelationAnnotations[$scope.selectedRelation.column1][$scope.selectedRelation.column2].candidates[$scope.primaryKB].push(newObj);
                    //     // $scope.result.columnRelationAnnotations[$scope.selectedRelation.column1][$scope.selectedRelation.column2].chosen[$scope.primaryKB] = [newObj]
                    //     $scope.currentRelations[$scope.selectedRelation.column1][$scope.selectedRelation.column2][$scope.primaryKB].push(newObj.entity)
                    //
                    //     var obj = {
                    //         "label": proposal.label,
                    //         "alternativeLabels": alternativeLabels,
                    //         "suffix": url,
                    //         "superClass": null
                    //         // "superClass": proposal.superClass
                    //     }
                    //     classes(obj)
                    // }
                    // else {
                    $scope.locked.tableCells[$scope.selectedPosition.row][$scope.selectedPosition.column] = 1;

                    if ($scope.selectedPosition.row == -1) {

                        //adds classification into rusult
                        $scope.result.headerAnnotations[$scope.selectedPosition.column].candidates[$scope.primaryKB].push(newObj);
                        $scope.result.headerAnnotations[$scope.selectedPosition.column].chosen[$scope.primaryKB]= [newObj];

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
                        $scope.result.cellAnnotations[$scope.selectedPosition.row][$scope.selectedPosition.column].chosen[$scope.primaryKB] = [newObj];

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

            }
        }
    }]);

})();
