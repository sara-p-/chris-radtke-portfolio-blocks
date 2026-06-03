<?php
/**
 * Dynamic render for the Image Button block.
 *
 * Available variables:
 *   $attributes  - Block attributes array
 *   $content     - InnerBlocks content (unused here)
 *   $block       - WP_Block instance
 */

$link_url    = ! empty( $attributes['linkUrl'] ) ? esc_url( $attributes['linkUrl'] ) : '';
$link_target = ! empty( $attributes['linkTarget'] ) && $attributes['linkTarget'] === '_blank'
	? '_blank'
	: '_self';
$rel         = $link_target === '_blank' ? 'noopener noreferrer' : '';

// Background image
$bg_image = ! empty( $attributes['backgroundImage']['url'] )
	? esc_url( $attributes['backgroundImage']['url'] )
	: '';
$bg_alt   = ! empty( $attributes['backgroundImage']['alt'] )
	? esc_attr( $attributes['backgroundImage']['alt'] )
	: '';

// Background styles
$min_height        = ! empty( $attributes['minHeight'] ) ? $attributes['minHeight'] : '300px';
$min_height_mobile = ! empty( $attributes['minHeightMobile'] ) ? $attributes['minHeightMobile'] : '200px';
$min_height_clamp  = "clamp({$min_height_mobile}, calc(-33.333px + 36.111vw), {$min_height})";
$bg_size            = ! empty( $attributes['backgroundSize'] ) ? $attributes['backgroundSize'] : 'cover';
$bg_repeat          = ! empty( $attributes['backgroundRepeat'] ) ? $attributes['backgroundRepeat'] : 'no-repeat';
$bg_attachment       = ! empty( $attributes['backgroundAttachment'] ) ? $attributes['backgroundAttachment'] : 'scroll';

// Focal point → background-position
$focal_point = $attributes['focalPoint'] ?? [ 'x' => 0.5, 'y' => 0.5 ];
$bg_position = round( (float) $focal_point['x'] * 100 ) . '% ' . round( (float) $focal_point['y'] * 100 ) . '%';

// Build inline style
$styles = array_filter( [
	$bg_image       ? "background-image:url('{$bg_image}')" : '',
	"background-size:{$bg_size}",
	"background-position:{$bg_position}",
	"background-repeat:{$bg_repeat}",
	"background-attachment:{$bg_attachment}",
	"min-height:{$min_height_clamp}",
] );
$style_string = implode( ';', $styles );

// Block wrapper attributes (adds block class, any extra classes, etc.)
$wrapper_attributes = get_block_wrapper_attributes( [
	'style' => $style_string,
	'role'  => 'img',
	'aria-label' => $bg_alt,
] );
?>

<?php if ( $link_url ) : ?>
<a <?php echo $wrapper_attributes; ?> href="<?php echo esc_url( $link_url ); ?>"
  target="<?php echo esc_attr( $link_target ); ?>" <?php echo $rel ? 'rel="' . esc_attr( $rel ) . '"' : ''; ?>></a>
<?php else : ?>
<div <?php echo $wrapper_attributes; ?>></div>
<?php endif; ?>