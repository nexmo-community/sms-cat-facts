require('dotenv').load();
const Nexmo = require('nexmo');
const Hapi = require('hapi');
const Axios = require('axios');

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

const server = Hapi.Server({
    port: process.env.PORT || 8080
});

server.route({
    method: 'GET',
    path: '/register/{number}',
    handler: async (request, h) => {
        await registerNumber(request.params.number);
        return h.response().code(204);
    }
})

server.route({
    method: 'POST',
    path: '/webhooks/receive',
    handler: async (request, h) => {
        const sender = request.payload.to;
        const recipient = request.payload.msisdn;
        await sendCatFact(sender, recipient);
        return h.response().code(204);
    }
})

async function init() {
    await server.start();
    console.log(`Server started at: ${server.info.uri}`)
}

function generateCancelMessage() {
    const keyword = CANCEL_KEYWORDS[Math.floor(Math.random() * CANCEL_KEYWORDS.length)];
    return `\nReply ${keyword} to stop.`;
}

function registerNumber(number) {
    const message = WELCOME_MESSAGE + generateCancelMessage();
    nexmo.message.sendSms(NEXMO_NUMBER, number, message);
}

async function sendCatFact(sender, recipient) {
    const fact = await retrieveCatFact();
    const message = fact + generateCancelMessage();
    nexmo.message.sendSms(sender, recipient, message);
}

async function retrieveCatFact() {
    const response = await Axios.get('https://catfact.ninja/fact');
    return replaceSmartQuotes(response.data.fact);
}

function replaceSmartQuotes(string) {
    // The Cat Fact API uses smart quotes which require sending messages as unicode.
    // You can send unicode messages with Nexmo, but it's easier to just replace them.
    return string.replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
}

init();