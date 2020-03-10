const lodash = require('lodash');
const Player = require('./player');
const ActivityLog = require('./activityLog');
const Cluster = require('./cluster');
const Corporation = require('./corporation');

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
    this.corporations = {
      phoenix: Corporation.create('phoenix'),
      quantum: Corporation.create('quantum'),
      zeta: Corporation.create('zeta'),
      fusion: Corporation.create('fusion'),
      america: Corporation.create('america'),
      sackson: Corporation.create('sackson'),
      hydra: Corporation.create('hydra')
    };
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
    if(hasJoined && !this.orderDecided){
      this.decideOrder();
      this.orderDecided = true;
    }
    return hasJoined;
  }

  changePlayerTurn(){
    this.currentPlayer.toggleTurn();
    this.currentPlayer.statusMsg = 'Wait for your turn';
    this.currentPlayerNo = ++this.currentPlayerNo % this.noOfPlayers;
    this.currentPlayer.toggleTurn();
    this.setCurrentPlayerStatus();
  }

  addInitialActivity(){
    this.activityLog.addLog('order', 'Order decide based on initial tiles');
    this.activityLog.addLog('tilePlaced', 'Initial tile placed');
  }

  decideOrder(){
    const tiles = this.cluster.getRandomTiles(this.noOfPlayers);
    const tilePlayerPair = lodash.zip(tiles, this.players);

    tilePlayerPair.forEach(([tile, player]) => {
      const text = `${player.playerName} got ${tileGenerator(tile)}`;
      this.activityLog.addLog('tilePlaced', text);
    });
    this.addInitialActivity();

    const orderedPair = tilePlayerPair.sort(([t1], [t2]) => t1 - t2);
    const [orderedTiles, orderedPlayers] = lodash.unzip(orderedPair);

    this.placedTiles = this.placedTiles.concat(orderedTiles);
    this.players = orderedPlayers;
    this.currentPlayer.toggleTurn();
    this.setCurrentPlayerStatus();
  }

  placeATile(tile) {
    if (this.currentPlayer.removeTile(tile)) {
      this.placedTiles.push(tile);
      const tileName = tileGenerator(tile);
      this.currentPlayer.statusMsg = `You placed ${tileName}`;
      const name = this.currentPlayer.playerName;
      this.activityLog.addLog('tilePlaced', `${name} placed ${tileName}`);
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

  getStatus(playerId) {
    return {
      placedTiles: this.placedTiles,
      infoTable: {
        phoenix: this.corporations.phoenix.status,
        quantum: this.corporations.quantum.status,
        hydra: this.corporations.hydra.status,
        fusion: this.corporations.fusion.status,
        america: this.corporations.america.status,
        sackson: this.corporations.sackson.status,
        zeta: this.corporations.zeta.status
      },
      player: this.getPlayerStatus(playerId),
      playersProfile: {
        allPlayersName: this.getPlayerNames(),
        currentPlayer: this.currentPlayerNo
      },
      activity: this.activityLog.logs
    };
  }
}

module.exports = Game;
