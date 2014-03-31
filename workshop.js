dojo.declare("com.nuclearunicorn.game.upgrades.WorkshopManager", null, {
	
	game: null,
	
	upgrades:[{
		name: "mineralAxes",
		title: "Mineral Axes",
		description: "Improved version of a stone axes providing permanent +70% wood production boost",
		effects: {
			"woodRatio" : 0.7
		},
		prices:[
			{ name : "science", val: 100 },
			{ name : "minerals", val: 500 }
		],
		unlocked: true,
		researched: false,
		unlocks: ["ironAxes"],
		handler: function(game){
			//do nothing
		}
	},{
		name: "ironAxes",
		title: "Iron Axes",
		description: "Improved version of a stone axes providing permanent +50% wood production boost",
		effects: {
			"woodRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 200 },
			{ name : "iron", val: 200 },
		],
		unlocked: true,
		researched: false,
		handler: function(game){
			//do nothing
		}
	}],
	
	constructor: function(game){
		this.game = game;
	},
	
	get: function(upgradeName){
		for( var i = 0; i< this.upgrades.length; i++){
			if (this.upgrades[i].name == upgradeName){
				return this.upgrades[i];
			}
		}
		console.error("Failed to get upgrade for id '"+upgradeName+"'");
		return null;
	},
	
	save: function(saveData){
		saveData.workshop = {
			upgrades: this.upgrades
		}
	},
	
	load: function(saveData){
		if (saveData.workshop){
			var techs = saveData.workshop.upgrades;

			
			if (saveData.workshop.upgrades && saveData.workshop.upgrades.length){
				for(var i = 0; i< saveData.workshop.upgrades.length; i++){
					var savedUpgrade = saveData.workshop.upgrades[i];
					
					if (savedUpgrade != null){
						var upgrade = this.game.workshop.get(savedUpgrade.name);
	
						upgrade.unlocked = savedUpgrade.unlocked;
						upgrade.researched = savedUpgrade.researched;
						
						if (upgrade.unlocked && upgrade.handler){
							upgrade.handler(this.game);	//just in case update tech effects
						}
					}
				}
			}
		}
	},
	
		/**
	 * Returns a total effect value per buildings.
	 * 
	 * For example, if you have N buldings giving K effect,
	 * total value will be N*K
	 * 
	 */ 
	getEffect: function(name){
		var totalEffect = 0;
		
		for (var i = 0; i < this.upgrades.length; i++){
			var upgrade = this.upgrades[i];
			var effect = upgrade.effects[name];
			
			if (effect && upgrade.researched){
				totalEffect += effect;
			}
		}
		
		return totalEffect;
	},
});

dojo.declare("com.nuclearunicorn.game.ui.UpgradeButton", com.nuclearunicorn.game.ui.button, {
	upgradeName: null,
	
	constructor: function(opts, game){
		this.upgradeName = opts.upgrade;
	},
	
	getUpgrade: function(){
		return this.getUpgradeByName(this.upgradeName);
	},
	
	getUpgradeByName: function(name){
		return this.game.workshop.get(name);
	},

	updateEnabled: function(){
		this.inherited(arguments);
		
		var upgrade = this.getUpgrade();
		if (upgrade.researched /*|| !tech.unlocked*/){
			this.setEnabled(false);
		}
	},
	
	/*getDescription: function(){
		var upgrade = this.getUpgrade();
		if (!upgrade.researched){
			return this.description;
		} else {
			return this.description + "\n" + "Effect: " + upgrade.effectDesc;
		}
	},*/
	
	getName: function(){
		var upgrade = this.getUpgrade();
		if (!upgrade.researched){
			return this.name;
		} else {
			return this.name + " (complete)";
		}
	},
	
	updateVisible: function(){
		
		var upgrade = this.getUpgrade();
		if (!upgrade.unlocked){
			this.setVisible(false);
		}else{
			this.setVisible(true);
		}
	}
});


dojo.declare("com.nuclearunicorn.game.ui.tab.Workshop", com.nuclearunicorn.game.ui.tab, {

	render: function(tabContainer){
		
		this.inherited(arguments);
	},
	
	constructor: function(tabName, game){
		var self = this;
		this.game = game;

		for (var i = 0; i < this.game.workshop.upgrades.length; i++){
			var uprgade = this.game.workshop.upgrades[i];

			var btn = this.createBtn(uprgade);
			
			if (!uprgade.unlocked || uprgade.researched){
				btn.setEnabled(false);
			}
			this.addButton(btn);
		}
	},
	
	createBtn: function(upgrade){
		var self = this;
		var btn = new com.nuclearunicorn.game.ui.UpgradeButton({
			name : upgrade.title,
			handler: function(btn){
				upgrade.researched = true;

				if (upgrade.unlocks && upgrade.unlocks.length){
					for (var i = 0; i < upgrade.unlocks.length; i++){
						//var newTech = btn.getTechByName(tech.unlocks[i]);
						//newTech.unlocked = true;
					}
				}
				
				if (upgrade.handler){
					upgrade.handler(self.game);
				}
				
			},
			prices: upgrade.prices,
			description: upgrade.description,
			upgrade: upgrade.name
		});
		return btn;
	}
});
