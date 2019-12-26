<?php
/**
 * The template for displaying all single posts.
 *
 * @package <%= packageName %>
 * @author  "Daniel Andersson <daniel@bozzanova.se>"
 * @author  "Eduardo Jönnerstig <eduardo@bozzanova.se>"
 * @author  "Jon Täng <jon@bozzanova.se>"
 * @license MIT https://opensource.org/licenses/MIT
 * @link    https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 * @since   <%= version %>
 */

get_header();

render_template('template-parts/partials/loop');

get_footer();
