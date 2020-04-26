/* eslint default-case:0 */
const _CONFIG = require('./config');
const chokidar = require('chokidar');
let webpackConfig = require(`./webpack/${_CONFIG.filename}`);

webpackConfig.devServer = {
	open: _CONFIG.server.autoOpenBrowser,
	quiet: true,
	inline: true,
	hot: false,
	clientLogLevel: 'none',
	headers: {
		'Access-Control-Allow-Origin': '*'
	},
	port: _CONFIG.server.port,
	host: '0.0.0.0',
	disableHostCheck: true,
	proxy: {
		'/': {
			target: _CONFIG.server.dev_url,
			changeOrigin: false,
			secure: false
		}
	},
	before(app, server) {
	const files = ['**/*.php'];

	chokidar
		.watch(files, {
			alwaysStat: true,
			atomic: false,
			followSymlinks: false,
			ignoreInitial: true,
			ignorePermissionErrors: true,
			persistent: true,
			usePolling: true
		})
		.on('all', () => {
			server.sockWrite(server.sockets, 'content-changed');
		});
	}
};

module.exports = webpackConfig;
