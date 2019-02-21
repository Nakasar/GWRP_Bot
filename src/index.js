'use strict';
var Discord = require('discord.js'),
  axios = require('axios');

var bot = new Discord.Client();

var hub = require('./hub')();

bot.on('ready', () => {
  console.log('Logged in as %s - %s\n', bot.user.username, bot.user.id);
  bot.user.setGame(`Bot GW2RP : +aide`);
  console.log("I am connected to : " + bot.guilds.map(g => g.name).join(", "));
});

bot.on('guildCreate', guild => {
  console.log(`Joined ${guild.name} (id: ${guild.id}).`);
});

bot.on('message', message => {
  // ignore bots
  if (message.author.bot) {
    return;
  }

  let mastery = false;
  if (message.author.id == 186208105502081025) {
    // This is Nakasar, activate fun mastery mode.
    mastery = true;
  }

  let [prefix, ...args] = message.content.split(" ");

  if (prefix.startsWith("+")) {
    // Command mode.
    return hub.handleCommand(message, prefix.substring(1), args.join(" "))
      .catch(err => {
        console.error(err);
        message.channel.send("Oups, quelque chose de grave (impliquant certainement Kormir) s'est produit et je n'ai pas pu exécuter ta commande.");
      });
  }

  // Split beetween direct message NLP and command.

  switch (prefix) {
    case "<@474600951676796948>":
    case "bot'baddon":
    case "botbaddon":
    case "bot":
    case "rp":
      // NLP mode.
      
      if (args.join(" ").includes("méchant")) {
        return message.reply(mastery ? "A vos ordres Ô grand Nakasar, ça va faire mal." : "Voyez avec Nakasar pour me corrompre.");
      }

      return message.reply("Je pourrais bientôt comprendre le langage naturel, mais pour l'instant, utilise `+rp` pour utiliser mes commandes.");
    case "+rp":
      return hub.handleCommand(message, args[0], args.slice(1).join(" "))
        .catch(err => {
          console.error(err);
          message.channel.send("Oups, quelque chose de grave (impliquant certainement Kormir) s'est produit et je n'ai pas pu exécuter ta commande.");
        });
    default:
      break;
  }
});

bot.on('error', error => {
  console.error(error);
});

bot.login(process.env.TOKEN || "");