const startGame = function({isAnyError, msg}) {
  if (!isAnyError) {
    document.location = 'game/wait';
    return;
  }
  const errorBox = document.querySelector('#error');
  errorBox.innerText = msg;
  errorBox.classList.remove('hide');
};

const joinInGame = function() {
  const name = document.querySelector('#name-textbox').value;
  const gameId = document.querySelector('#id-textbox').value;
  if(!name.trim() || !gameId.trim()) {
    return;
  }
  const body = JSON.stringify({name, gameId});
  const headers = {'Content-Type': 'application/json'};
  fetch('/joinGame', {method: 'POST', headers, body})
    .then(res => res.json())
    .then(data => startGame(data));
};
