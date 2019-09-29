<?php
/**
 * Setup theme.
 *
 * @package Nova
 * @author  "Eduardo Jönnerstig <eduardo_jonnerstig@live.com>"
 * @license MIT https://opensource.org/licenses/MIT
 * @link    https://developer.wordpress.org/reference/hooks/after_setup_theme/
 * @since   1.0.0
 */

if ( defined( 'ABSPATH' ) === false ) {
	exit;
}

/**
 * Theme setup
 *
 * @link https://developer.wordpress.org/reference/hooks/after_setup_theme/
 */
add_action('after_setup_theme', function () {

	/**
	 * Load theme text domain.
	 *
	 * @link https://developer.wordpress.org/reference/functions/load_theme_textdomain/
	 */
	load_theme_textdomain('nova', THEME_ROOT_URI . DIRECTORY_SEPARATOR . 'languages/');

	/**
	 * Enqueue theme scripts and styles domain.
	 *
	 * @link https://developer.wordpress.org/reference/functions/wp_enqueue_script/
	 */
	registry_get('asset_manager')->enqueue_theme_scripts_and_styles('theme');

	/**
	 * Add inline script- and style-tags to document head.
	 */
	if ( is_admin() === false ) {
		add_action( 'wp_head', function() {
			render_template( 'template-parts/partials/critical/inline-scripts' );
			render_template( 'template-parts/partials/critical/inline-styles' );
		});
	}

	/**
	 * Support navigation menus.
	 *
	 * @link https://developer.wordpress.org/reference/functions/add_theme_support/
	 */
	add_theme_support( 'menus' );

	/**
	 * Clean up markup.
	 */
	add_theme_support( 'clean-up-markup' );

	/**
	 * Disables trackbacks/pingbacks.
	 */
	add_theme_support( 'disable-trackbacks-pingbacks' );

	/**
	 * Moves all scripts to wp_footer action.
	 */
	add_theme_support( 'scripts-to-footer' );

	/**
	 * Redirects search results from /?s=query to /search/query/, converts %20 to +.
	 */
	add_theme_support( 'nice-search' );

	/**
	 * Remove version query string from all styles and scripts.
	 */
	add_theme_support( 'disable-asset-versioning' );

	/**
	 * Enable custom logo.
	 *
	 * @link https://developer.wordpress.org/themes/functionality/custom-logo/
	 */
	registry_get( 'logo' )->register_logo();

	/**
	 * Enable plugins to manage the document title.
	 *
	 * @link https://developer.wordpress.org/reference/functions/add_theme_support/#title-tag
	 */
	add_theme_support( 'title-tag' );

	/**
	 * Enable post thumbnails.
	 *
	 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
	 */
	add_theme_support( 'post-thumbnails' );

	/**
	 * Enable HTML5 markup support.
	 *
	 * @link https://developer.wordpress.org/reference/functions/add_theme_support/#html5
	 */
	add_theme_support( 'html5', ['caption', 'comment-form', 'comment-list', 'gallery', 'search-form'] );

	/**
	 * Manually select Post Formats to be supported.
	 *
	 * @link https://developer.wordpress.org/themes/functionality/post-formats/
	 */
	add_theme_support( 'post-formats', ['aside', 'gallery', 'link', 'image', 'quote', 'status', 'video', 'audio', 'chat'] );

	/**
	 * Enable selective refresh for widgets in customizer.
	 *
	 * @link https://developer.wordpress.org/themes/advanced-topics/customizer-api/#theme-support-in-sidebars
	 */
	add_theme_support( 'customize-selective-refresh-widgets' );

	/**
	 * Support default editor block styles.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/extensibility/theme-support/
	 */
	add_theme_support( 'wp-block-styles' );

	/**
	 * Support wide alignment for editor blocks.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/extensibility/theme-support/
	 */
	add_theme_support( 'align-wide' );

	/**
	 * Add custom image sizes.
	 *
	 * @link https://developer.wordpress.org/reference/functions/add_image_size/
	 */
	add_image_size( __( 'full-width', 'nova' ), 2560, 9999, false );
	add_image_size( __( 'hero', 'nova' ), 1600, 500, true );

	/**
	 * Add FontAwesome SVG sprites.
	 */
	add_action( 'wp_footer', function() {
		render_template('template-parts/partials/critical/svg-sprites');
	});

}, 20 );
