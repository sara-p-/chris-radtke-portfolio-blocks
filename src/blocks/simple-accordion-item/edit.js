import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	RichText,
	InnerBlocks,
	InspectorControls,
} from "@wordpress/block-editor";
import { PanelBody, ToggleControl } from "@wordpress/components";
import { useState } from "@wordpress/element";

const ALLOWED_BLOCKS = ["core/paragraph"];

const TEMPLATE = [
	[
		"core/paragraph",
		{ placeholder: __("Add accordion content…", "your-plugin") },
	],
];

export default function Edit({ attributes, setAttributes }) {
	const { summary, openByDefault } = attributes;

	// Local state so the editor panel can be toggled for preview/editing
	const [isOpen, setIsOpen] = useState(!!openByDefault);

	const blockProps = useBlockProps({
		className: "wp-block-accordion",
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Accordion Settings", "your-plugin")}>
					<ToggleControl
						label={__("Open by default", "your-plugin")}
						checked={!!openByDefault}
						onChange={(value) => {
							setAttributes({ openByDefault: value });
							setIsOpen(value);
						}}
						help={__(
							"Whether the accordion panel is expanded on page load.",
							"your-plugin",
						)}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{/* ── Summary / trigger ── */}
				<div className="wp-block-accordion__summary-wrapper">
					<RichText
						tagName="p"
						className="wp-block-accordion__summary"
						value={summary}
						onChange={(value) => setAttributes({ summary: value })}
						placeholder={__("Accordion summary…", "your-plugin")}
						allowedFormats={["core/bold", "core/italic", "core/link"]}
						aria-label={__("Accordion summary text", "your-plugin")}
					/>

					{/* Toggle button — sits below summary text */}
					<button
						type="button"
						className={`wp-block-accordion__toggle${isOpen ? " is-open" : ""}`}
						onClick={() => setIsOpen((prev) => !prev)}
						aria-expanded={isOpen}
						aria-label={
							isOpen
								? __("See less", "your-plugin")
								: __("Read more", "your-plugin")
						}
					>
						<h6 className="wp-block-accordion__toggle-label" aria-hidden="true">
							{isOpen
								? __("See less", "your-plugin")
								: __("read more", "your-plugin")}
						</h6>
						<span
							className="wp-block-accordion__toggle-icon"
							aria-hidden="true"
						>
							{isOpen ? (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									width="20"
									height="20"
									focusable="false"
								>
									<path d="M5 11h14v2H5z" />
								</svg>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									width="20"
									height="20"
									focusable="false"
								>
									<path d="M13 5h-2v6H5v2h6v6h2v-6h6v-2h-6z" />
								</svg>
							)}
						</span>
					</button>
				</div>

				{/* ── Panel / content area ── */}
				<div
					className={`wp-block-accordion__panel${isOpen ? " is-open" : ""}`}
					aria-hidden={!isOpen}
				>
					<div className="wp-block-accordion__panel-inner">
						<InnerBlocks
							allowedBlocks={ALLOWED_BLOCKS}
							template={TEMPLATE}
							templateLock={false}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
