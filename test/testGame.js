const assert = require('chai').assert;
const sinon = require('sinon');
const Game = require('../lib/models/game');

describe('Game', () => {
  before(() => {
    const fake = sinon.fake.returns(0);
    sinon.replace(Math, 'floor', fake);
  });
  after(() => sinon.restore());
  describe('addPlayer', () => {
    it('should add a player with the given id, name and unique tiles', () => {
      const game = new Game(1, 2);
      game.addPlayer(12, 'test');
      game.addPlayer(13, 'test2');
      const expected = {
        name: 'test2',
        assets: {
          money: 6000,
          tiles: [6, 7, 8, 9, 10, 11],
          stocks: {
            phoenix: 0,
            quantum: 0,
            hydra: 0,
            fusion: 0,
            america: 0,
            sackson: 0,
            zeta: 0
          }
        },
        statusMsg: 'Wait for your turn',
        turn: false
      };
      assert.deepStrictEqual(game.getStatus(13).status.player, expected);

      const firstPlayerTiles = game.getStatus(12).status.player.assets.tiles;
      const secondPlayerTiles = game.getStatus(13).status.player.assets.tiles;
      assert.notDeepEqual(firstPlayerTiles, secondPlayerTiles);
    });
  });

  describe('setCurrentPlayerStatus', () => {
    it('should set current player status', () => {
      const game = new Game(1, 1);
      game.addPlayer(12, 'test');
      game.setCurrentPlayerStatus();
      const expected = {
        name: 'test',
        assets: {
          money: 6000,
          tiles: [0, 1, 2, 3, 4, 5],
          stocks: {
            phoenix: 0,
            quantum: 0,
            hydra: 0,
            fusion: 0,
            america: 0,
            sackson: 0,
            zeta: 0
          }
        },
        statusMsg: 'It is your turn, place a tile',
        turn: false
      };
      assert.deepStrictEqual(game.getStatus(12).status.player, expected);
    });
  });

  describe('hasAllPlayerJoined', () => {
    it('should give true when all players has joined', () => {
      const game = new Game(1, 1);
      game.addPlayer(12, 'test');
      assert.ok(game.hasAllPlayerJoined());
    });

    it('should give false when all players has not joined', () => {
      const game = new Game(1, 3);
      game.addPlayer(12, 'test');
      assert.notOk(game.hasAllPlayerJoined());
    });
  });

  describe('start', function() {
    it('should start game and give true', function() {
      const game = new Game(1, 3);
      game.addPlayer(12, 'test');
      game.addPlayer(12, 'test');
      game.addPlayer(12, 'test');
      assert.isTrue(game.start());
    });
  });

  describe('hasStarted', function() {
    it('should give true when game has started', function() {
      const game = new Game(1, 3);
      game.addPlayer(12, 'test');
      game.addPlayer(12, 'test');
      game.addPlayer(12, 'test');
      game.start();
      assert.isTrue(game.hasStarted);
    });

    it('should give false when game has not started', function() {
      const game = new Game(1, 2);
      game.addPlayer(12, 'test');
      game.addPlayer(12, 'test');
      assert.isFalse(game.hasStarted);
    });
  });

  describe('canPlayerPlaceTile', () => {
    it('should give true if player state and the tile is removed from player tiles', () => {
      const game = new Game(1, 1);
      game.addPlayer(1, 'test');
      game.players[0].state = 'placeTile';
      game.players[0].tiles = [1];
      assert.ok(game.canPlayerPlaceTile(1, 1));
    });

    it('should give false if player state and the tile not present in player tiles', () => {
      const game = new Game(1, 1);
      game.addPlayer(1, 'test');
      game.players[0].state = 'placeTile';
      game.players[0].tiles = [1];
      assert.notOk(game.canPlayerPlaceTile(2));
    });

    it('should give false if player state is wait and the tile is present in player tiles', () => {
      const game = new Game(1, 1);
      game.addPlayer(1, 'test');
      game.players[0].state = 'wait';
      game.players[0].tiles = [1];
      assert.notOk(game.canPlayerPlaceTile(1));
    });
  });

  describe('setUnincorporatedGroups', () => {
    it('should set the unincorporated groups', () => {
      const game = new Game(1, 1);
      game.placeNormalTile(1);
      game.placeNormalTile(2);
      game.setUnincorporatedGroups();
      assert.deepStrictEqual(game.unincorporatedTiles, [[1, 2]]);
    });
  });

  describe('changePlayerState', () => {
    it('should change the player state to establish for id and state given', () => {
      const game = new Game(1, 1);
      game.addPlayer(1, 'test');
      game.currentPlayer = game.players[0];
      assert.ok(game.changePlayerState(1, 'establish'));
    });

    it('should change the player state to establish for id and state given', () => {
      const game = new Game(1, 1);
      game.addPlayer(1, 'test');
      game.currentPlayer = game.players[0];
      assert.ok(game.changePlayerState(1, 'testing'));
    });
  });

  describe('placeATile', () => {
    it('should move a tile from player\'s tile to placed tile', () => {
      const game = new Game(1, 1);
      game.addPlayer(12, 'test');
      game.players[0].state = 'placeTile';
      assert.ok(game.placeATile(5, 12));
    });

    it('should not move a tile from player\'s tile to placed tile', () => {
      const game = new Game(1, 1);
      game.addPlayer(12, 'test');
      assert.notOk(game.placeATile('5C', 12));
    });

    it('should return true if there is chance to establish a corporation', () => {
      const game = new Game(1, 1);
      game.addPlayer(1, 'test');
      game.players[0].tiles = [3];
      game.players[0].state = 'placeTile';
      game.placeNormalTile(1);
      game.placeNormalTile(2);
      assert.ok(game.placeATile(3, 1));
    });

    it('should place a normal tile on the board if all the tiles are on the edge of the board', () => {
      const game = new Game(1, 1);
      game.addPlayer(1, 'test');
      game.players[0].tiles = [3];
      game.players[0].state = 'placeTile';
      game.placeNormalTile(12);
      game.placeNormalTile(11);
      assert.ok(game.placeATile(3, 1));
    });

    it('should return false if player tries to place in others turn', () => {
      const game = new Game(1, 1);
      game.addPlayer(1, 'test');
      game.players[0].tiles = [3];
      game.players[0].state = 'placeTile';
      game.placeNormalTile(1);
      game.placeNormalTile(2);
      assert.notOk(game.placeATile(3, 2));
    });

    it('should merge two corporate when the tile is mergerTile and distribute bonus to one player', () => {
      const game = new Game(1, 1);
      game.placedTiles = [0, 1, 2, 4, 5];
      game.unincorporatedTiles = [[0, 1, 2], [4, 5]];
      game.addPlayer(1, 'test');
      game.players[0].tiles = [3];
      game.establishCorporation(1, 'zeta', 1);
      game.establishCorporation(4, 'sackson', 1);
      assert.ok(game.placeATile(3, 1));
    });

    it('should merge two corporate when the tile is mergerTile and distribute bonus to more than one player', () => {
      const game = new Game(1, 1);
      game.placedTiles = [0, 1, 2, 4, 5];
      game.unincorporatedTiles = [[0, 1, 2], [4, 5]];
      game.addPlayer(1, 'test');
      game.addPlayer(2, 'test2');
      game.players[1].addStocks('sackson', 1);
      game.players[0].tiles = [3];
      game.establishCorporation(1, 'zeta', 1);
      game.establishCorporation(4, 'sackson', 1);
      assert.ok(game.placeATile(3, 1));
    });

    it('should increase a corporate if the tile in adjacent to a corporate', () => {
      const game = new Game(1, 1);
      game.placedTiles = [0, 1, 2];
      game.unincorporatedTiles = [[0, 1, 2]];
      game.addPlayer(1, 'test');
      game.players[0].tiles = [3];
      game.establishCorporation(1, 'zeta', 1);
      assert.ok(game.placeATile(3, 1));
    });
  });

  describe('removePlacedTiles', () => {
    it('should remove tiles from the placedTiles', () => {
      const game = new Game(1, 1);
      game.placeNormalTile(1);
      game.placeNormalTile(2);
      game.placeNormalTile(3);
      game.removePlacedTiles([1, 2]);
      assert.deepStrictEqual(game.placedTiles, [3]);
    });
  });

  describe('establishCorporation', () => {
    it('should give true for unincorporated tiles and active corporations present ', () => {
      const game = new Game(1, 1);
      game.addPlayer(1, 'test');
      game.players[0].tiles = [3];
      game.players[0].state = 'placeTile';
      game.placeNormalTile(1);
      game.placeNormalTile(2);
      game.placeATile(3, 1);
      assert.ok(game.establishCorporation(3, 'phoenix', 1));
    });

    it('should give false for unincorporated tiles not present', () => {
      const game = new Game(1, 1);
      game.addPlayer(1, 'test');
      game.players[0].tiles = [3];
      game.players[0].state = 'placeTile';
      game.currentPlayer = {id: 1};
      game.placeNormalTile(1);
      game.placeATile(3, 1);
      assert.notOk(game.establishCorporation(3, 'phoenix', 1));
    });

    it('should give false for active corporations not present', () => {
      const game = new Game(1, 1);
      game.addPlayer(1, 'test');
      game.players[0].tiles = [3];
      game.players[0].state = 'placeTile';
      game.placeNormalTile(2);
      game.placeATile(3);
      game.corporations = {establishCorporate: () => false};
      assert.notOk(game.establishCorporation(3, 'phoenix', 1));
    });

    it('should give true for unincorporated tiles and active corporations present but should not add stock to player when not available ', () => {
      const game = new Game(1, 1);
      game.addPlayer(1, 'test');
      game.players[0].tiles = [3];
      game.players[0].state = 'placeTile';
      game.placeNormalTile(1);
      game.placeNormalTile(2);
      game.placeATile(3, 1);
      game.corporations.removeStocks('phoenix', 25);
      assert.ok(game.establishCorporation(3, 'phoenix', 1));
      assert.deepStrictEqual(game.getStatus(1).status.player.assets.stocks.phoenix, 0);
    });

    it('should not establish a corporate when unincorporated tiles available but no corporate available', () => {
      const game = new Game(1, 1);
      game.addPlayer(1, 'test');
      game.players[0].tiles = [3];
      game.unincorporatedTiles = [[0, 1, 2]];
      game.corporations = {getInactiveCorporate: () => []};
      assert.ok(game.checkCorpEstablishment());
    });
  });

  describe('getStateData', () => {
    it('should get only state if the player state is wait', () => {
      const game = new Game(1, 1);
      game.addPlayer(1, 'test');
      game.players[0].state = 'wait';
      assert.deepStrictEqual(game.getStateData(1), {state: 'wait'});
    });

    it('should get state with data for the player state is establish', () => {
      const game = new Game(1, 1);
      game.addPlayer(1, 'test');
      game.placeNormalTile(1);
      game.placeNormalTile(2);
      game.corporations = {getInactiveCorporate: () => ['phoenix']};
      game.setUnincorporatedGroups();
      game.players[0].state = 'establish';
      const state = {
        state: 'establish',
        availableCorporations: ['phoenix'],
        groups: [[1, 2]]
      };
      assert.deepStrictEqual(game.getStateData(1), state);
    });
  });

  describe('getPlayerStatus', () => {
    it('should give player status of given id', () => {
      const game = new Game(1, 2);
      game.addPlayer(12, 'test');
      game.addPlayer(13, 'test2');
      const expected = {
        name: 'test2',
        assets: {
          money: 6000,
          tiles: [6, 7, 8, 9, 10, 11],
          stocks: {
            phoenix: 0,
            quantum: 0,
            hydra: 0,
            fusion: 0,
            america: 0,
            sackson: 0,
            zeta: 0
          }
        },
        statusMsg: 'Wait for your turn',
        turn: false
      };
      assert.deepStrictEqual(game.getPlayerStatus(13), expected);
    });
  });

  describe('getPlayerNames', () => {
    it('should give list of all players name', () => {
      const game = new Game(1, 2);
      game.addPlayer(12, 'test');
      game.addPlayer(13, 'test2');
      const expected = ['test', 'test2'];
      assert.deepStrictEqual(game.getPlayerNames(), expected);
    });
  });

  describe('requiredPlayers', () => {
    it('should give no of players require for the game', () => {
      const game = new Game(1, 4);
      assert.deepStrictEqual(game.requiredPlayers, 4);
    });
  });

  describe('decideOrder', function() {
    it('should give ordered player list', function() {
      const game = new Game(1, 3);
      game.addPlayer(12, 'test');
      game.addPlayer(13, 'test2');
      game.addPlayer(14, 'test3');
      game.decideOrder();
      assert.deepStrictEqual(game.getPlayerNames(), ['test', 'test2', 'test3']);
    });
  });

  describe('getAdjacentCorporate', () => {
    it('should give the adjacent corporations', () => {
      const game = new Game(1, 1);
      game.placedTiles = [0, 1, 2, 4, 5];
      game.unincorporatedTiles = [[0, 1, 2], [4, 5]];
      game.addPlayer(1, 'test');
      game.establishCorporation(1, 'zeta', 1);
      game.establishCorporation(4, 'sackson', 1);
      assert.deepStrictEqual(game.getAdjacentCorporate(3), ['sackson', 'zeta']);
    });

    it('should not give the adjacent corporations when tile has no adjacent corporation', () => {
      const game = new Game(1, 1);
      game.placedTiles = [0, 1, 2, 4, 5];
      game.unincorporatedTiles = [[0, 1, 2], [4, 5]];
      game.addPlayer(1, 'test');
      game.establishCorporation(1, 'zeta', 1);
      game.establishCorporation(4, 'sackson', 1);
      assert.deepStrictEqual(game.getAdjacentCorporate(87), []);
    });
  });

  describe('getAdjacentPlacedTileList', () => {
    it('should give the adjacent corporations', () => {
      const game = new Game(1, 1);
      game.placedTiles = [43, 55, 56, 32, 20, 45];
      game.unincorporatedTiles = [[43, 55, 56], [20, 32]];
      assert.deepStrictEqual(game.getAdjacentPlacedTileList(44), [20, 32, 43, 55, 56, 45]);
    });
  });

  describe('increaseCorporate', () => {
    it('should give no of players require for the game', () => {
      const game = new Game(1, 1);
      game.placedTiles = [0, 1, 2];
      game.unincorporatedTiles = [[0, 1, 2]];
      game.addPlayer(1, 'test');
      game.establishCorporation(0, 'zeta', 1);
      game.increaseCorporate(3, 'zeta');
      assert.deepStrictEqual(game.getStatus(1).status.corporations.zeta.tiles, [0, 1, 2, 3]);
    });
  });
  
  describe('getBiggerToSmallerCorp', () => {
    it('should give the sorted corporations with area', () => {
      const game = new Game(1, 1);
      game.placedTiles = [0, 1, 2];
      game.unincorporatedTiles = [[0, 1, 2]];
      game.addPlayer(1, 'test');
      game.establishCorporation(0, 'zeta', 1);
      assert.deepStrictEqual(game.getBiggerToSmallerCorp(['zeta']), ['zeta']);
    });
  });

  describe('getCorporateStocks', () => {
    it('should give no stocks when no player has stock', () => {
      const game = new Game(1, 1);
      game.placedTiles = [0, 1, 2];
      game.unincorporatedTiles = [[0, 1, 2]];
      game.addPlayer(1, 'test');
      game.establishCorporation(0, 'zeta', 1);
      game.players[0].stocks.zeta = 0;
      assert.deepStrictEqual(game.getCorporateStocks('zeta'), []);
    });
  });

  describe('distributeMinority', () => {
    it('should give the minority bonus to the player', () => {
      const game = new Game(1, 1);
      game.addPlayer(1, 'test');
      game.distributeMinority(3000, 0, 'zeta');
      assert.deepStrictEqual(game.getStatus(1).status.player.assets.money, 9000);
    });
  });

  describe('giveBonusToStockHolders', () => {
    it('should give the majority and  minority bonus to the player', () => {
      const game = new Game(1, 1);
      game.addPlayer(1, 'test');
      game.giveBonusToStockHolders({majority: 1000, minority: 1000}, [0, 0], 'zeta');
      assert.deepStrictEqual(game.getStatus(1).status.player.assets.money, 8000);
    });
  });

  describe('distributeBonus', () => {
    it('should divide majority and minority between two stockHolders', () => {
      const game = new Game(1, 2);
      game.addPlayer(1, 'test');
      game.addPlayer(2, 'test2');
      game.players[0].stocks.zeta = 2;
      game.players[1].stocks.zeta = 1;
      game.distributeBonus({majority: 1000, minority: 500}, 'zeta');
      assert.deepStrictEqual(game.getStatus(1).status.player.assets.money, 7000);
      assert.deepStrictEqual(game.getStatus(2).status.player.assets.money, 6500);
    });
  });

  describe('addInitialActivity', () => {
    it('should add the initial activity ', () => {
      const game = new Game(1, 2);
      game.addPlayer(1, 'test');
      game.addInitialActivity();
      const expected = [
        {type: 'turn', text: 'test\'s turn'}, 
        {type: 'tilePlaced', text: 'Initial tile placed'}, 
        {type: 'order', text: 'Order decide based on initial tiles'}
      ];
      assert.deepStrictEqual(game.getStatus(1).status.activity, expected);
    });
  });
});
