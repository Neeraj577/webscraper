const axios = require("axios")
const cheerio = require("cheerio")
const fs = require("fs");


async function scraper() {
    try {
        const horos = ["scorpio", "taurus", "gemini"];
        const results = [];

        for (const sign of horos) {
            const url = `https://www.astrology.com/horoscope/daily/${sign}.html`;

            //fetch to html
            const response = await axios.get(url);

            //load HTML into cheerio
            const $ = cheerio.load(response.data);

            // Find horoscope paragraph
            const horoscope = $(".horoscope-main #content").first().text().trim();
            const date = $(".horoscope-main .grid-2c").first().text().trim().slice(0, 13);
            results.push({ horoscope, date, sign });
            // 1. Create a single data object
            const dataEntry = { horoscope, date, sign };

            // 2. Convert it to a single string line with a newline at the end
            const stringLine = JSON.stringify(dataEntry) + "\n";

            // 3. Append directly to the file (creates file if missing)
            fs.appendFileSync("horoscopes.json", stringLine);
        }
    } catch (error) {
        console.log("Error:", error.message);
        // res.writeHead(500);
        // res.end("Failed to scrape horoscopes");
    }
}










scraper();