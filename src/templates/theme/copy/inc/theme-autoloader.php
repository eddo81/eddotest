<?php
/**
 * This file handles the autoloading of theme dependencies via composer.
 *
 * @package <%= packageName %>
 * @author  "Daniel Andersson <daniel@bozzanova.se>"
 * @author  "Eduardo Jönnerstig <eduardo@bozzanova.se>"
 * @author  "Jon Täng <jon@bozzanova.se>"
 * @license MIT https://opensource.org/licenses/MIT
 * @link    https://getcomposer.org/doc/
 * @since   <%= version %>
 */

namespace THEME_NAMESPACE;

// Path to composer autoloader.
$composer = THEME_ROOT_URI . '/vendor/autoload.php';

// Ensure dependencies are loaded.
if ( class_exists( 'Nova\\Core\\Registry' ) === false ) {
	if ( file_exists( $composer ) === false ) {
		theme_error(
			sprintf(
				"<code>{$composer}</code><br><br>%1s <code>%2s</code> %3s",
				__( 'Please run the', '<%= textDomain %>' ),
				__( 'composer install', '<%= textDomain %>' ),
				__( 'command from the theme root directory.', '<%= textDomain %>' )
			),
			__( 'Autoloader not found.', '<%= textDomain %>' ),
			__( 'Dependency management error', '<%= textDomain %>' )
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
				__( 'Registry class missing', '<%= textDomain %>' )
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
				__( 'Failed to store key in registry', '<%= textDomain %>' )
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
				__( 'File not found.', '<%= textDomain %>' )
			);
		}
	},
	['shims', 'helpers', 'setup', 'filters', 'admin']
);
