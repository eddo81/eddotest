import 'object-fit-images';

export default (function ObjectFit() {
	if ('objectFit' in document.documentElement.style !== false) {
		import(
			'object-fit-images'
			/* webpackChunkName: "[request]" */
			/* webpackPrefetch: true */
		);
	}
})();
