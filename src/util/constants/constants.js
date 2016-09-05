var constants = {
    get addresses() {
        return {
            get odalicroot() {
                return 'http://localhost:8080/odalic/';
            }
        }
    },
    get colors() {
        return {
            get white() {
                return '#ffffff';
            },
            get almostwhite() {
                return '#eeeeee';
            },
            get lightgrey() {
                return '#dddddd';
            },
            get grey() {
                return '#bbbbbb';
            },
            get darkgrey() {
                return '#999999';
            },
            get almostblack() {
                return '#232323';
            },
            get black() {
                return '#000000';
            },
            get yellow() {
                return '#ffd800';
            },
            get ultralightorange() {
                return '#ffeecc';
            },
            get lightorange() {
                return '#ffac00';
            },
            get orange() {
                return '#ff6a00';
            },
            get darkorange() {
                return '#ca0000';
            },
            get blue() {
                return '#1293ee';
            },
            get lightblue() {
                return '#77bff4';
            },
            get darkblue() {
                return '#0e69ae';
            }
        };
    }
};

var KBconstants = {
    get colorsArray() {
        //color palette has 10 colors ( max. 10 knowledgebases)
        return ['#ff6a00', '#ffac00', 'DarkSalmon  ', 'SandyBrown ', 'Peru', 'Sienna', 'GoldenRod ', 'Tan', 'SkyBlue ', 'SteelBlue'];
    }
};