<?php
/**
 * This file handles the autoloading of theme dependencies via composer.
 *
 * @package Nova
 * @author  "Eduardo Jönnerstig <eduardo_jonnerstig@live.com>"
 * @license MIT https://opensource.org/licenses/MIT
 * @link https://getcomposer.org/doc/
 * @since   1.0.0
 */

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
		$file = THEME_ROOT_URI . "/inc/required/{$file}.php";
		if ( locate_template( $file, true, true ) === false ) {
			theme_error(
				"<code>{$file}</code><br><br>",
				__( 'File not found.', 'nova' )
			);
		}
	},
	['helpers', 'registry', 'setup', 'filters', 'admin']
);
