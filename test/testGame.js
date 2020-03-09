const assert = require('chai').assert;
const Game = require('../lib/models/game');

describe('Game', () => {
  describe('addPlayer', () => {
    it('should add a player with the given id and name', () => {
      const game = new Game(1, 2, []);
      game.addPlayer(12, 'test');
      game.addPlayer(13, 'test2');
      const expected = {name: 'test2',
        assets: {
          money: 6000,
          tiles: ['5D', '6C', '8F', '2D', '10I', '12E'],
          stocks: {
            phoenix: 0,
            quantum: 0, 
            hydra: 0, 
            fusion: 0, 
            america: 0, 
            sackson: 0, 
            zeta: 0}
        },
        statusMsg: 'waiting for your turn'
      };
      assert.deepStrictEqual(game.getStatus(13).player, expected);
    });
  });

  describe('setCurrentPlayerStatus', () => {
    it('should set current player status', () => {
      const game = new Game(1, 1, []);
      game.addPlayer(12, 'test');
      game.setCurrentPlayerStatus();
      const expected = {name: 'test',
        assets: {
          money: 6000,
          tiles: ['5D', '6C', '8F', '2D', '10I', '12E'],
          stocks: {
            phoenix: 0,
            quantum: 0, 
            hydra: 0, 
            fusion: 0, 
            america: 0, 
            sackson: 0, 
            zeta: 0}
        },
        statusMsg: 'It is your turn, place a tile'
      };
      assert.deepStrictEqual(game.getStatus(12).player, expected);
    });
  });

  describe('hasAllPlayerJoined', () => {
    it('should give true when all players has joined', () => {
      const game = new Game(1, 1, []);
      game.addPlayer(12, 'test');
      assert.ok(game.hasAllPlayerJoined());
    });

    it('should give false when all players has not joined', () => {
      const game = new Game(1, 3, []);
      game.addPlayer(12, 'test');
      assert.notOk(game.hasAllPlayerJoined());
    });
  });

  describe('placeATile', () => {
    it('should move a tile from player\'s tile to placed tile', () => {
      const game = new Game(1, 1, []);
      game.addPlayer(12, 'test');
      game.placeATile('5D');
      const expected = ['8A', '5C', '9G', '5D'];
      assert.deepStrictEqual(game.getStatus().placedTiles, expected );
    });

    it('should not move a tile from player\'s tile to placed tile', () => {
      const game = new Game(1, 1, []);
      game.addPlayer(12, 'test');
      game.placeATile('5C');
      const expected = ['8A', '5C', '9G'];
      assert.deepStrictEqual(game.getStatus().placedTiles, expected );
    });
  });

  describe('getPlayerStatus', () => {
    it('should give player status of given id', () => {
      const game = new Game(1, 2, []);
      game.addPlayer(12, 'test');
      game.addPlayer(13, 'test2');
      const expected = {name: 'test2',
        assets: {
          money: 6000,
          tiles: ['5D', '6C', '8F', '2D', '10I', '12E'],
          stocks: {
            phoenix: 0,
            quantum: 0, 
            hydra: 0, 
            fusion: 0, 
            america: 0, 
            sackson: 0, 
            zeta: 0}
        },
        statusMsg: 'waiting for your turn'
      };
      assert.deepStrictEqual(game.getPlayerStatus(13), expected);
    });
  });

  describe('getAllPlayersName', () => {
    it('should give list of all players name', () => {
      const game = new Game(1, 2, []);
      game.addPlayer(12, 'test');
      game.addPlayer(13, 'test2');
      const expected = ['test', 'test2'];
      assert.deepStrictEqual(game.getAllPlayersName(), expected);
    });
  });
});
