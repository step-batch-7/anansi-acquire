const displayGameId = function({gameId}) {
  document.querySelector('#gameId').innerText = gameId;
};

const getGameId = function() {
  fetch('wait')
    .then(res => res.json())
    .then(displayGameId);
};

window.onload = getGameId;
