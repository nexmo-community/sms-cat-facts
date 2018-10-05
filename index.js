require('dotenv').load();
const Nexmo = require('nexmo');

// Constants
const API_KEY = process.env.NEXMO_API_KEY;
const API_SECRET = process.env.NEXMO_API_SECRET;
const NEXMO_NUMBER = process.env.NEXMO_NUMBER;

const WELCOME_MESSAGE = "Welcome to cat facts! Your #1 source for furry-feline-factual-fun! =^.^="
const CANCEL_KEYWORDS = ["CANCEL", "STOP", "NO MORE", "HALT", "#(@$*)(@", "WHY ME", "CATS R COOL"];

const nexmo = new Nexmo({
    apiKey: API_KEY,
    apiSecret: API_SECRET
});

function generateCancelMessage() {
    const keyword = CANCEL_KEYWORDS[Math.floor(Math.random() * CANCEL_KEYWORDS.length)];
    return `\nReply ${keyword} to stop.`;
}

function registerNumber(number) {
    const message = WELCOME_MESSAGE + generateCancelMessage();
    nexmo.message.sendSms(NEXMO_NUMBER, number, message);
}