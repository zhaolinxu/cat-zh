dojo.declare("com.nuclearunicorn.game.science.Achievements", null, {
	game: null,
	
	achievements: [
	{
		name: "unicornConspiracy",
		title: "Unicorn Conspiracy",
		condition: function(){
			
		},
		unlocked: false
	}],
	
	constructor: function(game){
		this.game = game;
	},
	
	update: function(){
		for (var i = 0; i< this.achievements.length; i++){
			var ach = this.achievements[i];
			
			if (dojo.hitch(this, ach.condition)()){
				ach.unlocked = true;
			}
		}
	}
});

dojo.declare("com.nuclearunicorn.game.ui.tab.AchTab", com.nuclearunicorn.game.ui.tab, {
	
});
	
