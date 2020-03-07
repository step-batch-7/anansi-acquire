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
});
