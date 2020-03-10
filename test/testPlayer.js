const assert = require('chai').assert;
const Player = require('../lib/models/player');

describe('Player', () => {
  describe('getId', () => {
    it('should give the id of that player', () => {
      const player = new Player(123, 'test', [1, 4, 7, 9, 10, 45]);
      assert.deepStrictEqual(player.getId, 123);
    });
  });

  describe('statusMsg', () => {
    it('should set the status message', () => {
      const player = new Player(123, 'test', [1, 4, 7, 9, 10, 45]);
      player.statusMsg = 'hello';
      assert.deepStrictEqual(player.getStatus().statusMsg, 'hello');
    });
  });

  describe('removeTile', () => {
    it('should remove a tile from player\'s tiles', () => {
      const player = new Player(123, 'test', [1, 4, 7, 9, 10, 45]);
      const expected = [1, 4, 9, 10, 45];
      assert.deepStrictEqual(player.removeTile(7), 7);
      assert.deepStrictEqual(player.getStatus().assets.tiles, expected);
    });

    it('should not remove a tile from player\'s tiles if not present', () => {
      const player = new Player(123, 'test', [5, 18, 39, 63, 76, 25]);
      const expected = [5, 18, 39, 63, 76, 25];
      assert.notOk(player.removeTile(6));
      assert.deepStrictEqual(player.getStatus().assets.tiles, expected);
    });
  });
});
