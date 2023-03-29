import TeleBot from 'telebot';
import fs from 'fs';

const CHAT_ID = -612155657;
const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);
let lastPidor = '';

const checkChat = (msg) => {
  console.log('id', msg.chat.id);
  return msg.chat.id !== CHAT_ID;
};

const convertStringToArray = (fileContent) =>
  fileContent.split('\n').map((str) => {
    const [name, count] = str.split('-');
    return { name, count };
  });

const convertArrayToString = (array) =>
  `${array[0].name}-${array[0].count}\n${array[1].name}-${array[1].count}`;

const checkTimeOut = () => {
  const now = new Date(Date.now());
  const nowDate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

  const fileContent = fs.readFileSync('lastDate.txt', 'utf8');

  if (new Date(nowDate) > new Date(fileContent)) {
    fs.writeFile('lastDate.txt', nowDate, function (error) {
      if (error) {
        console.log('Произошла ошибка записи в файл');
      }
    });

    return true;
  }

  return false;
};

const statistics = (msg) => {
  if (checkChat(msg)) {
    return msg.reply.text('Не надо мне писать');
  }

  fs.readFile('db.txt', 'utf8', function (error, fileContent) {
    if (error) {
      return console.log('Произошла ошибка чтения файла statistics', error);
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

const run = (msg) => {
  if (checkChat(msg)) {
    return msg.reply.text('Не надо мне писать');
  }

  fs.readFile('db.txt', 'utf8', function (error, fileContent) {
    if (error) {
      return console.log('Произошла ошибка чтения файла run');
    }

    if (!checkTimeOut()) {
      const str = lastPidor
        ? `${lastPidor} будет пидором весь день`
        : 'Пойдем к Алпатову и Гальченко завтра';
      return msg.reply.text(str);
    }

    msg.reply.text('Идем к Алпатову и Гальченко 🏃‍♂️');
    setTimeout(() => {
      msg.reply.text('Анализируем capacity 📊');
    }, 1000);

    setTimeout(() => {
      msg.reply.text('Опрашиваем команду 🤮🤧🤯🥸');
    }, 2000);

    setTimeout(() => {
      const random = Math.round(Math.random());

      const pidors = convertStringToArray(fileContent);

      pidors[random].count = +pidors[random].count + 1;

      const str = convertArrayToString(pidors);
      fs.writeFile('db.txt', str, function (error) {
        if (error) {
          console.log('Произошла ошибка записи в файл');
        }
      });

      lastPidor = pidors[random].name;
      msg.reply.text(`Сегодня пидр - ${pidors[random].name}🤴`);
    }, 3000);
  });
};

bot.on('/run', run);
bot.on('/statistics', statistics);

export default bot;
