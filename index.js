const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions} = require('./options');
const token = '1855191476:AAFfJiV3XjL1VqJxCgPbTVLDcBEhSexMRhI';

const bot = new TelegramApi(token, {polling: true});

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты попробуй её отгадать');
      const randomNumber = Math.floor(Math.random() * 10);
      chats[chatId] = randomNumber;
      await bot.sendMessage(chatId, 'Отгадывай!', gameOptions);
};

const start = () => {
  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
  
    bot.setMyCommands([
      { command: '/start', description: 'Начальное приветствие'},
      { command: '/info', description: 'Получить информацию о пользователе'},
      { command: '/game', description: 'Игра "Угадай число"'},
    ]);
  
    if (text === '/start') {
      await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp');
      return bot.sendMessage(chatId, `Добро пожаловать в телеграмм бот yigres`);  
    }
  
    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
    }

    if (text === '/game') {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, 'Я тебя не понимаю, попробу   еще раз!');
  })

  bot.on('callback_query', (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/again') {
      return startGame(chatId);
    }
    if (data == chats[chatId]) {
      return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions);  
    } else {
      return bot.sendMessage(chatId, `К сожалению ты не отгадал, бот загадал цифру ${chats[chatId]}`, againOptions);  
    }
  })
};

start();