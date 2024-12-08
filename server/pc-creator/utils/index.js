/* eslint-disable no-param-reassign */
const SeedRandom = require('./seedrandom');

const unseededRand = SeedRandom();
let lastSeed = null;
let lastSeededRandomFunc = null;
const getSeededRandomFunc = (seed) => {
  if (seed === lastSeed) {
    return lastSeededRandomFunc;
  }
  lastSeed = seed;
  lastSeededRandomFunc = SeedRandom(seed);
  return lastSeededRandomFunc;
};
/* *
 * generate a random number between 2 inclusive values
 *
 * @param {number} min minimum number to return (inclusive)
 * @param {number} max maximum number to return (inclusive)
 * @param {any} seed
 */
const rand = (min, max, seed = null) => {
  let randomFunc;
  if (seed) {
    randomFunc = getSeededRandomFunc(seed);
  } else {
    randomFunc = unseededRand;
  }
  const minInt = parseInt(min, 10);
  const maxInt = parseInt(max, 10);
  return Math.floor(randomFunc() * (maxInt - minInt + 1)) + minInt;
};
/*
 * pick 1 or more unique values from an array, and return a new array of those picked values
 *
 * @param {any[]} array an array of values to pick from
 * @param {number} count how many unique array values to pick out
 * @param {boolean} returnAsArray if true, always return result as an array,
 * even if only 1 item is picked
 */

const pick = (array, count = 1, returnAsArray = false, seed = null) => {
  const arrayCopy = Array.from(array);
  const pickedValues = [];

  for (let i = 0; i < count; i += 1) {
    const pickedIndex = rand(0, arrayCopy.length - 1, seed);
    pickedValues.push(arrayCopy[pickedIndex]);
    arrayCopy.splice(pickedIndex, 1);
  }
  return (pickedValues.length === 1 && returnAsArray === false) ? pickedValues[0] : pickedValues;
};

/**
 * parse our special template syntax
 *
 * handles multiple "kinds" of template syntax
 *
 * a string container '{alpha/beta}' will choose one at random
 *
 * a string starting with a $ symbol is a reference for any passed content
 *   so '{$colour}' becomes 'blue' if `content` was passed as { colour: 'blue' }
 *
 * a string container using the linked format (symbol, double colon) e.g {X::aplha/beta}
 *   will ensure that any other placeholder in the string that uses the same linked symbol
 *   returns the same index of random that the first placeholder with that symbol did
 *
 * @param {string} string
 */
const parseTemplate = (string, content = {}, seed = null) => {
  const regex = /{(.+?)}/gm;
  const matches = string.match(regex);
  const linkedPlaceholderIndexes = {};
  if (matches) {
    // is our match a placeholder setup
    matches.forEach((match) => {
      const linkedPlaceholderMatches = /{(.+?)::(.+?)}/gm.exec(match);
      if (linkedPlaceholderMatches) {
        const rawLinkToken = linkedPlaceholderMatches[1];
        if (linkedPlaceholderIndexes[rawLinkToken] != null) { // if we're already setup
          const replacement = linkedPlaceholderMatches[2].split('/')[linkedPlaceholderIndexes[rawLinkToken]];
          string = string.replace(match, replacement);
        } else {
          // if not, we need to do the first one and add the index into the linkedPlaceholderIndexes
          const allPlaceholderChunks = linkedPlaceholderMatches[2].split('/');
          const newIndex = rand(0, allPlaceholderChunks.length - 1, seed);
          const replacement = allPlaceholderChunks[newIndex];
          linkedPlaceholderIndexes[rawLinkToken] = newIndex; // set it up for further matches
          string = string.replace(match, replacement);
        }
      }
    });

    matches.forEach((match) => {
      if (match.charAt(1) === '$') {
        const replacementVarName = match.substring(2, match.length - 1);
        string = string.replace(match, content[replacementVarName]);
      } else {
        const replacement = pick(match.substring(1).substring(0, match.length - 2).split('/'));
        string = string.replace(match, replacement);
      }
    });
  }

  return string;
};

/**
 *
 * @param {number} number
 * @param {function} func
 */
const forCount = (number, func) => {
  for (let i = 0; i < number; i += 1) {
    func();
  }
};

const titleCase = string => string.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

const formatRace = (race) => {
  switch (race) {
    case 'halfOrc':
      return 'Half-Orc';
    case 'halfElf':
      return 'Half-Elf';
    default:
      return titleCase(race);
  }
};

const resetSeed = () => {
  lastSeed = null;
  lastSeededRandomFunc = null;
};

/*
 * pick 1 or more unique values from an array of Cliche objects,
* and return a new array of those picked objects
 *
 * @param {cliches[{}]} cliches an array of Cliche objects to pick from
 * @param {count} the  amount of cliches
 * @param {boolean} returnAsArray if true, always return result as an array,
 * even if only 1 item is picked
 */
const pickCliche = (cliches, count = 1, returnAsArray = true, seed = null) => {
  const data = JSON.parse(JSON.stringify(cliches));
  const pickedCliches = [];
  const categories = Object.keys(data);
  let prevCategory = '';

  for (let i = 0; i < count; i += 1) {
    const category = pick(categories);
    if (data[category].length === 0 || category === prevCategory) {
      i -= 1;
    } else {
      const pickedIndex = rand(0, data[category].length - 1, seed);
      const pickedCliche = data[category][pickedIndex];
      pickedCliche.name = parseTemplate(pickedCliche.name);
      pickedCliche.text = parseTemplate(pickedCliche.text);
      pickedCliches.push({ ...pickedCliche, category });
      data[category].splice(pickedIndex, 1);
      prevCategory = category;
    }
  }
  return (pickedCliches.length === 1 && returnAsArray === false) ? pickedCliches[0] : pickedCliches;
};

/*
 * Return an array of random levels where the sum
* don't exceed maxLevel, and the first is always 4
 *
 * @param {maxLevel} the maximum sum of array ints
 */

const getLevels = (maxLevel = 10, seed = null) => {
  const sheet = [];
  let levels = 0;
  const add = (a, b) => a + b;
  while (levels < maxLevel) {
    let dice = rand(1, 3, seed);

    if (sheet.length === 0) {
      dice = 4;
    }

    if (dice + levels > maxLevel) {
      dice = maxLevel - levels;
    }

    sheet.push(dice);
    levels = sheet.reduce(add);
  }

  return sheet.sort().reverse();
};

module.exports = {
  pick,
  pickCliche,
  parseTemplate,
  rand,
  forCount,
  titleCase,
  formatRace,
  resetSeed,
  getLevels,
};
