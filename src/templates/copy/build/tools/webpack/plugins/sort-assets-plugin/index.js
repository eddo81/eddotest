'use strict';
const _PATH = require('path');
const sortChunks = require('webpack-sort-chunks').default;
const writeFile = require('../../../utils/write-file');
const extensions = {
	font: {
		regexp: /\.(woff2)$/i,
		mime: 'font/woff2',
		CORS: true
	},
	script: {
		regexp: /\.(js|es6)$/i,
		mime: 'application/javascript',
		CORS: false
	},
	style: {
		regexp: /\.css$/i,
		mime: 'text/css',
		CORS: false
	}
};

/**
 * Plugin utility functions
 */
function getSortedChunks(stats) {
	const chunks = sortChunks(stats.chunks)
		.map(chunk => chunk.files)
		.reduce((a, b) => a.concat(b), []);

	return Object.keys(stats.assetsByChunkName)
		.reduce((initialValue, currentValue) => {
			return initialValue.concat(stats.assetsByChunkName[currentValue]);
		}, [])
		.sort((a, b) => (chunks.indexOf(a) > chunks.indexOf(b) ? 1 : -1));
}

function getFiles(stats) {
	return stats.assets
		.filter(file => file.chunks.length === 0 && file.chunkNames.length === 0)
		.map(file => file.name);
}

function getAssetsByType(assets, type, entryPoints, prependPath) {
	return []
		.concat(assets)
		.filter(asset => new RegExp(type.regexp).test(asset))
		.map(asset => {
			const filePath = prependPath + asset;
			const fileExt = _PATH.extname(filePath);
			const fileName = _PATH.basename(filePath, fileExt);
			const fileHash =
				fileName.split('.').length > 1
					? fileName.split('.').reverse()[0]
					: null;

			return {
				name: fileName.replace(`.${fileHash}`, ''),
				hash: fileHash,
				extension: fileExt,
				mime: type.mime,
				crossorigin: type.CORS,
				resource_hint:
					entryPoints.includes(fileName.replace(`.${fileHash}`, '')) ||
					type.mime === 'font/woff2'
						? 'preload'
						: 'prefetch',
				path: filePath
			};
		});
}

/**
 * Plugin code
 */
class SortAssetsPlugin {
	constructor(
		options = {
			runOnce: true,
			filePath: '/asset_manifest.json',
			prependPath: ''
		}
	) {
		this.options = options;
		this.hasRun = false;
	}

	apply(compiler) {
		compiler.hooks.done.tap('SortAssetsPlugin', stats => {
			if (this.hasRun === false) {
				let assetsByType = {};
				let chunks = getSortedChunks(stats.toJson({ modules: false }));
				let files = getFiles(stats.toJson({ modules: false }));
				let assets = chunks.concat(files);
				let entryPoints = Object.keys(stats.compilation.options.entry);

				Object.keys(extensions).forEach(key => {
					assetsByType[key] = getAssetsByType(
						assets,
						extensions[key],
						entryPoints,
						this.options.prependPath
					);
				});

				writeFile(this.options.filePath, JSON.stringify(assetsByType));

				if (this.options.runOnce) {
					this.hasRun = true;
				}
			}
		});
	}
}

module.exports = SortAssetsPlugin;
