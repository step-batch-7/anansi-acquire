const Player = require('./player');

const findPositionOfPlayer = function(list, id){
  const result = list.reduce((context, player, index) => {
    if(player.getId === context.id){
      context.index = index;
    }
    return context;
  }, {id, index: 0});
  return result.index;
};

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
  }

  setCurrentPlayerStatus(){
    const msg = 'it is your turn, place a tile';
    this.players[this.currentPlayerNo].statusMsg = msg;
  }

  hasAllPlayerJoined(){
    return this.players.length === this.noOfPlayers;
  }

  placeATile(tile){
    if(
      this.players[this.currentPlayerNo].removeTile(tile)
    ) {
      this.placedTiles.push(tile);
    }
  }

  getStatus(playerId){
    const position = findPositionOfPlayer(this.players.slice(), playerId);
    const playerStatus = this.players[position].getStatus();
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
        allPlayersName: ['Ramu', 'John', 'Aman'], 
        currentPlayer: 1},
      activity: [{type: 'tilePlaced', text: 'Placed Initial Tiles'}]
    };
  }
}

module.exports = Game;
