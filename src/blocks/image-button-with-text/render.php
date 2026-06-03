<?php
/**
 * render.php — Server-side render for the "Image Button with Text" block.
 *
 * Available variables (injected by WordPress):
 *   $attributes  (array)       — Block attributes saved in post content.
 *   $content     (string)      — Serialised inner-blocks HTML.
 *   $block       (WP_Block)    — The block instance.
 */

defined( 'ABSPATH' ) || exit;

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Safely retrieve an attribute with a fallback.
 *
 * @param array  $attrs
 * @param string $key
 * @param mixed  $default
 * @return mixed
 */
if ( ! function_exists( 'ibt_attr' ) ) {
	function ibt_attr( array $attrs, string $key, $default = null ) {
		return isset( $attrs[ $key ] ) && $attrs[ $key ] !== '' ? $attrs[ $key ] : $default;
	}
}

// ── Read attributes ──────────────────────────────────────────────────────────

$reversed                = ! empty( $attributes['reversed'] );

$min_height_desktop      = ibt_attr( $attributes, 'imageMinHeightDesktop', '400px' );
$min_height_mobile       = ibt_attr( $attributes, 'imageMinHeightMobile',  '250px' );

$bg_image                = ibt_attr( $attributes, 'backgroundImage',          [] );
$bg_focal_point          = ibt_attr( $attributes, 'backgroundImageFocalPoint', [ 'x' => 0.5, 'y' => 0.5 ] );
$bg_size                 = ibt_attr( $attributes, 'backgroundImageSize',       'cover' );
$bg_repeat               = ibt_attr( $attributes, 'backgroundImageRepeat',     'no-repeat' );

$link_url                = ibt_attr( $attributes, 'linkUrl',    '' );
$link_target             = ibt_attr( $attributes, 'linkTarget', '' );
$link_rel                = ibt_attr( $attributes, 'linkRel',    '' );

// ── Build CSS custom properties for the block wrapper ───────────────────────

$wrapper_css_vars = [];

if ( $min_height_desktop ) {
	$wrapper_css_vars[] = '--ibt-min-height-desktop: ' . esc_attr( $min_height_desktop );
}
if ( $min_height_mobile ) {
	$wrapper_css_vars[] = '--ibt-min-height-mobile: ' . esc_attr( $min_height_mobile );
}

$wrapper_inline_style = ! empty( $wrapper_css_vars )
	? 'style="' . implode( '; ', $wrapper_css_vars ) . '"'
	: '';

// ── Wrapper classes ──────────────────────────────────────────────────────────

$wrapper_class = 'ibt-block';
if ( $reversed ) {
	$wrapper_class .= ' ibt-block--reversed';
}

// Support block supports (spacing, etc.) via get_block_wrapper_attributes().
$wrapper_attributes = get_block_wrapper_attributes( [
	'class' => $wrapper_class,
	'style' => ! empty( $wrapper_css_vars ) ? implode( '; ', $wrapper_css_vars ) : '',
] );

// ── Image-button inline styles ───────────────────────────────────────────────

$image_btn_styles = [];

$bg_url = ! empty( $bg_image['url'] ) ? esc_url( $bg_image['url'] ) : '';

if ( $bg_url ) {
	// We output a data-bg-src for the lazy-loader in view.js; the noscript
	// fallback (and browsers with JS disabled) get the inline style below.
	$focal_x = round( ( $bg_focal_point['x'] ?? 0.5 ) * 100, 2 );
	$focal_y = round( ( $bg_focal_point['y'] ?? 0.5 ) * 100, 2 );

	$image_btn_styles[] = 'background-image: url(' . $bg_url . ')';
	$image_btn_styles[] = 'background-size: '      . esc_attr( $bg_size );
	$image_btn_styles[] = 'background-repeat: '    . esc_attr( $bg_repeat );
	$image_btn_styles[] = 'background-position: '  . $focal_x . '% ' . $focal_y . '%';
}

$image_btn_style_attr = ! empty( $image_btn_styles )
	? ' style="' . implode( '; ', $image_btn_styles ) . '"'
	: '';

$image_btn_data_attr = $bg_url
	? ' data-bg-src="' . $bg_url . '"'
	: '';

// ── Link markup ──────────────────────────────────────────────────────────────

$link_open  = '';
$link_close = '';
$link_label = __( 'View more', 'your-plugin' );

if ( $link_url ) {
	$target_attr = $link_target ? ' target="' . esc_attr( $link_target ) . '"' : '';
	$rel_attr    = $link_rel    ? ' rel="'    . esc_attr( $link_rel )    . '"' : '';

	$link_open  = '<a class="ibt-block__image-link" href="' . esc_url( $link_url ) . '"'
	              . $target_attr . $rel_attr
	              . ' aria-label="' . esc_attr( $link_label ) . '" tabindex="0">';
	$link_close = '</a>';
}

// ── Alt text for the background-image element ────────────────────────────────

$bg_alt = ! empty( $bg_image['alt'] ) ? esc_attr( $bg_image['alt'] ) : '';

?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

  <?php /* ── Image Button ── */ ?>
  <div class="ibt-block__image-button" <?php echo $image_btn_style_attr; // phpcs:ignore ?>
    <?php echo $image_btn_data_attr;  // phpcs:ignore ?> <?php if ( ! $link_url ) : ?> role="img"
    <?php if ( $bg_alt ) : ?> aria-label="<?php echo $bg_alt; ?>" <?php endif; ?> <?php endif; ?>>
    <?php if ( $link_url ) : ?>
    <?php echo $link_open; // phpcs:ignore ?>
    <?php if ( $bg_alt ) : ?>
    <span class="screen-reader-text"><?php echo esc_html( $bg_alt ); ?></span>
    <?php endif; ?>
    <?php echo $link_close; // phpcs:ignore ?>
    <?php endif; ?>
  </div>

  <?php /* ── Inner Blocks (content side) ── */ ?>
  <div class="ibt-block__content">
    <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
  </div>

</div>