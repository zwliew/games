const WINNING_CONDITIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8]
];
const PLAYERS = ['X', 'O'];
const grid = ['', '', '', '', '', '', '', '', ''];
let startingPlayer = PLAYERS[0];
let curPlayer = startingPlayer;
let turnsSoFar = 0;
let gameRunning = true;
let curPlayerText, tileTexts, endingText;

function chooseTile(idx) {
  if (!gameRunning || grid[idx] !== '') {
    return;
  }

  setGridTile(idx, curPlayer);
  turnsSoFar++;

  let won = false;
  for (let cond of WINNING_CONDITIONS) {
    if (grid[cond[0]] !== ''
        && grid[cond[0]] === grid[cond[1]]
        && grid[cond[0]] === grid[cond[2]]) {
      won = true;
      break;
    }
  }
  
  if (won) {
    endGame(`Player ${curPlayer} won!`);
    return;
  }

  if (turnsSoFar === grid.length) {
    endGame("It's a draw!");
    return;
  }

  setCurPlayer(swapPlayer(curPlayer));
}

function restartGame() {
  turnsSoFar = 0;

  startingPlayer = swapPlayer(startingPlayer);
  setCurPlayer(startingPlayer);

  endingText.textContent = '';

  restartButton.style.display = 'none';
  
  for (let i = 0; i < grid.length; i++) {
    setGridTile(i, '');
  }

  gameRunning = true;
}

function endGame(textToDisplay) {
  gameRunning = false;
  endingText.textContent = textToDisplay;
  restartButton.style.display = 'block';
}

function swapPlayer(prevPlayer) {
  return prevPlayer === PLAYERS[0] ? PLAYERS[1] : PLAYERS[0];
}

function setGridTile(idx, val) {
  grid[idx] = tileTexts[idx].textContent = val;
}

function setCurPlayer(newCurPlayer) {
  curPlayer = newCurPlayer;
  curPlayerText.textContent = `Player ${newCurPlayer}'s turn`;
}

window.addEventListener('load', () => {
  tileTexts = document.getElementsByClassName('tile-text');
  curPlayerText = document.getElementById('cur-player-text');
  endingText = document.getElementById('ending-text');
  restartButton = document.getElementById('restart-button');
});
