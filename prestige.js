dojo.declare("classes.managers.PrestigeManager", com.nuclearunicorn.core.TabManager, {
    
    perks:[{
		name: "engeneering",
		title: "Engineering",
		description: "Reduce all price ratios by 1%. Unlocks more price upgrades.",
		paragon: 5,
		unlocked: true,
		researched: false,
		handler: function(game, self){
		}
	},{
		name: "megalomania",
		title: "Megalomania",
		description: "Unlocks additional megastructures.",
		paragon: 15,
		unlocked: false,
		researched: false,
		handler: function(game, self){
		}
	},{
		name: "goldenRatio",
		title: "Golden Ratio",
		description: "Reduce all price ratios by 2%",
		paragon: 25,
		unlocked: false,
		researched: false,
		handler: function(game, self){
		}
	},{
		name: "divineProportion",
		title: "Divine Proportion",
		description: "Reduce all price ratios by 3%",
		paragon: 75,
		unlocked: false,
		researched: false,
		handler: function(game, self){
		}
	},
	{
		name: "diplomacy",
		title: "Diplomacy",
		description: "Races will be discovered earlier and with better standing. Unlocks more trade upgrades.",
		paragon: 5,
		unlocked: true,
		researched: false,
		handler: function(game, self){
		}
	},{
		name: "zebraDiplomacy",
		title: "Zebra Diplomacy",
		description: "Some zebras hunters will stay in the village.",
		paragon: 25,
		unlocked: false,
		researched: false,
		handler: function(game, self){
		}
	},{
		name: "chronomancy",
		title: "Chronomancy",
		description: "Meteor and star events will happen faster.",
		paragon: 10,
		unlocked: true,
		researched: false,
		handler: function(game, self){
		}
	},{
		name: "anachronomancy",
		title: "Anachronomancy",
		description: "Time crystals and chronophisics will be saved across resets",
		paragon: 25,
		unlocked: false,
		researched: false,
		handler: function(game, self){
		}
	}],

	game: null,
	
	constructor: function(game){
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
	},
	
	getPerk: function(name){
		return this.getMeta(name, this.perks);
	}
});

dojo.declare("classes.ui.PrestigeBtn", com.nuclearunicorn.game.ui.BuildingBtn, {
	
	perk: null,
	
	constructor: function(opts, game) {
	},
	
	getPerk: function(id){
		if (!this.perk){
			this.perk = this.game.prestige.getPerk(this.id);
		}
		return this.perk;
	},
	
	//what a disgrace
	getBuilding: function(){
		return this.getPerk();
	},
	
	getPrices: function(){
		var price = [{ name: "paragon", val: this.getPerk().paragon}];
		return price;
	},
	
	getName: function(){
		var perk = this.getPerk();
		if (perk.researched){
			return perk.title + " (Complete)";
		} else {
			return perk.title;
		}
	}
});

dojo.declare("classes.ui.PrestigePanel", com.nuclearunicorn.game.ui.Panel, {
	
	game: null,
	
	constructor: function(){
	},
	
    render: function(container){
		var content = this.inherited(arguments);
		
		var self = this;
		dojo.forEach(this.game.prestige.perks, function(perk, i){
			
			//console.log("perk:", perk);
			
			var button = new classes.ui.PrestigeBtn({
				id: 		perk.name,
				name: 		perk.title,
				description: perk.description,
				handler: function(btn){
					var perk = btn.getPerk();
					perk.researched = true;

					if (perk.handler){
						perk.handler(btn.game, program);
					}
				}
			}, self.game);
			button.render(content);
			self.addChild(button);
		});
	}
	
});
