function LoadModule(module, condition = true) {
	if (condition === false) {
		return;
	}

	import(
		`./${module}`
		/* webpackChunkName: "[request]" */
		/* webpackPrefetch: true */
	)
		.then(module => {
			module.default();
		})
		.catch(error => {
			// eslint-disable-next-line
			console.log(error);
		});
}

export default LoadModule;
