/** Constants used throughout the application */
var constants = (function() {
    // Load certain constants from a configuration file synchronously
    var configurables = {};
    $.ajax({
        async: false,
        type: 'GET',
        url: 'config.txt',
        success: function (response) {
            configurables = iniparser.parse(response);
        },
        error: function (response) {
            throw new Error('Fatal error: Configuration file could not have been loaded.');
            console.error(response);
        },
        dataType: 'text'
    });

    return {
        get configurables() {
            return configurables;
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
        },
        get formats() {
            return {
                get date() {
                    return new String('yyyy-MM-dd HH:mm');
                }
            }
        },
        get kbColorsArray() {
            var alpha = 0.5;
            return [
                "rgba(255, 106, 0," + alpha + ")",
                "rgba(255, 172, 0," + alpha + ")",
                "rgba(233, 150, 122," + alpha + ")",
                "rgba(244, 164, 196," + alpha + ")",
                "rgba(205, 133, 63," + alpha + ")",
                "rgba(160, 82, 45, " + alpha + ")",
                "rgba(218, 165, 32," + alpha + ")",
                "rgba(210, 180, 140, " + alpha + ")",
                "rgba(135, 206, 235, " + alpha + ")",
                "rgba(70, 130, 180, " + alpha + ")"
            ];
        }
    }
})();