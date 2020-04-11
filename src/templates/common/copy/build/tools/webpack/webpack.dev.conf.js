const _CONFIG = require('../config');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const WriteFilePlugin = require('write-file-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

let webpackConfig = merge(baseWebpackConfig, {
	devtool: 'cheap-module-eval-source-map',

	watch: true,

	output: {
		chunkFilename: `${_CONFIG.directories.output.js}[name].js`,
		pathinfo: true
	},

	plugins: [
		// https://github.com/glenjamin/webpack-hot-middleware#installation--usage
		new webpack.optimize.OccurrenceOrderPlugin(),
		new FriendlyErrorsPlugin(),
		new WriteFilePlugin()
	]
});

module.exports = webpackConfig;
