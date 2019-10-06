<?php
/**
 * Theme functions and definitions, this file must be parseable by PHP 5.2.
 *
 * @package Nova
 * @author  "Eduardo Jönnerstig <eduardo_jonnerstig@live.com>"
 * @license MIT https://opensource.org/licenses/MIT
 * @link    https://developer.wordpress.org/themes/basics/theme-functions/
 * @since   1.0.0
 */

// Define theme wide control variables.
define( 'MIN_PHP_VERSION', '7.1' );
define( 'MIN_WP_VERSION', '4.7.0' );

// Define theme wide paths.
define( 'THEME_ROOT_URL', get_template_directory_uri() );
define( 'THEME_ROOT_URI', get_template_directory() );
define( 'THEME_ASSETS_URI', THEME_ROOT_URI . DIRECTORY_SEPARATOR . 'assets' );
define( 'THEME_SCRIPT_URI', THEME_ASSETS_URI . DIRECTORY_SEPARATOR . 'js' );
define( 'THEME_STYLE_URI', THEME_ASSETS_URI . DIRECTORY_SEPARATOR . 'css' );

// Disable theme editor in admin.
define( 'DISALLOW_FILE_EDIT', true );

if ( function_exists( 'nova_theme_error' ) === false ) {
	/**
	 * Helper function for prettying up errors.
	 *
	 * @param string $message The error message body.
	 * @param string $heading The error message heading.
	 * @param string $title The page title.
	 * @param array  $options Optinal arguments array.
	 *
	 */
	function nova_theme_error( $message, $heading = '', $title = '', $options = array() ) {
		$title   = $title ?: __( 'Theme error', 'nova' );
		$heading = ( $heading ) ? $heading : $title;
		$message = "<h1>{$heading}</h1><br><br>{$message}";
		wp_die($message, $title, $options);
	};
}

// Theme compatibility check, bail early if requirements are not met.
if ( version_compare( MIN_PHP_VERSION, phpversion(), '>=' ) === true || version_compare( MIN_WP_VERSION, get_bloginfo('version'), '>=' ) === true ) {
	require THEME_ROOT_URI . '/inc/compatibility.php';
	return;
}

// Setup autoloader.
include_once THEME_ROOT_URI . '/inc/autoloader.php';
