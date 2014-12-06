dojo.declare("classes.managers.PrestigeManager", com.nuclearunicorn.core.TabManager, {
    
    upgrades:[{
    }],

	game: null,
		this.game = game;
	},

	//TODO: save certain keys only like in load method below

	save: function(saveData){
		saveData.religion = {
			upgrades: this.upgrades
		}
	},

	load: function(saveData){
		
	},

	update: function(){
	
	},

	getEffect: function(name){
		return this.getEffectCached(name);
	}
});
