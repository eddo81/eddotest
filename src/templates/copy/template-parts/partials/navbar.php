<nav class="navbar" role="navigation" aria-label="Primary navigation">
	<?php if ( $primary_menu ) : ?>
		<ul role="menubar">
			<?php foreach ( $primary_menu as $menu_item ) : ?>
				<li role="none" class="<?= $menu_item['classes']; ?>">
					<a href="<?= $menu_item['url']; ?>" role="menuitem"><?= $menu_item['title']; ?></a>
				</li>
			<?php endforeach; ?>
		</ul>
	<?php endif; ?>
</nav>

<?php $logo = get_logo(); ?>
<img src="<?= $logo['src']; ?>" alt="<?= $logo['alt']; ?>" width="<?= $logo['width']; ?>" height="<?= $logo['height']; ?>" />
