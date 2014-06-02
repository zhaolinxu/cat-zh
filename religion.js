/**
 * Behold the bringer of light!
 */ 
dojo.declare("com.nuclearunicorn.game.religion.ReligionManager", com.nuclearunicorn.core.TabManager, {
	
	game: null,
	
	faith: 0,
	
	constructor: function(game){
		this.game = game;
	},
	
	save: function(saveData){
		saveData.religion = {
			faith: this.faith,
			zu: this.zigguratUpgrades
		}
	},
	
	load: function(saveData){
		this.faith = saveData.religion ? saveData.religion.faith : 0;
		if (saveData.religion && saveData.religion.zu){
			this.loadMetadata(this.zigguratUpgrades, saveData.religion.zu, ["val", "unlocked"], function(loadedElem){
				for (var j = 0; j< loadedElem.val; j++){
					for( var k = 0; k < loadedElem.prices.length; k++){
						var price = loadedElem.prices[k];
						price.val = price.val * loadedElem.priceRatio;
					}
				}
			});
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
		description: "Improves your unicorns generation by 10%, other effects TBD",
		prices: [
			{ name : "ivory", val: 5000 },
			{ name : "tears", val: 25 }
		],
		priceRatio: 1.15,
		effects: {
			"unicornsRatio" : 0.1
		},
		val: 0,
		unlocked: true
	}],
	
	getZU: function(name){
		return this.getMeta(name, this.zigguratUpgrades);
	},
	
	getEffect: function(name){
		return this.getMetaEffect(name, this.zigguratUpgrades);
	}

});

dojo.declare("com.nuclearunicorn.game.ui.ZigguratBtn", com.nuclearunicorn.game.ui.BuildingBtn, {
	
	getBuilding: function(){
		return this.game.religion.getZU(this.id);
	}
});

dojo.declare("com.nuclearunicorn.game.ui.tab.ReligionTab", com.nuclearunicorn.game.ui.tab, {
	
	sacrificeBtn : null,
	zgUpgradeButtons: null,
	
	constructor: function(){
		this.zgUpgradeButtons = [];
	},
	
	render : function(container) {
		var zigguratCount = this.game.bld.get("ziggurat").val;
		if (zigguratCount > 0){
			var zigguratPanel = new com.nuclearunicorn.game.ui.Panel("Ziggurats");
			var content = zigguratPanel.render(container);
			
			var sacrificeBtn = new com.nuclearunicorn.game.ui.Button({ 
				name: "Sacrifice Unicorns",
				description: "Return the unicorns to the Unicorn Dimension",
				handler: function(btn){
					btn.game.msg("2500 unicorns sacrificed. You've got a " + zigguratCount + " unicorn tears!");
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
					handler: function(){
					}
				}, this.game);
				
				button.render(content);
				this.zgUpgradeButtons.push(button);
			}
		}
		
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
		
	},
	
	update: function(){
		if (this.sacrificeBtn){
			this.sacrificeBtn.update();
		}
		var faith = this.game.religion.faith;
		if (faith && this.faithCount){
			this.faithCount.innerHTML = "Total faith: " + this.game.religion.faith.toFixed();
		}
		
		for (var i = 0; i< this.zgUpgradeButtons.length; i++){
			this.zgUpgradeButtons[i].update();
		}
	}
});
