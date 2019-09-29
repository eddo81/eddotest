const _CONFIG = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const safeParser = require('postcss-safe-parser');

let webpackConfig = merge(baseWebpackConfig, {
	devtool: 'source-map',

	output: {
		chunkFilename: `${_CONFIG.directories.output.js}[name].[chunkhash].js`
	},

	plugins: [],

	optimization: {
		splitChunks: {
			name: true,
			cacheGroups: {
				/*vendor: {
          name: 'vendors',
          test: /\.(js|es6)$/i,
          chunks: 'initial',
          enforce: true
        }*/
			}
		},

		minimizer: [
			new TerserPlugin({
				cache: true,
				parallel: true,
				sourceMap: true,
				terserOptions: {
					output: { comments: false },
					compress: { warnings: false, drop_console: true },
					mangle: { reserved: ['$', 'exports', 'require'] }
				}
			}),

			new OptimizeCSSAssetsPlugin({
				cssProcessorOptions: {
					parser: safeParser,
					discardComments: {
						removeAll: true
					}
				}
			})
		],

		noEmitOnErrors: true
	}
});

module.exports = webpackConfig;
