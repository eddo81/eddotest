<?php
/**
 * The template for displaying all single posts.
 *
 * @package Nova
 * @author  "Daniel Andersson <daniel@bozzanova.se>"
 * @author  "Eduardo Jönnerstig <eduardo@bozzanova.se>"
 * @author  "Jon Täng <jon@bozzanova.se>"
 * @license MIT https://opensource.org/licenses/MIT
 * @link    https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 * @since   1.0.0
 */

get_header();

render_template('template-parts/partials/loop');

get_footer();
