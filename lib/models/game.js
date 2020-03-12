const lodash = require('lodash');
const Player = require('./player');
const ActivityLog = require('./activityLog');
const Cluster = require('./cluster');
const Corporations = require('./corporations');

const getAdjacentTiles = function(placed, tile) {
  const [top, bottom, left, right] = [tile - 12, tile + 12, tile - 1, tile + 1];
  let adjTiles = [tile, top, left, right, bottom];
  if (tile % 12 === 0) {
    adjTiles = [tile, top, right, bottom];
  }
  if (tile % 12 === 11) {
    adjTiles = [tile, top, left, bottom];
  }
  return adjTiles.filter(num => num >= 0 && num < 108 && placed.includes(num));
};

const getGroups = function(groups, tiles) {
  const index = groups.findIndex(grp => tiles.some(tile => grp.includes(tile)));
  if (index >= 0) {
    groups[index] = [...new Set(groups[index].concat(tiles))];
    return groups;
  }
  tiles.length > 1 && groups.push(tiles);
  return groups;
};

const tileGenerator = function(num) {
  const firstCharCode = 64;
  const columnNo = 12;
  let number = num % columnNo;
  number++;
  let increment = Math.floor(num / columnNo);
  increment++;
  const alphabet = String.fromCharCode(firstCharCode + increment);
  return `${number}${alphabet}`;
};

const getMaxAndSecondMaxNumbers = function(numbers) {
  const sortedList = numbers.sort((n1, n2) => n2 - n1);
  const max = sortedList.shift();
  if (sortedList[0] === max) {
    return [max];
  }
  return [max, sortedList[0]];
};
class Game {
  constructor(id, noOfPlayers) {
    this.id = id;
    this.noOfPlayers = noOfPlayers;
    this.players = [];
    this.currentPlayerNo = 0;
    this.cluster = Cluster.createTiles();
    this.activityLog = new ActivityLog();
    this.placedTiles = [];
    this.started = false;
    this.corporations = new Corporations();
    this.unincorporatedTiles = [];
  }

  get requiredPlayers() {
    return this.noOfPlayers;
  }

  addPlayer(id, name) {
    this.players.push(new Player(id, name, this.cluster.getRandomTiles(6)));
  }

  get currentPlayer() {
    return this.players[this.currentPlayerNo];
  }

  setCurrentPlayerStatus() {
    const msg = 'It is your turn, place a tile';
    this.currentPlayer.statusMsg = msg;
  }

  setCurrentPlayerState() {
    this.currentPlayer.toggleTurn();
    this.currentPlayer.state = 'placeTile';
  }

  start() {
    this.decideOrder();
    this.started = true;
    this.setCurrentPlayerState();
    this.setCurrentPlayerStatus();
    this.addInitialActivity();
    return this.started;
  }

  get hasStarted() {
    return this.started;
  }

  hasAllPlayerJoined() {
    return this.players.length === this.noOfPlayers;
  }

  changePlayerTurn() {
    this.currentPlayer.addTile(this.cluster.getRandomTiles(1).pop());
    this.currentPlayer.toggleTurn();
    this.currentPlayer.state = 'wait';
    const msg = 'Wait for your turn';
    this.currentPlayer.statusMsg = msg;
    this.currentPlayerNo = ++this.currentPlayerNo % this.noOfPlayers;
    this.currentPlayer.toggleTurn();
    this.setCurrentPlayerStatus();
    this.activityLog.addLog('turn', `${this.currentPlayer.playerName}'s turn`);
    this.currentPlayer.state = 'placeTile';
  }

  addInitialActivity() {
    this.activityLog.addLog('order', 'Order decide based on initial tiles');
    this.activityLog.addLog('tilePlaced', 'Initial tile placed');
    this.activityLog.addLog('turn', `${this.currentPlayer.playerName}'s turn`);
  }

  decideOrder() {
    const tiles = this.cluster.getRandomTiles(this.noOfPlayers);
    const tilePlayerPair = lodash.zip(tiles, this.players);
    tilePlayerPair.forEach(([tile, player]) => {
      const text = `${player.playerName} got ${tileGenerator(tile)}`;
      this.activityLog.addLog('gotTile', text);
    });
    const orderedPair = tilePlayerPair.sort(([t1], [t2]) => t1 - t2);
    const [orderedTiles, orderedPlayers] = lodash.unzip(orderedPair);
    this.placedTiles = this.placedTiles.concat(orderedTiles);
    this.players = orderedPlayers;
  }

  updateActivityForTilePlaced(tile) {
    const tileName = tileGenerator(tile);
    const name = this.currentPlayer.playerName;
    const activityMsg = `${name} placed ${tileName}. `;
    this.activityLog.addLog('tilePlaced', activityMsg);
  }

  canPlayerPlaceTile(tile, id) {
    const state = this.currentPlayer.state;
    const isValidPlayer = this.currentPlayer.id === id;
    const isTileRemoved = this.currentPlayer.removeTile(tile);
    return state === 'placeTile' && isValidPlayer && isTileRemoved;
  }

  getAdjacentCorporate(tile) {
    const activeCorp = this.corporations.getActiveCorporate();
    const adjacentCorp = [];
    const status = this.corporations.status;
    activeCorp.forEach(corp => {
      const tiles = status[corp].tiles;
      const adjacentTiles = getAdjacentTiles(tiles, tile);
      if (adjacentTiles.length > 0) {
        adjacentCorp.push(corp);
      }
    });
    return adjacentCorp;
  }

  getAdjacentPlacedTileList(tile) {
    const adjacentTiles = getAdjacentTiles(this.placedTiles.slice(), tile);
    return adjacentTiles.reduce((group, adjacentTile) => {
      if (group.includes(adjacentTile)) {
        return group;
      }
      const includeGroup = this.unincorporatedTiles.find(adjacentGroup =>
        adjacentGroup.includes(adjacentTile)
      );
      if (includeGroup) {
        group.push(...includeGroup);
        return group;
      }
      group.push(adjacentTile);
      return group;
    }, []);
  }

  increaseCorporate(tile, corporate) {
    const adjacentPlacedTiles = this.getAdjacentPlacedTileList(tile);
    this.corporations.addTiles(corporate, adjacentPlacedTiles);
    this.corporations.addTiles(corporate, tile);
  }

  manageTilePlacement(tile) {
    const adjacentCorp = this.getAdjacentCorporate(tile);
    const length = adjacentCorp.length;
    if (length === 0) {
      return this.placeNormalTile(tile);
    }

    if (length === 1) {
      return this.increaseCorporate(tile, ...adjacentCorp);
    }
    return this.mergeCorporations(tile, adjacentCorp);
  }

  placeNormalTile(tile) {
    this.placedTiles.push(tile);
  }

  getBiggerToSmallerCorp(corporations) {
    const areas = corporations.map(corp => {
      return this.corporations.getAreaOfCorp(corp);
    });
    const areaCorpPair = lodash.zip(areas, corporations);
    const sortedPair = areaCorpPair.sort(([a1], [a2]) => {
      return a2 - a1;
    });
    return lodash.unzip(sortedPair)[1];
  }

  getCorporateStocks(corporate) {
    return this.players.reduce((corporateStock, player) => {
      const stocks = player.getStocks(corporate);
      if (stocks > 0) {
        corporateStock.push(stocks);
      }
      return corporateStock;
    }, []);
  }

  giveBonusToMaxStockHolders(bonus, stock, smallCorp) {
    const stockHolders = this.players.filter(
      player => player.stocks[smallCorp] === stock
    );
    const holdersCount = stockHolders.length;
    const totalBonus = bonus.majority + bonus.minority;
    const bonusPerPlayer = totalBonus / holdersCount;
    let msg = `got $${bonusPerPlayer} majority bonus`;
    if (holdersCount === 1) {
      msg = `got $${bonusPerPlayer} majority and minority bonus`;
    }
    stockHolders.forEach(player => {
      player.addMoney(bonusPerPlayer);
      player.statusMsg = `You ${msg}`;
      player.bonus = true;
      this.activityLog.addLog('bonus', `${player.playerName} ${msg}`);
    });
  }

  distributeMinority(minority, stock, smallCorp) {
    const stockHolders = this.players.filter(
      player => player.stocks[smallCorp] === stock
    );
    const holdersCount = stockHolders.length;
    const bonusPerPlayer = minority / holdersCount;
    const msg = `got $${bonusPerPlayer} minority bonus`;
    stockHolders.forEach(player => {
      player.addMoney(bonusPerPlayer);
      player.statusMsg = `You ${msg}`;
      player.bonus = true;
      this.activityLog.addLog('bonus', `${player.playerName} ${msg}`);
    });
  }

  giveBonusToStockHolders(bonus, stocks, smallCorp) {
    const [maxStocks, secondMaxStock] = stocks;
    const majorityHolder = this.players.find(
      player => player.stocks[smallCorp] === maxStocks
    );
    majorityHolder.addMoney(bonus.majority);
    majorityHolder.statusMsg = `You got $${bonus.majority} majority bonus`;
    const name = majorityHolder.playerName;
    const msg = `${name} got $${bonus.majority} majority bonus`;
    this.activityLog.addLog('bonus', msg);
    this.distributeMinority(bonus.minority, secondMaxStock, smallCorp);
  }

  distributeBonus(bonus, smallCorp) {
    const corporateStocks = this.getCorporateStocks(smallCorp);
    const stocks = getMaxAndSecondMaxNumbers(corporateStocks.slice());
    const [maxStock, secondMaxStock] = stocks;
    if (!secondMaxStock) {
      return this.giveBonusToMaxStockHolders(bonus, maxStock, smallCorp);
    }
    this.giveBonusToStockHolders(bonus, stocks, smallCorp);
  }

  mergeCorporations(tile, corporations) {
    const sortedCorp = this.getBiggerToSmallerCorp(corporations);
    const bigCorp = sortedCorp[0];
    const smallCorp = sortedCorp[1];
    const bonus = this.corporations.mergeCorporate(bigCorp, smallCorp, tile);
    const adjacentPlacedTiles = this.getAdjacentPlacedTileList(tile);
    this.corporations.addTiles(bigCorp, adjacentPlacedTiles);
    const mergeMaker = this.currentPlayer.playerName;
    const mergeMsg = `${mergeMaker} merged ${smallCorp} with ${bigCorp}`;
    this.activityLog.addLog('merge', mergeMsg);
    this.distributeBonus(bonus, smallCorp);
  }

  checkCorpEstablishment() {
    const corpsLength = this.corporations.getInactiveCorporate().length;
    if(this.unincorporatedTiles.length > 0) {
      if(corpsLength > 0) {
        return this.changePlayerState(this.currentPlayer.getId, 'establish');
      }
      return this.changePlayerState(this.currentPlayer.getId, 'no-corps');
    }
    this.changePlayerTurn();
    return true;
  }

  placeATile(tile, playerId) {
    if (this.canPlayerPlaceTile(tile, playerId)) {
      this.manageTilePlacement(tile);
      this.setUnincorporatedGroups();
      this.updateActivityForTilePlaced(tile);
      return this.checkCorpEstablishment();
    }
    return false;
  }

  removePlacedTiles(tiles) {
    tiles.forEach(tile => {
      const index = this.placedTiles.indexOf(tile);
      this.placedTiles.splice(index, 1);
    });
  }

  getPlayer(id) {
    return this.players.find(player => player.id === id);
  }

  updateActivityAfterEstablish(corporation) {
    const activityMsg = `${this.currentPlayer.name} established ${corporation}`;
    this.activityLog.addLog('establish', activityMsg);
  }

  canPlayerEstablishCorp(tiles, corporation, playerId) {
    if(!tiles) {
      return false;
    }
    const isValidPlayer = this.currentPlayer.id === playerId;
    const isInactive = this.corporations.establishCorporate(corporation, tiles);
    return isValidPlayer && isInactive;
  }
  
  establishCorporation(tile, corporation, playerId) {
    const tiles = this.unincorporatedTiles.find(group => group.includes(tile));
    if(this.canPlayerEstablishCorp(tiles, corporation, playerId)) {
      this.removePlacedTiles(tiles);
      if (this.corporations.removeStocks(corporation, 1)) {
        const player = this.getPlayer(playerId);
        player.addStocks(corporation, 1);
      }
      this.updateActivityAfterEstablish(corporation);
      this.changePlayerTurn();
      return true;
    }
    return false;
  }

  getPlayerStatus(id) {
    for (let index = 0; index < this.noOfPlayers; index++) {
      if (this.players[index].getId === id) {
        return this.players[index].getStatus();
      }
    }
  }

  getPlayerNames() {
    return this.players.map(player => player.playerName);
  }

  changePlayerState(id, state) {
    const msg = 'You can establish a corporation';
    if (state === 'establish') {
      this.currentPlayer.statusMsg = msg;
    }
    const player = this.getPlayer(id);
    player.state = state;
    return true;
  }

  setUnincorporatedGroups() {
    this.unincorporatedTiles = this.placedTiles.reduce((groups, tile) => {
      groups.push(getAdjacentTiles(this.placedTiles.slice(), tile));
      return groups.reduce(getGroups, []);
    }, []);
  }

  getStateData(playerId) {
    const player = this.getPlayer(playerId);
    const state = player.state;
    const data = {state};
    if (state === 'establish') {
      data.availableCorporations = this.corporations.getInactiveCorporate();
      data.groups = this.unincorporatedTiles;
    }
    return data;
  }

  getStatus(playerId) {
    return {
      status: {
        placedTiles: this.placedTiles,
        corporations: this.corporations.status,
        player: this.getPlayerStatus(playerId),
        playersProfile: {
          allPlayersName: this.getPlayerNames(),
          currentPlayer: this.currentPlayerNo
        },
        activity: this.activityLog.logs
      },
      action: this.getStateData(playerId)
    };
  }
}

module.exports = Game;
