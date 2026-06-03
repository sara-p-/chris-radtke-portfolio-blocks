import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

/**
 * save.js — Static save output for the Image Button with Text block.
 *
 * Because this is a dynamic block, render.php handles all frontend HTML.
 * However, save() must still return the InnerBlocks.Content placeholder
 * so WordPress serialises the inner blocks into post_content — without it,
 * $content in render.php will always be an empty string.
 */
export default function save() {
	return (
		<div {...useBlockProps.save()}>
			<InnerBlocks.Content />
		</div>
	);
}
