const Config = require('config');
const sapcai = require('sapcai').default;

const sapcaiClient = new sapcai.request(Config.get('services.sap.token'));

async function handleMessage(message, bot) {
  try {
    if (message.author.bot) {
      console.log(`[MessageId=${message.id}] Message was sent by a Bot.`);

      return;
    }

    if (!message.content) {
      console.log(`[MessageId=${message.id}] Message with no content.`);

      return;
    }

    if (message.content.startsWith('+')) {
      await message.reply('Mes commandes ne sont pas encore implémentées !');

      return;
    } else if (message.content.match(/bot |bot'baddon|botbaddon/i) || message.content.includes(`<@${bot.user.id}>`)) {
      console.log(`[MessageId=${message.id}] Natural language handling.`);

      const analyzed = await sapcaiClient.analyseText(message.content);

      if (analyzed.intents.length === 0) {
        console.log(`[MessageId=${message.id}] No intent detected in the sentence.`);

        await message.channel.send("J'ai bien peur de ne pas savoir comment t'aider :(");

        return;
      }

      if (analyzed.intents[0].confidence < 0.80) {
        console.log(`[MessageId=${message.id}] Detected intent has a confidence below 90%.`);

        await message.channel.send("J'ai bien peur de ne pas savoir comment t'aider :(");

        return;
      }

      switch (analyzed.intents[0].slug) {
        case 'bonjour':
          await message.channel.send(`Coucou <@${message.author.id}> !`);
          break;
        case 'maitre':
          await message.channel.send(`Mon seigneur et maître est le ${'Grand'} Nakasar le ${'Magnifique'}.`);
          break;
        case 'soit-mechant':
          if (message.author.id !== '186208105502081025') {
            await message.channel.send(`Qui es-tu pour me donner des ordres, Mortel ?`);
          } else {
            await message.channel.send(`Oh mais avec plaisir, Maître ! Ca va faire mal !`);
          }

          break;
        default:
          await message.channel.send("Je ne peux pas encore répondre à cela, mais c'est prévu !");
      }
    }
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  handleMessage,
};
