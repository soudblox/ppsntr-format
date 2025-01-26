/** @type {HTMLButtonElement | null} */
const button = document.querySelector("#button");
/** @type {HTMLBodyElement | null} */
const result = document.querySelector("#result");

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
			return alert("empty");
		};
		const query = DOMPurify.sanitize(value);

		if (auto?.disabled) {
			const body = await fetch("/searchFormatted", {
				method: "POST",
				body: JSON.stringify({ query }),
				headers: { "Content-Type": "application/json" }
			});
			const results = await body.text();

			if (copyornot?.checked) navigator.clipboard.writeText(results);
			result.textContent = results || "err";
		} else {
			const body = await fetch("/format", {
				method: "POST",
				body: JSON.stringify({ text: query }),
				headers: { "Content-Type": "application/json" }
			});
			const results = await body.text();

			if (copyornot?.checked) navigator.clipboard.writeText(results);
			result.textContent = results || "err";
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
	if (isManual) {
		input.value = "";
		auto.disabled = false;
		manual.disabled = true;
		input.rows = 10;
		input.placeholder = "Lirik";
	} else {
		input.value = "";
		auto.disabled = true;
		manual.disabled = false;
		input.rows = 1;
		input.placeholder = "Nomor PS";
	}
}