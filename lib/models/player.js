class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.money = 6000;
    this.tiles = ['5D', '6C', '8F', '2D', '10I', '12E'];
    this.stocks = {
      phoenix: 0,
      quantum: 0,
      hydra: 0,
      fusion: 0,
      america: 0,
      sackson: 0,
      zeta: 0
    };
    this.statusMessage = 'Waiting for your turn';
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

  removeTile(tile) {
    if (this.tiles.includes(tile)) {
      const index = this.tiles.indexOf(tile);
      const noOfReplacement = 1;
      return this.tiles.splice(index, noOfReplacement).pop();
    }
    return false;
  }

  getStatus() {
    return {
      assets: {
        money: this.money,
        stocks: Object.assign({}, this.stocks),
        tiles: this.tiles.slice()
      },
      name: this.name,
      statusMsg: this.statusMessage
    };
  }
}

module.exports = Player;
