const seconds = 1000;
const displayGameId = function({isJoined, gameId}) {
  if(isJoined) {
    window.location = 'play.html';
  }
  document.querySelector('#gameId').innerText = gameId;
};

const getGameId = function() {
  fetch('wait')
    .then(res => res.json())
    .then(displayGameId);
};

getGameId();
window.onload = () => setInterval(getGameId, seconds);
