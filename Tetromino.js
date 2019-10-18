class Tetromino{

  constructor(){
    this.type = "s";
    this.color = "red";
    this.colorCode = 0;
    this.descend = 1;
    this.size = 10;
    this.focus = true;
    this.x = 4*blockSize.x;
    this.y = 0;
    this.start = new Date();
    this.gravityTimer = new Date();
    this.memory = [[]];
    this.rotation = 0;

    this.randomType();

    for(let i = 0; i < grid.y; i++){
      this.memory[i] =[0,0,0,0,0,0,0,0,0,0,0];
    }


    switch(this.type){
      case "i":
      this.restoreShape();
      this.color = "cyan";
      this.colorCode = 1;
      this.height = 4;
      break;
      case "o":
      this.restoreShape();
      this.color = "yellow";
      this.height = 2;
      this.colorCode = 2;
      break;
      case "t":
      this.restoreShape();
      this.color = "purple";
      this.height = 3;
      this.colorCode = 3;
      break;
      case "j":
      this.restoreShape();
      this.color = "blue";
      this.height = 3;
      this.colorCode = 4;
      break;
      case "l":
      this.restoreShape();
      this.color = "orange";
      this.height = 3;
      this.colorCode = 5;
      break;
      case "s":
      this.restoreShape();
      this.color = "green";
      this.height = 3;
      this.colorCode = 6;
      break;
      case "z":
      this.restoreShape();
      this.color = "red";
      this.height = 3;
      this.colorCode = 7;
      break;
    }

  }

  restoreShape(){
    switch(this.type){
      case "i":
      this.shape = [
      [1,0],
      [1,0],
      [1,0],
      [1,0]];
      break;
      case "o":
      this.shape = [
      [0,0],
      [1,1],
      [1,1],
      [0,0]];
      break;
      case "t":
      this.shape = [
      [0,0],
      [0,1],
      [1,1],
      [0,1]];
      break;
      case "j":
      this.shape = [
      [0,0],
      [0,1],
      [0,1],
      [1,1]];
      break;
      case "l":
      this.shape = [
      [0,0],
      [1,0],
      [1,0],
      [1,1]];
      break;
      case "s":
      this.shape = [
      [0,1],
      [1,1],
      [1,0],
      [0,0]];
      break;
      case "z":
      this.shape = [
      [1,0],
      [1,1],
      [0,1],
      [0,0]];
      break;
    }
  }

  rotatedShape(){
    switch(this.type){
      case "i":
      this.shape = [
      [1,1,1,1],
      [0,0,0,0]];
      break;
      case "o":
      this.shape = [
      [0,0],
      [1,1],
      [1,1],
      [0,0]];
      break;
      case "t":
      this.shape = [
      [0,1,0,0],
      [1,1,1,0]];
      break;
      case "j":
      this.shape = [
      [1,0,0,0],
      [1,1,1,0]];
      break;
      case "l":
      this.shape = [
      [1,1,1,0],
      [1,0,0,0]];
      break;
      case "s":
      this.shape = [
      [1,1,0,0],
      [0,1,1,0]];
      break;
      case "z":
      this.shape = [
      [0,1,1,0],
      [1,1,0,0]];
      break;
    }
  }


  rotate(){
    if (this.type === "o") return;
    this.rotation += 90;
    if(this.rotation == 360){
      this.rotation = 0;
    }
    switch (this.rotation) {
      case 0:
      this.restoreShape();
      break;
      case 90:
      this.rotatedShape();
      break;
      case 180:
      this.restoreShape();
      this.shape.forEach((shape,i) => {
        swapArrayValues(this.shape[i],0,1)
      });
      break;
      case 270:
      this.rotatedShape();
      this.shape.forEach((shape,i) => {
        swapArrayValues(this.shape,this.shape[0][i],this.shape[1][i])
      });
      break;

    }

  }

  update(){
    if(!this.focus) return;
    let now = new Date();
    let blockSize = {x:canvas.width/grid.x, y: canvas.height/grid.y}

    //Gravity thingy
    if(input.space){
      if(now-this.gravityTimer>10){
        this.y+=blockSize.y;
        this.gravityTimer = new Date();
      }
    }
    if(input.down){
      if(now-this.gravityTimer>50){
        this.y+=blockSize.y;
        this.gravityTimer = new Date();
      }
    }else if(!input.space && !input.down){
      if(now-this.gravityTimer>500){
        this.y+=blockSize.y;
        this.gravityTimer = new Date();
      }
    }
    //Gravity end

    //Move tetromino along x axis
    //LEFT
    if(input.left && this.x != 0){
      if(now-this.start>50){
        this.x-=blockSize.x;
        this.storePosition();
        let reverse = false;
        gridMemory.forEach((grd,i) => {
          grd.forEach((innerGrd, j) => {
            if(this.memory[i][j] !== 0 && gridMemory[i][j] !== 0){
              reverse = true;
            }
          });
        });
        if(reverse){
          this.x += blockSize.x;
          reverse = false;
        }
        this.start = new Date();
      }
    }
    //RIGHT
    if(input.right && this.x < (blockSize.x*grid.x)-blockSize.x*(tetromino.rotation === (90||270) ?  3 : 2)){
      if(now-this.start>50){
        let reverse = false;
        this.x+=blockSize.x;
        this.storePosition();
        gridMemory.forEach((grd,i) => {
          grd.forEach((innerGrd, j) => {
            if(this.memory[i][j] !== 0 && gridMemory[i][j] !== 0){
              reverse = true;
            }
          });
        });
        if(reverse){
          this.x -= blockSize.x;
          reverse = false;
        }

        this.start = new Date();
      }
    }
    if(input.up){
      if(now-this.start>500){
        this.rotate();
        this.start = new Date();
      }
    }

    this.storePosition();
  }

  storePosition(){
    //Store new position values

    //Clear
    for(let i = 0; i < (grid.y); i++){
      this.memory[i] =[0,0,0,0,0,0,0,0,0,0];
    }
    //Looping through shape
    this.shape.forEach((shape,i) => {
      shape.forEach((innerShape,j) => {
        //Storing complete shape to memory;
        if(this.shape[i][j]===1){
          this.memory[(this.y/blockSize.y)+i][(this.x/blockSize.x)+j] = this.colorCode;
        }
      });
    });
  }

  //Merge handles collision detection. Also removes focus if collision on y axis is detected.
  collisionCheck(){
    if(!this.focus) return;
    let blockSize = {x:canvas.width/grid.x, y: canvas.height/grid.y};
    this.storePosition();
    let reverse = false;

    //Catching all falling collision cases with elevated floor.
    gridMemory.forEach((grd,i) => {
      grd.forEach((innerGrd, j) => {
        if(this.memory[i][j] !== 0 && gridMemory[i][j] !== 0){
          reverse = true;
        }
      });
    });

    if(reverse){
      this.y -= blockSize.y;
      this.merge();
      return;
    }

    //Checking for collision with floor
    gridMemory[gridMemory.length-1].forEach((btmGrid,i) => {
      if(i !== 10){
      if(this.memory[gridMemory.length-1][i] !== 0 && gridMemory[gridMemory.length-1][i] === 0){
        this.merge();
        return;
      }
    }
    });
  }

  //Merge removes focus and stores data to grid.
  merge(){
    if(!this.focus) return;
    this.storePosition();
    this.focus = false;
    if(this.y <= 0){
      gameOver = true;
    }
    this.memory.forEach((tetMem, i) => {
      for(let v = 0; v < grid.x; v++){
        if(this.memory[i][v] !== 0){
          gridMemory[i][v] = this.colorCode;
        }
      }
    });
  }

  removeLines(){
    //Detects full lines, then pushes those lines to an array
    let lines = [];
    gridMemory.forEach((inner,i) => {
      if(inner.every(function(num,index){
        if(index != inner.length-1){
          return num !== 0;
        }
        return true;
      })){
        lines.push(i);
      }
    });
    //Checking if any full lines have been detected
    if(lines.length !== 0){
      console.log(lines);

      //Not sure why but despite using splice, the grid doesn't drop down.
      for(let i = 0; i < lines.length; i++){
        gridMemory.splice(lines[i],1);
        gridMemory.unshift([0,0,0,0,0,0,0,0,0,0,0])
        lines.shift();

      }
    }



  }

  draw(){
    if(!this.focus) return;
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "white";

    //Drawing tetromino
    let blockSize = {x:canvas.width/grid.x, y: canvas.height/grid.y}

    //This solution can draw any shape.
    this.shape.forEach((shape,i) => {
      shape.forEach((innerShape,j) => {
        if(this.shape[i][j]!==0){
          ctx.fillRect(this.x+(blockSize.x*j),this.y+(i*blockSize.y),blockSize.x,blockSize.y);
          ctx.strokeRect(this.x+(blockSize.x*j),this.y+(i*blockSize.y),blockSize.x,blockSize.y);
        }
      });
    });

  }


  randomType(){
    let result = '';
    let characters = 'iotjlsz';
    //characters = "io";
    let charLength = characters.length;
    for ( let i = 0; i < 1; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charLength));
    }
    this.type=result;
  }


}

input = { left:false,
  right:false,
  up:false,
  down:false,
  space:false  };

  window.onkeydown = e => {
    switch(e.keyCode){
      case 32:
      input.space = true;
      break;
      case 37:
      input.left = true;
      break;

      case 38:
      input.up = true;
      break;

      case 39:
      input.right = true;
      break;

      case 40:
      input.down = true;
      break;

    }
  }
  window.onkeyup = e =>{
    switch(e.keyCode){
      case 32:
      input.space = false;
      break;
      case 37:
      input.left = false;
      break;

      case 38:
      input.up = false;
      break;

      case 39:
      input.right = false;
      break;

      case 40:
      input.down = false;
      break;

    }
  }
