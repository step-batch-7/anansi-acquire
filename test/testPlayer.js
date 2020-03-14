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

    it('should give the status message', () => {
      const player = new Player(1, 'test', []);
      player.statusMsg = 'hello';
      assert.deepStrictEqual(player.status, 'hello');
    });

    it('should give the status when state is not wait', () => {
      const player = new Player(1, 'test', []);
      player.bonus = true;
      player.state = 'testing';
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
  });

  describe('addTile', () => {
    it('should not give tile to player when tile is not available', () => {
      const player = new Player(123, 'test', [1, 7, 9, 10, 45]);
      const expected = [1, 7, 9, 10, 45];
      player.addTile(undefined);
      assert.deepStrictEqual(player.getStatus().assets.tiles, expected);
    });
    it('should add tile to player\'s tile', () => {
      const player = new Player(123, 'test', [1, 7, 9, 10, 45]);
      const expected = [1, 7, 9, 10, 45, 5];
      player.addTile(5);
      assert.deepStrictEqual(player.getStatus().assets.tiles, expected);
    });
  });
});
