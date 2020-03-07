class Player{
  constructor(id, name){
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
      zeta: 0};
  }

  get getId(){
    return this.id;
  }
  
  getStatus(){
    return{
      assets: {
        money: this.money, 
        stocks: Object.assign({}, this.stocks),
        tiles: this.tiles.slice()
      },
      name: this.name
    };
  }

}

module.exports = Player;
