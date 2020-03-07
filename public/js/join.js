const startGame = function({isAnyError, msg}) {
  if (!isAnyError) {
    document.location = 'wait';
    return;
  }
  document.querySelector('#error').innerText = msg;
};

const joinInGame = function() {
  const name = document.querySelector('#name-textbox').value;
  const gameId = document.querySelector('#id-textbox').value;
  const body = JSON.stringify({name, gameId});
  const headers = {'Content-Type': 'application/json'};
  fetch('/joinGame', {method: 'POST', headers, body})
    .then(res => res.json())
    .then(data => startGame(data));
};
