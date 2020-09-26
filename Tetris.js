window.onload = startGame;
let canvas, context, blockSize;
let frames = 30;
let grid = {x:10,y:20};
let stored = [];
let gridMemory = [[]];
let lastTetromino = "", loopID = "";
let gameOver = false, firstTime = true;

function startGame(){
  if(firstTime){
    canvas = document.getElementById("tetris");
    ctx = canvas.getContext("2d");
    blockSize = {x:canvas.width/grid.x, y: canvas.height/grid.y}
    firstTime = false;
  }
  tetromino = new Tetromino();
  for(let i = 0; i < grid.y; i++){
    gridMemory[i] = [-1,0,0,0,0,0,0,0,0,0,0,-1];
  }
  loopID = setInterval(game,1000/frames);
}
update = true;

function game(){

  //Drawing background
  ctx.fillStyle = "black"
  ctx.fillRect(0,0,canvas.width,canvas.height);

  //Drawing the grid
  //X plane
  for(let i = 0; i < grid.x; i++){
    ctx.beginPath();
    ctx.moveTo(i*(canvas.width/grid.x),0);
    ctx.strokeStyle = "gray";
    ctx.lineTo(i*(canvas.width/grid.x),canvas.height);
    ctx.stroke();
  }

  //Y plane
  for(let i = 0; i < grid.y; i++){
    ctx.beginPath();
    ctx.moveTo(0,i*(canvas.height/grid.y));
    ctx.strokeStyle = "gray";
    ctx.lineTo(canvas.width,i*(canvas.height/grid.y));
    ctx.stroke();
  }


  //Getting new tetromino if needed
  if(!tetromino.focus){
    lastTetromino = tetromino;
    tetromino = new Tetromino();
  }

  //Checking if game should end
  if(gameOver){
    clearInterval(loopID);
    startGame();
    return;
  }

  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
  gridMemory.forEach((grd,i) => {
    grd.forEach((innerGrd,j) => {
      if(innerGrd != 0 && innerGrd != -1){
        ctx.fillStyle = getColor(innerGrd);
        ctx.fillRect((j-1)*blockSize.x,i*blockSize.y,blockSize.x,blockSize.y);
        ctx.strokeRect((j-1)*blockSize.x,i*blockSize.y,blockSize.x,blockSize.y);
      }
    });
  });

  tetromino.update();
  tetromino.collisionCheck();
  tetromino.removeLines();
  tetromino.draw();

}
