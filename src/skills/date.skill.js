const { makeMessage } = require('../utils');
const DateUtils = require('../utils/date.utils');
const { COLORS } = require('../utils/color.utils');

const THUMBNAILS = {
  clock: 'https://youthful-austin-955dee.netlify.com/icons/clock.png',
};

async function date(message, phrase) {
  if (['help', 'aide', '?'].includes(phrase.toLowerCase())) {
    message.channel.send(makeMessage({
      thumbnail: THUMBNAILS.clock,
      title: 'Aide ◈ +date ?',
      text: "Aide de la commande `!date`.\n\nDate permet d'obtenir des informations sur la aujourd'hui ou la date choisie, ou de convertir des dates.",
      fields: [
          { name: 'commandes',
            value: "`+date` ou `!date today` → A propos d'aujourd'hui (date, évènements...)"
              + "\n`+date` ou `!date today` → A propos d'aujourd'hui (date, évènements...)"
              + "\n`+date [date]` -> A propos d'une date (date, évènements...). `[date]` peut être **Grégorienne** `22 Février`, `12/05`, `Samedi`, ou **Mouvélienne** `25 Zéphyr`."
              + "\n`+date [date] -> réel` → Convertir une date Mouvélienne en sa correspondance Grégorienne. `[date]` peut être `15 Colosse`, `46 Scion 1337`."
              + "\n`+date [date] -> mouv` → Convertir une date Grégorienne en sa correspondance Mouvélienne. `[date]` peut être `15 Septembre`, `12 Juin 2018`, `12/05`, `10/09/2020`."
          },
      ]
    }));

    return null;
  }

  if (['', 'today', "aujourd'hui", 'now'].includes(phrase.toLowerCase())) {
    const todayDate = new Date();
    const mouvelianDate = DateUtils.gregorianToMouvelian(todayDate);

    await message.channel.send(makeMessage({
      thumbnail: THUMBNAILS.clock,
      title: `Aujourd'hui, le ${DateUtils.mouvelianToFrenchString(mouvelianDate)}.`,
      text: `Nous sommes le **${DateUtils.mouvelianToFrenchString(mouvelianDate)}** _(${DateUtils.dateToFrenchString(todayDate, { withYear: true })})_`,
    }));

    return null;
  }

  if (phrase.toLowerCase().includes('-> réel')) {
    return convertMouvelianToGregorianCommand(message, phrase);
  }

  if (phrase.toLowerCase().includes('-> mouv')) {
    return convertGregorianToMouvelianCommand(message, phrase);
  }

  message.channel.send(makeMessage({
    thumbnail: THUMBNAILS.clock,
    title: `Aide ◈ +date ?`,
    text: "Malgré l'infinité de mes connaissances, je ne suis pas en mesure de t'aider. Essaie `+date aide` pour apprendre à utiliser cette commande.",
    color: COLORS.orange,
  }));

  return null;
}

async function convertGregorianToMouvelianCommand(message, phrase) {
  const dateString = phrase.split('-> mouv')[0].trim();
  let date;
  let mouvelianDate;

  try {
    if (['today', 'now', "aujourd'hui"].includes(dateString.toLowerCase())) {
      date = new Date();
    } else {
      date = DateUtils.frenchToDate(dateString);
    }

    mouvelianDate = DateUtils.gregorianToMouvelian(date);
  } catch (err) {
    message.channel.send(makeMessage({
      thumbnail: THUMBNAILS.clock,
      title: `Conversion de date`,
      text: "Impossible de convertir la date. Le format attendu est `+date Jour Mois Année -> réel`.\n\nPar exemples: `+date samedi -> mouv`, `+date 15 Janvier -> mouv`, `+date 6 Septembre 2042 -> mouv`.",
      color: COLORS.red,
    }));
    return null;
  }

  message.channel.send(makeMessage({
    thumbnail: THUMBNAILS.clock,
    title: `Conversion de date`,
    text: `**${DateUtils.mouvelianToFrenchString(mouvelianDate, { withYear: true })}** <- _(${DateUtils.dateToFrenchString(date, { withYear: true })})_`,
  }));

  return null;
}

async function convertMouvelianToGregorianCommand(message, phrase) {
  const dateString = phrase.split('-> réel')[0].trim();

  let mouvelianDate;
  let realDate;
  try {
    mouvelianDate = DateUtils.frenchToMouvelian(dateString);

    realDate = DateUtils.mouvelianToGregorian(mouvelianDate);
  } catch (err) {
    message.channel.send(makeMessage({
      thumbnail: THUMBNAILS.clock,
      title: `Conversion de date`,
      text: "Impossible de convertir la date. Le format attendu est `+date Jour Saison -> réel`.\n\nPar exemple: `+date 24 Scion -> réel`.",
      color: COLORS.red,
    }));
    return null;
  }

  message.channel.send(makeMessage({
    thumbnail: THUMBNAILS.clock,
    title: `Conversion de date`,
    text: `**${DateUtils.dateToFrenchString(realDate, { withYear: true })}** <- _(${DateUtils.mouvelianToFrenchString(mouvelianDate, { withYear: true })})_`,
  }));

  return null;
}

module.exports = {
  date,
};
