/**
 * Behold the bringer of light!
 */
dojo.declare("classes.managers.ReligionManager", com.nuclearunicorn.core.TabManager, {

	game: null,

	faith: 0,
	faithRatio : 0,
	tcratio: 0,
	corruption: 0,

	alicornCounter: 0,

	constructor: function(game){
		this.game = game;
		this.registerMetaReligion();
	},

	registerMetaReligion: function() {
		this.registerMeta(this.zigguratUpgrades, { getEffect: function(bld, effectName){
			return bld.effects ? bld.effects[effectName] * bld.val : 0;
		}});

		this.registerMeta(this.transcendenceUpgrades, { getEffect: function(bld, effectName){
			return bld.effects ? bld.effects[effectName] * bld.val : 0;
		}});

		this.registerMeta(this.religionUpgrades, { getEffect : function(upgrade, name){
			if (upgrade.researched && upgrade.effects[name]){
				var ratio = upgrade.upgradable ? upgrade.val : 1;
				return upgrade.effects[name] * ratio;
			}
		}});
	},

	resetState: function(){
		this.faith = 0;
		this.corruption = 0;
		this.faithRatio = 0;
		this.tcratio = 0;

		for (var i = 0; i < this.zigguratUpgrades.length; i++){
			var zu = this.zigguratUpgrades[i];
			zu.val = 0;
			zu.unlocked = zu.defaultUnlocked || false;
		}

		for (i = 0; i < this.religionUpgrades.length; i++){
			var ru = this.religionUpgrades[i];
			ru.val = 0;
			ru.researched = false;
		}

		for (i = 0; i < this.transcendenceUpgrades.length; i++){
			var tu = this.transcendenceUpgrades[i];
			tu.val = 0;
		}
	},

	save: function(saveData){
		saveData.religion = {
			faith: this.faith,
			corruption: this.corruption,
			faithRatio: this.faithRatio,
			tcratio: this.tcratio,
			zu: this.filterMetadata(this.zigguratUpgrades, ["name", "val", "unlocked"]),
			ru: this.filterMetadata(this.religionUpgrades, ["name", "val", "researched"]),
			tu: this.filterMetadata(this.transcendenceUpgrades, ["name", "val"])
		};
	},

	load: function(saveData){
		if (!saveData.religion){
			return;
		}

		this.faith = saveData.religion.faith || 0;
		this.corruption = saveData.religion.corruption || 0;
		this.faithRatio = saveData.religion.faithRatio || 0;
		this.tcratio = saveData.religion.tcratio || 0;

		if (saveData.religion.zu){
			this.loadMetadata(this.zigguratUpgrades, saveData.religion.zu, ["val", "unlocked"], function(loadedElem){
				var prices = dojo.clone(loadedElem.prices);
				for( var k = 0; k < prices.length; k++){
					var price = prices[k];
					for (var j = 0; j < loadedElem.val; j++){
						price.val = price.val * loadedElem.priceRatio;
					}
				}
			});
		}

		if (saveData.religion.tu){
			this.loadMetadata(this.transcendenceUpgrades, saveData.religion.tu, ["val"], function(loadedElem){
				//IDK
			});
		}

		if (saveData.religion.ru){
			this.loadMetadata(this.religionUpgrades, saveData.religion.ru, ["val", "researched"], function(loadedElem){
				// Hack to fix old saves
				if (loadedElem.researched && (loadedElem.val == 0 || loadedElem.val == null)) {
					loadedElem.val = 1;
				}
			});
		}

		this.invalidateCachedEffects();
		this.tclevel = this.getTranscendenceLevel();
	},

	update: function(){
		if (this.game.resPool.get("faith").value > 0){
			this.game.religionTab.visible = true;
		}

		//safe switch for a certain type of pesky bugs with conversion
		if (isNaN(this.faith)){
			this.faith = 0;
		}

		var alicorns = this.game.resPool.get("alicorn");
		if (alicorns.value > 0){
			this.corruption += this.getEffect("corruptionRatio")
                * (this.game.resPool.get("necrocorn").value > 0 ? 0.25 : 1);  //75% penalty

			if (this.game.rand(100) < 25 && this.corruption > 1){
				this.corruption = 0;
				alicorns.value--;
				this.game.resPool.get("necrocorn").value++;
				this.game.msg("Your alicorn was corrupted by the markers!", "important");
			}
		} else {
			this.corruption = 0;
		}

		if (this.game.prestige.getPerk("voidOrder").researched){
			var orderBonus = this.game.calcResourcePerTick("faith") * 0.1;	//10% of faith transfer per priest
			this.faith += orderBonus * (1 + this.getFaithBonus() * 0.25);	//25% of the apocypha bonus
		}

		var apt = this.getEffect("alicornPerTick") || 0;
		var alicorns = this.game.resPool.get("alicorn");

		//enable hidden generation bonus once first AC was unlocked
		if (alicorns.value > 0) {
			this.game.resPool.addRes(alicorns, apt);
		}
	},

	zigguratUpgrades: [{
		name: "unicornTomb",
		label: "Unicorn Tomb",
		description: "Improves your unicorns generation by 5%",
		prices: [
			{ name : "ivory", val: 500 },
			{ name : "tears", val: 5 }
		],
		priceRatio: 1.15,
		effects: {
			"unicornsRatio" : 0.05
		},
		val: 0,
		unlocked: true,
		defaultUnlocked: true,
		unlocks: {
			"zigguratUpgrades": ["ivoryTower"]
		}
	},{
		name: "ivoryTower",
		label: "Ivory Tower",
		description: "Improves your unicorns generation by 10%, unlocks Unicorn Rifts",
		prices: [
			{ name : "ivory", val: 25000 },
			{ name : "tears", val: 25 }
		],
		priceRatio: 1.15,
		effects: {
			"unicornsRatio" : 0.1,
			"riftChance" : 5	//
		},
		val: 0,
		unlocked: false,
		defaultUnlocked: false,
		unlocks: {
			"zigguratUpgrades": ["ivoryCitadel"]
		}
	},{
		name: "ivoryCitadel",
		label: "Ivory Citadel",
		description: "Improves your unicorns generation by 25%, summons Ivory Meteors",
		prices: [
			{ name : "ivory", val: 50000 },
			{ name : "tears", val: 50 }
		],
		priceRatio: 1.15,
		effects: {
			"unicornsRatio" : 0.25,
			"ivoryMeteorChance" : 5
		},
		val: 0,
		unlocked: false,
		defaultUnlocked: false,
		unlocks: {
			"zigguratUpgrades": ["skyPalace"]
		}
	},{
		name: "skyPalace",
		label: "Sky Palace",
		description: "Improves your unicorns generation by 50%. There was a legend of ancient and mysterious beings inhabitings this place long ago.",
		prices: [
			{ name : "ivory", val: 250000 },
			{ name : "tears", val: 500 }
		],
		priceRatio: 1.15,
		effects: {
			"unicornsRatio" : 0.5,
			"alicornChance" : 5,
			"alicornPerTick" : 0.00001,
			"ivoryMeteorRatio" : 0.05
		},
		val: 0,
		unlocked: false,
		defaultUnlocked: false,
		unlocks: {
			"zigguratUpgrades": ["unicornUtopia"]
		}
	},{
		name: "unicornUtopia",
		label: "Unicorn Utopia",
		description: "Improves your unicorns generation by 250%. Increase alicorn summon chance. Improves TC refine ratio by 5%",
		prices: [
			{ name : "ivory", val: 1000000 },
			{ name : "tears", val: 5000 }
		],
		priceRatio: 1.15,
		effects: {
			"unicornsRatio" : 2.5,
			"alicornChance" : 15,
			"alicornPerTick" : 0.000025,
			"ivoryMeteorRatio" : 0.15,
			"tcRefineRatio" : 0.05
		},
		val: 0,
		unlocked: false,
		defaultUnlocked: false,
		unlocks: {
			"zigguratUpgrades": ["sunspire"]
		}
	},{
		name: "sunspire",
		label: "Sunspire",

		//TODO: make SSPIRE make something really interesting
		description: "Improves your unicorns generation by 500%. Increase alicorn summon chance by significant amount. Improves TC refine ratio by 10%",
		prices: [
			{ name : "ivory", val: 1500000 },
			{ name : "tears", val: 25000 }
		],
		priceRatio: 1.15,
		effects: {
			"unicornsRatio" : 5,
			"alicornChance" : 30,
			"alicornPerTick" : 0.00005,
			"tcRefineRatio": 0.1,
			"ivoryMeteorRatio" : 0.5
		},
		val: 0,
		unlocked: false,
		defaultUnlocked: false
	},{
		name: "marker",
		label: "Marker",
		description: "A strange structure made of unknown metal and serving unidentified purpose.",
		prices: [
			{ name : "spice", val: 50000 },
			{ name : "tears", val: 5000 },
			{ name : "unobtainium", val: 2500 },
			{ name : "megalith", val: 750 }
		],
		priceRatio: 1.15,
		effects: {
			"corruptionRatio" : 0.000001
		},
		val: 0,
		unlocked: false
	},{
		name: "unicornGraveyard",
		label: "Unicorn Graveyard",
		description: "Grave of the fireflies.",
		prices: [
			{ name : "necrocorn", val: 5 },
			{ name : "megalith", val: 1000 }
		],
		priceRatio: 1.15,
		effects: {
		},
		val: 0,
		unlocked: false
	},{
		name: "blackPyramid",
		label: "Black Pyramid",
		description: "A dark relic of unspeakable horrors.",
		prices: [
			{ name : "spice", val: 150000 },
			{ name : "sorrow", val: 5 },
			{ name : "unobtainium", val: 5000 },
			{ name : "megalith", val: 2500 }
		],
		priceRatio: 1.15,
		effects: {
		},
		val: 0,
		unlocked: false
	}],

	religionUpgrades:[{
		name: "solarchant",
		label: "Solar Chant",
		description: "Improves your faith generation rate by 10%",
		prices: [
			{ name : "faith", val: 100 }
		],
		faith: 150,	//total faith required to unlock the upgrade
		effects: {
			"faithRatio" : 0.1
		},
		val: 0,
		upgradable: true,
		priceRatio: 2.5,
		researched: false
	},{
		name: "scholasticism",
		label: "Scholasticism",
		description: "Temples will give a bonus to science",
		prices: [
			{ name : "faith", val: 250 }
		],
		faith: 300,
		effects: {
			//none
		},
		upgrades: {
			buildings: ["temple"]
		},
		val: 0,
		upgradable: true,
		priceRatio: 2.5,
		researched: false
	},{
		name: "goldenSpire",
		label: "Golden Spire",
		description: "Temples can store 50% more max faith",
		prices: [
			{ name : "faith", val: 350 },
			{ name : "gold",  val: 150 }
		],
		faith: 500,
		effects: {
			//none
		},
		upgrades: {
			buildings: ["temple"]
		},
		val: 0,
		upgradable: true,
		priceRatio: 2.5,
		researched: false
	},{
		name: "sunAltar",
		label: "Sun Altar",
		description: "Every temple will improve happiness by 0.5%",
		prices: [
			{ name : "faith", val: 500 },
			{ name : "gold",  val: 250 }
		],
		faith: 750,
		effects: {
			//none
		},
		upgrades: {
			buildings: ["temple"]
		},
		val: 0,
		upgradable: true,
		priceRatio: 2.5,
		researched: false
	},{
		name: "stainedGlass",
		label: "Stained Glass",
		description: "Every temple will generate twice as much culture",
		prices: [
			{ name : "faith", val: 500 },
			{ name : "gold",  val: 250 }
		],
		val: 0,
		faith: 750,
		effects: {
			//none
		},
		upgrades: {
			buildings: ["temple"]
		},
		upgradable: true,
		priceRatio: 2.5,
		researched: false
	},{
		name: "solarRevolution",
		label: "Solar Revolution",
		description: "Accumulated faith will give a small boost to resource production.",
		prices: [
			{ name : "faith", val: 750 },
			{ name : "gold",  val: 500 }
		],
		faith: 1000,
		effects: {
			//none
		},
		val: 0,
		researched: false
	},{
		name: "basilica",
		label: "Basilica",
		description: "Temples generate more culture and expand cultural limits",
		prices: [
			{ name : "faith", val: 1250 },
			{ name : "gold",  val: 750 }
		],
		faith: 10000,
		effects: {
			//none
		},
		upgrades: {
			buildings: ["temple"]
		},
		val: 0,
		upgradable: true,
		priceRatio: 2.5,
		researched: false
	},{
		name: "templars",
		label: "Templars",
		description: "Temples have a small impact on the catpower limit",
		prices: [
			{ name : "faith", val: 3500 },
			{ name : "gold",  val: 3000 }
		],
		faith: 75000,
		effects: {
			//none
		},
		upgrades: {
			buildings: ["temple"]
		},
		val: 0,
		upgradable: true,
		priceRatio: 2.5,
		researched: false
	},{
		name: "apocripha",
		label: "Apocrypha",
		description: "Grants the ability to discard accumulated faith to improve effectiveness of praying",
		prices: [
			{ name : "faith", val: 5000 },
			{ name : "gold",  val: 5000 }
		],
		faith: 100000,
		effects: {
			//none
		},
		val: 0,
		researched: false
	},{
		name: "transcendence",
		label: "Transcendence",
		description: "Unlocks additional religion upgrades",
		prices: [
			{ name : "faith", val: 7500 },
			{ name : "gold",  val: 7500 }
		],
		faith: 125000,
		effects: {
			//none
		},
		val: 0,
		researched: false
	}],

	transcendenceUpgrades: [
	{
		name: "blackObelisk",
		label: "Black Obelisk",
		description: "Improves your faith bonus.<br>Every Obelisk will improve your transcendance level bonus by 5%",
		prices: [
			{ name : "relic", val: 100 }
		],
		tier: 1,
		priceRatio: 1.15,
		effects: {},
		val: 0,
		unlocked: true,
		flavor: "TBD" // flavor is TBD but the faith bonus improvement is already done
	},{
		name: "blackNexus",
		label: "Black Nexus",
		description: "Improves the rate you refine time crystals into relics.<br>Every Black Pyramid will improve your Relic Refine ratio by 100%. Every level of Black Nexus will increase this bonus by additional 100%",
		prices: [
			{ name : "relic", val: 5000 }
		],
		tier: 3,
		priceRatio: 1.15,
		effects: {
			"relicRefineRatio" : 1.0
		},
		val: 0,
		unlocked: true,
		flavor: "Eye in the sky."
	},{
		name: "blackCore",
		label: "Black Core",
		description: "Alter and corrupt the laws of the reality on a minor scale. Every level of Black Core increases BLS limit by 1%.",
		prices: [
			{ name : "relic", val: 10000 }
		],
		tier: 5,
		priceRatio: 1.15,
		effects: {
			"blsLimit" : 1
		},
		val: 0,
		unlocked: true,
		flavor: "Built with the bones of kitten sacrifices."
	},{
		name: "singularity",
		label: "Event Horizon",
		description: "Improve global resource limits by 10%",
		prices: [
			{ name : "relic", val: 25000 }
		],
		tier: 7,
		priceRatio: 1.15,
		effects: {
			"tcResourceRatio" : 0.10
		},
		val: 0,
		unlocked: true,
		flavor: "A gateway... To what?"
	},{
		name: "holyGenocide",
		label: "Holy Genocide",
		description: "And tear will not fall down",
		prices: [
			{ name : "relic", val: 100000 },
			{ name : "void", val: 25 }
		],
		tier: 25,
		priceRatio: 1.15,
		effects: {
		},
		val: 0,
		unlocked: true,
		flavor: "We live on a placid island of ignorance in the midst of black seas of infinity, and it was not meant that we should voyage far."
	}
		//Holy Genocide
	],

	getZU: function(name){
		return this.getMeta(name, this.zigguratUpgrades);
	},

	getRU: function(name){
		return this.getMeta(name, this.religionUpgrades);
	},

	getTU: function(name){
		return this.getMeta(name, this.transcendenceUpgrades);
	},

	getEffect: function(name){
		return this.getEffectCached(name);
	},

	getProductionBonus: function(){
		var rate = this.getRU("solarRevolution").researched ? this.game.getTriValue(this.faith, 1000) : 0;
        //Solar Revolution capped to 1000% so it doesn't become game-breaking
        rate = this.game.bld.getHyperbolicEffect(rate, 1000) * (1 + (this.getTranscendenceLevel() * (0.1 + this.getTU("blackObelisk").val * 0.005)));
		return rate;
	},

	getFaithBonus: function(){
		return this.getTriValueReligion(this.faithRatio);
	},

	getTriValueReligion: function(ratio){
		return this.game.getTriValue(ratio, 0.1)*0.1;
	},

	praise: function(){
		var faith = this.game.resPool.get("faith");
		this.faith += faith.value * (1 + this.getFaithBonus()); //starting up from 100% ratio will work surprisingly bad
		faith.value = 0.01;	//have a nice autoclicking
	},

	transcend: function(){

		var religion = this.game.religion;

		if (!religion.getRU("transcendence").researched){
			return;	//:3
		}
		if (!confirm("Are you sure you want to discard your praise bonus ?" +
				"\n\nYou can reach a special transcendence level sacrificing your praise bonus." +
				"\n\nEvery level requires proportionally more faith bonus to be sacrificed." +
				"\n\nThis bonus will stack and carry over through resets." +
				"\n\nCLICKING THIS BUTTON WILL ERASE PART OF YOUR PRAISE'S FAITH BONUS.")){
			return;
		}

		var tclevel = religion.getTranscendenceLevel();
		//Transcend one Level at a time
		var needNextLevel = religion.getTranscendenceRatio(tclevel+1) - religion.getTranscendenceRatio(tclevel);
		if (religion.faithRatio > needNextLevel) {

			religion.faithRatio -= needNextLevel;
			religion.tcratio += needNextLevel;
			religion.tclevel += 1;

			this.game.msg("Closer to the gods");
		} else {
			this.game.msg("Gods bless you");
		}
	},

	getTranscendenceLevel: function(){
		var bonus = this.getTriValueReligion(this.tcratio) * 100;
		bonus = Math.round(Math.log(bonus));
			if (bonus < 0) {
				bonus = 0;
			}
		return bonus;
	},

    getTranscendenceRatio: function(level){
            var bonus = Math.exp(level);
            return (Math.pow(bonus/5+1,2)-1)/80;
    }

});

/**
 * A button for ziggurat upgrade
 */
dojo.declare("com.nuclearunicorn.game.ui.ZigguratBtn", com.nuclearunicorn.game.ui.BuildingBtn, {
	tooltipName: true,
	simplePrices: false,
	hasResourceHover: true,

	getMetadata: function(){
		return this.game.religion.getZU(this.id);
	},

	getBuildingName: function(){
		if (this.getMetadata().name == "marker" && this.getMetadata().val > 0){
			var progress = Math.round((this.game.religion.corruption * 100));
			return this.name + " [" + progress + "%] ";
		}
		return this.name;
	},

	getPrices: function(bldName) {

		 var bld = this.getMetadata();
		 var ratio = bld.priceRatio;

		 var prices = dojo.clone(bld.prices);

		 for (var i = 0; i< bld.val; i++){
			 for( var j = 0; j < prices.length; j++){
				prices[j].val = prices[j].val * ratio;
			 }
		 }
	     return prices;
	 },

	payPrice: function(){
		this.inherited(arguments);
	},

	getSelectedObject: function(){
		return this.getMetadata();
	}
});

/**
 * A button for religion upgrade
 */
dojo.declare("com.nuclearunicorn.game.ui.ReligionBtn", com.nuclearunicorn.game.ui.BuildingBtn, {

	ruCached: null,
	transcendence: null,
	tooltipName: true,
	simplePrices: false,
	hasResourceHover: true,

	constructor: function(opts, game) {
		this.transcendence = this.game.religion.getRU("transcendence");
	},

	getMetadata: function(){
		if (!this.ruCached){
			this.ruCached = this.game.religion.getRU(this.id);
		}
		return this.ruCached;
	},

	hasSellLink: function(){
		return !this.game.opts.hideSell && this.ruCached.upgradable && this.ruCached.val > 1 && this.transcendence.researched;
	},

	getRU: function(){
		return this.getMetadata(this.id);
	},

	getPrices: function(){
		var ratio = this.getRU().priceRatio || 1;
		var prices = dojo.clone(this.ruCached.prices);

		for (var i = 0; i< prices.length; i++){
			prices[i].val = prices[i].val * Math.pow(ratio, this.ruCached.val);
		}

		prices = this.game.village.getEffectLeader("wise", prices);

	    return prices;
	},

	updateVisible: function(){
		var upgrade = this.getMetadata();
		var isVisible = ( this.game.religion.faith >= upgrade.faith );

		this.setVisible(isVisible);
	},

	updateEnabled: function(){
		this.inherited(arguments);

		var upgrade = this.getMetadata();
		if (upgrade.researched && (!upgrade.upgradable || !this.transcendence.researched)){
			this.setEnabled(false);
		} else if (upgrade.researched && upgrade.upgradable && this.transcendence.researched){
			this.setEnabled(this.hasResources());
		}
	},

	getName: function(){
		var upgrade = this.getMetadata();
		if (upgrade.researched && (!upgrade.upgradable || !this.transcendence.researched)){
			return this.name + " (complete)";
		} else if (upgrade.researched && upgrade.upgradable && this.transcendence.researched){	//TODO: cache this too
			return this.name + " (" + upgrade.val + ")";
		}
		return this.name;
	},

	getSelectedObject: function(){
		return this.getMetadata();
	}
});

dojo.declare("classes.ui.TranscendenceBtn", com.nuclearunicorn.game.ui.BuildingBtn, {
	tooltipName: true,
	simplePrices: false,
	hasResourceHover: true,

	getMetadata: function(){
		return this.game.religion.getTU(this.id);
	},

	getPrices: function(bldName) {
		var bld = this.getMetadata();
		var ratio = bld.priceRatio;

		var prices = dojo.clone(bld.prices);

		for (var i = 0; i< bld.val; i++){
			for( var j = 0; j < prices.length; j++){
				prices[j].val = prices[j].val * ratio;
			}
		}
		return prices;
	},

	payPrice: function(){
		this.inherited(arguments);
	},

	getSelectedObject: function(){
		return this.getMetadata();
	},

	updateVisible: function(){
		var tier = this.game.religion.getTranscendenceLevel();
		var upgrade = this.getMetadata();

		var isVisible = ( tier >= upgrade.tier );
		this.setVisible(isVisible);
	},

	getFlavor: function(){
		return this.getMetadata().flavor;
	}
});

dojo.declare("com.nuclearunicorn.game.ui.PraiseBtn", com.nuclearunicorn.game.ui.ButtonModern, {
	getName: function() {
		if (this.game.religion.faithRatio > 0){
			return this.name + " [" + this.game.getDisplayValueExt(this.game.religion.getFaithBonus()*100, true, false, 1) + "%]";
		} else {
			return this.name;
		}
	}
});

dojo.declare("com.nuclearunicorn.game.ui.TranscendBtn", com.nuclearunicorn.game.ui.ButtonModern, {
	getName: function() {
		if (this.game.religion.tclevel > 0){
			return this.name + " [" + this.game.religion.tclevel + "]";
		} else {
			return this.name;
		}
	}
});

dojo.declare("classes.ui.religion.SacrificeBtn", com.nuclearunicorn.game.ui.ButtonModern, {
	x10: null,
	simplePrices: false,
	hasResourceHover: true,

	onClick: function(){
		this.animate();

		if (this.enabled && this.hasResources()){
			this.sacrifice(1);
			this.update();
		}
	},

	/**
	 * Render button links like off/on and sell
	 */
	renderLinks: function(){
		var self = this;

		this.all = this.addLink("all",
			function(){
				this.animate();
				if (this.enabled && this.hasResources()) {
					var prices = this.getPrices();
					this.sacrifice(Math.floor(this.game.resPool.get("unicorns").value / prices[0].val));
					this.update();
				}
			}, false
		);

		this.x10 = this.addLink("x10",
			function(){
				this.animate();
				if (this.enabled && this.hasResources(10)) {
					this.sacrifice(10);
					this.update();
				}
			}, false
		);
	},

	update: function(){
		this.inherited(arguments);

		var prices = this.getPrices();
		var hasUnicorns = (prices[0].val * 10 <= this.game.resPool.get("unicorns").value);

		if (this.x10){
			dojo.setStyle(this.x10.link, "display", hasUnicorns ? "" : "none");
		}
	},

	sacrifice: function(amt){
		var prices = this.getPrices();
		amt = amt || 1;

		var unicornCount = prices[0].val * amt;

		if (unicornCount > this.game.resPool.get("unicorns").value) {
			return;
		}

		var tearCount = this.game.bld.get("ziggurat").val * amt;

		this.game.resPool.get("unicorns").value -= unicornCount;
		this.game.resPool.get("tears").value += tearCount;
		this.game.stats.getStat("unicornsSacrificed").val += unicornCount;

		this.game.msg(this.game.getDisplayValueExt(unicornCount) + " unicorns have been sacrificed. You've got " + this.game.getDisplayValueExt(tearCount) + " unicorn tears!");
	},

	getSelectedObject: function(){
		return {"prices": this.getPrices()};
	}
});


dojo.declare("classes.ui.religion.SacrificeAlicornsBtn", com.nuclearunicorn.game.ui.ButtonModern, {
	x10: null,
	simplePrices: false,
	hasResourceHover: true,

	onClick: function(){
		this.animate();

		if (this.enabled && this.hasResources()){
			this.sacrifice(1);
			this.update();
		}
	},

	/**
	 * Render button links like off/on and sell
	 */
	renderLinks: function(){
		var self = this;

		this.all = this.addLink("all",
			function(){
				this.animate();
				if (this.enabled && this.hasResources()) {
					var prices = this.getPrices();
					this.sacrifice(Math.floor(this.game.resPool.get("alicorn").value / prices[0].val));
					this.update();
				}
			}, false
		);

		this.x10 = this.addLink("x10",
			function(){
				this.animate();
				if (this.enabled && this.hasResources(10)) {
					this.sacrifice(10);
					this.update();
				}
			}, false
		);
	},

	update: function(){
		this.inherited(arguments);

		var prices = this.getPrices();
		var hasAlicorns = (prices[0].val * 10 <= this.game.resPool.get("alicorn").value);

		if (this.x10){
			dojo.setStyle(this.x10.link, "display", hasAlicorns ? "" : "none");
		}
	},

	sacrifice: function(amt){
		var prices = this.getPrices();
		amt = amt || 1;

		var alicornsCount = prices[0].val * amt;

		if (alicornsCount > this.game.resPool.get("alicorn").value) {
			return;
		}

		var tcAmt = amt * (1 + this.game.getEffect("tcRefineRatio"));

		this.game.resPool.get("alicorn").value -= alicornsCount;
		this.game.resPool.get("timeCrystal").value += tcAmt;

		this.game.msg(alicornsCount + " alicorns have been banished. You've got " + tcAmt + " time crystal" + (tcAmt == 1 ? "" : "s") + "!");
	},

	updateVisible: function(){
		this.setVisible(this.game.resPool.get("alicorn").value >= 25);
	},

	getSelectedObject: function(){
		return {"prices": this.getPrices()};
	}
});

dojo.declare("classes.ui.religion.RefineTearsBtn", com.nuclearunicorn.game.ui.ButtonModern, {
	hasResourceHover: true,

	onClick: function(){
		this.animate();

		if (this.enabled && this.hasResources()){

			if (this.game.resPool.get("sorrow").value >= this.game.resPool.get("sorrow").maxValue){
				this.game.msg("Nothing happens");
				return;
			}

			this.payPrice();
			this.refine();
		}
	},

	refine: function(){
		this.game.resPool.get("sorrow").value++; //resPool.update() force below maxValue
	},

	updateVisible: function(){
		this.setVisible(this.game.religion.getZU("blackPyramid").unlocked);
	},

	getSelectedObject: function(){
		return {"prices": this.getPrices()};
	}
});

dojo.declare("classes.ui.religion.RefineTCBtn", com.nuclearunicorn.game.ui.ButtonModern, {
	hasResourceHover: true,

	onClick: function(){
		this.animate();
		if (this.enabled && this.hasResources()){
			this.payPrice();
			this.refine();
		}
	},

	refine: function(){
		var relicsCount = (1 + this.game.religion.getEffect("relicRefineRatio") * this.game.religion.getZU("blackPyramid").val);
		this.game.resPool.get("relic").value += relicsCount;
		this.game.msg(relicsCount + " relics crafted");
	},

	updateVisible: function(){
		this.setVisible(this.game.resPool.get("timeCrystal").value >= 25);
	},

	getSelectedObject: function(){
		return {"prices": this.getPrices()};
	}
});

dojo.declare("classes.ui.CryptotheologyWGT", [mixin.IChildrenAware, mixin.IGameAware], {
	constructor: function(game){
		var self = this;
		dojo.forEach(game.religion.transcendenceUpgrades, function(tu, i){
			var button = new classes.ui.TranscendenceBtn({
				id: 		tu.name,
				name: 		tu.label,
				description: tu.description
			}, game);
			self.addChild(button);
		});
	},

	render: function(container){
		var div = dojo.create("div", null, container);
		var btnsContainer = dojo.create("div", {style:{paddingTop:"20px"}}, div);
		this.inherited(arguments, [btnsContainer]);
	},

	update: function(){
		this.inherited(arguments);
	}
});

dojo.declare("classes.ui.CryptotheologyPanel", com.nuclearunicorn.game.ui.Panel, {
	visible: false,
});

dojo.declare("com.nuclearunicorn.game.ui.tab.ReligionTab", com.nuclearunicorn.game.ui.tab, {

	sacrificeBtn : null,
	sacrificeAlicornsBtn: null,
	faithResetBtn: null,

	zgUpgradeButtons: null,
	rUpgradeButtons: null,

	constructor: function(){
		this.zgUpgradeButtons = [];
		this.rUpgradeButtons = [];

		var ctPanel = new classes.ui.CryptotheologyPanel("Cryptotheology");
		ctPanel.game = this.game;

		this.addChild(ctPanel);
		this.ctPanel = ctPanel;

		var wgt = new classes.ui.CryptotheologyWGT(this.game);
		wgt.setGame(this.game);
		ctPanel.addChild(wgt);
	},

	render: function(container) {
		var self = this;

		this.zgUpgradeButtons = [];
		this.rUpgradeButtons = [];

		var zigguratCount = this.game.bld.get("ziggurat").val;
		if (zigguratCount > 0){
			var zigguratPanel = new com.nuclearunicorn.game.ui.Panel("Ziggurats", this.game.religion);
			var content = zigguratPanel.render(container);

			var sacrificeBtn = new classes.ui.religion.SacrificeBtn({
				name: "Sacrifice Unicorns",
				description: "Return the unicorns to the Unicorn Dimension. You will receive one Unicorn Tear for every ziggurat you have.",
				prices: [{ name: "unicorns", val: 2500}]
			}, this.game);
			sacrificeBtn.render(content);
			this.sacrificeBtn = sacrificeBtn;

			var sacrificeAlicornsBtn = classes.ui.religion.SacrificeAlicornsBtn({
				name: "Sacrifice Alicorns",
				description: "Banish the alicorns to the Bloodmoon. You will receive a Time Crystal.",
				prices: [{ name: "alicorn", val: 25}]
			}, this.game);
			sacrificeAlicornsBtn.setVisible(this.game.resPool.get("alicorn").value >= 25);
			sacrificeAlicornsBtn.render(content);
			this.sacrificeAlicornsBtn = sacrificeAlicornsBtn;

			var refineBtn = new classes.ui.religion.RefineTearsBtn({
				name: "Refine Tears",
				description: "Refine Unicorn Tears into a Black Liquid Sorrow.",
				prices: [{ name: "tears", val: 10000}]
			}, this.game);
			refineBtn.updateVisible();
			refineBtn.render(content);
			this.refineBtn = refineBtn;

			var refineTCBtn = new classes.ui.religion.RefineTCBtn({
				name: "Refine Time Crystals",
				description: "Refine Time Crystals into the elder relics.",
				prices: [{ name: "timeCrystal", val: 25}]
			}, this.game);
			refineTCBtn.updateVisible();
			refineTCBtn.render(content);
			this.refineTCBtn = refineTCBtn;

			//TODO: all the dark miracles there

			var upgrades = this.game.religion.zigguratUpgrades;
			for (var i = 0; i < upgrades.length; i++){
				var upgr = upgrades[i];

				var button = new com.nuclearunicorn.game.ui.ZigguratBtn({
					id: 		upgr.name,
					name: upgr.label,
					description: upgr.description,
					prices: upgr.prices,
					handler: upgr.handler
				}, this.game);

				button.updateVisible();
				button.updateEnabled();

				button.render(content);
				this.zgUpgradeButtons.push(button);
			}
		}	//eo zg upgrades

		//------------------- religion -------------------

		var religionPanel = new com.nuclearunicorn.game.ui.Panel("Order of the Sun", this.game.religion);
		var content = religionPanel.render(container);

		var faithCount = dojo.create("span", { style: { display: "inline-block", marginBottom: "10px"}}, content);
		this.faithCount = faithCount;

		//----------------------- reset -----------------------
		var faithResetBtn = dojo.create("a", { style: { display: "inline-block",  paddingLeft: "10px", marginBottom: "10px", display: "none"},
			href: "#",
			innerHTML: "[Reset]"
		}, content);
		this.faithResetBtn = faithResetBtn;
		dojo.connect(this.faithResetBtn, "onclick", this, "resetFaith");

		var praiseBtn = new com.nuclearunicorn.game.ui.PraiseBtn({
			name: "Praise the sun!",
			description: "Convert all your accumulated faith to the total pool",
			handler: function(btn){
				btn.game.religion.praise();	//sigh, enjoy your automation scripts
			}
		}, this.game);

		praiseBtn.render(content);
		this.praiseBtn = praiseBtn;

		var upgrades = this.game.religion.religionUpgrades;
		for (var i = 0; i < upgrades.length; i++){
			var upgr = upgrades[i];

			var button = new com.nuclearunicorn.game.ui.ReligionBtn({
				id: 		upgr.name,
				name: 		upgr.label,
				description: upgr.description,
				prices: upgr.prices,
				handler: function(btn){
					var upgrade = btn.getMetadata();
					upgrade.researched = true;
					if (upgrade.upgrades){
						this.game.upgrade(upgrade.upgrades);
					}
				}
			}, this.game);

			button.updateVisible();
			button.updateEnabled();

			button.render(content);
			this.rUpgradeButtons.push(button);
		}

		var transcendBtn = new com.nuclearunicorn.game.ui.TranscendBtn({
			name: "Transcend",
			description: "Transcend the mortal limits",
			handler: function(btn){
				this.game.religion.transcend();
			}
		}, this.game);

		transcendBtn.render(content);
		this.transcendBtn = transcendBtn;

		this.inherited(arguments);
		this.update();
	},

	update: function(){
		this.inherited(arguments);

		var religion = this.game.religion;

		if (this.sacrificeBtn){
			this.sacrificeBtn.update();
		}

		if (this.sacrificeAlicornsBtn){
			this.sacrificeAlicornsBtn.update();
		}

		if (this.refineBtn){
			this.refineBtn.update();
		}

		if (this.refineTCBtn){
			this.refineTCBtn.update();
		}

		if (this.praiseBtn){
			this.praiseBtn.update();
		}

		if (this.transcendBtn){
			this.transcendBtn.update();
		}

		if (religion.faith && this.faithCount){
			this.faithCount.innerHTML = "Total faith: " + this.game.getDisplayValueExt(religion.faith);
		} else {
			this.faithCount.innerHTML = "";
		}

		var bonus = religion.getProductionBonus();
		if (bonus != 0) {
			this.faithCount.innerHTML += ( " (+" + this.game.getDisplayValueExt(bonus) + "% bonus)" );
		}

		if (religion.getRU("apocripha").researched){
			dojo.style(this.faithResetBtn, "display", "");
		}

		dojo.forEach(this.zgUpgradeButtons, function(e, i){ e.update(); });
		dojo.forEach(this.rUpgradeButtons,  function(e, i){ e.update(); });

		var hasCT = this.game.science.get("cryptotheology").researched;
		if (hasCT){
			this.ctPanel.setVisible(true);
		}
	},

	resetFaith: function(event){
		event.preventDefault();

		if (!this.game.religion.getRU("apocripha").researched){
			return;	//trust no one
		}

		if (!confirm("Are you sure you want to reset the pool?" +
				"\n\nYou will get +10% to faith conversion per 100K of faith." +
				"\n\nThis bonus will carry over through resets." +
				"\n\nCLICKING THIS BUTTON WILL ERASE PART OF YOUR FAITH BONUS.")){
			return;
		}

		this.resetFaithInternal(1.01);
	},

    resetFaithInternal: function(bonusRatio){
         //100% Bonus per Transcendence Level
         if (this.game.religion.getRU("transcendence").researched) {
	        bonusRatio *= Math.pow((1 + this.game.religion.getTranscendenceLevel()), 2);
         }
        this.game.religion.faithRatio += (this.game.religion.faith/100000) * 0.1 * bonusRatio;
		this.game.religion.faith = 0.01;
    }
});
