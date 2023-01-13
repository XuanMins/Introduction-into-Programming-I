/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/


*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var isFound;

var trees_x;
var collectables;
var clouds;
var mountains;

var game_score;
var flagpole;
var lives;
var customFont;


var jumpSound;
var backgroundSound; 
var fallingSound;

var platforms;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    customFont = loadFont("zerovelo.ttf")
    
    backgroundSound =loadSound('assets/background.mp3')
    backgroundSound.setVolume(0.01);
    
//    fallingSound = loadSound('assets/fall.wav');
//    fallingSound.setVolume(0.01);
}


function setup()
{
	createCanvas(1024, 576);
    
    floorPos_y = height * 3/4;
    gameChar_x = width/2;
    gameChar_y = floorPos_y;
    lives = 3;
    startGame();
    
    angleMode(DEGREES);

}


function draw()
{
	background(159,129,205); // fill the sky blue

	noStroke();
	fill(182,216,242);
	rect(0, floorPos_y, width, height/4); // draw some green ground

    push();
    translate(scrollPos, 0);
	// Draw clouds.
    drawClouds();

	// Draw mountains.
    drawMountains();

	// Draw trees.
    drawTrees();
    
	// Draw canyons.
    for (var i = 0; i < canyons.length ; i++)
            {
                drawCanyon(canyons[i]);
                checkCanyon(canyons[i]);
            }
    
    //Draw Platforms
    for(var i = 0; i < platforms.length; i++)
        {
            platforms[i].draw();
        }
        
	// Draw collectable items.
    for (var i = 0; i < collectables.length; i++)
    {
        if(collectables[i].isFound == false)
        {
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        }
    }
    
    // Draw Flagpole
    renderFlagpole();
    
    //Backgroundmusic
    backgroundSound.play();
    
    pop();
    
    //CheckPlayerdie
    checkPlayerDie();

	// Draw game character.
	
	drawGameChar();
    
    fill(0);
    noStroke();
    textSize(20);
    text("Score: " + game_score, 20, 20);
    
    push();
    fill(255,0,0);
    noStroke();
    textSize(20);
    text("Lives: " + lives, 20, 50);
    pop();
    
push();
   if(lives < 1)
       {   
           textFont(customFont,35);
           fill(220,20,60)
           stroke(0);
           strokeWeight(3);
           text("DEFEATED :" , width/2 - 10, height/2 - 100)
           textFont(customFont,30);
           text("Press SPACE to play again", width/2 - 93, height/2 - 70)
           backgroundSound.stop();
       }
   
pop();

push();
    if(flagpole.isReached == true)
        {   
            textFont(customFont, 35);
            fill(255,215,0);
            stroke(0);
            strokeWeight(3);
            text("YOU WON",width/2 - 11,height/2 - 100)
            textFont(customFont,30);
            text("Press SPACE to play again", width/2- 100, height/2 - 65)
            backgroundSound.stop();
        }

pop();

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    
        if(gameChar_y < 340)
          {
              var isContact = false;
              for (var i = 0; i < platforms.length; i++)
                  {
                      if(platforms[i].checkContact(gameChar_world_x,gameChar_y) == true)
                      {
                          isContact  = true;
                          break;
                      }
                  }
              if(isContact == false)
                  {
                    gameChar_y += 2;
                    isFalling = true;
                  }
                  
             
          }

         if(isFalling == true)
         {
             gameChar_y = gameChar_y + 2;
         }

        if(gameChar_y == floorPos_y)
        {
                isFalling = false;
        }
         //falling into canyon 
         if(isPlummeting == true )
        {
            gameChar_y = gameChar_y + 2;
//            fallingSound.play(); 
            backgroundSound.stop();
        }

    if(flagpole.isReached == false)
        {
            checkFlagpole();
        }

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}

    // ---------------------
// Key control functions
// ---------------------

function keyPressed(){

	console.log("press" + keyCode);
	console.log("press" + key);
   
    if(keyCode == 37)
        {
            console.log("left arrow");
            isLeft = true;
        }
    else if(keyCode == 39)
        {
            console.log("right arrow");
            isRight = true;
        }
    if(keyCode == 32 && gameChar_y >= floorPos_y)
        {
            console.log("space-bar")
            gameChar_y = gameChar_y - 100
            jumpSound.play();
        }

}

function keyReleased()
{

	console.log("release" + keyCode);
	console.log("release" + key);

    if(keyCode == 37)
            {
                console.log("left arrow");
                isLeft = false;
            }
        else if(keyCode == 39)
            {
                console.log("right arrow");
                isRight = false;
            }
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
    //the game character
	if(isLeft && isFalling)
	{
		// add your jumping-left code
       
    //Head
    fill(255, 240, 245);
    noStroke();
    ellipse(gameChar_x, gameChar_y -29 , 25, 27);
    
    //Ears
        //Right
        push();
        fill(255, 240, 245);
        translate(gameChar_x,gameChar_y);
        rotate(2);
        ellipse(0, -52, 7, 25);
        pop();

        //Left    
        push();
        fill(255, 240, 245);
        translate(gameChar_x,gameChar_y);
        rotate(-2);
        ellipse(0, -52, 7, 25);
        pop();

    
    //Eyes
    fill(0);
    ellipse(gameChar_x - 7 , gameChar_y - 29, 4, 4);
    
    //Nose
    push();
    fill(0);
    translate(gameChar_x - 10.5 ,gameChar_y - 22);
    rotate(-25);
    ellipse(0, 0, 1.5, 2);
    pop();
    
    //Right Leg(Back)
    push();
    translate(gameChar_x,gameChar_y);
    fill(255, 240, 245);
    rotate(-6);
    ellipse(-6 , 0, 7, 5);
    pop();

    //Body
        //Outer Ellipse
            fill(255, 240, 245);
            ellipse(gameChar_x, gameChar_y - 8, 18, 20);
        //Inner Ellipse
            fill(255, 205, 210);
            ellipse(gameChar_x - 3, gameChar_y - 8, 12, 15.5);

    //Left Leg(Infront)
    push();
    translate(gameChar_x,gameChar_y);
    fill(255, 240, 245);
    rotate(6);
    ellipse(6 , 0, 7, 5);
    pop();
   
   //Hands(Infront (Left)
    fill(255, 240, 245);
    push();
    translate(gameChar_x - 0.5 , gameChar_y - 11);
    rotate(-65);
    ellipse(0, 0, 5, 10);
    pop();
   
    //Tail
    push();
    translate(gameChar_x, gameChar_y);
    rotate(10)
    ellipse(+6, -5.5, 3, 4);
    pop();
  
        
	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
          
    //Head
    fill(255, 240, 245);
    noStroke();
    ellipse(gameChar_x, gameChar_y -29 , 25, 27);
    
    //Ears
        //Right
            push();
            fill(255, 240, 245);
            translate(gameChar_x,gameChar_y);
            rotate(2);
            ellipse(0, -52, 7, 25);
            pop();

        //Left    
            push();
            fill(255, 240, 245);
            translate(gameChar_x,gameChar_y);
            rotate(-2);
            ellipse(0, -52, 7, 25);
            pop();

    
    //Eyes
    fill(0);
    ellipse(gameChar_x + 7 , gameChar_y - 29, 4, 4);
    
    //Nose
    push();
    fill(0);
    translate(gameChar_x + 10.5 ,gameChar_y - 22);
    rotate(30);
    ellipse(0, 0, 1.5, 2);
    pop();
    
    //Left Leg(Back)
    push();
    translate(gameChar_x,gameChar_y);
    fill(255, 240, 245);
    rotate(6);
    ellipse(6 , 0, 7, 5);
    pop();
    
    //Body
        //Outer Ellipse
            fill(255, 240, 245);
            ellipse(gameChar_x, gameChar_y - 8, 18, 20);
        //Inner Ellipse
            fill(255, 205, 210);
            ellipse(gameChar_x + 3, gameChar_y - 8, 12, 15.5);

    //Right Leg(Infront)
    push();
    translate(gameChar_x,gameChar_y);
    fill(255, 240, 245);
    rotate(-6);
    ellipse(-6 , 0, 7, 5);
    pop();
   
    //Hands(Infront (Right))
    fill(255, 240, 245);
    push();
    translate(gameChar_x + 0.5 , gameChar_y - 11);
    rotate(65);
    ellipse(0, 0, 5, 10);
    pop();

    //Tail
    push();
    translate(gameChar_x, gameChar_y);
    rotate(-10)
    ellipse(-6, -5.5, 3, 4);
    pop();

        
	}
	else if(isLeft)
	{
		// add your walking left code
    //Head
    fill(255, 240, 245);
    noStroke();
    ellipse(gameChar_x, gameChar_y -31 , 25, 27);
    
    //Ears
        //Right
        push();
        fill(255, 240, 245);
        translate(gameChar_x,gameChar_y);
        rotate(2);
        ellipse(0, -54, 7, 25);
        pop();

        //Left    
        push();
        fill(255, 240, 245);
        translate(gameChar_x,gameChar_y);
        rotate(-2);
        ellipse(0, -54, 7, 25);
        pop();

    
    //Eyes
    fill(0);
    ellipse(gameChar_x - 7 , gameChar_y - 31, 4, 4);
    
    //Nose
    push();
    fill(0);
    translate(gameChar_x - 10.5 ,gameChar_y - 24);
    rotate(-30);
    ellipse(0, 0, 1.5, 2);
    pop();
    
    //Right Leg(Back)
    fill(255, 240, 245);
    ellipse(gameChar_x - 4 ,gameChar_y, 5, 7);

    //Body
        //Outer Ellipse
            fill(255, 240, 245);
            ellipse(gameChar_x, gameChar_y - 10, 18, 20);
        //Inner Ellipse
            fill(255, 205, 210);
            ellipse(gameChar_x - 3, gameChar_y - 10, 12, 15.5);

    //Left Leg(Infront)
    fill(255, 240, 245);
    ellipse(gameChar_x + 4 , gameChar_y, 5, 7);
    
    //Hands(Infront Left)
    fill(255, 240, 245);
    push();
    translate(gameChar_x + 2 , gameChar_y - 10);
    rotate(-135);
    ellipse(0, 0, 5, 10);
    pop();
    
    //Tail
    push();
    translate(gameChar_x, gameChar_y);
    rotate(10)
    ellipse(+6, -7.5, 3, 4);
    pop();           
        
	}
	else if(isRight)
	{
		// add your walking right code
    //Head
    fill(255, 240, 245);
    noStroke();
    ellipse(gameChar_x, gameChar_y -31 , 25, 27);
    
    //Ears
        //Right
        push();
        fill(255, 240, 245);
        translate(gameChar_x,gameChar_y);
        rotate(2);
        ellipse(0, -54, 7, 25);
        pop();

        //Left    
        push();
        fill(255, 240, 245);
        translate(gameChar_x,gameChar_y);
        rotate(-2);
        ellipse(0, -54, 7, 25);
        pop();

    
    //Eyes
    fill(0);
    ellipse(gameChar_x + 7 , gameChar_y - 31, 4, 4);
    
    //Nose
    push();
    fill(0);
    translate(gameChar_x + 10.5 ,gameChar_y - 24);
    rotate(30);
    ellipse(0, 0, 1.5, 2);
    pop();
    
    //Left Leg(Back)
    fill(255, 240, 245);
    ellipse(gameChar_x + 4 , gameChar_y, 5, 7);
   
    //Body
        //Outer Ellipse
            fill(255, 240, 245);
            ellipse(gameChar_x, gameChar_y - 10, 18, 20);
        //Inner Ellipse
            fill(255, 205, 210);
            ellipse(gameChar_x + 3, gameChar_y - 10, 12, 15.5);

    //Right Leg(Infront)
    fill(255, 240, 245);
    ellipse(gameChar_x - 4 ,gameChar_y, 5, 7);
    
    //Hands(Infront (Right))
    fill(255, 240, 245);
    push();
    translate(gameChar_x - 2 , gameChar_y - 10);
    rotate(135);
    ellipse(0, 0, 5, 10);
    pop();
    
    
    //Tail
    push();
    translate(gameChar_x, gameChar_y);
    rotate(-10)
    ellipse(-6, -7.5, 3, 4);
    pop();
 
        
	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
            
    //Head
    fill(255, 240, 245);
    noStroke();
    ellipse(gameChar_x, gameChar_y -29 , 32, 27);
    
    //Ears
    fill(255, 240, 245);
    noStroke();
      //Left
            push();
            translate(gameChar_x,gameChar_y);
            rotate(15);
            ellipse(-2.5, -52, 7, 25);
            pop();
    
      //Right
            push();
            translate(gameChar_x,gameChar_y);
            rotate(-15);
            ellipse(2.5, -52, 7, 25);
            pop();
    
    //Eyes
    fill(0);
        //Right
            ellipse(gameChar_x - 7 , gameChar_y - 29, 4, 4);
        //Left
            ellipse(gameChar_x + 7 , gameChar_y - 29, 4, 4);
    
    //Nose
    fill(0);
    ellipse(gameChar_x, gameChar_y - 24, 3, 2);
    

    //Body
        //Outer Ellipse
            fill(255, 240, 245);
            ellipse(gameChar_x, gameChar_y - 8, 18, 20);
        // inner Ellipse
            fill(255, 205, 210);
            ellipse(gameChar_x, gameChar_y - 7, 14, 15.5);
    
    //Hands
    fill(255, 240, 245);
        //Right
            push();
            translate(gameChar_x - 10.5 , gameChar_y - 13);
            rotate(120);
            ellipse(0, 0, 5, 10);
            pop();
    
        //Left
            push();
            translate(gameChar_x + 10.5 , gameChar_y - 13);
            rotate(-120)
            ellipse(0 , 0, 5, 10);
            pop();
    
    //Legs
    fill(255, 240, 245);
        //Right
            ellipse(gameChar_x - 6 , gameChar_y, 7, 5);
        //Lef5
            ellipse(gameChar_x + 5 , gameChar_y, 7, 5);
	}
	else
	{
		// add your standing front facing code
            
    //Head
    noStroke();
    fill(255, 240, 245);
    ellipse(gameChar_x, gameChar_y -31 , 32, 27);
    
    //Ears
      //Left
        push();
        translate(gameChar_x,gameChar_y);
        rotate(15);
        ellipse(-2.5, -54, 7, 25);
        pop();
    
      //Right
        push();
        translate(gameChar_x,gameChar_y);
        rotate(-15);
        ellipse(2.5, -54, 7, 25);
        pop();
       
    //Eyes
    fill(0);
        //Right
            ellipse(gameChar_x - 7 , gameChar_y - 31, 4, 4);
        //Left
            ellipse(gameChar_x + 7 , gameChar_y - 31, 4, 4);

    //Nose
    fill(0);
    ellipse(gameChar_x, gameChar_y - 24, 3, 2);

    //Legs
        fill(255, 240, 245);
        //Right
            ellipse(gameChar_x - 5, gameChar_y, 5, 7);
        //Left
            ellipse(gameChar_x + 5, gameChar_y, 5, 7);
 
    //Body
        //Outer Ellipse
            ellipse(gameChar_x, gameChar_y - 10, 18, 20);
        //Inner Ellipse
            fill(255, 205, 210);
            ellipse(gameChar_x, gameChar_y - 9, 14, 15.5);

    //Hands
    fill(255, 240, 245);
        //Right
            push();
            translate(gameChar_x - 4 , gameChar_y - 10);
            rotate(135);
            ellipse(0, 0, 5, 10);
            pop();
    
        //Left
            push();
            translate(gameChar_x + 4 , gameChar_y - 10);
            rotate(-135)
            ellipse(0 , 0, 5, 10);
            pop();
	}
}

// ---------------------------
// Background render functions
// ---------------------------
    
// Function to draw cloud objects.
function drawClouds()
{
    for(var i = 0; i < clouds.length; i++)
        {
            fill(255, 160, 224)
            ellipse(clouds[i].x_pos - 60, clouds[i].y_pos, clouds[i].width + 65, clouds[i].height + 45);
            ellipse(clouds[i].x_pos - 100, clouds[i].y_pos, clouds[i].width + 25, clouds[i].height + 25);
            ellipse(clouds[i].x_pos - 20, clouds[i].y_pos, clouds[i].width + 25, clouds[i].height + 25);
            ellipse(clouds[i].x_pos - 120, clouds[i].y_pos, clouds[i].width, clouds[i].height);
            ellipse(clouds[i].x_pos, clouds[i].y_pos, clouds[i].width, clouds[i].height);
    }
}

// Function to draw mountains objects.
function drawMountains()
{
    for(var i = 0; i < mountains.length; i++)
        {
            fill(88,72,99);
            triangle(mountains[i].x_pos + 60, 220, mountains[i].x_pos - 40, mountains[i].y_pos, mountains[i].x_pos + 190, mountains[i].y_pos);
            fill(119,104,163);
            triangle(mountains[i].x_pos, 256, mountains[i].x_pos - 100, mountains[i].y_pos, mountains[i].x_pos + 100, mountains[i].y_pos);
        }
}

// Function to draw trees objects.
function drawTrees()
{
    for(var i = 0; i < tree_x.length; i++)
        {
            fill(160,120,90);
            triangle(tree_x[i], floorPos_y - 150 , tree_x[i] - 25, floorPos_y, tree_x[i] + 25, floorPos_y);
            
            fill(227, 11, 92);
            ellipse(tree_x[i], floorPos_y - 150, 150, 150);
            ellipse(tree_x[i] - 50, floorPos_y - 150 , 70, 70);
            ellipse(tree_x[i] + 50, floorPos_y - 150, 70, 70);
            ellipse(tree_x[i] - 35, floorPos_y - 115, 70,70);
            ellipse(tree_x[i] + 35, floorPos_y - 115, 70, 70);
            ellipse(tree_x[i] - 35, floorPos_y - 185, 70, 70);
            ellipse(tree_x[i] + 35, floorPos_y - 185, 70, 70);
            ellipse(tree_x[i], floorPos_y - 200, 70, 70);       
        }
}

    
    // ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    noStroke();
    fill(159,129,205);
    rect(t_canyon.x_pos + 115, 470, t_canyon.width - 65, 106);
    beginShape();
    vertex(t_canyon.x_pos + 50, 432);
    vertex(t_canyon.x_pos + 115, 470);
    vertex(t_canyon.x_pos + 150, 470);
    vertex(t_canyon.x_pos + 150, 432);
    vertex(t_canyon.x_pos + 50, 432);
    endShape();
    
    noStroke();
	fill(182,216,242);
    triangle(t_canyon.x_pos + 115, 554, t_canyon.x_pos + 115, 576, t_canyon.x_pos + 130, 576);
    
    //Cracks
    noStroke();
    fill(92,120,141);
    triangle(t_canyon.x_pos + 115,470,t_canyon.x_pos + 115,554,t_canyon.x_pos + 80,500);
    beginShape();
    vertex(t_canyon.x_pos + 150,576);
    vertex(t_canyon.x_pos + 250,576);
    vertex(t_canyon.x_pos + 190,550);
    vertex(t_canyon.x_pos + 215,490);
    vertex(t_canyon.x_pos + 150,432);
    vertex(t_canyon.x_pos + 150,576);
    endShape();

}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if(gameChar_world_x >= t_canyon.x_pos + 50  && 
       gameChar_world_x <= t_canyon.x_pos + 50 + t_canyon.width && 
       gameChar_y == floorPos_y)

        {
            isPlummeting = true;
        }
}

    function checkPlayerDie()
{
    if(gameChar_y > 576)
       if(lives > 0)
        {
            startGame()
            lives = lives - 1
        }
            
        for(var i = 0; i < lives ; i++)
        {  

          fill(255,0,0);
          ellipse(47*i+885,43,10,10)
            
      }
    
    if(lives <= 0 ||flagpole.isReached == true)
        {
            isLeft = false;
            isRight = false;
            isFalling = false;
            isPlummeting = false;
            
        }
 
    
    
}
    
function startGame()
{   
//    fallingSound.stop();
    
    //spawn char
        gameChar_x = width/2;
        gameChar_y = floorPos_y;
        isPlummeting= false;
    
    // Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    
    tree_x = [-800, -500, -250, 100, 300, 500, 1000, 1300, 1500];
    
    clouds = [
        {x_pos : -800, y_pos : 50, width : 35, height : 35},
        {x_pos : -550, y_pos : 100, width : 35, height : 35},
        {x_pos : -300, y_pos : 150, width : 35, height : 35},
        {x_pos : 100, y_pos : 50, width : 35, height : 35},
        {x_pos : 300, y_pos : 100, width : 35, height : 35},
        {x_pos : 800, y_pos : 150, width : 35, height : 35},{x_pos : 1000, y_pos : 50, width : 35, height : 35},
        {x_pos : 1300, y_pos : 100, width : 35, height : 35},
        {x_pos : 1500, y_pos : 150, width : 35, height : 35}
            ];
    
    mountains = [
        {x_pos : -1000, y_pos : floorPos_y},
        {x_pos : -300, y_pos : floorPos_y},
        {x_pos : 250, y_pos : floorPos_y},
        {x_pos : 900, y_pos : floorPos_y},
        {x_pos : 1200, y_pos : floorPos_y},
        {x_pos : 1700, y_pos : floorPos_y}
            ];
    
    collectables = [
        {x_pos : 100,y_pos : 100,size : 50, isFound : false},
        {x_pos : -400,y_pos : 100,size : 50, isFound : false},
        {x_pos : -200,y_pos : 100,size : 50, isFound : false},
        {x_pos : -1050,y_pos : 0,size : 50, isFound : false}
            ];
    
    canyons = [
        {x_pos : -800, width : 100},
        {x_pos : 500, width : 100},
        {x_pos : 1400, width : 100}
    ];
    
    platforms = [];
    platforms.push(createPlatforms(-800,floorPos_y-100,100));
    platforms.push(createPlatforms(500,floorPos_y-100,100));
    platforms.push(createPlatforms(1400,floorPos_y-100,100));
    
    game_score = 0;
    
    flagpole = {isReached : false, x_pos : 1700};
    
    
}
    
function renderFlagpole()
{
    push();
    strokeWeight(5);
    stroke(255, 0, 0);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
    fill(255);
    noStroke();
    ellipse(flagpole.x_pos + 0.5, floorPos_y -250, 5, 4);
    
    fill(255, 0, 255);
    noStroke();
    
    if(flagpole.isReached)
    {
        rect(flagpole.x_pos + 3 , floorPos_y - 250, 50, 50 )
    }
    else
    {
        rect(flagpole.x_pos + 3 , floorPos_y - 50, 50, 50 )
    }
    pop();
}

function checkFlagpole()
{
    var d = abs(gameChar_world_x - flagpole.x_pos);
    if(d < 15)
        {
            flagpole.isReached = true;
        }
}

function createPlatforms(x,y,length)
{
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function(){
            fill(255, 160, 224);
            rect(this.x, this.y ,this.length, 20);
    },
        checkContact: function(gc_x,gc_y)
        {
            if(gc_x > this.x && gc_x < this.x + this.length)
                {
                    var d = this.y - gc_y;
                    if(d >= 0 && d <5)
                        {
                            return true;
                        }
                }
            return false;
        }
    }
    
    return p;
}
    
// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
            fill(255,215,0);
            ellipse(t_collectable.x_pos + 300, t_collectable.y_pos + 310, t_collectable.size, t_collectable.size);
            fill(255,230,0);
            ellipse(t_collectable.x_pos + 300, t_collectable.y_pos + 310, t_collectable.size - 10, t_collectable.size - 10);
            noStroke();
            fill(0,0,0);
            text("$", t_collectable.x_pos + 297, t_collectable.y_pos + 314);
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 450) 
        {
            t_collectable.isFound = true;
            game_score += 1;
        }
}