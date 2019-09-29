<?php
/**
 * The template for displaying search results pages.
 *
 * @package Nova
 * @author  "Eduardo Jönnerstig <eduardo_jonnerstig@live.com>"
 * @license MIT https://opensource.org/licenses/MIT
 * @link    https://developer.wordpress.org/themes/basics/template-hierarchy/#search-result
 * @since   1.0.0
 */

get_header(); ?>

	<section id="search">
		<h1><?= sprintf("%1s {$wp_query->found_posts} %2s", __( 'Search Results for', 'nova' ), get_search_query() ); ?></h1>
	</section>

<?php get_footer();
