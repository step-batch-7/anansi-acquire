const lodash = require('lodash');
const Player = require('./player');
const ActivityLog = require('./activityLog');
const Cluster = require('./cluster');
const Corporations = require('./corporations');

const getAdjacentTiles = function(placed, tile) {
  const [top, bottom, left, right] = [tile - 12, tile + 12, tile - 1, tile + 1];
  let adjTiles = [tile, top, left, right, bottom];
  if (tile % 12 === 0) {
    adjTiles = [tile, top, right, bottom];
  }
  if (tile % 12 === 11) {
    adjTiles = [tile, top, left, bottom];
  }
  return adjTiles.filter(num => num >= 0 && num < 108 && placed.includes(num));
};

const getGroups = function(groups, tiles) {
  const index = groups.findIndex(grp => tiles.some(tile => grp.includes(tile)));
  if (index >= 0) {
    groups[index] = [...new Set(groups[index].concat(tiles))];
    return groups;
  }
  tiles.length > 1 && groups.push(tiles);
  return groups;
};

const tileGenerator = function(num) {
  const firstCharCode = 64;
  const columnNo = 12;
  let number = num % columnNo;
  number++;
  let increment = Math.floor(num / columnNo);
  increment++;
  const alphabet = String.fromCharCode(firstCharCode + increment);
  return `${number}${alphabet}`;
};

class Game {
  constructor(id, noOfPlayers) {
    this.id = id;
    this.noOfPlayers = noOfPlayers;
    this.players = [];
    this.currentPlayerNo = 0;
    this.cluster = Cluster.createTiles();
    this.activityLog = new ActivityLog();
    this.placedTiles = [];
    this.orderDecided = false;
    this.corporations = new Corporations();
    this.unincorporatedTiles = [];
  }

  get requiredPlayers() {
    return this.noOfPlayers;
  }

  addPlayer(id, name) {
    this.players.push(new Player(id, name, this.cluster.getRandomTiles(6)));
  }

  get currentPlayer() {
    return this.players[this.currentPlayerNo];
  }

  setCurrentPlayerStatus() {
    const msg = 'It is your turn, place a tile';
    this.currentPlayer.statusMsg = msg;
  }

  hasAllPlayerJoined() {
    const hasJoined = this.players.length === this.noOfPlayers;
    if (hasJoined && !this.orderDecided) {
      this.decideOrder();
      this.orderDecided = true;
    }
    return hasJoined;
  }

  changePlayerTurn() {
    this.currentPlayer.addTile(this.cluster.getRandomTiles(1).pop());
    this.currentPlayer.toggleTurn();
    this.currentPlayer.state = 'wait';
    this.currentPlayer.statusMsg = 'Wait for your turn';
    this.currentPlayerNo = ++this.currentPlayerNo % this.noOfPlayers;
    this.currentPlayer.toggleTurn();
    this.setCurrentPlayerStatus();
    this.activityLog.addLog('turn', `${this.currentPlayer.playerName}'s turn`);
  }

  addInitialActivity() {
    this.activityLog.addLog('order', 'Order decide based on initial tiles');
    this.activityLog.addLog('tilePlaced', 'Initial tile placed');
    this.activityLog.addLog('turn', `${this.currentPlayer.playerName}'s turn`);
  }

  decideOrder() {
    const tiles = this.cluster.getRandomTiles(this.noOfPlayers);
    const tilePlayerPair = lodash.zip(tiles, this.players);

    tilePlayerPair.forEach(([tile, player]) => {
      const text = `${player.playerName} got ${tileGenerator(tile)}`;
      this.activityLog.addLog('gotTile', text);
    });

    const orderedPair = tilePlayerPair.sort(([t1], [t2]) => t1 - t2);
    const [orderedTiles, orderedPlayers] = lodash.unzip(orderedPair);

    this.placedTiles = this.placedTiles.concat(orderedTiles);
    this.players = orderedPlayers;
    this.currentPlayer.toggleTurn();
    this.setCurrentPlayerStatus();
    this.addInitialActivity();
  }

  updateActivity(tile) {
    const tileName = tileGenerator(tile);
    this.currentPlayer.statusMsg = `You placed ${tileName}`;
    const name = this.currentPlayer.playerName;
    this.activityLog.addLog('tilePlaced', `${name} placed ${tileName}`);
  }

  placeATile(tile) {
    if (this.currentPlayer.removeTile(tile)) {
      this.placedTiles.push(tile);
      this.updateActivity(tile);
      this.setUnincorporatedGroups();
      const corpsLength = this.corporations.getInactiveCorporate().length;
      if (this.unincorporatedTiles.length > 0 && corpsLength > 0) {
        return this.changePlayerState(this.currentPlayer.getId, 'establish');
      }
      this.changePlayerTurn();
      return true;
    }
    return false;
  }

  removePlacedTiles(tiles) {
    tiles.forEach(tile => {
      const index = this.placedTiles.indexOf(tile);
      this.placedTiles.splice(index, 1);
    });
  }

  getPlayer(id) {
    return this.players.find(player => player.id === id);
  }

  establishCorporation(tile, corporation, playerId) {
    const tiles = this.unincorporatedTiles.find(group => group.includes(tile));
    if(tiles && this.corporations.establishCorporate(corporation, tiles)) {
      this.removePlacedTiles(tiles);
      this.corporations.removeStocks(corporation, 1);
      const player = this.getPlayer(playerId);
      player.addStocks(corporation, 1);
      this.changePlayerTurn();
      return true;
    }
    return false;
  }

  getPlayerStatus(id) {
    for (let index = 0; index < this.noOfPlayers; index++) {
      if (this.players[index].getId === id) {
        return this.players[index].getStatus();
      }
    }
  }

  getPlayerNames() {
    return this.players.map(player => player.playerName);
  }

  changePlayerState(id, state) {
    const player = this.getPlayer(id);
    player.state = state;
    return true;
  }

  setUnincorporatedGroups() {
    this.unincorporatedTiles = this.placedTiles.reduce((groups, tile) => {
      groups.push(getAdjacentTiles(this.placedTiles.slice(), tile));
      return groups.reduce(getGroups, []);
    }, []);
  }

  getStateData(playerId) {
    const player = this.getPlayer(playerId);
    const state = player.state;
    const data = {state};
    if (state === 'establish') {
      data.availableCorporations = this.corporations.getInactiveCorporate();
      data.groups = this.unincorporatedTiles;
    }
    return data;
  }

  getStatus(playerId) {
    return {
      status: {
        placedTiles: this.placedTiles,
        corporations: this.corporations.status,
        player: this.getPlayerStatus(playerId),
        playersProfile: {
          allPlayersName: this.getPlayerNames(),
          currentPlayer: this.currentPlayerNo
        },
        activity: this.activityLog.logs
      },
      action: this.getStateData(playerId)
    };
  }
}

module.exports = Game;
