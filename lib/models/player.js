class Player {
  constructor(id, name, tiles) {
    this.id = id;
    this.name = name;
    this.money = 6000;
    this.tiles = tiles.slice();
    this.stocks = {
      phoenix: 0,
      quantum: 0,
      hydra: 0,
      fusion: 0,
      america: 0,
      sackson: 0,
      zeta: 0
    };
    this.statusMessage = 'Wait for your turn';
    this.turn = false;
    this.state = 'wait';
  }

  toggleTurn() {
    this.turn = !this.turn;
  }

  get getId() {
    return this.id;
  }

  get playerName() {
    return this.name;
  }

  set statusMsg(msg) {
    this.statusMessage = msg;
  }

  addTile(tile) {
    this.tiles.push(tile);
  }

  removeTile(tile) {
    if (this.tiles.includes(tile)) {
      const index = this.tiles.indexOf(tile);
      const noOfReplacement = 1;
      return this.tiles.splice(index, noOfReplacement).pop();
    }
    return false;
  }

  addStocks(corporation, numberOfStocks){
    this.stocks[corporation] = this.stocks[corporation] + numberOfStocks;
  }

  getStatus() {
    return {
      assets: {
        money: this.money,
        stocks: Object.assign({}, this.stocks),
        tiles: this.tiles.slice()
      },
      name: this.name,
      statusMsg: this.statusMessage,
      turn: this.turn
    };
  }
}

module.exports = Player;
