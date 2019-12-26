<?php
/**
 * Shims for recent WordPress functions.
 *
 * @package Nova
 * @author  "Daniel Andersson <daniel@bozzanova.se>"
 * @author  "Eduardo Jönnerstig <eduardo@bozzanova.se>"
 * @author  "Jon Täng <jon@bozzanova.se>"
 * @license MIT https://opensource.org/licenses/MIT
 * @since   1.0.0
 */

if ( defined( 'ABSPATH' ) === false ) {
	exit;
}

/**
 * Adds backwards compatibility for wp_body_open() introduced with WordPress 5.2.
 *
 * @link https://developer.wordpress.org/reference/functions/wp_body_open/
 */
if ( ! function_exists( 'wp_body_open' ) ) {
	/**
	 * Run the wp_body_open action.
	 *
	 * @return void
	 */
	function wp_body_open() {
		do_action( 'wp_body_open' );
	}
}
