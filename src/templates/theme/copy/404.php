<?php
/**
 * The template for displaying 404 pages (not found).
 *
 * @package <%= packageName %>
 * @author  "Daniel Andersson <daniel@bozzanova.se>"
 * @author  "Eduardo Jönnerstig <eduardo@bozzanova.se>"
 * @author  "Jon Täng <jon@bozzanova.se>"
 * @license MIT https://opensource.org/licenses/MIT
 * @link    https://codex.wordpress.org/Creating_an_Error_404_Page
 * @since   <%= version %>
 */

get_header(); ?>

<section id="post-404">
	<h1><?= __('Page not found', '<%= textDomain %>'); ?></h1>
	<p>
		<a href="<?= home_url(); ?>"><?= __('Return home?', '<%= textDomain %>'); ?></a>
	</p>
</section>

<?php get_footer();