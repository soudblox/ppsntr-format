/** @type {HTMLButtonElement | null} */
const button = document.querySelector("#button");
/** @type {HTMLBodyElement | null} */
const result = document.querySelector("#result");
/** @param {string} text */
const unsecuredCopyToClipboard = (text) => { const textArea = document.createElement("textarea"); textArea.value = text; document.body.appendChild(textArea); textArea.focus(); textArea.select(); try { document.execCommand('copy') } catch (err) { toastr.error("Unable to copy"); console.error('Unable to copy to clipboard', err) } document.body.removeChild(textArea) };

if (button && result) {
	button.addEventListener("click", (async () => {
		/** @type {HTMLTextAreaElement | null} */
		const input = document.querySelector("#input");
		/** @type {HTMLInputElement | null} */
		const copyornot = document.querySelector("#copy");
		/** @type {HTMLButtonElement | null} */
		const auto = document.querySelector("#auto");
		const value = input?.value;
		if (!value) {
			return toastr.error("No input");
		};
		const query = DOMPurify.sanitize(value);

		if (auto?.disabled) {
			toastr.info("Loading...");
			const body = await fetch("/searchFormatted", {
				method: "POST",
				body: JSON.stringify({ query }),
				headers: { "Content-Type": "application/json" }
			});
			const results = await body.text();
			if (!results || body.status !== 200) return toastr.error("Unable to find lyrics")

			if (copyornot?.checked) {
				if (window.isSecureContext && navigator.clipboard) navigator.clipboard.writeText(results);
				else unsecuredCopyToClipboard(results);
			}
			toastr.success("Success!");
			result.textContent = results;
		} else {
			toastr.info("Loading...");
			const body = await fetch("/format", {
				method: "POST",
				body: JSON.stringify({ text: query }),
				headers: { "Content-Type": "application/json" }
			});
			const results = await body.text();
			if (!results || body.status !== 200) return toastr.error("Unable to format lyrics")

			if (copyornot?.checked) {
				if (window.isSecureContext && navigator.clipboard) navigator.clipboard.writeText(results);
				else unsecuredCopyToClipboard(results);
			}
			toastr.success("Success!");
			result.textContent = results;
		}
	}))
} else {
	console.log(button, result)
}

document.querySelector("#manual")?.addEventListener("click", () => toggleMode(true));
document.querySelector("#auto")?.addEventListener("click", () => toggleMode(false));

/** @param {Boolean} isManual */
function toggleMode(isManual) {
	/** @type {HTMLButtonElement | null} */
	const auto = document.querySelector("#auto");
	/** @type {HTMLButtonElement | null} */
	const manual = document.querySelector("#manual");
	/** @type {HTMLTextAreaElement | null} */
	const input = document.querySelector("#input");

	if (!auto || !manual || !input) return;

	auto.classList.add('mode-button');
	manual.classList.add('mode-button');

	input.style.opacity = '0';
	input.style.transform = 'translateY(10px)';

	setTimeout(() => {
		if (isManual) {
			input.value = "";
			auto.disabled = false;
			manual.disabled = true;
			input.rows = 10;
			input.placeholder = "Place song lyrics here...";
		} else {
			input.value = "";
			auto.disabled = true;
			manual.disabled = false;
			input.rows = 1;
			input.placeholder = "Place song number here...";
		}

		input.style.opacity = '1';
		input.style.transform = 'translateY(0)';
		input.classList.add('fade-in');
	}, 150);

	setTimeout(() => {
		input.classList.remove('fade-in');
	}, 300);
}