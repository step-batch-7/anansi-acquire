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

const main = function(){
  createBoard();
};

window.onload = main;
