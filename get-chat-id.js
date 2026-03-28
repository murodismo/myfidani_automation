require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token || token === 'YOUR_BOT_TOKEN_HERE') {
  console.error('❌ XATO: .env fayliga TELEGRAM_BOT_TOKEN ni yozing!');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

console.log('🚀 Bot ishga tushdi...');
console.log('1. Botni guruhga qo\'shing.');
console.log('2. Guruhga biror xabar yuboring.');
console.log('-----------------------------------');

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const chatTitle = msg.chat.title || 'Shaxsiy chat';
  console.log(`✅ CHAT ID TOPILDI!`);
  console.log(`Guruh nomi: ${chatTitle}`);
  console.log(`Chat ID: ${chatId}`);
  console.log('-----------------------------------');
  console.log('Endi bu ID ni .env fayliga TELEGRAM_CHAT_ID o\'rniga yozing.');
  process.exit(0);
});
