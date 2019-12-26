const webpack = require('webpack');
const _CONFIG = require('./config');
const webpackConfig = require(`./webpack/${_CONFIG.filename}`);

console.log(`building for ${_CONFIG.env.mode}...`);

webpack(webpackConfig, function(err, stats) {
	if (err) {
		throw err;
	}

	if (_CONFIG.env.debug === false) {
		process.stdout.write(
			stats.toString({
				colors: true,
				modules: false,
				children: false,
				chunks: false,
				chunkModules: false
			}) + '\n\n'
		);

		console.log('  Build complete.\n');
	}
});
