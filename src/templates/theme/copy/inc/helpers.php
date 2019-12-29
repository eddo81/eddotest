<?php
/**
 * Theme helper functions.
 *
 * @package <%= packageName %>
 * @author  "Daniel Andersson <daniel@bozzanova.se>"
 * @author  "Eduardo Jönnerstig <eduardo@bozzanova.se>"
 * @author  "Jon Täng <jon@bozzanova.se>"
 * @license MIT https://opensource.org/licenses/MIT
 * @since   <%= version %>
 */

namespace THEME_NAMESPACE;

if ( defined( 'ABSPATH' ) === false ) {
	exit;
}

if ( function_exists( 'get_template' ) === false ) {
	/**
	 * Returns the template file as a string. Data is bound to the template via the optional ***$vars*** array.
	 * Each key of the associative ***$vars*** array will correspond to a variable that will be available in the template.
	 *
	 * @param string $template_path Path to the template file.
	 * @param array  $vars Optional template variables.
	 *
	 * @return void
	 */
	function get_template( $template_path, array $vars = [] ) : void {
		registry_get( 'template' )->get( $template_path, $vars );
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
