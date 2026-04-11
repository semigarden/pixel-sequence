

var gameStart = function(game){}

gameStart.prototype = {
  	create: function(){
	var numberofefx = 30;
	var numberofefxindx = numberofefx - 1;
	this.game.camera.flash('#000000', 1000);
	this.game.physics.startSystem(Phaser.Physics.ARCADE);	
	this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;	
	this.game.world.setBounds(0,0, 1280,720);
	setTimeout(function(){
	$('#gameDiv').css({"border":"2px solid magenta"});
	}, 1000);
//Room Select
	room = this.game.add.sprite(0,0,'room'+this.game.rnd.integerInRange(1, 122));
    room.height = this.game.height;
	room.width = this.game.width;
	room.smoothed= false;
	room.inputEnabled=true;
	grayscale = this.game.add.sprite(0,0,"grayscale");
	grayscale.blendMode = 14;
	grayscale.inputEnabled = true;
//Borders
	RightBorder = this.game.add.sprite(1400,0,"RightBorder");
	this.game.physics.arcade.enable(RightBorder);
	RightBorder.inputEnabled=true;
	RightBorder.enableBody=true;
	RightBorder.body.immovable = true;
	LeftBorder = this.game.add.sprite(-130,0,"RightBorder");
	this.game.physics.arcade.enable(LeftBorder);
	LeftBorder.inputEnabled=true;
	LeftBorder.enableBody=true;
	LeftBorder.body.immovable = true;
	TopBorder = this.game.add.sprite(0,-130, "TopBorder"); 
	this.game.physics.arcade.enable(TopBorder);
	TopBorder.inputEnabled=true;
	TopBorder.enableBody=true;
	TopBorder.body.immovable = true;
	BottomBorder = this.game.add.sprite(0,820,"TopBorder");
	this.game.physics.arcade.enable(BottomBorder);
	BottomBorder.inputEnabled=true;
	BottomBorder.enableBody=true;
	BottomBorder.body.immovable = true;
	tgame = this.game;
//Top
	topPlace = this.game.add.group();
	for (var i = 0; i < this.game.rnd.integerInRange(0, 50); i++){
	topPlace.create(room.position.x+10 + Math.random() * this.game.world.width-20 ,room.position.y+10 + Math.random() * 200,"topObjects");
	topPlace.setAll("smoothed", false);
	topPlace.forEach(function(topObjects){
	topObjects.frame = Math.floor(Math.random() *150)+1;
	})
	}
//Middle
	midPlace = this.game.add.group();
	for (var i = 0; i < this.game.rnd.integerInRange(0, 50); i++){
	midPlace.create(room.position.x+10 + Math.random() * this.game.world.width-20 ,room.position.y+350 + Math.random() * 200,"midObjects");
	midPlace.setAll("smoothed", false);
	midPlace.setAll("scale.x", 2);
	midPlace.setAll("scale.y", 2);
	midPlace.forEach(function(midObjects){
	midObjects.frame = Math.floor(Math.random() *143)+1;
	})
	}
//Floor
	bottomPlace = this.game.add.group();
	for (var i = 0; i < this.game.rnd.integerInRange(0, 50); i++){
	bottomPlace.create(room.position.x+10 + Math.random() * this.game.world.width-20 ,room.position.y+500 + Math.random() * 150,"bottomObjects2");
	bottomPlace.setAll("smoothed", false);
	bottomPlace.setAll("scale.x", 1.6);
	bottomPlace.setAll("scale.y", 1.6);
	bottomPlace.forEach(function(bottomObjects2){
	bottomObjects2.frame = Math.floor(Math.random() *700)+1;
	})
	}	
//Floor animated constant, no input 
	bottomAnimsConstant = this.game.add.group();
	for (var i = 0; i < this.game.rnd.integerInRange(1, 3); i++)
	{
	bottomAnimsConstant.create(room.position.x+10 + Math.random() * this.game.world.width-20 ,room.position.y+350 + Math.random() * 200,"animFloorConstant"+this.game.rnd.integerInRange(1, 16));
	bottomAnimsConstant.setAll("smoothed", false);
	bottomAnimsConstant.setAll("scale.x", 1.6);
	bottomAnimsConstant.setAll("scale.y", 1.6);
	bottomAnimsConstant.callAll("animations.add","animations","bottomAnimsConstant",[],10, true);
	bottomAnimsConstant.callAll("animations.play","animations","bottomAnimsConstant");}
//Floor animated no loop
	bottomAnims = this.game.add.group();
	for (var i = 0; i < this.game.rnd.integerInRange(2, 5); i++)
	{
	bottomAnims.create(room.position.x+10 + Math.random() * this.game.world.width-20 ,room.position.y+350 + Math.random() * 200,"animFloor"+this.game.rnd.integerInRange(11, 34));
	bottomAnims.setAll("smoothed", false);
	bottomAnims.setAll("scale.x", 1.4);
	bottomAnims.setAll("scale.y", 1.4);
	bottomAnims.setAll("inputEnabled",true);
	bottomAnims.callAll("animations.add","animations","bottomAnims",[],10, false);
	bottomAnims.forEach(function(bottomAnims){
	bottomAnims.events.onInputDown.add(function playBottomAnim(){
	bottomAnims.animations.play("bottomAnims");
	bottomAnims.inputEnabled = false;	
	soundFX1 = tgame.sound.play("fx"+tgame.rnd.integerInRange(0,numberofefxindx));
	soundFX1.volume=.07;
	})})} //second click triggers links to appear -- why? will need to fix.
//Floor animated no loop sized larger
	bottomAnimsLarge = this.game.add.group();
	for (var i = 0; i < this.game.rnd.integerInRange(1, 5); i++){
	bottomAnimsLarge.create(room.position.x+10 + Math.random() * this.game.world.width-20 ,room.position.y+350 + Math.random() * 200,"animFloor"+this.game.rnd.integerInRange(1, 10));
	bottomAnimsLarge.setAll("smoothed", false);
	bottomAnimsLarge.setAll("scale.x", 2.6);
	bottomAnimsLarge.setAll("scale.y", 2.6);
	bottomAnimsLarge.setAll("inputEnabled",true);
	bottomAnimsLarge.callAll("animations.add","animations","bottomAnimsLarge",[],10, false);
	bottomAnimsLarge.forEach(function(bottomAnimsLarge){
	bottomAnimsLarge.events.onInputDown.add(function playBottomAnim(){
	bottomAnimsLarge.animations.play("bottomAnimsLarge");
	bottomAnimsLarge.inputEnabled = false;
	soundFX2 = tgame.sound.play("fx"+tgame.rnd.integerInRange(0,numberofefxindx));
	soundFX2.volume=.07;
	})})} //second click triggers links to appear -- why? will need to fix.
//Floor animated loop
	bottomAnimsLoop = this.game.add.group();
	for (var i = 0; i < this.game.rnd.integerInRange(1, 3); i++){
	bottomAnimsLoop.create(room.position.x+10 + Math.random() * this.game.world.width-20 ,room.position.y+350 + Math.random() * 200,"animFloorLoop"+this.game.rnd.integerInRange(1, 13));
	bottomAnimsLoop.setAll("smoothed", false);
	bottomAnimsLoop.setAll("scale.x", 1.6);
	bottomAnimsLoop.setAll("scale.y", 1.6);
	bottomAnimsLoop.setAll("inputEnabled",true);
	bottomAnimsLoop.callAll("animations.add","animations","bottomAnimsLoop",[],10, true);
	bottomAnimsLoop.forEach(function(bottomAnimsLoop){
	bottomAnimsLoop.events.onInputDown.add(function playBottomAnimLoop(){
	bottomAnimsLoop.animations.play("bottomAnimsLoop");
	bottomAnimsLoop.inputEnabled = false;	
	soundFX3 = tgame.sound.play("fx"+tgame.rnd.integerInRange(0,numberofefxindx));
	soundFX3.volume=.07;
	})})}
//Top animated no loop
	topAnims = this.game.add.group();
	for (var i = 0; i < this.game.rnd.integerInRange(3, 6); i++){
	topAnims.create(room.position.x+10 + Math.random() * this.game.world.width-20 ,room.position.y+10 + Math.random() * 200,"animTop"+this.game.rnd.integerInRange(3, 8));
	topAnims.setAll("smoothed", false);
	topAnims.setAll("scale.x", 1.4);
	topAnims.setAll("scale.y", 1.4);
	topAnims.setAll("inputEnabled",true);
	topAnims.callAll("animations.add","animations","topAnims",[],10, false);
	topAnims.forEach(function(topAnims){
	topAnims.events.onInputDown.add(function playTopAnim(){
	topAnims.animations.play("topAnims");
	topAnims.inputEnabled = false;
	soundFX4 = tgame.sound.play("fx"+tgame.rnd.integerInRange(0,numberofefxindx));
	soundFX4.volume=.07;
	})})}
//Top animated no loop, larger
	topAnimsLar = this.game.add.group();
	for (var i = 0; i < this.game.rnd.integerInRange(1, 3); i++){
	topAnimsLar.create(room.position.x+10 + Math.random() * this.game.world.width-20 ,room.position.y+10 + Math.random() * 200,"animTop"+this.game.rnd.integerInRange(1, 2));
	topAnimsLar.setAll("smoothed", false);
	topAnimsLar.setAll("scale.x", 2.6);
	topAnimsLar.setAll("scale.y", 2.6);
	topAnimsLar.setAll("inputEnabled",true);
	topAnimsLar.callAll("animations.add","animations","topAnimsLar",[],10, false);
	topAnimsLar.forEach(function(topAnimsLar){
	topAnimsLar.events.onInputDown.add(function playTopAnim(){
	topAnimsLar.animations.play("topAnimsLar");
	topAnimsLar.inputEnabled = false;
	soundFX5 = tgame.sound.play("fx"+tgame.rnd.integerInRange(0,numberofefxindx));
	soundFX5.volume=.07;
	})})}
//Top animatied constant, no input 
	TopAnimsConstant = this.game.add.group();
	for (var i = 0; i < this.game.rnd.integerInRange(1, 3); i++){
	TopAnimsConstant.create(room.position.x+10 + Math.random() * this.game.world.width-20 ,room.position.y+10 + Math.random() * 200,"animTopConstant"+this.game.rnd.integerInRange(1, 15));
	TopAnimsConstant.setAll("smoothed", false);
	TopAnimsConstant.setAll("scale.x", 1.6);
	TopAnimsConstant.setAll("scale.y", 1.6);
	TopAnimsConstant.callAll("animations.add","animations","TopAnimsConstant",[],10, true);
	TopAnimsConstant.callAll("animations.play","animations","TopAnimsConstant");}
//Top animated, loop after input (break glass)
	topAnimsGlass = this.game.add.group();
	for (var i = 0; i < this.game.rnd.integerInRange(1, 3); i++){
	topAnimsGlass.create(room.position.x+10 + Math.random() * this.game.world.width-20 ,room.position.y+10 + Math.random() * 200,"animTopLoop1");
	topAnimsGlass.setAll("smoothed", false);
	topAnimsGlass.setAll("inputEnabled",true);
	topAnimsGlass.callAll("animations.add","animations","topAnimsGlass2",[8,9,10,11,12,13],10, true);
	topAnimsGlass.callAll("animations.add","animations","topAnimsGlass1",[0,1,2,3,4,5,6,7],10, true);
	topAnimsGlass.callAll("animations.play","animations","topAnimsGlass1");
	topAnimsGlass.forEach(function(topAnimsGlass){
	topAnimsGlass.events.onInputDown.add(function topAnimsGlass2(){
	topAnimsGlass.animations.play("topAnimsGlass2");
	topAnimsGlass.inputEnabled = false;
	soundFX6 = tgame.sound.play("fx"+tgame.rnd.integerInRange(0,numberofefxindx));
	soundFX6.volume=.07;
	})})}
//Sonia 
	sonia = this.game.add.sprite(this.game.world.centerX + this.game.rnd.integerInRange(-400, 200),this.game.world.centerY + this.game.rnd.integerInRange(100, 250),"sonia2");
	sonia.smoothed=false;
	sonia.scale.x=3;
	sonia.scale.y=3;
	sonia.anchor.setTo (0.5,0.5);
	sonia.inputEnabled=true;
	sonia.enableBody=true;
	sonia.outOfBoundsKill=true; //dont know if this is working
	this.game.physics.arcade.enable(sonia);
	sonia.animations.add("sonia1", [0,1,2],5, true);
	soniaFall= sonia.animations.add("sonia2", [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],10, false);
	soniaRun = sonia.animations.add("sonia3", [18,19,20,21,22,23],10, true);
	soniaFallLeft= sonia.animations.add("sonia4", [24,25,26,27,28,29,30,31,32,33,34,35,36,37],10, false);
	soniaRunLeft = sonia.animations.add("sonia5", [38,39,40,41,42,43],10, true);
	sonia.animations.play("sonia1");
	this.game.time.events.add(6000, moveSonia, this);
//exit door	
	secretChild = this.game.add.group();
	for (var i = 0; i < 1; i++)
    {
	secretChild.create(this.game.world.randomX, this.game.rnd.integerInRange(570,580),"exitdoor");
	secretChild.setAll("smoothed",false);
	secretChild.callAll("animations.add","animations","secretChild",[0,1,2,3,4],10, false)
	secretChild.setAll("scale.x",5);
	secretChild.setAll("scale.y",5);
	secretChild.setAll("anchor.x",0.5);
	secretChild.setAll("anchor.y",0.5);
	secretChild.setAll("alpha",0);
	var gme=this.game;
	secretChild.forEach(function(secretChild){
	secretChild.alpha=gme.rnd.integerInRange(1,6);
	//secretChild.resetChild(secretChild,gme.world.randomX, gme.rnd.integerInRange(570,580),"exitdoor");
		if (secretChild.alpha == 1){
			secretChild.animations.add("secretChild",[0,1,2,3,4],10,false);
			secretChild.animations.play("secretChild");
			secretChild.inputEnabled=true;
			secretChild.events.onInputDown.add(function playExitAnim(){
			secretChild.animations.add("openDoor",[4,5,6],10,false);
			exit = secretChild.animations.play("openDoor");
			exit.onComplete.add(function (exitScene){
			setTimeout(function(){
			$('#gameDiv').css({"border":"2px solid black"});
			}, 500);
			gme.camera.fade(0x000000,1000);	
			fading = $("#audio1").animate({volume: 0}, 1500);
			gme.time.events.add(1500, exitForreal, this);
			});
			function exitForreal(){
			links = ["breezeless.html","mild.html","motionless.html","still.html","windless.html"];
			thelink = links[Math.floor(Math.random() * (4-0) + 0)];
			console.log(thelink);
			window.location = "/" + thelink;
			}
			}),this;
			}
		else{
			secretChild.alpha = 0;
			secretChild.inputEnabled=false;
			secretChild.kill();
			}
			})
	}
//Time events
	this.game.time.events.add(1000, animEvent, this);
	//Anim Event Selector
	//animEvent: function(){
	function animEvent(){
	selector = this.game.rnd.integerInRange(1, 13);	
	if (selector == 1){	
	animEvent1 =this.game.add.group();
    animEvent1.enableBody = true;
	animEventGen1 = this.game.time.events.loop(3000, genAnim1, this);
    animEventGen1.timer.start();
	}
	else if (selector == 2) {
	animEvent2 =this.game.add.group();
    animEvent2.enableBody = true;	
	animEventGen2 = this.game.time.events.loop(2000, genAnim2, this);
    animEventGen2.timer.start();
	}
	else if (selector == 3) {
	animEvent3 =this.game.add.group();
    animEvent3.enableBody = true;	
	animEventGen3 = this.game.time.events.loop(6000, genAnim3, this);
    animEventGen3.timer.start();
	}
	else if (selector == 4) {
	animEvent4 =this.game.add.group();
    animEvent4.enableBody = true;	
	animEventGen4 = this.game.time.events.loop(6000, genAnim4, this);
    animEventGen4.timer.start();
	}
	else if (selector == 5) {
	animEvent5 =this.game.add.group();
    animEvent5.enableBody = true;	
	animEventGen5 = this.game.time.events.loop(1000, genAnim5, this);
    animEventGen5.timer.start();
	}
	else if (selector == 6) {
	animEvent6 =this.game.add.group();
    animEvent6.enableBody = true;	
	animEventGen6 = this.game.time.events.loop(2000, genAnim6, this);
    animEventGen6.timer.start();
	}
	else if (selector == 7) {
	animEvent7 =this.game.add.group();
    animEvent7.enableBody = true;	
	animEventGen7 = this.game.time.events.loop(2000, genAnim7, this);
    animEventGen7.timer.start();
	}
	else if (selector == 8) {
	animEvent8 =this.game.add.group();
    animEvent8.enableBody = true;	
	animEventGen8 = this.game.time.events.loop(2000, genAnim8, this);
    animEventGen8.timer.start();
	}
	else if (selector == 9) {
	animEvent9 =this.game.add.group();
    animEvent9.enableBody = true;	
	animEventGen9 = this.game.time.events.loop(2000, genAnim9, this);
    animEventGen9.timer.start();
	}
	else if (selector == 10) {
	animEvent10 =this.game.add.group();
    animEvent10.enableBody = true;	
	animEventGen10 = this.game.time.events.loop(4000, genAnim10, this);
    animEventGen10.timer.start();
	}
	else if (selector == 11) {
	animEvent11 =this.game.add.group();
    animEvent11.enableBody = true;	
	animEventGen11 = this.game.time.events.loop(6000, genAnim11, this);
    animEventGen11.timer.start();
	}
	else if (selector == 12) {
	animEvent12 =this.game.add.group();
    animEvent12.enableBody = true;	
	animEventGen12 = this.game.time.events.loop(6000, genAnim12, this);
    animEventGen12.timer.start();
	}
	else if (selector == 13) {
	animEvent13 =this.game.add.group();
    animEvent13.enableBody = true;	
	animEventGen13 = this.game.time.events.loop(2000, genAnim13, this);
    animEventGen13.timer.start();
	}
	}
//Anim Events
	//genAnim1:function(){
	function genAnim1(){
	for (var i = 0; i < 1; i++) {
	var x = i * 1;
	var velocityX = this.game.rnd.integerInRange(80, 150);         
	var anim1;
	anim1 = animEvent1.getFirstExists(false);
	if (!anim1) {               
	anim1 = this.game.add.sprite(x, -10, 'animEvent1');
	anim1.smoothed=false;
	anim1.scale.x = 1.8;
	anim1.scale.y = 1.8;
	anim1.animations.add("anim1", [],10,true);
	anim1.animations.play("anim1");
	animEvent1.add(anim1);             
	anim1.anchor.setTo(0.5, 0.5);            
	this.game.physics.arcade.enableBody(anim1);
	anim1.enableBody = true;
	}        
	anim1.anchor.setTo(0.5, 0.5);
	anim1.reset(0,TopBorder.position.y+650 + Math.random() * 50); 
	anim1.body.velocity.x = velocityX;
	anim1.checkWorldBounds = true;
	anim1.outOfBoundsKill = true;
	}}
//genAnim2:function(){
	function genAnim2(){
	for (var i = 0; i < 1; i++) {
	var x = i * 1;
	var velocityX = this.game.rnd.integerInRange(-120, -150);         
	var anim2;
	anim2 = animEvent2.getFirstExists(false);
	if (!anim2) {               
	anim2 = this.game.add.sprite(x, 0, 'animEvent2');
	anim2.scale.x = 2;
	anim2.scale.y = 2;
	anim2.smoothed=false;
	anim2.animations.add("anim2", [],10,true);
	anim2.animations.play("anim2");
	animEvent2.add(anim2);             
	anim2.anchor.setTo(0.5, 0.5);            
	this.game.physics.arcade.enableBody(anim2);
	anim2.enableBody = true;
	}        
	anim2.anchor.setTo(0.5, 0.5);
	anim2.reset(this.game.world.width,this.game.world.randomY); 
	anim2.body.velocity.x = velocityX;
	anim2.checkWorldBounds = true;
	anim2.outOfBoundsKill = true;
	}}
//genAnim3:function(){
	function genAnim3(){
	for (var i = 0; i < 1; i++) {
	var x = i * 1;
	var velocityX = this.game.rnd.integerInRange(-120, -150);         
	var anim3;
	anim3 = animEvent3.getFirstExists(false);
	if (!anim3) {               
	anim3 = this.game.add.sprite(x, 0, 'animEvent3');
	anim3.scale.x = 2;
	anim3.scale.y = 2;
	anim3.smoothed=false;
	anim3.animations.add("anim3", [],10,true);
	anim3.animations.play("anim3");
	animEvent3.add(anim3);             
	anim3.anchor.setTo(0.5, 0.5);            
	this.game.physics.arcade.enableBody(anim3);
	anim3.enableBody = true;
	}        
	anim3.anchor.setTo(0.5, 0.5);
	anim3.reset(this.game.world.width,this.game.world.randomY); 
	anim3.body.velocity.x = velocityX;
	anim3.checkWorldBounds = true;
	anim3.outOfBoundsKill = true;
	}}
//genAnim4:function(){
	function genAnim4(){
	for (var i = 0; i < 1; i++) {
	var x = i * 1;
	var velocityX = this.game.rnd.integerInRange(120, 150);         
	var anim4;
	anim4 = animEvent4.getFirstExists(false);
	if (!anim4) {               
	anim4 = this.game.add.sprite(x, 0, 'animEvent4');
	anim4.scale.x = 2;
	anim4.scale.y = 2;
	anim4.smoothed=false;
	anim4.animations.add("anim4", [],10,true);
	anim4.animations.play("anim4");
	animEvent4.add(anim4);             
	anim4.anchor.setTo(0.5, 0.5);            
	this.game.physics.arcade.enableBody(anim4);
	anim4.enableBody = true;
	}        
	anim4.anchor.setTo(0.5, 0.5);
	anim4.reset(0,TopBorder.position.y+600 + Math.random() * 150); 
	anim4.body.velocity.x = velocityX;
	anim4.checkWorldBounds = true;
	anim4.outOfBoundsKill = true;
	}}
//genAnim5:function(){
	function genAnim5(){
	for (var i = 0; i < 1; i++) {
	var x = i * 1;
	var velocityX = this.game.rnd.integerInRange(120, 150);         
	var anim5;
	anim5 = animEvent5.getFirstExists(false);
	if (!anim5) {               
	anim5 = this.game.add.sprite(x, 0, 'animEvent5');
	anim5.scale.x = 2;
	anim5.scale.y = 2;
	anim5.smoothed=false;
	anim5.animations.add("anim5", [],10,true);
	anim5.animations.play("anim5");
	animEvent5.add(anim5);             
	anim5.anchor.setTo(0.5, 0.5);            
	this.game.physics.arcade.enableBody(anim5);
	anim5.enableBody = true;
	}        
	anim5.anchor.setTo(0.5, 0.5);
	anim5.reset(0,this.game.world.randomY); 
	anim5.body.velocity.x = velocityX;
	anim5.checkWorldBounds = true;
	anim5.outOfBoundsKill = true;
	}}
//genAnim6:function(){
	function genAnim6(){
	for (var i = 0; i < 1; i++) {
	var x = i * 1;
	var velocityX = this.game.rnd.integerInRange(120, 150);         
	var anim6;
	anim6 = animEvent6.getFirstExists(false);
	if (!anim6) {               
	anim6 = this.game.add.sprite(x, 0, 'animEvent6');
	anim6.scale.x = 2;
	anim6.scale.y = 2;
	anim6.smoothed=false;
	anim6.animations.add("anim6", [],10,true);
	anim6.animations.play("anim6");
	animEvent6.add(anim6);             
	anim6.anchor.setTo(0.5, 0.5);            
	this.game.physics.arcade.enableBody(anim6);
	anim6.enableBody = true;
	}        
	anim6.anchor.setTo(0.5, 0.5);
	anim6.reset(0,this.game.world.randomY); 
	anim6.body.velocity.x = velocityX;
	anim6.checkWorldBounds = true;
	anim6.outOfBoundsKill = true;
	}}
//genAnim7:function(){
	function genAnim7(){
	for (var i = 0; i < 1; i++) {
	var x = i * 1;
	var velocityX = this.game.rnd.integerInRange(120, 150);         
	var anim7;
	anim7 = animEvent7.getFirstExists(false);
	if (!anim7) {               
	anim7 = this.game.add.sprite(x, 0, 'animEvent7');
	anim7.scale.x = 2;
	anim7.scale.y = 2;
	anim7.smoothed=false;
	anim7.animations.add("anim7", [],20,true);
	anim7.animations.play("anim7");
	animEvent7.add(anim7);             
	anim7.anchor.setTo(0.5, 0.5);            
	this.game.physics.arcade.enableBody(anim7);
	anim7.enableBody = true;
	}        
	anim7.anchor.setTo(0.5, 0.5);
	anim7.reset(0,this.game.world.randomY); 
	anim7.body.velocity.x = velocityX;
	anim7.checkWorldBounds = true;
	anim7.outOfBoundsKill = true;
	}}
//genAnim8:function(){
	function genAnim8(){
	for (var i = 0; i < 1; i++) {
	var x = i * 1;
	var velocityX = this.game.rnd.integerInRange(-120, -150);         
	var anim8;
	anim8 = animEvent8.getFirstExists(false);
	if (!anim8) {               
	anim8 = this.game.add.sprite(x, 0, 'animEvent8');
	anim8.scale.x = 2;
	anim8.scale.y = 2;
	anim8.smoothed=false;
	anim8.animations.add("anim8", [],10,true);
	anim8.animations.play("anim8");
	animEvent8.add(anim8);             
	anim8.anchor.setTo(0.5, 0.5);            
	this.game.physics.arcade.enableBody(anim8);
	anim8.enableBody = true;
	}        
	anim8.anchor.setTo(0.5, 0.5);
	anim8.reset(this.game.world.width,TopBorder.position.y+600 + Math.random() * 150); 
	anim8.body.velocity.x = velocityX;
	anim8.checkWorldBounds = true;
	anim8.outOfBoundsKill = true;
	}}
//genAnim9:function(){
	function genAnim9(){
	for (var i = 0; i < 1; i++) {
	var x = i * 1;
	var velocityX = this.game.rnd.integerInRange(120, 150);         
	var anim9;
	anim9 = animEvent9.getFirstExists(false);
	if (!anim9) {               
	anim9 = this.game.add.sprite(x, 0, 'animEvent9');
	anim9.scale.x = 2;
	anim9.scale.y = 2;
	anim9.smoothed=false;
	anim9.animations.add("anim9", [],10,true);
	anim9.animations.play("anim9");
	animEvent9.add(anim9);             
	anim9.anchor.setTo(0.5, 0.5);            
	this.game.physics.arcade.enableBody(anim9);
	anim9.enableBody = true;
	}        
	anim9.anchor.setTo(0.5, 0.5);
	anim9.reset(0,this.game.world.randomY); 
	anim9.body.velocity.x = velocityX;
	anim9.checkWorldBounds = true;
	anim9.outOfBoundsKill = true;
	}}
//genAnim10:function(){
	function genAnim10(){
	for (var i = 0; i < 1; i++) {
	var x = i * 1;
	var velocityX = this.game.rnd.integerInRange(-120, -150);         
	var anim10;
	anim10 = animEvent10.getFirstExists(false);
	if (!anim10) {               
	anim10 = this.game.add.sprite(x, 0, 'animEvent10');
	anim10.scale.x = 2;
	anim10.scale.y = 2;
	anim10.smoothed=false;
	anim10.animations.add("anim10", [],10,true);
	anim10.animations.play("anim10");
	animEvent10.add(anim10);             
	anim10.anchor.setTo(0.5, 0.5);            
	this.game.physics.arcade.enableBody(anim10);
	anim10.enableBody = true;
	}        
	anim10.anchor.setTo(0.5, 0.5);
	anim10.reset(this.game.world.width,TopBorder.position.y+600 + Math.random() * 150); 
	anim10.body.velocity.x = velocityX;
	anim10.checkWorldBounds = true;
	anim10.outOfBoundsKill = true;
	}}
//genAnim11:function(){
	function genAnim11(){
	for (var i = 0; i < 1; i++) {
	var x = i * 1;
	var velocityX = this.game.rnd.integerInRange(-80, -120);         
	var anim11;
	anim11 = animEvent11.getFirstExists(false);
	if (!anim11) {               
	anim11 = this.game.add.sprite(x, 0, 'animEvent11');
	anim11.scale.x = 3;
	anim11.scale.y = 3;
	anim11.smoothed=false;
	anim11.animations.add("anim11", [],10,true);
	anim11.animations.play("anim11");
	animEvent11.add(anim11);             
	anim11.anchor.setTo(0.5, 0.5);            
	this.game.physics.arcade.enableBody(anim11);
	anim11.enableBody = true;
	}        
	anim11.anchor.setTo(0.5, 0.5);
	anim11.reset(this.game.world.width,TopBorder.position.y+600 + Math.random() * 150); 
	anim11.body.velocity.x = velocityX;
	anim11.checkWorldBounds = true;
	anim11.outOfBoundsKill = true;
	}}
//genAnim12:function(){
	function genAnim12(){
	for (var i = 0; i < 1; i++) {
	var x = i * 1;
	var velocityX = this.game.rnd.integerInRange(-120, -150);         
	var anim12;
	anim12 = animEvent12.getFirstExists(false);
	if (!anim12) {               
	anim12 = this.game.add.sprite(x, 0, 'animEvent12');
	anim12.scale.x = 2;
	anim12.scale.y = 2;
	anim12.smoothed=false;
	anim12.animations.add("anim12", [],10,true);
	anim12.animations.play("anim12");
	animEvent12.add(anim12);             
	anim12.anchor.setTo(0.5, 0.5);            
	this.game.physics.arcade.enableBody(anim12);
	anim12.enableBody = true;
	}        
	anim12.anchor.setTo(0.5, 0.5);
	anim12.reset(this.game.world.width,this.game.world.randomY); 
	anim12.body.velocity.x = velocityX;
	anim12.checkWorldBounds = true;
	anim12.outOfBoundsKill = true;
	}}
//genAnim13:function(){
	function genAnim13(){
	for (var i = 0; i < 1; i++) {
	var x = i * 1;
	var velocityX = this.game.rnd.integerInRange(180, 210);         
	var anim13;
	anim13 = animEvent13.getFirstExists(false);
	if (!anim13) {               
	anim13 = this.game.add.sprite(x, 0, 'animEvent13');
	anim13.scale.x = 1.5;
	anim13.scale.y = 1.5;
	anim13.smoothed=false;
	anim13.animations.add("anim13", [],10,true);
	anim13.animations.play("anim13");
	animEvent13.add(anim13);             
	anim13.anchor.setTo(0.5, 0.5);            
	this.game.physics.arcade.enableBody(anim13);
	anim13.enableBody = true;
	}        
	anim13.anchor.setTo(0.5, 0.5);
	anim13.reset(0,this.game.world.randomY); 
	anim13.body.velocity.x = velocityX;
	anim13.checkWorldBounds = true;
	anim13.outOfBoundsKill = true;
}}
	
//move Sonia
		function moveSonia(){
		 //moveSonia: function(){
			this.game.world.bringToTop(sonia);
			mover = this.game.rnd.integerInRange(1, 2);	
			if (mover == 1){		
				soniaFall.play();
				soniaFall.onComplete.add(startRun, this);	
				function startRun(){
					sonia.animations.play('sonia3');
					sonia.body.velocity.x = 120;
				}
			}
			else if (mover == 2) {	
				soniaFallLeft.play();
				soniaFallLeft.onComplete.add(startRunLeft, this);	
				function startRunLeft(){
					sonia.animations.play('sonia5');
					sonia.body.velocity.x = -120;
				}
			}
		}
		
	
	},
	
	
	update: function(){
//Mouse Over turn gray
		//if (grayscale.input.pointerOver()){
		//	grayscale.visible = false;
		//}
	this.game.time.events.loop(500, loopTween, this);
	function loopTween(){
	if (grayscale.alpha == 1){
	tweenAlpha0 = this.game.add.tween(grayscale).to( { alpha: 0 }, 200, Phaser.Easing.Linear.None,true,200);}
	else if (grayscale.alpha ==0){
	tweenAlpha1 = this.game.add.tween(grayscale).to( { alpha: 1 }, 200, Phaser.Easing.Linear.None,true,200);}
	}
		this.game.physics.arcade.collide(sonia, LeftBorder, leftDisplay, null, this);
		this.game.physics.arcade.collide(sonia, RightBorder, rightDisplay, null, this);
		var myVar =this;	
//display Go signs after Sonia 
//leftDisplay: function(){
	function leftDisplay(){
	sonia.kill();
	goL= this.game.add.sprite(0,200,"goL");
	goL.scale.x=4;
	goL.scale.y=4;
	goL.smoothed=false;
	goL.animations.add("goL", [], 5, true);
	goL.animations.play("goL");
	goL.inputEnabled=true;
	goL.events.onInputDown.add(function moveRooms(){
	goL.inputEnabled=false;
	goL.animations.stop();
	setTimeout(function(){
	$('#gameDiv').css({"border":"2px solid black"});
	}, 500);
	myVar.game.camera.fade(0x000000,1000);
	setTimeout( function(){
		myVar.game.state.restart();
		},2000);
	//myVar.game.state.restart();
	})}
//rightDisplay:function(){
//	rightDisplay: function(){
	function rightDisplay(){
	sonia.kill();
	goR= this.game.add.sprite(this.game.world.width-168,200,"goR");
	goR.scale.x=4;
	goR.scale.y=4;
	goR.smoothed=false;
	goR.animations.add("goR", [], 5, true);
	goR.animations.play("goR");
	goR.inputEnabled=true;
	goR.events.onInputDown.add(function moveRooms(){
	goR.animations.stop();
	goR.inputEnabled=false;
	setTimeout(function(){
	$('#gameDiv').css({"border":"2px solid black"});
	}, 500);
	myVar.game.camera.fade(0x000000,1000);
	setTimeout( function(){
		myVar.game.state.restart();
		},2000);
	
	})}
	
	}


}
