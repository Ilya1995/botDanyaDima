import TeleBot from 'telebot';

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

const convertStringToArray = (fileContent) =>
  fileContent.split('\n').map((str) => {
    const [name, count] = str.split('-');
    return { name, count };
  });

const statistics = (msg) => {
  if (checkChat(msg)) {
    return msg.reply.text('Не надо мне писать');
  }

  fs.readFile('db.txt', 'utf8', function (error, fileContent) {
    if (error) {
      return console.log('Произошла ошибка чтения файла');
    }

    const pidors = convertStringToArray(fileContent);
    const sortedPidors = pidors.sort((a, b) => (a.count < b.count ? 1 : -1));

    msg.reply.text(`
        Топ пидоров:
  🥇 ${sortedPidors[0].name} — ${sortedPidors[0].count}
  🥈 ${sortedPidors[1].name} — ${sortedPidors[1].count}
      `);
  });
};

bot.on('/statistics', statistics);

export default bot;

// const { Telegraf } = require('telegraf');
// const fs = require('fs');

// const CHAT_ID = -612155657;
// const TOKEN = '5663283405:AAFTQlb_Y7auaKmbVE04AqtV7YMgh8BCj1o';
// let lastPidor = '';

// const convertStringToArray = (fileContent) =>
//   fileContent.split('\n').map((str) => {
//     const [name, count] = str.split('-');
//     return { name, count };
//   });

// const convertArrayToString = (array) =>
//   `${array[0].name}-${array[0].count}\n${array[1].name}-${array[1].count}`;

// const checkChat = (ctx) => {
//   console.log(ctx.update?.message?.chat?.id);
//   return ctx.update?.message?.chat?.id !== CHAT_ID;
// };

// const checkTimeOut = () => {
//   const now = new Date(Date.now());
//   const nowDate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

//   const fileContent = fs.readFileSync('lastDate.txt', 'utf8');

//   if (new Date(nowDate) > new Date(fileContent)) {
//     fs.writeFile('lastDate.txt', nowDate, function (error) {
//       if (error) {
//         console.log('Произошла ошибка записи в файл');
//       }
//     });

//     return true;
//   }

//   return false;
// };

// const run = (ctx) => {
//   if (checkChat(ctx)) {
//     return ctx.reply('Не надо мне писать');
//   }

//   fs.readFile('db.txt', 'utf8', function (error, fileContent) {
//     if (error) {
//       return console.log('Произошла ошибка чтения файла');
//     }

//     if (!checkTimeOut()) {
//       const str = lastPidor
//         ? `${lastPidor} будет пидором весь день`
//         : 'Пойдем к Алпатову и Гальченко завтра';
//       return ctx.reply(str);
//     }

//     ctx.reply('Идем к Алпатову и Гальченко 🏃‍♂️');
//     setTimeout(() => {
//       ctx.reply('Анализируем capacity 📊');
//     }, 1000);

//     setTimeout(() => {
//       ctx.reply('Опрашиваем команду 🤮🤧🤯🥸');
//     }, 2000);

//     setTimeout(() => {
//       const random = Math.round(Math.random());

//       const pidors = convertStringToArray(fileContent);

//       pidors[random].count = +pidors[random].count + 1;

//       const str = convertArrayToString(pidors);
//       fs.writeFile('db.txt', str, function (error) {
//         if (error) {
//           console.log('Произошла ошибка записи в файл');
//         }
//       });

//       lastPidor = pidors[random].name;
//       ctx.reply(`Сегодня пидр - ${pidors[random].name}🤴`);
//     }, 3000);
//   });
// };

// const statistics = (ctx) => {
//   if (checkChat(ctx)) {
//     return ctx.reply('Не надо мне писать');
//   }

//   fs.readFile('db.txt', 'utf8', function (error, fileContent) {
//     if (error) {
//       return console.log('Произошла ошибка чтения файла');
//     }

//     const pidors = convertStringToArray(fileContent);
//     const sortedPidors = pidors.sort((a, b) => (a.count < b.count ? 1 : -1));

//     ctx.reply(`
//       Топ пидоров:
// 🥇 ${sortedPidors[0].name} — ${sortedPidors[0].count}
// 🥈 ${sortedPidors[1].name} — ${sortedPidors[1].count}
//     `);
//   });
// };

// const bot = new Telegraf(TOKEN);

// bot.command('run', run);
// bot.command('statistics', statistics);

// bot.launch();

// process.once('SIGINT', () => bot.stop('SIGINT'));
// process.once('SIGTERM', () => bot.stop('SIGTERM'));
