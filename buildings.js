dojo.declare("com.nuclearunicorn.game.buildings.BuildingsManager", null, {
	
	game: null,
	
	constructor: function(game){
		this.game = game;
	},
	
	buildingGroups: [{
		name: "food",
		title: "Food Production",
		buildings: ["field","pasture","aqueduct"]
	},{
		name: "population",
		title: "Population",
		buildings: ["hut", "logHouse"]
	},{
		name: "science",
		title: "Science",
		buildings: ["library", "academy"]
	},{
		name: "resource",
		title: "Resoruces",
		buildings: ["barn", "warehouse", "mine", "smelter", "lumberMill"]
	},{
		name: "other",
		title: "Other",
		buildings: ["workshop", "unicornPasture"]
	}
	],
	
	//TODO: use some class hierarchy there?
	buildingsData : [
	//----------------------------------- Food production ----------------------------------------
	{
		name: "field",
		label: "Catnip field",
		description: "Plant some catnip to grow it in the village (+0.1 per tick).\n"+
			"Fields have +50% production in spring and -75% in winter",
		unlocked: false,
		prices: [{ name : "catnip", val: 10 }],
		effects: {},
		priceRatio: 1.12,
		handler: function(btn){
			btn.game.resPool.get("catnip").perTick += 0.125;
		},
		
		val: 0
	},{
		name: "pasture",
		label: "Pasture",
		description: "Provides alternative source of food, hence reducing catnip consumption by 0.5%.",
		unlocked: false,
		prices: [{ name : "catnip", val: 100 }, { name : "wood", val: 10 }],
		effects: {
			"catnipDemandRatio": -0.005
		},
		requiredTech: ["animal"],
		priceRatio: 1.15,
		handler: function(btn){
		},
		
		val: 0
	},{
		name: "aqueduct",
		label: "Aqueduct",
		description: "+3% to catnip production",
		unlocked: false,
		prices: [
			{ name : "minerals", val: 75 }],
		effects: { 
			"catnipRatio" : 0.03
		},
		priceRatio: 1.12,
		requiredTech: ["engineering"],
		handler: function(btn){

		},
		val: 0
	},
	//----------------------------------- Population ----------------------------------------
	{
		name: "hut",
		label: "Hut",
		description: "Build a hut (each has a space for 2 kittens)",
		unlocked: false,
		prices: [{ name : "wood", val: 5 }],
		effects: {
			"maxKittens" : 2,
			"manpowerMax": 75
		},
		priceRatio: 2.5,
		handler: 	function(btn){
			//unlock village tab
			btn.game.villageTab.visible = true;
		},
		
		val: 0
	},
	{
		name: "logHouse",
		label: "Log House",
		description: "Build a house (each has a space for 1 kittens)",
		unlocked: false,
		prices: [{ name : "wood", val: 200 }, { name : "minerals", val: 250 }],
		effects: {
			"maxKittens" : 1,
			"manpowerMax": 50
		},
		priceRatio: 1.15,
		requiredTech: ["construction"],
		handler: 	function(btn){
		},
		val: 0
	},
	//----------------------------------- Science ----------------------------------------
	{
		name: "library",
		label: "Library",
		description: "Build a library to store sacred catkind knowledge.\nEach upgrade level improve your science output by 8%",
		unlocked: false,
		prices: [{ name : "wood", val: 25 }],
		effects: {
			"scienceRatio": 0.08
		},
		priceRatio: 1.15,
		handler: 	function(btn){
			//unlock library tab
			btn.game.libraryTab.visible = true;
			btn.game.village.getJob("scholar").unlocked = true;
		},
		
		val: 0
	},{
		name: "academy",
		label: "Academy",
		description: "Improves your research ratio and the speed of your kitten skills growth.\nEach upgrade level improve your science output by 20%",
		unlocked: false,
		prices: [{ name : "wood", val: 50 },
				 {name : "minerals", val: 70 },
				 { name : "science", val: 100 }],
		effects: {
			"scienceRatio": 0.2,
			"learnRatio" : 0.05
		},
		priceRatio: 1.15,
		requiredTech: ["math"],
		handler: function(btn){
			//btn.game.village.getJob("miner").unlocked = true;
		},
		val: 0
	},
	//----------------------------------- Resource production ----------------------------------------
	{
		name: "barn",
		label: "Barn",
		description: "Provides a space to store your resources.\n(+5K catnip, +200 wood)",
		unlocked: false,
		prices: [{ name : "wood", val: 50 }],
		effects: {
			"catnipMax" 	: 5000,
			"woodMax"		: 200,
			"mineralsMax"	: 250,
			"ironMax"		: 50
		},
		priceRatio: 1.75,
		requiredTech: ["agriculture"],
		handler: 	function(btn){
		},
		val: 0
	},
	{
		name: "warehouse",
		label: "Warehouse",
		description: "Provides a space to store your resources.\n(+250 wood, +200 minerals, +25 iron)",
		unlocked: false,
		prices: [{ name : "beam", val: 2 }, { name : "slab", val: 3 }],
		effects: {
			"woodMax"		: 250,
			"mineralsMax"	: 200,
			"ironMax"		: 25
		},
		priceRatio: 1.15,
		requiredTech: ["construction"],
		handler: 	function(btn){
		},
		val: 0
	},
	{
		name: "mine",
		label: "Mine",
		description: "Unlocks miner job\nEach upgrade level improve your minerals output by 20%",
		unlocked: false,
		prices: [{ name : "wood", val: 100 }],
		effects: {
			"mineralsRatio": 0.2
		},
		priceRatio: 1.15,
		requiredTech: ["mining"],
		handler: function(btn){
			btn.game.village.getJob("miner").unlocked = true;
		},
		val: 0
	},{
		name: "smelter",
		label: "Smelter",
		description: "Smelts ore into the metal (-0.05 wood, -0.1 minerals, + 0.02 iron)",
		unlocked: false,
		enabled: true,
		prices: [{ name : "minerals", val: 200 }],
		priceRatio: 1.15,
		requiredTech: ["metal"],
		handler: function(btn){

		},
		effects: {
			"woodPerTick" : -0.05,
			"mineralsPerTick" : -0.1,
			"ironPerTick" : 0.02,
			"goldPerTick" : 0.001	//quite fucking slow
		},
		action: function(self, game){
			if (!self.enabled){
				return;
			}

			var wood = game.resPool.get("wood");
			var minerals = game.resPool.get("minerals");
			var gold = game.resPool.get("gold");
			
			
			if (wood.value > self.val * -self.effects["woodPerTick"] &&
				minerals.value > self.val * -self.effects["mineralsPerTick"]
			){
				wood.value -= self.val * -self.effects["woodPerTick"];
				minerals.value -= self.val * -self.effects["mineralsPerTick"];
				
				game.resPool.get("iron").value += self.effects["ironPerTick"] * self.val;	//a bit less than ore
				
				if (game.workshop.get("goldOre").unlocked){
					gold.value += self.effects["goldPerTick"] * self.val;
				}
			}
		},
		val: 0
	},
	{
		name: "lumberMill",
		label: "Lumber Mill",
		description: "Improves wood production by 10%",
		unlocked: false,
		prices: [
			{name : "wood", val: 100},
			{name : "iron", val: 50},
			{name : "minerals", val: 250}
		],
		effects: {
			"woodRatio" : 0.1
		},
		priceRatio: 1.15,
		handler: function(btn){
		},
		val: 0,
		requiredTech: ["construction"],
		canUpgrade: true
	},
	//----------------------------------- Other ----------------------------------------
	{
		name: "workshop",
		label: "Workshop",
		description: "Provides a vast variety of upgrades\nImprove craft effectiveness by 6%",
		unlocked: false,
		prices: [
			{ name : "wood", val: 100 },
			{ name : "minerals", val: 400 }
		],
		effects: {
			"craftRatio" : 0.06	//6% for craft output
		},
		priceRatio: 1.15,
		handler: function(btn){
			btn.game.workshopTab.visible = true;
		},
		val: 0,
		canUpgrade: false
	},
	{
		name: "unicornPasture",
		label: "Unic. Pasture",
		description: "Allows to tame unicorns",
		unlocked: false,
		prices: [
			{ name : "unicorns", val: 2 }
		],
		effects: {
		},
		priceRatio: 1.75,
		handler: function(btn){
			btn.game.resPool.get("unicorns").perTick += 0.001;
		},
		val: 0,
		requiredTech: ["animal"],
		canUpgrade: true
	}
	],
	
	effectsBase: {
		"maxCatnip" : 2000
	},
	
	get: function(name){
		return this.getBuilding(name);
	},
	
	getBuilding: function(name){
		for (var i = 0; i < this.buildingsData.length; i++){
			var bld = this.buildingsData[i];
			
			if (bld.name == name){
				return bld;
			}
		}
		console.error("Could not find building data for '" + name + "'");
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
		
		for (var i = 0; i < this.buildingsData.length; i++){
			var bld = this.buildingsData[i];
			
			//TODO: FIX THIS SHIT
			if (bld.isSpacer) {
				continue;
			}
			
			var effect = bld.effects[name];
			
			if (bld.action && !bld.enabled){
				continue;
			}
			
			var val = bld.val;
			//for barns we will enforce default limit effect
			if (bld.name == "barn"){
				val += 1;
			}
			
			if (effect && val){
				totalEffect += effect * val;
			}
		}
		
		return totalEffect;
	},
	
	update: function(){
		for (var i = 0; i < this.buildingsData.length; i++){
			var bld = this.buildingsData[i];
			
			//TODO: FIX THIS SHIT
			if (bld.isSpacer){
				continue;
			}
			
			if (!bld.unlocked){
				if (this.isConstructionEnabled(bld)){
					bld.unlocked = true;
				}
			} else {
				//just in case we patched something (shit happens?)
				if (!this.isTechUnlocked(bld)){
					bld.unlocked = false;
				}
			}
			
			if (bld.action && bld.val > 0){
				bld.action(bld, this.game);
			}
		}
	},
	
	isConstructionEnabled: function(building){
		var isEnabled = true;
		
		if (building.prices.length){
			for( var i = 0; i < building.prices.length; i++){
				var price = building.prices[i];

				var res = this.game.resPool.get(price.name);
				if (res.value * 1.7 < price.val){	// 30% required to unlock structure
					isEnabled = false;
					break;
				}
			}
		}
		
		if (!this.isTechUnlocked(building)){
			isEnabled = false;
		}
		
		return isEnabled;
	},
	
	isTechUnlocked: function(building){
		var isEnabled = true;
		
		var reqTech = building.requiredTech;
		if (reqTech){
			var tech = this.game.science.get(reqTech);
			if (tech && !tech.researched){
				isEnabled = false;
			}
		}
		return isEnabled;
	},
	
	save: function(saveData){
		saveData.buildings = this.buildingsData;
	},
	
	load: function(saveData){
		/*if (saveData.buildings && saveData.buildings.length){
			this.buildingsData  = saveData.buildings;
		}*/
		
		if (saveData.buildings.length){
			for(var i = 0; i< saveData.buildings.length; i++){
					var savedBld = saveData.buildings[i];
					
					if (savedBld != null){
						var bld = this.game.bld.getBuilding(savedBld.name);
						if (!bld) { continue; }
						
						bld.val = savedBld.val;
						bld.unlocked = savedBld.unlocked;
						
						for (var j = 0; j< bld.val; j++){
							for( var k = 0; k < bld.prices.length; k++){
								var price = bld.prices[k];
								price.val = price.val * bld.priceRatio;
							}
						}
					}
			}
		}
	},
	
	reset: function(){
		for (var i = 0; i < this.buildingsData.length; i++){
			var bld = this.buildingsData[i];
			
			bld.val = 0;
		}
	}
});


dojo.declare("com.nuclearunicorn.game.ui.BuildingBtn", com.nuclearunicorn.game.ui.button, {
	sellHref: null,
	toggleHref: null,
	
	getName: function(){
		var building = this.getBuilding();
		if (building){
			return this.name + " (" + building.val + ")";
		}
		return this.name;
	},
	
	afterRender: function(){
		this.inherited(arguments);
		
		var self = this;
		var building = this.getBuilding();
		
		dojo.connect(this.domNode, "onmouseover", this, function(){ self.game.selectedBuilding = building; });
		dojo.connect(this.domNode, "onmouseout", this, function(){  self.game.selectedBuilding = null; });
	},
	
	update: function(){
		this.inherited(arguments);
		
		var self = this;
		
		var building = this.getBuilding();
		if (building && building.val){
			
			// -------------- sell ----------------
			
			if (!this.sellHref){
				this.sellHref = dojo.create("a", { href: "#", innerHTML: "sell", style:{
						paddingLeft: "4px",
						float: "right",
						cursor: "default"
					}}, null);
					
				dojo.connect(this.sellHref, "onclick", this, function(event){
					event.stopPropagation();
					
					building.val--;
					
					this.refund(0.5);
				
					if (building.priceRatio){
						this.rejustPrice(building.priceRatio);
					}
					
					this.update();
				});
			} else {
				dojo.place(this.sellHref, this.buttonContent);
			}
			
			//--------------- toggle ------------
			
			if (!building.action){
				return;
			}
			if (!this.toggleHref){
				this.toggleHref = dojo.create("a", { href: "#", innerHTML: building.enabled ? "off" : "on", style:{
						paddingLeft: "4px",
						float: "right",
						cursor: "default"
					}}, null);
					
				dojo.connect(this.toggleHref, "onclick", this, function(event){
					event.stopPropagation();

					building.enabled = !building.enabled;
					this.toggleHref.innerHTML = building.enabled ? "off" : "on"
					
					this.update();
				});
			} else {
				
				
				dojo.create("span", { innerHTML:"|", style: {float: "right", paddingLeft: "5px"}}, this.buttonContent);
				dojo.place(this.toggleHref, this.buttonContent);
			}
		}
		
	},
	
	updateVisible: function(){
		this.inherited(arguments);
		var building = this.getBuilding();
		
		if (!building){
			return;
		}
		
		if (!building.unlocked){
			this.setVisible(false);
		}else{
			this.setVisible(true);
		}
	}
});


dojo.declare("com.nuclearunicorn.game.ui.RefineCatnipButton", com.nuclearunicorn.game.ui.button, {
	x100Href: null,
	
	update: function(){
		this.inherited(arguments);
		
		var self = this;
		
		var catnipVal = self.game.resPool.get("catnip").value;	
		if (catnipVal < (100 * 100)){
			return;
		}
	    // -------------- x100 ----------------
			
		if (!this.x100Href){
			this.x100Href = dojo.create("a", { href: "#", innerHTML: "x100", style:{
					paddingLeft: "4px",
					float: "right",
					cursor: "default"
				}}, null);
				
			dojo.connect(this.x100Href, "onclick", this, function(event){
				event.stopPropagation();
				
				var catnipVal = self.game.resPool.get("catnip").value;
				
				if (catnipVal < (100 * 100)){
					this.game.msg("not enough catnip!");
				}
				
				self.game.resPool.get("catnip").value -= (100 * 100);
				
				var isEnriched = self.game.workshop.get("advancedRefinement").researched;
				if (!isEnriched){
					self.game.resPool.get("wood").value += 100;
				} else {
					self.game.resPool.get("wood").value += 200;
					//self.game.resPool.get("oil").value += 1; //no oil until chemistry
				}
				
				this.update();
			});
		} else {
			dojo.place(this.x100Href, this.buttonContent);
		}
		
	},
	
	updateVisible: function(){
		this.inherited(arguments);
		var building = this.getBuilding();
		
		if (!building){
			return;
		}
		
		if (!building.unlocked){
			this.setVisible(false);
		}else{
			this.setVisible(true);
		}
	}
});



dojo.declare("com.nuclearunicorn.game.ui.tab.Bonfire", com.nuclearunicorn.game.ui.tab, {
	
	groupBuildings: false,
	
	constructor: function(tabName){
		//this.inherited(arguments);

		var self = this;
	},

	render: function(content){
		
		//dojo.empty(content);
		
		var div = dojo.create("div", { style: { float: "right"}}, content);
		var groupCheckbox = dojo.create("input", {
			type: "checkbox",
			checked: this.groupBuildings
		}, div);
		
		dojo.connect(groupCheckbox, "onclick", this, function(){
			this.groupBuildings = !this.groupBuildings;
			
			dojo.empty(content);
			this.render(content);
		});
		
		dojo.create("span", { innerHTML: "Group buildings"}, div);
		
		var div = dojo.create("div", { style: { marginTop: "25px"}}, content);
		
		
		if (this.groupBuildings){
			var groups = this.game.bld.buildingGroups;
			for (var i = 0; i< groups.length; i++){
				
				var hasVisibleBldngs = false;
				for (var j = 0; j< groups[i].buildings.length; j++){
					var bld = this.game.bld.get(groups[i].buildings[j]);
					if (bld.unlocked){
						hasVisibleBldngs = true;
					}
				}
				if (!hasVisibleBldngs && i != 0){
					continue;
				}
				
				var groupPanel = new com.nuclearunicorn.game.ui.Panel(groups[i].title);
				var panelContent = groupPanel.render(content);
				
				//shitty hack
				if (i == 0){
					this.renderCoreBtns(panelContent);
				}
				
				for (var j = 0; j< groups[i].buildings.length; j++){
					var bld = this.game.bld.get(groups[i].buildings[j]);
					
					var btn = new com.nuclearunicorn.game.ui.BuildingBtn({
						name: 			bld.label,		
						description: 	bld.description,
						building: 		bld.name,
						handler: 		bld.handler
					}, this.game);
					
					btn.visible = bld.unlocked;
					
					this.addButton(btn);
					btn.render(panelContent);
				}
			}
		}else{
			
			this.renderCoreBtns(content);
			
			var buildings = this.game.bld.buildingsData;
			for (var i = 0; i< buildings.length; i++){
				var bld = buildings[i];
				
				var btn = new com.nuclearunicorn.game.ui.BuildingBtn({
					name: 			bld.label,		
					description: 	bld.description,
					building: 		bld.name,
					handler: 		bld.handler
				}, this.game);
				
				btn.visible = bld.unlocked;
				
				this.addButton(btn);
				btn.render(content);
			}
		}	
	},
	
	renderCoreBtns: function(container){
		var self = this;
		var btn = new com.nuclearunicorn.game.ui.BuildingBtn({
			name:	 "Gather catnip", 
			handler: function(){
						self.game.resPool.get("catnip").value++;
					 },
			description: "Gathere some catnip in the wood"
		}, this.game);
		this.addButton(btn);
		btn.render(container);
		
		var btn = new com.nuclearunicorn.game.ui.RefineCatnipButton({
			name: 		"Refine catnip", 
			handler: 	function(){
							//self.game.resPool.get("catnip").value -= 100;
							var isEnriched = self.game.workshop.get("advancedRefinement").researched;
							if (!isEnriched){
								self.game.resPool.get("wood").value += 1;
							} else {
								self.game.resPool.get("wood").value += 2;
								//self.game.resPool.get("oil").value += 1; //no oil until chemistry
							}
						},
			description: "Refine catnip into the catnip wood",
			prices: [ { name : "catnip", val: 100 }]
		}, this.game);
		this.addButton(btn);
		btn.render(container);
	},
	
	update: function(){
		this.inherited(arguments);
	}
});

