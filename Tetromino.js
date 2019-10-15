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
        this.shape = [[1,0],
                      [1,0],
                      [1,0],
                      [1,0]];
        this.color = "cyan";
        this.colorCode = 1;
        this.height = 4;
        break;
      case "o":
      this.shape = [[0,0],
                    [1,1],
                    [1,1],
                    [0,0]];

      this.color = "yellow";
      this.height = 2;
      this.colorCode = 2;
        break;
      case "t":
      this.shape = [[0,0],
                    [0,1],
                    [1,1],
                    [0,1]];
      this.color = "purple";
      this.height = 3;
      this.colorCode = 3;
        break;
      case "j":
      this.shape = [[0,0],
                    [0,1],
                    [0,1],
                    [1,1]];
      this.color = "blue";
      this.height = 3;
      this.colorCode = 4;
        break;
      case "l":
      this.shape = [[0,0],
                    [1,0],
                    [1,0],
                    [1,1]];
      this.color = "orange";
      this.height = 3;
      this.colorCode = 5;
          break;
      case "s":
      this.shape = [[0,1],
                    [1,1],
                    [1,0],
                    [0,0]];
      this.color = "green";
      this.height = 3;
      this.colorCode = 6;
          break;
      case "z":
      this.shape = [[1,0],
                    [1,1],
                    [0,1],
                    [0,0]];
      this.color = "red";
      this.height = 3;
      this.colorCode = 7;
          break;
    }

  }


  rotate(){

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
    //THIS IS WRONG
    if(input.left && this.x != 0){
      if(now-this.start>50){
        this.x-=blockSize.x;

        let reverse = false;
        gridMemory.forEach((grd,i) => {
          grd.forEach((innerGrd, j) => {
            if(this.memory[i][j+1] !== 0 && gridMemory[i][j] !== 0){
              reverse = true;
            }
          });
        });
        if(reverse){
          this.x += blockSize.x;
        }

        this.start = new Date();
      }
    }
    //RIGHT
    //THIS IS WRONG
      if(input.right && this.x != (blockSize.x*grid.x)-blockSize.x*(tetromino.type === "i" ?  1 : 2)){
        if(now-this.start>50){
          this.x+=blockSize.x;
          let reverse = false;
          gridMemory.forEach((grd,i) => {
            grd.forEach((innerGrd, j) => {
              if(this.memory[i][j-1] !== 0 && gridMemory[i][j] !== 0){
                reverse = true;
              }
            });
          });
          if(reverse){
            this.x -= blockSize.x;
          }
          this.start = new Date();
        }
      }
        if(input.up){
          if(now-this.start>500){
            console.log(input);
            this.y-=blockSize.y;
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
  for(let i = 0; i < this.shape.length; i++){
  //Left side
  if(this.shape[i][0]===1){
    this.memory[(this.y/blockSize.y)+i][this.x/blockSize.x] = this.colorCode;
  }
  //Right side
  if(this.shape[i][1]===1){
    this.memory[(this.y/blockSize.y)+i][(this.x/blockSize.x)+1] = this.colorCode;
  }
}
}

  //Merge handles collision detection. Also removes focus if collision on y axis is detected.
  merge(){
    if(!this.focus) return;
    let blockSize = {x:canvas.width/grid.x, y: canvas.height/grid.y};

    //Collision check

    this.shape.forEach((shape,i) => {

      //Doing blank bottom check
      if(this.type === "o" || this.type === "s" || this.type === "z"){
        if (this.y+(blockSize.y*3)>= canvas.height){
            this.focus = false;
          }
      } else if (this.y+(blockSize.y*4)>= canvas.height){
          this.focus = false;
        }

        //Catching all other collision cases.
        if(this.focus){
        let reverse = false;
        gridMemory.forEach((grd,i) => {
          grd.forEach((innerGrd, j) => {
            let c = i;
            if(this.memory[i][j] !== 0 && gridMemory[i][j] !== 0){
              reverse = true;
            }
          });
        });
        if(reverse){
          this.focus = false;
          this.y -= blockSize.y
          console.log("merge")
          this.storePosition();
        }
      }

    //Finally, removing focus and storing memory to grid
    if(!this.focus){
      this.memory.forEach((tetMem, i) => {
        for(let v = 0; v < 10; v++){
          if(this.memory[i][v] !== 0){
            gridMemory[i][v] = this.colorCode;
          }
        }
      });
    }
  });
}

  removeLines(){
    let lines = [];
    let inLine = [];
    //THIS IS WRONG WITH COLORCODES, Need to use .every somehow
    gridMemory.forEach((grd, i) => {
      if(JSON.stringify(gridMemory[i])===JSON.stringify([1,1,1,1,1,1,1,1,1,1,0]) && i <= 19){
        lines.push(i);
      }
    });

    if(lines.length !== 0){
      console.log(lines)

      //After this I have to swap the previous elements to simulate the grid memory "dropping down"
      for(let i = 0; i < lines.length; i++){
        gridMemory[lines[i]] =[0,0,0,0,0,0,0,0,0,0,0];
      }
      this.swapGridElements(gridMemory,lines[lines.length-1],lines.length);

      //Remove lines from shape and store
      let toRemove = lines.length;
      this.shape.forEach((temShape,i) => {
        if(this.shape[i].includes(1)){
          this.shape[i] = [0,0];
          this.storePosition();
        }
      });

      //Moves and stores new points
      this.y += blockSize.y*2;
      this.storePosition();
    }

  }

  draw(){
    //TODO Change this so I get the right colors
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "white";

    //Drawing tetromino
    let blockSize = {x:canvas.width/grid.x, y: canvas.height/grid.y}
    for(let i = 0; i < 4; i++){

      if(this.shape[i][0]!==0){
        ctx.fillRect(this.x,this.y+(i*blockSize.y),blockSize.x,blockSize.y);
        ctx.strokeRect(this.x,this.y+(i*blockSize.y),blockSize.x,blockSize.y);

      }
       if(this.shape[i][1]!==0){
        ctx.fillRect(this.x+blockSize.x,this.y+(i*blockSize.y),blockSize.x,blockSize.y);
        ctx.strokeRect(this.x+blockSize.x,this.y+(i*blockSize.y),blockSize.x,blockSize.y);

      }


    }
  }

  randomType(){
   let result = '';
   let characters = 'iotjlsz';
  //characters = "o";
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
