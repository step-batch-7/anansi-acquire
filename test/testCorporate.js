const assert = require('chai').assert;
const Corporate = require('../lib/models/corporate.js');

describe('Corporate', function() {
  describe('status', function() {
    it('should give status of given corporation', function() {
      const phoenix = Corporate.create('phoenix');
      const expected = {
        stocks: 25,
        tiles: [],
        area: 0,
        price: 0,
        majority: 0,
        minority: 0,
        isActive: false,
        isStable: false
      };
      assert.deepStrictEqual(phoenix.status, expected);
    });
  });

  describe('establish', () => {
    it(`should establish the corporate with the given tile 
    and change the active status`, () => {
      const corporate = Corporate.create('zeta');
      corporate.establish([0, 1]);
      const expected = {
        stocks: 25,
        tiles: [0, 1],
        area: 2,
        price: 200,
        majority: 2000,
        minority: 1000,
        isActive: true,
        isStable: false
      };
      assert.deepStrictEqual(corporate.status, expected);
    });

    it(`should establish a stable corporate with the given tile 
    and change the active status`, () => {
      const corporate = Corporate.create('zeta');
      corporate.establish([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
      const expected = {
        stocks: 25,
        tiles: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        area: 12,
        price: 700,
        majority: 7000,
        minority: 3500,
        isActive: true,
        isStable: true
      };
      assert.deepStrictEqual(corporate.status, expected);
    });
  });

  describe('addTile', () => {
    it('should add tile to the given corporate ', () => {
      const corporate = Corporate.create('zeta');
      corporate.establish([0, 1]);
      corporate.addTiles([2, 3]);
      const expected = {
        stocks: 25,
        tiles: [0, 1, 2, 3],
        area: 4,
        price: 400,
        majority: 4000,
        minority: 2000,
        isActive: true,
        isStable: false
      };
      assert.deepStrictEqual(corporate.status, expected);
    });

    it('should add tile and make it stable when tiles are more than 11', () => {
      const corporate = Corporate.create('zeta');
      corporate.establish([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      corporate.addTiles([10]);
      const expected = {
        stocks: 25,
        tiles: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        area: 11,
        price: 700,
        majority: 7000,
        minority: 3500,
        isActive: true,
        isStable: true
      };
      assert.deepStrictEqual(corporate.status, expected);
    });
  });

  describe('defunct', () => {
    it('should defunct the given corp', () => {
      const corporate = Corporate.create('zeta');
      corporate.establish([0, 1, 2]);
      const actual = corporate.defunct();
      const expected = {tiles: [0, 1, 2], majority: 3000, minority: 1500};
      const status = {
        stocks: 25,
        tiles: [],
        area: 0,
        price: 0,
        majority: 0,
        minority: 0,
        isActive: false,
        isStable: false
      };
      assert.deepStrictEqual(actual, expected);
      assert.deepStrictEqual(corporate.status, status);
    });
  });
});
