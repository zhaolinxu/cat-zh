dojo.declare("classes.managers.PrestigeManager", com.nuclearunicorn.core.TabManager, {

    perks:[{
		name: "engeneering",
		title: "Engineering",
		description: "Reduce all price ratios by 1%. Unlocks more price upgrades.",
		paragon: 5,
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
		title: "Megalomania",
		description: "Unlocks additional megastructures.",
		paragon: 10,
		unlocked: false,
		researched: false,
		unlocks: {
			"perks": ["blackCodex"],
			"zigguratUpgrades": ["marker", "blackPyramid"]
		}
	},{
		name: "blackCodex",
		title: "Black Codex",
		description: "Unlocks unicorn graveyards.",
		paragon: 25,
		unlocked: false,
		researched: false,
		unlocks: {
			"zigguratUpgrades": ["unicornGraveyard"]
		}
	},{
		name: "goldenRatio",
		title: "Golden Ratio",
		description: "Reduce all price ratios by ~1.618%",
		paragon: 50,
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
		title: "Divine Proportion",
		description: "Reduce all price ratios by 1.7%",
		paragon: 100,
		unlocked: false,
		researched: false,
		handler: function(game){
			game.prestige.getPerk("vitruvianFeline").unlocked = true;
		},
		effects:{
			"priceRatio" : -0.017
		}
	},{
		name: "vitruvianFeline",
		title: "Vitruvian Feline",
		description: "Reduce all price ratios by 2%",
		paragon: 250,
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
		title: "Renaissance",
		description: "Reduce all price ratios by 2.25%",
		paragon: 750,
		unlocked: false,
		researched: false,
		effects:{
			"priceRatio" : -0.0225
		}
	},{
		name: "diplomacy",
		title: "Diplomacy",
		description: "Races will be discovered earlier and with better standing. Unlocks more trade upgrades.",
		paragon: 5,
		unlocked: true,
		defaultUnlocked: true,
		researched: false,
		unlocks: {
			"perks": ["zebraDiplomacy"]
		}
	},{
		name: "zebraDiplomacy",
		title: "Zebra Diplomacy",
		description: "Some zebras hunters will stay in the village.",
		paragon: 50,
		unlocked: false,
		researched: false
	},{
		name: "chronomancy",
		title: "Chronomancy",
		description: "Meteor and star events will happen faster.",
		paragon: 25,
		unlocked: true,
		defaultUnlocked: true,
		researched: false,
		unlocks: {
			"perks": ["anachronomancy", "unicornmancy"]
		}
	},{
		name: "unicornmancy",
		title: "Unicornmancy",
		description: "Unicorn rifts and ivory meteors are more frequent.",
		paragon: 125,
		unlocked: true,
		defaultUnlocked: true,
		researched: false
	},
	{
		name: "anachronomancy",
		title: "Anachronomancy",
		description: "Time crystals and chronophysics will be saved across resets.",
		paragon: 125,
		unlocked: false,
		researched: false
	},{
		name: "carnivals",
		title: "Carnivals",
		description: "Festivals can now stack in duration.",
		paragon: 25,
		unlocked: true,
		defaultUnlocked: true,
		researched: false,
		unlocks: {
			"perks": ["numerology"]
		}
	},{
		name: "willenfluff",
		title: "Venus of Willenfluff",
		description: "Kittens will arrive 75% faster.",
		paragon: 150,
		unlocked: false,
		researched: false,
		handler: function (game) {
		},
		effects: {
			"kittenGrowthRatio": 0.75
		}
     },{
		name: "numerology",
		title: "Numerology",
		description: "Certain years will have special effects.",
		paragon: 50,
		unlocked: false,
		researched: false,
		unlocks: {
			"perks": ["numeromancy", "willenfluff", "voidOrder"]
		}
	},{
		name: "numeromancy",
		title: "Numeromancy",
		description: "Certain years will have extra effects during Festivals.",
		paragon: 250,
		unlocked: false,
		researched: false,
		unlocks: {
			"perks": ["malkuth"]
		}
	},
    //---------------------------------------------------
    {
        name: "malkuth",
        title: "Malkuth",
        description: "Improves paragon effect and scaling by 5%",
        paragon: 500,
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
        title: "Yesod",
        description: "Improves paragon effect and scaling by 5%",
        paragon: 750,
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
        title: "Hod",
        description: "Improves paragon effect and scaling by 5%",
        paragon: 1250,
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
        title: "Netzach",
        description: "Improves paragon effect and scaling by 5%",
        paragon: 1750,
        unlocked: false,
        researched: false,
        effects:{
            "paragonRatio" : 0.05
        },
        handler: function(game){
            //game.prestige.getPerk("netzach").unlocked = true;
        }
    },
		//2500, 5000, 7500, 15000
    //---------------------------------------------------
    {
		name: "voidOrder",
		title: "Order of Void",
		description: "Every priest will now give a minor bonus to faith accumulation.",
		paragon: 75,
		unlocked: false,
		researched: false,
		handler: function(game){
		}
	},{
		name: "adjustmentBureau",
		title: "Adjustment Bureau",
		description: "Unlocks additional game challenges.",
		paragon: 5,
		unlocked: true,
		defaultUnlocked: true,
		researched: false,
		handler: function(game){
		}
	}],

	game: null,

	constructor: function(game){
		this.game = game;
		this.registerMetaPrestige();
	},

	registerMetaPrestige: function() {
		this.registerMeta(this.perks, {
			getEffect: function(perk, effectName){
				return (perk.researched && perk.effects) ? perk.effects[effectName] : 0;
			}
		});
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

		if (saveData.prestige.perks){
			this.loadMetadata(this.perks, saveData.prestige.perks, ["unlocked", "researched"], function(loadedElem){
			});
		}
		for (var i = 0; i< this.perks.length; i++){
			var perk = this.perks[i];
			if (perk.researched){
				this.game.unlock(perk.unlocks);
				if (perk.handler){
					perk.handler(this.game);
				}
			}
		}
	},

	update: function(){

	},

	getEffect: function(name){
		return this.getEffectCached(name);
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
        return 1.0 + this.getEffect("paragonRatio");
    },

	getParagonProductionRatio: function(){
		var paragonRatio = this.game.resPool.get("paragon").value * 0.01 * this.getParagonRatio();
		return this.game.bld.getHyperbolicEffect(paragonRatio, 2 * this.getParagonRatio());
	},

	getParagonStorageRatio: function(){
		return (this.game.resPool.get("paragon").value / 1000) * this.getParagonRatio();	//every 100 paragon will give a 10% bonus to the storage capacity
	}
});

dojo.declare("classes.ui.PrestigeBtn", com.nuclearunicorn.game.ui.BuildingBtn, {

	perk: null,
	hasResourceHover: true,

	constructor: function(opts, game) {
	},

	getMetadata: function(){
		return this.getPerk();
	},

	getPerk: function(){
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
		if (!perk.unlocked || (!perk.researched && !this.game.science.get("metaphysics").researched)){
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
		if (this.enabled && this.game.science.get("metaphysics").researched && this.hasResources()){
			this.payPrice();
			this.game.paragonPoints -= perk.paragon;

			perk.researched = true;
			this.game.unlock(perk.unlocks);

			if (perk.handler){
				perk.handler(this.game);
			}

			this.update();
		}
	},

	getSelectedObject: function(){
		return {"prices": this.getPrices()};
	}
});

dojo.declare("classes.ui.PrestigePanel", com.nuclearunicorn.game.ui.Panel, {

	game: null,

	constructor: function(){
	},

    render: function(container){
		var content = this.inherited(arguments);

		//--------------------------------------------------------------------
		var div = dojo.create("div", { style: { float: "right"}}, content);
		var a = dojo.create("a", {
			id : "burnParagon",
			href: "#",
			innerHTML: "Burn paragon points",
			title: "Discard all paragon points"
		}, div);
		dojo.connect(a, "onclick", this, function(){
			this.game.discardParagon();
		})
		//---------------------------------------------------------------------

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
