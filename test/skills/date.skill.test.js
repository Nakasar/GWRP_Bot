const { expect } = require('chai');
const sinon = require('sinon');

const Skill = require('../../src/skills/date.skill');
const { COLORS } = require('../../src/utils/color.utils');
const DateUtils = require('../../src/utils/date.utils');

describe('Skill date', () => {
  describe('!date command', () => {
    context('on help', () => {
      it('should return command help message', async () => {
        const message = {
          channel: {
            send: sinon.fake()
          }
        };

        await expect(Skill.date(message, 'help')).to.eventually.be.null;
        sinon.assert.calledOnce(message.channel.send);
        await expect(message.channel.send.lastArg).to.be.an('object').that.has.property('embed').that.is.an('object').that.has.property('title', 'Aide ◈ !date ?');
      });
    });

    context('on today', () => {
      it('should return today message', async () => {
        const message = {
          channel: {
            send: sinon.fake()
          }
        };

        const today = new Date();

        await expect(Skill.date(message, '')).to.eventually.be.null;
        sinon.assert.calledOnce(message.channel.send);

        await expect(message.channel.send.lastArg).to.be.an('object').that.has.property('embed').that.is.an('object').that.has.property('title', `Aujourd'hui, ${DateUtils.dateToFrenchString(today)}.`);
        await expect(message.channel.send.lastArg).to.be.an('object').that.has.property('embed').that.is.an('object').that.has.property('description');
        await expect(message.channel.send.lastArg.embed.description).to.include(DateUtils.mouvelianToFrenchString({ day: 15, season: 1, year: 1337 }));
      });
    });

    context('on -> réel', () => {
      it('should return converted date', async () => {
        const message = {
          channel: {
            send: sinon.fake()
          }
        };

        const dateString = '12 Zéphyr';
        const mouvelianDate = DateUtils.frenchToMouvelian(dateString);
        const gregorianDate = DateUtils.mouvelianToGregorian(mouvelianDate);

        await expect(Skill.date(message, dateString + ' -> réel')).to.eventually.be.null;
        sinon.assert.calledOnce(message.channel.send);
        await expect(message.channel.send.lastArg).to.be.an('object').that.has.property('embed').that.is.an('object').that.has.property('description');
        await expect(message.channel.send.lastArg.embed.description).to.include(DateUtils.dateToFrenchString(gregorianDate));
        await expect(message.channel.send.lastArg.embed.description).to.include(DateUtils.mouvelianToFrenchString(mouvelianDate));
      });
    });

    context('on -> mouv', () => {
      context('with full date', () => {
        it('should return converted date', async () => {
          const message = {
            channel: {
              send: sinon.fake()
            }
          };

          const dateString = '16 Janvier 2018';
          const gregorianDate = DateUtils.frenchToDate(dateString);
          const mouvelianDate = DateUtils.gregorianToMouvelian(gregorianDate);

          await expect(Skill.date(message, dateString + ' -> mouv')).to.eventually.be.null;
          sinon.assert.calledOnce(message.channel.send);
          await expect(message.channel.send.lastArg).to.be.an('object').that.has.property('embed').that.is.an('object').that.has.property('description');
          await expect(message.channel.send.lastArg.embed.description).to.include(DateUtils.dateToFrenchString(gregorianDate));
          await expect(message.channel.send.lastArg.embed.description).to.include(DateUtils.mouvelianToFrenchString(mouvelianDate));
        });

        it('should return converted date', async () => {
          const message = {
            channel: {
              send: sinon.fake()
            }
          };

          const dateString = '4-Septembre/2018';
          const gregorianDate = DateUtils.frenchToDate(dateString);
          const mouvelianDate = DateUtils.gregorianToMouvelian(gregorianDate);

          await expect(Skill.date(message, dateString + ' -> mouv')).to.eventually.be.null;
          sinon.assert.calledOnce(message.channel.send);
          await expect(message.channel.send.lastArg).to.be.an('object').that.has.property('embed').that.is.an('object').that.has.property('description');
          await expect(message.channel.send.lastArg.embed.description).to.include(DateUtils.dateToFrenchString(gregorianDate));
          await expect(message.channel.send.lastArg.embed.description).to.include(DateUtils.mouvelianToFrenchString(mouvelianDate));
        });

        it('should return converted date', async () => {
          const message = {
            channel: {
              send: sinon.fake()
            }
          };

          const dateString = '14/06/2018';
          const gregorianDate = DateUtils.frenchToDate(dateString);
          const mouvelianDate = DateUtils.gregorianToMouvelian(gregorianDate);

          await expect(Skill.date(message, dateString + ' -> mouv')).to.eventually.be.null;
          sinon.assert.calledOnce(message.channel.send);
          await expect(message.channel.send.lastArg).to.be.an('object').that.has.property('embed').that.is.an('object').that.has.property('description');
          await expect(message.channel.send.lastArg.embed.description).to.include(DateUtils.dateToFrenchString(gregorianDate));
          await expect(message.channel.send.lastArg.embed.description).to.include(DateUtils.mouvelianToFrenchString(mouvelianDate));
        });
      });

      context('without year', () => {
        it('should return converted date', async () => {
          const message = {
            channel: {
              send: sinon.fake()
            }
          };

          const dateString = '12 Janvier';
          const gregorianDate = DateUtils.frenchToDate(dateString);
          const mouvelianDate = DateUtils.gregorianToMouvelian(gregorianDate);

          await expect(Skill.date(message, dateString + ' -> mouv')).to.eventually.be.null;
          sinon.assert.calledOnce(message.channel.send);
          await expect(message.channel.send.lastArg).to.be.an('object').that.has.property('embed').that.is.an('object').that.has.property('description');
          await expect(message.channel.send.lastArg.embed.description).to.include(DateUtils.dateToFrenchString(gregorianDate));
          await expect(message.channel.send.lastArg.embed.description).to.include(DateUtils.mouvelianToFrenchString(mouvelianDate));
        });

        it('should return converted date', async () => {
          const message = {
            channel: {
              send: sinon.fake()
            }
          };

          const dateString = '4-Septembre';
          const gregorianDate = DateUtils.frenchToDate(dateString);
          const mouvelianDate = DateUtils.gregorianToMouvelian(gregorianDate);

          await expect(Skill.date(message, dateString + ' -> mouv')).to.eventually.be.null;
          sinon.assert.calledOnce(message.channel.send);
          await expect(message.channel.send.lastArg).to.be.an('object').that.has.property('embed').that.is.an('object').that.has.property('description');
          await expect(message.channel.send.lastArg.embed.description).to.include(DateUtils.dateToFrenchString(gregorianDate));
          await expect(message.channel.send.lastArg.embed.description).to.include(DateUtils.mouvelianToFrenchString(mouvelianDate));
        });

        it('should return converted date', async () => {
          const message = {
            channel: {
              send: sinon.fake()
            }
          };

          const dateString = '4/06';
          const gregorianDate = DateUtils.frenchToDate(dateString);
          const mouvelianDate = DateUtils.gregorianToMouvelian(gregorianDate);

          await expect(Skill.date(message, dateString + ' -> mouv')).to.eventually.be.null;
          sinon.assert.calledOnce(message.channel.send);
          await expect(message.channel.send.lastArg).to.be.an('object').that.has.property('embed').that.is.an('object').that.has.property('description');
          await expect(message.channel.send.lastArg.embed.description).to.include(DateUtils.dateToFrenchString(gregorianDate));
          await expect(message.channel.send.lastArg.embed.description).to.include(DateUtils.mouvelianToFrenchString(mouvelianDate));
        });

        it('should return converted date', async () => {
          const message = {
            channel: {
              send: sinon.fake()
            }
          };

          const dateString = '01/03';
          const gregorianDate = DateUtils.frenchToDate(dateString);
          const mouvelianDate = DateUtils.gregorianToMouvelian(gregorianDate);

          await expect(Skill.date(message, dateString + ' -> mouv')).to.eventually.be.null;
          sinon.assert.calledOnce(message.channel.send);
          await expect(message.channel.send.lastArg).to.be.an('object').that.has.property('embed').that.is.an('object').that.has.property('description');
          await expect(message.channel.send.lastArg.embed.description).to.include(DateUtils.dateToFrenchString(gregorianDate));
          await expect(message.channel.send.lastArg.embed.description).to.include(DateUtils.mouvelianToFrenchString(mouvelianDate));
        });
      });

      context('with week day', () => {
        it('should return converted date', async () => {
          const message = {
            channel: {
              send: sinon.fake()
            }
          };

          const dateString = 'Samedi';
          const gregorianDate = DateUtils.frenchToDate(dateString);
          const mouvelianDate = DateUtils.gregorianToMouvelian(gregorianDate);

          await expect(Skill.date(message, dateString + ' -> mouv')).to.eventually.be.null;
          sinon.assert.calledOnce(message.channel.send);
          await expect(message.channel.send.lastArg).to.be.an('object').that.has.property('embed').that.is.an('object').that.has.property('description');
          await expect(message.channel.send.lastArg.embed.description).to.include(DateUtils.dateToFrenchString(gregorianDate));
          await expect(message.channel.send.lastArg.embed.description).to.include(DateUtils.mouvelianToFrenchString(mouvelianDate));
        });

        it('should return converted date', async () => {
          const message = {
            channel: {
              send: sinon.fake()
            }
          };

          const dateString = 'lundi';
          const gregorianDate = DateUtils.frenchToDate(dateString);
          const mouvelianDate = DateUtils.gregorianToMouvelian(gregorianDate);

          await expect(Skill.date(message, dateString + ' -> mouv')).to.eventually.be.null;
          sinon.assert.calledOnce(message.channel.send);
          await expect(message.channel.send.lastArg).to.be.an('object').that.has.property('embed').that.is.an('object').that.has.property('description');
          await expect(message.channel.send.lastArg.embed.description).to.include(DateUtils.dateToFrenchString(gregorianDate));
          await expect(message.channel.send.lastArg.embed.description).to.include(DateUtils.mouvelianToFrenchString(mouvelianDate));
        });
      });

      context('with today', () => {
        it("should return converted today's date", async () => {
          const message = {
            channel: {
              send: sinon.fake()
            }
          };

          const dateString = 'today';
          const gregorianDate = new Date();
          const mouvelianDate = DateUtils.gregorianToMouvelian(gregorianDate);

          await expect(Skill.date(message, dateString + ' -> mouv')).to.eventually.be.null;
          sinon.assert.calledOnce(message.channel.send);
          await expect(message.channel.send.lastArg).to.be.an('object').that.has.property('embed').that.is.an('object').that.has.property('description');
          await expect(message.channel.send.lastArg.embed.description).to.include(DateUtils.dateToFrenchString(gregorianDate));
          await expect(message.channel.send.lastArg.embed.description).to.include(DateUtils.mouvelianToFrenchString(mouvelianDate));
        });
      });

      context('with invalid date', () => {
        it('should return error', async () => {
          const message = {
            channel: {
              send: sinon.fake()
            }
          };

          await expect(Skill.date(message, 'Samedi 2019 -> mouv')).to.eventually.be.null;
          sinon.assert.calledOnce(message.channel.send);
          await expect(message.channel.send.lastArg).to.be.an('object').that.has.property('embed').that.has.property('color', COLORS.red);
        });

        it('should return error', async () => {
          const message = {
            channel: {
              send: sinon.fake()
            }
          };

          await expect(Skill.date(message, '15 pasunmois 2019 -> mouv')).to.eventually.be.null;
          sinon.assert.calledOnce(message.channel.send);
          await expect(message.channel.send.lastArg).to.be.an('object').that.has.property('embed').that.has.property('color', COLORS.red);
        });

        it('should return error', async () => {
          const message = {
            channel: {
              send: sinon.fake()
            }
          };

          await expect(Skill.date(message, 'bulshit boullhisto -> mouv')).to.eventually.be.null;
          sinon.assert.calledOnce(message.channel.send);
          await expect(message.channel.send.lastArg).to.be.an('object').that.has.property('embed').that.has.property('color', COLORS.red);
        });

        it('should return error', async () => {
          const message = {
            channel: {
              send: sinon.fake()
            }
          };

          await expect(Skill.date(message, '16 28 2018 9876 -> mouv')).to.eventually.be.null;
          sinon.assert.calledOnce(message.channel.send);
          await expect(message.channel.send.lastArg).to.be.an('object').that.has.property('embed').that.has.property('color', COLORS.red);
        });
      });
    });

    context('on invalid command', () => {
      it('should display error message', async () => {
        const message = {
          channel: {
            send: sinon.fake()
          }
        };

        await expect(Skill.date(message, 'not a valid command')).to.eventually.be.null;
        sinon.assert.calledOnce(message.channel.send);
        await expect(message.channel.send.lastArg).to.be.an('object').that.has.property('embed').that.has.property('color', COLORS.orange);
      });
    });
  });
});
