const createTileOnBoard = function(number, alphabets){
  const board = document.getElementById('board');
  const tile = document.createElement('div');
  tile.classList.add('tile');
  tile.innerText = `${number}${alphabets}`;
  tile.id = `${number}${alphabets}`;
  board.appendChild(tile);
};

const createBoard = function() {
  const totalTiles = 108;
  const firstCharCode = 64;
  const columnNo = 12;
  for (let index = 0; index < totalTiles; index++) {
    let number = index % columnNo;
    number++;
    let increment = Math.floor(index / columnNo);
    increment++;
    const alphabet = String.fromCharCode(firstCharCode + increment);
    createTileOnBoard(number, alphabet);
  }
};

const addPlacedTilesOnBoard = function(tiles){
  tiles.forEach(id => {
    const tile = document.getElementById(id);
    tile.classList.add('placedTile');
  });
};

const showCorpInfo = function(corpInfo){
  for(const corp in corpInfo){
    const corpRow = document.getElementById(corp);
    corpRow.innerHTML =
      `<td>${corp}</td>
      <td>${corpInfo[corp].stocks}</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>`
    ;
  }
};

const updateGamePage = function(data){
  addPlacedTilesOnBoard(data.placedTiles);
  showCorpInfo(data.infoTable);
};

const main = function(){
  createBoard();
  sentUpdateReq(updateGamePage);
};

window.onload = main;
