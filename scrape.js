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
    // --- Taurus Focused (Grounded, Patience, Luxury, Stability) ---
    "Nature does not hurry, yet everything is accomplished.",
    "Invest in your peace; it pays the highest dividends.",
    "True wealth is a quiet mind and a comfortable life.",
    "Consistency is the secret sauce of greatness.",
    "Be stubborn about your goals, but flexible about your methods.",
    "Growth takes time. Trust the roots you are building.",
    "Comfort isn't just a place; it's a state of being.",

    // --- Scorpio Focused (Intensity, Transformation, Intuition, Power) ---
    "The phoenix must burn to emerge from the ashes.",
    "Do not fear the dark; it is where stars are born.",
    "Your intensity is not a flaw; it is your superpower.",
    "To transform your life, you must first master your depth.",
    "Power isn't loud; it's the quiet certainty within you.",
    "Let go of what is heavy, and make space for what is true."
];

const TASKS = [
    "Finish the project you started",
    "Apply for the JOb",
    "Revise what you did today",
    "Spend some time for health",
    "Be kind And respectful to husband", 
    // --- Taurus Tasks (Sensory, Stability, Practicality) ---
    "Organize your finances and check your savings goals",
    "Cook a comforting, healthy meal from scratch",
    "Spend 15 minutes grounding barefoot in nature or tending to plants",
    "Declutter your immediate physical workspace for ultimate comfort",
    "Stretch your body and give yourself a well-deserved neck massage",
    "Buy yourself a small, high-quality treat to celebrate your hard work",
    "Stick firmly to your morning routine without checking your phone first",

    // --- Scorpio Tasks (Depth, Emotional Release, Focus) ---
    "Journal your deepest thoughts to release any lingering resentment",
    "Have a deeply honest, uninterrupted conversation with a loved one",
    "Dive into a complex problem that requires deep, uninterrupted research",
    "Practice a 10-minute digital detox to protect your energetic boundaries",
    "Forgive someone or let go of a minor grudge from this week",
    "Listen to your raw intuition on a decision you've been overthinking",
    "Do something solo today to recharge your mysterious inner world",
    "Plan a meaningful, intimate date night or gesture for your partner"
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
