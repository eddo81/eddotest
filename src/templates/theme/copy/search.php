<?php
/**
 * The template for displaying search results pages.
 *
 * @package <%= packageName %>
 * @author  "Daniel Andersson <daniel@bozzanova.se>"
 * @author  "Eduardo Jönnerstig <eduardo@bozzanova.se>"
 * @author  "Jon Täng <jon@bozzanova.se>"
 * @license MIT https://opensource.org/licenses/MIT
 * @link    https://developer.wordpress.org/themes/basics/template-hierarchy/#search-result
 * @since   <%= version %>
 */

namespace App;

use function get_footer;
use function get_header;
use function get_search_query;

get_header(); ?>

	<section id="search">
		<h1><?= sprintf("%1s {$wp_query->found_posts} %2s", __( 'Search Results for', '<%= textDomain %>' ), get_search_query() ); ?></h1>
	</section>

<?php get_footer();
