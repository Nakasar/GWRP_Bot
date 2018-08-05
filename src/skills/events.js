const axios = require('axios');

const { makeMessage, baseApi } = require('../utils');


getParticipants = (message, phrase) => {
    return axios({
        method: 'get',
        baseURL: baseApi,
        url: '/events/search/participants',
        data: {
            search: phrase
        }
    }).then(function (json) {
        if (json.data.success) {
            var participants = json.data.participants
            var value = "";
            for (var participant of participants) {
                if (participant.status === "yes") {
                    value += `${participant.user.nick_name}, `
                }
            }
            return message.channel.send({
                embed: {
                    color: 45000,
                    title: "Participants",
                    description: value || "Aucun participants à cet évènement, s'il existe."
                }
            });
        }
    });
}

getEvents = (message) => {
    return axios({
        method: 'get',
        baseURL: baseApi,
        url: '/events',
        params: { next: 5 }
    }).then(function (json) {
        if (json.data.success) {
            var events = json.data.events
            var fields = [];

            if (events.length === 0) {
                return message.channel.send({
                    embed: {
                        url: "https://gw2rp-tools.ovh/cartographe",
                        color: 45000,
                        author: {
                            name: "PROCHAINS EVENEMENTS"
                        },
                        description: "Aucun évènement à venir."
                    }
                });
            }

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
                var participants = 0
                for (var participant of event.participants) {
                    if (participant.status === "yes") {
                        participants += 1
                    }
                }
                value += "\n" + participants + " Participants."
                value += "\n[Voir sur la carte](https://gw2rp-tools.ovh/cartographe?id=" + event._id + "), par " + event.contact + ".";
                if (event.site) {
                    value += " [site web](" + event.site + ")"
                }
                fields.push({
                    name: getDifficultyIcon(event.difficulty) + " " + event.name,
                    value: value
                });
            }
            return message.channel.send({
                embed: {
                    url: "https://gw2rp-tools.ovh/cartographe",
                    color: 45000,
                    author: {
                        name: "PROCHAINS EVENEMENTS"
                    },
                    fields: fields
                }
            });
        }
    });
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

events = (message, phrase) => {
    let [command, ...args] = phrase.split(" ");

    switch (command.toLowerCase()) {
        case "help":
        case "aide":
        case "?":
            return message.channel.send(eventsHelp(message));
        case "participants":
            return getParticipants(message, args.join(" ").trim()).catch(err => {
                console.log(err);
                return message.channel.send(makeMessage({ text: "Je n'ai pas pu récupérer la liste des particpants à l'évènement, un problème est survenu dans les Brumes." }));
            })
        default:
            return getEvents(message).catch(err => {
                console.log(err);
                return message.channel.send(makeMessage({ text: "Je n'ai pas pu récupérer la liste des évènements, un problème est survenu dans les Brumes." }));
            });
    }
}

eventsHelp = (message) => {
    return makeMessage({
        text: `Hello ${message.author.username}. Voici l'aide de la commande \`events\`.`,
        fields: [
            {
                name: "`!events`",
                value: `Affiche les prochains évènements à venir.`
            },
            {
                name: "`!events participants <nom>`",
                value: `Affiche les participants à un évènement.`
            }
        ]
    })
}

module.exports = {
    events,
}