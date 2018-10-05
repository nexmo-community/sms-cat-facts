require('dotenv').load();

// Constants
const API_KEY = process.env.NEXMO_API_KEY;
const API_SECRET = process.env.NEXMO_API_SECRET;
const NEXMO_NUMBER = process.env.NEXMO_NUMBER;

const CANCEL_KEYWORDS = ["CANCEL", "STOP", "NO MORE", "HALT", "#(@$*)(@", "WHY ME", "CATS R COOL"];

function generateCancelMessage() {
    const keyword = CANCEL_KEYWORDS[Math.floor(Math.random() * CANCEL_KEYWORDS.length)];
    return `\nReply ${keyword} to stop.`;
}

console.log(generateCancelMessage());