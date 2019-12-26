<section>
	<?php if ( have_posts() ) : ?>
		<?php while ( have_posts() ) : ?>
			<?php the_post(); ?>

			<article>
				<?= get_the_post_thumbnail( 'medium' ); ?>
					<h1><?= get_the_title(); ?></h1>
				<?= the_content(); ?>
			</article>

		<?php endwhile; ?>
	<?php endif; ?>
</section>
