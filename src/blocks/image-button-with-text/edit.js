import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	__experimentalLinkControl as LinkControl,
} from "@wordpress/block-editor";
import {
	PanelBody,
	PanelRow,
	ToggleControl,
	Button,
	RangeControl,
	__experimentalUnitControl as UnitControl,
	Popover,
	FocalPointPicker,
	SelectControl,
	ToolbarButton,
} from "@wordpress/components";
import { useState, useRef } from "@wordpress/element";
import { link, linkOff } from "@wordpress/icons";

const TEMPLATE = [
	[
		"core/heading",
		{ level: 2, placeholder: __("Add a heading…", "your-plugin") },
	],
	["core/paragraph", { placeholder: __("Add some text…", "your-plugin") }],
	[
		"core/buttons",
		{},
		[["core/button", { text: __("Learn More", "your-plugin") }]],
	],
];

const ALLOWED_BLOCKS = [
	"core/heading",
	"core/paragraph",
	"core/buttons",
	"core/button",
	"core/list",
	"core/image",
	"core/spacer",
	"core/separator",
	"core/group",
];

export default function Edit({ attributes, setAttributes }) {
	const {
		reversed,
		imageMinHeightDesktop,
		imageMinHeightMobile,
		backgroundImage,
		backgroundImageFocalPoint,
		backgroundImageSize,
		backgroundImageRepeat,
		backgroundImagePosition,
		linkUrl,
		linkTarget,
		linkRel,
	} = attributes;

	const [isLinkPickerOpen, setIsLinkPickerOpen] = useState(false);
	const linkButtonRef = useRef();

	// Compose inline styles for the image button side
	const imageButtonStyle = {};
	if (backgroundImage?.url) {
		imageButtonStyle.backgroundImage = `url(${backgroundImage.url})`;
		imageButtonStyle.backgroundSize = backgroundImageSize || "cover";
		imageButtonStyle.backgroundRepeat = backgroundImageRepeat || "no-repeat";
		if (backgroundImageFocalPoint) {
			imageButtonStyle.backgroundPosition = `${backgroundImageFocalPoint.x * 100}% ${backgroundImageFocalPoint.y * 100}%`;
		} else {
			imageButtonStyle.backgroundPosition =
				backgroundImagePosition || "center center";
		}
	}
	// Desktop min-height applied as CSS variable so the responsive SCSS can reference it
	if (imageMinHeightDesktop) {
		imageButtonStyle["--ibt-min-height-desktop"] = imageMinHeightDesktop;
	}
	if (imageMinHeightMobile) {
		imageButtonStyle["--ibt-min-height-mobile"] = imageMinHeightMobile;
	}

	const blockProps = useBlockProps({
		className: `ibt-block${reversed ? " ibt-block--reversed" : ""}`,
	});

	const innerBlocksProps = useInnerBlocksProps(
		{ className: "ibt-block__content" },
		{
			allowedBlocks: ALLOWED_BLOCKS,
			template: TEMPLATE,
			templateLock: false,
		},
	);

	const linkValue = {
		url: linkUrl,
		opensInNewTab: linkTarget === "_blank",
	};

	const onChangeLinkValue = (newValue) => {
		setAttributes({
			linkUrl: newValue.url,
			linkTarget: newValue.opensInNewTab ? "_blank" : "",
			linkRel: newValue.opensInNewTab ? "noreferrer noopener" : "",
		});
	};

	return (
		<>
			{/* ── Inspector Controls ── */}
			<InspectorControls>
				{/* Layout Panel */}
				<PanelBody title={__("Layout", "your-plugin")} initialOpen={true}>
					<PanelRow>
						<ToggleControl
							label={__("Reverse Layout", "your-plugin")}
							help={
								reversed
									? __(
											"Content is on the left, image on the right.",
											"your-plugin",
										)
									: __(
											"Image is on the left, content on the right.",
											"your-plugin",
										)
							}
							checked={reversed}
							onChange={(value) => setAttributes({ reversed: value })}
						/>
					</PanelRow>
				</PanelBody>

				{/* Image Button Panel */}
				<PanelBody title={__("Image Button", "your-plugin")} initialOpen={true}>
					{/* Min Height – Desktop */}
					<UnitControl
						label={__("Min Height (Desktop)", "your-plugin")}
						value={imageMinHeightDesktop}
						onChange={(value) =>
							setAttributes({ imageMinHeightDesktop: value })
						}
						units={[
							{ value: "px", label: "px", default: 400 },
							{ value: "vh", label: "vh", default: 50 },
							{ value: "em", label: "em", default: 0 },
							{ value: "rem", label: "rem", default: 0 },
						]}
						style={{ marginBottom: "16px" }}
					/>

					{/* Min Height – Mobile */}
					<UnitControl
						label={__("Min Height (Mobile)", "your-plugin")}
						value={imageMinHeightMobile}
						onChange={(value) => setAttributes({ imageMinHeightMobile: value })}
						units={[
							{ value: "px", label: "px", default: 250 },
							{ value: "vh", label: "vh", default: 40 },
							{ value: "em", label: "em", default: 0 },
							{ value: "rem", label: "rem", default: 0 },
						]}
						style={{ marginBottom: "16px" }}
					/>

					{/* Background Image */}
					<p style={{ fontWeight: 600, marginBottom: "8px" }}>
						{__("Background Image", "your-plugin")}
					</p>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={(media) =>
								setAttributes({
									backgroundImage: {
										id: media.id,
										url: media.url,
										alt: media.alt,
									},
								})
							}
							allowedTypes={["image"]}
							value={backgroundImage?.id}
							render={({ open }) => (
								<>
									{backgroundImage?.url ? (
										<div style={{ marginBottom: "8px" }}>
											<img
												src={backgroundImage.url}
												alt={backgroundImage.alt || ""}
												style={{
													width: "100%",
													height: "80px",
													objectFit: "cover",
													borderRadius: "4px",
													marginBottom: "8px",
												}}
											/>
											<div style={{ display: "flex", gap: "8px" }}>
												<Button variant="secondary" onClick={open} isSmall>
													{__("Replace", "your-plugin")}
												</Button>
												<Button
													variant="tertiary"
													isDestructive
													isSmall
													onClick={() =>
														setAttributes({ backgroundImage: undefined })
													}
												>
													{__("Remove", "your-plugin")}
												</Button>
											</div>
										</div>
									) : (
										<Button variant="secondary" onClick={open}>
											{__("Select Image", "your-plugin")}
										</Button>
									)}
								</>
							)}
						/>
					</MediaUploadCheck>

					{/* Focal Point */}
					{backgroundImage?.url && (
						<>
							<p style={{ fontWeight: 600, margin: "16px 0 8px" }}>
								{__("Focal Point", "your-plugin")}
							</p>
							<FocalPointPicker
								url={backgroundImage.url}
								value={backgroundImageFocalPoint || { x: 0.5, y: 0.5 }}
								onChange={(val) =>
									setAttributes({ backgroundImageFocalPoint: val })
								}
							/>

							{/* Background Size */}
							<SelectControl
								label={__("Background Size", "your-plugin")}
								value={backgroundImageSize || "cover"}
								options={[
									{ label: __("Cover", "your-plugin"), value: "cover" },
									{ label: __("Contain", "your-plugin"), value: "contain" },
									{ label: __("Auto", "your-plugin"), value: "auto" },
								]}
								onChange={(val) => setAttributes({ backgroundImageSize: val })}
								style={{ marginTop: "12px" }}
							/>

							{/* Background Repeat */}
							<SelectControl
								label={__("Background Repeat", "your-plugin")}
								value={backgroundImageRepeat || "no-repeat"}
								options={[
									{ label: __("No Repeat", "your-plugin"), value: "no-repeat" },
									{ label: __("Repeat", "your-plugin"), value: "repeat" },
									{ label: __("Repeat X", "your-plugin"), value: "repeat-x" },
									{ label: __("Repeat Y", "your-plugin"), value: "repeat-y" },
								]}
								onChange={(val) =>
									setAttributes({ backgroundImageRepeat: val })
								}
							/>
						</>
					)}

					{/* Link */}
					<p style={{ fontWeight: 600, margin: "16px 0 8px" }}>
						{__("Link", "your-plugin")}
					</p>
					<div ref={linkButtonRef}>
						<Button
							variant={linkUrl ? "primary" : "secondary"}
							icon={linkUrl ? link : linkOff}
							onClick={() => setIsLinkPickerOpen((prev) => !prev)}
						>
							{linkUrl
								? __("Edit Link", "your-plugin")
								: __("Add Link", "your-plugin")}
						</Button>
						{linkUrl && (
							<Button
								variant="tertiary"
								isDestructive
								style={{ marginLeft: "8px" }}
								onClick={() =>
									setAttributes({
										linkUrl: "",
										linkTarget: "",
										linkRel: "",
									})
								}
							>
								{__("Remove", "your-plugin")}
							</Button>
						)}
					</div>
					{isLinkPickerOpen && (
						<Popover
							anchor={linkButtonRef.current}
							onClose={() => setIsLinkPickerOpen(false)}
							placement="bottom-start"
						>
							<LinkControl
								value={linkValue}
								onChange={onChangeLinkValue}
								settings={[
									{
										id: "opensInNewTab",
										title: __("Open in new tab", "your-plugin"),
									},
								]}
							/>
						</Popover>
					)}
				</PanelBody>
			</InspectorControls>

			{/* ── Block Canvas ── */}
			<div {...blockProps}>
				{/* Image Button Side */}
				<div
					className="ibt-block__image-button"
					style={imageButtonStyle}
					aria-label={__(
						"Image Button (not interactive in editor)",
						"your-plugin",
					)}
				>
					{!backgroundImage?.url && (
						<div className="ibt-block__image-placeholder">
							<span>
								{__(
									"Select a background image in the sidebar →",
									"your-plugin",
								)}
							</span>
						</div>
					)}
					{linkUrl && (
						<div className="ibt-block__link-badge">
							<span>{linkUrl}</span>
						</div>
					)}
				</div>

				{/* Inner Blocks Side */}
				<div {...innerBlocksProps} />
			</div>
		</>
	);
}
