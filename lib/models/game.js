class Game {
  constructor(id, noOfPlayers, cluster){
    this.id = id;
    this.noOfPlayers = noOfPlayers;
    this.players = [];
    this.isAllPLayersJoined = false;
    this.currentPlayer;
    this.cluster = cluster;
    this.placedTiles = ['8A', '5C', '9G'];
  }

  getStatus(){
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
      player: {
        assets: {
          money: 6000, 
          stocks: {
            phoenix: 0,
            quantum: 0, 
            hydra: 0, 
            fusion: 0, 
            america: 0, 
            sackson: 0, 
            zeta: 0},
          tiles: ['5D', '6C', '8F', '2D', '10I', '12E']},
        name: 'John'},
      playersProfile: {allPlayersName: ['John'], currentPlayer: 'John'},
      status: 'status of current activity',
      activity: 'activity log message is here'
    };
  }
}

module.exports = Game;
