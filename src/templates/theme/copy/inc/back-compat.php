<?php
/**
 * Backward-compatibility functions for when theme requirements are not met, this file must be parseable by PHP 5.2.
 *
 * @package <%= packageName %>
 * @author  "Daniel Andersson <daniel@bozzanova.se>"
 * @author  "Eduardo Jönnerstig <eduardo@bozzanova.se>"
 * @author  "Jon Täng <jon@bozzanova.se>"
 * @license MIT https://opensource.org/licenses/MIT
 * @since   <%= version %>
 */

namespace <%= packageName %>;

if ( defined( 'ABSPATH' ) === false ) {
	exit;
}

/**
 * Gets the message to warn the user about the theme requirements not being met.
 *
 * @return string Message to show to the user.
 */
function <%= prefix %>_get_requirements_message() {
	$incorrect_wp_version  = version_compare( MIN_WP_VERSION, get_bloginfo('version'), '>=' );
	$incorrect_php_version = version_compare( MIN_PHP_VERSION, phpversion(), '>=' );

	if ( $incorrect_wp_version && $incorrect_php_version ) {
		/* translators: 1: theme name, 2: required WP version number, 3: required PHP version number, 4: available WP version number, 5: available PHP version number */
		return sprintf( __( 'The theme "%1$s" requires at least WordPress version %2$s and PHP version %3$s. You are running versions %4$s and %5$s respectively. Please update and try again.', '<%= textDomain %>' ), THEME_NAME, MIN_WP_VERSION, MIN_PHP_VERSION, get_bloginfo('version'), phpversion() );
	}

	if ( $incorrect_wp_version ) {
		/* translators: 1: theme name, 2: required WP version number, 3: available WP version number */
		return sprintf( __( 'The theme "%1$s" requires at least WordPress version %2$s. You are running version %3$s. Please update and try again.', '<%= textDomain %>' ), THEME_NAME, MIN_WP_VERSION, get_bloginfo('version') );
	}

	if ( $incorrect_php_version ) {
		/* translators: 1: theme name, 2: required WP version number, 3: available WP version number */
		return sprintf( __( 'The theme "%1$s" requires at least PHP version %2$s. You are running version %3$s. Please update and try again.', '<%= textDomain %>' ), THEME_NAME, MIN_PHP_VERSION, phpversion() );
	}

	return '';
}

/**
 * Render theme error message.
 *
 * @param array $options The error message body.
 */
function <%= prefix %>_render_compatibility_error( $options = array() ) {
	$message = esc_html( <%= prefix %>_get_requirements_message() );
	$heading = __( 'Compatibility error', '<%= textDomain %>' );
	$title   = $heading;
	<%= prefix %>_theme_error($message, $heading, $title, $options);
}

/**
 * Prevents switching to the theme when requirements are not met, falls back to the default theme.
 */
function <%= prefix %>_switch_theme() {
	switch_theme( WP_DEFAULT_THEME );
	unset( $_GET['activated'] );
	add_action( 'admin_notices', '<%= prefix %>_upgrade_notice' );
}
add_action( 'after_switch_theme', '<%= prefix %>_switch_theme' );


/**
 * Adds a message for unsuccessful theme switch.
 *
 * Prints an update nag after an unsuccessful attempt to switch to the theme
 * when requirements are not met.
 */
function <%= prefix %>_upgrade_notice() {
	printf( '<div class="error"><p>%s</p></div>', esc_html( <%= prefix %>_get_requirements_message() ) );
}

/**
 * Prevents the Customizer / Front-end from being loaded when requirements are not met.
 */
function <%= prefix %>_customize() {
	$options = array( 'back_link' => true );
	<%= prefix %>_render_compatibility_error( $options );
}
add_action( 'load-customize.php', '<%= prefix %>_customize' );

/**
 * Prevents the Theme Preview from being loaded when requirements are not met.
 */
function <%= prefix %>_preview() {
	if ( isset( $_GET['preview'] ) ) {
		<%= prefix %>_render_compatibility_error();
	}
}
add_action( 'template_redirect', '<%= prefix %>_preview' );


/**
 * Deactivate current theme when requirements are not met, falls back to the default theme.
 */
function <%= prefix %>_init_theme() {

	if ( is_admin() ) {
		$options = array( 'back_link' => true );
		<%= prefix %>_switch_theme();
		<%= prefix %>_render_compatibility_error( $options );
	} else {
		$title   = __( 'Compatibility error', '<%= textDomain %>' );
		$message = __( 'There is a compatibility issue which is preventing this page from rendering properly.', '<%= textDomain %>' );
		<%= prefix %>_theme_error( $message, $title );
	}

}
add_action( 'init', '<%= prefix %>_init_theme' );
