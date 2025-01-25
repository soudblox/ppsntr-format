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
		const value = input?.value;
		console.log(value);

		if (!value) {
			return alert("empty");
		};
		const text = DOMPurify.sanitize(value);
		console.log(text);

		const body = await fetch("/format", {
			method: "POST",
			body: JSON.stringify({ text }),
			headers: { "Content-Type": "application/json" }
		});
		const results = await body.text();

		if (copyornot?.checked) navigator.clipboard.writeText(results);
		result.textContent = results || "err";
	}))
} else {
	console.log(button, result)
}