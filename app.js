const TelegramBot = require('node-telegram-bot-api');
const request = require('request');

const token = '1073202510:AAE_iwwGYBkTW_y0e_Rh5MeAceSiAF39MH8';

const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/curse/, (msg, match) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Какая валюта вас интересует",{
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '€ - EUR',
            callback_data: 'EUR'
          },
          {
            text: '$ - USD',
            callback_data: 'USD',
          },
          {
            text: '₽ - RUR',
            callback_data: 'RUR',
          },
          {
            text: '₿ - BTC',
            callback_data: 'BTC',
          }
        ]
      ]
    }
  });
});

bot.on('callback_query',query=>{
  const id = query.message.chat.id;

  request('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5', function(error, response, body){
    const data =JSON.parse(body);
    const result = data.filter(item => item.ccy === query.data)[0];
    let md = `
    *${result.ccy} => ${result.base_ccy}*
    Buy: _${result.buy}_
    Sale: _${result.sale}_
    `;
    bot.sendMessage(id,md,{parse_mode: 'Markdown'});
  })
})