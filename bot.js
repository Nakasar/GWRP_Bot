'use strict';
var Discord = require('discord.js'),
  https = require('https'),
  axios = require('axios'),
  Enmap = require('enmap'),
  EnmapLevel = require('enmap-level'),
  config = require('./config.js');

const regex_html = /<(.|\n)*?>/;

var bot = new Discord.Client();

const userTableSource = new EnmapLevel({ name: "userTable" });
bot.userTable = new Enmap({ provider: userTableSource });
const usersTableSource = new EnmapLevel({ name: "usersTable" });
bot.usersTable = new Enmap({ provider: usersTableSource });
const channelsTableSource = new EnmapLevel({ name: "channelsTable" });
bot.channelsTable = new Enmap({ provider: channelsTableSource });
const configTableSource = new EnmapLevel({ name: "configTable" });
bot.configTable = new Enmap({ provider: configTableSource });

var prefix = config.prefix;

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

  // Get guild config
  var thisConfig = { prefix: "+"};
  if (message.guild) {
    thisConfig = bot.configTable.get(message.guild.id);
    if(typeof thisConfig === "undefined") {
      thisConfig = { prefix: "+"};
      bot.configTable.set(message.guild.id, thisConfig);
    }
  }

  var prefix = thisConfig.prefix;

  // Ignore not our prefix
  if(!message.content.startsWith(prefix)) {
    return;
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  const channelId = message.channel;
  // message.channel.send
  // message.reply
  switch (cmd) {
    // Ping
    case 'ping':
      message.reply("Hi :)");
      break;
    case 'aide':
      commandHelp(message, args);
      break;
    case 'invite':
      commandInvite(message, args);
      break;
    case 'config':
      commandConfig(message, args);
      break;
    case 'persos':
      commandCharacters(message, args);
      break;
    case 'rumeurs':
      commandRumours(message, args);
      break;
    case 'events':
      commandEvents(message, args);
      break;
    case 'r':
      commandRand(message, args);
      break;
    case 'rand':
      commandRand(message, args);
      break;
    case 'raccourcis':
      commandGestion(message, args);
      break;
    case "ini":
      commandInitiative(message, args);
      break;
    default:
      break;
  }
});

bot.login(config.token);

/*
  AIDE
*/
function commandHelp(message, args) {
  message.channel.send({ embed: {
      title: "Aide",
      description: "Liste des commandes",
      url: "https://gw2rp-tools.ovh/pages/characters",
      color: 45000,
      author: {
        name: "GW2RP-Bot"
      },
      fields : [
      {
        name: "`+persos aide`",
        value: "Personnages"
      },
      {
        name: "`+rumeurs aide`",
        value: "Rumeurs"
      },
      {
        name: "`+events aide`",
        value: "Evènements"
      },
      {
        name: "`+rand aide`",
        value: "Jets de dés"
      },
      {
        name: "`+raccourcis aide`",
        value: "Raccourcis pour les jets de dés."
      },
      {
        name: "`+ini aide`",
        value: "Gestion de l'initiative."
      }
    ]
    }});
}

/*
  INVITE
*/
function commandInvite(message, args) {
  message.channel.send({ embed: {
      title: "Invitation",
      description: "Vous pouvez m'inviter sur votre serveur en utilisant le [lien suivant](https://discordapp.com/oauth2/authorize?&client_id=382898758372950016&scope=bot&permissions=0)",
      color: 45000,
      author: {
        name: "GW2RP-Bot"
      }
  }});
}

/*
  CONFIG
*/
function commandConfig(message, args) {
  if (args.length > 0) {
    let [cmd, ...rest] = args;
    switch (cmd) {
      case "aide":
        configHelp(message);
        break;
      case "prefix":
        if (rest.length == 1) {
          if (message.guild) {
            var thisConfig = { prefix: rest[0] };
            bot.configTable.set(message.guild.id, thisConfig);
            message.channel.send({ embed: {
                title: "Aide",
                description: "Changement de préfixe :",
                color: 45000,
                author: {
                  name: "CONFIGURATION"
                },
                fields : [
                {
                  name: "`" + bot.configTable.get(message.guild.id).prefix + "`",
                  value: "Est maintenant le nouveau préfixe des commandes du Bot."
                }
              ]
            }});
          } else {
            message.channel.send({ embed: {
                title: "Aide",
                description: "Changement de préfixe :",
                color: 45000,
                author: {
                  name: "CONFIGURATION"
                },
                fields : [
                {
                  name: "Uniquement sur un serveur.",
                  value: "Vous ne pouvez changer le préfixe du bot que sur un serveur."
                }
              ]
            }});
          }
        } else {
          message.channel.send({ embed: {
              title: "Aide",
              description: "Changement de préfixe :",
              color: 45000,
              author: {
                name: "CONFIGURATION"
              },
              fields : [
              {
                name: "`+config prefix <new_prefix>`",
                value: "Change le préfixe des commandes du bot (pas d'espace)."
              }
            ]
          }});
        }
        break;
      default:
        configHelp(message);
        break;
    }
  } else {
    // Print help for characters
    configHelp(message);
  }
}

function configHelp(message) {
  message.channel.send({ embed: {
      title: "Aide",
      description: "Liste des commandes",
      url: "https://gw2rp-tools.ovh/pages/characters",
      color: 45000,
      author: {
        name: "CONFIGURATION"
      },
      fields : [
      {
        name: "`+config prefix <new_prefix>`",
        value: "Change le préfixe des commandes du bot (pas d'espace)."
      }
    ]
    }});
}

/*
  CHARACTERS
*/
function commandCharacters(message, args) {
  if (args.length > 0) {
    let [cmd, ...rest] = args;
    switch (cmd) {
      case "aide":
        charactersHelp(message);
        break;
      case "?":
        var search = rest.join(" ").replace(regex_html, "");
        axios({
          method: 'get',
          baseURL: config.baseApi,
          url: '/characters',
          params: { search: search }
        }).then(function(json) {
          if (json.data.success) {
            var characters = json.data.characters
            var max = 20;
            if (characters.length <= 20) {
              max = characters.length;
            }
            var string = "*Vous devriez préciser des termes de recherche.*\n";
            if (search.length > 0) {
              string = "**Personnages** pour la recherche *" + search + " *\n";
            }

            for (var i = 0; i < max; i++) {
              var character = characters[i];
              string += "- [" + character.name + "](https://gw2rp-tools.ovh/pages/characters?id=" + character._id + ")\n";
            }
            message.channel.send({ embed: {
                description: string,
                url: "https://gw2rp-tools.ovh/pages/characters",
                color: 45000,
                author: {
                  name: "PERSONNAGES"
                }
              }});
          }
        }).catch(function(json) {
        });
        break;
      default:
        charactersHelp(message);
        break;
    }
  } else {
    // Print help for characters
    charactersHelp(message);
  }
}

function charactersHelp(message) {
  message.channel.send({ embed: {
      title: "Aide",
      description: "Liste des commandes",
      url: "https://gw2rp-tools.ovh/pages/characters",
      color: 45000,
      author: {
        name: "PERSONNAGES"
      },
      fields : [
        {
          name: "`+persos ? <nom du personnage>`",
          value: "Personnages correspondants aux termes de recherche."
        }
      ]
    }});
}

/*
  GESTION
*/
function commandGestion(message, args) {
  if (args.length > 0) {
    let [cmd, ...rest] = args;
    switch (cmd) {
      case "aide":
        raccourcisHelp(message);
        break;
      case "liste":
        var raccourcis = bot.userTable.get(message.author.id);
        if (typeof raccourcis === "undefined") {
          raccourcis = [];
        }

        var fields = [];
        for (var raccourci of raccourcis) {
          fields.push({
            name: raccourci.short,
            value: "[" + raccourci.character + "]" + "(https://gw2rp-tools.ovh/pages/characters?id=" + raccourci.id + ")"
          });
        }

        message.author.send({ embed: {
          title: "Vos Raccourcis",
          description: "Voici la liste de vos raccourcis.",
          color: 45000,
          author: {
            name: "GESTION DES RACCOURCIS"
          },
          fields : fields
        }});
        if (message.guild) {
          message.reply("En MP mon ami !");
        }
        break;
      case "supprimer":
        if (rest.length == 1 && rest[0] === "*") {
          bot.userTable.set(message.author.id, []);
          message.author.send({ embed: {
            title: "Raccourcis supprimés",
            description: "Vous n'avez désormais plus aucun raccourci enregistré.",
            color: 45000,
            author: {
              name: "GESTION DES RACCOURCIS"
            },
            fields : fields
          }});
        } else if (rest.length == 1) {
          var raccourcis = bot.userTable.get(message.author.id);
          if (typeof raccourcis === "undefined" || raccourcis.length == 0) {
            message.author.send({ embed: {
              title: "Raccourcis supprimés",
              description: "Vous n'aviez déjà aucun raccourci.",
              color: 45000,
              author: {
                name: "GESTION DES RACCOURCIS"
              },
              fields : fields
            }});
          } else {

            var del = -1;
            for (var i in raccourcis) {
              if (raccourcis[i].short === rest[0]) {
                del = i;
                break;
              }
            }


            if (del > -1) {

              var deletedShorty = raccourcis[del];
              raccourcis.splice(del, 1);
              bot.userTable.set(message.author.id, raccourcis);
              var fields = [];
              for (var raccourci of bot.userTable.get(message.author.id)) {
                fields.push({
                  name: raccourci.short,
                  value: raccourci.character
                });
              }
              message.author.send({ embed: {
                title: "Raccourci supprimé",
                description: "Nous avons supprimé le raccourci " + deletedShorty.short + " du personnage " + deletedShorty.character + ".\nVoici la nouvelle liste de vos raccourcis.",
                color: 45000,
                author: {
                  name: "GESTION DES RACCOURCIS"
                },
                fields : fields
              }});

            } else {

              var fields = [];
              for (var raccourci of bot.userTable.get(message.author.id)) {
                fields.push({
                  name: raccourci.short,
                  value: raccourci.character
                });
              }
              message.author.send({ embed: {
                title: "Aucun raccourci supprimé",
                description: "Nous ne trouvons pas le raccourci " + rest[0] + ".\nVoici la nouvelle liste de vos raccourcis.",
                color: 45000,
                author: {
                  name: "GESTION DES RACCOURCIS"
                },
                fields : fields
              }});

            }
          }
        } else {
          message.author.send({ embed: {
              title: "Aide",
              description: "Ajouter ou supprimer un raccourci.",
              color: 45000,
              author: {
                name: "GESTION DES RACCOURCIS"
              },
              fields : [
                {
                  name: "`+raccourcis supprimer <raccourci ou *>`",
                  value: "Supprimer le raccourci indiqué ou tous les raccourcis."
                }
              ]
            }});
        }

        if (message.guild) {
          message.reply("En MP mon ami !");
        }

        break;
      case "utilitaire":
        if (message.guild) {
          message.reply("En MP mon ami !");
        }

        message.author.createDM().then((channel) => {
          channel.send({
            embed: {
              title: "Utilitaire",
              description: "Nous allons ajouter un nouveau raccourci.\nVous pouvez annuler à tout moment en entrant `annuler`.\n\nCommençons par chercher un personnage : entrez le nom du personnage.",
              color: 45000,
              author: {
                name: "GESTION DES RACCOURCIS"
              }
            }
          }).then(() => {
              channel.awaitMessages(response => true, {
                max: 1,
                time: 10000,
                errors: ['time']
              }).then(collected => {
                var content = collected.first().content;
                if (content === "annuler") {
                  channel.send({ embed: {
                      title: "Annulé",
                      description: "Compris.",
                      color: 45000,
                      author: {
                        name: "GESTION DES RACCOURCIS"
                      }
                    }});
                } else {
                  var search = content.replace(regex_html, "");
                  axios({
                    method: 'get',
                    baseURL: config.baseApi,
                    url: '/characters',
                    params: { search: search }
                  }).then(function(json) {
                    if (json.data.success) {
                      var characters = json.data.characters
                      var max = 10;
                      if (characters.length <= 10) {
                        max = characters.length;
                      }
                      var string = "*Vous devriez préciser des termes de recherche, mais voici ce que nous avons trouvé.*\n";
                      if (search.length > 0) {
                        string = "Nous avons trouvé les personnages suivants pour les termes *" + search + "*\n";
                      }

                      var suggestions = {};
                      for (var i = 0; i < max; i++) {
                        var character = characters[i];
                        string += "" + i + " - [" + character.name + "](https://gw2rp-tools.ovh/pages/characters?id=" + character._id + ")\n";
                        suggestions["" + i] = { id: character._id, name: character.name };
                      }

                      var userData = bot.usersTable.get(message.author.id);
                      if (typeof userData === "undefined") {
                        userData = {};
                      }

                      userData["suggestions"] = suggestions;
                      bot.usersTable.set(message.author.id, userData);

                      string += "\nAjoutez un raccourci en entrant `<numéro du personnage> <raccourci>`. *Annulez avec `annuler`.*";
                      channel.send({ embed: {
                          description: string,
                          url: "https://gw2rp-tools.ovh/pages/characters",
                          color: 45000,
                          author: {
                            name: "GESTION DES RACCOURCIS"
                          }
                        }}).then(() => {
                          channel.awaitMessages(response => response.content === "annuler" || response.content.split(" ").length == 2, {
                            max: 1,
                            time: 10000,
                            error: ['time']
                          }).then(collected => {
                            var content = collected.first().content;
                            if (content.split(" ").length == 2) {
                              let [index, short] = content.split(" ");
                              var fetchedUserData =  bot.usersTable.get(message.author.id);
                              var suggestion = fetchedUserData.suggestions[index];
                              if(typeof suggestion !== "undefined" && typeof suggestion.id !== "undefined") {
                                var raccourcis = bot.userTable.get(message.author.id);
                                var toModify = -1;
                                for (var i in raccourcis) {
                                  if (raccourcis.short === short) {
                                    toModify = i;
                                  }
                                }
                                if (toModify > -1) {
                                  raccourcis[toModify] = { short: short, character: suggestion.name, id: suggestion.id };
                                } else {
                                  raccourcis.push({ short: short, character: suggestion.name, id: suggestion.id })
                                }
                                bot.userTable.set(message.author.id, raccourcis)

                                var fields = [];
                                for (var raccourci of bot.userTable.get(message.author.id)) {
                                  fields.push({
                                    name: raccourci.short,
                                    value: raccourci.character
                                  });
                                }
                                message.author.send({ embed: {
                                  title: "Raccourci ajouté",
                                  description: "Nous avons ajouté le raccourci " + short + " pour le personnage " + suggestion.name +".\nVoici la liste de vos raccourcis.",
                                  color: 45000,
                                  author: {
                                    name: "GESTION DES RACCOURCIS"
                                  },
                                  fields : fields
                                }});
                              } else {
                                channel.send({ embed: {
                                    title: "Erreur",
                                    description: "Cette suggestion n'existait pas, recommencez avec `+raccourcis utilitaire`",
                                    color: 45000,
                                    author: {
                                      name: "GESTION DES RACCOURCIS"
                                    }
                                  }});
                              }
                            } else if (content === "annuler") {
                              channel.send({ embed: {
                                  title: "Annulé",
                                  description: "Compris.",
                                  color: 45000,
                                  author: {
                                    name: "GESTION DES RACCOURCIS"
                                  }
                                }});
                            }
                          }).catch(collected => {
                            channel.send({ embed: {
                                title: "Temps écoulé",
                                description: "Vous avez dépassé le temps maximal de réponse, veuillez recommencer avec `+raccourcis utilitaire`.\n\nRappel : vous deviez entrer le numéro de la suggestion puis le raccourci à créer.",
                                color: 45000,
                                author: {
                                  name: "GESTION DES RACCOURCIS"
                                }
                              }});
                          })
                        }).catch(() => {
                        });
                    }
                  }).catch(function(json) {
                  });
                }

              }).catch(collected => {
                channel.send({ embed: {
                    title: "Temps écoulé",
                    description: "Vous avez dépassé le temps maximal de réponse, veuillez recommencer avec `+raccourcis utilitaire`.",
                    color: 45000,
                    author: {
                      name: "GESTION DES RACCOURCIS"
                    }
                  }});
              });
            });
        }).catch(() => {

        });

        break;
      default:
        if (rest.length == 0) {
          var shorty = cmd;
          var raccourcis = bot.userTable.get(message.author.id);
          if (typeof raccourcis === undefined) {
            raccourcis = [];
          }

          var found = {};
          for(var raccourci of raccourcis) {
            if (raccourci.short === shorty) {
              found = raccourci;
              break;
            }
          }

          if (found.short === shorty) {
            message.channel.send({ embed: {
                title: "Trouvé !",
                description: "Nous avons trouvé un raccourci correspondant à la recherche dans vos favoris.",
                url: "https://gw2rp-tools.ovh/pages/characters",
                color: 45000,
                author: {
                  name: "GESTION DES RACCOURCIS"
                },
                fields : [
                  {
                    name: found.short,
                    value: "Personnage : [" + found.character + "](https://gw2rp-tools.ovh/pages/characters?id=" + found.id + ")"
                  }
                ]
              }});
          } else {
            message.channel.send({ embed: {
                title: "Oups :(",
                description: "Nous n'avons trouvé aucun de vos raccourcis nommé *" + shorty + "*.\nAjoutez un raccourci en lançant l'utilitaire `+raccourcis utilitaire`",
                url: "https://gw2rp-tools.ovh/pages/characters",
                color: 45000,
                author: {
                  name: "GESTION DES RACCOURCIS"
                }
              }});
          }
        } else {
          raccourcisHelp(message);
        }
        break;
    }
  } else {
    raccourcisHelp(message);
  }
}

function raccourcisHelp(message) {
  message.channel.send({ embed: {
      title: "Aide",
      description: "Cet utilitaire permet d'ajouter des raccourcis qui vous sont personnels pour lancer des dés pour vos personnages.",
      color: 45000,
      author: {
        name: "GESTION DES RACCOURCIS"
      },
      fields : [
        {
          name: "`+raccourcis utilitaire`",
          value: "Déclenche l'utilitaire des raccourcis des noms de personnages."
        },
        {
          name: "`+raccourcis liste`",
          value: "Affiche la liste de vos raccourcis."
        },
        {
          name: "`+raccourcis supprimer <raccourci ou *>`",
          value: "Supprimer le raccourci indiqué ou tous les raccourcis."
        }
      ]
    }});
}

/*
  RUMOURS
*/
function commandRumours(message, args) {
  if (args.length > 0) {
    let [cmd, ...rest] = args;
    switch (cmd) {
      case "aide":
        rumoursHelp(message);
        break;
      default:
        rumoursHelp(message);
        break;
    }
  } else {
    axios({
      method: 'get',
      baseURL: config.baseApi,
      url: '/rumours',
      params: { latest: 5 }
    }).then(function(json) {
      if (json.data.success) {
        var rumours = json.data.rumours
        var fields = [];
        for (var rumour of rumours) {
          fields.push({
            name: rumour.name,
            value: "*" + rumour.text + "*" + "\n[Voir sur la carte](https://gw2rp-tools.ovh/cartographe?id=" + rumour._id + "), par " + rumour.contact + "."
          });
        }
        message.channel.send({ embed: {
          url: "https://gw2rp-tools.ovh/cartographe",
          color: 45000,
          author: {
            name: "DERNIERES RUMEURS"
          },
          fields: fields
        }});
      }
    }).catch(function(json) {
    });
  }
}

function rumoursHelp(message) {
  message.channel.send({ embed: {
    title: "Aide",
    description: "Liste des commandes",
    color: 45000,
    author: {
      name: "RUMEURS"
    },
    fields : [
    {
      name: "`+rumeurs`",
      value: "Dernières rumeurs publiées"
    }
  ]
  }});
}

function getDifficultyIcon(difficulty) {
  //['peaceful', 'easy', 'normal', 'difficult', 'hardcore']
  // :green_book:  :green_book: :orange_book: :closed_book: :notebook:
  switch (difficulty) {
    case "peaceful":
      return ":green_book:";
      break;
    case "easy":
      return ":green_book:";
      break;
    case "normal":
      return ":orange_book:";
      break;
    case "difficult":
      return ":closed_book:";
      break;
    case "hardcore":
      return ":notebook:";
      break;
  }
}

function removeTextDecoration(text) {
  var formatted = "";

  formatted = text.replace(/\[color=(.+?)\](.+?)\[\/color\]/g, '$2');
  formatted = formatted.replace(/\[b\](.+?)\[\/b\]/g, '$1');
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '$1');
  formatted = formatted.replace(/__(.+?)__/g, '$1');
  formatted = formatted.replace(/\[i\](.+?)\[\/i\]/g, '$1');
  formatted = formatted.replace(/\[u\](.+?)\[\/u\]/g, '$1');
  formatted = formatted.replace(/_(.+?)_/g, '$1');

  if (formatted.length > 200) {
    formatted = formatted.substring(0, 200) + "...";
  }

  return formatted;
}

/*
  RUMOURS
*/
function commandEvents(message, args) {
  if (args.length > 0) {
    let [cmd, ...rest] = args;
    switch (cmd) {
      case "aide":
        eventsHelp(message);
        break;
      default:
        eventsHelp(message);
        break;
    }
  } else {
    axios({
      method: 'get',
      baseURL: config.baseApi,
      url: '/events',
      params: { next: 5 }
    }).then(function(json) {
      if (json.data.success) {
        var events = json.data.events
        var fields = [];
        for (var event of events) {
          var value = "";
          value += "*" + removeTextDecoration(event.description) + "*";
          value += "\n";
          var date = new Date(event.end_date);
          if (date) {
            value += "\n" + date.toLocaleDateString().substr(0, 10);
            if (date.getHours() > 0) {
              value += " à " + date.toLocaleTimeString().substr(0, 5);
            }
          }
          value += "\n[Voir sur la carte](https://gw2rp-tools.ovh/cartographe?id=" + event._id + "), par " + event.contact + ". [site web](" + event.site + ")";
          fields.push({
            name: getDifficultyIcon(event.difficulty) + " " + event.name,
            value: value
          });
        }
        message.channel.send({ embed: {
          url: "https://gw2rp-tools.ovh/cartographe",
          color: 45000,
          author: {
            name: "PROCHAINS EVENEMENTS"
          },
          fields: fields
        }});
      }
    }).catch(function(json) {
    });
  }
}

function eventsHelp(message) {
  message.channel.send({ embed: {
    title: "Aide",
    description: "Liste des commandes",
    color: 45000,
    author: {
      name: "EVENEMENTS"
    },
    fields : [
    {
      name: "`+events`",
      value: "Prochains évents à venir."
    }
  ]
  }});
}

/*
  JETS DE DES
*/
function commandRand(message, args) {
  if (args.length > 0) {
    let [cmd, ...rest] = args;
    switch (cmd) {
      case "aide":
        randHelp(message);
        break;
      default:
        // +r 1d5 + 52 -20# test
        // +r Silvie Esquive Dextérité # Pitié !
        if (cmd.endsWith(":")) {
          // Load character data if shorty does exist
          var askedShort = cmd.substring(0, cmd.length - 1);
          var userShorts = bot.userTable.get(message.author.id);

          if (typeof userShorts === undefined) {
            userShorts = [];
          }
          var thisShort = "";
          for (var short of userShorts) {
            if (short.short === askedShort) {
              thisShort = short;
              break;
            }
          }

          if(thisShort === "") {
            message.channel.send({ embed: {
              title: "Oups :(",
              description: "Le raccourci **" + askedShort + "** n'existe pas.\nVous pouvez créer un raccourci via `+raccourcis utilitaire`.",
              color: 45000,
              author: {
                name: "JET DE DES"
              }
            }});
          } else {
            var command = rest.join(" ");
            var [p1, ...p2] = command.split("#");
            var exp = p1;
            var comment = p2.join(" ");

            //localhost:3000/api/characters/5a133ce6a61971167cbdbdac/stats

            // replace statistics with API.
            var stats = exp.match(stat_regex);
            if (stats) {
              axios({
                method: 'get',
                baseURL: config.baseApi,
                url: '/characters/' + short.id + "/stats",
                data: { stats: stats }
              }).then(function(json) {
                if (json.data.success) {
                  var parsed = exp;
                  var statsToReplace = json.data.stats;
                  var statsRolled = "";
                  for (var stat of statsToReplace) {
                    parsed = parsed.replace(stat.name, stat.value);
                    statsRolled += "- " + stat.name + " : " + stat.value + "\n";
                    stats.splice(stats.indexOf(stat.name), 1);
                  }
                  for (var stat of stats) {
                    statsRolled += "- " + stat + " : 0\n" ;
                    parsed = parsed.replace(stat, 0);
                  }

                  // find dice rolls in expression
                  var rolled = parsed.replace(dice_regex, rollDice);

                  if (rolled.search(calc_regex) > -1) {
                    try {
                      var result = eval(rolled);
                      message.channel.send({ embed: {
                        title: comment,
                        description: statsRolled + "\n`" + rolled + " = `**`" + result + "`**",
                        color: 45000,
                        author: {
                          name: short.character
                        }
                      }});
                    } catch (e) {
                      message.channel.send({ embed: {
                        title: "Oups :(",
                        description: "Le jet de dés ne peut pas être exécuté, êtes-vous certain de son format ?",
                        color: 45000,
                        author: {
                          name: "JET DE DES"
                        }
                      }});
                    }
                  } else {
                    message.channel.send({ embed: {
                      title: "Oups :(",
                      description: "Le jet de dés ne peut pas être exécuté, êtes-vous certain de son format ?",
                      color: 45000,
                      author: {
                        name: "JET DE DES"
                      }
                    }});
                  }
                }
              }).catch(function(json) {
                message.channel.send({ embed: {
                  title: "Oups :(",
                  description: "Nous ne parvenons pas à récupérer les statistiques de ce personnage, le problème vient certainement de notre côté.",
                  color: 45000,
                  author: {
                    name: "JET DE DES"
                  }
                }});
              });
            } else {
              var parsed = exp;

              // find dice rolls in expression
              var rolled = parsed.replace(dice_regex, rollDice);

              if (rolled.search(calc_regex) > -1) {
                try {
                  var result = eval(rolled);
                  message.channel.send({ embed: {
                    title: comment,
                    description:"`" + rolled + " = `**`" + result + "`**",
                    color: 45000,
                    author: {
                      name: short.character
                    }
                  }});
                } catch (e) {
                  message.channel.send({ embed: {
                    title: "Oups :(",
                    description: "Le jet de dés ne peut pas être exécuté, êtes-vous certain de son format ?",
                    color: 45000,
                    author: {
                      name: "JET DE DES"
                    }
                  }});
                }
              } else {
                message.channel.send({ embed: {
                  title: "Oups :(",
                  description: "Le jet de dés ne peut pas être exécuté, êtes-vous certain de son format ?",
                  color: 45000,
                  author: {
                    name: "JET DE DES"
                  }
                }});
              }
            }

          }
        }
        else {
          // Generic dice roll
          var command = cmd;
          if (rest.length > 0) {
            command += " " + rest.join(" ");
          }
          var [p1, ...p2] = command.split("#");
          var exp = p1.trim();
          var comment = p2.join(" ");

          // find dice rolls in expression
          var rolled = exp.replace(dice_regex, rollDice);
          if (rolled.search(calc_regex) > -1) {
            try {
              var result = eval(rolled);
              message.channel.send({ embed: {
                title: comment,
                description: "`" + rolled + " = `**`" + result + "`**",
                color: 45000,
                author: {
                  name: message.author.username
                }
              }});
            } catch (e) {
              message.channel.send({ embed: {
                title: "Oups :(",
                description: "Le jet de dés ne peut pas être exécuté, êtes-vous certain de son format ?",
                color: 45000,
                author: {
                  name: "JET DE DES"
                }
              }});
            }
          } else {
            message.channel.send({ embed: {
              title: "Oups :(",
              description: "Le jet de dés ne peut pas être exécuté, êtes-vous certain de son format ?",
              color: 45000,
              author: {
                name: "JET DE DES"
              }
            }});
          }
        }

        break;
    }
  } else {
    randHelp(message);
  }
}

function randHelp(message) {
  message.channel.send({ embed: {
      title: "Aide",
      description: "Liste des commandes\n\n`+r` et `+rand` sont équivalents.",
      color: 45000,
      author: {
        name: "JETS DE DES"
      },
      fields : [
        {
          name: "`+rand 1d50+20+65 # commentaire",
          value: "Effectue le jet de dé ou le calcul indiqué."
        },
        {
          name: "`+rand <character name>: 1d100+<compétence>+<caractéristique> # commentaire",
          value: "Effectue le jet de compétence pour le personnage indiqué (tel que sauvegardé par l'utilisateur)."
        }
      ]
    }});
}

const dice_regex = /([0-9]\d*d[0-9]\d*)/g;
const stat_regex = /([a-zA-Z\u00C0-\u017F]{2,})/g;
const calc_regex = /^([0-9\+\-\*\(\)\/]{1,})$/g;
const par_regex = /(\([0-9\-\+\*\/]{0,}\))/g;
function rollExpression(message, args) {
  return new Promise((resolve, reject) => {
    var characterName = "";
    var first = args[0];
    var askedShort = "";
    var rollCommand = [];
    if (first.endsWith(":")) {
      askedShort = first.substring(0, first.length - 1);
      rollCommand = args.splice(1, args.length);
    } else {
      characterName = first;
      if (args.length == 1) {
        return reject({ code: "init-format", message: message });
      }
      var second = args[1];
      if (second.endsWith(":")) {
        askedShort = second.substring(0, second.length - 1);
        rollCommand = args.splice(2, args.length);
      } else {
        rollCommand = args.splice(1, args.length);
      }
    }

    if (rollCommand.length == 0) {
      return reject({ code: "init-format", message: message });
    }

    if (askedShort.length > 0) {
      // Load character data if shorty does exist
      var userShorts = bot.userTable.get(message.author.id);

      if (typeof userShorts === undefined) {
        userShorts = [];
      }
      var thisShort = "";
      for (var short of userShorts) {
        if (short.short === askedShort) {
          thisShort = short;
          break;
        }
      }

      if(thisShort === "") {
        return reject({ code: "short", message: message, short: askedShort });
      } else {
        if (!(characterName.length > 0)) {
          characterName = short.character;
        }
        var command = rollCommand.join(" ");
        var [p1, ...p2] = command.split("#");
        var exp = p1;
        var comment = p2.join(" ");

        //localhost:3000/api/characters/5a133ce6a61971167cbdbdac/stats

        // replace statistics with API.
        var stats = exp.match(stat_regex);
        if (stats) {
          axios({
            method: 'get',
            baseURL: config.baseApi,
            url: '/characters/' + short.id + "/stats",
            data: { stats: stats }
          }).then(function(json) {
            if (json.data.success) {
              var parsed = exp;
              var statsToReplace = json.data.stats;
              var statsRolled = "";
              for (var stat of statsToReplace) {
                parsed = parsed.replace(stat.name, stat.value);
                statsRolled += "- " + stat.name + " : " + stat.value + "\n";
                stats.splice(stats.indexOf(stat.name), 1);
              }
              for (var stat of stats) {
                statsRolled += "- " + stat + " : 0\n" ;
                parsed = parsed.replace(stat, 0);
              }

              // find dice rolls in expression
              var rolled = parsed.replace(dice_regex, rollDice);

              if (rolled.search(calc_regex) > -1) {
                try {
                  var result = eval(rolled);
                  return resolve({ character: characterName, result: result, rolled: rolled, expression: parsed });
                } catch (e) {
                  return reject({ code: "format", message: message });
                }
              } else {
                return reject({ code: "format", message: message  });
              }
            }
          }).catch(function(json) {
            return reject({ code: "api", message: message  });
          });
        } else {
          var parsed = exp;

          // find dice rolls in expression
          var rolled = parsed.replace(dice_regex, rollDice);

          if (rolled.search(calc_regex) > -1) {
            try {
              var result = eval(rolled);
              return resolve({ character: characterName, result: result, rolled: rolled, expression: parsed });
            } catch (e) {
              return reject({ code: "format", message: message  });
            }
          } else {
            return reject({ code: "format", message: message  });
          }
        }

      }
    }
    else {
      // Generic dice roll
      var command = rollCommand.join(" ");
      var [p1, ...p2] = command.split("#");
      var exp = p1.trim();
      var comment = p2.join(" ");

      // find dice rolls in expression
      var rolled = exp.replace(dice_regex, rollDice);
      if (rolled.search(calc_regex) > -1) {
        try {
          var result = eval(rolled);
          return resolve({ character: characterName, result: result, rolled: rolled, expression: parsed });
        } catch (e) {
          return reject({ code: "format", message: message  });
        }
      } else {
        return reject({ code: "format", message: message  });
      }
    }
  });
}

function handleRollError(error) {
  switch (error.code) {
    case "format":
      error.message.channel.send({ embed: {
        title: "Oups :(",
        description: "Le jet de dés ne peut pas être exécuté, êtes-vous certain de son format ?",
        color: 45000,
        author: {
          name: "JET DE DES"
        }
      }});
      break;
    case "init-format":
      error.message.channel.send({ embed: {
        title: "Oups :(",
        description: "Le jet de dés n'a pas été compris comme une commande d'initiative.",
        color: 45000,
        author: {
          name: "JET DE DES"
        },
        fields: [
          {
            name: "Avec raccourci, en précisant le nom de l'entrée dans l'initiative.",
            value: "`+ini auto <surnom> <raccourci>: 1d100+Dextérité`"
          },
          {
            name: "Avec raccourci, en gardant le nom du personnage dans l'initiative.",
            value: "`+ini auto <raccourci>: 1d100+Dextérité`"
          },
          {
            name: "Sans raccourci, en précisant le nom de l'entrée dans l'initiative.",
            value: "`+ini auto <surnom> 1d100+20`"
          }
        ]
      }});
      break;
    case "short":
      error.message.channel.send({ embed: {
        title: "Oups :(",
        description: "Le raccourci **" + error.short + "** n'existe pas.\nVous pouvez créer un raccourci via `+raccourcis utilitaire`.",
        color: 45000,
        author: {
          name: "JET DE DES"
        }
      }});
      break;
    case "api":
      error.message.channel.send({ embed: {
        title: "Oups :(",
        description: "Nous ne parvenons pas à récupérer les statistiques de ce personnage, le problème vient certainement de notre côté.",
        color: 45000,
        author: {
          name: "JET DE DES"
        }
      }});
      break;
    default:
      error.message.channel.send({ embed: {
        title: "Oups :(",
        description: "Le jet de dés ne peut pas être exécuté à cause d'une erreur inconnue.",
        color: 45000,
        author: {
          name: "JET DE DES"
        }
      }});
      break;
  }
}

function rollDice(match, offset, string) {
  var [amount, dice] = match.split("d");
  var string = "";
  if (amount == 0) {
    string = "0";
  } else {
    if (amount > 1) {
      string += "(";
    }
    if (dice == 0) {
      string += "0"
    } else {
      string += Math.floor((Math.random() * dice) + 1);
    }
    for (var i = 1; i < amount; i++) {
      if (dice == 0) {
        string += "+0"
      } else {
        string += "+" + Math.floor((Math.random() * dice) + 1);
      }
    }
    if (amount > 1) {
      string += ")";
    }
  }
  return string;
}

/*
  INITIATIVE
*/
function sendInitiative(message) {
  // Display initiative in this channel.
  var initData = bot.channelsTable.get(message.channel.id);
  if (typeof initData === "undefined") {
    message.channel.send({ embed: {
        title: "Aucune initiative définie.",
        description: "Définissez l'initiative pour ce canal avec `+ini <message>`",
        color: 45000,
        author: {
          name: "INITIATIVE"
        }
      }});
  } else {
    initData.array.sort(function(a, b) { return b.init - a.init; });
    var auto = "";
    for (var init of initData.array) {
      auto += init.init + " - " + init.character + "\n";
    }

    var fields = [];
    if (initData.string.length > 0) {
      fields.push({ name: "Manuelle :", value: initData.string });
    }
    if (auto.length > 0) {
      fields.push({ name: "Automatique :", value: auto });
    }

    message.channel.send({ embed: {
        description: "Tirez votre initiativee avec `+ini auto 1d100+Dextérité` (par exemple), elle sera automatiquement ajoutée à la table, ou définissez un ordre manuellement avec `+ini <ordre>`",
        color: 45000,
        author: {
          name: "INITIATIVE"
        },
        fields: fields
      }});
  }
}

function commandInitiative(message, args) {
  if (args.length > 0) {
    let [cmd, ...rest] = args;
    switch (cmd) {
      case "aide":
        initiativeHelp(message);
        break;
      case "tuer":
        if (args.length > 0) {
          var character = rest.join(" ");
          var initData = bot.channelsTable.get(message.channel.id);
          if (typeof initData === "undefined") {
            message.channel.send({ embed: {
              title: "Pas d'initiative.",
              description: "Cette entrée n'existe pas dans l'initiative.\nAffichez l'initiative et les surnoms à l'intérieur avec `+ini`.",
              color: 45000,
              author: {
                name: "INITIATIVE"
              }
            }});
          } else {
            if (typeof initData.array === "undefined" || initData.array.length == 0) {
              message.channel.send({ embed: {
                title: "Pas d'initiative.",
                description: "Cette entrée n'existe pas dans l'initiative.\nAffichez l'initiative et les surnoms à l'intérieur avec `+ini`.",
                color: 45000,
                author: {
                  name: "INITIATIVE"
                }
              }});
            } else {
              var found = -1;
              for (var i in initData.array) {
                if (initData.array[i].character === character) {
                  found = i;
                }
              }

              if (found > -1 ) {
                initData.array.splice(found, 1);
                bot.channelsTable.set(message.channel.id, initData);
                sendInitiative(message);
              } else {
                message.channel.send({ embed: {
                  title: "Pas d'initiative.",
                  description: "Cette entrée n'existe pas dans l'initiative.\nAffichez l'initiative et les surnoms à l'intérieur avec `+ini`.",
                  color: 45000,
                  author: {
                    name: "INITIATIVE"
                  }
                }});
              }
            }
          }
        } else {
          message.channel.send({ embed: {
            title: "Aide",
            description: "Supprimer une entrée de l'initiative avec `+tuer <surnom`.",
            color: 45000,
            author: {
              name: "INITIATIVE"
            }
          }});
        }



        break;
      case "reset":
        bot.channelsTable.set(message.channel.id, { string: "", array: [] });
        message.channel.send({ embed: {
            title: "Initiative réinitialisée.",
            description: "Tirez votre initiativee avec `+ini auto <surnom> 1d100+Dextérité` (par exemple), elle sera automatiquement ajoutée à la table.",
            color: 45000,
            author: {
              name: "INITIATIVE"
            }
          }});
        break;
      case "auto":
        // Automated calculation of initiative (add this user initiative to the table).
        if (rest.length > 0) {
          // roll args.
          rollExpression(message, rest).then(init => {
            var initData = bot.channelsTable.get(message.channel.id);
            if (typeof initData === "undefined") {
              initData = { string: "", array: [] };
            }
            var found = -1;
            for (var i in initData.array) {
              if (initData.array[i].character === init.character) {
                found = i;
                break;
              }
            }
            if (found > -1) {
              initData.array[i] = { character: init.character, init: init.result, expression: init.expression };
            } else {
              initData.array.push({ character: init.character, init: init.result, expression: init.expression });
            }
            bot.channelsTable.set(message.channel.id, initData);

            message.reply("`" + init.rolled + " = " + init.result + "`");

            sendInitiative(message);
          }).catch(handleRollError);

        } else {
          message.channel.send({ embed: {
            title: "Utilitaire d'initiative.",
            description: "Tirez votre initiativee avec `+ini auto <surnom> 1d100+Dextérité` (par exemple), elle sera automatiquement ajoutée à la table.",
            color: 45000,
            author: {
              name: "INITIATIVE"
            }
          }});
        }
        break;
      case "set":
        var init = rest.join(" ");
        // Set initiative in this channel.
        var initData = bot.channelsTable.get(message.channel.id);
        if (typeof initData === "undefined") {
          initData = { string: "", array: [] };
        }
        initData.string = init;

        bot.channelsTable.set(message.channel.id, initData);

        message.channel.send({ embed: {
            title: "Initiative modifiée.",
            description: init,
            color: 45000,
            author: {
              name: "INITIATIVE"
            }
          }});
        break;
      default:
        sendInitiative(message);
        break;
    }
  } else {
    sendInitiative(message);
  }
}

function initiativeHelp(message) {
  message.channel.send({ embed: {
      title: "Aide",
      description: "Liste des commandes.",
      color: 45000,
      author: {
        name: "INITIATIVE"
      },
      fields : [
        {
          name: "`+ini`",
          value: "Affiche l'initiative de ce canal."
        },
        {
          name: "`+ini tuer <surnom>`",
          value: "Supprimer l'entrée indiquée de la table d'initiative."
        },
        {
          name: "`+ini reset`",
          value: "Réinitialise l'initiative."
        },
        {
          name: "`+ini set <message>`",
          value: "Définit l'initiative manuellement."
        },
        {
          name: "`+ini auto <surnom> <raccourci>: <jet de dé>`",
          value: "Lance votre initiative avec raccourci et l'ajoute à la table du canal."
        },
        {
          name: "`+ini auto <surnom> <jet de dé>`",
          value: "Lance votre initiative et l'ajoute à la table du canal."
        },
        {
          name: "`+ini auto <raccourci>: <jet de dé>`",
          value: "Lance votre initiative directement avec le nom du personnage et l'ajoute à la table du canal."
        }
      ]
    }});
}
