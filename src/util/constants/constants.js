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

var alpha = 0.5;
var KBconstants = {
    get colorsArray() {
        //color palette has 10 colors ( max. 10 knowledgebases)
        //'#ff6a00', '#ffac00', 'DarkSalmon  ', 'SandyBrown ', 'Peru', 'Sienna', 'GoldenRod ', 'Tan', 'SkyBlue ', 'SteelBlue'
        return ["rgba(255, 106, 0," + alpha + ")", "rgba(255, 172, 0," + alpha + ")", "rgba(233, 150, 122," + alpha + ")", "rgba(244, 164, 196," + alpha + ")", "rgba(205, 133, 63," + alpha + ")",
                "rgba(160, 82, 45, " + alpha + ")", "rgba(218, 165, 32," + alpha + ")", "rgba(210, 180, 140, " + alpha + ")", "rgba(135, 206, 235, " + alpha + ")", "rgba(70, 130, 180, " + alpha + ")"];
    }
};