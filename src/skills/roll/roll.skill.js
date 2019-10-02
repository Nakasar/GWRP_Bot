const { makeMessage } = require('../../utils/messages.utils');

const RollTypes = {
  EXPRESSION: 'EXPRESSION',
  CHOICE: 'CHOICE',
  HELP: 'HELP',
};

/**
 *
 * @param params.
 * @param params.expression
 * @param params.type
 * @param params.choices
 * @param params.level
 * @param params.comment
 * @param params.command
 * @param options
 * @param options.parse
 * @param message
 * @returns {Promise<void>}
 */
async function roll(params, message, options = {}) {
  const _params = {};

  if (options.parse) {
    if (!params.command || params.command.length === 0) {
      await message.channel.send(rollHelp());

      return;
    }

    // Split commentary.
    let [command, ...commentary] = params.command.split("#");
    _params.command = command.trim();
    _params.comment = commentary.join("#").trim();

    // Do we have a level in the dice ?
    let [first, ...rest] = _params.command.split(" ");

    switch (first.toLowerCase()) {
      case "help":
      case "aide":
      case "?":
        _params.type = RollTypes.HELP;
        break;
      case "choose":
      case "choix":
        _params.choices = rest.join(' ').split('/').map(choice => choice.trim());
        _params.type = RollTypes.CHOICE;
        break;
      default:
        _params.expression =  first + " " + rest.join(" ");
        _params.type = RollTypes.EXPRESSION;
    }
  }

  switch (_params.type) {
    case RollTypes.CHOICE:
      try {
        const choice = _params.choices[Math.floor(Math.random() * _params.choices.length)];
        await message.channel.send(makeMessage({
          title: message.author.username,
          text: choice,
        }));
      } catch(error) {
        await message.channel.send(makeMessage({ text: "Je n'ai pas pu choisir correctement une option, désolé :(" }));
      }
      break;
    case RollTypes.EXPRESSION:
      try {
        const result = await evaluate(_params.expression);

        await message.channel.send(makeMessage({
          title: message.author.username + ( _params.comment ? " # " + _params.comment : ""),
          text: `\`${result.expression}\` → \`${result.rolled}\` = **\`${result.result}\`**
                            ${result.result.toString().split('').map(digit => digitToEmoji(digit)).join(" ")}    ${result.critFailure ? ":skull_crossbones: Echec Critique :skull_crossbones:" : ""}  ${result.critSuccess ? ":zap: Réussite Critique :zap:" : ""}`
        }))
      } catch(error) {
        await message.channel.send(makeMessage({ text: "Je n'ai pas pu évaluer correctement cette expression, désolé :(" }));
      }
      break;
    case RollTypes.HELP:
    default:
      await message.channel.send(rollHelp(message));
  }
}

function rollHelp (message) {
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

async function evaluate(expression) {
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

          if (rolled > (dice - (dice / 20))) {
            critSuccess = true;
          }
          if (rolled <= (dice / 20)) {
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

function digitToEmoji (digit) {
  if (digit === "-") {
    return ":heavy_minus_sign:";
  }

  const digitEmojies = [":zero:", ":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:"];
  return digitEmojies[digit];
}

module.exports = {
  roll,
};
