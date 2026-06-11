<?php
/**
 * render.php — Work Loop block
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
	'post_type'      => 'work',
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

$work_query = new WP_Query( $query_args );

if ( ! $work_query->have_posts() ) {
	return;
}

// ── Display flags ─────────────────────────────────────────────────────────────

$show_thumbnail = isset( $attributes['showThumbnail'] ) ? (bool) $attributes['showThumbnail'] : true;
$show_title     = isset( $attributes['showTitle'] ) ? (bool) $attributes['showTitle'] : true;

// ── Wrapper attributes (supports color, spacing, etc.) ───────────────────────

$wrapper_attributes = get_block_wrapper_attributes( [
	'class'        => 'work-loop',
	'data-term'    => esc_attr( $project_term ),
] );

// ── Render ────────────────────────────────────────────────────────────────────
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput ?>>
  <ul class="work-loop__list">
    <?php
		while ( $work_query->have_posts() ) :
			$work_query->the_post();

			$post_id      = get_the_ID();
			$post_url     = get_permalink();
			$post_title   = get_the_title();
			$work_years = get_post_meta( $post_id, '_work_years', true );
			?>

    <li class="work-loop__item">
      <article class="work-loop__article" id="work-<?php echo esc_attr( $post_id ); ?>">

        <a href="<?php echo esc_url( $post_url ); ?>" class="work-loop__link">
          <?php if ( $show_thumbnail && has_post_thumbnail() ) : ?>
          <div class="work-loop__thumbnail-wrapper">
            <div class="work-loop__thumbnail"
              style="background-image: url('<?php echo esc_url( get_the_post_thumbnail_url( $post_id, 'large' ) ); ?>')">
            </div>
          </div>
          <? endif; ?>
          <h6 class="work-loop__title">
            <?php if ( $work_years ) : ?>
            <span class="work-loop__years"><?php echo esc_html( $work_years ); ?></span>
            <span class="work-loop__title-separator" aria-hidden="true"> | </span>
            <?php endif; ?>
            <span class="work-loop__title-text"><?php echo esc_html( $post_title ); ?></span>
          </h6>
        </a>

      </article>
    </li>
    <?php endwhile; ?>
  </ul><!-- .work-loop__list -->
</div>
<?php

// Always reset after a custom WP_Query.
wp_reset_postdata();