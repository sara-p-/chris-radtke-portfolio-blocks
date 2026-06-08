/**
 * Accordion block — view.js
 * Front-end interaction script.
 */

(function () {
	const PLUS_ICON = '<path d="M13 5h-2v6H5v2h6v6h2v-6h6v-2h-6z" />';
	const MINUS_ICON = '<path d="M5 11h14v2H5z" />';

	function setToggleState(toggle, label, icon, isOpen) {
		toggle.setAttribute("aria-expanded", String(isOpen));
		toggle.classList.toggle("is-open", isOpen);
		label.textContent = isOpen ? "See less" : "read more";
		icon
			.querySelector("path")
			.setAttribute(
				"d",
				isOpen ? "M5 11h14v2H5z" : "M13 5h-2v6H5v2h6v6h2v-6h6v-2h-6z",
			);
	}

	function initAccordion(accordion) {
		const panel = accordion.querySelector(".wp-block-accordion__panel");
		const toggle = accordion.querySelector(".wp-block-accordion__toggle");
		const label =
			toggle && toggle.querySelector(".wp-block-accordion__toggle-label");
		const icon =
			toggle && toggle.querySelector(".wp-block-accordion__toggle-icon svg");

		if (!panel || !toggle || !label || !icon) return;

		const startsOpen = accordion.classList.contains("is-open");

		// Set up panel for max-height animation.
		panel.style.overflow = "hidden";
		panel.style.maxHeight = startsOpen ? panel.scrollHeight + "px" : "0px";
		panel.style.transition = "max-height 0.35s ease";

		// Sync initial toggle state.
		setToggleState(toggle, label, icon, startsOpen);

		toggle.addEventListener("click", function () {
			const isOpen = toggle.classList.contains("is-open");

			if (isOpen) {
				// Collapse.
				panel.style.maxHeight = panel.scrollHeight + "px";
				panel.getBoundingClientRect(); // force reflow
				panel.style.maxHeight = "0px";
				accordion.classList.remove("is-open");
				setToggleState(toggle, label, icon, false);
			} else {
				// Expand.
				panel.style.maxHeight = panel.scrollHeight + "px";
				accordion.classList.add("is-open");
				setToggleState(toggle, label, icon, true);

				// Release fixed max-height after transition so panel can grow freely.
				panel.addEventListener("transitionend", function onEnd() {
					if (toggle.classList.contains("is-open")) {
						panel.style.maxHeight = "none";
					}
					panel.removeEventListener("transitionend", onEnd);
				});
			}
		});
	}

	document
		.querySelectorAll(
			".wp-block-chris-radtke-portfolio-blocks-simple-accordion-item",
		)
		.forEach(initAccordion);
})();
