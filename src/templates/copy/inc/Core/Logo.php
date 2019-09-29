<?php

namespace App\Core;

/**
 * Class Logo
 *
 * @package App
 * @author "eddo81 <eduardo_jonnerstig@live.com>"
 * @license MIT https://opensource.org/licenses/MIT
 * @since   1.0.0
 */
class Logo {

	/**
	 * Control variable to store the logo object.
	 *
	 * @var array
	 */
	private $logo;

	/**
	 * Control variable to store class options.
	 *
	 * @var array
	 */
	private $options;

	/**
	 * Constructor.
	 *
	 * @param int   $width Width of the image in pixels.
	 * @param int   $height Height of image in pixels.
	 * @param bool  $flex_width Set to true to allow for a flexible width of the custom logo.
	 * @param bool  $flex_height Set to true to allow for a flexible height of the custom logo.
	 * @param array $header_text Header text.
	 */
	public function __construct( int $width = 0, int $height = 0, bool $flex_width = true, bool $flex_height = true, array $header_text = [] ) {
		$this->options = [
			'width'       => $width,
			'height'      => $height,
			'flex-width'  => $flex_width,
			'flex-height' => $flex_height,
			'header-text' => $header_text,
		];

		$this->logo = [
			'src'    => null,
			'alt'    => get_bloginfo( 'name' ),
			'href'   => esc_url( home_url( '/' ) ),
			'width'  => 0,
			'height' => 0,
		];
	}

	/**
	 * Set the pixel-width of the custom logo.
	 *
	 * @link https://developer.wordpress.org/themes/functionality/custom-logo/
	 * @param int $width Width of the image in pixels.
	 *
	 * @return self
	 */
	public function set_width( int $width ) : self {
		$this->options['width'] = $width;
		return $this;
	}

	/**
	 * Set the pixel-height of the custom logo.
	 *
	 * @link https://developer.wordpress.org/themes/functionality/custom-logo/
	 * @param int $height Height of image in pixels.
	 *
	 * @return self
	 */
	public function set_height( int $height ) : self {
		$this->options['height'] = $height;
		return $this;
	}

	/**
	 * Set whether to allow for a flexible width of the custom logo.
	 *
	 * @link https://developer.wordpress.org/themes/functionality/custom-logo/
	 * @param bool $flex_width Set to true to allow for a flexible width of the custom logo.
	 *
	 * @return self
	 */
	public function set_flex_width( bool $flex_width ) : self {
		$this->options['flex-width'] = $flex_width;
		return $this;
	}

	/**
	 * Set whether to allow for a flexible height of the custom logo.
	 *
	 * @link https://developer.wordpress.org/themes/functionality/custom-logo/
	 * @param bool $flex_height Set to true to allow for a flexible height of the custom logo.
	 *
	 * @return self
	 */
	public function set_flex_height( bool $flex_height ) : self {
		$this->options['flex-height'] = $flex_height;
		return $this;
	}

	/**
	 * Set the header-text of the custom logo.
	 *
	 * @link https://developer.wordpress.org/themes/functionality/custom-logo/
	 * @param array $header_text Header text.
	 * @return self
	 */
	public function set_header_text( array $header_text ) : self {
		$this->options['header-text'] = $header_text;
		return $this;
	}

	/**
	 * Set the alt-text of the custom logo.
	 *
	 * @param string $alt_text Set the alt text of the logo.
	 * @return self
	 */
	public function set_alt_text( string $alt_text ) : self {
		$this->logo['alt'] = $alt_text;
		return $this;
	}

	/**
	 * Register custom logo via the add_theme_support hook.
	 *
	 * @link https://developer.wordpress.org/themes/functionality/custom-logo/
	 * @return void
	 */
	public function register_logo() : void {
		add_theme_support( 'custom-logo', $this->options );

		if ( function_exists( 'has_custom_logo' ) ) {
			$logo_id = get_theme_mod( 'custom_logo' );
			$logo    = wp_get_attachment_image_src( $logo_id, [$this->options['width'], $this->options['height']] );

			if ( has_custom_logo() && false !== $logo ) {
				$this->logo['src']    = esc_url( $logo[0] );
				$this->logo['width']  = $logo[1];
				$this->logo['height'] = $logo[2];
			}
		}
	}

	/**
	 * Register custom logo via the add_theme_support hook.
	 *
	 * @return array
	 */
	public function get_custom_logo() : array {
		return $this->logo;
	}
}
