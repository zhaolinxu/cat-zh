/**
 * Behold the bringer of light!
 */
dojo.declare("classes.managers.ReligionManager", com.nuclearunicorn.core.TabManager, {

	game: null,

	faith: 0,

	faithRatio : 0,
	
	corruption: 0,

	constructor: function(game){
		this.game = game;

		this.registerMeta(this.zigguratUpgrades, { getEffect: function(bld, effectName){
			return bld.effects[effectName] * bld.val;
		}});

		this.registerMeta(this.religionUpgrades, { getEffect : function(upgrade, name){
			if (upgrade.researched && upgrade.effects[name]){
				var ratio = upgrade.upgradable ? upgrade.val : 1;
				return upgrade.effects[name] * ratio;
			}
		}});
	},

	//TODO: save certain keys only like in load method below

	save: function(saveData){
		saveData.religion = {
			faith: this.faith,
			corruption: this.corruption,
			faithRatio: this.faithRatio,
			zu: this.zigguratUpgrades,
			ru: this.religionUpgrades
		}
	},

	load: function(saveData){
		if (!saveData.religion){
			return;
		}

		this.faith = saveData.religion.faith || 0;
		this.corruption = saveData.religion.corruption || 0;
		this.faithRatio = saveData.religion.faithRatio || 0;

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
		if (saveData.religion.ru){
			this.loadMetadata(this.religionUpgrades, saveData.religion.ru, ["val", "researched"], function(loadedElem){
				// Hack to fix old saves
				if (loadedElem.researched && (loadedElem.val == 0 || loadedElem.val == null)) {
					loadedElem.val = 1;
				}
			});
		}

		this.invalidateCachedEffects();
	},

	update: function(){
		if (this.game.resPool.get("faith").value > 0){
			this.game.religionTab.visible = true;
		}
		
		var alicorns = this.game.resPool.get("alicorn");
		if (alicorns.value > 0){
			this.corruption += this.getEffect("corruptionRatio");
			
			if (this.game.rand(100) > 25){
				return;
			}
			
			if (this.corruption > 1){
				this.corruption = 0;
				alicorns.value--;
				this.game.resPool.get("necrocorn").value++;
			}
		} else {
			this.corruption = 0;
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
		unlocked: true
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
		unlocked: true
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
		unlocked: true
	},{
		name: "skyPalace",
		label: "Sky Palace",
		description: "Improves your unicorns generation by 50%.\nThere was a legend of ancient and mysterious beings inhabitings this place long ago.",
		prices: [
			{ name : "ivory", val: 250000 },
			{ name : "tears", val: 500 }
		],
		priceRatio: 1.15,
		effects: {
			"unicornsRatio" : 0.5,
			"alicornChance" : 2
		},
		val: 0,
		unlocked: true
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
		val: 0,
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
		description: "Temples are generating more culture and expanding cultural limits",
		prices: [
			{ name : "faith", val: 1250 },
			{ name : "gold",  val: 750 }
		],
		faith: 10000,
		effects: {
			//none
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

	getZU: function(name){
		return this.getMeta(name, this.zigguratUpgrades);
	},

	getRU: function(name){
		return this.getMeta(name, this.religionUpgrades);
	},

	getEffect: function(name){
		return this.getEffectCached(name);
	},

	/*
	 * Get a total production bonus unlocked by a Solar Revolution
	 */
	getProductionBonus: function(){
		var stripe = 1000;
		var rate = (Math.sqrt(1+8 * this.faith / stripe)-1)/2;

		return rate;
	},

	praise: function(){
		var faith = this.game.resPool.get("faith");
		this.faith += faith.value +
			faith.value * this.game.getTriValue(this.faithRatio, 0.1)*0.1; //starting up from 100% ratio will work surprisingly bad
		faith.value = 0.01;	//have a nice autoclicking
	}

});

/**
 * A button for ziggurat upgrade
 */
dojo.declare("com.nuclearunicorn.game.ui.ZigguratBtn", com.nuclearunicorn.game.ui.BuildingBtn, {

	getBuilding: function(){
		return this.game.religion.getZU(this.id);
	},

	getPrices: function(bldName) {

		 var bld = this.getBuilding();
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
		
		//TODO: fix it somehow
		if (this.getBuilding().name == "blackPyramid"){
			this.game.sorrow = this.game.resPool.get("sorrow").value;
			$("#sorrowTooltip").html("BLS: " + this.game.sorrow + "%");
		}
	 },

	 getTooltipHTML: function(btn){

		var tooltip = dojo.create("div", { style: {
			width: "200px",
			minHeight:"50px"
		}}, null);

		dojo.create("div", {
			innerHTML: this.getName(),
			style: {
				textAlign: "center",
				width: "100%",
				borderBottom: "1px solid gray",
				paddingBottom: "4px"
		}}, tooltip);

		dojo.create("div", {
			innerHTML: this.getDescription(),
			style: {
				textAlign: "center",
				width: "100%",
				borderBottom: "1px solid gray",
				paddingBottom: "4px",
				fontSize: "15px",
				color: "gray"
		}}, tooltip);

		this.renderPrices(tooltip, true);	//simple prices

		return tooltip.outerHTML;
	 }
});

/**
 * A button for religion upgrade
 */
dojo.declare("com.nuclearunicorn.game.ui.ReligionBtn", com.nuclearunicorn.game.ui.BuildingBtn, {

	ruCached: null,
	transcendence: null,

	constructor: function(opts, game) {
		this.transcendence = this.game.religion.getRU("transcendence");
	},

	getBuilding: function(){
		if (!this.ruCached){
			this.ruCached = this.game.religion.getRU(this.id);
		}
		return this.ruCached;
	},

	hasSellLink: function(){
		return this.ruCached.upgradable && this.ruCached.val > 1 && this.transcendence.researched;
	},

	getRU: function(){
		return this.getBuilding(this.id);
	},

	getPrices: function(){
		var ratio = this.getRU().priceRatio;
		var prices = dojo.clone(this.ruCached.prices);

		for (var i = 0; i< prices.length; i++){
			prices[i].val = prices[i].val * Math.pow(ratio, this.ruCached.val);
		}
	    return ( this.ruCached.upgradable && this.transcendence && this.transcendence.researched ) ? prices : this.ruCached.prices;
	},

	updateVisible: function(){
		var upgrade = this.getBuilding();
		var isVisible = ( this.game.religion.faith >= upgrade.faith );

		this.setVisible(isVisible);
	},

	updateEnabled: function(){
		this.inherited(arguments);

		var upgrade = this.getBuilding();
		if (upgrade.researched && (!upgrade.upgradable || !this.transcendence.researched)){
			this.setEnabled(false);
		} else if (upgrade.researched && upgrade.upgradable && this.transcendence.researched){
			this.setEnabled(this.hasResources());
		}
	},

	getName: function(){
		var upgrade = this.getBuilding();
		if (upgrade.researched && (!upgrade.upgradable || !this.transcendence.researched)){
			return this.name + " (complete)";
		} else if (upgrade.researched && upgrade.upgradable && this.transcendence.researched){	//TODO: cache this too
			return this.name + " (" + upgrade.val + ")";
		}
		return this.name;
	},

	getTooltipHTML: function(btn){

		var tooltip = dojo.create("div", { style: {
			width: "180px",
			minHeight:"50px"
		}}, null);

		dojo.create("div", {
			innerHTML: this.getName(),
			style: {
				textAlign: "center",
				width: "100%",
				borderBottom: "1px solid gray",
				paddingBottom: "4px"
		}}, tooltip);

		dojo.create("div", {
			innerHTML: this.getDescription(),
			style: {
				textAlign: "center",
				width: "100%",
				borderBottom: "1px solid gray",
				paddingBottom: "4px",
				fontSize: "15px",
				color: "gray"
		}}, tooltip);

		this.renderPrices(tooltip, true);	//use simple prices

		return tooltip.outerHTML;
	 }
});

dojo.declare("com.nuclearunicorn.game.ui.SacrificeBtn", com.nuclearunicorn.game.ui.ButtonModern, {
	x10: null,

	onClick: function(){
		this.animate();

		if (this.enabled && this.hasResources()){
			this.payPrice();
			this.sacrifice(1);
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
				
				var amt = Math.floor(self.game.resPool.get("unicorns").value / prices[0].val);
				self.game.resPool.get("unicorns").value -= amt * prices[0].val;
				
				this.sacrifice(amt);
				this.update();
			}, false
		);
		
		this.x10 = this.addLink("x10",
			function(){
				this.animate();
				
				self.game.resPool.get("unicorns").value -= 10 * prices[0].val;
				
				this.sacrifice(10);
				this.update();
			}, false
		);

		var prices = this.getPrices();
		var hasUnicorns = (prices[0].val * 10 <= this.game.resPool.get("unicorns").value);

		dojo.setStyle(this.x10.link, "display", hasUnicorns ? "" : "none");
		dojo.setStyle(this.all.link, "display", hasUnicorns ? "" : "none");
	},

	update: function(){
		this.inherited(arguments);

		var prices = this.getPrices();
		var hasUnicorns = (prices[0].val * 10 <= this.game.resPool.get("unicorns").value);

		if (this.x10){
			dojo.setStyle(this.x10.link, "display", hasUnicorns ? "" : "none");
		}
		if (this.all){
			dojo.setStyle(this.all.link, "display", hasUnicorns ? "" : "none");
		}
	},

	sacrifice: function(amt){

		var amt = amt || 1;
		var unicornCount = 2500 * amt;
		var zigguratCount = this.game.bld.get("ziggurat").val;

		this.game.msg(unicornCount + " unicorns sacrificed. You've got " + zigguratCount * amt + " unicorn tears!");
		this.game.resPool.get("tears").value += 1 * zigguratCount * amt;
	}
});


dojo.declare("com.nuclearunicorn.game.ui.SacrificeAlicornsBtn", com.nuclearunicorn.game.ui.ButtonModern, {

	onClick: function(){
		this.animate();

		if (this.enabled && this.hasResources()){
			this.payPrice();
			this.sacrifice(1);
		}
	},

	sacrifice: function(amt){
		var amt = amt || 1;
		var alicornsCount = 25 * amt;

		this.game.msg(alicornsCount + " alicorns banished. You've got " + amt + " time crystals!");
		this.game.resPool.get("timeCrystal").value += amt;
	},

	updateVisible: function(){
		this.setVisible(this.game.resPool.get("alicorn").value >= 25);
	}
});

dojo.declare("com.nuclearunicorn.game.ui.RefineTearsBtn", com.nuclearunicorn.game.ui.ButtonModern, {

	onClick: function(){
		this.animate();

		if (this.enabled && this.hasResources()){
			
			if (this.game.sorrow >= this.game.nerfs){
				this.game.msg("Nothing happens");
				return;
			}
			
			this.payPrice();
			this.refine();
		}
	},

	refine: function(){
		if (this.game.sorrow < this.game.nerfs){
			this.game.sorrow++;
			this.game.resPool.get("sorrow").value = this.game.sorrow;
			$("#sorrowTooltip").html("BLS: " + this.game.sorrow + "%");
		}
	},

	updateVisible: function(){
		this.setVisible(this.game.religion.getZU("blackPyramid").unlocked);
	}
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
	},

	render : function(container) {

		this.zgUpgradeButtons = [];
		this.rUpgradeButtons = [];

		var zigguratCount = this.game.bld.get("ziggurat").val;
		if (zigguratCount > 0){
			var zigguratPanel = new com.nuclearunicorn.game.ui.Panel("Ziggurats", this.game.religion);
			var content = zigguratPanel.render(container);

			var sacrificeBtn = new com.nuclearunicorn.game.ui.SacrificeBtn({
				name: "Sacrifice Unicorns",
				description: "Return the unicorns to the Unicorn Dimension.\nYou will receive one Unicorn Tear for every ziggurat you have.",
				prices: [{ name: "unicorns", val: 2500}]
			}, this.game);
			sacrificeBtn.render(content);
			this.sacrificeBtn = sacrificeBtn;

			var sacrificeAlicornsBtn = new com.nuclearunicorn.game.ui.SacrificeAlicornsBtn({
				name: "Sacrifice Alicorns",
				description: "Banish the alicorns to the Bloodmoon.\nYou will recieve a Time Crystal.",
				prices: [{ name: "alicorn", val: 25}]
			}, this.game);
			sacrificeAlicornsBtn.setVisible(this.game.resPool.get("alicorn").value >= 25);
			sacrificeAlicornsBtn.render(content);
			this.sacrificeAlicornsBtn = sacrificeAlicornsBtn;
			
			var refineBtn = new com.nuclearunicorn.game.ui.RefineTearsBtn({
				name: "Refine Tears",
				description: "Refine Unicorn Tears into a Black Liquid Sorrow.",
				prices: [{ name: "tears", val: 10000}]
			}, this.game);
			refineBtn.updateVisible();
			refineBtn.render(content);
			this.refineBtn = refineBtn; 
			
			
			
			
			

			//TODO: all the dark miracles there

			var upgrades = this.game.religion.zigguratUpgrades;
			for (var i = 0; i < upgrades.length; i++){
				var upgr = upgrades[i];

				var button = new com.nuclearunicorn.game.ui.ZigguratBtn({
					id: 		upgr.name,
					name: upgr.label,
					description: upgr.description,
					prices: upgr.prices,
					handler: function(btn){
					}
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

		var faithResetBtn = dojo.create("a", { style: { display: "inline-block",  paddingLeft: "10px", marginBottom: "10px", display: "none"},
			href: "#",
			innerHTML: "[Reset]"
		}, content);
		this.faithResetBtn = faithResetBtn;
		dojo.connect(this.faithResetBtn, "onclick", this, "resetFaith");

		var praiseBtn = new com.nuclearunicorn.game.ui.ButtonModern({
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
					btn.getBuilding().researched = true;
				}
			}, this.game);

			button.updateVisible();
			button.updateEnabled();

			button.render(content);
			this.rUpgradeButtons.push(button);
		}
	},

	update: function(){

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

		var faith = this.game.religion.faith;
		if (faith && this.faithCount){
			this.faithCount.innerHTML = "Total faith: " + religion.faith.toFixed();
		}
		if (religion.getRU("solarRevolution").researched){
			var bonus = religion.getProductionBonus();

			this.faithCount.innerHTML += ( " (+" + bonus.toFixed(2) + "% bonus)" );
		}

		if (religion.getRU("apocripha").researched){
			dojo.style(this.faithResetBtn, "display", "");

			var ratio = this.game.getTriValue(this.game.religion.faithRatio, 0.1)*0.1;
			this.faithCount.innerHTML += " [+" + (ratio*100).toFixed() + "%]";
		}

		dojo.forEach(this.zgUpgradeButtons, function(e, i){ e.update(); });
		dojo.forEach(this.rUpgradeButtons,  function(e, i){ e.update(); });
	},

	resetFaith: function(event){

		event.preventDefault()

		if (!this.game.religion.getRU("apocripha").researched){
			return;	//trust no one
		}

		if (!confirm("Are you sure you want to reset the pool? You will get +10% to faith conversion per 100K of faith.\n This bonus will carry over through resets.")){
			return;
		}

		this.game.religion.faithRatio += (this.game.religion.faith/100000) * 0.1;
		this.game.religion.faith = 0.01;
	}
});
