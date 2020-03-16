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
    this.bonus = false;
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

  get status() {
    return this.statusMessage;
  }

  set statusMsg(msg) {
    this.statusMessage = msg;
  }

  get getMoney(){
    return this.money;
  }

  addTile(tile) {
    if (tile === undefined) {
      return;
    }
    this.tiles.push(tile);
  }

  hasTile(tile) {
    return this.tiles.includes(tile);
  }

  removeTile(tile) {
    const index = this.tiles.indexOf(tile);
    const noOfReplacement = 1;
    return this.tiles.splice(index, noOfReplacement).pop();
  }

  addStocks(corporation, numberOfStocks) {
    this.stocks[corporation] = this.stocks[corporation] + numberOfStocks;
  }

  getStocks(corporateName) {
    return this.stocks[corporateName];
  }

  addMoney(money) {
    this.money += money;
  }

  deductMoney(money){
    this.money -= money;
  }

  getStatus() {
    const msg = this.statusMessage;
    if (this.bonus) {
      this.bonus = false;
      if (this.state === 'wait') {
        this.statusMessage = 'Wait for your turn';
      }
    }
    return {
      assets: {
        money: this.money,
        stocks: Object.assign({}, this.stocks),
        tiles: this.tiles.slice()
      },
      name: this.name,
      statusMsg: msg,
      turn: this.turn
    };
  }
}

module.exports = Player;
