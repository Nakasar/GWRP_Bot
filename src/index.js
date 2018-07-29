'use strict';
var Discord = require('discord.js'),
  axios = require('axios'),
  config = require('./config.js');

var bot = new Discord.Client();

bot.on('ready', () => {
  console.log('Logged in as %s - %s\n', bot.user.username, bot.user.id);
  bot.user.setGame(`Bot GW2RP : +aide`);
});

bot.on('guildCreate', guild => {
  bot.configTable.set(guild.id, { prefix: '+' });
  console.log(`Joined ${guild.name} (id: ${guild.id}).`);
});

bot.on('message', message => {
  // ignore bots
  if(message.author.bot) {
    return;
  }

  return message.reply("Je ne suis pas encore implémenté.");
});

bot.login(config.TOKEN);