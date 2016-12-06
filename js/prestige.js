dojo.declare("classes.managers.PrestigeManager", com.nuclearunicorn.core.TabManager, {

    perks:[{
		name: "engeneering",
		label: "Engineering",
		description: "Reduce all price ratios by 1%. Unlocks more price upgrades.",
		prices: [{ name: "paragon", val: 5 }],
		unlocked: true,
		defaultUnlocked: true,
		researched: false,
		unlocks: {
			"perks": ["megalomania", "goldenRatio"]
		},
		effects:{
			"priceRatio" : -0.01
		}
	}, {
		name: "megalomania",
		label: "Megalomania",
		description: "Unlocks additional megastructures.",
		prices: [{ name: "paragon", val: 10 }],
		unlocked: false,
		researched: false,
		unlocks: {
			"perks": ["blackCodex"],
			"zigguratUpgrades": ["marker", "blackPyramid"]
		}
	},{
		name: "blackCodex",
		label: "Black Codex",
		description: "Unlocks unicorn graveyards.",
		prices: [{ name: "paragon", val: 25 }],
		unlocked: false,
		researched: false,
		unlocks: {
			"zigguratUpgrades": ["unicornGraveyard"]
		}
	},{
		name: "goldenRatio",
		label: "Golden Ratio",
		description: "Reduce all price ratios by ~1.618%",
		prices: [{ name: "paragon", val: 50 }],
		unlocked: false,
		researched: false,
		unlocks: {
			"perks": ["divineProportion"]
		},
		effects:{
			"priceRatio" : -(1 + Math.sqrt(5)) / 200	//Calculates the Golden Ratio
		}
	},{
		name: "divineProportion",
		label: "Divine Proportion",
		description: "Reduce all price ratios by 1.7%",
		prices: [{ name: "paragon", val: 100 }],
		unlocked: false,
		researched: false,
		unlocks: {
			"perks": ["vitruvianFeline"]
		},
		effects:{
			"priceRatio" : -0.017
		}
	},{
		name: "vitruvianFeline",
		label: "Vitruvian Feline",
		description: "Reduce all price ratios by 2%",
		prices: [{ name: "paragon", val: 250 }],
		unlocked: false,
		researched: false,
		unlocks: {
			"perks": ["renaissance"]
		},
		effects:{
			"priceRatio" : -0.02
		}
	},{
		name: "renaissance",
		label: "Renaissance",
		description: "Reduce all price ratios by 2.25%",
		prices: [{ name: "paragon", val: 750 }],
		unlocked: false,
		researched: false,
		effects:{
			"priceRatio" : -0.0225
		}
	},{
		name: "diplomacy",
		label: "Diplomacy",
		description: "Races will be discovered earlier and with better standing. Unlocks more trade upgrades.",
		prices: [{ name: "paragon", val: 5 }],
		unlocked: true,
		defaultUnlocked: true,
		researched: false,
		unlocks: {
			"perks": ["zebraDiplomacy"]
		}
	},{
		name: "zebraDiplomacy",
		label: "Zebra Diplomacy",
		description: "Some zebras hunters will stay in the village.",
		prices: [{ name: "paragon", val: 50 }],
		unlocked: false,
		researched: false
	},{
		name: "chronomancy",
		label: "Chronomancy",
		description: "Meteor and star events will happen faster.",
		prices: [{ name: "paragon", val: 25 }],
		unlocked: true,
		defaultUnlocked: true,
		researched: false,
		unlocks: {
			"perks": ["astromancy", "anachronomancy", "unicornmancy"]
		}
	},{
		name: "astromancy",
		label: "Astromancy",
		description: "Star events chance and observatory effectiveness are doubled",
		prices: [{ name: "paragon", val: 50 }],
		unlocked: false,
		researched: false,
		unlocks: {
		}
	},{
		name: "unicornmancy",
		label: "Unicornmancy",
		description: "Unicorn rifts and ivory meteors are more frequent.",
		prices: [{ name: "paragon", val: 125 }],
		unlocked: true,
		defaultUnlocked: true,
		researched: false
	},
	{
		name: "anachronomancy",
		label: "Anachronomancy",
		description: "Time crystals and chronophysics will be saved across resets.",
		prices: [{ name: "paragon", val: 125 }],
		unlocked: false,
		researched: false
	},{
		name: "carnivals",
		label: "Carnivals",
		description: "Festivals can now stack in duration.",
		prices: [{ name: "paragon", val: 25 }],
		unlocked: true,
		defaultUnlocked: true,
		researched: false,
		unlocks: {
			"perks": ["numerology"]
		}
	},{
		name: "willenfluff",
		label: "Venus of Willenfluff",
		description: "Kittens will arrive 75% faster.",
		prices: [{ name: "paragon", val: 150 }],
		unlocked: false,
		researched: false,
		effects: {
			"kittenGrowthRatio": 0.75
		}
     },{
		name: "numerology",
		label: "Numerology",
		description: "Certain years will have special effects.",
		prices: [{ name: "paragon", val: 50 }],
		unlocked: false,
		researched: false,
		unlocks: {
			"perks": ["numeromancy", "willenfluff", "voidOrder"]
		}
	},{
		name: "numeromancy",
		label: "Numeromancy",
		description: "Certain years will have extra effects during Festivals.",
		prices: [{ name: "paragon", val: 250 }],
		unlocked: false,
		researched: false,
		unlocks: {
			"perks": ["malkuth"]
		}
	},
    //---------------------------------------------------
    {
        name: "malkuth",
        label: "Malkuth",
        description: "Improves paragon effect and scaling by 5%",
        prices: [{ name: "paragon", val: 500 }],
        unlocked: false,
        researched: false,
        effects:{
            "paragonRatio" : 0.05
        },
		unlocks: {
			"perks": ["yesod"]
		}
    },{
        name: "yesod",
        label: "Yesod",
        description: "Improves paragon effect and scaling by 5%",
		prices: [{ name: "paragon", val: 750 }],
        unlocked: false,
        researched: false,
        effects:{
            "paragonRatio" : 0.05
        },
		unlocks: {
			"perks": ["hod"]
		}
    },{
        name: "hod",
        label: "Hod",
        description: "Improves paragon effect and scaling by 5%",
        prices: [{ name: "paragon", val: 1250 }],
        unlocked: false,
        researched: false,
        effects:{
            "paragonRatio" : 0.05
        },
		unlocks: {
			"perks": ["netzach"]
		}
    },{
        name: "netzach",
        label: "Netzach",
        description: "Improves paragon effect and scaling by 5%",
        prices: [{ name: "paragon", val: 1750 }],
        unlocked: false,
        researched: false,
        effects:{
            "paragonRatio" : 0.05
        }
    },
		//2500, 5000, 7500, 15000
    //---------------------------------------------------
    {
		name: "voidOrder",
		label: "Order of Void",
		description: "Every priest will now give a minor bonus to faith accumulation.",
		prices: [{ name: "paragon", val: 75 }],
		unlocked: false,
		researched: false
	},{
		name: "adjustmentBureau",
		label: "Adjustment Bureau",
		description: "Unlocks additional game challenges.",
		prices: [{ name: "paragon", val: 5 }],
		unlocked: true,
		defaultUnlocked: true,
		researched: false
	}],

	game: null,

	constructor: function(game){
		this.game = game;
		this.registerMeta("research", this.perks, null);
		this.setEffectsCachedExisting();
	},

	resetState: function(){
		for (var i = 0; i < this.perks.length; i++){
			var perk = this.perks[i];
			perk.unlocked = perk.defaultUnlocked || false;
			perk.researched = false;
		}
	},

	save: function(saveData){
		saveData.prestige = {
			perks: this.filterMetadata(this.perks, ["name", "unlocked", "researched"])
		};
	},

	load: function(saveData){
		if (!saveData.prestige){
			return;
		}

		var self = this;

		this.loadMetadata(this.perks, saveData.prestige.perks);

		for (var i = 0; i< this.perks.length; i++){
			var perk = this.perks[i];
			if (perk.researched){
				this.game.unlock(perk.unlocks);
			}
		}
	},

	update: function(){

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
	},

    getParagonRatio: function(){
        return 1.0 + this.game.getEffect("paragonRatio");
    },

	getBurnedParagonRatio: function(){
		return this.game.getTriValue(this.game.resPool.get("burnedParagon").value, 500);
	},

	getParagonProductionRatio: function(){
		var paragonRatio = this.getParagonRatio();

		var productionRatioParagon = (this.game.resPool.get("paragon").value * 0.010) * paragonRatio;
		productionRatioParagon = this.game.getHyperbolicEffect(productionRatioParagon, 2 * paragonRatio);

		var ratio = this.game.calendar.isDarkFuture() ? 4 : 1;
		var productionRatioBurnedParagon = this.game.resPool.get("burnedParagon").value * 0.010 * paragonRatio;
		productionRatioBurnedParagon = this.game.getHyperbolicEffect(productionRatioBurnedParagon, ratio * paragonRatio);

		return productionRatioParagon + productionRatioBurnedParagon;
	},

	getParagonStorageRatio: function(){
		var paragonRatio = this.getParagonRatio();
		var storageRatio = (this.game.resPool.get("paragon").value / 1000) * paragonRatio; //every 100 paragon will give a 10% bonus to the storage capacity
		if (this.game.calendar.isDarkFuture()) {
			storageRatio += (this.game.resPool.get("burnedParagon").value / 500) * paragonRatio;
		} else {
			storageRatio += (this.game.resPool.get("burnedParagon").value / 2000) * paragonRatio;
		}
		return storageRatio;
	}
});

dojo.declare("classes.ui.PrestigeBtn", com.nuclearunicorn.game.ui.BuildingResearchBtn, {
	metaCached: null, // Call getMetadata

	getMetadata: function(){
		if (!this.metaCached){
			this.metaCached = this.game.prestige.getPerk(this.id);
		}
		return this.metaCached;
	},

	updateVisible: function(){
		var meta = this.getMetadata();
		if (!meta.unlocked || (!meta.researched && !this.game.science.get("metaphysics").researched)){
			this.setVisible(false);
		}else{
			this.setVisible(true);
		}

		if (meta.researched && this.game.science.hideResearched){
			this.setVisible(false);
		}
	},

	onClick: function(){
		if (this.game.science.get("metaphysics").researched) {
			this.inherited(arguments);
		}
	},

});

dojo.declare("classes.ui.BurnParagonBtn", com.nuclearunicorn.game.ui.ButtonModern, {
	updateVisible: function(){
		this.setVisible(this.game.resPool.get("paragon").value > 0);
	}
});

dojo.declare("classes.ui.PrestigePanel", com.nuclearunicorn.game.ui.Panel, {

	game: null,

	constructor: function(){
	},

    render: function(container){
		var content = this.inherited(arguments);

		var self = this;
		//--------------------------------------------------------------------
		var buttonBP = new classes.ui.BurnParagonBtn({
			name : "Burn your paragon",
			description: "Discard all paragon points",
			handler: dojo.hitch(this, function(){
				this.game.discardParagon();
			})
		}, self.game);
		buttonBP.render(content);
		self.addChild(buttonBP);
		//---------------------------------------------------------------------

		dojo.forEach(this.game.prestige.perks, function(perk, i){
			var button = new classes.ui.PrestigeBtn({id: perk.name}, self.game);
			button.render(content);
			self.addChild(button);
		});

	}

});
