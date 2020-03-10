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
      const expected = [18, 39, 63, 76, 25];
      assert.deepStrictEqual(player.removeTile(5), 5);
      assert.deepStrictEqual(player.getStatus().assets.tiles, expected);
    });

    it('should not remove a tile from player\'s tiles if not present', () => {
      const player = new Player(123, 'test');
      const expected = [5, 18, 39, 63, 76, 25];
      assert.notOk(player.removeTile(6));
      assert.deepStrictEqual(player.getStatus().assets.tiles, expected);
    });
  });
});
