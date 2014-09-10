dojo.declare("com.nuclearunicorn.game.buildings.BuildingsManager", com.nuclearunicorn.core.TabManager, {
	
	game: null,
	
	groupBuildings: false,
	twoRows: false,
	
	constructor: function(game){
		this.game = game;
		
		this.registerMeta(this.buildingsData, {
			getEffect: function(bld, effectName){
				var effect = 0;

				if (bld.togglable && bld.name != "observatory"){
					if (bld.tunable){
						effect = bld.effects[effectName] * bld.on;
					} else {
						effect = bld.enabled ? bld.effects[effectName] * bld.val : 0;
					}
				}else{
					effect = bld.effects[effectName] * bld.val || 0;
				}
				return effect;
			}
		});
	},
	
	buildingGroups: [{
		name: "food",
		title: "Food Production",
		buildings: ["field","pasture","aqueduct"]
	},{
		name: "population",
		title: "Population",
		buildings: ["hut", "logHouse", "mansion"]
	},{
		name: "science",
		title: "Science",
		buildings: ["library", "academy", "observatory", "biolab"]
	},{
		name: "storage",
		title: "Storage",
		buildings: ["barn", "warehouse", "harbor"]
	},{
		name: "resource",
		title: "Resources",
		buildings: ["mine", "quarry", "lumberMill", "oilWell"]
	},{
		name: "industry",
		title: "Industry",
		buildings: ["steamworks", "magneto", "smelter", "calciner", "factory", "reactor" ]
	},{
		name: "culture",
		title: "Culture",
		buildings: ["amphitheatre", "chapel", "temple"]
	},{
		name: "other",
		title: "Other",
		buildings: ["workshop", "tradepost", "mint", "unicornPasture"]
	},{
		name: "megastructures",
		title: "Mega Structures",
		buildings: ["ziggurat"]
	}
	],

	/**
	 * Note:
	 * Do not abuse action() method, it is called on every tick and may have negative performance impact
	 * Try to reduce .get or .getEffect calls to minimum
	 */ 
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
		},
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
	},{
		name: "mansion",
		label: "Mansion",
		description: "A spacy mansion (each has a space for 1 kittens)  +50 to the max manpower",
		unlocked: false,
		prices: [{ name : "slab", val: 200 }, { name : "steel", val: 100 }, { name : "titanium", val: 1 }],
		effects: {
			"maxKittens" : 1,
			"manpowerMax": 50
		},
		priceRatio: 1.15,
		ignorePriceCheck: true,
		requiredTech: ["architecture"],
		handler: 	function(btn){
			btn.game.ironWill = false;
		},
		val: 0
	},
	//----------------------------------- Science ----------------------------------------
	{
		name: "library",
		label: "Library",
		description: "Build a library to store sacred catkind knowledge.\nEach upgrade level improves your science output by 8%.\nImproves max science by 250",
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
		description: "Improves your research ratio and the speed of your kitten skills growth.\nEach upgrade level improves your science output by 20%.\nImproves max science by 500",
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
		},
		val: 0
	},{
		name: "observatory",
		label: "Observatory",
		description: "Increases the chance of the astronomical events by 0.5%, +25% to the science output, +1K to the max science.\nTurning off observatories will only disable event bonus.",
		unlocked: false,
		enabled: false,
		togglable: true,
		on: 0,
		prices: [{ name : "scaffold", val: 50 },
				 { name : "slab", val: 35 },
				 { name : "iron", val: 750 },
				 { name : "science", val: 1000 }
		],
		effects: {
			"scienceRatio": 0.25,
			"starEventChance": 20,
			"starAutoSuccessChance": 1,
			"scienceMax" : 1000
		},
		priceRatio: 1.10,
		ignorePriceCheck: true,
		requiredTech: ["astronomy"],
		handler: function(btn){
		},
		action: function(self, game){
		},
		val: 0
	},{
		name: "biolab",
		label: "Bio Lab",
		description: "Improves effectiveness of catnip refinement by 5%, +35% to the science output, +1.5K to the max science",
		unlocked: false,
		prices: [{ name : "slab", val: 100 },
				 { name : "alloy", val: 25 },
				 { name : "science", val: 1500 },
		],
		effects: {
			"scienceRatio": 0.35,
			"refineRatio" : 0.05,
			"scienceMax"  : 1500
		},
		priceRatio: 1.10,
		ignorePriceCheck: true,
		requiredTech: ["biology"],
		handler: function(btn){
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
		description: "Provides a space to store your resources.\n(+150 wood, +200 minerals, +25 iron)",
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
		action: function(self, game){
			
			self.effects["coalMax"] = 100;
			
			var barges = game.workshop.get("barges");
			if (barges.researched){
				self.effects["coalMax"] += self.effects["coalMax"] * barges.effects["harborCoalRatio"];
			}
			
			var cargoShips = game.workshop.get("cargoShips");
			if (cargoShips.researched){
				var shipVal = game.resPool.get("ship").value;
				
				//100% to 225% with slow falldown on the 75%
				var limit = 2.25 + game.workshop.getEffect("shipLimit") * game.bld.get("reactor").val;
				var ratio = game.bld.getHyperbolicEffect(cargoShips.effects["harborRatio"] * shipVal, limit);

				self.effects["catnipMax"] = ( 2500 * ( 1 + ratio));
				self.effects["woodMax"] = ( 700 * ( 1 + ratio));
				self.effects["mineralsMax"] = ( 950 * ( 1 + ratio));
				self.effects["ironMax"] = ( 150 * ( 1 + ratio));
				self.effects["coalMax"] = ( self.effects["coalMax"] * ( 1 + ratio));
				self.effects["goldMax"] = ( 25 * ( 1 + ratio));
				self.effects["titaniumMax"] = ( 50 * ( 1 + ratio));
			}
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
		description: "Quarry improves your mining efficiency by 35% and produces a bit of coal",
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
		enabled: false,
		on: 0,
		togglable: true,
		tunable: true,
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
			if (self.on < 1){
				return;
			}

			var wood = game.resPool.get("wood");
			var minerals = game.resPool.get("minerals");
			var gold = game.resPool.get("gold");
			var coal = game.resPool.get("coal");
			var iron = game.resPool.get("iron");
			
			//safe switch for IW to save precious resources, as per players request
			if (game.ironWill && iron.value > iron.maxValue * 0.95){
				self.enabled = false;
				self.on = 0;
				return;
			}
			
			//--------------------------- hack hack hack hack --------------------------------
			var autoProdRatio = game.bld.getAutoProductionRatio();
			//--------------------------------------------------------------------------------
			
			var smelterRatio = (1 + game.workshop.getEffect("smelterRatio"));
			self.effects["ironPerTick"] = 0.02 * smelterRatio * autoProdRatio;
			
			if (wood.value > self.on * -self.effects["woodPerTick"] &&
				minerals.value > self.on * -self.effects["mineralsPerTick"]
			){
				wood.value -= self.on * -self.effects["woodPerTick"];
				minerals.value -= self.on * -self.effects["mineralsPerTick"];

				iron.value += self.effects["ironPerTick"] * self.on;
				
				if (game.workshop.get("goldOre").researched){
					self.effects["goldPerTick"] = 0.001 * autoProdRatio;
					gold.value += self.effects["goldPerTick"] * self.on;
				}
				
				if (game.workshop.get("coalFurnace").researched){
					self.effects["coalPerTickBase"] = 0.005 * smelterRatio * autoProdRatio;
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
		on: 0,
		togglable: true,
		tunable: true,
		prices: [
			{ name : "steel", val: 120 },
			{ name : "titanium",  val: 15 },
			{ name : "blueprint",  val: 5 },
			{ name : "oil",  val: 500 }
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
			if (self.on < 1){
				return;
			}
			
			self.effects["steelPerTick"] = 0;
			
			var oil = game.resPool.get("oil");
			var minerals = game.resPool.get("minerals");

			if (oil.value > self.on * -self.effects["oilPerTick"] &&
				minerals.value > self.on * -self.effects["mineralsPerTick"]
			){
				oil.value -= self.on * -self.effects["oilPerTick"];
				minerals.value -= self.on * -self.effects["mineralsPerTick"];
				
				//--------------------------- hack hack hack hack --------------------------------
				var autoProdRatio = game.bld.getAutoProductionRatio();
				//--------------------------------------------------------------------------------
				
				var steelRatio = game.workshop.getEffect("calcinerSteelRatio");
				
				var calcinerRatio = game.workshop.getEffect("calcinerRatio");
				self.effects["titaniumPerTick"] = 0.0005 * ( 1 + calcinerRatio*3 ) * autoProdRatio;
				self.effects["ironPerTick"] = 0.15 * ( 1 + calcinerRatio ) * autoProdRatio;

				var iron = game.resPool.get("iron");
				var coal = game.resPool.get("coal");
				var steel = game.resPool.get("steel");
				
				// we have iron to steel upgrade and enough coal for 1:1 conversion
				if (steelRatio && coal.value >= self.effects["ironPerTick"] * self.on * steelRatio) {
					
					self.effects["steelPerTick"] = self.effects["ironPerTick"] * self.on * steelRatio / 100;
					
					iron.value += self.effects["ironPerTick"] * self.on * (1 - steelRatio);
					coal.value -= self.effects["ironPerTick"] * self.on * steelRatio;
					steel.value += self.effects["steelPerTick"];
					
				} else {
					iron.value += self.effects["ironPerTick"] * self.on;
				}
				
				//display the effect of the steel conversion
				
				self.effects["ironPerTick"] = self.effects["ironPerTick"] * (1 - steelRatio);

				var titanium = game.resPool.get("titanium");
				titanium.value += self.effects["titaniumPerTick"] * self.on ;
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
		on: 0,
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
			"coalRatioGlobal" : -0.8,	//to be revisited later
			"magnetoBoostRato" : 0.15
		},
		action: function(self, game){
			if (self.on < 1){
				return;
			}
			
			if (game.workshop.get("printingPress").researched){
				var amt = 0.0005 * self.on;						// 2 per year per SW
				
				if (game.workshop.get("offsetPress").researched){
					amt *= 4;
				}
				game.resPool.get("manuscript").value += amt;
			}

			var coalRatio = game.workshop.getEffect("coalRatioGlobal");
			self.effects["coalRatioGlobal"] = -0.8 + coalRatio;

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
					var autoWood = wood.value * ( baseAutomationRate + baseAutomationRate * self.on); 
					if (autoWood >= game.workshop.getCraft("beam").prices[0].val){
						var amt = Math.floor(autoWood / game.workshop.getCraft("beam").prices[0].val);
						game.workshop.craft("beam", amt);
						game.msg("Spent " + game.getDisplayValueExt(autoWood) + " wood, +" + game.getDisplayValueExt(amt + amt * ratio) + " beams!");
					}
				}
				if (minerals.value >= minerals.maxValue * (1 - baseAutomationRate)){
					var autoMinerals = minerals.value * ( baseAutomationRate + baseAutomationRate * self.on); 
					if (autoMinerals > game.workshop.getCraft("slab").prices[0].val){
						var amt = Math.floor(autoMinerals / game.workshop.getCraft("slab").prices[0].val);
						game.workshop.craft("slab", amt);
						game.msg("Spent " + game.getDisplayValueExt(autoMinerals) + " minerals, +" + game.getDisplayValueExt(amt + amt * ratio) + " slabs!");
					}
				}
				
				if (game.workshop.get("pneumaticPress").researched && iron.value >= iron.maxValue * (1 - baseAutomationRate)){
					var autoIron = iron.value * ( baseAutomationRate + baseAutomationRate * self.on); 
					
					if (autoIron > game.workshop.getCraft("plate").prices[0].val){
						var amt = Math.floor(autoIron / game.workshop.getCraft("plate").prices[0].val);
						game.workshop.craft("plate", amt);
						game.msg("Spent " + game.getDisplayValueExt(autoIron) + " iron, +" + game.getDisplayValueExt(amt + amt * ratio) + " plates!");
					}
				}
			}
		},
		val: 0
	},{
		name: "magneto",
		label: "Magneto",
		description: "Improves your total resource production by 2%. Every steamworks will boost this effect by 15%. Consumes oil.",
		unlocked: false,
		enabled: false,
		togglable: true,
		tunable: true,
		on: 0,
		jammed: false,
		prices: [
			{ name : "alloy", val: 10 },
			{ name : "gear",  val: 5 },
			{ name : "blueprint",  val: 1 }
		],
		priceRatio: 1.25,
		ignorePriceCheck: true,
		requiredTech: ["electricity"],
		handler: function(btn){

		},
		effects: {
			"oilPerTick" : -0.05,
			"magnetoRatio": 0.02
		},
		action: function(self, game){
			if (self.on < 1){
				return;
			}
			var oil = game.resPool.get("oil");
			oil.value += self.effects["oilPerTick"] * self.on;
			
			if (oil.value <= 0){
				self.on--;//Turn off one per tick until oil flow is sufficient
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
		canUpgrade: true,
		action: function(self, game){
			var ratio = game.workshop.getEffect("lumberMillRatio");
			self.effects["woodRatio"] = 0.1 + 0.1*ratio;
		}
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
		ignorePriceCheck: true,
		handler: function(btn){},
		val: 0,
		requiredTech: ["chemistry"],
		canUpgrade: true,
		action: function(self, game){
			var ratio = game.workshop.getEffect("oilRatio");
			self.effects["oilPerTickBase"] = 0.02 + 0.02*ratio;
		}
	},
	//----------------------------------- Other ----------------------------------------
	{
		name: "workshop",
		label: "Workshop",
		description: "Provides a vast variety of upgrades\nImproves craft effectiveness by 6%",
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
		val: 0
	},{
		name: "factory",
		label: "Factory",
		description: "Improves craft effectiveness by 5%",
		unlocked: false,
		ignorePriceCheck: true,
		prices: [
			{ name : "titanium", val: 2000 },
			{ name : "plate", val: 2500},
			{ name : "concrate", val: 15}
		],
		effects: {
			"craftRatio" : 0.05
		},
		priceRatio: 1.15,
		handler: function(btn){
			btn.game.workshopTab.visible = true;
		},
		val: 0,
		requiredTech: ["mechanization"],
	},{
		name: "reactor",
		label: "Reactor",
		description: "Provides a 5% boost to production while active. Requires uranium to operate. (WIP)",
		unlocked: false,
		ignorePriceCheck: true,
		togglable: true,
		tunable: true,
		on: 0,
		prices: [
			{ name : "titanium",    val: 3500 },
			{ name : "plate", 		val: 5000},
			{ name : "concrate",    val: 50},
			{ name : "blueprint",   val: 25},
		],
		effects: {
			"uraniumPerTick" : -0.001,
			"productionRatio": 0.05
		},
		priceRatio: 1.15,
		handler: function(btn){
			btn.game.workshopTab.visible = true;
		},
		val: 0,
		requiredTech: ["nuclearFission"],
		action: function(self, game){
			var uranium = game.resPool.get("uranium");
			
			uranium.value -= self.on * 
				-self.effects["uraniumPerTick"] * (1-this.game.workshop.getEffect("uraniumRatio"));

			if (uranium.value <= 0){
				self.on = 0;
				self.enabled = false;
			}
		}
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
	},{
		name: "mint",
		label: "Mint",
		description: "Converts small percent of your total manpower to luxury resources. Uses 0.75 manpower per tick and a bit of gold.",
		unlocked: false,
		togglable: true,
		tunable: true,
		on: 0,
		enabled: false,
		prices: [
			{ name : "minerals", val: 5000 },
			{ name : "plate", val: 200 },
			{ name : "gold", val: 500 }
		],
		effects: {
			"mintEffect" : 0.007,
			"manpowerPerTick" : -0.75,
			"goldPerTick" : -0.005		//~5 smelters
		},
		priceRatio: 1.15,
		handler: function(btn){},
		val: 0,
		requiredTech: ["architecture"],
		ignorePriceCheck: true,
		action: function(self, game){
			if (self.on < 1){
				return;
			}
			
			var mpower = game.resPool.get("manpower");
			var gold = game.resPool.get("gold");
			
			
			if (mpower.value > self.on * -self.effects["manpowerPerTick"] &&
				gold.value > self.on * -self.effects["goldPerTick"]
			){
				mpower.value -= self.on * -self.effects["manpowerPerTick"];
				gold.value -= self.on * -self.effects["goldPerTick"];
				
				
				var manpower = game.resPool.get("manpower");
				var mpratio = (manpower.maxValue * self.effects["mintEffect"]) / 100;

				self.effects["fursPerTick"]  = mpratio * 1.25;	//2
				self.effects["ivoryPerTick"] = mpratio * 0.3;	//1.5
				
				//var furs = game.resPool.get("furs");
				//var ivory = game.resPool.get("ivory");
				
				game.resPool.addResAmt("furs", self.effects["fursPerTick"] * self.on);
				game.resPool.addResAmt("ivory", self.effects["ivoryPerTick"] * self.on);
				
				//furs.value += self.effects["fursPerTick"];
				//ivory.value += self.effects["ivoryPerTick"];
			}
		}
	},
	//-------------------------- Culture -------------------------------
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
		}
	},{
		name: "chapel",
		label: "Chapel",
		description: "+0.05 culture per tick, a bit of faith per tick. +200 to max culture",
		unlocked: false,
		prices: [
			{ name : "minerals", val: 2000 },
			{ name : "culture",  val: 250 },
			{ name : "parchment", val: 250 }
		],
		effects: {
			"culturePerTickBase" : 0.05,
			"faithPerTickBase" : 0.005,
			"cultureMax" : 200
		},
		priceRatio: 1.15,
		ignorePriceCheck: true,
		handler: function(btn){},
		val: 0,
		requiredTech: ["acoustics"],
		action: function(self, game){
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
			
			self.effects["faithMax"] = 100;

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
				self.effects["faithMax"] += 50;
			}
			
			var goldenSpire = game.religion.getRU("goldenSpire");
			if (goldenSpire.researched){
				self.effects["faithMax"] += self.effects["faithMax"] * 0.5;
			}
			
			
			var basilica = game.religion.getRU("basilica");
			if (basilica.researched){
				self.effects["cultureMax"] = 75;
				self.effects["culturePerTickBase"] = 0.2;
			}
			
			var sunAltar = game.religion.getRU("sunAltar");
			if (sunAltar.researched){
				self.effects["happiness"] = 0.5;
			}
			
			var templars = game.religion.getRU("templars");
			if (templars.researched){
				self.effects["manpowerMax"] = 75;
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
		description: "The dark legacy of the lost race.\n May have special usage once Theology is researched.",
		unlocked: false,
		prices: [
			{ name : "megalith", val: 75 },
			{ name : "scaffold", val: 50 },
			{ name : "blueprint", val: 1 }
		],
		effects: {
		},
		priceRatio: 1.25,
		unlockRatio: 0.05,	//5% of resources required to unlock building instead of default 30
		handler: function(btn){
		},
		val: 0,
		requiredTech: ["construction"],
		canUpgrade: true
	}
	
	],
	
	effectsBase: {
		"manpowerMax"	: 100,
		"catnipMax"		: 5000,
		"woodMax"		: 200,
		"mineralsMax"	: 250,
		"faithMax" 		: 100,
		"cultureMax"	: 100
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
	
	getAutoProductionRatio: function(){
		var autoProdRatio = 1;
				
		//	faith
		if (this.game.religion.getRU("solarRevolution").researched){
			autoProdRatio *= ( 1 + (this.game.religion.getProductionBonus() / 100));
		}
		//	SW
		var steamworks = this.get("steamworks");
		var swRatio = steamworks.on > 0 ? (1+ steamworks.effects["magnetoBoostRato"] * this.get("steamworks").on) : 1;
			autoProdRatio *= (1 + this.getEffect("magnetoRatio") * swRatio);
			
		// paragon (25%)
		var paragonRatio = this.game.resPool.get("paragon").value * 0.01;
		paragonRatio = this.getHyperbolicEffect(paragonRatio, 2);	//well, 200 paragon is probably the END OF THE LINE
		
			autoProdRatio *= (1 + paragonRatio * 0.25);
			
		// reactors
		autoProdRatio *= (1 + this.getEffect("productionRatio"));
			
		return autoProdRatio;
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
		
		totalEffect += this.getEffectCached(name);
		
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
	 * Updated 7/8/2014: Update for limits that aren't 1. They would scale at the same speed as a limit of 1 and wouldn't properly approach the limit.
	 */ 
	getHyperbolicEffect: function(effect, limit){
		var absEffect = Math.abs(effect);
		
		var maxUndiminished = 0.75 * limit; //first 75% is free from diminishing returns
				
		if (absEffect <= maxUndiminished) {
			//Not high enough for diminishing returns to apply
			return effect < 0 ? -absEffect : absEffect;
		}
		
		var diminishedPortion = absEffect - maxUndiminished;
		
		var delta = .25*limit; //Lower values will approach 1 more quickly.
		
		// The last 25% will approach .25 but cannot actually reach it
		var diminishedEffect = (1-(delta/(diminishedPortion+delta)))*.25*limit;
		
		var totalEffect = maxUndiminished+diminishedEffect;

		return effect < 0 ? -totalEffect : totalEffect;
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
				
				var unlockRatio = 0.3;
				if (building.unlockRatio){
					unlockRatio = building.unlockRatio;
				}

				var res = this.game.resPool.get(price.name);
				if (res.value < price.val * unlockRatio){	// 30% required to unlock structure
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
						if(savedBld.on){
							bld.on = savedBld.on;
						}
						
						if (savedBld.jammed){
							bld.jammed = savedBld.jammed;
						}
						
						bld.enabled = savedBld.enabled;

					}
			}
		}
	},
	
	//TODO: do we need it?
	reset: function(){
		for (var i = 0; i < this.buildingsData.length; i++){
			var bld = this.buildingsData[i];
			
			bld.val = 0;
			bld.on = 0;
		}
	}
});


dojo.declare("com.nuclearunicorn.game.ui.BuildingBtn", com.nuclearunicorn.game.ui.ButtonModern, {
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
			
			var building = this.getBuilding();

			if (building){
				building.val++;
				
				//to not force player re-click '+' button all the time
				if (building.on && building.tunable){
					building.on++;
				}
				
				//price check is sorta heavy operation, so we will store the value in the button
				this.prices = this.getPrices();	
			}
			
			if (building.togglable && (!building.on)) {
				building.on = 0;
			}
			
			if (!building.tunable && building.enabled){
				building.on = building.val;
			}
			
			this.game.render();
		}
	},

	getName: function(){
		var building = this.getBuilding();
		if (building){
			if (building.togglable) {
				var name = this.name;
				
				var postfix = building.tunable ? ( "|" +building.on ) : "";
				return name + " ("+ building.val + postfix + ")";
			} else {
				var name = this.name;
				return name + " (" + building.val + ")";
			}
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

		this.renderLinks();
		
		dojo.connect(this.domNode, "onmouseover", this, dojo.hitch( this, function(){ this.game.selectedBuilding = this.getBuilding(); }));
		dojo.connect(this.domNode, "onmouseout", this, dojo.hitch( this, function(){  this.game.selectedBuilding = null; }));
	},
	
	/**
	 * Render button links like off/on and sell
	 */  
	renderLinks: function(){
		var building = this.getBuilding();
		
		if (building && building.val){
			if (!this.sellHref){
				this.sellHref = dojo.create("a", { href: "#", innerHTML: "sell",
						title: "Sell building for 50% of the price",
						style:{
							paddingLeft: "2px",
							float: "right",
							cursor: "pointer"}
						}, null);
					
				dojo.connect(this.sellHref, "onclick", this, dojo.partial(function(building, event){
					event.stopPropagation();
					event.preventDefault();
					
					building.val--;
					
					if (building.on > building.val){
						building.on = building.val;
					}
					
					this.refund(0.5);
				
					this.prices = this.getPrices();
					this.game.render();
				}, building));
				dojo.place(this.sellHref, this.buttonContent);
			}
		}	
		
		//--------------- toggle ------------
			
		if (!building.action || !building.togglable){
			return;
		}
		if (!this.remove && building.tunable){
			this.remove = this.addLink("-", 
				function(){
					var building = this.getBuilding();
					building.on--;
				}, true	//use | break
			);
		}
		if (!this.add && building.tunable){
			this.add = this.addLink("+", 
				function(){
					var building = this.getBuilding();
					building.on++;
				},true	//use | break
			);
		}
		
		if (!this.off && !building.tunable){
			this.toggle = this.addLink( building.enabled ? "off" : "on", 
				function(){
					var building = this.getBuilding();
					building.enabled = !building.enabled;

					building.on = building.enabled ? building.val : 0;	//legacy safe switch
				}, true	//use | break
			);
		}
		
		if (this.remove){
			dojo.setStyle(this.remove.link, "display", (building.on > 0) ? "" : "none");
			dojo.setStyle(this.remove.linkBreak, "display", (building.on > 0) ? "" : "none");
		}
		if (this.add){
			dojo.setStyle(this.add.link, "display", (building.on < building.val) ? "" : "none");
			dojo.setStyle(this.add.linkBreak, "display", (building.on < building.val) ? "" : "none");
		}
		
		if(building.val > 10) {
			//Steamworks specifically can be too large if 
			dojo.setStyle(this.domNode,"font-size","90%");
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
			
			if (this.remove){
				dojo.setStyle(this.remove.link, "display", (building.on > 0) ? "" : "none");
				dojo.setStyle(this.remove.linkBreak, "display", (building.on > 0) ? "" : "none");
			}
			if (this.add){
				dojo.setStyle(this.add.link, "display", (building.on < building.val) ? "" : "none");
				dojo.setStyle(this.add.linkBreak, "display", (building.on < building.val) ? "" : "none");
			}
			
			if (this.toggle){
				this.toggle.link.innerHTML = building.enabled ? "off" : "on";
			}
	
			dojo.toggleClass(this.domNode, "bldEnabled", (building.on > 0 ? true : false));
			
			if(building.val > 10) {
				dojo.setStyle(this.domNode,"font-size","90%");
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
		var catnipVal = this.game.resPool.get("catnip").value;	
	    // -------------- x100 ----------------
			
		if (!this.x100Href){
			this.x100Href = dojo.create("a", { href: "#", innerHTML: "x100", style:{
					paddingLeft: "4px",
					float: "right",
					cursor: "default",
					display: catnipVal < (100 * 100) ? "none" : ""
				}}, null);
				
			dojo.connect(this.x100Href, "onclick", this, dojo.hitch(this, function(event){
				event.stopPropagation();
				
				var catnipVal = this.game.resPool.get("catnip").value;
				
				if (catnipVal < (100 * 100)){
					this.game.msg("not enough catnip!");
				}
				
				this.game.resPool.get("catnip").value -= (100 * 100);
				
				var isEnriched = this.game.workshop.get("advancedRefinement").researched;
				if (!isEnriched){
					this.game.resPool.get("wood").value += 100;
				} else {
					this.game.resPool.get("wood").value += 200;
				}
				
				this.update();
			}));
			
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
						self.game.gatherTimeoutHandler = setTimeout(function(){ self.game.gatherClicks = 0; }, 2500);	//2.5 sec 
						
						self.game.gatherClicks++;
						if (self.game.gatherClicks >= 2500 && !self.game.ironWill){
							//alert("You are so tired");
							self.game.gatherClicks = 0;
							self.game.cheatMode = true;
						}
				
						self.game.resPool.get("catnip").value++;
						self.game.updateResources();
					 },
			description: "Gather some catnip in the wood"
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
			description: "Refine catnip into catnip wood",
			prices: [ { name : "catnip", val: 100 }]
		}, this.game);
		this.addButton(btn);
		btn.render(container);
	},
	
	update: function(){
		this.inherited(arguments);
	}
});

//---------------------- ab ovo --------------------



dojo.declare("com.nuclearunicorn.game.ui.BuildingBtnModern", com.nuclearunicorn.game.ui.BuildingBtn, {

	afterRender: function(){
		dojo.addClass(this.domNode, "modern");

		this.renderLinks();
		
		dojo.connect(this.domNode, "onmouseover", this, dojo.hitch( this, function(){ this.game.selectedBuilding = this.getBuilding(); }));
		dojo.connect(this.domNode, "onmouseout", this, dojo.hitch( this, function(){  this.game.selectedBuilding = null; }));
		
		/*this.game.attachTooltip(this.domNode, dojo.partial( function(btn){

		}, this));*/
		this.attachTooltip(this.domNode, dojo.partial( function(btn){
			
			var tooltip = dojo.create("div", { style: { 
				width: "280px",
				minHeight:"150px"
			}}, null);
			
			dojo.create("div", { 
				innerHTML: this.getName(), 
				style: {
					textAlign: "center",
					width: "100%",
					borderBottom: "1px solid gray",
					paddingBottom: "4px"
			}}, tooltip);
			
			//----------- description -------
			
			dojo.create("div", { 
				innerHTML: this.description, 
				style: {
					textAlign: "center",
					width: "100%",
					borderBottom: "1px solid gray",
					paddingBottom: "4px",
					fontSize: "15px",
					color: "gray"
			}}, tooltip);
			
			//--------------- prices ----------------
			this.renderPrices(tooltip);
			//---------- effects-------------
			
			dojo.create("div", { 
				innerHTML: "Effects:", 
				style: {
					textAlign: "center",
					width: "100%",
					borderBottom: "1px solid gray",
					paddingBottom: "4px",
					marginBottom: "8px"
			}}, tooltip);
			
			//-----------------------------------------
			
			var bld = this.getBuilding();
			for (effectName in bld.effects){
				var nameSpan = dojo.create("div", { innerHTML: effectName + ": " + this.game.getDisplayValueExt(bld.effects[effectName]), 
					style: { 
						float: "left",
						fontSize: "14px",
						color: "gray",
						clear: "both"
				}}, tooltip );
			}
			
			dojo.create("div", { style: { minHeight:"20px"} }, tooltip);
			
			//-------------- flavor stuff -------------
			
			dojo.create("div", { 
				innerHTML: bld.flavour || "flavor text",
				className: "flavor",
				style: {
					position: "absolute",
					bottom: "2px",
					right: "4px",
					fontSize: "12px",
					fontStyle: "italic"
			}}, tooltip);
			
			return tooltip.outerHTML;
		}, this));
	},
	
	getDescription: function(){
		return "";
	}
});

dojo.declare("com.nuclearunicorn.game.ui.tab.BuildingsModern", com.nuclearunicorn.game.ui.tab, {
	
	bldGroups: null,
	
	activeGroup: null,
	
	constructor: function(tabName){
		this.bldGroups = [];
	},

	render: function(content){
		this.bldGroups = [];

		var topContainer = dojo.create("div", {
			style: {
				paddingBottom : "5px",
				marginBottom: "15px",
				borderBottom: "1px solid gray"
			}
		}, content);
		
		var groups = dojo.clone(this.game.bld.buildingGroups, true);
		
		//non-group filters
		if (this.game.ironWill && this.game.bld.get("library").val > 0){
			groups.unshift({
				name: "iw",
				title: "IW",
				buildings: []
			});
		}
		groups.unshift({
			name: "togglable",
			title: "Togglable",
			buildings: []
		});
		groups.unshift({
			name: "allEnabled",
			title: "Enabled",
			buildings: []
		});
		groups.unshift({
			name: "all",
			title: "All",
			buildings: []
		});
		
		if (!this.activeGroup){
			this.activeGroup = groups[0].name;
		}
		for (var i = 0; i< groups.length; i++){
			var isActiveGroup = (groups[i].name == this.activeGroup);
				
			var hasVisibleBldngs = false;
			for (var j = 0; j< groups[i].buildings.length; j++){
				var bld = this.game.bld.get(groups[i].buildings[j]);
				if (bld.unlocked){
					hasVisibleBldngs = true;
					break;
				}
			}
			if (!groups[i].buildings.length){	//emptry groups are visible by default
				hasVisibleBldngs = true;
			}

			var separator = null;
			if ( i != 0){
				separator = dojo.create("span", { 
					innerHTML: " | ",
					style: {
						display: hasVisibleBldngs ? "" : "none"
					} 
				}, topContainer);
			}

			var tab = dojo.create("a", { 
				innerHTML: groups[i].title,
				href: "#",
				style: {
					display: hasVisibleBldngs ? "" : "none",
					whiteSpace: "nowrap",
				},
				className: isActiveGroup ? "activeTab" : ""
			}, topContainer);
			
			this.bldGroups.push({
				group: groups[i],
				visible: hasVisibleBldngs,
				tab: tab,
				separator: separator
			});
			
			dojo.connect(tab, "onclick", this, dojo.partial(function(groupName){ 
				this.activeGroup = groupName;
				this.game.render();
			}, groups[i].name));
		}
		
		
		var groupContainer = dojo.create("div", { className: "bldGroupContainer"}, topContainer);
		this.groupContainer = groupContainer;
		
		this.renderActiveGroup(groupContainer);
	},
	
	renderActiveGroup: function(groupContainer){
		
		dojo.empty(groupContainer);
		this.buttons = [];

		for( var i = 0; i< this.bldGroups.length; i++){
			if (this.bldGroups[i].group.name != this.activeGroup){
				if (this.activeGroup != "all" && 
					this.activeGroup != "allEnabled" && 
					this.activeGroup != "togglable" &&
					this.activeGroup != "iw"){
							
						continue;
				}
			}
			if (i == 0){
				this.addCoreBtns(groupContainer);
			}
			this.twoRows = (this.activeGroup == "all" || this.activeGroup == "iw");
			this.initRenderer(groupContainer);
			
			var group = this.bldGroups[i].group;
			
			
			for (var j = 0; j< group.buildings.length; j++){
				var bldName = group.buildings[j];
				var bld = this.game.bld.get(bldName);

				var btn = new com.nuclearunicorn.game.ui.BuildingBtnModern({
					name: 			bld.label,		
					description: 	bld.description,
					building: 		bld.name,
					handler: 		bld.handler
				}, this.game);
				
				if (this.activeGroup == "allEnabled"){
					if (!btn.hasResources()){
						continue;
					}
				}
				if (this.activeGroup == "togglable"){
					if (!bld.togglable){
						continue;
					}
				}
				
				if (this.activeGroup == "iw"){
					if (group.name == "population"){
						continue;
					}
				}
				
				btn.update();
				if (!btn.visible){
					continue;	//skip invisible buttons to not make gaps in the two rows renderer
				}

				this.addButton(btn);
			}
		}
		
		for (var i = 0; i< this.buttons.length; i++){
			var buttonContainer = this.twoRows ? 
						this.getElementContainer(i) : groupContainer;
			this.buttons[i].render(buttonContainer);
		}
	},
	
	addCoreBtns: function(container){
		var self = this;
		var btn = new com.nuclearunicorn.game.ui.GatherCatnipButton({
			name:	 "Gather catnip", 
			handler: function(){
						clearTimeout(self.game.gatherTimeoutHandler);
						self.game.gatherTimeoutHandler = setTimeout(function(){ self.game.gatherClicks = 0; }, 2500);	//2.5 sec 
						
						self.game.gatherClicks++;
						if (self.game.gatherClicks >= 2500 && !self.game.ironWill){
							//alert("You are so tired");
							self.game.gatherClicks = 0;
							self.game.cheatMode = true;
						}
				
						self.game.resPool.get("catnip").value++;
						self.game.updateResources();
					 },
			description: "Gather some catnip in the wood"
		}, this.game);
		this.addButton(btn);
		//btn.render(container);
		
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
		//btn.render(container);
	},
	
	update: function(){
		this.inherited(arguments);
	}
});
