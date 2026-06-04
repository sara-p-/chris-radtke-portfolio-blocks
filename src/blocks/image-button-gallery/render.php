<?php
/**
 * render.php — Image Button Gallery
 *
 * Available variables:
 *   $attributes  (array)  — block attributes
 *   $content     (string) — inner blocks HTML (unused here)
 *   $block       (object) — WP_Block instance
 */

$is_reversed = ! empty( $attributes['isReversed'] );
$raw_items   = ! empty( $attributes['items'] ) ? $attributes['items'] : [];

// Defaults mirror DEFAULT_ITEM in edit.js
$default_item = [
	'bgImageUrl'       => '',
	'bgPosition'       => '50% 50%',
	'bgSize'           => 'cover',
	'bgRepeat'         => 'no-repeat',
	'bgAttachment'     => 'scroll',
	'minHeightDesktop' => '363px',
	'minHeightMobile'  => '',
	'linkUrl'          => '',
	'linkTarget'       => '',
	'linkRel'          => '',
];

// Guarantee exactly 4 fully-formed items
$items = [];
for ( $i = 0; $i < 4; $i++ ) {
	$items[] = array_merge( $default_item, isset( $raw_items[ $i ] ) ? $raw_items[ $i ] : [] );
}


// Wrapper classes
$wrapper_classes = [ 'wp-block-chris-radtke-portfolio-blocks-image-button-gallery' ];
if ( $is_reversed ) {
	$wrapper_classes[] = 'gallery-reversed';
}

$wrapper_class = implode( ' ', $wrapper_classes );

?>
<div <?php echo get_block_wrapper_attributes( [ 'class' => $is_reversed ? 'gallery-reversed' : '' ] ); ?>>

  <!-- Column 1 -->
  <div class="container__column container__column--1">

    <div class="container__inner-row">
      <div class="container__image-button container__small">
        <?php $item = $items[0]; ?>
        <?php if ( ! empty( $item['linkUrl'] ) ) : ?>
        <a class="image-button__item image-button__item--1" href="<?php echo esc_url( $item['linkUrl'] ); ?>"
          <?php if ( $item['linkTarget'] ) : ?>target="<?php echo esc_attr( $item['linkTarget'] ); ?>" <?php endif; ?>
          <?php $rel = ibg_build_rel( $item ); if ( $rel ) : ?>rel="<?php echo esc_attr( $rel ); ?>" <?php endif; ?>
          style="<?php echo ibg_build_style( $item ); ?>">
        </a>
        <?php else : ?>
        <div class="image-button__item image-button__item--1" style="<?php echo ibg_build_style( $item ); ?>">
        </div>
        <?php endif; ?>
      </div>
    </div>

    <div class="container__image-button">
      <?php $item = $items[1]; ?>
      <?php if ( ! empty( $item['linkUrl'] ) ) : ?>
      <a class="image-button__item image-button__item--2" href="<?php echo esc_url( $item['linkUrl'] ); ?>"
        <?php if ( $item['linkTarget'] ) : ?>target="<?php echo esc_attr( $item['linkTarget'] ); ?>" <?php endif; ?>
        <?php $rel = ibg_build_rel( $item ); if ( $rel ) : ?>rel="<?php echo esc_attr( $rel ); ?>" <?php endif; ?>
        style="<?php echo ibg_build_style( $item ); ?>">
      </a>
      <?php else : ?>
      <div class="image-button__item image-button__item--2" style="<?php echo ibg_build_style( $item ); ?>">
      </div>
      <?php endif; ?>
    </div>

  </div><!-- /container__column--1 -->

  <!-- Column 2 -->
  <div class="container__column container__column--2">

    <div class="container__image-button">
      <?php $item = $items[2]; ?>
      <?php if ( ! empty( $item['linkUrl'] ) ) : ?>
      <a class="image-button__item image-button__item--3" href="<?php echo esc_url( $item['linkUrl'] ); ?>"
        <?php if ( $item['linkTarget'] ) : ?>target="<?php echo esc_attr( $item['linkTarget'] ); ?>" <?php endif; ?>
        <?php $rel = ibg_build_rel( $item ); if ( $rel ) : ?>rel="<?php echo esc_attr( $rel ); ?>" <?php endif; ?>
        style="<?php echo ibg_build_style( $item ); ?>">
      </a>
      <?php else : ?>
      <div class="image-button__item image-button__item--3" style="<?php echo ibg_build_style( $item ); ?>">
      </div>
      <?php endif; ?>
    </div>

    <div class="container__inner-row">
      <div class="container__image-button container__small">
        <?php $item = $items[3]; ?>
        <?php if ( ! empty( $item['linkUrl'] ) ) : ?>
        <a class="image-button__item image-button__item--4" href="<?php echo esc_url( $item['linkUrl'] ); ?>"
          <?php if ( $item['linkTarget'] ) : ?>target="<?php echo esc_attr( $item['linkTarget'] ); ?>" <?php endif; ?>
          <?php $rel = ibg_build_rel( $item ); if ( $rel ) : ?>rel="<?php echo esc_attr( $rel ); ?>" <?php endif; ?>
          style="<?php echo ibg_build_style( $item ); ?>">
        </a>
        <?php else : ?>
        <div class="image-button__item image-button__item--4" style="<?php echo ibg_build_style( $item ); ?>">
        </div>
        <?php endif; ?>
      </div>
    </div>

  </div><!-- /container__column--2 -->

</div>