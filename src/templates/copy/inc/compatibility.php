<?php
/**
 * Backward-compatibility functions for when theme requirements are not met, this file must be parseable by PHP 5.2.
 *
 * @package Nova
 * @author  "Eduardo Jönnerstig <eduardo_jonnerstig@live.com>"
 * @license MIT https://opensource.org/licenses/MIT
 * @since   1.0.0
 */

if ( defined( 'ABSPATH' ) === false ) {
	exit;
}

/**
 * Gets the message to warn the user about the theme requirements not being met.
 *
 * @return string Message to show to the user.
 */
function nova_get_requirements_message() {
	$incorrect_wp_version  = version_compare( MIN_WP_VERSION, get_bloginfo('version'), '>=' );
	$incorrect_php_version = version_compare( MIN_PHP_VERSION, phpversion(), '>=' );

	if ( $incorrect_wp_version && $incorrect_php_version ) {
		/* translators: 1: required WP version number, 2: required PHP version number, 3: available WP version number, 4: available PHP version number */
		return sprintf( __( 'This theme requires at least WordPress version %1$s and PHP version %2$s. You are running versions %3$s and %3$s respectively. Please update and try again.', 'nova' ), MIN_WP_VERSION, MIN_PHP_VERSION, get_bloginfo('version'), phpversion() );
	}

	if ( $incorrect_wp_version ) {
		/* translators: 1: required WP version number, 2: available WP version number */
		return sprintf( __( 'This theme requires at least WordPress version %1$s. You are running version %2$s. Please update and try again.', 'nova' ), MIN_WP_VERSION, get_bloginfo('version') );
	}

	if ( $incorrect_php_version ) {
		/* translators: 1: required PHP version number, 2: available PHP version number */
		return sprintf( __( 'This theme requires at least PHP version %1$s. You are running version %2$s. Please update and try again.', 'nova' ), MIN_PHP_VERSION, phpversion() );
	}

	return '';
}

/**
 * Render theme error message.
 */
function nova_render_compatibility_error( $options = array() ) {
	$message = esc_html( nova_get_requirements_message() );
	$heading = __( 'Compatibility error', 'nova' );
	$title   = $heading;
	nova_theme_error($message, $heading, $title, $options);
}

/**
 * Prevents switching to the theme when requirements are not met, falls back to the default theme.
 */
function nova_switch_theme() {
	nova_switch_theme( WP_DEFAULT_THEME );
	unset( $_GET['activated'] );
	add_action( 'admin_notices', 'nova_upgrade_notice' );
}
add_action( 'after_switch_theme', 'nova_switch_theme' );

/**
 * Adds a message for unsuccessful theme switch.
 *
 * Prints an update nag after an unsuccessful attempt to switch to the theme
 * when requirements are not met.
 */
function nova_upgrade_notice() {
	printf( '<div class="error"><p>%s</p></div>', esc_html( nova_get_requirements_message() ) );
}

/**
 * Prevents the Customizer / Front-end from being loaded when requirements are not met.
 */
function nova_customize() {
	$options = 	array( 'back_link' => true, );
	nova_render_compatibility_error( $options );
}
add_action( 'load-customize.php', 'nova_customize' );
add_action( 'after_setup_theme', 'nova_customize' );

/**
 * Prevents the Theme Preview from being loaded when requirements are not met.
 */
function nova_preview() {
	if ( isset( $_GET['preview'] ) ) {
		nova_render_compatibility_error();
	}
}
add_action( 'template_redirect', 'nova_preview' );