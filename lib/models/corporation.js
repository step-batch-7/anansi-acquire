const lodash = require('lodash');

const firstRange = lodash.range(6, 10);
const secondRange = lodash.range(11, 20);
const thirdRange = lodash.range(21, 30);
const fourthRange = lodash.range(31, 40);

const lookup = lodash.concat(firstRange, secondRange, thirdRange, fourthRange);

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
  const maxPriceArea = 41;
  const incrementBy = 100;

  for (let area = 2; area <= maxPriceArea; area++) {
    priceList.push(price);
    if (!lookup.includes(area)) {
      price += incrementBy;
    }
  }
  return priceList;
};

class Corporation {
  constructor(priceList) {
    this.priceList = priceList;
    this.tiles = [];
    this.isActive = false;
    this.isStable = false;
    this.stocks = 25;
  }

  static create(corp) {
    return new Corporation(createPriceList(corp));
  }

  get status() {
    const stocks = this.stocks;
    const area = this.tiles.length;
    const price = this.priceList[area];
    const majority = price * 10;
    const minority = majority / 2;
    const isActive = this.isActive;
    const isStable = this.isStable;
    return {stocks, area, price, majority, minority, isActive, isStable};
  }
}

module.exports = Corporation;
