dojo.declare("com.nuclearunicorn.game.villageManager", null, {
	kittens: 0,
	maxKittens: 0,
	
	//jobs assigned to kittens
	jobs: [{
	}],
	
	//resource modifiers per tick
	resourceModifiers: {
		"catnip" : 0
	},

	game: null,
	
	constructor: function(game){
		this.game = game;
	},
	
	update: function(){
		
	}
});
