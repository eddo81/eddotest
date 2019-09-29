const _PATH = require('path');
const _RESOLVE = require('../utils/resolve');
const _PKG = require(`../../../package.json`);
const _EXTENSIONS = require('./extensions');
const _ENV = new (function() {
	this.debug =
		(process.env.NODE_ENV || 'development').trim().toLowerCase() !==
		'production'
			? true
			: false;
	this.mode = this.debug === true ? '"development"' : '"production"';
})();

const _DIRECTORIES = {
	root: _RESOLVE(),

	entry: new (function() {
		// Root
		this.build = 'build/';
		this.tools = `${this.build}tools/`;

		// Tools
		this.webpack = `${this.tools}webpack/`;
		this.plugins = `${this.webpack}plugins/`;

		// Assets
		this.images = `${this.build}images/`;
		this.media = `${this.build}media/`;
		this.fonts = `${this.build}fonts/`;
		this.scripts = `${this.build}scripts/`;
		this.scss = `${this.build}scss/`;
		this.static = `${this.build}static/`;
		this.icons = `${this.static}img/icons/`;
	})(),

	output: new (function() {
		this.assets = `assets/`;
		this.includes = `inc/`;
		this.templates = `template-parts/`;
		this.js = `js/`;
		this.css = `css/`;
		this.media = `media/`;
		this.fonts = `fonts/`;
		this.images = `img/`;
		this.icons = `${this.images}icons/`;
	})()
};

const _SERVER = new (function() {
	this.theme_dir_name = _PATH.basename(
		_PATH.dirname(_RESOLVE(_DIRECTORIES.entry.build))
	);
	this.autoOpenBrowser = false;
	this.port = 3000;
	this.host = `http://localhost:${this.port}`;
	this.dev_url = `http://dev.nova.bozzanova.net`;
	this.public_path = `${_ENV.debug ? this.dev_url : ``}/wp-content/themes/${this.theme_dir_name}/${_DIRECTORIES.output.assets}`;
})();

const _CONFIG = {
	env: _ENV,
	directories: _DIRECTORIES,
	filename: `webpack.${_ENV.debug ? 'dev' : 'prod'}.conf.js`,
	extensions: _EXTENSIONS,
	package: _PKG,
	server: _SERVER,
	resolve: _RESOLVE
};

module.exports = _CONFIG;
