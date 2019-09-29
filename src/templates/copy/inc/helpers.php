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

if ( function_exists( 'get_remote_content' ) === false ) {
	/**
	 * Get remote content.
	 *
	 * @param string $url Url to fetch.
	 *
	 * @return mixed
	 */
	function get_remote_content( string $url ) {
		$data = wp_remote_get( $url );

		if ( is_wp_error( $data ) === true ) {
			return null;
		}

		$data = json_decode( wp_remote_retrieve_body( $data ) ) ?? [];
		return ( empty( $data ) === false ) ? $data : null;
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

if ( function_exists( 'get_all_image_sizes' ) === false ) {
	/**
	 * Get all the registered image sizes along with their dimensions.
	 *
	 * @global array $_wp_additional_image_sizes
	 *
	 * @link http://core.trac.wordpress.org/ticket/18947 Reference ticket.
	 *
	 * @return array $image_sizes The image sizes.
	 */
	function get_all_image_sizes() : array {
		global $_wp_additional_image_sizes;

		$default_image_sizes = get_intermediate_image_sizes();

		foreach ( $default_image_sizes as $size ) {
			$image_sizes[ $size ]['width']  = intval( get_option( "{$size}_size_w" ) );
			$image_sizes[ $size ]['height'] = intval( get_option( "{$size}_size_h" ) );
			$image_sizes[ $size ]['crop']   = get_option( "{$size}_crop" ) ? get_option( "{$size}_crop" ) : false;
		}

		if ( isset( $_wp_additional_image_sizes ) && count( $_wp_additional_image_sizes ) ) {
			$image_sizes = array_merge( $image_sizes, $_wp_additional_image_sizes );
		}

		return $image_sizes;
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

if ( function_exists( 'get_breadcrumbs' ) === false ) {
	/**
	 * Get an object containing the navigation scheme ordered from the site root to the current page.
	 *
	 * @return array
	 */
	function get_breadcrumbs() : array {
		return registry_get( 'breadcrumb' )->get_navigation_scheme();
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
