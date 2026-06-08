<?php
/**
 * Accordion block — render.php
 *
 * Available variables:
 *   $attributes  (array)   — block attributes from block.json
 *   $content     (string)  — InnerBlocks content (rendered HTML)
 *   $block       (WP_Block) — block instance
 */

$open_by_default = ! empty( $attributes['openByDefault'] );
$is_open         = $open_by_default;
$summary         = isset( $attributes['summary'] ) ? $attributes['summary'] : '';

$wrapper_attributes = get_block_wrapper_attributes( [
	'class' => $is_open ? 'is-open' : '',
] );

$toggle_label = $is_open ? __( 'See less', 'your-plugin' ) : __( 'read more', 'your-plugin' );
$icon_path    = $is_open
	? 'M5 11h14v2H5z'
	: 'M13 5h-2v6H5v2h6v6h2v-6h6v-2h-6z';
?>

<div <?php echo $wrapper_attributes; ?>>

  <?php if ( $summary ) : ?>
  <p class="wp-block-accordion__summary">
    <?php echo wp_kses_post( $summary ); ?>
  </p>
  <?php endif; ?>

  <div class="wp-block-accordion__panel" <?php if ( ! $is_open ) : ?>aria-hidden="true" <?php endif; ?>>
    <div class="wp-block-accordion__panel-inner">
      <?php echo $content; ?>
    </div>
  </div>

  <button type="button" class="wp-block-accordion__toggle<?php echo $is_open ? ' is-open' : ''; ?>"
    aria-expanded="<?php echo $is_open ? 'true' : 'false'; ?>" aria-label="<?php echo esc_attr( $toggle_label ); ?>">
    <h6 class="wp-block-accordion__toggle-label" aria-hidden="true">
      <?php echo esc_html( $toggle_label ); ?>
    </h6>
    <span class="wp-block-accordion__toggle-icon" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" focusable="false">
        <path d="<?php echo esc_attr( $icon_path ); ?>" />
      </svg>
    </span>
  </button>

</div>