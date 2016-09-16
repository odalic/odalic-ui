"use strict"

var url = 'index.html';
var index = require('webpage').create();
index.open(url, function (status) {
	switch (status) {
		case 'fail':
			phantom.exit(1);
			break;
		case 'success':
			phantom.exit();
			break;
	}
});