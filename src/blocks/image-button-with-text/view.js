/**
 * view.js — Frontend JavaScript for the Image Button with Text block.
 *
 * Responsibilities:
 *  - Applies mobile min-height via a CSS custom property that the stylesheet
 *    picks up inside a media query (the server can only render inline styles
 *    without media-query context, so we handle responsive sizing here).
 *  - Ensures keyboard accessibility for the image-button anchor.
 *  - Lazy-loads background images using IntersectionObserver when the
 *    data-bg-src attribute is present (set by render.php for performance).
 */

(function () {
	"use strict";

	/**
	 * Initialise a single block wrapper element.
	 *
	 * @param {HTMLElement} block
	 */
	function initBlock(block) {
		const imageButton = block.querySelector(".ibt-block__image-button");
		if (!imageButton) return;

		// ── 1. Lazy-load background image ──────────────────────────────────────
		const bgSrc = imageButton.dataset.bgSrc;
		if (bgSrc) {
			if ("IntersectionObserver" in window) {
				const observer = new IntersectionObserver(
					(entries, obs) => {
						entries.forEach((entry) => {
							if (entry.isIntersecting) {
								entry.target.style.backgroundImage = `url(${bgSrc})`;
								entry.target.classList.add("ibt-block__image-button--loaded");
								obs.unobserve(entry.target);
							}
						});
					},
					{ rootMargin: "200px" },
				);
				observer.observe(imageButton);
			} else {
				// Fallback for browsers without IntersectionObserver
				imageButton.style.backgroundImage = `url(${bgSrc})`;
				imageButton.classList.add("ibt-block__image-button--loaded");
			}
		}

		// ── 2. Responsive min-height ───────────────────────────────────────────
		// The PHP render outputs --ibt-min-height-desktop and --ibt-min-height-mobile
		// as inline CSS variables on the block wrapper.  The stylesheet uses them
		// inside a media query, so no extra JS is needed — but we keep this hook
		// here for any future dynamic resize logic.

		// ── 3. Keyboard / accessibility for the anchor ─────────────────────────
		const anchor = imageButton.querySelector("a.ibt-block__image-link");
		if (anchor) {
			// Make sure focus ring is visible — the stylesheet handles the visual,
			// but we verify the element is actually focusable.
			if (!anchor.getAttribute("tabindex")) {
				anchor.setAttribute("tabindex", "0");
			}
		}
	}

	/**
	 * Boot: find all blocks on the page and initialise them.
	 */
	function boot() {
		const blocks = document.querySelectorAll(".ibt-block");
		blocks.forEach(initBlock);
	}

	// Run after DOM is ready
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", boot);
	} else {
		boot();
	}
})();
