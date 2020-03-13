const minCharLimit = 3;

const startGame = function({isAnyError, msg}) {
  if (!isAnyError) {
    return location.replace('game/waiting');
  }
  const errorBox = document.querySelector('#error');
  errorBox.innerText = msg;
  errorBox.classList.remove('hide');
};

const joinInGame = function() {
  const name = document.querySelector('#name-textbox').value;
  const gameId = document.querySelector('#id-textbox').value;
  const errorBox = document.querySelector('#error');
  if (name.trim().length < minCharLimit) {
    errorBox.innerText = 'Name must have 3-8 characters';
    errorBox.classList.remove('hide');
    return;
  }
  const body = JSON.stringify({name, gameId});
  const headers = {'Content-Type': 'application/json'};
  fetch('/joinGame', {method: 'POST', headers, body})
    .then(res => res.json())
    .then(data => startGame(data));
};
