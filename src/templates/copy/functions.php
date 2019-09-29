<?php
/**
 * Nova functions and definitions.
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

// Path to composer autoloader.
$composer = THEME_ROOT_URI . '/vendor/autoload.php';

/**
 * Helper function for prettying up errors.
 *
 * @param string $message The error message body.
 * @param string $heading The error message heading.
 * @param string $title The page title.
 *
 * @return void
 */
function theme_error( $message, $heading = '', $title = '' ) : void {
	$title   = $title ?: __( 'Theme error', 'nova' );
	$message = "<h1>{$heading}</h1><br><br>{$message}";
	wp_die($message, $title);
};

// Ensure compatible version of PHP is used.
if ( version_compare( MIN_PHP_VERSION, phpversion(), '>=' ) === true ) {
	theme_error(
		__( 'You must be using PHP version:', 'nova' ) . ' ' . MIN_PHP_VERSION . ' ' . __( 'or greater.', 'nova' ),
		__( 'Invalid PHP version.', 'nova' ),
		__( 'PHP version error', 'nova' )
	);
}

// Ensure compatible version of WordPress is used.
if ( version_compare( MIN_WP_VERSION, get_bloginfo('version'), '>=' ) === true ) {
	theme_error(
		__( 'You must be using WordPress version:', 'nova' ) . ' ' . MIN_WP_VERSION . ' ' . __( 'or greater.', 'nova' ),
		__( 'Invalid WordPress version.', 'nova' ),
		__( 'WordPress version error', 'nova' )
	);
}

// Ensure dependencies are loaded.
if ( class_exists( 'Nova\\Core\\Registry' ) === false ) {
	if ( file_exists( $composer ) === false ) {
		theme_error(
			sprintf(
				"<code>{$composer}</code><br><br>%1s <code>%2s</code> %3s",
				__( 'Please run the', 'nova' ),
				__( 'composer install', 'nova' ),
				__( 'command from the theme root directory.', 'nova' )
			),
			__( 'Autoloader not found.', 'nova' ),
			__( 'Dependency management error', 'nova' )
		);
	}
	include_once $composer;
}

if ( function_exists( 'registry_get' ) === false ) {
	/**
	 * Get a value from the registry.
	 *
	 * @param string $key Name of key in regisistry to fetch.
	 *
	 * @return string|object|array
	 */
	function registry_get( string $key ) {
		try {
			return Nova\Core\Registry::get( $key );
		} catch ( Exception $e ) {
			theme_error(
				$e->getMessage(),
				__( 'Registry class missing', 'nova' )
			);
		}
	}
}

if ( function_exists( 'registry_set' ) === false ) {
	/**
	 * Store a value in the registry.
	 *
	 * @param string $key Name of key in regisistry to set.
	 * @param mixed  $value The value to store in registry.
	 *
	 * @return void
	 */
	function registry_set( string $key, $value ) : void {
		try {
			Nova\Core\Registry::set( $key, $value );
		} catch ( Exception $e ) {
			theme_error(
				$e->getMessage(),
				__( 'Failed to store key in registry', 'nova' )
			);
		}
	}
}

/*
 * Theme required files.
 *
 * The mapped array determines the code library included in your theme.
 * Add or remove files to the array as needed.
 */

array_map(
	function ( $file ) {
		$file = "./inc/{$file}.php";
		if ( locate_template( $file, true, true ) === false ) {
			theme_error(
				"<code>{$file}</code><br><br>",
				__( 'File not found.', 'nova' )
			);
		}
	},
	['helpers', 'registry', 'setup', 'filters', 'admin']
);
