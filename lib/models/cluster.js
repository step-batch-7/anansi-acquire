class Cluster {
  constructor(tileList) {
    this.availableTiles = tileList;
  }

  static createTiles() {
    const tiles = [];
    const totalNumOfTiles = 108;
    for (let tileNumber = 0; tileNumber < totalNumOfTiles; tileNumber++) {
      tiles.push(tileNumber);
    }
    return new Cluster(tiles);
  }
  
  getRandomTiles(count) {
    let randomTiles = [];
    for (let tilesCount = 0; tilesCount < count; tilesCount++) {
      const randomTileIndex = Math.floor(
        Math.random() * this.availableTiles.length
      );
      const NumOfRemovableTile = 1;
      randomTiles = randomTiles.concat(
        this.availableTiles.splice(randomTileIndex, NumOfRemovableTile)
      );
    }
    return randomTiles;
  }
}

module.exports = Cluster;
