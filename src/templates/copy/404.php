<?php
/**
 * The template for displaying 404 pages (not found).
 *
 * @package Nova
 * @author  "Eduardo Jönnerstig <eduardo_jonnerstig@live.com>"
 * @license MIT https://opensource.org/licenses/MIT
 * @link    https://codex.wordpress.org/Creating_an_Error_404_Page
 * @since   1.0.0
 */

get_header(); ?>

<section id="post-404">
	<h1><?= __('Page not found', 'nova'); ?></h1>
	<p>
		<a href="<?= home_url(); ?>"><?= __('Return home?', 'nova'); ?></a>
	</p>
</section>

<?php get_footer();
