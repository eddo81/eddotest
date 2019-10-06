<?php
/**
 * Add filter code here.
 *
 * @package Nova
 * @author  "Eduardo Jönnerstig <eduardo_jonnerstig@live.com>"
 * @license MIT https://opensource.org/licenses/MIT
 * @link    https://developer.wordpress.org/reference/functions/add_filter/
 * @since   1.0.0
 */

if ( defined('ABSPATH') === false ) {
	exit;
}

add_filter( 'upload_mimes', function ( $mimes ) {
		$mimes['svg'] = 'image/svg+xml';
		return $mimes;
});

// Make custom image sizes available in Gutenberg editor.
add_filter( 'image_size_names_choose', function ( $sizes ) {
	global $_wp_additional_image_sizes;
	$custom_image_sizes = [];

	if ( ! $_wp_additional_image_sizes ) {
		return $sizes;
	}

	foreach ( $_wp_additional_image_sizes as $image_size_name => $image_size_value ) {
		if ( array_key_exists( $image_size_name, $sizes ) === true ) {
			continue;
		}
		$custom_image_sizes[ $image_size_name ] = ucfirst ( preg_replace('/(\W|_)+/im', ' ', $image_size_name ) );
	}

	return array_merge( $sizes, $custom_image_sizes );
});

add_filter( 'script_loader_tag', function ( $tag, $handle ) {
	$theme_scrips = registry_get( 'asset_manager' )->get_registered_asset_names( 'script' );

	if ( is_admin() === true || in_array( $handle, $theme_scrips, true ) === false ) {
		return $tag;
	}
	return str_replace( ' src', ' async="async" src', $tag );
}, 90, 2 );

add_filter( 'style_loader_tag', function ( $html, $handle, $href ) {
	$theme_styles = registry_get( 'asset_manager' )->get_registered_asset_names( 'style' );

	if ( is_admin() === false && in_array( $handle, $theme_styles, true ) === false ) {
		registry_get( 'asset_manager' )->set_resource_hint( 'preload', 'text/css', $href, 'style' );
	}
	return $html;
}, 999, 3 );
