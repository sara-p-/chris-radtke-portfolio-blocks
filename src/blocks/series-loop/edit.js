import { __, sprintf } from "@wordpress/i18n";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import {
	PanelBody,
	SelectControl,
	RangeControl,
	ToggleControl,
	Spinner,
	Placeholder,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { useState, useEffect } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";
import { layout } from "@wordpress/icons";
import { decodeEntities } from "@wordpress/html-entities";

export default function Edit({ attributes, setAttributes }) {
	const {
		projectTerm,
		projectTermId,
		postsPerPage,
		orderBy,
		order,
		showTitle,
		showThumbnail,
	} = attributes;

	const blockProps = useBlockProps({
		className: "series-loop-editor-preview",
	});

	// ── Fetch taxonomy terms via core-data ──
	const { terms, termsLoading } = useSelect((select) => {
		const { getEntityRecords, isResolving } = select(coreStore);
		const query = {
			per_page: -1,
			orderby: "name",
			order: "asc",
			_fields: "id,name,slug",
		};

		return {
			terms: getEntityRecords("taxonomy", "projects", query),
			termsLoading: isResolving("getEntityRecords", [
				"taxonomy",
				"projects",
				query,
			]),
		};
	}, []);

	// ── Fetch preview posts via apiFetch ──
	const [previewPosts, setPreviewPosts] = useState([]);
	const [postsLoading, setPostsLoading] = useState(false);

	useEffect(() => {
		if (!projectTermId) {
			setPreviewPosts([]);
			return;
		}

		let cancelled = false;
		setPostsLoading(true);

		apiFetch({
			path: addQueryArgs("/wp/v2/series", {
				per_page: Math.min(postsPerPage, 3),
				orderby: orderBy,
				order: order.toLowerCase(),
				projects: projectTermId,
				_embed: true,
				_fields: "id,title,meta,_links,_embedded",
			}),
		})
			.then((posts) => {
				if (!cancelled) {
					setPreviewPosts(posts);
					setPostsLoading(false);
				}
			})
			.catch(() => {
				if (!cancelled) {
					setPreviewPosts([]);
					setPostsLoading(false);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [projectTermId, postsPerPage, orderBy, order]);

	// ── Term options for SelectControl ──
	const termOptions = [
		{
			label: __("— Select a term —", "chris-radtke-portfolio-blocks"),
			value: "",
		},
		...(terms ?? []).map((term) => ({
			label: term.name,
			value: term.slug,
		})),
	];

	const selectedTermLabel =
		terms?.find((t) => t.slug === projectTerm)?.name ?? projectTerm;

	return (
		<>
			{/* ── Sidebar Controls ── */}
			<InspectorControls>
				<PanelBody
					title={__("Query Settings", "chris-radtke-portfolio-blocks")}
					initialOpen={true}
				>
					{termsLoading ? (
						<Spinner />
					) : (
						<SelectControl
							label={__("Projects Term", "chris-radtke-portfolio-blocks")}
							value={projectTerm}
							options={termOptions}
							onChange={(val) => {
								const selected = terms?.find((t) => t.slug === val);
								setAttributes({
									projectTerm: val,
									projectTermId: selected ? selected.id : 0,
								});
							}}
							help={__(
								"Filter Series posts by this Projects taxonomy term.",
								"chris-radtke-portfolio-blocks",
							)}
						/>
					)}

					<RangeControl
						label={__("Posts Per Page", "chris-radtke-portfolio-blocks")}
						value={postsPerPage}
						onChange={(val) => setAttributes({ postsPerPage: val })}
						min={1}
						max={100}
					/>

					<SelectControl
						label={__("Order By", "chris-radtke-portfolio-blocks")}
						value={orderBy}
						options={[
							{
								label: __("Date", "chris-radtke-portfolio-blocks"),
								value: "date",
							},
							{
								label: __("Title", "chris-radtke-portfolio-blocks"),
								value: "title",
							},
							{
								label: __("Menu Order", "chris-radtke-portfolio-blocks"),
								value: "menu_order",
							},
							// {
							// 	label: __("Random", "chris-radtke-portfolio-blocks"),
							// 	value: "rand",
							// },
						]}
						onChange={(val) => setAttributes({ orderBy: val })}
					/>

					<SelectControl
						label={__("Order", "chris-radtke-portfolio-blocks")}
						value={order}
						options={[
							{
								label: __("Descending", "chris-radtke-portfolio-blocks"),
								value: "DESC",
							},
							{
								label: __("Ascending", "chris-radtke-portfolio-blocks"),
								value: "ASC",
							},
						]}
						onChange={(val) => setAttributes({ order: val })}
					/>
				</PanelBody>

				<PanelBody
					title={__("Display Settings", "chris-radtke-portfolio-blocks")}
					initialOpen={true}
				>
					<ToggleControl
						label={__("Show Thumbnail", "chris-radtke-portfolio-blocks")}
						checked={showThumbnail}
						onChange={(val) => setAttributes({ showThumbnail: val })}
					/>
					<ToggleControl
						label={__("Show Title", "chris-radtke-portfolio-blocks")}
						checked={showTitle}
						onChange={(val) => setAttributes({ showTitle: val })}
					/>
				</PanelBody>
			</InspectorControls>

			{/* ── Editor Canvas ── */}
			<div {...blockProps}>
				{!projectTerm ? (
					<Placeholder
						icon={layout}
						label={__("Series Loop", "chris-radtke-portfolio-blocks")}
						instructions={__(
							"Select a Projects taxonomy term in the block settings panel to preview posts.",
							"chris-radtke-portfolio-blocks",
						)}
					/>
				) : (
					<div className="series-loop-editor-inner">
						<div className="series-loop-editor-header">
							<span className="series-loop-editor-label">
								{__("Series Loop", "chris-radtke-portfolio-blocks")}
							</span>
							<span className="series-loop-editor-term">
								{selectedTermLabel}
							</span>
						</div>

						{postsLoading && <Spinner />}

						{!postsLoading && previewPosts.length === 0 && (
							<p className="series-loop-editor-empty">
								{__(
									"No Series posts found for this term.",
									"chris-radtke-portfolio-blocks",
								)}
							</p>
						)}

						{!postsLoading && previewPosts.length > 0 && (
							<ul className="series-loop-editor-list">
								{previewPosts.map((post) => {
									const thumbUrl =
										post?._embedded?.["wp:featuredmedia"]?.[0]?.media_details
											?.sizes?.medium?.source_url ??
										post?._embedded?.["wp:featuredmedia"]?.[0]?.media_details
											?.sizes?.thumbnail?.source_url;
									const seriesYears = post?.meta?.["_series_years"];

									return (
										<li key={post.id} className="series-loop-editor-item">
											<div className="series-loop-editor-item-wrapper">
												{showThumbnail && thumbUrl && (
													<div
														className="series-loop-editor-thumb"
														style={{ backgroundImage: `url(${thumbUrl})` }}
														aria-hidden="true"
														tabIndex={-1}
													></div>
												)}
												{showTitle && (
													<h6 className="series-loop-editor-title">
														{seriesYears && (
															<>
																<span className="series-loop-editor-years">
																	{seriesYears}
																</span>
																<span
																	className="series-loop-editor-separator"
																	aria-hidden="true"
																>
																	{" | "}
																</span>
															</>
														)}
														<span>{decodeEntities(post.title.rendered)}</span>
													</h6>
												)}
											</div>
										</li>
									);
								})}
								{previewPosts.length > postsPerPage && (
									<li className="series-loop-editor-more">
										{sprintf(
											__(
												"+ %d more posts on the frontend",
												"chris-radtke-portfolio-blocks",
											),
											postsPerPage - previewPosts.length,
										)}
									</li>
								)}
							</ul>
						)}
					</div>
				)}
			</div>
		</>
	);
}
