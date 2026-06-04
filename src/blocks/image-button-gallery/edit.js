import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	__experimentalLinkControl as LinkControl,
} from "@wordpress/block-editor";
import {
	PanelBody,
	PanelRow,
	ToggleControl,
	TextControl,
	SelectControl,
	FocalPointPicker,
	Button,
} from "@wordpress/components";

// ─── Constants ───────────────────────────────────────────────────────────────

const ITEM_COUNT = 4;

const DEFAULT_ITEM = {
	bgImageId: 0,
	bgImageUrl: "",
	bgPosition: "50% 50%",
	bgSize: "cover",
	bgRepeat: "no-repeat",
	bgAttachment: "scroll",
	minHeightDesktop: "363px",
	minHeightMobile: "",
	linkUrl: "",
	linkTarget: "",
	linkRel: "",
};

const PANEL_LABELS = [
	__("Image 1", "chris-radtke-portfolio-blocks"),
	__("Image 2", "chris-radtke-portfolio-blocks"),
	__("Image 3", "chris-radtke-portfolio-blocks"),
	__("Image 4", "chris-radtke-portfolio-blocks"),
];

const BG_SIZE_OPTIONS = [
	{ label: "Cover", value: "cover" },
	{ label: "Contain", value: "contain" },
	{ label: "Auto", value: "auto" },
];

const BG_REPEAT_OPTIONS = [
	{ label: "No Repeat", value: "no-repeat" },
	{ label: "Repeat", value: "repeat" },
	{ label: "Repeat X", value: "repeat-x" },
	{ label: "Repeat Y", value: "repeat-y" },
];

const BG_ATTACHMENT_OPTIONS = [
	{ label: "Scroll", value: "scroll" },
	{ label: "Fixed (Parallax)", value: "fixed" },
	{ label: "Local", value: "local" },
];

const LINK_SETTINGS = [
	{
		id: "opensInNewTab",
		title: __("Open in new tab", "chris-radtke-portfolio-blocks"),
	},
	{
		id: "nofollow",
		title: __("Mark as nofollow", "chris-radtke-portfolio-blocks"),
	},
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function updateItem(items, index, patch) {
	return items.map((item, i) => (i === index ? { ...item, ...patch } : item));
}

function focalPointFromPosition(bgPosition = "50% 50%") {
	const [x, y] = bgPosition.split(" ").map((v) => parseFloat(v) / 100);
	return { x: isNaN(x) ? 0.5 : x, y: isNaN(y) ? 0.5 : y };
}

function buildPreviewStyle(item) {
	const style = {};
	if (item.bgImageUrl) {
		style.backgroundImage = `url(${item.bgImageUrl})`;
		style.backgroundPosition = item.bgPosition;
		style.backgroundSize = item.bgSize;
		style.backgroundRepeat = item.bgRepeat;
		style.backgroundAttachment = item.bgAttachment;
	}
	if (item.minHeightDesktop) {
		style.minHeight = item.minHeightDesktop;
	}
	return style;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Edit({ attributes, setAttributes }) {
	const { isReversed } = attributes;

	// Merge stored items against DEFAULT_ITEM so every slot is always
	// a fully-formed object, even when attributes.items is [] or undefined.
	const rawItems = attributes.items ?? [];
	const items = Array.from({ length: ITEM_COUNT }, (_, i) => ({
		...DEFAULT_ITEM,
		...rawItems[i],
	}));

	const blockProps = useBlockProps({
		className: isReversed ? "gallery-reversed" : "",
	});

	// ── Updaters ──────────────────────────────────────────────────────────────

	function patchItem(index, patch) {
		setAttributes({ items: updateItem(items, index, patch) });
	}

	function handleImageSelect(index, media) {
		patchItem(index, { bgImageId: media.id, bgImageUrl: media.url });
	}

	function handleImageRemove(index) {
		patchItem(index, { bgImageId: 0, bgImageUrl: "" });
	}

	function handleFocalPoint(index, { x, y }) {
		patchItem(index, {
			bgPosition: `${Math.round(x * 100)}% ${Math.round(y * 100)}%`,
		});
	}

	function handleLinkChange(index, linkValue) {
		patchItem(index, {
			linkUrl: linkValue?.url ?? "",
			linkTarget: linkValue?.opensInNewTab ? "_blank" : "",
			linkRel: linkValue?.nofollow ? "nofollow" : "",
		});
	}

	function handleLinkRemove(index) {
		patchItem(index, { linkUrl: "", linkTarget: "", linkRel: "" });
	}

	// ── Render ────────────────────────────────────────────────────────────────

	return (
		<>
			<InspectorControls>
				{/* Gallery-level toggle */}
				<PanelBody
					title={__("Gallery Settings", "chris-radtke-portfolio-blocks")}
					initialOpen={true}
				>
					<ToggleControl
						label={__("Reverse orientation", "chris-radtke-portfolio-blocks")}
						help={
							isReversed
								? __("Layout is reversed.", "chris-radtke-portfolio-blocks")
								: __("Layout is default.", "chris-radtke-portfolio-blocks")
						}
						checked={isReversed}
						onChange={(value) => setAttributes({ isReversed: value })}
					/>
				</PanelBody>

				{/* Per-item panels */}
				{items.map((item, index) => (
					<PanelBody
						key={index}
						title={PANEL_LABELS[index]}
						initialOpen={false}
					>
						{/* Min-height */}
						<TextControl
							label={__(
								"Min-height (desktop)",
								"chris-radtke-portfolio-blocks",
							)}
							help={__("e.g. 400px or 50vh", "chris-radtke-portfolio-blocks")}
							value={item.minHeightDesktop}
							onChange={(value) =>
								patchItem(index, { minHeightDesktop: value })
							}
						/>
						<TextControl
							label={__("Min-height (mobile)", "chris-radtke-portfolio-blocks")}
							help={__("e.g. 250px or 40vh", "chris-radtke-portfolio-blocks")}
							value={item.minHeightMobile}
							onChange={(value) => patchItem(index, { minHeightMobile: value })}
						/>

						{/* Background image */}
						<PanelRow>
							<strong>
								{__("Background Image", "chris-radtke-portfolio-blocks")}
							</strong>
						</PanelRow>

						<MediaUploadCheck>
							<MediaUpload
								onSelect={(media) => handleImageSelect(index, media)}
								allowedTypes={["image"]}
								value={item.bgImageId}
								render={({ open }) => (
									<>
										{item.bgImageUrl && (
											<img
												src={item.bgImageUrl}
												alt=""
												style={{
													display: "block",
													width: "100%",
													height: "80px",
													objectFit: "cover",
													marginBottom: "8px",
													borderRadius: "2px",
												}}
											/>
										)}
										<Button
											variant={item.bgImageUrl ? "secondary" : "primary"}
											onClick={open}
											style={{
												display: "block",
												width: "100%",
												marginBottom: "6px",
												textAlign: "center",
											}}
										>
											{item.bgImageUrl
												? __("Replace Image", "chris-radtke-portfolio-blocks")
												: __("Select Image", "chris-radtke-portfolio-blocks")}
										</Button>
										{item.bgImageUrl && (
											<Button
												variant="tertiary"
												isDestructive
												onClick={() => handleImageRemove(index)}
												style={{
													display: "block",
													width: "100%",
													marginBottom: "8px",
													textAlign: "center",
												}}
											>
												{__("Remove Image", "chris-radtke-portfolio-blocks")}
											</Button>
										)}
									</>
								)}
							/>
						</MediaUploadCheck>

						{/* Background controls — only shown when an image is set */}
						{item.bgImageUrl && (
							<>
								<p
									style={{
										marginBottom: "4px",
										fontSize: "11px",
										textTransform: "uppercase",
										fontWeight: 500,
									}}
								>
									{__("Image Position", "chris-radtke-portfolio-blocks")}
								</p>
								<FocalPointPicker
									url={item.bgImageUrl}
									value={focalPointFromPosition(item.bgPosition)}
									onChange={(fp) => handleFocalPoint(index, fp)}
								/>
								<SelectControl
									label={__("Size", "chris-radtke-portfolio-blocks")}
									value={item.bgSize}
									options={BG_SIZE_OPTIONS}
									onChange={(value) => patchItem(index, { bgSize: value })}
								/>
								<SelectControl
									label={__("Repeat", "chris-radtke-portfolio-blocks")}
									value={item.bgRepeat}
									options={BG_REPEAT_OPTIONS}
									onChange={(value) => patchItem(index, { bgRepeat: value })}
								/>
								<SelectControl
									label={__("Attachment", "chris-radtke-portfolio-blocks")}
									value={item.bgAttachment}
									options={BG_ATTACHMENT_OPTIONS}
									onChange={(value) =>
										patchItem(index, { bgAttachment: value })
									}
								/>
							</>
						)}

						{/* Link */}
						<PanelRow>
							<strong>{__("Link", "chris-radtke-portfolio-blocks")}</strong>
						</PanelRow>
						<LinkControl
							value={{
								url: item.linkUrl,
								opensInNewTab: item.linkTarget === "_blank",
								nofollow: item.linkRel === "nofollow",
							}}
							onChange={(linkValue) => handleLinkChange(index, linkValue)}
							onRemove={() => handleLinkRemove(index)}
							settings={LINK_SETTINGS}
						/>
					</PanelBody>
				))}
			</InspectorControls>

			{/* ── Block canvas ── */}
			<div {...blockProps}>
				{/* Column 1 */}
				<div className="container__column container__column--1">
					<div className="container__inner-row">
						<div className="container__image-button container__small">
							<div
								className="image-button__item image-button__item--1"
								style={buildPreviewStyle(items[0])}
							>
								{items[0].linkUrl && (
									<span className="image-button-gallery__link-badge">
										{items[0].linkUrl}
									</span>
								)}
							</div>
						</div>
					</div>
					<div className="container__image-button">
						<div
							className="image-button__item image-button__item--2"
							style={buildPreviewStyle(items[1])}
						>
							{items[1].linkUrl && (
								<span className="image-button-gallery__link-badge">
									{items[1].linkUrl}
								</span>
							)}
						</div>
					</div>
				</div>

				{/* Column 2 */}
				<div className="container__column container__column--2">
					<div className="container__image-button">
						<div
							className="image-button__item image-button__item--3"
							style={buildPreviewStyle(items[2])}
						>
							{items[2].linkUrl && (
								<span className="image-button-gallery__link-badge">
									{items[2].linkUrl}
								</span>
							)}
						</div>
					</div>
					<div className="container__inner-row">
						<div className="container__image-button container__small">
							<div
								className="image-button__item image-button__item--4"
								style={buildPreviewStyle(items[3])}
							>
								{items[3].linkUrl && (
									<span className="image-button-gallery__link-badge">
										{items[3].linkUrl}
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
