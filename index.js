const http = require("http")
const axios = require("axios")
const cheerio = require("cheerio")
const fs = require("fs");


const server = http.createServer(async(req, res) => {
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
        }

        // Build simple HTML homepage
        let html = "<h1>Horoscopes</h1>";

        results.forEach(item => {
            html += `
                <h2>${item.sign.toUpperCase()}</h2>
                <p><b>Date:</b> ${item.date}</p>
                <p>${item.horoscope}</p>
                <hr/>
            `;
        });

        // res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
        // Save to file
        fs.writeFileSync(
            "horoscopes.json",
            JSON.stringify(results, null, 2)
        );

    } catch (error) {
        console.log("Error:", error.message);
        res.writeHead(500);
        res.end("Failed to scrape horoscopes");
    }








})





server.listen(8080, () => console.log("Server is running in port 8080"))