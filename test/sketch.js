let paddle;
let ball;
let blocks = [];

const ROWS = 5;
const COLS = 8;
let score = 0;
let gameState = 'PLAY'; // 'PLAY', 'GAMEOVER', 'WIN'

function setup() {
  let canvas = createCanvas(600, 500);
  canvas.parent('canvas-container');
  initGame();
}

function initGame() {
  score = 0;
  gameState = 'PLAY';
  paddle = new Paddle();
  ball = new Ball();
  blocks = [];

  let blockWidth = (width - 60) / COLS;
  let blockHeight = 22;
  let colors = ['#FF595E', '#FFCA3A', '#8AC926', '#1982C4', '#6A4C93'];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let x = 30 + c * blockWidth;
      let y = 50 + r * (blockHeight + 8);
      blocks.push(new Block(x, y, blockWidth - 6, blockHeight, colors[r % colors.length]));
    }
  }
}

function draw() {
  background(30, 30, 36);

  // 점수 표시
  fill(255);
  noStroke();
  textSize(16);
  textAlign(LEFT, TOP);
  text(`SCORE: ${score}`, 20, 15);

  if (gameState === 'PLAY') {
    paddle.update();
    paddle.show();

    ball.update();
    ball.checkPaddle(paddle);
    ball.show();

    for (let i = blocks.length - 1; i >= 0; i--) {
      blocks[i].show();
      if (ball.hits(blocks[i])) {
        ball.vy *= -1;
        blocks.splice(i, 1);
        score += 10;
      }
    }

    if (blocks.length === 0) {
      gameState = 'WIN';
    }
  } else if (gameState === 'GAMEOVER') {
    drawMessage('GAME OVER', '클릭하여 다시 시작');
  } else if (gameState === 'WIN') {
    drawMessage('YOU WIN!', `최종 점수: ${score} (클릭하여 다시 시작)`);
  }
}

function drawMessage(title, sub) {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(36);
  text(title, width / 2, height / 2 - 20);
  textSize(16);
  fill(200);
  text(sub, width / 2, height / 2 + 25);
}

function mousePressed() {
  if (gameState !== 'PLAY') {
    initGame();
  }
}

// 패들 클래스
class Paddle {
  constructor() {
    this.w = 100;
    this.h = 14;
    this.x = width / 2 - this.w / 2;
    this.y = height - 35;
    this.speed = 8;
  }

  update() {
    // 키보드 조작 지원
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
    } else if (mouseX > 0 && mouseX < width) {
      // 마우스 이동 감지 시 마우스 위치 추적
      if (abs(movedX) > 0) {
        this.x = mouseX - this.w / 2;
      }
    }
    this.x = constrain(this.x, 0, width - this.w);
  }

  show() {
    fill(240);
    noStroke();
    rect(this.x, this.y, this.w, this.h, 7);
  }
}

// 공 클래스
class Ball {
  constructor() {
    this.r = 9;
    this.x = width / 2;
    this.y = height / 2 + 40;
    this.vx = random([-4, 4]);
    this.vy = -4.5;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // 좌우 벽 충돌
    if (this.x < this.r || this.x > width - this.r) {
      this.vx *= -1;
    }
    // 천장 충돌
    if (this.y < this.r) {
      this.vy *= -1;
    }
    // 바닥 추락
    if (this.y > height + this.r) {
      gameState = 'GAMEOVER';
    }
  }

  checkPaddle(p) {
    if (
      this.y + this.r >= p.y &&
      this.y - this.r <= p.y + p.h &&
      this.x >= p.x &&
      this.x <= p.x + p.w &&
      this.vy > 0
    ) {
      this.vy *= -1;
      // 패들 맞은 위치에 따라 X축 반사각 조절
      let diff = this.x - (p.x + p.w / 2);
      this.vx = map(diff, -p.w / 2, p.w / 2, -6, 6);
    }
  }

  hits(block) {
    return (
      this.x + this.r > block.x &&
      this.x - this.r < block.x + block.w &&
      this.y + this.r > block.y &&
      this.y - this.r < block.y + block.h
    );
  }

  show() {
    fill('#00F5D4');
    noStroke();
    circle(this.x, this.y, this.r * 2);
  }
}

// 블록 클래스
class Block {
  constructor(x, y, w, h, color) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
  }

  show() {
    fill(this.color);
    noStroke();
    rect(this.x, this.y, this.w, this.h, 4);
  }
}