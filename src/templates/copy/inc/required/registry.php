<?php
/**
 * Register theme dependencies.
 *
 * @package Nova
 * @author  "Eduardo Jönnerstig <eduardo_jonnerstig@live.com>"
 * @license MIT https://opensource.org/licenses/MIT
 * @since   1.0.0
 */

if ( defined( 'ABSPATH' ) === false ) {
	exit;
}

use App\Core\Menu;
use App\Core\Breadcrumb;
use App\Core\Logo;

use Nova\Core\AssetManager;
use Nova\Core\Template;
use Nova\Optimization\ImageSizer;
use Nova\Optimization\CleanWp;

new CleanWp();
new ImageSizer();

$menu_locations = [
	'primary' => __( 'Primary Navigation', 'nova' ),
	'footer'  => __( 'Footer Navigation', 'nova' ),
];

registry_set( 'asset_manager', new AssetManager( THEME_ASSETS_URI . '/asset_manifest.json' ) );

registry_set( 'template', new Template( THEME_ROOT_URI . '/' ) );

registry_set( 'breadcrumb', new Breadcrumb() );

registry_set( 'logo', new Logo() );

registry_set( 'theme_menu', new Menu( $menu_locations ) );
