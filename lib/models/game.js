const Player = require('./player');
class Game {
  constructor(id, noOfPlayers, cluster){
    this.id = id;
    this.noOfPlayers = noOfPlayers;
    this.players = [];
    this.currentPlayerNo = 0;
    this.cluster = cluster;
    this.placedTiles = ['8A', '5C', '9G'];
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
    }
  }

  getPlayerStatus(id){
    for(let index = 0; index < this.noOfPlayers; index++){
      if(this.players[index].getId === id){
        return this.players[index].getStatus();
      }
    }
  }

  getAllPlayersName(){
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
        allPlayersName: this.getAllPlayersName(), 
        currentPlayer: 1},
      activity: [{type: 'tilePlaced', text: 'Placed Initial Tiles'}]
    };
  }
}

module.exports = Game;
