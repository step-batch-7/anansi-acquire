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

const placeATile = function(tile){
  sentPostReq(
    '/game/placeTile', 
    {
      method: 'POST', 
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify({tile: tile.innerText})
    },
    updateGamePage
  );
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

const createTile = function(text){
  return `<div class="playersTile" onclick="placeATile(this)">${text}</div>`;
};

const createTileSets = function(tiles){
  return tiles.map(tileName => createTile(tileName)).join('');
};

const showPlayerAssets = function(assets){
  const playerMoney = document.getElementById('playerMoney');
  playerMoney.innerText = `$${assets.money}`;
  const cluster = document.querySelector('.cluster');
  cluster.innerHTML = createTileSets(assets.tiles);
  for(const corp in assets.stocks){
    const corpStocks = document.getElementById(`${corp}_stocks`);
    corpStocks.innerText = assets.stocks[corp];
  }
};

const showProfileName = function(name){
  const playerName = document.getElementById('playerName');
  playerName.innerText = name;
};

const createProfile = function(name, id){
  return `<div class="profile" id="player${id}">
    <div>${name}</div>
    <img src="images/profile.png" alt="" />
    </div>`;
};

const createPlayersProfile = function(playersNames){
  return playersNames.map(
    (playerName, id) => createProfile(playerName, id)
  ).join('');
};

const showAllPlayersProfile = function(playersProfile){
  const playersBox = document.getElementById('players');
  playersBox.innerHTML = createPlayersProfile(playersProfile.allPlayersName);
};

const showStatus = function(status){
  const messageBox = document.getElementById('messageBox');
  messageBox.innerText = status;
};

const showCardBody = function(card, tab) {
  const cardsBody = Array.from(document.querySelectorAll('.cardBody'));
  const tabs = Array.from(document.querySelectorAll('.tabs'));
  cardsBody.forEach(cardBody => cardBody.classList.add('hideDiv'));
  tabs.forEach(tab => tab.classList.remove('selected'));
  const activeCard = document.getElementById(card);
  activeCard.classList.remove('hideDiv');
  tab.classList.add('selected');
};

const createActivityRow = function({type, text}){
  return `<p>${text}</p>`;
};

const createActivityLog = function(activities){
  return activities.map(activity => createActivityRow(activity)).join('');
};

const showActivityLog = function(activities){
  const activityCard = document.getElementById('activityLog');
  activityCard.innerHTML = createActivityLog(activities);
};

const updateGamePage = function(data){
  addPlacedTilesOnBoard(data.placedTiles);
  showCorpInfo(data.infoTable);
  showPlayerAssets(data.player.assets);
  showProfileName(data.player.name);
  showAllPlayersProfile(data.playersProfile);
  showStatus(data.player.statusMsg);
  showActivityLog(data.activity);
  if(data.turn === 'yourTurn'){
    return clearInterval(update);
  }
  update = startInterval();
};

const startInterval = function(){
  const timeInterval = 3000;
  return setInterval(
    () => sentGetReq('/update', updateGamePage), timeInterval
  );
};

const sentUpdateReq = function(callback){
  sentGetReq('/update', callback);
  showStatus('Welcome');
};

const main = function(){
  createBoard();
  sentUpdateReq(updateGamePage);
};

let update = startInterval();

window.onload = main;
