const Utils = require('../utils');
const Data = require('../data/names.json');

/**
 * generate a name for a race and gender.
 *
 * @param {string} props.race generate with a specific race
 * @param {string} props.gender generate with a specific gender
 */
const generatePc = (props = {}) => {
  let { race, gender } = props;

  if (race == null) {
    race = Utils.pick(Object.keys(Data));
  }

  if (gender == null) {
    gender = Utils.pick(['Male', 'Female']);
  }

  const raceTemplates = Data[race].templates;

  if (!raceTemplates) {
    throw new Error(`could not find race templates for ${race}`);
  }

  const template = Utils.pick(raceTemplates);

  switch (race) {
    /*     case 'Nani':
    case 'Elfi':
    case 'Drow': */
    default:// HUMANS ARE THE DEFAULT CASE
      return Utils.parseTemplate(template, {
        first: Utils.pick(Data[race][gender]),
        last: Utils.pick(Data[race].last),
      });
/*     case 'halfElf':
      return Utils.parseTemplate(template, {
        humanFirst: Utils.pick(Data.human[gender]),
        humanLast: Utils.pick(Data.human.last),
        elfFirst: Utils.pick(Data.elf[gender]),
        elfLast: Utils.pick(Data.elf.last),
      }); */
  }
};

const sanitise = name => name;

const generate = (props) => {
  const name = generatePc(props);
  return sanitise(name);
};

const functions = {
  generate,
};

// setup a function for each race
Object.keys(Data).forEach((race) => {
  functions[race] = (props = {}) => {
    // eslint-disable-next-line no-param-reassign
    props.race = race;
    return generate(props);
  };
});

module.exports = functions;
