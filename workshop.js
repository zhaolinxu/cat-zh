dojo.declare("com.nuclearunicorn.game.upgrades.WorkshopManager", null, {
	
	game: null,
	
	upgrades:[{
		name: "mineralHoes",
		title: "Mineral Hoes",
		description: "Improved hoes providing permanent +50% catnip production boost",
		effects: {
			"catnipRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 100 },
			{ name : "minerals", val: 275 }
		],
		unlocked: true,
		researched: false,
		unlocks: ["ironHoes"],
		handler: function(game){
			//do nothing
		}
	},{
		name: "ironHoes",
		title: "Iron Hoes",
		description: "Improved hoes providing permanent +30% catnip production boost",
		effects: {
			"catnipRatio" : 0.3
		},
		prices:[
			{ name : "science", val: 200 },
			{ name : "iron", val: 25 }
		],
		unlocked: true,
		researched: false,
		unlocks: [],
		handler: function(game){
			//do nothing
		}
	},
	{
		name: "mineralAxes",
		title: "Mineral Axe",
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
		title: "Iron Axe",
		description: "Improved version of axes providing permanent +50% wood production boost",
		effects: {
			"woodRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 200 },
			{ name : "iron", val: 50 },
		],
		unlocked: true,
		researched: false,
		handler: function(game){
			//do nothing
		}
	},{
		name: "stoneBarns",
		title: "Expanded Barns",
		description: "Barns store 75% more wood and iron",
		effects: {
			"barnRatio" : 0.75
		},
		prices:[
			{ name : "science", val: 500 },
			{ name : "wood", val: 1000 },
			{ name : "minerals", val: 750 },
			{ name : "iron", val: 50 },
		],
		unlocked: true,
		researched: false,
		handler: function(game){
			//do nothing
		}
	},{
		name: "reinforcedBarns",
		title: "Reinforced Barns",
		description: "Barns store 80% more wood and iron",
		effects: {
			"barnRatio" : 0.80
		},
		prices:[
			{ name : "science", val: 800 },
			{ name : "beam", val: 35 },
			{ name : "slab", val: 10 },
			{ name : "iron", val: 100 },
		],
		unlocked: true,
		researched: false,
		handler: function(game){
			//do nothing
		}
	},{
		name: "compositeBow",
		title: "Composite Bow",
		description: "Improved version of a bow providing permanent +50% boost to the hunters",
		effects: {
			"manpowerRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 500 },
			{ name : "iron", val: 100 },
			{ name : "wood", val: 200 },
		],
		unlocked: false,
		researched: false,
		handler: function(game){
			//do nothing
		}
	},{
		name: "huntingArmor",
		title: "Hunting Armor",
		description: "Hunters are 4 times as effective",
		effects: {
			"hunterRatio" : 3
		},
		prices:[
			{ name : "science", val: 2000 },
			{ name : "iron", val: 1000 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
			//do nothing
		}
	},{
		name: "advancedRefinement",
		title: "Catnip Enrichment",
		description: "Catnip refines twice as better",
		effects: {
		},
		prices:[
			{ name : "science", val: 500 },
			{ name : "catnip", val: 5000 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
			//do nothing
		}
	},{
		name: "goldOre",
		title: "Gold Ore",
		description: "Small percentage of ore will be smelted to the gold",
		effects: {
		},
		prices:[
			{ name : "minerals", val: 800 },
			{ name : "iron", 	 val: 100 },
			{ name : "science",  val: 1000 }
		],
		unlocked: false,
		researched: false
	}],
	
	crafts:[{
		name: "beam",
		title: "Supp. Beam",
		prices:[
			{name: "wood", val: 100}
		]
		
	},
	{
		name: "slab",
		title: "Slab",
		prices:[
			{name: "minerals", val: 250}
		]
		
	},{
		name: "plate",
		title: "Metal Plate",
		prices:[
			{name: "iron", val: 75}
		]
		
	},{
		name: "leather",
		title: "Leather",
		prices:[
			{name: "furs", val: 50}
		]
		
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
	}
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

dojo.declare("com.nuclearunicorn.game.ui.CraftButton", com.nuclearunicorn.game.ui.button, {
	craftName: null,
	
	constructor: function(opts, game){
		this.craftName = opts.craft;
	}
});

dojo.declare("com.nuclearunicorn.game.ui.tab.Workshop", com.nuclearunicorn.game.ui.tab, {
	
	craftBtns: null,
	
	resTd: null,
	
	constructor: function(tabName, game){
		var self = this;
		this.game = game;
		
		this.craftBtns = [];

	},
	
	render: function(tabContainer){
		//this.inherited(arguments);
		
		for (var i = 0; i < this.game.workshop.upgrades.length; i++){
			var uprgade = this.game.workshop.upgrades[i];

			var btn = this.createBtn(uprgade);
			
			if (!uprgade.unlocked || uprgade.researched){
				btn.setEnabled(false);
			}
			this.addButton(btn);
			btn.render(tabContainer);
		}
		
		//------------------------------------------

		var craftPanel = new com.nuclearunicorn.game.ui.Panel("Crafting");
		var content = craftPanel.render(tabContainer);
		
		var table = dojo.create("table", {}, content);
		var tr = dojo.create("tr", {}, table);
		
		//buttons go there
		var td = dojo.create("td", {}, table);
		
		var self = this;
		var crafts = this.game.workshop.crafts;
		for( var i = 0; i < crafts.length; i++ ){
			var craft =  crafts[i];
			var craftBtn = new com.nuclearunicorn.game.ui.CraftButton({
				name: craft.title,
				craft: craft.name,
				prices: craft.prices,
				handler: function(btn){
					
					var ratio = self.game.bld.getEffect("craftRatio");
					var craftAmt = 1 + 1*ratio;
					
					self.game.resPool.get(btn.craftName).value += craftAmt;
				}
			}, this.game);
			
			craftBtn.render(td);
			
			this.craftBtns.push(craftBtn);
		}
		
		//resources go there
		var td = dojo.create("td", { style: {paddingLeft: "50px"}}, table);
		this.resTd = td;
		this.renderResources(this.resTd);
		
		//----------------
		if (!this.game.science.get("construction").researched){
			craftPanel.setVisible(false);
		}
	},
	
	renderResources: function(container){
		
		dojo.empty(container);
		
		dojo.create("span", { innerHTML: "Stuff:" },container);
		
		var table = dojo.create("table", { style: {
			paddingTop: "20px"
		}}, container);
		
		var resources = this.game.resPool.resources;
		for (var i = 0; i < resources.length; i++){
			var res = resources[i];
			
			if (res.craftable && res.value){
				var tr = dojo.create("tr", {}, table);
				
				var td = dojo.create("td", { innerHTML: res.name + ":" }, tr);
				var td = dojo.create("td", { innerHTML: res.value.toFixed(2) }, tr);
			}
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
	},
	
	update: function(){
		this.inherited(arguments);
		
		for( var i = 0; i< this.craftBtns.length; i++){
			this.craftBtns[i].update();
		}
		
		if (this.resTd){
			this.renderResources(this.resTd);
		}
	}
});
