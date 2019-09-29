<?php
/**
 * The header for Nova Theme.
 *
 * This is the template that displays all of the <head> section and everything
 * up until <main role="main">.
 *
 * @package Nova
 * @author  "Eduardo Jönnerstig <eduardo_jonnerstig@live.com>"
 * @license MIT https://opensource.org/licenses/MIT
 * @link    https://developer.wordpress.org/themes/basics/template-files/#template-partials
 * @since   1.0.0
 */
?>

<!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js">
	<head>
		<meta charset="<?php bloginfo('charset'); ?>">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<?php wp_head(); ?>
	</head>
	<body <?php body_class(); ?>>
		<noscript id="noscript">
			<p><?= __( 'This page requires JavaScript, please enable it in your browser to access the content.', 'nova' ); ?></p>
		</noscript>
		<!--[if lte IE 9]><p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="https://browsehappy.com/">upgrade your browser</a> to improve your experience and security.'</p><![endif]-->
		<?php render_template( 'template-parts/partials/navbar', ['primary_menu' => get_theme_menu( 'primary' )] ); ?>
		<main role="main">
