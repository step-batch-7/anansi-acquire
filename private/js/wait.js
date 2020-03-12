const updateTime = 2000;

const generateJoined = function(players) {
  const template = 'joined the game';
  return players.reduce((text, player) => text + `${player} ${template}\n`, '');
};

const displayStatus = function({hasJoined, joined, remaining}) {
  const template = generateJoined(joined);
  if (hasJoined) {
    setTimeout(() => location.replace('start'), updateTime);
    document.querySelector('#status').innerText = 'Starting the game';
  }
  document.querySelector('#players').innerText = `\n${template}`;
  document.querySelector('#remaining').innerText = remaining;
};

const fetchData = function(url, callback) {
  fetch(url)
    .then(res => res.json())
    .then(callback);
};

fetchData('wait', displayStatus);
window.onload = () => setInterval(fetchData, updateTime, 'wait', displayStatus);
