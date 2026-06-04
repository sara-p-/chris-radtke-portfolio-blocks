<?php
/**
 * Plugin Name:       Chris Radtke Portfolio Blocks
 * Description:       A collection of custom blocks for the Chris Radtke Portfolio site.
 * Version:           0.1.0
 * Requires at least: 6.8
 * Requires PHP:      7.4
 * Author:            Sara Pitt
 * Author URI:				sara-pitt.com
 * Update URI:				false
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       chris-radtke-portfolio-blocks
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
/**
 * Registers the block(s) metadata from the `blocks-manifest.php` and registers the block type(s)
 * based on the registered block metadata. Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
 */
function create_block_chris_radtke_portfolio_blocks_block_init() {
	wp_register_block_types_from_metadata_collection( __DIR__ . '/build/blocks', __DIR__ . '/build/blocks-manifest.php' );
}
add_action( 'init', 'create_block_chris_radtke_portfolio_blocks_block_init' );


/**
 * Image Button Gallery — helpers
 */
function ibg_build_style( $item ) {
    $styles = [];

    if ( ! empty( $item['bgImageUrl'] ) ) {
        $styles[] = 'background-image: url(' . esc_url( $item['bgImageUrl'] ) . ')';
        $styles[] = 'background-position: '    . esc_attr( $item['bgPosition'] );
        $styles[] = 'background-size: '        . esc_attr( $item['bgSize'] );
        $styles[] = 'background-repeat: '      . esc_attr( $item['bgRepeat'] );
        $styles[] = 'background-attachment: '  . esc_attr( $item['bgAttachment'] );
    }

    if ( ! empty( $item['minHeightDesktop'] ) ) {
        $styles[] = 'min-height: ' . esc_attr( $item['minHeightDesktop'] );
    }

    if ( ! empty( $item['minHeightMobile'] ) ) {
        $styles[] = '--ibg-min-height-mobile: ' . esc_attr( $item['minHeightMobile'] );
    }

    return implode( '; ', $styles );
}

function ibg_build_rel( $item ) {
    $rels = [];
    if ( $item['linkTarget'] === '_blank' ) {
        $rels[] = 'noopener';
        $rels[] = 'noreferrer';
    }
    if ( $item['linkRel'] === 'nofollow' ) {
        $rels[] = 'nofollow';
    }
    return implode( ' ', $rels );
}