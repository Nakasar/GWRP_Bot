const { makeMessage } = require('./utils');

const roll = require('./skills/roll');
const rumors = require('./skills/rumors');
const events = require('./skills/events');

class BotBaddon {
    constructor({ } = {}) {

    }

    handleCommand(message, cmd, phrase) {
        return Promise.resolve().then(() => {
            console.log(`handling command ${cmd} for user ${message.author.username} (${message.author.id}).`);
            console.log(phrase);

            switch (cmd) {
                case "aide":
                case "help":
                case "?":
                    // Return help.
                    return this.help(message, phrase);
                case "roll":
                case "r":
                    return roll.roll(message, phrase);
                case "events":
                    return events.events(message, phrase);
                case "rumeurs":
                    return rumors.getRumours(message, phrase);
                default:
                    if (cmd.length <= 2) {
                        return null; // Avoid answering to ++, +1, etc.
                    }
                    return message.channel.send(
                        makeMessage({
                            text: `Désolé ${message.author.username}, je ne connais pas cette commande. Essaie \`!rp aide\` pour savoir ce que tu peux faire.`
                        })
                    );
            }
        });
    }

    help(message, phrase) {
        return message.channel.send(makeMessage({
            text: `Hello ${message.author.username}. Voici la liste des commandes que je connais :
            \`aide (?)\` → Affiche l'aide.
            \`roll (r)\` → Lancés de dés.
            \`events\` → Explorations des évènements.
            \`rumeurs\` → Explorations des rumeurs.
            `
        }));
    }
}


module.exports = (args) => new BotBaddon(args);