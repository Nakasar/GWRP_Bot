const { makeMessage } = require('../utils');

roll = (message, phrase) => {
    if (phrase.length === 0) {
        return message.channel.send(rollHelp(message));
    }

    // Split commentary.
    let [command, ...commentary] = phrase.split("#");
    command = command.trim();
    commentary = commentary.join("#").trim();

    if (command.includes(":")) {
        // Tis is a roll for a character.
        return message.channel.send(makeMessage({ text: "Je ne peux pas encore lancer de dés pour des personnages." }));
    }

    // Do we have a level in the dice ?
    let [first, ...rest] = command.split(" ");
    switch (first.toLowerCase()) {
        case "help":
        case "aide":
        case "?":
            return message.channel.send(rollHelp(message));
        default:
            const expression = first + " " + rest.join(" ");
            return evaluate(expression).then(({ expression, rolled, result, critFailure, critSuccess }) => {
                return message.channel.send(makeMessage({
                    title: message.author.username + ( commentary ? " # " + commentary : ""),
                    text: `\`${expression}\` → \`${rolled}\` = **\`${result}\`**
                            ${result.toString().split('').map(digit => digitToEmoji(digit)).join(" ")}    ${critFailure ? ":skull_crossbones: Echec Critique :skull_crossbones:" : ""}  ${critSuccess ? ":zap: Réussite Critique :zap:" : ""}`
                }))
            }).catch(err => {
                console.log(err);
                return message.channel.send(makeMessage({ text: "Je n'ai pas pu évaluer cette expression." }));
            });
    }
}

// +r 1d100+20-1d10
// +r S : 1d100+Dextérité # marcel + 15
// +r élite +50
// +r i 1d100+20

rollHelp = (message) => {
    return makeMessage({
        text: `Hello ${message.author.username}. Voici l'aide de mon utilitaire de jets de dés.`,
        fields: [
            {
                name: "<expression> # [commentaire]",
                value: `1d100+20, 2d4...
                Une expression commence par un chiffre. Elle sera exécutée et le résultat renvoyé. les entrées du type xdy seront lancée aléatoirement.

                Le commentaire, s'il est présent, sera affiché lors du résultat.
                `
            },
            {
                name: "<level> [expression] # [commentaire]",
                value: `expert +20, novice -20+1d20
                Lance un dé 100 et ajoute un modificateur lié au niveau renseigné, et ajoute l'expression ensuite si elle est présente.
                
                Les niveaux disponibles sont :
                catastrophe/cata/cat → -10
                → +0
                novice/n → +10
                initié/i → +20
                vétéran/v → +30
                élite/e → +40
                champion/c → +50
                légende/l → +60
                
                Le commentaire, s'il est présent, sera affiché lors du résultat.
                `
            }
        ]
    })
}

evaluate = (expression) => {
    return Promise.resolve().then(() => {

        const regex = /^([+-]{0,1}\d{1,2}d\d{1,4}([+-]\d{1,4}){0,}){1,}$/;
        if (!regex.test(expression.trim())) {
            throw {
                message: "Invalid expression to evaluate.",
                id: "INVALID_EXPRESSION"
            }
        }

        // Roll dices.
        const diceRegex = /\d{1,2}d\d{1,4}/g;
        let rolled;
        let critFailure = false;
        let critSuccess = false;
        try {
            rolled = expression.replace(diceRegex, (match) => {
                const [amount, dice] = match.split("d");
                const res = [];
                for (let i = 0; i < amount; i++) {
                    const rolled = Math.round(Math.random() * (dice - 1)) + 1;

                    if (rolled >= 96) {
                        critSuccess = true;
                    }
                    if (rolled <= 5) {
                        critFailure = true;
                    }

                    res.push(`(${rolled})`);
                }

                return `(${res.join("+")})`;
            });
        } catch (e) {
            throw {
                message: "Could not roll dices.",
                id: "INVALID_EXPRESSION"
            }
        }

        let result;
        try {
            result = eval(rolled);
        } catch (e) {
            console.log(e);
            throw {
                message: "Could not evaluate rolled expression.",
                id: "INVALID_EXPRESSION"
            }
        }

        return {
            expression,
            rolled,
            result,
            critFailure,
            critSuccess
        };
    })
}

digitToEmoji = (digit) => {
    if (digit === "-") {
        return ":heavy_minus_sign:";
    }
    const digitEmojies = [":zero:", ":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:"];
    return digitEmojies[digit];
}


module.exports = {
    roll,
}