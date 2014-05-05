/**
 * Dimplomacy
 */ 
dojo.declare("com.nuclearunicorn.game.upgrades.DiplomacyManager", null, {

	game: null,
	
	races: [{
		name: "lizards",
		title: "Lizards",
		attitude: "friendly",	//neutral, friendly, agressive
		unlocked: false,
		buys: [
			{name: "minerals", value: 1000}
		],
		sells:[
			{name: "wood", value: 500, chance: 100, delta: 0.08, season:{
				"spring": 0.95,
				"summer": 1.35,
				"autamn": 1.15,
				"winter": 1.05
			}}
		]
	},{
		name: "sharks",
		title: "Sharks",
		attitude: "neutral",
		unlocked: false,
		buys: [
			{name: "iron", value: 100}
		],
		sells:[
			{name: "catnip", value: 50000, chance: 100, delta: 0.15, season:{
				"spring": 1.20,
				"summer": 0.95,
				"autamn": 1.15,
				"winter": 1.45
			}}
		]
	},{
		name: "griffins",
		title: "Griffins",
		attitude: "agressive",
		unlocked: false,
		buys: [
			{name: "wood", value: 500}
		],
		sells:[
			{name: "iron", value: 250, chance: 100, delta: 0.12, season:{
				"spring": 0.75,
				"summer": 0.95,
				"autamn": 1.35,
				"winter": 0.80
			}}
		]
	}
	
	
	/*,{
		name: "nagas",
		title: "Nagas",
		attitude: "argessive",
		unlocked: false
	},{
		name: "centaurs",
		title: "Centaurs",
		attitude: "neutral",
		unlocked: false
	},{
		name: "spiders",
		title: "Spiders",
		attitude: "friendly",
		unlocked: false
	},{
		name: "griffins",
		title: "Griffins",
		attitude: "agressive",
		unlocked: false
	}*/],
	
	constructor: function(game){
		this.game = game;
	},

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

			
			if (saveData.diplomacy.races && saveData.diplomacy.races){
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
	
	hasUnlockedRaces: function(){
		for (var i = 0; i< this.races.length; i++){
			if (this.races[i].unlocked){
				return true;
			}
		}
		return false;
	},
	
	unlockRandomRace: function(){
		var unmetRaces = [];
		for (var i = 0; i< this.races.length; i++){
			if (!this.races[i].unlocked){
				unmetRaces.push(this.races[i]);
			}
		}
		
		if (!unmetRaces.length){
			return null;
		}
		var raceId = (Math.floor(Math.random()*unmetRaces.length));
		unmetRaces[raceId].unlocked = true;
		
		return unmetRaces[raceId];
	},
	
	update: function(){
		if (!this.hasUnlockedRaces()){
			
			if (this.game.calendar.year <20){
				return;
			}
			
			var race = this.unlockRandomRace();
			
			this.game.diplomacyTab.visible = true;
			this.game.render();
			
			this.game.msg("An emissary of " + race.title + " comes to your village");
		} 
	}

});
 
 
dojo.declare("com.nuclearunicorn.game.diplomacy.RacePanel", com.nuclearunicorn.game.ui.Panel, {
	tradeBtn: null,
	
	update: function(){
		if (this.tradeBtn){
			this.tradeBtn.update();
		}
	}
});

dojo.declare("com.nuclearunicorn.game.ui.tab.Diplomacy", com.nuclearunicorn.game.ui.tab, {
	
	racePanels: null,
	
	constructor: function(tabName, game){
		var self = this;
		this.game = game;
		
		this.racePanels = [];
	},
	
	render: function(tabContainer){
		this.inherited(arguments);
		var races = this.game.diplomacy.races;
		
		var self = this;
		
		for (var i = 0; i< races.length; i++){
			var race = races[i];
			if (!race.unlocked){
				continue;
			}

			var racePanel = new com.nuclearunicorn.game.diplomacy.RacePanel(race.title);
			var content = racePanel.render(tabContainer);

			//---------- render shit there -------------
			
			dojo.create("div", { innerHTML: "Attitude: " + race.attitude, style: {
				marginBottom: "15px"
			} }, content);
			
			var tradeBtn = new com.nuclearunicorn.game.ui.button({
				name: "Send caravan",
				description: "WARING! NOT IMPLEMENTED YET",
				prices: [{ name: "manpower", val: 50}, { name: "gold", val: 10}, { name:"unobtanium", val: 100}],
				handler: function(btn){
					
					//btn.game.resPool.get("trade").value += 1;
					//grant trade tokens
					
					/*if (self.rand(100) >= 85){
						btn.game.msg("Your caravan has recovered a lost technology");
					}*/
					
				}
			}, this.game);
			tradeBtn.render(content)	//TODO: attach it to the panel and do a lot of update stuff
			racePanel.tradeBtn = tradeBtn;
			
			this.racePanels.push(racePanel);
	
		}
		
		//------------------------------------
		
		dojo.create("div", { style: {
				marginBottom: "15px"
		} }, tabContainer);
			
		var exploreBtn = new com.nuclearunicorn.game.ui.button({
			name: "Send explorers",
			description: "WARING! NOT IMPLEMENTED YET",
			prices: [{ name: "manpower", val: 1000}, { name:"unobtanium", val:250}],
			handler: function(btn){
				btn.game.diplomacy.unlockRandomRace();
			}
		}, this.game);
		exploreBtn.render(tabContainer);
	},
	
		
	update: function(){
		this.inherited(arguments);
		
		for (var i = 0; i< this.racePanels.length; i++){
			this.racePanels[i].update();
		}
	},
	
	rand: function(ratio){
		return (Math.floor(Math.random()*ratio));
	}
});
