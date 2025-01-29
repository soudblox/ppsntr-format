import "dotenv/config";
import express, { Express } from "express";
import path from "path";
import morgan from "morgan";
import * as cheerio from "cheerio";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.post("/format", (req, res) => {
	const { text }: FormatInput = req.body;
	const formatted = lyricsFormatter(text);

	res.send(formatted);
});

app.post("/search", async (req, res) => {
	const { query } = req.body;
	const results = await searchSongs(query);

	res.send(results);
})

app.post("/scrape", async (req, res) => {
	const { link } = req.body;
	const scraped = await scrapeLyrics(link);

	res.send(scraped);
})

app.post("/searchFormatted", async (req, res) => {
	const { query } = req.body;
	const results = await searchSongs(query);
	if (!results) {
		res.status(404).send();
		return;
	}
	const lyrics = await scrapeLyrics(results);
	if (!lyrics) {
		res.status(404).send();
		return;
	}
	const formatted = lyricsFormatter(lyrics);
	res.send(formatted);
})

app.listen(port, () => {
	console.log(`[server]: Server is running at port ${port}`);
});

async function searchSongs(input: string): Promise<string | undefined> {
	// temporary until i fix my server
	const res = await fetch(`https://ppsntr.nick8x.workers.dev/?__url=https://lagumisakatolik.com/?s=${input}&ct_post_type=post%3Apage`);
	const body = await res.text();

	const $ = cheerio.load(body);
	const attr = $(".entry-title a")
	const link = attr.attr("href") || undefined;
	return link;
};

async function scrapeLyrics(link: string): Promise<string | undefined> {
	if (!link) return;
	const res = await fetch(`https://ppsntr.nick8x.workers.dev/?__url=${link}`);
	const body = await res.text();

	const $ = cheerio.load(body);
	const attr = $("blockquote p").map((a, e) => {
		return $(e).find("br").replaceWith("\n").end().text();
	})
		.get()
		.join("\n");
	return attr;
}

function lyricsFormatter(input: string): string {
	const split = input.split("\n");
	let final: string[] = [];

	for (let i of split) {
		i = i.replace(/[ ,;:./]*$/, ""); // removes trailing symbols
		if (i.includes("Bait") || i.includes("Ayat")) { // automatic verse grouping
			const num = i.match(/\d+/g);
			i = (`\nVerse ${num?.[0]}`);
		} else if (i.includes("Ulangan")) { // automatic chorus grouping
			i = "\nChorus";
		}
		final.push(i);
	}
	return final.join("\n").trim();
}