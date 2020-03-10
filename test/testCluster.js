const assert = require('chai').assert;
const sinon = require('sinon');
const Cluster = require('../lib/models/cluster');

describe('Cluster', function() {
  describe('createTiles', () => {
    it('should create instance of Cluster', function() {
      const cluster = Cluster.createTiles();
      assert.instanceOf(cluster, Cluster);
    });
  });

  describe('getRandomTiles', () => {
    it('should give list of random Tiles for given number', function() {
      const fake = sinon.fake.returns(0);
      sinon.replace(Math, 'floor', fake);
      const cluster = Cluster.createTiles();
      assert.deepStrictEqual(cluster.getRandomTiles(3), [0, 1, 2]);
      sinon.restore();
    });
  });
});
