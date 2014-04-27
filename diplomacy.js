/**
 * Dimplomacy
 */ 
dojo.declare("com.nuclearunicorn.game.upgrades.DiplomacyManager", null, {
	
	game: null,
	
	races: [{
		name: "lizards",
		title: "Lizards",
		trait: "friendly",	//neutral, friendly, agressive
		unlocked: false
	},{
		name: "sharks",
		title: "Sharks",
		trait: "neutral",
		unlocked: false
	}],

	get: function(raceName){
		for( var i = 0; i< this.races.length; i++){
			if (this.races[i].name == raceName){
				return this.races[i];
			}
		}
		console.error("Failed to get race for id '"+raceName+"'");
		return null;
	},
	
	save: function(saveData){
		saveData.diplomacy = {
			races: this.races
		}
	},
	
	load: function(saveData){
		if (saveData.diplomacy){
			var diplomacy = saveData.diplomacy.races;

			
			if (saveData.diplomacy.races && saveData.diplomacy.upgrades.races){
				for(var i = 0; i< saveData.diplomacy.races.length; i++){
					var savedRace = saveData.diplomacy.races[i];
					
					if (savedRace != null){
						var race = this.game.diplomacy.get(savedRace.name);
	
						race.unlocked = savedRace.unlocked;
					}
				}
			}
		}
	},
	
	unlockRandomRace: function(){
		var unmetRaces = [];
		for (var i = 0; i< this.races.length; i++){
			if (!this.races[i].unlocked){
				unmetRaces.push(this.races[i]);
			}
		}
		
		var raceId = (Math.floor(Math.random()*unmetRaces.length));
		unmetRaces[raceId].unlocked = true;
		
		return unmetRaces[raceId];
	}
});
 

dojo.declare("com.nuclearunicorn.game.ui.tab.Diplomacy", com.nuclearunicorn.game.ui.tab, {
	
	
});
