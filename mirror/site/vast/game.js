var NorthButton = document.getElementById('north');
var EastButton = document.getElementById('east');
var WestButton = document.getElementById('west');
var SouthButton = document.getElementById('south');

var game = new Phaser.Game(1280, 720, Phaser.CANVAS, 'gameDiv', { preload: preload, create: create, update: update}, true);
function preload(){
game.load.spritesheet("jennRun1","rooms/jennRun1.png",32,61);
game.load.image("RightBorder","rooms/RightBorder.png");
game.load.image("TopBorder","rooms/TopBorder.png");
game.load.spritesheet("anim1","rooms/anim1.png",116,109);
game.load.spritesheet("anim2","rooms/anim2.png",31,39);
game.load.spritesheet("anim3","rooms/anim3.png",56,47);
game.load.spritesheet("anim4","rooms/anim4.png",16,18);
game.load.spritesheet("anim5","rooms/anim5.png",44,29);
game.load.spritesheet("anim6","rooms/anim6.png",44,49);
game.load.spritesheet("anim7","rooms/anim7.png",44,29);
game.load.spritesheet("anim8","rooms/anim8.png",44,29);
game.load.spritesheet("anim9","rooms/anim9.png",122,74);
game.load.spritesheet("anim10","rooms/anim10.png",114,82);
game.load.spritesheet("anim11","rooms/anim11.png",40,31);
game.load.spritesheet("anim12","rooms/anim12.png",44,29);
game.load.spritesheet("anim13","rooms/anim13.png",84,86);
game.load.spritesheet("anim14","rooms/anim14.png",98,78);
game.load.spritesheet("anim15","rooms/anim15.png",65,70);
game.load.spritesheet("birds","rooms/birds.png",60,48);
game.load.spritesheet("anim16","rooms/anim16.png",44,29);
game.load.spritesheet("anim17","rooms/anim17.png",44,29);
game.load.spritesheet("anim18","rooms/anim18.png",44,29);
game.load.spritesheet("anim19","rooms/anim19.png",44,29);
game.load.image("background1","rooms/background1.png");
game.load.spritesheet("jennBox","rooms/jennBox.png",72,55);
game.load.spritesheet("jennboxonly","rooms/jennboxonly.png",72,55);
var fxlist =
['sounds/sparrows/sparrow1.mp3',
'sounds/sparrows/sparrow2.mp3',
'sounds/sparrows/sparrow3.mp3',
'sounds/sparrows/sparrow4.mp3',
'sounds/sparrows/sparrow5.mp3',
'sounds/sparrows/sparrow6.mp3',
'sounds/sparrows/sparrow7.mp3',
'sounds/sparrows/sparrow8.mp3',
'sounds/sparrows/sparrow9.mp3',
'sounds/sparrows/sparrow10.mp3',
'sounds/sparrows/sparrow11.mp3'];
for (var i=1; i<=fxlist.length; i++){
game.load.audio('sparrow'+i,"sounds/sparrows/sparrow"+i+".mp3");
}
}
function create(){
//Audio begin
var audio1 = document.getElementById("audio1");
audio1.volume = 0;
$(audio1).animate({volume: .04}, 6400);
audio1.play();
var initTime = game.rnd.integerInRange(10000,20000);
var rndAudio = function(){
  initTime = game.rnd.integerInRange(10000,20000);
  //var audio2 = document.getElementById("audio2");
  $('#audio2').attr('src','sounds/sparrows/sparrow'+game.rnd.integerInRange(1,11)+'.mp3');
  audio2.volume = 0;
  $(audio2).animate({volume: .02}, 6400);
  audio2.play();
  setTimeout(rndAudio,initTime);}
setTimeout(rndAudio,initTime);

game.physics.startSystem(Phaser.Physics.ARCADE);
game.world.setBounds(0,0, 1280,720);
game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
game.scale.minWidth= 640;
game.scale.minHeight=360;
jenn = game.add.sprite(game.world.centerX,game.world.centerY+200,"jennRun1");
var startFacingObj = (function() {
    var startFacingObj = null;
    $.ajax({
      'async': false,
      'global': false,
      'url': "startfacing.json",
      'dataType': "json",
      'success': function (data) {
        json = data;
      }
    });
    return json;
})();
var currentImg = startImg;
var faceDirection = startFacingObj[currentImg];
var facingDir = {"n":58, "s":59, "e":0, "w":7}
console.log("n" in facingDir);
console.log(faceDirection in facingDir);
jenn.frame = facingDir[faceDirection];
console.log(jenn.frame);
/*if (faceDirection == "n"){
  jenn.frame=58;
} else if (faceDirection == "s"){
  jenn.frame=59;
} else if (faceDirection == "e"){
  jenn.frame=0;
} else if (faceDirection == "w"){
  jenn.frame=7;
};*/
jenn.smoothed=false;
jenn.scale.x=4;
jenn.scale.y=4;
jenn.anchor.setTo (0.5,0.5);
jenn.inputEnabled=true;
jenn.enableBody=true;
game.physics.arcade.enable(jenn);
jenn.alpha=1;
/* on input down over Jenn, move Jenn
jenn.events.onInputDown.add(function jennRunRi(){
jenn.animations.add("runRi",[1,2,3,4,5,6],10,true);
jenn.animations.play("runRi");
jenn.body.velocity.x=300;
}),this;
*/
$('#plane').css({'border':'2px solid magenta'});
//Bang
$("body").append("<div id='bang'></div>");
//OBJECTS
secret = game.add.group();
for (var i = 0; i < 1; i++)
  {
secretChild = secret.create(game.rnd.integerInRange(540,950), game.rnd.integerInRange(570,580),"jennboxonly");
secretChild.smoothed=false;
secretChild.scale.x=5;
secretChild.scale.y=5;
secretChild.anchor.setTo(0.5,0.5);
secretChild.animations.add("secretChild",[],10,false);
secretChild.alpha = 0;
}
anims = game.add.group();
allSprites =
['anim1','anim2','anim3','anim4','anim5','anim6','anim7','anim8','anim9','anim10','anim11','anim12','anim13','anim14','anim15','anim16','anim17','anim18','anim19'];
for (var i = 0; i < 19; i++)
  {
animsChil = anims.create(game.world.randomX, game.rnd.integerInRange(0,300), allSprites[i]);
animsChil.animations.add("animsChil", [],10,true);
animsChil.animations.play("animsChil");
animsChil.alpha = game.rnd.integerInRange(0,1);
}
//Borders
RightBorder = game.add.sprite(1400,0,"RightBorder"); //offscreen
game.physics.arcade.enable(RightBorder);
RightBorder.inputEnabled=true;
RightBorder.enableBody=true;
RightBorder.body.immovable = true;
RightBorder.visible =false;
LeftBorder = game.add.sprite(-120,0,"RightBorder");
game.physics.arcade.enable(LeftBorder);
LeftBorder.inputEnabled=true;
LeftBorder.enableBody=true;
LeftBorder.body.immovable = true;
LeftBorder.visible =false;
TopBorder = game.add.sprite(0,250, "TopBorder"); //-200 to make her appear to go offscreen before transition
game.physics.arcade.enable(TopBorder);
TopBorder.inputEnabled=true;
TopBorder.enableBody=true;
TopBorder.body.immovable = true;
TopBorder.visible=false;
BottomBorder = game.add.sprite(0,820,"TopBorder");
game.physics.arcade.enable(BottomBorder);
BottomBorder.inputEnabled=true;
BottomBorder.enableBody=true;
BottomBorder.body.immovable = true;
BottomBorder.visible=false;
//MOVE JENN
//BUTTON FUNCTION MOVE ON CLICK
//EAST
EastButton.onclick = function moveJennEast(){
NorthButton.disabled=true; //deactivate all other buttons once one is clicked
SouthButton.disabled=true;
EastButton.disabled=true;
WestButton.disabled=true;
secretChild.inputEnabled=false;
jenn.animations.add("runRi",[1,2,3,4,5,6],10,true);
jenn.animations.play("runRi");
jenn.body.velocity.x=300; //  5/20   NEED TO CHANGE TO TWEEN?
$("#plane").fadeOut(1500);
fadeAnims = game.add.tween(anims).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None, true);
fadeBox = game.add.tween(secret).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None,true);
};
//WEST
WestButton.onclick = function moveJennWest(){
NorthButton.disabled=true;
SouthButton.disabled=true;
EastButton.disabled=true;
WestButton.disabled=true;
secretChild.inputEnabled=false;
jenn.animations.add("runWe",[8,9,10,11,12,13],10,true);
jenn.animations.play("runWe");
jenn.body.velocity.x=-300;
$("#plane").fadeOut(1500);
fadeAnims = game.add.tween(anims).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None, true);
fadeBox = game.add.tween(secret).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None,true);
};
//NORTH
NorthButton.onclick = function moveJennNorth(){
NorthButton.disabled=true;
SouthButton.disabled=true;
EastButton.disabled=true;
WestButton.disabled=true;
secretChild.inputEnabled=false;
jenn.animations.add("runNo",[14,15,16,17,18,19,20,21,22,23,24,25,26,29,30,31,32,33,34,35,60,61,62,63,64,65,66,67,68,69],10,true);
jenn.animations.play("runNo");
jenn.body.velocity.y=-100;
$("#plane").fadeOut(1200);
fadeAnims = game.add.tween(anims).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None, true);
fadeBox = game.add.tween(secret).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None,true);
fadeJenn = game.add.tween(jenn).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None,true,1500);
}
//SOUTH
SouthButton.onclick = function moveJennSouth(){
NorthButton.disabled=true;
SouthButton.disabled=true;
EastButton.disabled=true;
WestButton.disabled=true;
secretChild.inputEnabled=false;
jenn.scale.x=5.7; //appear to move forward
jenn.scale.y=5.7;
jenn.animations.add("runSo",[36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,69,70,71,72,73,74],10,false);
jenn.animations.play("runSo");
jenn.body.velocity.y=50;
$("#plane").fadeOut(1200);
fadeAnims = game.add.tween(anims).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None, true);
fadeBox = game.add.tween(secret).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None,true);
fadeJenn = game.add.tween(jenn).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None,true,1500);
}
//Bird Group
birdG = game.add.group();
  birdG.enableBody = true;
birdGGen = game.time.events.loop(8500,genB, this);
  birdGGen.timer.start();
}
function update(){
//ON COLLIDE PLAY FUNCTION
game.physics.arcade.collide(jenn, RightBorder, playEast, null, this);
game.physics.arcade.collide(jenn, LeftBorder, playWest, null, this);
game.physics.arcade.collide(jenn, TopBorder, playNorth, null, this);
game.physics.arcade.collide(jenn, BottomBorder, playSouth, null, this);
}
//BIRDS ACROSS SCREEN
function genB(){
for (var i = 0; i < 1; i++){
var x = i * 1;
var velocityX = game.rnd.integerInRange(220, 480);
var bird;
bird = birdG.getFirstExists(false);
if (!bird) {
bird = game.add.sprite(game.world.randomX, 0, 'birds');
bird.animations.add('bird');
bird.play('bird',10,true);
birdG.add(bird);
bird.smoothed=false;
bird.scale.x=-1.8;
bird.scale.y=1.8;
bird.anchor.setTo(0, 0.5);
game.physics.arcade.enableBody(bird);
bird.enableBody = true;
}
bird.anchor.setTo(0, 0.5);
bird.reset(0,game.rnd.integerInRange(0,325));
bird.body.velocity.x = velocityX;
bird.checkWorldBounds = true;
bird.outOfBoundsKill = true;
}}
//LOAD EAST AND ENTER W
function playEast(){
jenn.visible=false;
loadImg("e");
showAnims = game.add.tween(anims).to( { alpha: 1 }, 600, Phaser.Easing.Linear.None, true);
anims.forEach(function (animsChil,i){
animsChil.alpha = game.rnd.integerInRange(0,1);
anims.resetChild(animsChil,game.world.randomX, game.rnd.integerInRange(0,325),allSprites[i]);
}),this;
//box anim
showBox = game.add.tween(secret).to( { alpha: 1 }, 600, Phaser.Easing.Linear.None, true);
secret.forEach(function (secretChild){
  secretChild.alpha = game.rnd.integerInRange(0,10);
  //secretChild.alpha = 1;
  secret.resetChild(secretChild,game.rnd.integerInRange(540,950), game.rnd.integerInRange(570,580),"jennboxonly");
  if (secretChild.alpha == 1){
    secretChild.inputEnabled=true;
    secretChild.events.onInputDown.add(function fadeSecret(){
      var audio1 = document.getElementById("audio1");
      $(audio1).animate({volume: 0}, 3400);
      NorthButton.disabled=true;
      SouthButton.disabled=true;
      EastButton.disabled=true;
      WestButton.disabled=true;
      $("#buttonsContain").fadeOut(1200);
      $("#plane").fadeOut(1200);
      $("#p1Next").fadeOut(1200);
      fadeAnims = game.add.tween(anims).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None, true);
      fadeJenn = game.add.tween(jenn).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None,true,100);
      jennBoxSprite = game.add.sprite(secretChild.position.x,secretChild.position.y,"jennBox");
      jennBoxSprite.alpha=0;
      jennBoxSprite.smoothed=false;
      jennBoxSprite.scale.x=5;
      jennBoxSprite.scale.y=5;
      jennBoxSprite.anchor.setTo(0.5,0.5);
      secretChild.inputEnabled=false;
      fadeAnims.onComplete.add(function (playBox){
          game.time.events.add(500, playBox2, this);
          function playBox2(){
            fadeJennBoxIn = game.add.tween(jennBoxSprite).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
            fadeJennBoxIn.onComplete.add(function (playJennBox){
              secretChild.kill();
              game.time.events.remove(birdGGen);
                game.time.events.add(1000, playBox3, this);
                function playBox3(){
                jennBoxSprite.animations.add("jennBoxSprite",[],5,false);
                secretAnim =jennBoxSprite.animations.play("jennBoxSprite",[],5,false);
                secretAnim.onComplete.add(function (fadeBox){
                  var audio2 = document.getElementById("audio2");
                  $(audio2).animate({volume: 0}, 1500);
                  fadeBoxTween = game.add.tween(jennBoxSprite).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None,true);
                  fadeBoxTween.onComplete.add(function (exitScene){
                    window.location = "/calm.html";
                    }),this;

                  }),this;
                }
            }),this;
          }
      }),this;
    }),this;

  }
  else{
  secretChild.alpha =0;
  secretChild.inputEnabled=false;
  secretChild.kill();
  }
});
$("#plane").fadeIn(1500);
game.time.events.add(2000, enterW, this);
}
function enterW(){
jenn.visible=true;
jenn.scale.x=4;
jenn.scale.y=4;
jenn.x =100;
jenn.y =game.world.centerY + 200;
jenn.animations.play("runRi");
enterWest = game.add.tween(jenn).to({x:game.world.centerX-200, y:game.world.centerY+200},1500,Phaser.Easing.Linear.None, true);
enterWest.onComplete.addOnce(standStill,this);}
function standStill(){
jenn.animations.stop();
jenn.frame =0;
NorthButton.disabled=false;
SouthButton.disabled=false;
EastButton.disabled=false;
WestButton.disabled=false;
}
//LOAD W AND ENTER E
function playWest(){
jenn.visible=false;
loadImg("w");
showAnims = game.add.tween(anims).to( { alpha: 1 }, 600, Phaser.Easing.Linear.None, true);
anims.forEach(function (animsChil,i){
animsChil.alpha = game.rnd.integerInRange(0,1);
anims.resetChild(animsChil,game.world.randomX, game.rnd.integerInRange(0,325),allSprites[i]);
}),this;
//box anim
showBox = game.add.tween(secret).to( { alpha: 1 }, 600, Phaser.Easing.Linear.None, true);
secret.forEach(function (secretChild){
  secretChild.alpha = game.rnd.integerInRange(0,10);
  //secretChild.alpha = 1;
  secret.resetChild(secretChild,game.rnd.integerInRange(540,950), game.rnd.integerInRange(570,580),"jennboxonly");
  if (secretChild.alpha == 1){
    secretChild.inputEnabled=true;
    secretChild.events.onInputDown.add(function fadeSecret(){
        var audio1 = document.getElementById("audio1");
        $(audio1).animate({volume: 0}, 3400);
      NorthButton.disabled=true;
      SouthButton.disabled=true;
      EastButton.disabled=true;
      WestButton.disabled=true;
      $("#buttonsContain").fadeOut(1200);
      $("#plane").fadeOut(1200);
      $("#p1Next").fadeOut(1200);
      fadeAnims = game.add.tween(anims).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None, true);
      fadeJenn = game.add.tween(jenn).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None,true,100);
      jennBoxSprite = game.add.sprite(secretChild.position.x,secretChild.position.y,"jennBox");
      jennBoxSprite.alpha=0;
      jennBoxSprite.smoothed=false;
      jennBoxSprite.scale.x=5;
      jennBoxSprite.scale.y=5;
      jennBoxSprite.anchor.setTo(0.5,0.5);
      secretChild.inputEnabled=false;
      fadeAnims.onComplete.add(function (playBox){
          game.time.events.add(500, playBox2, this);
          function playBox2(){
            fadeJennBoxIn = game.add.tween(jennBoxSprite).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
            fadeJennBoxIn.onComplete.add(function (playJennBox){
              secretChild.kill();
              game.time.events.remove(birdGGen);
                game.time.events.add(1000, playBox3, this);
                function playBox3(){
                jennBoxSprite.animations.add("jennBoxSprite",[],5,false);
                secretAnim =jennBoxSprite.animations.play("jennBoxSprite",[],5,false);
                secretAnim.onComplete.add(function (fadeBox){
                  var audio2 = document.getElementById("audio2");
                  $(audio2).animate({volume: 0}, 1500);
                  fadeBoxTween = game.add.tween(jennBoxSprite).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None,true);
                  fadeBoxTween.onComplete.add(function (exitScene){
                    window.location = "/hushed.html";
                    }),this;

                  }),this;
                }
            }),this;
          }
      }),this;
    }),this;

  }
  else{
  secretChild.alpha =0;
  secretChild.inputEnabled=false;
  secretChild.kill();
  }
});
$("#plane").fadeIn(1500);
game.time.events.add(1000, enterE, this);}
function enterE(){
jenn.visible=true;
jenn.scale.x=4;
jenn.scale.y=4;
jenn.x =1280;
jenn.y =game.world.centerY + 200;
jenn.animations.play("runWe");
enterEast = game.add.tween(jenn).to({x:game.world.centerX+200, y:game.world.centerY+200},1500,Phaser.Easing.Linear.None, true);
enterEast.onComplete.addOnce(standStill2,this);}
function standStill2(){
jenn.frame = 7;
jenn.animations.stop();
NorthButton.disabled=false;
SouthButton.disabled=false;
EastButton.disabled=false;
WestButton.disabled=false;
}
//LOAD N AND ENTER S
function playNorth(){
jenn.alpha=0;
loadImg("n");
showAnims = game.add.tween(anims).to( { alpha: 1 }, 600, Phaser.Easing.Linear.None, true);
anims.forEach(function (animsChil,i){
animsChil.alpha = game.rnd.integerInRange(0,1);
anims.resetChild(animsChil,game.world.randomX, game.rnd.integerInRange(0,325),allSprites[i]);
}),this;
//box anim
showBox = game.add.tween(secret).to( { alpha: 1 }, 600, Phaser.Easing.Linear.None, true);
secret.forEach(function (secretChild){
  secretChild.alpha = game.rnd.integerInRange(0,10);
  //secretChild.alpha = 1;
  secret.resetChild(secretChild,game.rnd.integerInRange(540,950), game.rnd.integerInRange(570,580),"jennboxonly");
  if (secretChild.alpha == 1){
    secretChild.inputEnabled=true;
    secretChild.events.onInputDown.add(function fadeSecret(){
        var audio1 = document.getElementById("audio1");
        $(audio1).animate({volume: 0}, 3400);
      NorthButton.disabled=true;
      SouthButton.disabled=true;
      EastButton.disabled=true;
      WestButton.disabled=true;
      $("#buttonsContain").fadeOut(1200);
      $("#plane").fadeOut(1200);
      $("#p1Next").fadeOut(1200);
      fadeAnims = game.add.tween(anims).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None, true);
      fadeJenn = game.add.tween(jenn).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None,true,100);
      jennBoxSprite = game.add.sprite(secretChild.position.x,secretChild.position.y,"jennBox");
      jennBoxSprite.alpha=0;
      jennBoxSprite.smoothed=false;
      jennBoxSprite.scale.x=5;
      jennBoxSprite.scale.y=5;
      jennBoxSprite.anchor.setTo(0.5,0.5);
      secretChild.inputEnabled=false;
      fadeAnims.onComplete.add(function (playBox){
          game.time.events.add(500, playBox2, this);
          function playBox2(){
            fadeJennBoxIn = game.add.tween(jennBoxSprite).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
            fadeJennBoxIn.onComplete.add(function (playJennBox){
              secretChild.kill();
              game.time.events.remove(birdGGen);
                game.time.events.add(1000, playBox3, this);
                function playBox3(){
                jennBoxSprite.animations.add("jennBoxSprite",[],5,false);
                secretAnim =jennBoxSprite.animations.play("jennBoxSprite",[],5,false);
                secretAnim.onComplete.add(function (fadeBox){
                  var audio2 = document.getElementById("audio2");
                  $(audio2).animate({volume: 0}, 1500);
                  fadeBoxTween = game.add.tween(jennBoxSprite).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None,true);
                  fadeBoxTween.onComplete.add(function (exitScene){
                    window.location = "/stormless.html";
                    }),this;

                  }),this;
                }
            }),this;
          }
      }),this;
    }),this;

  }
  else{
  secretChild.alpha =0;
  secretChild.inputEnabled=false;
  secretChild.kill();
  }
});
$("#plane").fadeIn(1500);
game.time.events.add(1000, enterS, this);
}
function enterS(){
jenn.animations.stop("runNo");
fadeJenn = game.add.tween(jenn).to( { alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
jenn.scale.x=4;
jenn.scale.y=4;
jenn.x = game.world.centerX;
jenn.y =650;
jenn.animations.add("runNoShort", [14,15,16,17],10,true);
jenn.animations.play("runNoShort");
enterSouth = game.add.tween(jenn).to({x:game.world.centerX, y:game.world.centerY+200,},500,Phaser.Easing.Linear.None, 2000);
enterSouth.onComplete.addOnce(standStill3,this);}
function standStill3(){
jenn.frame = 58;
jenn.animations.stop();
NorthButton.disabled=false;
SouthButton.disabled=false;
EastButton.disabled=false;
WestButton.disabled=false;
}
//LOAD S AND ENTER N
function playSouth(){
jenn.alpha=0;
jenn.position.y=20; //is this doing anything?
jenn.animations.stop("runSo");
loadImg("s");
showAnims = game.add.tween(anims).to( { alpha: 1 }, 600, Phaser.Easing.Linear.None, true);
anims.forEach(function (animsChil,i){
animsChil.alpha = game.rnd.integerInRange(0,2);
anims.resetChild(animsChil,game.world.randomX, game.rnd.integerInRange(0,325),allSprites[i]);
}),this;
$("#plane").fadeIn(2500);
//box anim
showBox = game.add.tween(secret).to( { alpha: 1 }, 600, Phaser.Easing.Linear.None, true);
secret.forEach(function (secretChild){
  secretChild.alpha = game.rnd.integerInRange(0,10);
  //secretChild.alpha = 1;
  secret.resetChild(secretChild,game.rnd.integerInRange(540,950), game.rnd.integerInRange(570,580),"jennboxonly");
  if (secretChild.alpha == 1){
    secretChild.inputEnabled=true;
    secretChild.events.onInputDown.add(function fadeSecret(){
        var audio1 = document.getElementById("audio1");
        $(audio1).animate({volume: 0}, 3400);
      NorthButton.disabled=true;
      SouthButton.disabled=true;
      EastButton.disabled=true;
      WestButton.disabled=true;
      $("#buttonsContain").fadeOut(1200);
      $("#plane").fadeOut(1200);
      $("#p1Next").fadeOut(1200);
      fadeAnims = game.add.tween(anims).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None, true);
      fadeJenn = game.add.tween(jenn).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None,true,100);
      jennBoxSprite = game.add.sprite(secretChild.position.x,secretChild.position.y,"jennBox");
      jennBoxSprite.alpha=0;
      jennBoxSprite.smoothed=false;
      jennBoxSprite.scale.x=5;
      jennBoxSprite.scale.y=5;
      jennBoxSprite.anchor.setTo(0.5,0.5);
      secretChild.inputEnabled=false;
      fadeAnims.onComplete.add(function (playBox){
          game.time.events.add(500, playBox2, this);
          function playBox2(){
            fadeJennBoxIn = game.add.tween(jennBoxSprite).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
            fadeJennBoxIn.onComplete.add(function (playJennBox){
              secretChild.kill();
              game.time.events.remove(birdGGen);
                game.time.events.add(1000, playBox3, this);
                function playBox3(){
                jennBoxSprite.animations.add("jennBoxSprite",[],5,false);
                secretAnim =jennBoxSprite.animations.play("jennBoxSprite",[],5,false);
                secretAnim.onComplete.add(function (fadeBox){
                  var audio2 = document.getElementById("audio2");
                  $(audio2).animate({volume: 0}, 1500);
                  fadeBoxTween = game.add.tween(jennBoxSprite).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None,true);
                  fadeBoxTween.onComplete.add(function (exitScene){
                    window.location = "/breathless.html";
                    }),this;

                  }),this;
                }
            }),this;
          }
      }),this;
    }),this;

  }

  else{
  secretChild.alpha =0;
  secretChild.inputEnabled=false;
  secretChild.kill();
  }
});
game.time.events.add(1000, enterN, this);}
function enterN(){
fadeJenn = game.add.tween(jenn).to( { alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
jenn.scale.x=4;
jenn.scale.y=4;
jenn.x = game.world.centerX;
jenn.y =450;
jenn.animations.play("runSo");
enterNorth = game.add.tween(jenn).to({x:game.world.centerX, y:game.world.centerY+200, },1500,Phaser.Easing.Linear.None, 2000);
enterNorth.onComplete.addOnce(standStill4,this);}
function standStill4(){
jenn.frame = 59;
jenn.animations.stop();
NorthButton.disabled=false;
SouthButton.disabled=false;
EastButton.disabled=false;
WestButton.disabled=false;
}
