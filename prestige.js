dojo.declare("classes.managers.PrestigeManager", com.nuclearunicorn.core.TabManager, {
	
	constructor: function(game){
		this.game = game;

		/*this.registerMeta(this.perks, { getEffect: function(meta, effectName){
			if (meta.researched){
				return meta.effects[effectName];
			}
			return 0;
		}});*/
	},
    
    perks:[{
		name: "engeneering",
		title: "Engineering",
		description: "Reduce all price ratios by 1%. Unlocks more price upgrades.",
		paragon: 5,
		unlocked: true,
		researched: false,
		handler: function(game, self){
			game.prestige.getPerk("megalomania").unlocked = true;
			game.prestige.getPerk("goldenRatio").unlocked = true;
		},
		effects:{
			"priceRatio" : -0.01
		}
	},{
		name: "megalomania",
		title: "Megalomania",
		description: "Unlocks additional megastructures. (TBD)",
		paragon: 25,
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
			game.prestige.getPerk("divineProportion").unlocked = true;
		},
		effects:{
			"priceRatio" : -0.02
		}
	},{
		name: "divineProportion",
		title: "Divine Proportion",
		description: "Reduce all price ratios by 3%",
		paragon: 75,
		unlocked: false,
		researched: false,
		handler: function(game, self){
		},
		effects:{
			"priceRatio" : -0.03
		}
	},
	{
		name: "diplomacy",
		title: "Diplomacy",
		description: "Races will be discovered earlier and with better standing. Unlocks more trade upgrades. (TBD)",
		paragon: 5,
		unlocked: true,
		researched: false,
		handler: function(game, self){
			game.prestige.getPerk("zebraDiplomacy").unlocked = true;
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
		description: "Meteor and star events will happen faster. (TBD)",
		paragon: 25,
		unlocked: true,
		researched: false,
		handler: function(game, self){
			game.prestige.getPerk("anachronomancy").unlocked = true;
		}
	},{
		name: "anachronomancy",
		title: "Anachronomancy",
		description: "Time crystals and chronophisics will be saved across resets. (TBD)",
		paragon: 75,
		unlocked: false,
		researched: false,
		handler: function(game, self){
		}
	}],

	game: null,
	
	constructor: function(game){
		this.game = game;
	},

	save: function(saveData){
		saveData.prestige = {
			perks: this.perks
		}
	},

	load: function(saveData){
		if (!saveData.prestige){
			return;
		}

		var self = this;

		if (saveData.prestige.perks){
			this.loadMetadata(this.perks, saveData.prestige.perks, ["unlocked", "researched"], function(loadedElem){
			});
		}
		for (var i = 0; i< this.perks.length; i++){
			if (this.perks[i].handler && this.perks[i].researched){
				this.perks[i].handler(this.game, this.perks[i]);
			}
		}
	},

	update: function(){
	
	},

	getEffect: function(name){
		//return this.getEffectCached(name);
		return this.getMetaEffect(name, { meta: this.perks, provider: {
			getEffect: function(perk, effectName){
				if (!perk.effects || !perk.researched){
					return 0;
				}
				return perk.effects[effectName];
			}
		}});
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
	},
	
	updateEnabled: function(){
		this.inherited(arguments);
		if (this.getPerk().researched){
			this.setEnabled(false);
		}
	},

	onClick: function(){
		this.animate();
		var perk = this.getPerk();
		if (this.enabled && this.hasResources()){
			this.payPrice();
			this.game.paragonPoints -= perk.paragon;
			
			perk.researched = true;
			if (perk.handler){
				perk.handler(this.game, perk);
			}

			this.update();
		}
	},
});

dojo.declare("classes.ui.PrestigePanel", com.nuclearunicorn.game.ui.Panel, {
	
	game: null,
	
	constructor: function(){
	},
	
    render: function(container){
		var content = this.inherited(arguments);
		
		var self = this;
		dojo.forEach(this.game.prestige.perks, function(perk, i){
			var button = new classes.ui.PrestigeBtn({
				id: 		perk.name,
				name: 		perk.title,
				description: perk.description
			}, self.game);
			button.render(content);
			self.addChild(button);
		});
	}
	
});
