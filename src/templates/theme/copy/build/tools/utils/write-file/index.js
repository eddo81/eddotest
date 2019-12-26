const _WRITE = require('write');

function writeFile(filePath, fileContents) {
	_WRITE.sync(filePath, fileContents, error => {
		if (error) {
			throw error;
		}
	});
}

module.exports = writeFile;
