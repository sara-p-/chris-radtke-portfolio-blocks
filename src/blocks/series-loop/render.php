<?php
/**
 * render.php — Series Loop block
 *
 * Available variables (injected by WordPress):
 *   $attributes  (array)  — Block attributes from block.json.
 *   $content     (string) — Inner block content (empty for this block).
 *   $block       (WP_Block) — The block instance.
 *
 * @package chris-radtke-portfolio-blocks
 */

// Bail early if no taxonomy term has been selected.
$project_term = isset( $attributes['projectTerm'] ) ? sanitize_text_field( $attributes['projectTerm'] ) : '';

if ( empty( $project_term ) ) {
	return;
}

// ── Query args ────────────────────────────────────────────────────────────────

$posts_per_page = isset( $attributes['postsPerPage'] ) ? absint( $attributes['postsPerPage'] ) : 10;
$order_by       = isset( $attributes['orderBy'] ) ? sanitize_key( $attributes['orderBy'] ) : 'date';
$order          = isset( $attributes['order'] ) && strtoupper( $attributes['order'] ) === 'ASC' ? 'ASC' : 'DESC';

// Whitelist orderby values to prevent unexpected behaviour.
$allowed_orderby = [ 'date', 'title', 'menu_order', 'rand', 'modified' ];
if ( ! in_array( $order_by, $allowed_orderby, true ) ) {
	$order_by = 'date';
}

$query_args = [
	'post_type'      => 'series',
	'posts_per_page' => $posts_per_page,
	'orderby'        => $order_by,
	'order'          => $order,
	'post_status'    => 'publish',
	'tax_query'      => [ // phpcs:ignore WordPress.DB.SlowDBQuery
		[
			'taxonomy' => 'projects',
			'field'    => 'slug',
			'terms'    => $project_term,
		],
	],
];

$series_query = new WP_Query( $query_args );

if ( ! $series_query->have_posts() ) {
	return;
}

// ── Display flags ─────────────────────────────────────────────────────────────

$show_thumbnail = isset( $attributes['showThumbnail'] ) ? (bool) $attributes['showThumbnail'] : true;
$show_title     = isset( $attributes['showTitle'] ) ? (bool) $attributes['showTitle'] : true;

// ── Wrapper attributes (supports color, spacing, etc.) ───────────────────────

$wrapper_attributes = get_block_wrapper_attributes( [
	'class'        => 'series-loop',
	'data-term'    => esc_attr( $project_term ),
] );

// ── Render ────────────────────────────────────────────────────────────────────
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput ?>>
  <ul class="series-loop__list">
    <?php
		while ( $series_query->have_posts() ) :
			$series_query->the_post();

			$post_id      = get_the_ID();
			$post_url     = get_permalink();
			$post_title   = get_the_title();
			$series_years = get_post_meta( $post_id, '_series_years', true );
			?>

    <li class="series-loop__item">
      <article class="series-loop__article" id="series-<?php echo esc_attr( $post_id ); ?>">

        <?php if ( $show_thumbnail && has_post_thumbnail() ) : ?>
        <a class="series-loop__thumbnail-link" href="<?php echo esc_url( $post_url ); ?>"
          style="background-image: url('<?php echo esc_url( get_the_post_thumbnail_url( $post_id, 'medium' ) ); ?>')"
          tabindex="-1" aria-hidden="true">
        </a>
        <?php endif; ?>

        <div class="series-loop__body">

          <?php if ( $show_title ) : ?>
          <h6 class="series-loop__title">
            <a class="series-loop__title-link" href="<?php echo esc_url( $post_url ); ?>">
              <?php if ( $series_years ) : ?>
              <span class="series-loop__years"><?php echo esc_html( $series_years ); ?></span>
              <span class="series-loop__title-separator" aria-hidden="true"> | </span>
              <?php endif; ?>
              <span class="series-loop__title-text"><?php echo esc_html( $post_title ); ?></span>
            </a>
          </h6>
          <?php endif; ?>

        </div><!-- .series-loop__body -->

      </article>
    </li>
    <?php endwhile; ?>
  </ul><!-- .series-loop__list -->
</div>
<?php

// Always reset after a custom WP_Query.
wp_reset_postdata();