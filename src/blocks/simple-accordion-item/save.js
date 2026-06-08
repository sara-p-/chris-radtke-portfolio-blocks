import { InnerBlocks } from "@wordpress/block-editor";

/**
 * Dynamic blocks delegate all rendering to render.php.
 * We only need to persist the InnerBlocks content — no
 * wrapper element, so no block class ends up in $content.
 */
export default function save() {
	return <InnerBlocks.Content />;
}
