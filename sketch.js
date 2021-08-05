
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
var playerSprite;
var playerLeftImg;
var playerRightImg;
var playerNormalImg;
var alienImg;
var laserImg;
var gameState = "START";
var buttonSprite;
var startButtonImg;
var startBg;
var playBg;
var endBg;
var border;
var alienArray;
var laserArray;
var Score = 0;
var Health = 10;
var heart1;
var heart2;
var heart3;
var heartCount = 3;
var heartimg;
var gameOverSound;
var loseHealthSound;
var loseLifeSound;
var scoreSound;
var gameOverImg;
var gameOver;
function preload()
{
	playerRightImg = loadAnimation("images/player_right.png");
	playerLeftImg = loadAnimation("images/player_left.png");
	playerNormalImg = loadAnimation("images/player.png");
	alienImg = loadImage("images/alien.png");
	startButtonImg = loadImage("images/start.png");
	startBg = loadImage ("images/startimg.jpg");
	playBg = loadImage("images/playimg.png");
	endBg = loadImage("images/endimg.jpg");
	laserImg = loadImage("images/laser.png");
	heartimg = loadImage("images/heart.png");
	gameOverImg = loadImage("images/gameOver.jpg");	
	scoreSound = loadSound("sounds/score.wav");
	loseLifeSound = loadSound("sounds/loseLife.mp3");
	loseHealthSound = loadSound("sounds/loseHealth.wav");
	gameOverSound = loadSound("sounds/gameOver.wav");
};



function setup() {
	createCanvas(displayWidth, displayHeight - 250);
	//border is a array storing all 4 edges
	border = createEdgeSprites();

	engine = Engine.create();
	world = engine.world;

	//Create the Bodies Here.
	buttonSprite = createSprite(200,400,50,50);
	buttonSprite.addImage (startButtonImg);
	buttonSprite.shapeColor ="red"; 
	Engine.run(engine);
	playerSprite = createSprite(displayWidth/2, displayHeight-300);
	playerSprite.addAnimation("spaceShip", playerNormalImg);
	playerSprite.addAnimation("spaceShipLeft", playerLeftImg);
	playerSprite.addAnimation("spaceShipRight", playerRightImg);
	playerSprite.scale = 4;
	playerSprite.visible = false;
	alienArray = new Group ();  //creating the object for the class group. group is a predefined class
	laserArray  = new Group();
	heart1 = createSprite(1225,50,10,10);
	heart2 = createSprite(1275,50,10,10);
	heart3 = createSprite(1300,50,10,10);
	heart1.addImage(heartimg);
	heart1.scale = 0.1;
	heart2.addImage(heartimg);
	heart2.scale = 0.1;
	heart3.addImage(heartimg);
	heart3.scale = 0.1;
	heart1.shapeColor = "red";
	heart2.shapeColor = "red";
	heart3.shapeColor = "red";
	heart1.visible = false;
	heart2.visible = false;
	heart3.visible = false;
	gameOver = createSprite (displayWidth/2, displayHeight/2);
	gameOver.addImage(gameOverImg);
	gameOver.scale = 2 ;
	gameOver.visible = false;
}


function draw() {
  rectMode(CENTER);
	
  if(gameState === "START"){
	start();
  }

  if(mousePressedOver(buttonSprite)){
	buttonSprite.visible = false;
	
	gameState = "PLAY";
  }

  if(gameState === "PLAY"){
	play();
	createAlien();
	createLaser();
	fill("white");
	textSize(40);
	text("Score: "+Score,1350,50);
	text("Health: "+Health, 20, 50);
	score();
	health();
  }
  if(gameState === "END"){
	background(endBg);
	gameOver.visible = true;
	playerSprite.visible = false;
	alienArray.visible = false;
	alienArray.destroyEach();

  };
  drawSprites();
  
}

function play(){
	background(playBg);
	if(heartCount === 3){
		heart1.visible = true;
		heart2.visible = true;
		heart3.visible = true;
	}else if(heartCount === 2){
		heart2.visible = true;
		heart3.visible = true;
	}else if (heartCount === 1){
		heart3.visible = true;
	}
	


	playerSprite.visible = true;
	if(keyWentDown("RIGHT_ARROW")){
		playerSprite.changeAnimation("spaceShipRight", playerRightImg);
		playerSprite.velocityX = 10;
	}

	if(keyWentUp("RIGHT_ARROW")){
		playerSprite.velocityX = 0;
		playerSprite.changeAnimation("spaceShip", playerNormalImg);
	}

	if(keyWentDown("LEFT_ARROW")){
		playerSprite.changeAnimation("spaceShipLeft", playerLeftImg);
		playerSprite.velocityX = -10;
	}

	if(keyWentUp("LEFT_ARROW")){
		playerSprite.velocityX = 0;
		playerSprite.changeAnimation("spaceShip", playerNormalImg);
	}

	if(playerSprite.isTouching(border[0])||(playerSprite.isTouching(border[1]))){
		playerSprite.bounceOff(border[0]);
		playerSprite.bounceOff(border[1]);
	}
	

	}


function start (){
	//give background
	background(startBg);
	fill("White");
	textSize(40);
	textFont("Verdana");
	text("Alien Shooter",displayWidth/2, 50);

	textSize(20);
	textFont("Arial");
	//story

	text("Instructions\n"+"You have 3 lives\n"+"Fight off the Aliens\n"+"Collect Fuel and Coins to boost health\n"+
	"Use Right/Left arrow keys in order to move the ship\n"+"Click space to Shoot at the Aliens", 100,100);

	text("Click here to Play the Game",100,300);
}


function createAlien(){
	if(frameCount %50 === 0){
		var alienSprite = createSprite (100,-10,50,50);
		alienSprite.addImage(alienImg);
		alienSprite.velocityY = 4+3*Score/100;
		//ground.velocityX = -(6 + 3*count/100); scoring count =count+ Math.round(World.frameRate/30);
		alienSprite.x = random(100,displayWidth-100);
		alienSprite.lifetime = displayHeight+10/4;
		alienSprite.scale = 1.8;
		alienArray.add(alienSprite);
	}
}
  
function createLaser(){
	if(keyWentDown("SPACE")){
		var laser = createSprite(playerSprite.x,playerSprite.y,10,100);
		laser.addImage(laserImg);
		laser.velocityY = -10;
		laser.lifetime = displayHeight/10;
		laser.depth = playerSprite.depth-1;
		laserArray.add(laser);
	}	
}

function score(){
	for(var i = 0; i<alienArray.length; i = i+1){
		if(laserArray.isTouching(alienArray.get(i))){
			Score = Score+1;
			laserArray.destroyEach();
			alienArray.get(i).lifetime = 0;
			alienArray.get(i).remove();
			scoreSound.play();
		}
	}
}

function health(){
	if(Health <= 0 ){
		if(heartCount === 3){
			heart1.visible = false;
			Health = 10;
			heartCount = heartCount-1;
			loseLifeSound.play();
		}else if(heartCount===2){
			heart2.visible = false;
			Health = 10;
			heartCount = heartCount-1;
			loseLifeSound.play();
		}else if(heartCount === 1){
			heart3.visible = false;
			heartCount = heartCount-1;
			loseLifeSound.play();
			gameState = "END";
		}
	}
	for(var i = 0; i<alienArray.length; i = i+1){
		if(alienArray.get(i).y > playerSprite.y+50){
			Health = Health-2;
			alienArray.get(i).remove();
			loseHealthSound.play();
		}
		if(playerSprite.isTouching(alienArray.get(i))){
			Health = Health-5;
			playerSprite.visible = false;
			playerSprite.x = displayWidth/2;
			playerSprite.visible = true;
			loseHealthSound.play();
			alienArray.get(i).lifetime = 0;
		}
	}

}
