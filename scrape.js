const axios = require("axios")
const cheerio = require("cheerio")
const fs = require("fs");
const { sendMail } = require("./mail");

const ROUTING = {
    scorpio: "nick.deuja045@gmail.com",
    taurus: "sisriksha780@gmail.com",
    // change if needed
};

const QUOTES = [
    "Believe you can and you're halfway there.",
    "It always seems impossible until it's done.",
    "You are stronger than you think.",
    "Small steps every day lead to big results.",
    "Your only limit is your mind.",
    "Hard times never last, but hard people do.",
    "Dream it. Wish it. Do it.",
];

const TASKS = [
    "Finish the project you started",
    "Apply for the JOb",
    "Revise what you did today",
    "Spend some time for health",
    "Be kind And respectful to husband"
]

function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
async function scraper() {
    try {
        const horos = Object.keys(ROUTING);
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
            // Build email body
            const body =
                `🔮 ${sign.toUpperCase()} Horoscope — ${date}\n\n` +
                `${horoscope}\n\n` +
                `─────────────────────----------------------\n` +
                `💪 Quote of the day:\n` +
                `"${random(QUOTES)}"` +
                `─────────────────────----------------------\n` +
                `🚜👷🚧🏗️ Task of the day:\n` +
                `Please do your list part ${random(TASKS)}`;

            // Send to the right person
            const to = ROUTING[sign];
            await sendMail(body, to);
            console.log(`📬 Sent ${sign} horoscope to ${to}`);
        }
    } catch (error) {
        console.log("Error:", error.message);
        // res.writeHead(500);
        // res.end("Failed to scrape horoscopes");
    }
}










scraper();