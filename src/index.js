const Config = require('config');
const Discord = require('discord.js');
const bot = new Discord.Client();

const { handleMessage } = require('./hub');

bot.on('ready', () => {
  console.group('Initialization');

  console.log(`Logged in as ${bot.user.tag}!`);

  console.groupEnd();
});

bot.on('debug', info => {
  if (Config.get('debug')) {
    console.debug(info);
  }
});

bot.on('disconnect', event => {
  console.error('Disconnected');
});

bot.on('error', error => {
  console.error(error);
});

bot.on('warn', info => {
  console.warn(info);
});

bot.on('message', async message => {
  console.log(`[MessageId=${message.id}] Handling message.`);

  await handleMessage(message, bot);

  console.log(`[MessageId=${message.id}] Message handled.`);
});

bot.login(Config.get('token')).then(() => {
  console.log('Login successfull.');
}).catch(error => {
  console.error(error);

  process.exit(1);
});
