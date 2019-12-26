<?php

namespace App\Core;

/**
 * Class Menu
 *
 * @package App
 * @author "eddo81 <eduardo_jonnerstig@live.com>"
 * @license MIT https://opensource.org/licenses/MIT
 * @since   1.0.0
 */
class Menu {
	/**
	 * Control variable for storing registered menu locations.
	 *
	 * @var array
	 */
	private $locations = [];

	/**
	 * Constructor.
	 *
	 * @param array $menus Associative array of menu locations.
	 */
	public function __construct( array $menus = [] ) {
		$this->locations = $menus;

		add_action( 'after_setup_theme', function() {
			$this->register_theme_menus();
		});
	}

	/**
	 * Register theme menus.
	 *
	 * @return void
	 */
	private function register_theme_menus() : void {
		foreach ( $this->locations as $menu_slug => $menu_description ) {
			if ( $menu_slug && $menu_description ) {
				register_nav_menu( (string) $menu_slug, (string) $menu_description );
			}
		}
	}

	/**
	 * Get menu by location.
	 *
	 * @param string $location_name The name of the menu location.
	 * @param int    $limit Limit the number of menu items.
	 *
	 * @return array
	 */
	public function get_menu_by_location( string $location_name, int $limit = 0 ) : array {
		$menu_locations     = get_nav_menu_locations();
		$array_menu         = array_key_exists($location_name, $menu_locations) ? wp_get_nav_menu_items(get_term( $menu_locations[ $location_name ], 'nav_menu')->name ) : null;
		$menu               = [];
		$sub_menu           = [];
		$current_page_title = ( is_archive() ) ? strtolower( post_type_archive_title( '', false ) ) : strtolower(get_the_title() );

		if ( is_array( $array_menu ) ) {
			foreach ( $array_menu as $m ) {
				if ( $m->menu_item_parent ) {
					if ( ! array_key_exists($m->menu_item_parent, $sub_menu) || ! is_array( $sub_menu[ $m->menu_item_parent ] ) ) {
						$sub_menu[ $m->menu_item_parent ] = [];
					}

					$sub_menu[ $m->menu_item_parent ][ $m->ID ]            = [];
					$sub_menu[ $m->menu_item_parent ][ $m->ID ]['ID']      = $m->ID;
					$sub_menu[ $m->menu_item_parent ][ $m->ID ]['title']   = $m->title;
					$sub_menu[ $m->menu_item_parent ][ $m->ID ]['url']     = $m->url;
					$sub_menu[ $m->menu_item_parent ][ $m->ID ]['classes'] = implode(' ', array_merge($m->classes, ['submenu-item']));

					if ( (int) get_the_id() === (int) get_post_meta( $m->ID, '_menu_item_object_id', true ) || strtolower( $m->title) === $current_page_title ) {
						$sub_menu[ $m->menu_item_parent ][ $m->ID ]['classes'] .= ' active';
					}
				}
			}
		}

		foreach ( array_reverse($sub_menu, true) as $key => &$item ) {
			$found = false;

			foreach ( $sub_menu as $_key => &$_child ) {
				if ( $_key !== $key ) {
					foreach ( $_child as $__key => &$__child ) {
						if ( $__key === $key ) {
							$found               = true;
							$__child['children'] = $item;
							unset( $sub_menu[ $key ] );
							break;
						}
					}

					if ( $found ) {
						break;
					}
				}
			}
		}

		if ( is_array( $array_menu ) ) {
			foreach ( $array_menu as $m ) {
				if ( empty( $m->menu_item_parent ) ) {
					$menu[ $m->ID ]             = [];
					$menu[ $m->ID ]['ID']       = $m->ID;
					$menu[ $m->ID ]['title']    = $m->title;
					$menu[ $m->ID ]['url']      = $m->url;
					$menu[ $m->ID ]['children'] = $sub_menu[ $m->ID ] ?? [];
					$menu[ $m->ID ]['classes']  = implode( ' ', array_merge( $m->classes, ['menu-item'] ) );
					$menu[ $m->ID ]['kind']     = get_post_meta( $m->ID, 'kind', true );
					if ( (int) get_the_id() === (int) get_post_meta( $m->ID, '_menu_item_object_id', true ) || strtolower( $m->title ) === $current_page_title ) {
						$menu[ $m->ID ]['classes'] .= ' active';
					}
				}
			}
		}

		if ( $limit > 0 ) {
			$menu = array_slice( $menu, 0, $limit );
		}

		return $menu;
	}
}
