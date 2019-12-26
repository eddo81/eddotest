const _CONFIG = require('../config');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SortAssetsPlugin = require('./plugins/sort-assets-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');<% if(scss !== false) { %>
const Sass = require('sass');<% } %> <% if(vue !== false) { %>
const VueLoaderPlugin = require("vue-loader/lib/plugin");<% } %>

let baseConfig = {
	mode: JSON.parse(_CONFIG.env.mode),

	entry: {
		theme: [
			_CONFIG.resolve(`${_CONFIG.directories.entry.scripts}/`),
			_CONFIG.resolve(`${_CONFIG.directories.entry.styles}/index.<%= styles %>`)
		]
	},

	output: {
		path: _CONFIG.resolve(_CONFIG.directories.output.assets),
		filename: `${_CONFIG.directories.output.js}[name]${
			_CONFIG.env.debug ? '' : '.[chunkhash]'
		}.js`,
		publicPath: _CONFIG.server.public_path
	},

	resolve: {
		extensions: ['.css',<% if(scss !== false) { %>'.scss',<% } %>'.js',<% if(vue !== false) { %>'.vue',<% } %> '.json'],
		alias: {<% if(vue !== false) { %>
      vue$: _CONFIG.env.debug
      ? "vue/dist/vue.runtime.js"
      : "vue/dist/vue.runtime.min.js",<% } %>
			assets: _CONFIG.resolve(_CONFIG.directories.entry.build)
		}
	},

	module: {
		rules: [
			{
				test: new RegExp(`${_CONFIG.extensions.js.source}`),
				loader: 'eslint-loader',
				enforce: 'pre',
				include: [_CONFIG.resolve(_CONFIG.directories.entry.scripts)]
			},

			{
				test: new RegExp(
					`${_CONFIG.extensions.js.source}<% if(scss !== false) { %>|${_CONFIG.extensions.scss.source}<% } %>`
				),
				loader: 'import-glob',
				enforce: 'pre',
				include: [_CONFIG.resolve(_CONFIG.directories.entry.build)]
      },
      <% if(vue !== false) { %>
      {
				test: _CONFIG.extensions.vue,
				loader: "vue-loader"
			},<% } %>

			{
				test: _CONFIG.extensions.js,
				exclude: /node_modules/,
				loaders: ['babel-loader'],
				include: [_CONFIG.resolve(_CONFIG.directories.entry.scripts)]
			},

			{
				test: _CONFIG.extensions.images,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: `${_CONFIG.directories.output.images}[name].[ext]`
				}
			},

			{
				test: _CONFIG.extensions.media,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: `${_CONFIG.directories.output.media}[name].[ext]`
				}
			},

			{
				test: _CONFIG.extensions.fonts,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: `${_CONFIG.directories.output.fonts}[name].[ext]`
				}
			},

			{
				test: _CONFIG.extensions.css,
				use: [
					{
						loader: <% if(vue !== false) { %>_CONFIG.env.debug ? "vue-style-loader" : MiniCssExtractPlugin.loader<% } else { %>MiniCssExtractPlugin.loader<% } %>
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'postcss-loader'
					}
        ]
			},<% if(scss !== false) { %>

			{
				test: _CONFIG.extensions.scss,
				use: [
					{
						loader: <% if(vue !== false) { %>_CONFIG.env.debug ? "vue-style-loader" : MiniCssExtractPlugin.loader<% } else { %>MiniCssExtractPlugin.loader<% } %>
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'postcss-loader'
					},
					{
						loader: 'sass-loader',
						options: {
							implementation: Sass
						}
          }<% if(vue !== false) { %>,
          {
						loader: "sass-resources-loader",
						options: {
							sourceMap: true,
							resources: _CONFIG.resolve(
								`${_CONFIG.directories.entry.styles}resources/variables/_variables.scss`
							)
						}
					}<% } %>
				]
			}<% } %>
		]
	},

	externals: {<% if(jquery !== false) { %>
		jquery: 'jQuery'<% } %>
	},

	plugins: [
		new webpack.DefinePlugin({
			'process.env': { NODE_ENV: _CONFIG.env.mode }
    }),
    <% if(vue !== false) { %>
    new VueLoaderPlugin(),<% } %>

		new webpack.ProvidePlugin({<% if(jquery !== false) { %>
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',<% } %>
			Popper: 'popper.js/dist/umd/popper.js'
		}),

		new MiniCssExtractPlugin({
			filename: `${_CONFIG.directories.output.css}[name]${
				_CONFIG.env.debug ? '' : '.[contenthash]'
			}.css`,
			chunkFilename: '[id].[contenthash].css'
		}),

		new CopyWebpackPlugin([
			{
				from: _CONFIG.resolve(
					_CONFIG.directories.entry.static.replace(/\/$/, '')
				),
				to: '',
				ignore: ['.*']
			}
		]),

		new SortAssetsPlugin({
			runOnce: false,
			filePath: _CONFIG.resolve(
				`${_CONFIG.directories.output.assets}asset_manifest.json`
			),
			prependPath: `/${_CONFIG.directories.output.assets}`
		})
	]
};

module.exports = baseConfig;
