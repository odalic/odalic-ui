(function () {

    // Main module
    var app = angular.module('odalic-app');

    // Create a controller for taskconfig
    app.controller('taskresult-ctrl', function ($scope) {


        $scope.list1 = { title: 'AngularJS - Drag Me' };
        $scope.list2 = {};
        //$scope.responseText = sharedata.get("example");
        //TODO vstupni data z nahraneho souboru
        $scope.inputFile =
        {
            "columns":
            [
              {"value":"given_name"},
                { "value": "surname" },
               { "value": "number" },
            ],
            "results":
            [
              [
                 { "value": "Joe" },
                 { "value": "Schmoe" },
                 { "value": "5" },

              ],
              [
                 { "value": "Jane" },
                 { "value": "Doe" },
                 { "value": "5" },
              ],
              [
                 { "value": "bla" },
                 { "value":"blabla"},
                { "value": "5" },
              ]
            ]
        };
        
        //indicate state of form
        $scope.state = 1;

        $scope.subjectColumn = 0;

        //Function changes the values in the table according to the selected classification and disambiguation
        //table headers have -1 table index
        $scope.change = function (obj,kb) {
            if ($scope.selectedPosition.row == -1)
            {
                $scope.inputFile.columns[$scope.selectedPosition.row][$scope.selectedPosition.column][kb] = obj;;
            }
            else
            {
               
                $scope.inputFile.results[$scope.selectedPosition.row][$scope.selectedPosition.column][kb]= obj;

            }

        };

        $scope.myFunct = function () {

            if (keyEvent.which === 38)
                $scope.pokus++;

        }
        $scope.getOtherPage = function () {

            if ($scope.state == 0) {
                $scope.subjectColumn = $scope.selectedPosition.column;
            }
            if ($scope.state == 1) {
                //uloz zmeny pro klasifikaci a disambigulaci
            }
            if ($scope.state == 2) {
                //uloz zmeny pro vztahy a odesli
            }
            //presmerovani kam??

            $scope.state++;


        };



        $scope.selectPosition = function ($column, $row) {
            $scope.selectedPosition = {
                column: $column,
                row: $row
            };
        }
        $scope.initSelectionBox = function (kb)
        {
            alert(bla);
            return $scope.inputFile.results[$scope.selectedPosition.row][$scope.selectedPosition.column][kb];
        }
        //TODO  smazat vstupni data z nahraneho osuboru
        $scope.result =
            {
                "subjectColumnPosition": { "index": 3 },
                "headerAnnotations": [
                    {
                        "candidates": {
                            "dbpedia": [ // Order by the likelihood in descending order.
                                {
                                    "entity": { "resource": "http://dbpedia.name", "label": "Ble" },
                                    "likelihood": { "value": 0.5 }
                                }
                            ],
                            "wikidata":
                                [
                                {
                                    "entity": { "resource": "http://wikidata.names", label: "Ble" },
                                    "likelihood": { "value": 0.5 }
                                },
                                 {
                                     "entity": { "resource": "http://wikidata.bookes", label: "Ble" },
                                     "likelihood": { "value": 0.2 }
                                 },
                                {
                                    "entity": { "resource": "http://wikidata.films", label: "Ble" },
                                    "likelihood": { "value": 0.1 }
                                }
                                ]

                        },
                        "chosen": {
                            "dbpedia": [
                                {
                                    "entity": { "resource": "http://dbpedia.name", label: "Ble" },
                                    "likelihood": { "value": 0.5 }
                                }
                            ],
                            "wikidata":
                                [
                                {
                                    "entity": { "resource": "http://wikidata.names", label: "Ble" },
                                    "likelihood": { "value": 0.5 }
                                },
                                {
                                    "entity": { "resource": "http://wikidata.bookes", label: "Ble" },
                                    "likelihood": { "value": 0.5 }
                                }
                                ]
                        }
                    },
                      {
                          "candidates": {
                              "dbpedia": [ // Order by the likelihood in descending order.
                                  {
                                      "entity": { "resource": "http://dbpedia.surname", "label": "Ble" },
                                      "likelihood": { "value": 0.5 }
                                  }
                              ],
                              "wikidata":
                                  [
                                  {
                                      "entity": { "resource": "http://wikidata.surnames", label: "Ble" },
                                      "likelihood": { "value": 0.5 }
                                  },
                                   {
                                       "entity": { "resource": "http://wikidata.bookes", label: "Ble" },
                                       "likelihood": { "value": 0.2 }
                                   },
                                  {
                                      "entity": { "resource": "http://wikidata.films", label: "Ble" },
                                      "likelihood": { "value": 0.1 }
                                  }
                                  ]

                          },
                          "chosen": {
                              "dbpedia": [
                                  {
                                      "entity": { "resource": "http://dbpedia.surname", label: "Ble" },
                                      "likelihood": { "value": 0.5 }
                                  }
                              ],
                              "wikidata":
                                  [
                                  {
                                      "entity": { "resource": "http://wikidata.surnames", label: "Ble" },
                                      "likelihood": { "value": 0.5 }
                                  },
                                  {
                                      "entity": { "resource": "http://wikidata.bookes", label: "Ble" },
                                      "likelihood": { "value": 0.5 }
                                  }
                                  ]
                          }
                      },
                       
                     {
                         "candidates":{},
                         "chosen": {},
                     },
                     {
                         
                         "candidates":{},
                         "chosen": {},
                     }
                  
                ],
                "cellAnnotations": [
                    [ 
                        {
                            "candidates": {
                                "dbpedia": [ // Order by the likelihood in descending order.
                                    {
                                        "entity": { "resource": "http://dbpedia.Joe", "label": "Ble" },
                                        "likelihood": { "value": 0.5 }
                                    }
                                ],
                                "wikidata":
                                    [
                                    {
                                        "entity": { "resource": "http://wikidata.Joe", label: "Ble" },
                                        "likelihood": { "value": 0.5 }
                                    },
                                     {
                                         "entity": { "resource": "http://wikidata.J", label: "Ble" },
                                         "likelihood": { "value": 0.2 }
                                     }
                                    ]

                            },
                            "chosen": {
                                "dbpedia": [
                                    {
                                        "entity": { "resource": "http://dbpedia.Schmoe", label: "Ble" },
                                        "likelihood": { "value": 0.5 }
                                    } ,
                                    {
                                        "entity": { "resource": "http://dbpedia.Snow", label: "Ble" },
                                        "likelihood": { "value": 0.3 }
                                    }
                                ],
                                "wikidata":
                                    [
                                    {
                                        "entity": { "resource": "http://wikidata.Schmoe", label: "Ble" },
                                        "likelihood": { "value": 0.5 }
                                    },
                                    {
                                        "entity": { "resource": "http://wikidata.Snow", label: "Ble" },
                                        "likelihood": { "value": 0.5 }
                                    }
                                    ]
                            }
                        },
                        {
                            "candidates":{},
                            "chosen": {},
                        },
                            
                    ],
                     [ 
                        {
                            "candidates": {
                                "dbpedia": [ // Order by the likelihood in descending order.
                                    {
                                        "entity": { "resource": "http://dbpedia.Jane", "label": "Ble" },
                                        "likelihood": { "value": 0.5 }
                                    },
                                     {
                                         "entity": { "resource": "http://dbpedia.Jana", "label": "Ble" },
                                         "likelihood": { "value": 0.5 }
                                     }
                                ],
                                "wikidata":
                                    [
                                    {
                                        "entity": { "resource": "http://wikidata.Jane", label: "Ble" },
                                        "likelihood": { "value": 0.5 }
                                    },
                                     {
                                         "entity": { "resource": "http://wikidata.Jana", label: "Ble" },
                                         "likelihood": { "value": 0.2 }
                                     }
                                    ]

                            },
                            "chosen": {
                                "dbpedia": [
                                    {
                                        "entity": { "resource": "http://dbpedia.Doe", label: "Ble" },
                                        "likelihood": { "value": 0.5 }
                                    }
                                ],
                                "wikidata":
                                    [
                                    {
                                        "entity": { "resource": "http://wikidata.Srna", label: "Ble" },
                                        "likelihood": { "value": 0.5 }
                                    }
                                    ]
                            }
                        },
                        {
                            "candidates":{},
                            "chosen": {},
                        },
                            
                     ],
                     [
                          {
                              "candidates": {
                                  "dbpedia": [ // Order by the likelihood in descending order.
                                      {
                                          "entity": { "resource": "http://dbpedia.bla", "label": "Ble" },
                                          "likelihood": { "value": 0.5 }
                                      },
                                       {
                                           "entity": { "resource": "http://dbpedia.b", "label": "Ble" },
                                           "likelihood": { "value": 0.5 }
                                       }
                                  ],
                                  "wikidata":
                                      [
                                      {
                                          "entity": { "resource": "http://wikidata.bla", label: "Ble" },
                                          "likelihood": { "value": 0.5 }
                                      }
                                      ]

                              },
                              "chosen": {
                                  "dbpedia": [
                                      {
                                          "entity": { "resource": "http://dbpedia.Doe", label: "Ble" },
                                          "likelihood": { "value": 0.5 }
                                      }
                                  ],
                                  "wikidata":
                                      [
                                      {
                                          "entity": { "resource": "http://wikidata.Srna", label: "Ble" },
                                          "likelihood": { "value": 0.5 }
                                      }
                                      ]
                              }
                          },
                        {
                            "candidates":{},
                            "chosen": {},
                        },

                     ]
                ],
                "columnRelationAnnotations": {
                    "[2,3]": { }, 
                    "[1,2]": {}
                    // Same format as the header annotations.
                },
                "cellRelationAnnotations": {
                    "[2,3],[1]": {}, // Same format as the header annotations.
                    "[2,3],[2]": {}    
                }
                            
    }

    });



})();