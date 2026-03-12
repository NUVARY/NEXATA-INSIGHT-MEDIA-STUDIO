const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const box = 20;

let snake, food, dir, score, speed, game;
let isRunning = false;

const startSound = document.getElementById("startSound");
const eatSound = document.getElementById("eatSound");
const loseSound = document.getElementById("loseSound");

let highScore = localStorage.getItem("snakeHigh") || 0;
document.getElementById("highScore").textContent = highScore;

function init() {
  snake = [{ x: 9 * box, y: 10 * box }];
  food = randomFood();
  dir = "RIGHT";
  score = 0;
  speed = 150;
  isRunning = false;
  document.getElementById("score").textContent = score;
  clearInterval(game);
  draw();
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * 19) * box,
    y: Math.floor(Math.random() * 19) * box
  };
}

function startGame() {
  if (isRunning) return;
  startSound.play();
  isRunning = true;
  game = setInterval(draw, speed);
}

function resetGame() {
  clearInterval(game);
  init();
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && dir !== "RIGHT") dir = "LEFT";
  if (e.key === "ArrowUp" && dir !== "DOWN") dir = "UP";
  if (e.key === "ArrowRight" && dir !== "LEFT") dir = "RIGHT";
  if (e.key === "ArrowDown" && dir !== "UP") dir = "DOWN";
});

function setDir(d) {
  if (
    (d === "LEFT" && dir !== "RIGHT") ||
    (d === "RIGHT" && dir !== "LEFT") ||
    (d === "UP" && dir !== "DOWN") ||
    (d === "DOWN" && dir !== "UP")
  ) dir = d;
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  snake.forEach((s,i)=>{
    ctx.fillStyle = i===0 ? "#22c55e" : "#4ade80";
    ctx.fillRect(s.x,s.y,box,box);
  });

  ctx.fillStyle = "#ef4444";
  ctx.fillRect(food.x, food.y, box, box);

  let head = {...snake[0]};
  if (dir==="LEFT") head.x-=box;
  if (dir==="UP") head.y-=box;
  if (dir==="RIGHT") head.x+=box;
  if (dir==="DOWN") head.y+=box;

  if (
    head.x<0||head.y<0||
    head.x>=canvas.width||head.y>=canvas.height||
    snake.some(s=>s.x===head.x&&s.y===head.y)
  ){
    loseSound.play();
    clearInterval(game);
    isRunning=false;
    alert("Game Over");
    return;
  }

  if (head.x===food.x && head.y===food.y){
    eatSound.play();
    score++;
    document.getElementById("score").textContent = score;
    if (score>highScore){
      highScore=score;
      localStorage.setItem("snakeHigh",highScore);
      document.getElementById("highScore").textContent=highScore;
    }
    food=randomFood();
  } else {
    snake.pop();
  }

  snake.unshift(head);
}
init();
