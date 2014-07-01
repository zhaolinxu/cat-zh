/**
 * Dimplomacy
 */ 
dojo.declare("com.nuclearunicorn.game.upgrades.DiplomacyManager", null, {

	game: null,
	
	races: [{
		name: "lizards",
		title: "Lizards",
		attitude: "friendly",	//neutral, friendly, agressive
		standing: 0.25,			//chance of trade success, works differently based on attitude
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
			{name: "catnip", value: 35000, chance: 100, delta: 0.15, seasons:{
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
		standing: 0.85,
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
		hidden: true,
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
	},{
		name: "zebras",
		hidden: true,
		title: "Zebras",
		attitude: "hostile",
		standing: 0.7,			//evil little bastards
		unlocked: false,
		buys: [
			{name: "slab", val: 50}
		],
		sells:[
			{name: "iron", value: 300, chance: 100, delta: 0.08, seasons:{
				"spring": 1.00,
				"summer": 1.15,
				"autumn": 0.90,
				"winter": 0.80
			}},
			{name: "plate", value: 2, chance: 65, delta: 0.25, seasons:{
				"spring": 1.05,
				"summer": 0.85,
				"autumn": 1.05,
				"winter": 1.25
			}},
			{name: "titanium", value: 1, chance: 0, delta: 0, seasons:{
				"spring": 1,
				"summer": 1,
				"autumn": 1,
				"winter": 1
			}}
		]
	},

	/*{
		name: "centaurs",
		title: "Centaurs",
		attitude: "neutral",
		unlocked: false
	},{
		name: "spiders",
		title: "Spiders",
		attitude: "friendly",
		unlocked: false
	}*/
	],
	
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
		var hasLockedHiddenRaces = false;
		
		for (var i = 0; i< this.races.length; i++){
			if (!this.races[i].unlocked ){
				if (!this.races[i].hidden){
					unmetRaces.push(this.races[i]);
				}else{
					hasLockedHiddenRaces = true;
				}
			}
		}
		
		if (!unmetRaces.length && !hasLockedHiddenRaces){
			return null;
		}
		
		//nagas like highly cultural kittens :3
		var nagas = this.get("nagas");
		if (!nagas.unlocked && this.game.resPool.get("culture").value >= 1500){	
			nagas.unlocked = true;
			return nagas;
		}
		
		var zebras = this.get("zebras");
		if (!zebras.unlocked && this.game.resPool.get("ship").value >= 1){
			zebras.unlocked = true;	
			this.game.workshop.get("caravanserai").unlocked = true;
			return zebras;
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
			
			this.game.msg("An emissary of " + race.title + " comes to your village", "notice");
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

dojo.declare("com.nuclearunicorn.game.ui.TradeButton", com.nuclearunicorn.game.ui.Button, {
	
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
		
		this.buttons = [];
		this.racePanels = [];
		
		var self = this;
		
		for (var i = 0; i< races.length; i++){
			var race = races[i];
			if (!race.unlocked){
				continue;
			}

			var racePanel = new com.nuclearunicorn.game.diplomacy.RacePanel(race.title);
			var content = racePanel.render(tabContainer);

			//---------- render stuff there -------------
			
			dojo.create("div", { innerHTML: "Attitude: " + race.attitude, style: {
				marginBottom: "5px"
			} }, content);
			
			var buys = race.buys[0];
			dojo.create("div", { 
				innerHTML: "<span style='color: #01A9DB'>Buys: </span>" + buys.name + " (" + buys.val + ")"
			}, content);
			
			for (var j =0; j< race.sells.length; j++){
				//if (race.sells[j].chance == 100){
					var s = race.sells[j];
					var sratio = s.seasons[this.game.calendar.getCurSeason().name];
					
					var tratio = self.game.bld.getEffect("tradeRatio");
					var val = s.value + s.value * tratio;

					var min = val * sratio - val * sratio * s.delta/2;
					var max = val * sratio + val * sratio * s.delta/2;
					
					var prefix = ( j == 0) ? "<span style='color: green'>Sells: </span>" : "";
					var div = dojo.create("div", { innerHTML: prefix + s.name + " (" + min.toFixed() + " - " + max.toFixed() + ")"}, content);	
					if (j == (race.sells.length - 1)){
						dojo.style(div, "marginBottom", "15px");
					}
					
				//}
			}

			var tradePrices = [{ name: "manpower", val: 50}, { name: "gold", val: 15}];
			tradePrices = tradePrices.concat(race.buys);
			
			var tradeBtn = new com.nuclearunicorn.game.ui.TradeButton({
				name: "Send caravan",
				description: "Trade some of your stuff for the offered resources. Price may vary from season to season.\nYou also have a small chance of getting rare resources.",
				prices: tradePrices,
				race: race,
				handler: dojo.partial(
				function(race, btn){
					
					var tradeRatioAttitude = 0;
					
					var attitudeChance = btn.game.rand(100);
					var standingRatio = btn.game.bld.getEffect("standingRatio");
					standingRatio = standingRatio ? standingRatio : 0;
					
					if (race.attitude == "hostile" && btn.game.rand(100) - standingRatio >= race.standing * 100){	//the less you roll the better
						btn.game.msg( race.title + " hate you for no reason");
						return;
					}
					
					if (race.attitude == "friendly" && btn.game.rand(100) - standingRatio/2 <= race.standing * 100){	//confusing part, low standing is ok for friendly races
						btn.game.msg( race.title + " think your kittens are adorable");
						tradeRatioAttitude = 0.25;
					}
					
					for (var j =0; j< race.sells.length; j++){
						var s = race.sells[j];
						
						var chance = btn.game.rand(100);
						if (chance >= s.chance){
							continue;
						}
						
						var sratio = s.seasons[btn.game.calendar.getCurSeason().name];
						var min = s.value * sratio - s.value * sratio * s.delta/2;
						
						var amt = min + btn.game.rand(s.value * sratio * s.delta);
						//var res = self.game.resPool.get(s.name);
						
						var ratio = btn.game.bld.getEffect("tradeRatio");
						amt += amt*ratio;
						
						//res.value += (amt + amt*tradeRatioAttitude);
						btn.game.resPool.addResAmt(s.name, (amt + amt*tradeRatioAttitude));
						
						btn.game.msg("You've got " + btn.game.getDisplayValueExt(amt + amt*tradeRatioAttitude) + " " + s.name);

					}
					//-------------------- 35% chance to get spice ------------------
					if (btn.game.rand(100) < 35){
						var res = btn.game.resPool.get("spice");
						var spiceVal = btn.game.rand(50);
						var val = 25 +  spiceVal + spiceVal * btn.game.bld.getEffect("tradeRatio");
						
						res.value += val;
						btn.game.msg("You've got " + btn.game.getDisplayValueExt(val) + " spice");
					}
					
					//-------------- 10% change to get blueprint ---------------
					
					if (btn.game.rand(100) < 10){
						btn.game.resPool.get("blueprint").value += 1;
						btn.game.msg("You've got a blueprint!", "notice");
					}
					
					//-------------- 15% change to get titanium  ---------------
					
					var shipVal = btn.game.resPool.get("ship").value;
					var shipRate = shipVal * 0.35;		//0.35% per ship to get titanum	
					
					if ( self.rand(100) < ( 15 + shipRate ) && race.name == "zebras" ){
						
						var titaniumAmt = 1.5;
						titaniumAmt += titaniumAmt * ( shipVal / 100 ) * 2;	//2% more titanium per ship
						
						//self.game.resPool.get("titanium").value += titaniumAmt;
						btn.game.resPool.addResAmt("titanium", titaniumAmt);
						
						btn.game.msg("You've got " + btn.game.getDisplayValueExt(titaniumAmt) + " titanium!", "notice");
					}
					
				}, race )	//eo partial

			}, this.game);
			tradeBtn.render(content)	//TODO: attach it to the panel and do a lot of update stuff
			racePanel.tradeBtn = tradeBtn;
			
			this.racePanels.push(racePanel);
	
		}
		
		//------------------------------------
		
		dojo.create("div", { style: {
				marginBottom: "15px"
		} }, tabContainer);
			
		var exploreBtn = new com.nuclearunicorn.game.ui.Button({
			name: "Send explorers",
			description: "Discover more civilizations",
			prices: [{ name: "manpower", val: 1000}],
			handler: function(btn){
				var race = btn.game.diplomacy.unlockRandomRace();
				
				if (race){
					btn.game.msg("You've found a new civilization!", "notice");
				} else {
					btn.game.msg("Your explorers failed to find anyone.");
					var res = btn.game.resPool.get("manpower");
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
