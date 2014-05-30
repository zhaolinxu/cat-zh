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
			{name: "minerals", val: 1000}
		],
		sells:[
			{name: "wood", value: 500, chance: 100, delta: 0.08, seasons:{
				"spring": 0.95,
				"summer": 1.35,
				"autumn": 1.15,
				"winter": 1.05
			}}
		]
	},{
		name: "sharks",
		title: "Sharks",
		attitude: "neutral",
		unlocked: false,
		buys: [
			{name: "iron", val: 100}
		],
		sells:[
			{name: "catnip", value: 50000, chance: 100, delta: 0.15, seasons:{
				"spring": 1.20,
				"summer": 0.95,
				"autumn": 1.15,
				"winter": 1.45
			}}
		]
	},{
		name: "griffins",
		title: "Griffins",
		attitude: "hostile",
		unlocked: false,
		buys: [
			{name: "wood", val: 500}
		],
		sells:[
			{name: "iron", value: 250, chance: 100, delta: 0.12, seasons:{
				"spring": 0.75,
				"summer": 0.95,
				"autumn": 1.35,
				"winter": 0.80
			}}
		]
	},{
		name: "nagas",
		title: "Nagas",
		attitude: "neutral",
		unlocked: false,
		buys: [
			{name: "ivory", val: 500}
		],
		sells:[
			{name: "minerals", value: 1000, chance: 100, delta: 0.18, seasons:{
				"spring": 1.25,
				"summer": 1.05,
				"autumn": 0.65,
				"winter": 0.95
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
			if (!this.races[i].unlocked && this.races[i].name != "nagas"){
				unmetRaces.push(this.races[i]);
			}
		}
		
		if (!unmetRaces.length && this.get("nagas").unlocked){
			return null;
		}
		
		//nagas like highly cultural kittens :3
		if (this.game.resPool.get("culture").value >= 1500){
			var nagas = this.get("nagas");
			nagas.unlocked = true;
			
			return nagas;
		}
		
		var raceId = (Math.floor(Math.random()*unmetRaces.length));
		
		if (unmetRaces[raceId]){	//someone reported a bug there, to be investigated later
			unmetRaces[raceId].unlocked = true;
			return unmetRaces[raceId];
		}
		return null;
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

dojo.declare("com.nuclearunicorn.game.ui.TradeButton", com.nuclearunicorn.game.ui.button, {
	
	race: null,

	constructor: function(opts, game){
		this.race = opts.race;
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
				marginBottom: "5px"
			} }, content);
			
			var buys = race.buys[0];
			dojo.create("div", { 
				innerHTML: "Buys: " + buys.name + " (" + buys.val + ")"
			}, content);
			
			for (var j =0; j< race.sells.length; j++){
				if (race.sells[j].chance == 100){
					var s = race.sells[j];
					var sratio = s.seasons[this.game.calendar.getCurSeason().name];
					//console.log(s.seasons, this.game.calendar.getCurSeason().name, sratio);
					
					var tratio = self.game.bld.getEffect("tradeRatio");
					var val = s.value + s.value * tratio;

					var min = val * sratio - val * sratio * s.delta/2;
					var max = val * sratio + val * sratio * s.delta/2;
					
					
					dojo.create("div", { 
						innerHTML: "Sells: " + s.name + " (" + min.toFixed() + " - " + max.toFixed() + ")",
						style: { marginBottom: "15px"
					}}, content);	
					
				}
			}

			var tradePrices = [{ name: "manpower", val: 50}, { name: "gold", val: 15}];
			tradePrices = tradePrices.concat(race.buys);
			//console.log(tradePrices);
			
			var tradeBtn = new com.nuclearunicorn.game.ui.TradeButton({
				name: "Send caravan",
				description: "Trade some of your stuff for the offered resources. Price may vary from season to season.",
				prices: tradePrices,
				race: race,
				handler: function(btn){
					
					for (var j =0; j< btn.race.sells.length; j++){
						var s = btn.race.sells[j];
						
						var chance = self.rand(100);
						if (chance > s.chance){
							continue;
						}
						
						var sratio = s.seasons[this.game.calendar.getCurSeason().name];
						var min = s.value * sratio - s.value * sratio * s.delta/2;
						
						var amt = min + self.rand(s.value * sratio * s.delta);
						var res = self.game.resPool.get(s.name);
						
						var ratio = self.game.bld.getEffect("tradeRatio");
						amt += amt*ratio;
						
						res.value += amt;
						
						self.game.msg("You've got " + self.game.getDisplayValueExt(amt) + " " + s.name);

					}
					//-------------- 35% to get spice --------------
					if (self.rand(100) < 35){
						var res = self.game.resPool.get("spice");
						var spiceVal = self.rand(50);
						var val = 25 +  spiceVal + spiceVal * self.game.bld.getEffect("tradeRatio");
						
						res.value += val;
						self.game.msg("You've got " + val + " spice");
					}
					
					if (self.rand(100) < 10){
						self.game.resPool.get("blueprint").value += 1;
						self.game.msg("You've got a blueprint!");
					}
					
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
			description: "Discover more civilizations",
			prices: [{ name: "manpower", val: 1000}],
			handler: function(btn){
				var race = btn.game.diplomacy.unlockRandomRace();
				
				if (race){
					self.game.msg("You've found a new civilization!");
				} else {
					self.game.msg("Your explorers failed to find anyone.");
					var res = self.game.resPool.get("manpower");
					res.value += 950;
				}
				
				btn.game.render();
			}
		}, this.game);
		exploreBtn.render(tabContainer);
		this.exploreBtn = exploreBtn;
	},
	
		
	update: function(){
		this.inherited(arguments);
		
		for (var i = 0; i< this.racePanels.length; i++){
			this.racePanels[i].update();
		}
		
		if (this.exploreBtn){
			this.exploreBtn.update();
		}
	},
	
	rand: function(ratio){
		return (Math.floor(Math.random()*ratio));
	}
});
