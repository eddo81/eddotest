const _CONFIG = require('../config');
const wpPot = require('wp-pot');

wpPot({
	destFile: _CONFIG.resolve() + '/languages/nova.pot',
	domain: 'nova',
	package: 'Nova',
	src: _CONFIG.resolve() + '**/*.php'
});
