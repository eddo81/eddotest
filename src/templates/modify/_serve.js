/* eslint default-case:0 */
const _CONFIG = require('./config');
const getDirectories = require('./utils/get-directories');
let webpackConfig = require(`./webpack/${_CONFIG.filename}`);

webpackConfig.devServer = {
	open: _CONFIG.server.autoOpenBrowser,
	quiet: true,
	inline: true,
	hot: false,
	clientLogLevel: 'none',
	contentBase: [_CONFIG.resolve()].concat(
		getDirectories(_CONFIG.resolve(_CONFIG.directories.output.includes)),
		getDirectories(_CONFIG.resolve(_CONFIG.directories.output.templates))
	),
	watchContentBase: true,
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
	}
};

module.exports = webpackConfig;
