import express, { Express } from "express";
import path from "path";

const app: Express = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.get("/hi", (_, res) => {
	res.send("Express + TypeScript Server");
});

app.post("/format", (req, res) => {
	const { text }: FormatInput = req.body;
	const split = text.split("\n");
	let final: string[] = [];

	for (let i of split) {
		i = i.replace(/[ ,;:./]*$/, ""); // removes trailing symbols
		if (i.includes("Bait") || i.includes("Ayat")) { // automatic verse grouping
			const num = i.match(/\d+/g);
			i = (`Verse ${num?.[0]}`);
		} else if (i.includes("Ulangan")) { // automatic chorus grouping
			i = "\nChorus";
		}
		final.push(i);
	}
	console.log(final.join("\n"));

	res.send(final.join("\n"));
})

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});