<?php
/**
 * Theme helper functions.
 *
 * @package Nova
 * @author  "Eduardo Jönnerstig <eduardo_jonnerstig@live.com>"
 * @license MIT https://opensource.org/licenses/MIT
 * @since   1.0.0
 */

if ( defined( 'ABSPATH' ) === false ) {
	exit;
}

if ( function_exists( 'uri_to_url' ) === false ) {
	/**
	 * Convert theme uri to a url.
	 *
	 * @param string $uri Uri to convert.
	 *
	 * @return string
	 */
	function uri_to_url( string $uri ) : string {
		return str_replace(THEME_ROOT_URI, THEME_ROOT_URL, $uri);
	}
}

if ( function_exists( 'render_template' ) === false ) {
	/**
	 * Like ***get_template_part()*** but lets you pass args to the template file.
	 * Args are available in the template as regular variables named after their
	 * corresponding key in the ***$vars*** array.
	 *
	 * @param string $template_path Path to the template file.
	 * @param array  $vars Optional template variables.
	 *
	 * @return void
	 */
	function render_template( $template_path, array $vars = [] ) : void {
		registry_get( 'template' )->render( $template_path, $vars );
	}
}

if ( function_exists( 'get_theme_menu' ) === false ) {
	/**
	 * Get an object containing all menu items of a given menu location.
	 *
	 * @param string $menu_location Name of the menu.
	 * @param int    $limit Limit the number of menu items, defaults to 0.
	 *
	 * @return array
	 */
	function get_theme_menu( string $menu_location, int $limit = 0 ) : array {
		return registry_get( 'theme_menu' )->get_menu_by_location( $menu_location, $limit );
	}
}

if ( function_exists( 'get_logo' ) === false ) {
	/**
	 * Get an object containing the attributes for the custom logo.
	 *
	 * @return array
	 */
	function get_logo() : array {
		return registry_get( 'logo' )->get_custom_logo();
	}
}
