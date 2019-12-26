const CheckSelector = function(selector) {
	return document.querySelectorAll(selector).length > 0;
};

export default CheckSelector;
