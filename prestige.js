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
	},
	{
		name: "megalomania",
		title: "Megalomania",
		description: "Unlocks additional megastructures.",
		paragon: 25,
		unlocked: false,
		researched: false,
		handler: function(game, self){
			game.religion.getZU("marker").unlocked = true;
			game.religion.getZU("blackPyramid").unlocked = true;
		}
	},{
		name: "goldenRatio",
		title: "Golden Ratio",
		description: "Reduce all price ratios by ~1.618%",
		paragon: 50,
		unlocked: false,
		researched: false,
		handler: function(game, self){
			game.prestige.getPerk("divineProportion").unlocked = true;
		},
		effects:{
			"priceRatio" : -(1 + Math.sqrt(5)) / 200	//Calculates the Golden Ratio
		}
	},{
		name: "divineProportion",
		title: "Divine Proportion",
		description: "Reduce all price ratios by 1.75%",
		paragon: 100,
		unlocked: false,
		researched: false,
		handler: function(game, self){
			game.prestige.getPerk("vitruvianFeline").unlocked = true;
		},
		effects:{
			"priceRatio" : -0.0175
		}
	},{
		name: "vitruvianFeline",
		title: "Vitruvian Feline",
		description: "Reduce all price ratios by 2.25%",
		paragon: 250,
		unlocked: false,
		researched: false,
		handler: function(game, self){
			game.prestige.getPerk("renaissance").unlocked = true;
		},
		effects:{
			"priceRatio" : -0.0225
		}
	},{
		name: "renaissance",
		title: "Renaissance",
		description: "Reduce all price ratios by 2.5%",
		paragon: 750,
		unlocked: false,
		researched: false,
		handler: function(game, self){
		},
		effects:{
			"priceRatio" : -0.025
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
			game.prestige.getPerk("zebraDiplomacy").unlocked = true;
		}
	},{
		name: "zebraDiplomacy",
		title: "Zebra Diplomacy",
		description: "Some zebras hunters will stay in the village.(TBD)",
		paragon: 50,
		unlocked: false,
		researched: false,
		handler: function(game, self){
		}
	},{
		name: "chronomancy",
		title: "Chronomancy",
		description: "Meteor and star events will happen faster.",
		paragon: 25,
		unlocked: true,
		researched: false,
		handler: function(game, self){
			game.prestige.getPerk("anachronomancy").unlocked = true;
			game.prestige.getPerk("unicornmancy").unlocked = true;
		}
	},{
		name: "unicornmancy",
		title: "Unicornmancy",
		description: "Unicorn rifts and ivory meteors are more frequent.",
		paragon: 125,
		unlocked: true,
		researched: false,
		handler: function(game, self){
		}
	},
	{
		name: "anachronomancy",
		title: "Anachronomancy",
		description: "Time crystals and chronophisics will be saved across resets.",
		paragon: 125,
		unlocked: false,
		researched: false,
		handler: function(game, self){
		}
	},{
		name: "carnivals",
		title: "Carnivals",
		description: "Festivals can now stack",
		paragon: 25,
		unlocked: true,
		researched: false,
		handler: function(game, self){
			game.prestige.getPerk("numerology").unlocked = true;
		}
	},{
		name: "numerology",
		title: "Numerology",
		description: "Festivals will have special effects depending on year (TBD)",
		paragon: 50,
		unlocked: false,
		researched: false,
		handler: function(game, self){
			game.prestige.getPerk("numeromancy").unlocked = true;
		}
	},{
		name: "numeromancy",
		title: "Numeromancy",
		description: "Certain years will have special effects (TBD)",
		paragon: 500,
		unlocked: false,
		researched: false,
		handler: function(game, self){
			//game.prestige.getPerk("numeromancy").unlocked = true;
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
	},

	getSpentParagon: function(){
		var paragon = 0;
		for (var i = 0; i < this.perks.length; i++){
			var perk = this.perks[i];
			if (perk.researched){
				paragon += perk.paragon || 0;
			}
		}
		return paragon;
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

	updateVisible: function(){
		var perk = this.getPerk();
		if (!perk.unlocked){
			this.setVisible(false);
		}else{
			this.setVisible(true);
		}

		if (perk.researched && this.game.science.hideResearched){
			this.setVisible(false);
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
