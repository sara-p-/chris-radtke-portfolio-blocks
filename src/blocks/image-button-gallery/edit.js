import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from "@wordpress/block-editor";
import { PanelBody, ToggleControl } from "@wordpress/components";

/**
 * Allowed inner blocks — only the custom image-button block.
 */
const ALLOWED_BLOCKS = ["chris-radtke-portfolio-blocks/image-button"];

/**
 * Each slot renders a single image-button InnerBlocks area.
 * The templateLock prevents the user from adding anything other
 * than the one allowed block.
 */
const SLOT_TEMPLATE = [["chris-radtke-portfolio-blocks/image-button"]];

export default function Edit({ attributes, setAttributes }) {
	const { isReversed } = attributes;

	const blockProps = useBlockProps({
		className: isReversed ? "gallery-reversed" : "",
	});

	return (
		<>
			{/* ── Sidebar panel ── */}
			<InspectorControls>
				<PanelBody
					title={__("Gallery Settings", "your-plugin-textdomain")}
					initialOpen={true}
				>
					<ToggleControl
						label={__("Reverse orientation", "your-plugin-textdomain")}
						help={
							isReversed
								? __("Gallery is reversed.", "your-plugin-textdomain")
								: __(
										"Gallery is in default orientation.",
										"your-plugin-textdomain",
									)
						}
						checked={isReversed}
						onChange={(value) => setAttributes({ isReversed: value })}
					/>
				</PanelBody>
			</InspectorControls>

			{/* ── Block canvas ── */}
			<div {...blockProps}>
				{/* Column 1 */}
				<div className="container__column container__column-1">
					<div className="container__inner-row">
						<div className="container__image-button container__small">
							<InnerBlocks
								allowedBlocks={ALLOWED_BLOCKS}
								template={SLOT_TEMPLATE}
								templateLock="all"
							/>
						</div>
					</div>
					<div className="container__image-button">
						<InnerBlocks
							allowedBlocks={ALLOWED_BLOCKS}
							template={SLOT_TEMPLATE}
							templateLock="all"
						/>
					</div>
				</div>
				{/* Column 2 */}
				<div className="container__column container__column-2">
					<div className="container__image-button">
						<InnerBlocks
							allowedBlocks={ALLOWED_BLOCKS}
							template={SLOT_TEMPLATE}
							templateLock="all"
						/>
					</div>
					<div className="container__inner-row">
						<div className="container__image-button container__small">
							<InnerBlocks
								allowedBlocks={ALLOWED_BLOCKS}
								template={SLOT_TEMPLATE}
								templateLock="all"
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
