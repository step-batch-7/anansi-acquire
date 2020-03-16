const lodash = require('lodash');

const range1 = lodash.range(6, 10);
const range2 = lodash.range(11, 20);
const range3 = lodash.range(21, 30);
const range4 = lodash.range(31, 40);
const range5 = lodash.range(41, 108);

const lookup = lodash.concat(range1, range2, range3, range4, range5);

const initialPrice = {
  zeta: 200,
  sackson: 200,
  hydra: 300,
  fusion: 300,
  america: 300,
  phoenix: 400,
  quantum: 400
};

const createPriceList = function(corp) {
  let price = initialPrice[corp];
  const priceList = [0, 0];
  const maxPriceArea = 108;
  const incrementBy = 100;

  for (let area = 2; area <= maxPriceArea; area++) {
    priceList.push(price);
    if (!lookup.includes(area)) {
      price += incrementBy;
    }
  }
  return priceList;
};

class Corporate {
  constructor(priceList) {
    this.priceList = priceList;
    this.tiles = [];
    this.isActive = false;
    this.isStable = false;
    this.stocks = 25;
  }

  static create(corp) {
    return new Corporate(createPriceList(corp));
  }

  get activeStatus() {
    return this.isActive;
  }

  get stableStatus() {
    return this.isStable;
  }

  get area() {
    return this.tiles.length;
  }

  get price() {
    return this.priceList[this.area];
  }

  get majority() {
    return this.price * 10;
  }

  get minority() {
    return this.price * 5;
  }

  get stable() {
    return this.isStable;
  }

  establish(tiles) {
    this.isActive = true;
    this.tiles = tiles.slice();
    if (this.area >= 11) {
      this.isStable = true;
    }
  }

  addTiles(tiles) {
    this.tiles = this.tiles.concat(tiles);
    if (this.area >= 11) {
      this.isStable = true;
    }
  }

  defunct() {
    this.isActive = false;
    const result = {
      tiles: this.tiles.slice(),
      majority: this.majority,
      minority: this.minority
    };
    this.tiles = [];
    return result;
  }

  removeStocks(num) {
    const isStocksRemaining = this.stocks >= num;
    if (isStocksRemaining) {
      this.stocks -= num;
    }
    return isStocksRemaining;
  }

  get status() {
    return {
      stocks: this.stocks,
      tiles: this.tiles.slice(),
      area: this.area,
      price: this.price,
      majority: this.majority,
      minority: this.minority,
      isActive: this.isActive,
      isStable: this.isStable
    };
  }
}

module.exports = Corporate;
