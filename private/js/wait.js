const seconds = 1000;

const generateJoined = function(players) {
  const template = 'joined the game';
  return players.reduce((text, player) => text + `${player} ${template}\n`, '');
};

const displayStatus = function({isJoined, gameId, hosted, joined, remaining}) {
  const template = `hosted the game\n${generateJoined(joined)}`;
  if(isJoined) {
    setTimeout(() => location.replace('play.html'), 2000);
    document.querySelector('#status').innerText = 'Starting the game';
  }
  document.querySelector('#gameId').innerText = gameId;
  document.querySelector('#players').innerText = `${hosted} ${template}`;
  document.querySelector('#remaining').innerText = remaining;
};

const getStatus = function() {
  fetch('wait')
    .then(res => res.json())
    .then(displayStatus);
};

getStatus();
window.onload = () => setInterval(getStatus, seconds);
