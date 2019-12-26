<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the main-tag.
 *
 * @package <%= packageName %>
 * @author  "Daniel Andersson <daniel@bozzanova.se>"
 * @author  "Eduardo Jönnerstig <eduardo@bozzanova.se>"
 * @author  "Jon Täng <jon@bozzanova.se>"
 * @license MIT https://opensource.org/licenses/MIT
 * @link    https://developer.wordpress.org/themes/basics/template-files/#template-partials
 * @since   <%= version %>
 */
?>

	</main>
		<?php render_template( 'template-parts/partials/site-footer' ); ?>
		<?php wp_footer(); ?>
	</body>
</html>