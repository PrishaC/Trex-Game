var ground, ground_image
var ground2
var cloud, cloud_image
var cactus, cactus1, cactus2, cactus3, cactus4, cactus5, cactus6
var cactus_group
var cloud_group
var gameState = "start"
var score = 0
var trexDead
var gameOver, gameOverimage
var restart, restartImage
var jump
var die
var checkPoint
var trexStart
var highScore = 0


function preload(){
  trex_running = loadAnimation ("trex1.png", "trex3.png", "trex4.png")
ground_image = loadImage ("ground2.png")
cloud_image = loadImage ("cloud.png")
cactus1 = loadImage ("obstacle1.png")
cactus2 = loadImage ("obstacle2.png")
cactus3 = loadImage ("obstacle3.png")
cactus4 = loadImage ("obstacle4.png")
cactus5 = loadImage ("obstacle5.png")
cactus6 = loadImage ("obstacle6.png")
trexDead = loadAnimation ("trex_collided.png")
gameOverimage = loadImage ("gameOver.png")
restartImage = loadImage ("restart.png")
jump = loadSound("jump.mp3")
die = loadSound("die.mp3")
checkpoint = loadSound("checkpoint.mp3 ")
trexStart = loadAnimation("trex1.png")
}

function setup(){
  createCanvas(600,200)
  
  //create a trex sprite
  trex = createSprite (50,190,50,50)
  trex.addAnimation("trexStart",trexStart)
  trex.addAnimation("run", trex_running)
  trex.addAnimation("dead", trexDead)
  trex.scale = 0.5

//making the collision radius of trex
//trex.debug = true
//changing the shape and size of the collision radius of trex
trex.setCollider("circle", 0, 0, 40)


  //creating the ground
  ground = createSprite (300,180,600,5)
  ground.addImage(ground_image)
  //creating fake ground
ground2 = createSprite (300,190,600,5)
//making the fake ground invisable
ground2.visible=false
//testing how to generate ran dom numbers
//var ran = Math.round(random(2,40))
//console.log(ran)
//creating the groups
cloud_group = createGroup()
cactus_group = new Group()

//creating the gameover and restart icons
gameOver = createSprite(300, 70)
gameOver.addImage(gameOverimage )
gameOver.scale = 0.7

restart = createSprite(300, 110)
restart.addImage(restartImage)
restart.scale = 0.5

}



function draw(){
  background("steelblue")
  //displaying score
  textSize(20)
fill ("white")
  text("Score: "+score, 450,50)
  //displaying high score
  textSize(20)
  fill("white")
  text("High Score: "+highScore, 25,50)
  //start block
  if(gameState=="start"){
    //setting the animation to start mode at the beggining
    trex.changeAnimation("trexStart",trexStart)
     //making the gameover and restart icons invisible
     gameOver.visible = false
     restart.visible = false
    if(keyDown("space")){
      gameState="alive"
    }
  }
  //alive block
  if(gameState=="alive"){
    //making the gameover and restart icons invisible
    gameOver.visible = false
    restart.visible = false
    //changing trex animation to running 
    trex.changeAnimation("run")
    //moving the ground to move left
  ground.velocityX = -5
  //increasing the score
  score = score+Math.round(getFrameRate()/60)
//making trex jump when space bar is pressed
if (keyDown("space") && trex.collide(ground2)){
  trex.velocityY = -25
  jump.play()

}
//adding gravity to trex
trex.velocityY = trex.velocityY+2.1
 //making the ground infinte by scrolling it
 if (ground.x<0){
  ground.x=300
}
//making the sound effect for the checkpoint sound
if(score%200 == 0 && score>0){
  checkpoint.play()
} 

cloud_loop ()
cactus_loop ()


//making trex die if he touches the cactus
if(trex.isTouching(cactus_group)){
  die.play()
  gameState = "dead"
  //making the trex auutomated
  //trex.velocityY = -20
  
}

  }
  //dead block
  else if(gameState=="dead"){
    //making the gameover and restart icons visible
    gameOver.visible = true
    restart.visible = true
    //moving the ground stop
  ground.velocityX = 0
  //fixing the flying trex bug
  trex.velocityY = 0
  //freezing the cactus and the clouds when the trex dies
cloud_group.setVelocityXEach(0)
cactus_group.setVelocityXEach(0)
//freezing trex legs once dead
trex.changeAnimation("dead")
//setting the lifetime of game objects so they are never destroyed
cloud_group.setLifetimeEach(-1)
cactus_group.setLifetimeEach(-1)
//updating the high score
if(score>highScore){
  highScore = score
}
//restarting the game
if(mousePressedOver(restart)){
  reset()
}
  }
  
  //making trex stand on the ground
  trex.collide(ground2)
  

 drawSprites()
}

function cloud_loop (){
  
  if (frameCount%120==0){
    cloud = createSprite(600,30, 40, 10)
    cloud.addImage(cloud_image)
    cloud.scale = 0.5
    cloud.y = Math.round(random (10,120))
    cloud.velocityX = -2
    //fixing the depth problem for trex
    trex.depth = cloud.depth+1
    //handling the memory leak for clouds by giving it a lifetime
    cloud.lifetime= 350
    //adding all of the clouds into a group
    cloud_group.add(cloud)
  }
}

function cactus_loop (){
  if(frameCount%35               ==0){
    cactus = createSprite (600,160,10,40)
    cactus.velocityX= -8-score/100
    var ran = Math.round(random(1,6))
    switch(ran){
      case 1: cactus.addImage(cactus1)
      break
      case 2: cactus.addImage(cactus2)
      break
      case 3: cactus.addImage(cactus3)
      break
      case 4: cactus.addImage(cactus4)
      break
      case 5: cactus.addImage(cactus5)
      break
      case 6: cactus.addImage(cactus6)
      break
      default: break

    }
    cactus.scale = 0.5;
    cactus.lifetime=100;
    //adding each cactus into the group
    cactus_group.add(cactus);
    //fixing the depth problem for cactus
    trex.depth = cactus.depth +1
  }
  
}
function reset (){
  gameState = "start";
//destroying the objects that are frozen on the screen
  cloud_group.destroyEach();
  cactus_group.destroyEach();
  //getting the trex animation back to running pose
  trex.changeAnimation("run");
  //resetting the score back to zero(0)
  score = 0
}