/**
 * Behold the bringer of light!
 */ 
dojo.declare("com.nuclearunicorn.game.religion.ReligionManager", com.nuclearunicorn.core.TabManager, {
	
	game: null,
	
	faith: 0,
	
	constructor: function(game){
		this.game = game;
	},
	
	//todo: save certain keys only like in load method below
	
	save: function(saveData){
		saveData.religion = {
			faith: this.faith,
			zu: this.zigguratUpgrades,
			ru: this.religionUpgrades
		}
	},
	
	load: function(saveData){
		this.faith = saveData.religion ? saveData.religion.faith : 0;
		if (!saveData.religion){
			return;
		}
		if (saveData.religion.zu){
			this.loadMetadata(this.zigguratUpgrades, saveData.religion.zu, ["val", "unlocked"], function(loadedElem){
				for (var j = 0; j< loadedElem.val; j++){
					for( var k = 0; k < loadedElem.prices.length; k++){
						var price = loadedElem.prices[k];
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
			{ name : "ivory", val: 5000 },
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
			{ name : "ivory", val: 25000 },
			{ name : "tears", val: 50 }
		],
		priceRatio: 1.15,
		effects: {
			"unicornsRatio" : 0.25,
			"ivoryMeteorChance" : 5
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
		var zeff = this.getMetaEffect(name, this.zigguratUpgrades);
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
	}
});

dojo.declare("com.nuclearunicorn.game.ui.tab.ReligionTab", com.nuclearunicorn.game.ui.tab, {
	
	sacrificeBtn : null,
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
			
			var sacrificeBtn = new com.nuclearunicorn.game.ui.Button({ 
				name: "Sacrifice Unicorns",
				description: "Return the unicorns to the Unicorn Dimension.\nYou will recieve one Unicorn Tear for every ziggurat you have.",
				handler: function(btn){
					btn.game.msg("2500 unicorns sacrificed. You've got " + zigguratCount + " unicorn tears!");
					btn.game.resPool.get("tears").value += 1 * zigguratCount;
				},
				prices: [{ name: "unicorns", val: 2500}]
			}, this.game);
			sacrificeBtn.render(content);
			this.sacrificeBtn = sacrificeBtn;
			
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
		
		var faithCount = dojo.create("span", { style: { display: "block", marginBottom: "10px" }}, content);
		this.faithCount = faithCount;
		
		var praiseBtn = new com.nuclearunicorn.game.ui.Button({ 
			name: "Praise the sun!",
			description: "Convert all your accumulated faith to the total pool",
			handler: function(btn){
				var faith = btn.game.resPool.get("faith");
				btn.game.religion.faith += faith.value;
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

		dojo.forEach(this.zgUpgradeButtons, function(e, i){ e.update(); });
		dojo.forEach(this.rUpgradeButtons,  function(e, i){ e.update(); });
	}
});
