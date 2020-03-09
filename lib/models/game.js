const Player = require('./player');
const ActivityLog = require('./activityLog');
class Game {
  constructor(id, noOfPlayers, cluster){
    this.id = id;
    this.noOfPlayers = noOfPlayers;
    this.players = [];
    this.currentPlayerNo = 0;
    this.cluster = cluster;
    this.activityLog = new ActivityLog();
    this.placedTiles = ['8A', '5C', '9G'];
  }

  get requiredPlayers(){
    return this.noOfPlayers;
  }

  addPlayer(id, name){
    this.players.push(new Player(id, name));
    this.setCurrentPlayerStatus();
  }

  get currentPlayer(){
    return this.players[this.currentPlayerNo];
  }

  setCurrentPlayerStatus(){
    const msg = 'It is your turn, place a tile';
    this.currentPlayer.statusMsg = msg;
  }

  hasAllPlayerJoined(){
    return this.players.length === this.noOfPlayers;
  }

  placeATile(tile){
    if(
      this.currentPlayer.removeTile(tile)
    ) {
      this.placedTiles.push(tile);
      this.currentPlayer.statusMsg = `You placed ${tile}`;
      const name = this.currentPlayer.playerName;
      this.activityLog.addLog('tilePlaced', `${name} placed ${tile}`);
      return true;
    }
  }

  getPlayerStatus(id){
    for(let index = 0; index < this.noOfPlayers; index++){
      if(this.players[index].getId === id){
        return this.players[index].getStatus();
      }
    }
  }

  getPlayerNames(){
    return this.players.map(player => player.playerName);
  }

  getStatus(playerId){
    const playerStatus = this.getPlayerStatus(playerId);
    return{
      placedTiles: this.placedTiles,
      infoTable: {
        phoenix: {stocks: 25, tiles: []}, 
        quantum: {stocks: 25, tiles: []}, 
        hydra: {stocks: 25, tiles: []}, 
        fusion: {stocks: 25, tiles: []}, 
        america: {stocks: 25, tiles: []}, 
        sackson: {stocks: 25, tiles: []}, 
        zeta: {stocks: 25, tiles: []}},
      player: playerStatus,
      playersProfile: {
        allPlayersName: this.getPlayerNames(), 
        currentPlayer: 0},
      activity: this.activityLog.logs
    };
  }
}

module.exports = Game;
