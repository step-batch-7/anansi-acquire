const assert = require('chai').assert;
const Player = require('../lib/models/player');

describe('Player', () => {
  describe('getId', () => {
    it('should give the id of that player', () => {
      const player = new Player(123, 'test');
      assert.deepStrictEqual(player.getId, 123);
    });
  });

  describe('statusMsg', () => {
    it('should set the status message', () => {
      const player = new Player(123, 'test');
      player.statusMsg = 'hello';
      assert.deepStrictEqual(player.getStatus().statusMsg, 'hello');
    });
  });

  describe('removeTile', () => {
    it('should remove a tile from player\'s tiles', () => {
      const player = new Player(123, 'test');
      const expected = ['6C', '8F', '2D', '10I', '12E'];
      assert.deepStrictEqual(player.removeTile('5D'), '5D');
      assert.deepStrictEqual(player.getStatus().assets.tiles, expected);
    });

    it('should not remove a tile from player\'s tiles if not present', () => {
      const player = new Player(123, 'test');
      const expected = ['5D', '6C', '8F', '2D', '10I', '12E'];
      assert.notOk(player.removeTile('5C'));
      assert.deepStrictEqual(player.getStatus().assets.tiles, expected);
    });
  });
});
