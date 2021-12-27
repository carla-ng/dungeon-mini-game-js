
/****
 * 
 * TO DO
 * 
 * - show messages when hero does something
 * - improve code
 * 
 */


/***********************
 *      VARIABLES      *
 ***********************/
// Characters
var hero;
var enemies = [];

// Images
var tile_map;
var enemy_img;
var hero_img;

// Board / map
var canvas;
var ctx;
var FPS = 50;

var tile_width = 50;
var tile_height = 50;

/*
 * 0 - Wall
 * 1 - Stairs (hero needs to reach this with key to win)
 * 2 - Floor
 * 3 - Key (hero needs this when reaching stairs to win)
 */
var board = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,2,2,0,0,0,2,2,2,2,0,0,2,2,0],
  [0,0,2,2,2,2,2,0,0,2,0,0,2,0,0],
  [0,0,2,0,0,0,2,2,0,2,2,2,2,0,0],
  [0,0,2,2,2,0,0,2,0,0,0,2,0,0,0],
  [0,2,2,0,0,0,0,2,0,0,0,2,0,0,0],
  [0,0,2,0,0,0,2,2,2,0,0,2,2,2,0],
  [0,2,2,2,0,0,2,0,0,0,1,0,0,2,0],
  [0,2,2,3,0,0,2,0,0,2,2,2,2,2,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
]

// Enemy
var enemy = function(x,y) {
  this.x = x;
  this.y = y;

  this.direction = Math.floor(Math.random()*4);  // possible value: 0-3

  this.delay = 50;
  this.photogram = 0;

  this.draw = function() {
    ctx.drawImage(enemy_img, 0, 0, 32, 32, this.x*tile_width, this.y*tile_height, tile_width, tile_height);
  }

  this.check_collision = function(x,y) {
    var collision = false;

    if (board[y][x] == 0) {
      collision = true;
    }

    return collision;
  }

  this.move_hero = function() {
    hero.enemies_collision(this.x, this.y);

    if (this.counter < this.delay) {
      this.counter++;
    } else {
      this.counter = 0;

      // Up
      if (this.direction == 0) {
        if (this.check_collision(this.x, this.y - 1) == false) {
          this.y--;
        } else {
          this.direction = Math.floor(Math.random()*4);
        }
      }

      // Down
      if (this.direction == 1) {
        if (this.check_collision(this.x, this.y + 1) == false) {
          this.y++;
        } else {
          this.direction = Math.floor(Math.random()*4);
        }
      }

      // Left
      if (this.direction == 2) {
        if (this.check_collision(this.x - 1, this.y) == false) {
          this.x--;
        } else {
          this.direction = Math.floor(Math.random()*4);
        }
      }

      // Right
      if (this.direction == 3) {
        if (this.check_collision(this.x + 1, this.y) == false) {
          this.x++;
        } else {
          this.direction = Math.floor(Math.random()*4);
        }
      }
    }
  }

}


// Hero
var hero = function() {
  this.x = 1;
  this.y = 1;

  this.draw = function() {
    ctx.drawImage(hero_img, 0, 0, 32, 32, this.x*tile_width, this.y*tile_height, tile_width, tile_height);
  }

  this.enemies_collision = function(x,y) {
    if (this.x == x && this.y == y) {
      this.hero_dies();
    }
  }

  this.margins = function(x,y) {
    var colision = false;
    if (board[y][x] == 0) {
      colision = true;
    }
    return(colision);
  }

  this.up = function() {
    if (this.margins(this.x, this.y-1) == false) {
      this.y--;
      this.objects_functionality();
    }
  }
  this.down = function() {
    if (this.margins(this.x, this.y+1) == false) {
      this.y++;
      this.objects_functionality();
    }
  }
  this.left = function() {
    if (this.margins(this.x-1, this.y) == false) {
      this.x--;
      this.objects_functionality();
    }
  }
  this.right = function() {
    if (this.margins(this.x+1, this.y) == false) {
      this.x++;
      this.objects_functionality();
    }
  }

  this.hero_wins = function() {
    console.log("You've won!!");
    this.x = 1;
    this.y = 1;
    this.key = false;
    board[8][3] = 3;
  }

  this.hero_dies = function() {
    console.log("You've lost");
    this.x = 1;
    this.y = 1;
    this.key = false;
    board[8][3] = 3;
  }

  this.objects_functionality = function() {
    var object = board[this.y][this.x];

    // Get the key
    if (object == 3) {
      this.key = true;
      board[this.y][this.x] = 2;
      console.log("You got the key!!");
    }
    // Open the door (when reaching stairs)
    else if (object == 1) {
      if (this.key) {
        this.hero_wins();
      } else {
        console.log("You need a key to open the door.");
      }
    }
  }
}


/***********************
 *      FUNCTIONS      *
 ***********************/
function draw_board() {
  var img_x, img_y;

  for (y=0; y<10; y++) {
    for (x=0; x<15; x++) {
      var tile = board[y][x];

      // Drawing floor
      floor_x = 2;
      if (tile == 0) {
        floor_x = 4;
      }
      ctx.drawImage(tile_map, floor_x*32, 0*32, 32, 32, tile_width*x, tile_width*y, tile_width, tile_height);

      // Drawing rest of objects on top of floor
      if (tile == 0) {  //wall
        img_x = 0;
        img_y = 5;
      } else if (tile == 2) {  //floor
        continue;
      } else if (tile == 1) {  //door
        img_x = 7;
        img_y = 38;
      } else if (tile == 3) {  //key
        img_x = 7;
        img_y = 131;
      }
      ctx.drawImage(tile_map, img_x*32, img_y*32, 32, 32, tile_width*x, tile_width*y, tile_width, tile_height);
    }
  }
}


// A key is pressed to move hero
function key_pressed(hero, key) {
  // Up
  if (key.keyCode == 38 || key == "key-up") {
    hero.up();
  }
  // Down
  else if (key.keyCode == 40 || key == "key-down") {
    hero.down();
  }
  // Left
  else if (key.keyCode == 37 || key == "key-left") {
    hero.left();
  }
  // Right
  else if (key.keyCode == 39 || key == "key-right") {
    hero.right();
  }
}


// Game is initialized
function initialize() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext('2d');

  tile_map = new Image();
  tile_map.src = 'img/tileset.png';

  // Creation of hero
  hero_img = new Image();
  hero_img.src = 'img/hero02.png';
  hero = new hero();

  // Creation of enemies
  enemy_img = new Image();
  enemy_img.src = 'img/enemy.png';
  enemies.push(new enemy(3,3));
  enemies.push(new enemy(5,7));
  enemies.push(new enemy(7,7));

  // Keyboard listener
  document.addEventListener("keydown", function(key) {
    key_pressed(hero, key);
  });

  document.getElementById("keys").addEventListener("click", function(key) {
    var elem = key.target.id;
    if (elem.length) {
      key_pressed(hero, elem);
    }
  });

  setInterval(function(){
    main();
  },1000/FPS);
}

function clear_canvas() {
  canvas.width = 750;
  canvas.height = 500;
}

function main() {
  clear_canvas();
  draw_board();
  hero.draw();

  for (c = 0; c < enemies.length; c++) {
    enemies[c].move_hero();
    enemies[c].draw();
  }
}
