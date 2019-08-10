const STEP = 10;
const MSEC_PER_FRAME = 1000 / 24;

let ctx;

// Game state
let running;
let prev;
let snake;
let apple;
let dir;

function reset() {
  const randDir = Math.random() * 4;
  if (randDir < 1) {
    dir = {x: 0, y: 1};
  } else if (randDir < 2) {
    dir = {x: 0, y: -1};
  } else if (randDir < 3) {
    dir = {x: 1, y: 0};
  } else if (randDir < 4) {
    dir = {x: -1, y: 0};
  }

  snake = [randCoord()];
  apple = randCoord();
  prev = undefined;
  running = true;
}

function randCoord() {
  let x = Math.floor(Math.random() * ctx.canvas.width);
  let y = Math.floor(Math.random() * ctx.canvas.height);

  x -= x % STEP;
  y -= y % STEP;

  return { x, y };
}

function draw(timestamp) {
  if (!running) {
    return;
  }

  if (prev && timestamp - prev < MSEC_PER_FRAME) {
    window.requestAnimationFrame(draw);
    return;
  }

  prev = timestamp;

  ctx.fillStyle = '#eee';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  ctx.fillStyle = 'black';
  ctx.textAlign = 'start';
  ctx.font = '16px sans-serif';
  ctx.fillText(`Score: ${snake.length - 1}`, 10, 20);
  
  for (let i = snake.length - 1; i > 0; i--) {
    snake[i] = snake[i - 1];
    ctx.fillRect(snake[i].x, snake[i].y, STEP, STEP);
  }
  
  snake[0] = {
    x: snake[0].x + dir.x * STEP,
    y: snake[0].y + dir.y * STEP
  };
  ctx.fillRect(snake[0].x, snake[0].y, STEP, STEP);

  if (snake[0].x >= ctx.canvas.width || snake[0].x < 0
      || snake[0].y >= ctx.canvas.height || snake[0].y < 0) {
    gameOver();
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x
        && snake[0].y === snake[i].y) {
      console.log(snake[0].x, snake[0].y)
      gameOver();
    }
  }

  if (snake[0].x === apple.x
      && snake[0].y === apple.y) {
    let pos;
    if (snake.length === 1) {
      pos = {
        x: snake[0].x - dir.x * STEP,
        y: snake[0].y - dir.y * STEP
      };
    } else {
      pos = {
        x: 2 * snake[snake.length - 1].x - snake[snake.length - 2].x,
        y: 2 * snake[snake.length - 1].y - snake[snake.length - 2].y
      };
    }
    snake.push(pos);
    ctx.fillRect(pos.x, pos.y, STEP, STEP);
    apple = randCoord();
  }

  ctx.fillStyle = 'red';
  ctx.fillRect(apple.x, apple.y, STEP, STEP);

  window.requestAnimationFrame(draw);
}

function gameOver() {
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Game over!', ctx.canvas.width / 2, ctx.canvas.height / 2);
  ctx.fillText('Press R to restart', ctx.canvas.width / 2, ctx.canvas.height / 2 + 24);
  
  running = false;
}

function startGame() {
  reset();
  window.requestAnimationFrame(draw);
}

window.addEventListener('load', () => {
  ctx = document.getElementById('canvas').getContext('2d');

  startGame();

  window.addEventListener('keydown', ({code}) => {
    switch (code) {
      case 'KeyP':
        if (running) {
          running = false;
        } else {
          running = true;
          window.requestAnimationFrame(draw);
        }
        break;
      case 'KeyR':
        startGame();
        break;
      case 'KeyW':
      case 'ArrowUp':
        if (snake.length === 1 || dir.y !== 1) {
          dir = {x: 0, y: -1};
        }
        break;
      case 'KeyD':
      case 'ArrowRight':
        if (snake.length === 1 || dir.x !== -1) {
          dir = {x: 1, y: 0};
        }
        break;
      case 'KeyS':
      case 'ArrowDown':
        if (snake.length === 1 || dir.y !== -1) {
          dir = {x: 0, y: 1};
        }
        break;
      case 'KeyA':
      case 'ArrowLeft':
        if (snake.length === 1 || dir.x !== 1) {
          dir = {x: -1, y: 0};
        }
        break;
    }
  });
});
