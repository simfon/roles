/* eslint-disable */
const expect = require('expect');
const PCs = require('./index');
const Utils = require('../utils');

describe('PCs', () => {
  it('generate()', () => {
    Utils.forCount(50, () => {
      const pc = PCs.generate();
      expect(typeof pc).toBe('object');
      Object.keys(pc).forEach((key) => {
        expect(pc[key]).toBeTruthy();
      });
    });
  });
});
