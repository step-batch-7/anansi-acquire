const Corporate = require('./corporate');

class Corporations {
  constructor(){
    this.phoenix = Corporate.create('phoenix');
    this.quantum = Corporate.create('quantum');
    this.hydra = Corporate.create('hydra');
    this.fusion = Corporate.create('fusion');
    this.america = Corporate.create('america');
    this.sackson = Corporate.create('sackson');
    this.zeta = Corporate.create('zeta');
  }
  
  getMajorityOfCorp(corporate){
    return this[corporate].majority;
  }

  getMinorityOfCorp(corporate){
    return this[corporate].minority;
  }

  removeStocks(corporate, numOfStocks){
    return this[corporate].removeStocks(numOfStocks);
  }

  getAreaOfCorp(corporate){
    return this[corporate].area;
  }

  isStable(corporate) {
    return this[corporate].stable;
  }
  
  getCorporateStocksPrice(corporate){
    return this[corporate] && this[corporate].price;
  }

  establishCorporate(corporate, tiles){
    const isNotActive = !this[corporate].activeStatus;
    if(isNotActive){
      this[corporate].establish(tiles);
    }
    return isNotActive;
  }

  mergeCorporate(bigCorp, smallCorp, mergerTile){
    if(!this[smallCorp].stableStatus){
      const {tiles, majority, minority} = this[smallCorp].defunct();
      this[bigCorp].addTiles(tiles);
      this[bigCorp].addTiles(mergerTile);
      return {majority, minority, isMerged: true};
    }
    return {isMerged: false};
  }

  getInactiveCorporate(){
    const inactiveCorporate = [];
    const corpStatus = this.status;
    for (const corp in corpStatus){
      if(!corpStatus[corp].isActive){
        inactiveCorporate.push(corp);
      }
    }
    return inactiveCorporate;
  }

  getActiveCorporate(){
    const activeCorporate = [];
    const corpStatus = this.status;
    for (const corp in corpStatus){
      if(corpStatus[corp].isActive){
        activeCorporate.push(corp);
      }
    }
    return activeCorporate;
  }

  addTiles(corporate, tiles){
    this[corporate].addTiles(tiles);
  }

  get status() {
    return {
      phoenix: this.phoenix.status,
      quantum: this.quantum.status,
      hydra: this.hydra.status,
      fusion: this.fusion.status,
      america: this.america.status,
      sackson: this.sackson.status,
      zeta: this.zeta.status
    };
  }
}

module.exports = Corporations;
