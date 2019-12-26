const _PATH = require('path');
const _ROOT = `${_PATH.resolve(_PATH.join(__dirname, '../../../../'))}/`;

function resolve(dir = '') {
	return _PATH.join(_ROOT, dir);
}

module.exports = resolve;
