const fs = require('fs');
const _PATH = require('path');

function getDirectories(srcpath) {
	function flatten(lists) {
		return lists.reduce((a, b) => a.concat(b), []);
	}

	function readDir(srcpath) {
		return fs
			.readdirSync(srcpath)
			.map(file => _PATH.normalize(_PATH.join(srcpath, file)))
			.filter(path => {
				return fs.statSync(path).isDirectory();
			});
	}

	return [srcpath, ...flatten(readDir(srcpath).map(getDirectories))];
}

module.exports = getDirectories;
