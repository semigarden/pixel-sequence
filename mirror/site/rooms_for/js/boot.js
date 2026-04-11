var boot = function(game){
};
  
boot.prototype = {
	preload: function(){
	},
  	create: function(){
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;	
		this.game.state.start("preload");
	}
}