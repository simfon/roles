const Names = require('../names');
const Utils = require('../utils');
const NameData = require('../data/names.json');
const PCData = require('../data/traits.json');
const fantasyCliche = require('../data/fantasy-cliche.json');

const raceSelector = (race) => {
  if (race) {
    return race;
  }

  const luck = Utils.rand(1, 8);
  if (luck < 3) {
    return Utils.pick(Object.keys(NameData));
  }

  return 'Umani';
};

const generate = (props = {}) => {
  const race = raceSelector(props.race);
  const gender = props.gender ? props.gender : Utils.pick(['Male', 'Female']);
  const name = Names.generate({ race, gender });
  const levels = Utils.getLevels(props.levels ? props.levels : 10);
  const cliches = Utils.pickCliche(fantasyCliche, levels.length);
  const traits = Utils.pick(PCData.traits, 2, true).map(Utils.parseTemplate);
  const desires = Utils.pick(PCData.desires, 1, true).map(Utils.parseTemplate);

  if (race !== 'Umani') {
    const subsKey = Utils.rand(0, cliches.length - 1);
    cliches[subsKey].name = race;
    cliches[subsKey].category = 'Razza';
  }

  const sheet = cliches.map((obj, index) => ({
    ...obj,
    level: levels[index],
    status: levels[index],
  }));

  const formattedData = {
    name,
    gender: Utils.titleCase(gender),
    race: Utils.formatRace(race),
    traits,
    desires,
    sheet,
  };

  return formattedData;
};

const functions = {
  generate,
};

module.exports = functions;
