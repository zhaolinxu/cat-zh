dojo.declare("com.nuclearunicorn.game.buildings.BuildingsManager", null, {
	
	game: null,
	
	groupBuildings: false,
	twoRows: false,
	
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
		buildings: ["library", "academy", "observatory"]
	},{
		name: "storage",
		title: "Storage",
		buildings: ["barn", "warehouse", "harbor"]
	},{
		name: "resource",
		title: "Resources",
		buildings: ["mine", "quarry", "smelter", "calciner", "lumberMill", "oilWell"]
	},{
		name: "culture",
		title: "Culture",
		buildings: ["amphitheatre", "temple"]
	},{
		name: "other",
		title: "Other",
		buildings: ["workshop", "steamworks", "tradepost", "unicornPasture"]
	},{
		name: "megastructures",
		title: "Mega Structures",
		buildings: ["ziggurat"]
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
		effects: {
			"catnipPerTickBase": 0.125
		},
		priceRatio: 1.12,
		handler: function(btn){
			//btn.game.resPool.get("catnip").perTick += 0.125;
		},
		/*action: function(self, game){
			game.resPool.get("catnip").value += game.bld.getEffect("catnipPerTick");
		},*/
		val: 0
	},
	{
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
		description: "Build a hut (each has a space for 2 kittens). +75 to the max manpower ",
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
			btn.game.ironWill = false;	//har har har
		},
		
		val: 0
	},
	{
		name: "logHouse",
		label: "Log House",
		description: "Build a house (each has a space for 1 kittens)  +50 to the max manpower",
		unlocked: false,
		prices: [{ name : "wood", val: 200 }, { name : "minerals", val: 250 }],
		effects: {
			"maxKittens" : 1,
			"manpowerMax": 50
		},
		priceRatio: 1.15,
		requiredTech: ["construction"],
		handler: 	function(btn){
			btn.game.ironWill = false;
		},
		val: 0
	},
	//----------------------------------- Science ----------------------------------------
	{
		name: "library",
		label: "Library",
		description: "Build a library to store sacred catkind knowledge.\nEach upgrade level improves your science output by 8%",
		unlocked: false,
		prices: [{ name : "wood", val: 25 }],
		effects: {
			"scienceRatio": 0.08,
			"scienceMax" : 250,
			"cultureMax" : 10
		},
		priceRatio: 1.15,
		handler: 	function(btn){
			btn.game.libraryTab.visible = true;
			btn.game.village.getJob("scholar").unlocked = true;
		},
		action: function(self, game){
			var mirrors = game.workshop.get("titaniumMirrors");
			if (mirrors.researched){
				self.effects["scienceMax"] = 250 + ( 250 * game.bld.get("observatory").val * mirrors.effects["libraryRatio"]);
			}
		},
		
		val: 0
	},{
		name: "academy",
		label: "Academy",
		description: "Improves your research ratio and the speed of your kitten skills growth.\nEach upgrade level improves your science output by 20%",
		unlocked: false,
		prices: [{ name : "wood", val: 50 },
				 {name : "minerals", val: 70 },
				 { name : "science", val: 100 }],
		effects: {
			"scienceRatio": 0.2,
			"scienceMax" : 500,
			"learnRatio" : 0.05,
			"cultureMax" : 25
		},
		priceRatio: 1.15,
		requiredTech: ["math"],
		handler: function(btn){
			//btn.game.village.getJob("miner").unlocked = true;
		},
		val: 0
	},{
		name: "observatory",
		label: "Observatory",
		description: "Increases the chance of the astronomical events by 0.5%, +25% to the science output, +1K to the max science",
		unlocked: false,
		prices: [{ name : "scaffold", val: 50 },
				 { name : "slab", val: 35 },
				 { name : "iron", val: 750 },
				 { name : "science", val: 1000 }
		],
		effects: {
			"scienceRatio": 0.25,
			"starEventChance": 2.5,
			"scienceMax" : 1000
		},
		priceRatio: 1.10,
		ignorePriceCheck: true,
		requiredTech: ["astronomy"],
		handler: function(btn){
		},
		action: function(self, game){
			/*var astrolabe = game.workshop.get("astrolabe");
			if (astrolabe.researched){
				self.effects["scienceMax"] = 1750;
			}*/
		},
		val: 0
	},
	//----------------------------------- Resource storage -------------------------------------------
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
			"ironMax"		: 50,
			"coalMax"		: 60,
			"goldMax"		: 10,
			"titaniumMax"	: 2
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
		prices: [{ name : "beam", val: 1.5 }, { name : "slab", val: 2 }],
		effects: {
			"woodMax"		: 150,
			"mineralsMax"	: 200,
			"ironMax"		: 25,
			"coalMax"		: 30,
			"goldMax"		: 5,
			"titaniumMax"	: 10
		},
		priceRatio: 1.15,
		ignorePriceCheck: true,
		requiredTech: ["construction"],
		handler: function(btn){
		},
		val: 0
	},
	{
		name: "harbor",
		label: "Harbor",
		description: "Provides a space to store resources. Other effects TBD",
		unlocked: false,
		prices: [{ name : "scaffold", val: 5 }, { name : "slab", val: 50 }, { name : "plate", val: 75 }],
		effects: {
			"catnipMax" 	: 2500,
			"woodMax"		: 700,
			"mineralsMax"	: 950,
			"ironMax"		: 150,
			"coalMax"		: 100,
			"goldMax"		: 25,
			"titaniumMax"	: 50
		},
		priceRatio: 1.15,
		ignorePriceCheck: true,
		requiredTech: ["navigation"],
		handler: 	function(btn){
		},
		val: 0
	},
	//----------------------------------- Resource production ----------------------------------------
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
		val: 0,
		action: function(self, game){
			var coal = game.resPool.get("coal");

			if (game.workshop.get("deepMining").researched){
				//fun but ugly hack
				self.effects["coalPerTickBase"] = 0.003;
				//coal.value += self.effects["coalPerTick"] * self.val;
			}
		}
	},{
		name: "quarry",
		label: "Quarry",
		description: "Quarry improves your mining efficiency by 50% and produces a bit of coal",
		unlocked: false,
		prices: [{ name : "scaffold", val: 50 },
				 { name : "steel", val: 150 },
				 { name : "slab", val: 1000 }],
		effects: {
			"mineralsRatio": 0.35,
			"coalPerTickBase": 0.015
		},
		priceRatio: 1.15,
		requiredTech: ["archeology"],
		handler: function(btn){
		},
		val: 0
	},
	{
		name: "smelter",
		label: "Smelter",
		description: "Smelts ore into the metal (-0.05 wood, -0.1 minerals, + 0.02 iron)",
		unlocked: false,
		enabled: true,
		togglable: true,
		prices: [{ name : "minerals", val: 200 }],
		priceRatio: 1.15,
		requiredTech: ["metal"],
		handler: function(btn){

		},
		effects: {
			"woodPerTick" : -0.05,
			"mineralsPerTick" : -0.1,
			"ironPerTick" : 0.02
		},
		action: function(self, game){
			self.effects["coalPerTickBase"] = 0;
			if (!self.enabled && self.togglable){
				return;
			}

			var wood = game.resPool.get("wood");
			var minerals = game.resPool.get("minerals");
			var gold = game.resPool.get("gold");
			var coal = game.resPool.get("coal");
			
			
			if (wood.value > self.val * -self.effects["woodPerTick"] &&
				minerals.value > self.val * -self.effects["mineralsPerTick"]
			){
				wood.value -= self.val * -self.effects["woodPerTick"];
				minerals.value -= self.val * -self.effects["mineralsPerTick"];
				
				game.resPool.get("iron").value += self.effects["ironPerTick"] * self.val;	//a bit less than ore
				
				if (game.workshop.get("goldOre").researched){
					self.effects["goldPerTick"] = 0.001;
					gold.value += self.effects["goldPerTick"] * self.val;
				}
				
				if (game.workshop.get("coalFurnace").researched){
					//self.effects["coalPerTick"] = 0.005;
					self.effects["coalPerTickBase"] = 0.005;
					//coal.value += self.effects["coalPerTick"] * self.val;
				}
			}
		},
		val: 0
	},{
		name: "calciner",
		label: "Calciner",
		description: "Highly effective source of metal.\nConsumes 1.5 minerals and 0.02 oil per tick. Produces 0.15 iron and a small amount of titanium",
		unlocked: false,
		enabled: false,
		togglable: true,
		prices: [
			{ name : "steel", val: 120 },
			{ name : "titanium",  val: 15 },
			{ name : "blueprint",  val: 5 },
			{ name : "oil",  val: 3000 }
		],
		priceRatio: 1.15,
		ignorePriceCheck: true,
		requiredTech: ["chemistry"],
		handler: function(btn){

		},
		effects: {
			"mineralsPerTick" : -1.5,
			"ironPerTick" : 0.15,
			"titaniumPerTick" : 0.0005,
			"oilPerTick" : -0.024	//base + 0.01
		},
		action: function(self, game){
			if (!self.enabled && self.togglable){
				return;
			}
			
			var oil = game.resPool.get("oil");
			var minerals = game.resPool.get("minerals");

			if (oil.value > self.val * -self.effects["oilPerTick"] &&
				minerals.value > self.val * -self.effects["mineralsPerTick"]
			){
				oil.value -= self.val * -self.effects["oilPerTick"];
				minerals.value -= self.val * -self.effects["mineralsPerTick"];
				
				game.resPool.get("iron").value += self.effects["ironPerTick"] * self.val;
				game.resPool.get("titanium").value += self.effects["titaniumPerTick"] * self.val;
			}
			
		},
		val: 0
	},
	{
		name: "steamworks",
		label: "Steamworks",
		description: "When active, reduces your coal production by 80%. \nCan perform a vast variety of operations if upgraded.",
		unlocked: false,
		enabled: false,
		togglable: true,
		jammed: false,
		prices: [
			{ name : "steel", val: 75 },
			{ name : "gear",  val: 25 },
			{ name : "blueprint",  val: 1 }
		],
		priceRatio: 1.25,
		ignorePriceCheck: true,
		requiredTech: ["machinery"],
		handler: function(btn){

		},
		effects: {
			"coalRatioGlobal" : -0.8	//to be revisited later
		},
		action: function(self, game){
			if (!self.enabled){
				return;
			}
			
			if (game.workshop.get("printingPress").researched){
				var amt = 0.0005 * self.val;						// 2 per year per SW
				game.resPool.get("manuscript").value += amt;
				//game.msg("Printing press: +" + amt + " manuscript!");
			}
			
			var combEngine = game.workshop.get("combustionEngine");
			if( combEngine.researched){
				self.effects["coalRatioGlobal"] = -0.8 + combEngine.effects["coalRatioGlobal"];
			}

			if (game.workshop.get("factoryAutomation").researched && !self.jammed){
				var baseAutomationRate = 0.02;

				var wood = game.resPool.get("wood");
				var minerals = game.resPool.get("minerals");
				var iron = game.resPool.get("iron");
				
				if (
					wood.value >= wood.maxValue * (1 - baseAutomationRate) ||
					minerals.value >= minerals.maxValue * (1 - baseAutomationRate) ||
					
					(game.workshop.get("pneumaticPress").researched &&
						iron.value >= iron.maxValue * (1 - baseAutomationRate))
				){
					game.msg("Activating workshop automation");
					self.jammed = true;				//jamm untill next year
				} else {
					return;
				}
				
				var ratio = game.bld.getEffect("craftRatio");

				if (wood.value >= wood.maxValue * (1 - baseAutomationRate)){
					var autoWood = wood.value * ( baseAutomationRate + baseAutomationRate * self.val); 
					if (autoWood >= game.workshop.getCraft("beam").prices[0].val){
						var amt = Math.floor(autoWood / game.workshop.getCraft("beam").prices[0].val);
						game.workshop.craft("beam", amt);
						game.msg("Spent " + game.getDisplayValueExt(autoWood) + " wood, +" + game.getDisplayValueExt(amt + amt * ratio) + " beams!");
					}
				}
				if (minerals.value >= minerals.maxValue * (1 - baseAutomationRate)){
					var autoMinerals = minerals.value * ( baseAutomationRate + baseAutomationRate * self.val); 
					if (autoMinerals > game.workshop.getCraft("slab").prices[0].val){
						var amt = Math.floor(autoMinerals / game.workshop.getCraft("slab").prices[0].val);
						game.workshop.craft("slab", amt);
						game.msg("Spent " + game.getDisplayValueExt(autoMinerals) + " minerals, +" + game.getDisplayValueExt(amt + amt * ratio) + " slabs!");
					}
				}
				
				if (game.workshop.get("pneumaticPress").researched && iron.value >= iron.maxValue * (1 - baseAutomationRate)){
					var autoIron = iron.value * ( baseAutomationRate + baseAutomationRate * self.val); 
					
					if (autoIron > game.workshop.getCraft("plate").prices[0].val){
						var amt = Math.floor(autoIron / game.workshop.getCraft("plate").prices[0].val);
						game.workshop.craft("plate", amt);
						game.msg("Spent " + game.getDisplayValueExt(autoIron) + " iron, +" + game.getDisplayValueExt(amt + amt * ratio) + " plates!");
					}
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
		handler: function(btn){},
		val: 0,
		requiredTech: ["construction"],
		canUpgrade: true
	},
	{
		name: "oilWell",
		label: "Oil Well",
		description: "Produces 0.02 oil per tick, +1500 to maximum oil limit",
		unlocked: false,
		prices: [
			{name : "steel", val: 50},
			{name : "gear",  val: 25},
			{name : "scaffold", val: 25}
		],
		effects: {
			"oilMax" : 1500,
			"oilPerTickBase" : 0.02
		},
		priceRatio: 1.15,
		handler: function(btn){},
		val: 0,
		requiredTech: ["chemistry"],
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
		name: "tradepost",
		label: "Tradepost",
		description: "The hearth of your trading empire\nImproves trade effectiveness by 1.5%, reduces rare resource consumption by 4%",
		unlocked: false,
		prices: [
			{ name : "wood", val: 500 },
			{ name : "minerals", val: 200 },
			{ name : "gold", val: 10 }
		],
		effects: {
			"fursDemandRatio"   : -0.04,
			"ivoryDemandRatio"  : -0.04,
			"spiceDemandRatio"  : -0.04,
			"silkDemandRatio"   : -0.04,
			"tradeRatio" : 0.015
		},
		priceRatio: 1.15,
		handler: function(btn){},
		val: 0,
		requiredTech: ["currency"],
		action: function(self, game){
			var seri = game.workshop.get("caravanserai");
			if (seri.researched){
				self.effects["standingRatio"] = seri.effects["standingRatio"];
			}
		}
	},
	{
		name: "amphitheatre",
		label: "Amphitheatre",
		description: "Reduces negative effects of overpopulation by 5%. +0.005 culture per tick",
		unlocked: false,
		prices: [
			{ name : "wood", val: 200 },
			{ name : "minerals", val: 1200 },
			{ name : "parchment", val: 3 }
		],
		effects: {
			"unhappinessRatio" : -0.048,
			"culturePerTickBase" : 0.005,
			"cultureMax" : 50
		},
		priceRatio: 1.15,
		ignorePriceCheck: true,
		handler: function(btn){},
		val: 0,
		requiredTech: ["writing"],
		action: function(self, game){
			/*var culture = game.resPool.get("culture");
			culture.value += self.val * self.effects["culturePerTick"];*/
		}
	},
	{
		name: "temple",
		label: "Temple",
		description: "Temple of light. +0.05 culture per tick. May be improved with Theology.",
		unlocked: false,
		prices: [
			{ name : "slab", val: 25 },
			{ name : "plate", val: 15 },
			{ name : "gold", val: 50 },
			{ name : "manuscript", val: 10 }
		],
		effects: {
			"culturePerTickBase" : 0.05,
			"faithPerTickBase" : /*0.001*/ 0,
			"faithMax": 100
		},
		priceRatio: 1.15,
		ignorePriceCheck: true,
		handler: function(btn){},
		val: 0,
		requiredTech: ["philosophy"],
		action: function(self, game){

			var theology = game.science.get("theology");
			if (theology.researched){
				self.effects["faithPerTickBase"] = 0.0015;
			}
			
			var stainedGlass = game.religion.getRU("stainedGlass");
			if (stainedGlass.researched){
				self.effects["culturePerTickBase"] = 0.1;
			}
			
			var scholastics = game.religion.getRU("scholasticism");
			if (scholastics.researched){
				self.effects["scienceMax"] = 500;
			}
			
			var sunAltar = game.religion.getRU("sunAltar");
			if (sunAltar.researched){
				self.effects["faithMax"] = 150;
			}
			
			var sunAltar = game.religion.getRU("sunAltar");
			if (sunAltar.researched){
				self.effects["happiness"] = 0.5;
			}
			
			
		}
	},
	{
		name: "unicornPasture",
		label: "Unic. Pasture",
		description: "Allows to tame unicorns.\n Reduce catnip consumption by 0.15%",
		unlocked: false,
		prices: [
			{ name : "unicorns", val: 2 }
		],
		effects: {
			"catnipDemandRatio": -0.0015,
			"unicornsPerTickBase" : 0.001
		},
		priceRatio: 1.75,
		handler: function(btn){
			//btn.game.resPool.get("unicorns").perTick += 0.001;
		},
		val: 0,
		requiredTech: ["animal"],
		canUpgrade: true
	},
	
	//----------------------------------- Wonders ----------------------------------------
	
	{
		name: "ziggurat",
		label: "Ziggurat",
		description: "The dark legacy of the lost race",
		unlocked: false,
		prices: [
			{ name : "megalith", val: 75 },
			{ name : "scaffold", val: 50 },
			{ name : "blueprint", val: 1 }
		],
		effects: {
		},
		priceRatio: 1.25,
		handler: function(btn){
		},
		val: 0,
		requiredTech: ["construction"],
		canUpgrade: true
	}
	
	
	],
	
	effectsBase: {
		"manpowerMax": 100
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
	 * Since there are now dynamic effects affecting price ratio, it should be calculated there
	 * All direct calls to bld.price ratio should be concidered deprecated
	 */ 
	getPriceRatio: function(bldName){
		var bld = this.get(bldName);
		var ratio = bld.priceRatio;
		
		var wEffect = this.game.workshop.getEffect(bldName + "PriceRatio");
		if (wEffect){
			ratio += wEffect;
		}
		return ratio;
	},
	
	/**
	 * For fucks sake, finally we have a non-concrate dynamic price calculation algorithm
	 * It only took couple of months. TODO: potential performance impact?
	 */
	 getPrices: function(bldName) {
		 var bld = this.get(bldName);
		 var ratio = this.getPriceRatio(bldName);
		 
		 var prices = dojo.clone(bld.prices);
		 
		 for (var i = 0; i< bld.val; i++){
			 for( var j = 0; j < prices.length; j++){
				prices[j].val = prices[j].val * ratio;
			 }
		 }
	     return prices;
	 },
	
	/**
	 * Returns a total effect value generated by all buildings.
	 * 
	 * For example, if you have N buldings giving K effect,
	 * total value will be N*K
	 * 
	 */ 
	getEffect: function(name, isHyperbolic){
		var totalEffect = 0;
		
		if (this.effectsBase[name]){
			totalEffect += this.effectsBase[name];
		}
		
		for (var i = 0; i < this.buildingsData.length; i++){
			var bld = this.buildingsData[i];

			var effect = bld.effects[name];
			
			if (bld.action && !bld.enabled && bld.togglable){
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
		
		// Previously, catnip demand (or other buildings that both effected the same resource)
		// could have theoretically had more than 100% reduction because they diminished separately, 
		// this takes the total effect and diminishes it as a whole.
		if(isHyperbolic && totalEffect < 0) {
		  totalEffect = this.getHyperbolicEffect(totalEffect, 1.0);
		}
		
		return totalEffect ? totalEffect : 0;
	},
	
	/*
	 * Returns a parabolic-aproaching value of the effect that heades to the limit, but unable to approach it completely
	 */ 
	getHyperbolicEffect: function(effect, limit){
		effect = Math.abs(effect);
		
		var maxUndiminished = 0.75 * limit; //first 75% is free from diminishing returns
				
		if (effect <= maxUndiminished) {
			//Not high enough for diminishing returns to apply
			return -effect;
		}
		
		var diminishedPortion = effect - maxUndiminished;
		
		var delta = .25; //Lower values will approach 1 more quickly.
		
		// The last 25% will approach .25 but cannot actually reach it
		var diminishedEffect = (1-(delta/(diminishedPortion+delta)))*.25;
		
		var totalEffect = maxUndiminished+diminishedEffect;
		
		return  -totalEffect;
	},
	
	lerp: function (v0, v1, t){
		return v0 + t*(v1-v0);
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
		
		/*
		 * Manpower hack for ironwill mode. 1000 manpower is absolutely required for civilization unlock.
		 * There may be some microperf tweaks, but let's keep it simple
		 */ 
		 if (this.game.ironWill){
			 if (this.game.workshop.get("huntingArmor").researched){
				 this.game.bld.effectsBase["manpowerMax"] = 1000;
			 } else if (this.game.workshop.get("bolas").researched){
				 this.game.bld.effectsBase["manpowerMax"] = 400;
			 } else if (this.game.workshop.get("compositeBow").researched){
				 this.game.bld.effectsBase["manpowerMax"] = 200;
			 }
		 }
	},
	
	isConstructionEnabled: function(building){
		var isEnabled = true;
		
		if (building.prices.length && !building.ignorePriceCheck){
			for( var i = 0; i < building.prices.length; i++){
				var price = building.prices[i];

				var res = this.game.resPool.get(price.name);
				if (res.value / 0.3 < price.val){	// 30% required to unlock structure
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
		
		if (!saveData.bldData){
			saveData.bldData = {};
		}
		saveData.bldData.groupBuildings = this.groupBuildings;
		saveData.bldData.twoRows = this.twoRows;
	},
	
	load: function(saveData){

		this.groupBuildings = saveData.bldData ? saveData.bldData.groupBuildings: false;
		this.twoRows = saveData.bldData ? saveData.bldData.twoRows : false;
		
		if (saveData.buildings && saveData.buildings.length){
			for(var i = 0; i< saveData.buildings.length; i++){
					var savedBld = saveData.buildings[i];
					
					if (savedBld != null){
						var bld = this.game.bld.getBuilding(savedBld.name);
						if (!bld) { continue; }
						
						bld.val = savedBld.val;
						bld.unlocked = savedBld.unlocked;
						
						if (savedBld.jammed){
							bld.jammed = savedBld.jammed;
						}
						
						bld.enabled = savedBld.enabled;

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


dojo.declare("com.nuclearunicorn.game.ui.BuildingBtn", com.nuclearunicorn.game.ui.Button, {
	sellHref: null,
	toggleHref: null,
	
	buildingName: null,
	
	constructor: function(opts, game){
		if (opts.building){
			this.buildingName = opts.building;
		}
	},
	
	init: function(){
		this.prices = this.getPrices();
	},
	
	getBuilding: function(){
		if (this.buildingName){
			return this.game.bld.getBuilding(this.buildingName);
		}
		return null;
	},
	
	getPrices: function(){
		if (this.buildingName){
			var prices = this.game.bld.getPrices(this.buildingName);
			return prices;
		}
		return this.prices;
	},

	onClick: function(){
		this.animate();

		if (this.enabled && this.hasResources()){
			this.handler(this);
			
			this.payPrice();

			if (this.getBuilding()){
				this.getBuilding().val++;
				
				//price check is sorta heavy operation, so we will store the value in the button
				this.prices = this.getPrices();	
			}

			
			this.game.render();
		}
	},

	getName: function(){
		var building = this.getBuilding();
		if (building){
			var name = this.name;
			return name + " (" + building.val + ")";
		}
		return this.name;
	},
	
	getDescription: function(){
		var building = this.getBuilding();
		if (!building || (building && !building.jammed)){
			return this.description;
		} else {
			return this.description + "\n" + "***Maintenance***";
		}
	},
	
	afterRender: function(){
		this.inherited(arguments);
		
		var self = this;
		var building = this.getBuilding();
		
		this.renderLinks();
		
		dojo.connect(this.domNode, "onmouseover", this, function(){ self.game.selectedBuilding = building; });
		dojo.connect(this.domNode, "onmouseout", this, function(){  self.game.selectedBuilding = null; });
	},
	
	/**
	 * Render button links like off/on and sell
	 */  
	renderLinks: function(){
		var building = this.getBuilding();
		if (building && building.val){
			if (!this.sellHref){
				this.sellHref = dojo.create("a", { href: "#", innerHTML: "sell", style:{
						paddingLeft: "4px",
						float: "right",
						cursor: "pointer"
					}}, null);
					
				dojo.connect(this.sellHref, "onclick", this, function(event){
					event.stopPropagation();
					event.preventDefault();
					
					building.val--;
					
					this.refund(0.5);
				
					this.prices = this.getPrices();
					this.game.render();
				});
				dojo.place(this.sellHref, this.buttonContent);
			}
		}	
		
		//--------------- toggle ------------
			
		if (!building.action || !building.togglable){
			return;
		}
		if (!this.toggleHref){
			this.toggleHref = dojo.create("a", { 
				href: "#", 
				innerHTML: building.enabled ? "off" : "on", 
				style:{
					paddingLeft: "4px",
					float: "right",
					cursor: "pointer"
				}}, null);
				
			dojo.connect(this.toggleHref, "onclick", this, function(event){
				event.stopPropagation();
				event.preventDefault();

				building.enabled = !building.enabled;

				this.update();
			});
			
			dojo.create("span", { innerHTML:"|", style: {float: "right", paddingLeft: "5px"}}, this.buttonContent);
			dojo.place(this.toggleHref, this.buttonContent);
		} 
	},
	
	update: function(){
		this.inherited(arguments);
		
		var self = this;
		
		//we are calling update before render, panic flee
		if (!this.buttonContent){
			return;
		}
		
		var building = this.getBuilding();
		if (building && building.val){
			
			// -------------- sell ----------------
			if (this.sellHref){
				dojo.setStyle(this.sellHref, "display", (building.val > 0) ? "" : "none");
			}
			
			//--------------- toggle ------------
			
			if (!building.action || !building.togglable){
				return;
			}
			if (!this.toggleHref){
				this.toggleHref = dojo.create("a", { 
					href: "#", 
					innerHTML: building.enabled ? "off" : "on", 
					style:{
						paddingLeft: "4px",
						float: "right",
						cursor: "pointer"
					}}, null);
					
				dojo.connect(this.toggleHref, "onclick", this, function(event){
					event.stopPropagation();
					event.preventDefault();

					building.enabled = !building.enabled;

					this.update();
				});
				
				dojo.create("span", { innerHTML:"|", style: {float: "right", paddingLeft: "5px"}}, this.buttonContent);
				dojo.place(this.toggleHref, this.buttonContent);
				
			} else {
				this.toggleHref.innerHTML = building.enabled ? "off" : "on";
			}
			
			dojo.toggleClass(this.domNode, "bldEnabled", building.enabled);
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

dojo.declare("com.nuclearunicorn.game.ui.GatherCatnipButton", com.nuclearunicorn.game.ui.Button, {
	onClick: function(){
		this.animate();
		this.handler(this);
	}
});

dojo.declare("com.nuclearunicorn.game.ui.RefineCatnipButton", com.nuclearunicorn.game.ui.Button, {
	x100Href: null,
	
	update: function(){
		this.inherited(arguments);
		
		var self = this;
		
		var catnipVal = self.game.resPool.get("catnip").value;	
	    // -------------- x100 ----------------
			
		if (!this.x100Href){
			this.x100Href = dojo.create("a", { href: "#", innerHTML: "x100", style:{
					paddingLeft: "4px",
					float: "right",
					cursor: "default",
					display: catnipVal < (100 * 100) ? "none" : ""
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
			
			dojo.place(this.x100Href, this.buttonContent);
		} else {
			dojo.setStyle(this.x100Href, "display", catnipVal < (100 * 100) ? "none" : "");
		}
		
	}
});



dojo.declare("com.nuclearunicorn.game.ui.tab.Bonfire", com.nuclearunicorn.game.ui.tab, {
	
	constructor: function(tabName){

	},

	render: function(content){
		
		this.buttons = [];
		
		
		var topContainer = content;
		this.twoRows = this.game.bld.twoRows;

		if (!this.game.bld.groupBuildings){
			topContainer = dojo.create("div", {
				style: {
					paddingBottom : "5px",
					marginBottom: "15px",
					borderBottom: "1px solid gray"
				}
			}, content);
			this.initRenderer(content);
		}
		
		var div = dojo.create("div", { style: { float: "right"}}, topContainer);
		var groupCheckbox = dojo.create("input", {
			type: "checkbox",
			checked: this.game.bld.groupBuildings
		}, div);
		
		dojo.connect(groupCheckbox, "onclick", this, function(){
			this.game.bld.groupBuildings = !this.game.bld.groupBuildings;
			
			dojo.empty(content);
			this.render(content);
		});
		
		dojo.create("span", { innerHTML: "Group buildings", style: { paddingRight: "10px" }}, div);
		//---------------------------------------------------------------
		var twoRowsCheckbox = dojo.create("input", {
			type: "checkbox",
			checked: this.game.bld.twoRows
		}, div);
		dojo.connect(twoRowsCheckbox, "onclick", this, function(){
			this.game.bld.twoRows = !this.game.bld.twoRows;
			
			dojo.empty(content);
			this.render(content);
		});
		dojo.create("span", { innerHTML: "Two rows"}, div);
		//---------------------------------------------------------------
		var div = dojo.create("div", { style: { marginTop: "25px"}}, content);
		
		
		if (this.game.bld.groupBuildings){
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
				
				groupPanel.twoRows = this.twoRows;
				groupPanel.initRenderer(panelContent);

				for (var j = 0; j< groups[i].buildings.length; j++){
					var bld = this.game.bld.get(groups[i].buildings[j]);
					
					var btn = new com.nuclearunicorn.game.ui.BuildingBtn({
						name: 			bld.label,		
						description: 	bld.description,
						building: 		bld.name,
						handler: 		bld.handler
					}, this.game);
					
					/*btn.visible = bld.unlocked;
					
					var prices = this.game.bld.getPrices(bld.name);
					btn.enabled = this.game.resPool.hasRes(prices, 1);*/
					
					this.addButton(btn);

					btn.update();
					btn.render(groupPanel.getElementContainer(j));
				}
			}
		}else{
			
			this.renderCoreBtns(topContainer);
			
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
				btn.update();
				btn.render(this.getElementContainer(i + 2));	//where 2 is a size of core buttons, do not forget to change it
			}
		}	
	},
	
	renderCoreBtns: function(container){
		var self = this;
		var btn = new com.nuclearunicorn.game.ui.GatherCatnipButton({
			name:	 "Gather catnip", 
			handler: function(){
						clearTimeout(self.game.gatherTimeoutHandler);
						self.game.gatherTimeoutHandler = setTimeout(function(){ self.game.gatherClicks = 0; }, 5000);	//5 sec 
						
						self.game.gatherClicks++;
						if (self.game.gatherClicks >= 500 && !self.game.ironWill){
							alert("You are so tired");
							self.game.gatherClicks = 0;
						}
				
						self.game.resPool.get("catnip").value++;
						self.game.updateResources();
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
							
							self.game.updateResources();
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

