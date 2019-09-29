const rm = require('rimraf');
const _CONFIG = require('./config');

rm(_CONFIG.resolve(_CONFIG.directories.output.assets), err => {
	if (err) {
		throw err;
	}
});
