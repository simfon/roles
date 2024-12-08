/* eslint-disable */
const expect = require('expect');
const Names = require('./index.js');
const Utils = require('../utils');
const NameData = require('../data/names.json');


describe('Names', () => {
  const races = Object.keys(NameData);

  it('generate() with race and no gender - make a workable string', () => {
    Utils.forCount(50, () => {
      const race = Utils.pick(races);
      const name = Names.generate({ race });
      expect(typeof name).toBe('string');
      expect(name).toBeTruthy();
    });
  });

  it('generate() with gender and no race - make a workable string', () => {
    Utils.forCount(50, () => {
      const gender = Utils.pick(['Male', 'Female']);
      const name = Names.generate({ gender });
      expect(typeof name).toBe('string');
      expect(name).toBeTruthy();
    });
  });

  it('function call of every race produces a workable string', () => {
    races.forEach((race) => {
      const name = Names[race]();
      expect(typeof name).toBe('string');
      expect(name).toBeTruthy();
    });
  });
});
