/**
 * Behold the bringer of light!
 */ 
dojo.declare("com.nuclearunicorn.game.religion.ReligionManager", com.nuclearunicorn.core.TabManager, {
	
	game: null,
	
	faith: 0,
	
	faithRatio : 0,
	
	constructor: function(game){
		this.game = game;
	},
	
	//todo: save certain keys only like in load method below
	
	save: function(saveData){
		saveData.religion = {
			faith: this.faith,
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
			this.loadMetadata(this.religionUpgrades, saveData.religion.ru, ["researched"], function(loadedElem){});
		}
	},
	
	update: function(){
		if (this.game.resPool.get("faith").value > 0){
			this.game.religionTab.visible = true;
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
		researched: false
	},{
		name: "scholasticism",
		label: "Scholasticism",
		description: "Temples will give bonus to the science",
		prices: [
			{ name : "faith", val: 250 }
		],
		faith: 300,
		effects: {
			//none
		},
		researched: false
	},{
		name: "goldenSpire",
		label: "Golden Spire",
		description: "Temples can generate 50% more max faith",
		prices: [
			{ name : "faith", val: 350 },
			{ name : "gold",  val: 150 }
		],
		faith: 500,
		effects: {
			//none
		},
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
		researched: false
	},{
		name: "stainedGlass",
		label: "Stained Glass",
		description: "Every temple will generate twice as much culture",
		prices: [
			{ name : "faith", val: 500 },
			{ name : "gold",  val: 250 }
		],
		faith: 750,
		effects: {
			//none
		},
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
		researched: false
	},{
		name: "templars",
		label: "Templars",
		description: "Temples have small impact on the catpower limit",
		prices: [
			{ name : "faith", val: 3500 },
			{ name : "gold",  val: 3000 }
		],
		faith: 75000,
		effects: {
			//none
		},
		researched: false
	},{
		name: "apocripha",
		label: "Apocrypha",
		description: "Grants the ability to discard accumulated faith to improve prays effectiveness",
		prices: [
			{ name : "faith", val: 6000 },
			{ name : "gold",  val: 5000 }
		],
		faith: 100000,
		effects: {
			//none
		},
		researched: false
	}],
	
	getZU: function(name){
		return this.getMeta(name, this.zigguratUpgrades);
	},
	
	getRU: function(name){
		return this.getMeta(name, this.religionUpgrades);
	},
	
	getReligionEffect: function(name){
		var effectTotal = 0;
		dojo.forEach(this.religionUpgrades, function(e, i){
			if (e.researched && e.effects[name]){
				effectTotal += e.effects[name];
			}
		});
		return effectTotal;
	},
	
	getEffect: function(name){
		var zeff = this.getMetaEffect(name, {meta:this.zigguratUpgrades, provider: {
			getEffect: function(bld, effectName){
				return bld.effects[effectName] * bld.val;
			}
		}});
		var reff = this.getReligionEffect(name);

		return zeff+reff;
	},
	
	/*
	 * Get a total production bonus unlocked by a Solar Revolution
	 */ 
	getProductionBonus: function(){
		var stripe = 1000;
		var rate = (Math.sqrt(1+8 * this.faith / stripe)-1)/2;
		
		return rate;
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
	getBuilding: function(){
		return this.game.religion.getRU(this.id);
	},
	
	updateVisible: function(){
		var upgrade = this.getBuilding();
		var isVisible = ( this.game.religion.faith >= upgrade.faith );
		
		this.setVisible(isVisible);
	},
	
	updateEnabled: function(){
		this.inherited(arguments);
		
		var upgrade = this.getBuilding();
		if (upgrade.researched){
			this.setEnabled(false);
		}
	},
	
	getName: function(){
		var upgrade = this.getBuilding();
		if (upgrade.researched){
			var name = this.name;
			return name + " (complete)";
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

dojo.declare("com.nuclearunicorn.game.ui.SacrificeBtn", com.nuclearunicorn.game.ui.Button, {
	x10: null,
	
	afterRender: function(){
		this.inherited(arguments);
		this.renderLinks();
	},
	
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

		this.x10 = this.addLink("x10", 
			function(){
				this.animate();
				
				for (var i = 0; i<10; i++){
					this.payPrice();	//this is so lame
				}
				this.sacrifice(10);
				this.update();
			}, false
		);
		
		var prices = this.getPrices();
		var hasUnicorns = (prices[0].val * 10 <= this.game.resPool.get("unicorns").value);
		
		dojo.setStyle(this.x10.link, "display", hasUnicorns ? "" : "none");
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
		
		var amt = amt || 1;
		var unicornCount = 2500 * amt;
		var zigguratCount = this.game.bld.get("ziggurat").val;
		
		this.game.msg(unicornCount + " unicorns sacrificed. You've got " + zigguratCount * amt + " unicorn tears!");
		this.game.resPool.get("tears").value += 1 * zigguratCount * amt;
	}
});


dojo.declare("com.nuclearunicorn.game.ui.SacrificeAlicornsBtn", com.nuclearunicorn.game.ui.Button, {
	
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

dojo.declare("com.nuclearunicorn.game.ui.tab.ReligionTab", com.nuclearunicorn.game.ui.tab, {
	
	sacrificeBtn : null,
	sacrificeAlicornsBtn: null,
	faithResetBtn: null,
	
	zgUpgradeButtons: null,
	
	constructor: function(){
		this.zgUpgradeButtons = [];
		this.rUpgradeButtons = [];
	},
	
	render : function(container) {
		
		this.zgUpgradeButtons = [];
		this.rUpgradeButtons = [];
		
		var zigguratCount = this.game.bld.get("ziggurat").val;
		if (zigguratCount > 0){
			var zigguratPanel = new com.nuclearunicorn.game.ui.Panel("Ziggurats");
			var content = zigguratPanel.render(container);
			
			var sacrificeBtn = new com.nuclearunicorn.game.ui.SacrificeBtn({ 
				name: "Sacrifice Unicorns",
				description: "Return the unicorns to the Unicorn Dimension.\nYou will recieve one Unicorn Tear for every ziggurat you have.",
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
			
			//todo: all the dark miracles there
			
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
		
		var religionPanel = new com.nuclearunicorn.game.ui.Panel("Order of the Sun");
		var content = religionPanel.render(container);
		
		var faithCount = dojo.create("span", { style: { display: "inline-block", marginBottom: "10px"}}, content);
		this.faithCount = faithCount;
		
		var faithResetBtn = dojo.create("a", { style: { display: "inline-block",  paddingLeft: "10px", marginBottom: "10px", display: "none"},
			href: "#",
			innerHTML: "[Reset]"
		}, content);
		this.faithResetBtn = faithResetBtn;
		dojo.connect(this.faithResetBtn, "onclick", this, "resetFaith");
		
		var praiseBtn = new com.nuclearunicorn.game.ui.Button({ 
			name: "Praise the sun!",
			description: "Convert all your accumulated faith to the total pool",
			handler: function(btn){
				var faith = btn.game.resPool.get("faith");
				btn.game.religion.faith += faith.value + 
					faith.value * btn.game.getTriValue(btn.game.religion.faithRatio, 0.1)*0.1; //starting up from 100% fratio will work surpisingly bad
				faith.value = 0.01;	//have a nice autoclicking
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
		
		var faith = this.game.religion.faith;
		if (faith && this.faithCount){
			this.faithCount.innerHTML = "Total faith: " + religion.faith.toFixed();
		}
		if (religion.getRU("solarRevolution").researched){
			var bonus = religion.getProductionBonus();
			var bonusFixed = Math.floor(bonus);
			var progress = (bonus - bonusFixed) * 100;
			
			this.faithCount.innerHTML += ( " (+" + bonusFixed + "% bonus, " + progress.toFixed() + "% progress)" );
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
