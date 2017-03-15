/* 
 * Steven Nim
 * December 2015 - January 2016
 * This Javascript program is a game in which you use 
 * the arrow keys to dodge incoming obstacles.
 */

var player; //the player character
var island; //first obstacle the player must dodge, an island
var shark; //second obstacle, a hungry shark
var eagle; //third obstacle, a symbol of american FREEDOM
var powerup; //power-up time!
var faster = false; //this boolean affects the speed of the player
var bg; //the background
var scoreText; //the textbox that displays the user's score
var gameoverText; //holds the gameover text
var gameover = false; //this variable determines when to load the gameover screen
var score = 0; //user's score

function startGame() {
    gameArea.start(); //start up the gamearea
    //THE FOLLOWING CODE SETS CERTAIN COMPONENTS AND OBSTACLES
    player = new component(50, 50, "jetski.gif", 30, 200, "image");
    island = new obstacle(100, 100, "island.png", 900, "image");
    shark = new obstacle(120, 70, "shark.png", 900, "image");
    eagle = new obstacle(120, 75, "freedom.png", 900, "image");
    powerup = new obstacle(40, 40, "sanicshoes.png", 900, "image");
    bg = new component(1000, 450, "ocean.jpg", 0, 0, "background");
    //THE FOLLOWING CODE SETS CERTAIN TEXT DISPLAY COMPONENTS
    scoreText = new component("30px", "Tahoma", "white", 10, 40, "text");
    gameoverText = new component("40px", "Tahoma", "white", 300, 150, "text");
}
//This is where the game area  is drawn, cleared, and stopped.
var gameArea = {
    canvas: document.createElement("canvas"), //create a canvas
    start: function () { //this function is sresponsible for start-up set-up
        this.canvas.width = 900; //set width
        this.canvas.height = 450; //set height
        this.context = this.canvas.getContext("2d"); //2d canvas
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20); //run updateGameArea 20 timea a sec
        window.addEventListener('keydown', function (e) { //keylistener for if a key is pressed
            gameArea.key = e.keyCode; //register the key that the person presses
        });
        window.addEventListener('keyup', function (e) { //keylistener for if a key is not pressed
            gameArea.key = false; //no key is registered
        });
    },
    clear: function () { //this funcion clears the game area for updating
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); //CLEAR BZZZZZZZ   
    },
    stop: function () { //this function performs tasks when the game has been "stopped"
        gameover = true; //setting this variable to true allows for something to happen in the gameArea update function
        gameArea.clear(); //clear the canvas
        //THE FOLLOWING CODE SETS THE COMPONENTS AND VARIABLES TO BE BLANK/DISAPPEAR
        player = new component(50, 50, "blank.png", 30, 200, "image");
        island = new obstacle(100, 100, "blank.png", 900, "image");
        shark = new obstacle(120, 70, "blank.png", 900, "image");
        eagle = new obstacle(120, 75, "blank.png", 900, "image");
        powerup = new obstacle(40, 40, "blank.png", 900, "image");
        bg = new component(900, 450, "gameover.png", 0, 0, "background");
        ctx.drawImage(bg.image,
                bg.x + bg.width, bg.y, bg.width, bg.height); //draw the gameover background
        bg.update(); //update background
    }
};
//Function for drawing  game components. 
//Includes objects that move on one axis (players) and stationary objects (background)
function component(width, height, imgSrc, x, y, type) {
    this.type = type; //this type is the type given
    if ((type === "image") || (type === "background")) { //if this type is an image-based type
        this.image = new Image(); //new image
        this.image.src = imgSrc; //set image to the one from the source, imgSrc
    }
    this.width = width; //set width
    this.height = height; //set height
    this.speedX = 0; //x speed is 0
    this.speedY = 0; //y speed is 0
    this.x = x; //x value is the one given
    this.y = y; //y value is the one given
    this.update = function () { //this function has stuff for continuous updates
        ctx = gameArea.context; //set ctx to be this gamearea's context
        if ((type === "image") || (type === "background")) { //if an image
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height); //draw it
            if (type === "background") { //if its specifically a background
                ctx.drawImage(this.image,
                        this.x + this.width, this.y, this.width, this.height); //draw it in a different way
            }
        } else if (this.type === "text") { //if its a text
            ctx.font = this.width + " " + this.height; //font
            ctx.fillStyle = imgSrc; //get colour for text
            ctx.fillText(this.text, this.x, this.y); //draw text
        } else { //backup for if one of it works
            ctx.fillStyle = imgSrc; //fill with given colour
            ctx.fillRect(this.x, this.y, this.width, this.height); //draw a rectangle
        }
    },
            this.newPos = function () { //this function updates the player's y value
                this.y += this.speedY; //update y value based on speed
            },
            this.clear = function () { //this function is supposed to clear images but is CURRENTLY UNUSED
                this.image = "blank.png"; //its supposed to make the image blank
            };
}
;
//Function for drawing game components. 
//Includes objects that have one of their axis of movement be randomly generated (obstacles, like the shark)
function obstacle(width, height, imgSrc, x, type) {
    this.type = type; //get type of component
    if (type === "image") { //if its an image
        this.image = new Image(); //make new image
        this.image.src = imgSrc; //get source for image
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.x = x;
    this.y = Math.random() * (350 - 0) + 0; //y is randomly generated each time!
    this.update = function () { //this function has stuff for continuous updates
        ctx = gameArea.context; //store context
        if (type === "image") { //if its an image
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height); //draw image
        } else { //BACKUP FOR IF IMAGE DOESN'T WORK
            ctx.fillStyle = imgSrc; //fill with given colour
            ctx.fillRect(this.x, this.y, this.width, this.height); //draw a rectangle
        }
    };
    this.newPos = function () { //this function changes the obstacles' x position over times
        this.x -= this.speedX; //change x based on speed
        if (island.x <= -130) { //if the island goes off the screen
            island = new obstacle(100, 100, "island.png", 900, "image"); //reset its position
        }
        if (shark.x <= -130) {//if the shark goes off the screen
            shark = new obstacle(120, 70, "shark.png", 900, "image");//reset its position
        }
        if (eagle.x <= -130) {//if the eagle goes off the screen
            eagle = new obstacle(120, 75, "freedom.png", 900, "image");//reset its position
        }
        if ((powerup.x <= -130)) {//if the shoes goes off the screen
            powerup = new obstacle(40, 40, "sanicshoes.png", 900, "image");//reset its position
        }
    };
}
//This important function is responsible for doing the continous updates to the canvas.
function updateGameArea() {
    gameArea.clear(); //clear what was previously on the canvas
    player.speedY = 0; //set player's speed to 0
    
    if ((gameArea.key && gameArea.key === 38) //if the up key is pressed
            && (player.y >= 0) && (faster === false)) { //and the player has not collected the shoes
        player.speedY = -5; //their speed moving up will be normal
    } else if ((gameArea.key && gameArea.key === 38) //if the up key is pressed
            && (player.y >= 0) && (faster === true)) { //and the player has collected the shoes
        player.speedY = -8; //they'll go SUPER SONIC FAST
    }
    
    if ((gameArea.key && gameArea.key === 40) //if the user pressed the down key
            && (player.y + 50 <= 450) && (faster === false)) { //and they have not collected the shoes
        player.speedY = 5; //they'll move down at normal speed
    } else if ((gameArea.key && gameArea.key === 40) //if the down key is pressed
            && (player.y + 50 <= 450) && (faster === true)) { //and they have the shoes collected
        player.speedY = 8; //they'll go SUPER SONIC FAST
    }
    
    if (faster === true) { //if the player has collected the shoes
        powerup.speedX = 0; //then the shoes will stop moving across the screen
        powerup = new obstacle(40, 40, "blank.png", 900, "image"); //and disappear forever
    } else { //if the player has not collected the shoes
        powerup.speedX = 10; //then the shoes will move dang fast
    }
    island.speedX = 5; //the island moves the slowest
    shark.speedX = 9.5; //the shark moves at medium speed
    eagle.speedX = 12; //the eagle of freedom charges at the fastest speed
   
    //if the player collides with the island
    if ((player.x < island.x + 90) &&
            (player.x + 40 > island.x) &&
            (player.y < island.y + 90) &&
            (40 + player.y > island.y)) {
        score += 0; //then their score will stop increasing
        gameoverText.text = "YOU'RE FLATTENED!"; //unique game over message
        gameArea.stop(); //stop the game
    }
    //if the player collides with the shark
    if ((player.x < shark.x + 90) &&
            (player.x + 40 > shark.x) &&
            (player.y < shark.y + 60) &&
            (40 + player.y > shark.y)) {
        score += 0;  //then their score will stop increasing
        gameoverText.text = " YOU WERE EATEN!"; //unique game over message
        gameArea.stop(); //stop the game
    }
    //if the player collides with the eagle
    if ((player.x < eagle.x + 50) &&
            (player.x + 50 > eagle.x) &&
            (player.y < eagle.y + 50) &&
            (player.y + 50 > eagle.y)) {
        score += 0;//then their score will stop increasing
        gameoverText.text = "YOU WERE PECKED!";//unique game over message
        gameArea.stop();//stop the game
    }
    //if the player collides with the powerup
    if ((player.x < powerup.x + 40) && //if the player's x collides with the x
            (player.x + 50 > powerup.x) &&
            (player.y < powerup.y + 40) &&
            (player.y + 50 > powerup.y)) {
        faster = true; //set faster to true so that the player's speed will change (earlier in this function)
    }
    bg.newPos(); //update background's position
    bg.update(); //update the background on the canvas
    if (gameover === true) { //if the user has gameovered
        scoreText.text = "YOUR FINAL SCORE IS " + score; //final score
        gameoverText.update(); //print the gameover text (specified in the collision if statements)
        scoreText.update(); //update the text on the score one last time
        for (xPos = 250; xPos <= 700; xPos += 50) { //for about 10 times
            ctx.fillStyle = "white"; //white colour
            ctx.fillRect(xPos, 175, 25, 5); //draw a thin rectangle
            ctx.fill();
        }
        clearInterval(this.interval); //STOP LOADING FRAMES
    } else { //otherwise the game is still running, so we gotta do stuff!
        score += 1; //add onto the user's score as time passes by
        scoreText.text = "SCORE: " + score; //update the score on the text
        scoreText.update();  //update the text on the canvas
        player.newPos();//update player's position
        island.newPos();//update island's position
        shark.newPos();//update shark's position
        eagle.newPos();//update eagle's position
        powerup.newPos();//update powerup's position
        player.update(); //update the player on the canvas
        island.update(); //update the island on the canvas
        shark.update(); //update the shark on the canvas
        eagle.update(); //update the eagle on the canvas
        powerup.update(); //update the powerup on the canvas
    }
}