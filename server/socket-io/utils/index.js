const Utils = require('../../pc-creator/utils');

const throwDice = (n) => {
  const results = [0];
  for (let i = 0; i < n; i += 1) {
    results.push(Utils.rand(-1, 3));
    Utils.resetSeed();
  }
  return results.reduce((partialSum, a) => partialSum + a);
};

const generateResult = (wUserid, wPGid, lUserid, lPGid, lCliche) => ({
  winner: {
    userid: wUserid,
    PGid: wPGid,
  },
  loser: {
    userid: lUserid,
    PGid: lPGid,
    cliche: lCliche,
  },
});

module.exports = {
  throwDice,
  generateResult,
}