const createTileOnBoard = function(num, tileValue) {
  const board = document.getElementById('board');
  const tile = document.createElement('div');
  tile.classList.add('tile');
  tile.innerText = tileValue;
  tile.id = num;
  board.appendChild(tile);
};

const createBoard = function() {
  const totalTiles = 108;
  for (let index = 0; index < totalTiles; index++) {
    const tile = tileGenerator(index);
    createTileOnBoard(index, tile);
  }
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

const establish = (tile, corporation) => {
  showError(`You established ${corporation}`);
  const tiles = Array.from(document.querySelectorAll('.tile'));
  tiles.forEach(tile => tile.removeAttribute('onclick'));
  sentPostReq(
    'establish',
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({tile, corporation})
    },
    handleAction
  );
};

const showError = function(msg) {
  const msgBox = document.querySelector('#hiddenMessage');
  msgBox.innerText = msg;
  document.querySelector('#messageBox').classList.add('hideDiv');
  msgBox.classList.remove('hideDiv');
  setTimeout(() => {
    msgBox.classList.add('hideDiv');
    document.querySelector('#messageBox').classList.remove('hideDiv');
  }, 2000);
};

const addListeners = function(corp, groups) {
  const tiles = Array.from(document.querySelectorAll('.tile'));
  const unincorporatedGroups = JSON.parse(groups).flat();
  tiles.forEach(tile => {
    if(unincorporatedGroups.includes(+tile.id)) {
      return tile.setAttribute('onclick', `establish(${+tile.id}, '${corp}')`);
    }
    const err = 'You can\'t establish a corporation there';
    tile.setAttribute('onclick', `showError("${err}")`);
  });
};

const generateEstablishActions = function(groups, corporations) {
  const generateHtml = function(html, corp) {
    const button = `<button
    onclick="addListeners('${corp}', '${JSON.stringify(groups)}')">
    ${corp}</button>`;
    return html + button;
  };
  return corporations.reduce(generateHtml, '');
};

let tileClicked = '1';

const placeATile = function(tile) {
  showError(`You placed ${tileGenerator(tile)}`);
  tileClicked = tileGenerator(tile);
  sentPostReq(
    'placeTile',
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({tile})
    },
    handleAction,
    () => showError('You can\'t place a tile now')
  );
};

const addPlacedTilesOnBoard = function(tiles) {
  tiles.forEach(id => {
    const tile = document.getElementById(id);
    tile.classList.add('placedTile');
  });
};

const showCorpInfo = function(corpInfo) {
  for (const corp in corpInfo) {
    const corpRow = document.getElementById(corp);
    corpRow.innerHTML = `<td>${corp}</td>
      <td>${corpInfo[corp].stocks}</td>
      <td>${corpInfo[corp].price}</td>
      <td>${corpInfo[corp].area}</td>
      <td>${corpInfo[corp].majority}</td>
      <td>${corpInfo[corp].minority}</td>`;
  }
};

const createTile = function(tile) {
  const text = tileGenerator(tile);
  return `<div class="playersTile" onclick="placeATile(${tile})">${text}</div>`;
};

const createTileSets = function(tiles) {
  return tiles.map(createTile).join('');
};

const showPlayerAssets = function(assets) {
  const playerMoney = document.getElementById('playerMoney');
  playerMoney.innerText = `$${assets.money}`;
  const cluster = document.querySelector('.cluster');
  cluster.innerHTML = createTileSets(assets.tiles);
  for (const corp in assets.stocks) {
    const corpStocks = document.getElementById(`${corp}_stocks`);
    corpStocks.innerText = assets.stocks[corp];
  }
};

const showProfileName = function(name) {
  const playerName = document.getElementById('playerName');
  playerName.innerText = name;
};

const createProfile = function(name, id) {
  return `<div class="profile" id="player${id}" >
    <div >${name}</div>
    <div class='profileImage'></div>
    </div>`;
};

const createPlayersProfile = function(playersNames) {
  return playersNames.map(createProfile).join('');
};

const highlightCurrentPlayer = function(id) {
  const profile = document.getElementById(`player${id}`);
  profile.firstElementChild.classList.add('currentPlayer');
  profile.lastElementChild.className = 'currentProfile';
};

const showAllPlayersProfile = function(playersProfile) {
  const playersBox = document.getElementById('players');
  playersBox.innerHTML = createPlayersProfile(playersProfile.allPlayersName);
  highlightCurrentPlayer(playersProfile.currentPlayer);
};

const showStatus = function(status) {
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

const createActivityRow = function({text, type}) {
  return `<div class="activityDiv">
  <p>
  <img src="../images/activityLogIcons/${type}.png"
   class="ActivityIcon" alt="*"/>
  &nbsp&nbsp${text}</p>
  </div>`;
};

const createActivityLog = function(activities) {
  return activities.map(createActivityRow).join('');
};

const showActivityLog = function(activities) {
  const activityCard = document.getElementById('activityLog');
  activityCard.innerHTML = createActivityLog(activities);
};

const place = function(tiles, corporation) {
  tiles.forEach(tile => {
    const cssClass = `${corporation}_color`;
    document.querySelector(`div[id="${tile}"]`).className = `tile ${cssClass}`;
  });
};

const placeCorps = function(corporations) {
  for (const corp in corporations) {
    place(corporations[corp].tiles, corp);
  }
};

const handleEstablishAction = function({groups, availableCorporations}) {
  const actionTab = document.querySelector('#action-tab');
  showCardBody('actions', actionTab);
  const html = generateEstablishActions(groups, availableCorporations);
  document.querySelector('#actions').innerHTML = html;
  document.querySelector('#action-tab').classList.remove('hideDiv');
};

const handleAction = function({status, action}) {
  updateGamePage(status);
  const actions = {establish: handleEstablishAction};
  if (action.state === 'wait' || action.state === 'placeTile') {
    document.querySelector('#actions').classList.add('hideDiv');
    document.querySelector('#action-tab').classList.add('hideDiv');
    const activity = document.querySelector('#activity-tab');
    return showCardBody('activityLog', activity);
  }
  const handler = actions[action.state];
  handler(action);
};

const updateGamePage = function(data) {
  addPlacedTilesOnBoard(data.placedTiles);
  showCorpInfo(data.corporations);
  placeCorps(data.corporations);
  showPlayerAssets(data.player.assets);
  showProfileName(data.player.name);
  showAllPlayersProfile(data.playersProfile);
  showStatus(data.player.statusMsg);
  showActivityLog(data.activity);
  if (!data.player.turn) {
    startTimeout();
  }
};

const startTimeout = function() {
  const time = 3000;
  return setTimeout(() => sentGetReq('update', handleAction), time);
};

const main = function() {
  createBoard();
  sentGetReq('update', handleAction);
};

window.onload = main;
