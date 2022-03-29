import fetch from "node-fetch";
import TgApi from "node-telegram-bot-api";
import fs from "fs"


function getKey() {
    let keys = [];
    fs.readFileSync('./token.txt', 'utf-8').split(/\r?\n/).forEach(line =>  {
        keys.push(line.toString());
    });
    return keys;
}

const TOKEN = getKey()[0];
const CUR_API_TOKEN = getKey()[1];

const bot = new TgApi(TOKEN, {polling: true});

async function rubToUsdAndEur() {
    const usd = (await (await fetch(`https://freecurrencyapi.net/api/v2/latest?apikey=${CUR_API_TOKEN}&base_currency=USD`)).json()).data.RUB;
    const eur = (await (await fetch(`https://freecurrencyapi.net/api/v2/latest?apikey=${CUR_API_TOKEN}&base_currency=EUR`)).json()).data.RUB;
    console.log(usd);
    return [usd, eur];
}

bot.setMyCommands([
    {command: "/start", description: "Начальное приветствие"},
    {command: '/check_rub', description: "НЕ ПАДАТЬ"},
])

bot.on('message', (msg) => {
    if(msg.text === '/start') {
        bot.sendSticker(msg.chat.id, "https://tlgrm.ru/_/stickers/625/0dc/6250dc3d-4d03-4d5c-9d42-2f9b92ab9c78/7.webp")
        bot.sendMessage(msg.chat.id, "Официальный бот компании Thomas Shelby Limited.");
    }else {
        if(msg.text === '/check_rub') {
            const curRate = rubToUsdAndEur();
            curRate.then( r => {
                bot.sendMessage(msg.chat.id, `Текущий курс рубля к основным валютам.\nUSD/RUB: ${r[0]}\nEUR/RUB: ${r[1]}`);
            })
            return;
        }
    }
});
