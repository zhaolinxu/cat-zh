dojo.declare("classes.managers.WorkshopManager", com.nuclearunicorn.core.TabManager, {

	game: null,

	hideResearched: false,

	upgrades:[
		//--------------------- food upgrades ----------------------
		{
		name: "mineralHoes",
		title: "Mineral Hoes",
		description: "Your farmers are 50% more effective",
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
		description: "Your farmers are 30% more effective",
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
	//--------------------- wood upgrades ----------------------
	{
		name: "mineralAxes",
		title: "Mineral Axe",
		description: "Woodcutters are 70% more effective",
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
		description: "Woodcutters are 50% more effective",
		effects: {
			"woodRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 200 },
			{ name : "iron", val: 50 }
		],
		unlocked: true,
		researched: false,
		handler: function(game){
			//do nothing
		}
	},{
		name: "steelAxe",
		title: "Steel Axe",
		description: "Very sharp and durable axes. Woodcutters are 50% more effective",
		effects: {
			"woodRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 20000 },
			{ name : "steel", val: 75 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
			//do nothing
		}
	},{
		name: "steelSaw",
		title: "Steel Saw",
		description: "Improve Lumber Mill efficiency by 20%",
		effects: {
			"lumberMillRatio" : 0.2
		},
		prices:[
			{ name : "science", val: 52000 },
			{ name : "steel", val: 750 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
			game.workshop.get("titaniumSaw").unlocked = true;
		}
	},{
		name: "titaniumSaw",
		title: "Titanium Saw",
		description: "Improve Lumber Mill efficiency by 15%",
		effects: {
			"lumberMillRatio" : 0.15
		},
		prices:[
			{ name : "science", val: 70000 },
			{ name : "titanium", val: 500 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
			game.workshop.get("alloySaw").unlocked = true;
		}
	},{
		name: "alloySaw",
		title: "Alloy Saw",
		description: "Improve Lumber Mill efficiency by 15%",
		effects: {
			"lumberMillRatio" : 0.15
		},
		prices:[
			{ name : "science", val: 85000 },
			{ name : "alloy", val: 75 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
		}
	},{
		name: "titaniumAxe",
		title: "Titanium Axe",
		description: "Indestructible axes. Woodcutters are 50% more effective.",
		effects: {
			"woodRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 38000 },
			{ name : "titanium", val: 10 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
			//do nothing
		}
	},{
		name: "alloyAxe",
		title: "Alloy Axe",
		description: "The more you use them, the sharper they are! Woodcutters are 50% more effective.",
		effects: {
			"woodRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 70000 },
			{ name : "alloy", val: 25 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
			//do nothing
		}
	},
	//--------------------- unobtainium stuff --------------------------
	{
		name: "unobtainiumAxe",
		title: "Unobtainium Axe",
		description: "Those axes are literally unobtainable! Woodcutters are 50% more effective.",
		effects: {
			"woodRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 125000 },
			{ name : "unobtainium", val: 75 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
			//do nothing
		}
	},
	{
		name: "unobtainiumSaw",
		title: "Unobtainium Saw",
		description: "Improve Lumber Mill efficiency by 25%",
		effects: {
			"lumberMillRatio" : 0.25
		},
		prices:[
			{ name : "science", val: 145000 },
			{ name : "unobtainium", val: 125 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
		}
	},
	//--------------------- storage upgrades ----------------------
	{
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
			{ name : "iron", val: 50 }
		],
		unlocked: true,
		researched: false,
		handler: function(game){
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
			{ name : "beam", val: 25 },
			{ name : "slab", val: 10 },
			{ name : "iron", val: 100 }
		],
		unlocked: true,
		researched: false,
		handler: function(game){
			game.workshop.get("titaniumBarns").unlocked = true;
		}
	},{
		name: "reinforcedWarehouses",
		title: "Reinforced Warehouses",
		description: "Warehouses store 25% more resources",
		effects: {
			"warehouseRatio" : 0.25
		},
		prices:[
			{ name : "science", val: 15000 },
			{ name : "plate", val: 50 },
			{ name : "steel", val: 50 },
			{ name : "scaffold", val: 25 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
			game.workshop.get("ironwood").unlocked = true;
		}
	},{
		name: "titaniumBarns",
		title: "Titanium Barns",
		description: "Barns store twice as many resources",
		effects: {
			"barnRatio" : 1
		},
		prices:[
			{ name : "science", val: 60000 },
			{ name : "titanium", val: 25 },
			{ name : "steel",    val: 200 },
			{ name : "scaffold", val: 250 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
		}
	},{
		name: "alloyBarns",
		title: "Alloy Barns",
		description: "Barns store twice as many resources",
		effects: {
			"barnRatio" : 1
		},
		prices:[
			{ name : "science", val: 75000 },
			{ name : "alloy", val: 20 },
			{ name : "plate",    val: 750 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
		}
	},{
		name: "concreteBarns",
		title: "Concrete Barns",
		description: "Barns store 75% more resources",
		effects: {
			"barnRatio" : 0.75
		},
		prices:[
			{ name : "science", val: 100000 },
			{ name : "concrate", val: 45 },
			{ name : "titanium",    val: 2000 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
		}
	},{
		name: "titaniumWarehouses",
		title: "Titanium Warehouses",
		description: "Warehouses store 50% more resources",
		effects: {
			"warehouseRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 70000 },
			{ name : "titanium", val: 50 },
			{ name : "steel",    val: 500 },
			{ name : "scaffold", val: 500 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
		}
	},{
		name: "alloyWarehouses",
		title: "Alloy Warehouses",
		description: "Warehouses store 45% more resources",
		effects: {
			"warehouseRatio" : 0.45
		},
		prices:[
			{ name : "science", val: 90000 },
			{ name : "titanium", val: 750 },
			{ name : "alloy",    val: 50 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
		}
	},{
		name: "concreteWarehouses",
		title: "Concrete Warehouses",
		description: "Warehouses store 35% more resources",
		effects: {
			"warehouseRatio" : 0.35
		},
		prices:[
			{ name : "science", val: 100000 },
			{ name : "titanium", val: 1250 },
			{ name : "concrate", val: 35 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
		}
	},
	//==================== accelerators ==============
	{
		name: "energyRifts",
		title: "Energy Rifts",
		description: "Accelerators will now create rifts to a pocket dimension",
		effects: {
		},
		prices:[
			{ name : "science", val: 200000 },
			{ name : "titanium", val: 7500 },
			{ name : "uranium", val: 250 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
		}
	},{
		name: "stasisChambers",
		title: "Stasis Chambers",
		description: "Energy Rifts are 75% more effective",
		effects: {
			"acceleratorRatio" : 0.75
		},
		prices:[
			{ name : "science", val: 235000 },
			{ name : "alloy", val: 	 250 },
			{ name : "uranium", val: 2500 },
			{ name : "timeCrystal", val: 5 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
		}
	},{
		name: "lhc",
		title: "LHC",
		description: "Every accelerator will provide a bonus to the maximum science",
		prices:[
			{ name : "science", val: 250000 },
			{ name : "unobtainium", val: 100 },
			{ name : "alloy", val: 150 },
		],
		effects: {
		},
		unlocked: false,
		researched: false,
		handler: function(game){
		}
	},
	//	------------- harbour stuff ------------
	{
		name: "cargoShips",
		title: "Cargo Ships",
		description: "Every ship will give a 1% bonus to the Harbour capacity",
		effects: {
			"harborRatio" : 0.01
		},
		prices:[
			{ name : "science", val: 55000 },
			{ name : "blueprint", val: 15 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
		},
		flavor: "It's like a tuna can, but bigger"
	},{
		name: "barges",
		title: "Barges",
		description: "Harbours store more coal",
		effects: {
			"harborCoalRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 100000 },
			{ name : "titanium", val: 1500 },
			{ name : "blueprint", val: 30 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
		}
	},{
		name: "reactorVessel",
		title: "Reactor Vessel",
		description: "Every reactor improves ship potential by 5%",
		effects: {
			"shipLimit" : 0.05
		},
		prices:[
			{ name : "science", val: 135000 },
			{ name : "titanium", val: 5000 },
			{ name : "uranium",  val: 125 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
		}
	},{
		name: "ironwood",
		title: "Ironwood Huts",
		description: "Hut price ratio reduced by 50%",
		effects: {
			"hutPriceRatio" : -0.5
		},
		prices:[
			{ name : "science", val: 30000 },
			{ name : "wood", val: 15000 },
			{ name : "iron", val: 3000 },
		],
		unlocked: false,
		researched: false,
		handler: function(game){
			game.workshop.get("silos").unlocked = true;
		}
	},{
		name: "concreteHuts",
		title: "Concrete Huts",
		description: "Hut price ratio reduced by 35%",
		effects: {
			"hutPriceRatio" : -0.35
		},
		prices:[
			{ name : "science", val: 125000 },
			{ name : "concrate", val: 50 },
			{ name : "titanium", val: 3000 },
		],
		unlocked: false,
		researched: false,
		handler: function(game){
		}
	},{
		name: "unobtainiumHuts",
		title: "Unobtainium Huts",
		description: "Hut price ratio reduced by 30%",
		effects: {
			"hutPriceRatio" : -0.30
		},
		prices:[
			{ name : "science", val: 200000 },
			{ name : "unobtainium", val: 500 },
			{ name : "titanium", val: 15000 },
		],
		unlocked: false,
		researched: false,
		handler: function(game){
		}
	},
	{
		name: "silos",
		title: "Silos",
		description: "Warehouses can now store catnip",
		effects: {
		},
		prices:[
			{ name : "science", val: 50000 },
			{ name : "steel", val: 125 },
			{ name : "blueprint", val: 5 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
			game.bld.get("warehouse").effects["catnipMax"] = 750;
			game.workshop.get("titaniumWarehouses").unlocked = true;
		},
		flavor: "With carpeting and climbing holds of course"
	},{
		name: "refrigeration",
		title: "Refrigeration",
		description: "Expands catnip limit by 75%",
		effects: {
			"catnipMaxRatio" : 0.75
		},
		prices:[
			{ name : "science", val: 125000 },
			{ name : "titanium", val: 2500 },
			{ name : "blueprint", val: 15 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
		}
	},
	//--------------------- hunt upgrades ----------------------
	{
		name: "compositeBow",
		title: "Composite Bow",
		description: "An improved version of a bow which provides a permanent +50% boost to the catpower production",
		effects: {
			"manpowerRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 500 },
			{ name : "iron", val: 100 },
			{ name : "wood", val: 200 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
			//do nothing
		}
	},{
		name: "crossbow",
		title: "Crossbow",
		description: "An improved version of a bow which provides a permanent +25% boost to the catpower production",
		effects: {
			"manpowerRatio" : 0.25
		},
		prices:[
			{ name : "science", val: 12000 },
			{ name : "iron", val: 1500 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
			//do nothing
		}
	},{
		name: "railgun",
		title: "Railgun",
		description: "Deadly electromagnetic weapon. +25% boost to the catpower production",
		effects: {
			"manpowerRatio" : 0.25
		},
		prices:[
			{ name : "science", val: 150000 },
			{ name : "titanium", val: 5000 },
			{ name : "blueprint", val: 25 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
			//do nothing
		}
	},{
		name: "bolas",
		title: "Bolas",
		description: "Throwing weapon made of heavy stone weights. Your hunters are twice as effective",
		effects: {
			"hunterRatio" : 1
		},
		prices:[
			{ name : "science", val: 1000 },
			{ name : "minerals", val: 250 },
			{ name : "wood", val: 50 }
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
			"hunterRatio" : 2
		},
		prices:[
			{ name : "science", val: 2000 },
			{ name : "iron", val: 750 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
			//do nothing
		}
	},{
		name: "steelArmor",
		title: "Steel Armour",
		description: "Hunters are a bit more effective",
		effects: {
			"hunterRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 10000 },
			{ name : "steel", val: 50 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
			//do nothing
		}
	},{
		name: "alloyArmor",
		title: "Alloy Armour",
		description: "Hunters are a bit more effective",
		effects: {
			"hunterRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 50000 },
			{ name : "alloy", val: 25 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
			//do nothing
		}
	},{
		name: "nanosuits",
		title: "Nanosuits",
		description: "Maximum catpower!",
		effects: {
			"hunterRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 185000 },
			{ name : "alloy", val: 250 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
			//do nothing
		}
	},{
		name: "caravanserai",
		title: "Caravanserai",
		description: "Your tradeposts have a very minor effect on race standing",
		effects: {
			"standingRatio" : 0.35	//0.35% per tradepost
		},
		prices:[
			{ name : "science", val: 25000 },
			{ name : "ivory", val: 10000 },
			{ name : "gold", val: 250 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
			//do nothing
		},
		flavor: "Now hiring: cuter kittens"
	},
	//--------------------- stuff ----------------------
	{
		name: "advancedRefinement",
		title: "Catnip Enrichment",
		description: "Catnip refines twice as well",
		effects: {
		},
		prices:[
			{ name : "science", val: 500 },
			{ name : "catnip", val: 5000 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
			game.workshop.getCraft("wood").prices = [{name: "catnip", val: 50}];
		},
		flavor: "It's all fun and games 'til someone gets pounced"
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
		handler: function(game){
			game.workshop.get("geodesy").unlocked = true;
		},
		unlocked: false,
		researched: false,
		flavor: "Shiny!"
	},{
		name: "geodesy",
		title: "Geodesy",
		description: "Geologists are more effective and can find gold.",
		effects: {
		},
		prices:[
			{ name : "titanium", val: 250 },
			{ name : "starchart", val: 500 },
			{ name : "science",  val: 90000 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
			var gJob = game.village.getJob("geologist");
			gJob.modifiers["coal"] += 0.0075;	//instead of 0.015
			gJob.modifiers["gold"] = 0.0008;
			if (game.workshop.get("miningDrill").researched){
				gJob.modifiers["gold"] += 0.0005;
			}
			if (game.workshop.get("unobtainiumDrill").researched){
				gJob.modifiers["gold"] += 0.0005;
			}
		},
		flavor: "Gold sniffing cats"
	},
	//TODO: thouse two upgrades may be buggy like hell, we should really really revisit handler logic
	{
		name: "miningDrill",
		title: "Mining Drill",
		description: "Geologists are more effective",
		effects: {
		},
		prices:[
			{ name : "titanium", val: 1750 },
			{ name : "steel", 	 val: 750 },
			{ name : "science",  val: 100000 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
			var gJob = game.village.getJob("geologist");
			gJob.modifiers["coal"] += 0.010;
			if (game.workshop.get("geodesy").researched){
				gJob.modifiers["gold"] += 0.0005;
			}
		}
	},{
		name: "unobtainiumDrill",
		title: "Unobtainium Drill",
		description: "Geologists are even more effective",
		effects: {
		},
		prices:[
			{ name : "unobtainium", val: 250 },
			{ name : "alloy", 	 	val: 1250 },
			{ name : "science",  	val: 250000 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
			var gJob = game.village.getJob("geologist");
			gJob.modifiers["coal"] += 0.015;
			if (game.workshop.get("geodesy").researched){
				gJob.modifiers["gold"] += 0.0005;
			}
		}
	},
	//--------------------- coal upgrades ----------------------
	{
		name: "coalFurnace",
		title: "Coal Furnace",
		description: "Smelters produce coal while burning wood",
		effects: {
		},
		prices:[
			{ name : "minerals", val: 5000 },
			{ name : "iron", 	 val: 2000 },
			{ name : "beam", 	 val: 35 },
			{ name : "science",  val: 5000 }
		],
		unlocked: false,
		researched: false,
		flavor: "So warm... so sleepy..."
	},{
		name: "deepMining",
		title: "Deep Mining",
		description: "Mines will also produce coal",
		effects: {
		},
		prices:[
			{ name : "iron", 	 val: 1200 },
			{ name : "beam", 	 val: 50 },
			{ name : "science",  val: 5000 }
		],
		unlocked: false,
		researched: false,
		flavor: "Yummy Canaries!"
	},{
		name: "pyrolysis",
		title: "Pyrolysis",
		description: "Coal output is boosted by 20%",
		effects: {
			"coalRatio": 0.2	//may be buggy
		},
		prices:[
			{ name : "compedium", 	 val: 5 },
			{ name : "science",  val: 35000 }
		],
		unlocked: false,
		researched: false
	},{
		name: "electrolyticSmelting",
		title: "Electrolytic Smelting",
		description: "Smelters are twice as effective",
		effects: {
			"smelterRatio": 0.95
		},
		prices:[
			{ name : "titanium", val: 2000 },
			{ name : "science",  val: 100000 }
		],
		unlocked: false,
		researched: false
	},{
		name: "oxidation",
		title: "Oxidation",
		description: "Calciners are twice as effective at producing iron and 4 times at producing titanium",
		effects: {
			"calcinerRatio": 0.95
		},
		prices:[
			{ name : "steel", val: 5000 },
			{ name : "science",  val: 100000 }
		],
		unlocked: false,
		researched: false
	},{
		name: "steelPlants",
		title: "Steel Plants",
		description: "10% of the calciners' iron output will be converted to steel",
		effects: {
			"calcinerSteelRatio" : 0.1
		},
		prices:[
			{ name : "titanium", val: 3500 },
			{ name : "gear", 	 val: 750 },
			{ name : "science",  val: 140000 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){

		}
	},{
		name: "rotaryKiln",
		title: "Rotary Kiln",
		description: "Calciners are 75% more effective at producing iron and 3 times at producing titanium",
		effects: {
			"calcinerRatio": 0.75
		},
		prices:[
			{ name : "titanium", val: 5000 },
			{ name : "gear", 	 val: 500 },
			{ name : "science",  val: 145000 }
		],
		unlocked: false,
		researched: false
	},{
		name: "nuclearSmelters",
		title: "Nuclear Smelters",
		description: "Smelters can now produce titanium",
		effects: {
		},
		prices:[
			{ name : "uranium", val: 250 },
			{ name : "science",  val: 165000 }
		],
		unlocked: false,
		researched: false
	},
	//--------------------- automation upgrades ----------------------
	{
		name: "printingPress",
		title: "Printing Press",
		description: "Steamworks automatically print manuscripts",
		effects: {
		},
		prices:[
			{ name : "gear", 	 val: 45 },
			{ name : "science",  val: 7500 }
		],
		unlocked: false,
		researched: false
	},{
		name: "offsetPress",
		title: "Offset Press",
		description: "Printing press is 4 times as effective",
		effects: {
		},
		prices:[
			{ name : "gear", 	 val: 250 },
			{ name : "oil", 	 val: 15000 },
			{ name : "science",  val: 100000 }
		],
		unlocked: false,
		researched: false
	},{
		name: "factoryAutomation",
		title: "Workshop Automation",
		description: "Steamworks convert small quantities of craftable resources to materials when they are at the limit",//Better name than "materials"? "Craftable tools" doesn't make sense either. ~Ædx
		effects: {
		},
		prices:[
			{ name : "gear", 	 val: 25 },
			{ name : "science",  val: 10000 }
		],
		unlocked: false,
		researched: false,
		flavor: "Includes autofeeders"
	},{
		name: "advancedAutomation",
		title: "Advanced Automation",
		description: "Reduce Steamworks' maintainance cycle by 50%",
		effects: {
		},
		prices:[
			{ name : "gear", 	 val: 75 },
			{ name : "blueprint",  val: 25 },
			{ name : "science",  val: 100000 }
		],
		unlocked: false,
		researched: false
	},{
		name: "pneumaticPress",
		title: "Pneumatic Press",
		description: "Workshop automation will also convert iron to plates",
		effects: {
		},
		prices:[
			{ name : "gear", 	 val: 30 },
			{ name : "blueprint",  val: 5 },
			{ name : "science",  val: 20000 }
		],
		unlocked: false,
		researched: false
	},{
		name: "combustionEngine",
		title: "High Pressure Engine",
		description: "Reduces coal consumption of Steamworks by 20%",
		effects: {
			"coalRatioGlobal" : 0.2
		},
		prices:[
			{ name : "gear", 	 val: 25 },
			{ name : "blueprint",  val: 5 },
			{ name : "science",  val: 20000 },
		],
		unlocked: false,
		researched: false
	},{
		name: "fuelInjectors",
		title: "Fuel Injectors",
		description: "Reduces coal consumption of Steamworks by 20%",
		effects: {
			"coalRatioGlobal" : 0.2
		},
		prices:[
			{ name : "gear", 	 val: 250 },
			{ name : "oil", 	 val: 20000 },
			{ name : "science",  val: 100000 }
		],
		unlocked: false,
		researched: false
	},
	//--------------------- science upgrades ----------------------
	{
		name: "celestialMechanics",
		title: "Celestial Mechanics",
		description: "Celestial events and meteors will generate additional science",
		effects: {},
		prices:[
			{ name : "science",  val: 250 },
		],
		unlocked: false,
		researched: false,
		handler: function(game){
		}
	},{
		name: "astrolabe",
		title: "Astrolabe",
		description: "Improves Observatory effectiveness by 50%",
		effects: {},
		prices:[
			{ name : "titanium", val: 5 },
			{ name : "starchart",  val: 75 },
			{ name : "science",  val: 25000 },
		],
		unlocked: false,
		researched: false,
		handler: function(game){
		}
	},
	{
		name: "titaniumMirrors",
		title: "Titanium Reflectors",
		description: "Improved telescope reflectors.\nEvery observatory will give 2% to the Library effectiveness",
		effects: {
			"libraryRatio" : 0.02
		},
		prices:[
			{ name : "titanium", val: 15 },
			{ name : "starchart",  val: 20 },
			{ name : "science",  val: 20000 },
		],
		unlocked: false,
		researched: false,
		flavor: "Did that light spot just move?"
	},
	{
		name: "unobtainiumReflectors",
		title: "Unobtainium Reflectors",
		description: "Improved telescope reflectors.\nEvery observatory will give additional 2% to the Library effectiveness",
		effects: {
			"libraryRatio" : 0.02
		},
		prices:[
			{ name : "unobtainium", val: 75 },
			{ name : "starchart",  val: 750 },
			{ name : "science",  val: 250000 },
		],
		unlocked: false,
		researched: false
	},
	//---------------------- oil ---------------
	{
		name: "pumpjack",
		title: "Pumpjack",
		description: "Improves effectiveness of oil wells by 45%",
		effects: {
			"oilRatio" : 0.45
		},
		prices:[
			{ name : "titanium", val: 250 },
			{ name : "gear", 	 val: 125 },
			{ name : "science",  val: 100000 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){

		}
	},{
		name: "biofuel",
		title: "Biofuel processing",
		description: "Biolabs will convert catnip into oil",
		effects: {
		},
		prices:[
			{ name : "titanium", val: 1250 },
			{ name : "science",  val: 150000 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){

		}
	},
	//------------------- blueprints ----------------
	{
		name: "cadSystems",
		title: "CAD System",
		description: "All scientific buildings will improve effectiveness of blueprint crafting",
		effects: {
			"blueprintCraftRatio" : 0.01
		},
		prices:[
			{ name : "titanium", val: 750 },
			{ name : "science",  val: 125000 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){

		}
	},{
		name: "seti",
		title: "SETI",
		description: "A large array of electronic telescopes. Makes astronomical events automatic and silent",
		effects: {
		},
		prices:[
			{ name : "titanium", val: 250 },
			{ name : "science",  val: 125000 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){

		}
	},{
		name: "augumentation",
		title: "Augmentations",
		description: "Kitten skills are 25% more effective",
		effects: {
			"skillMultiplier" : 0.25
		},
		prices:[
			{ name : "titanium", val: 5000 },
			{ name : "uranium",  val: 50 },
			{ name : "science",  val: 150000 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){

		}
	},{
		name: "enrichedUranium",
		title: "Enriched Uranium",
		description: "Reduce uranium consumption of reactors by 25%",
		effects: {
			"uraniumRatio" : 0.25
		},
		prices:[
			{ name : "titanium", val: 7500 },
			{ name : "uranium",  val: 150 },
			{ name : "science",  val: 175000 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){

		}
	},{
		name: "oilRefinery",
		title: "Oil Refinery",
		description: "Improves effectiveness of oil wells by 35%",
		effects: {
			"oilRatio" : 0.35
		},
		prices:[
			{ name : "titanium", val: 1250 },
			{ name : "gear", 	 val: 500 },
			{ name : "science",  val: 125000 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){

		}
	},
	//------------------- starcharts / space ----------------
	{
		name: "hubbleTelescope",
		title: "Hubble Space Telescope",
		description: "Improves effectiveness of satellites by by 30%",
		effects: {
			"starchartGlobalRatio" : 0.30
		},
		prices:[
			{ name : "alloy", 	 val: 1250 },
			{ name : "oil", 	 val: 50000 },
			{ name : "science",  val: 250000 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){

		}
	},
	{
		name: "astrophysicists",
		title: "Astrophysicists",
		description: "Each scientist will now generate  starcharts",
		effects: {
		},
		prices:[
			{ name : "unobtainium", val: 350 },
			{ name : "science",  val: 250000 }
		],
		unlocked: false,
		researched: false,
		handler: function(game){
			var sJob = game.village.getJob("scholar");
			sJob.modifiers["starchart"] = 0.0001;	//i'm not entirely sure if it is too little or too much
		}
	}
	],

	//=============================================================
	//					     CRAFT RECIPES
	//=============================================================

	crafts:[{
		name: "wood",
		title: "Refine catnip",
		description: "A sturdy block of catnip wood. Difficult to process, but great building material.",
		prices:[
			{name: "catnip", val: 100}
		],
		unlocked: true,
		ignoreBonuses: true,
	},{
		name: "beam",
		title: "Wooden Beam",
		description: "Simple support structure made of a wood. Required for advanced construction.",
		prices:[
			{name: "wood", val: 175}
		],
		unlocked: true
	},{
		name: "slab",
		title: "Stone Slab",
		description: "A small slab composed of minerals. Required for advanced construction.",
		prices:[
			{name: "minerals", val: 250}
		],
		unlocked: true
	},{
		name: "concrate",
		title: "Concrete",
		description: "A block of reinforced concrete.",
		prices:[
			{name: "slab", val: 2500},
			{name: "steel", val: 25}
		],
		unlocked: false
	},{
		name: "plate",
		title: "Metal Plate",
		description: "A metal plate. Required for advanced construction.",
		prices:[
			{name: "iron", val: 125}
		],
		unlocked: true
	},{
		name: "steel",
		title: "Steel",
		description: "A durable metal made by smelting iron and coal. Required for construction of gears and complex machinery.",
		prices:[
			{name: "iron", val: 100},
			{name: "coal", val: 100}
		],
		unlocked: false
	},{
		name: "alloy",
		title: "Alloy",
		description: "A durable alloy of steel, iron and titanium. Required for advanced buildings and upgrades.",
		prices:[
			{name: "steel", val: 75 },
			{name: "titanium", val: 10}
		],
		unlocked: false
	},{
		name: "gear",
		title: "Gear",
		description: "An integral part of automated structures.",
		prices:[
			{name: "steel", val: 15}
		],
		unlocked: true
	},{
		name: "parchment",
		title: "Parchment",
		description: "A material for writing on made from animal skin, required for cultural buildings.",
		prices:[
			{name: "furs", val: 175}
		],
		unlocked: false
	},
	{
		name: "manuscript",
		title: "Manuscript",
		description: "Written document required for technological advancement.",
		prices:[
			{name: "parchment", val: 25},
			{name: "culture", val: 400}
		],
		unlocked: true
	},{
		name: "compedium",
		title: "Compendium",
		description: "A sum of all modern knowledge of the catkind\nEvery compendium will give +10 to max science",
		prices:[
			{name: "manuscript", val: 50},
			{name: "science", val: 10000}
		],
		unlocked: false
	},{
		name: "blueprint",
		title: "Blueprint",
		description: "Strange piece of paper with blue lines.",
		prices:[
			{name: "compedium", val: 25},
			{name: "science", val: 25000}
		],
		unlocked: false
	},
	{
		name: "scaffold",
		title: "Scaffold",
		description: "A large structure made of wood beams required for construction of very complex buildings and objects",
		prices:[
			{ name: "beam", val: 50 }
		],
		unlocked: true
	},{
		name: "ship",
		title: "Trade Ship",
		description: "Ships can be used to discover new civilisations. May improve chances of getting certain rare resources",
		prices:[
			{ name: "scaffold", val: 100 },
			{ name: "plate",    val: 150 },
			{ name: "starchart", val: 25 }
		],
		unlocked: false
	},{
		name: "tanker",
		title: "Tanker",
		description: "Increase maximum oil capacity by 500",
		prices:[
			{ name: "ship", 		val: 250 },
			{ name: "alloy",    	val: 1250 },
			{ name: "blueprint", 	val: 5 }
		],
		unlocked: false
	},{
		name: "megalith",
		title: "Megalith",
		description: "A massive block that can be used to construct enormous structures",
		prices:[
			{ name: "slab", val: 75 },
			{ name: "beam", val: 35 },
			{ name: "plate", val: 5 }
		],
		unlocked: true
	}],

	effectsBase: {
		"scienceMax" : 0
	},
	
	metaCache: null,

	constructor: function(game){
		this.game = game;

		this.registerMeta(this.upgrades, { getEffect : function(upgrade, name){
			if (upgrade.researched){
				return upgrade.effects ? upgrade.effects[name] : 0;
			}
		}});
		
		this.metaCache = {};
	},

	get: function(upgradeName){
		var upgrade = this.metaCache[upgradeName];
		if (upgrade){
			return upgrade;
		}
		
		for (var i = this.upgrades.length - 1; i >= 0; i--) {
			if (this.upgrades[i].name === upgradeName){
				this.metaCache[upgrade] = this.upgrades[i];
				return this.upgrades[i];
			}
		}
		console.error("Failed to get upgrade for id '"+upgradeName+"'");
		return null;
	},

	getCraft: function(craftName){
		for (var i = this.crafts.length - 1; i >= 0; i--) {
			if (this.crafts[i].name === craftName){
				return this.crafts[i];
			}
		}
		console.error("Failed to get craft for id '"+craftName+"'");
		return null;
	},

	save: function(saveData){

		var upgrades = this.filterMetadata(this.upgrades, ["name", "unlocked", "researched"]);
		var crafts = this.filterMetadata(this.crafts, ["name", "unlocked"]);

		saveData.workshop = {
			upgrades: upgrades,
			crafts:   crafts
		}
		saveData.workshop.hideResearched = this.hideResearched;
	},

	load: function(saveData){
		if (saveData.workshop){
			this.hideResearched = saveData.workshop.hideResearched;

			if (saveData.workshop.upgrades && saveData.workshop.upgrades.length){
				for (var i = saveData.workshop.upgrades.length - 1; i >= 0; i--) {
					var savedUpgrade = saveData.workshop.upgrades[i];

					if (savedUpgrade != null){
						var upgrade = this.game.workshop.get(savedUpgrade.name);

						if (upgrade){
							upgrade.unlocked = savedUpgrade.unlocked;
							upgrade.researched = savedUpgrade.researched;

							if (upgrade.researched && upgrade.handler){
								upgrade.handler(this.game);	//just in case update workshop upgrade effects
							}
						}
					}
				}
			}
			//same for craft recipes

			if (saveData.workshop.crafts && saveData.workshop.crafts.length){
				for (var i = saveData.workshop.crafts.length - 1; i >= 0; i--) {
					var savedCraft = saveData.workshop.crafts[i];

					if (savedCraft != null){
						var craft = this.game.workshop.getCraft(savedCraft.name);
						if (craft && !craft.unlocked){					// a little hack to make auto-unlockable recipes work with old saves
							craft.unlocked = savedCraft.unlocked;
						}
					}
				}
			}
		}

		this.invalidateCachedEffects();
	},

	/**
	 * Returns a total effect value per buildings.
	 *
	 * For example, if you have N buildings giving K effect,
	 * total value will be N*K
	 *
	 */
	getEffect: function(name){
		var totalEffect = 0;

		if (this.effectsBase[name]){
			totalEffect += this.effectsBase[name];
		}
		return totalEffect + this.getEffectCached(name);
	},


	craft: function (res, amt){

		var craft = this.getCraft(res);
		var craftRatio = this.game.getResCraftRatio({name:res});

		var craftAmt = amt * (1 + craftRatio);
		var prices = dojo.clone(craft.prices);

		for (var i = prices.length - 1; i >= 0; i--) {
			prices[i].val *= amt;
		}


		if (this.game.resPool.hasRes(prices)){
			this.game.resPool.payPrices(prices);
			this.game.resPool.addResAmt(res,craftAmt);
		}else{
			console.log("not enough resources for", prices);
		}
	},

	//Crafts maximum possible amount for given recipe name
	craftAll: function(craftName){

		var recipe = this.getCraft(craftName);

		var minAmt = Number.MAX_VALUE;
		for (var j = recipe.prices.length - 1; j >= 0; j--) {
			var totalRes = this.game.resPool.get(recipe.prices[j].name).value;
			var allAmt = Math.floor(totalRes / recipe.prices[j].val);
			if (allAmt < minAmt){
				minAmt = allAmt;
			}
		}

		if (minAmt > 0 && minAmt < Number.MAX_VALUE){
			var craftRatio = this.game.getResCraftRatio({name:craftName});
			var bonus = minAmt * craftRatio;

			this.game.msg( "+" + this.game.getDisplayValueExt(minAmt + bonus) + " " + craftName + " crafted");
			this.craft(craftName, minAmt);
		}
	},

	update: function(){
		this.effectsBase["scienceMax"] = Math.floor(this.game.resPool.get("compedium").value * 10);
		this.effectsBase["oilMax"] = Math.floor(this.game.resPool.get("tanker").value * 500);
	}
});

dojo.declare("com.nuclearunicorn.game.ui.UpgradeButton", com.nuclearunicorn.game.ui.ButtonModern, {
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
		if (upgrade.researched/* || !tech.unlocked*/){
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

		if (upgrade.researched && this.game.workshop.hideResearched){
			this.setVisible(false);
		}
	},

	getTooltipHTML: function(){

		var upgrade = this.getUpgrade();
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

		for (effectName in upgrade.effects){
			var nameSpan = dojo.create("div", { innerHTML: effectName + ": " + this.game.getDisplayValueExt(upgrade.effects[effectName]),
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
			innerHTML: upgrade.flavor || "flavor text",
			className: "flavor",
			style: {
				position: "absolute",
				bottom: "2px",
				right: "4px",
				fontSize: "12px",
				fontStyle: "italic"
		}}, tooltip);

		return tooltip.outerHTML;
	}
});

dojo.declare("com.nuclearunicorn.game.ui.CraftButton", com.nuclearunicorn.game.ui.ButtonModern, {
	craftName: null,

	constructor: function(opts, game){
		this.craftName = opts.craft;
	},

	onClick: function(){
		this.animate();
		this.handler(this);
	},

	updateVisible: function(){
		var craft = this.game.workshop.getCraft(this.craftName);

		if (craft.unlocked){	//TBD
			this.setVisible(true);
		}else{
			this.setVisible(false);
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
			innerHTML: this.description,
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

dojo.declare("com.nuclearunicorn.game.ui.tab.Workshop", com.nuclearunicorn.game.ui.tab, {

	craftBtns: null,

	resTd: null,

	constructor: function(tabName, game){
		var self = this;
		this.game = game;

		this.craftBtns = [];

	},

	render: function(tabContainer){

		this.craftBtns = [];
		this.buttons = [];
		
		var div = dojo.create("div", { style: { float: "left"}}, tabContainer);
		dojo.create("span", { innerHTML: "Craft effectiveness: +" + (this.game.bld.getEffect("craftRatio") * 100).toFixed() + "%" }, div);

		//--------------------------------------------------------------------
		var divCombobox = dojo.create("div", {style: { height: "20px"}} , tabContainer);
		var div = dojo.create("div", { style: { float: "right"}}, divCombobox);

		var groupCheckbox = dojo.create("input", {
			id: "toggleResearched",
			type: "checkbox",
			checked: this.game.workshop.hideResearched
		}, div);

		dojo.connect(groupCheckbox, "onclick", this, function(){
			this.game.workshop.hideResearched = !this.game.workshop.hideResearched;

			dojo.empty(tabContainer);
			this.render(tabContainer);
		});

		dojo.create("label", { innerHTML: "Hide researched upgrades", for: "toggleResearched"}, div);
		//---------------------------------------------------------------------

		var upgradePanel = new com.nuclearunicorn.game.ui.Panel("Upgrades", this.game.workshop);
		var content = upgradePanel.render(tabContainer);

		for (var i = 0; i < this.game.workshop.upgrades.length; i++){
			var uprgade = this.game.workshop.upgrades[i];

			var btn = this.createBtn(uprgade);

			btn.updateEnabled();
			btn.updateVisible();

			this.addButton(btn);
			btn.render(content);
		}

		//------------------------------------------

		var craftPanel = new com.nuclearunicorn.game.ui.Panel("Crafting", this.game.workshop);
		var content = craftPanel.render(tabContainer);

		var table = dojo.create("table", {}, content);
		var tr = dojo.create("tr", {}, table);

		//buttons go there
		var td = dojo.create("td", {}, table);

		var self = this;
		var crafts = this.game.workshop.crafts;
		for (var i = 0; i < crafts.length; i++ ){
			var craft =  crafts[i];
			var craftBtn = new com.nuclearunicorn.game.ui.CraftButton({
				name: craft.title,
				description: craft.description,
				craft: craft.name,
				prices: craft.prices,
				handler: dojo.partial(function(craft, btn){
					btn.game.workshop.craft(craft.name, 1);
				}, craft)
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

				var td = dojo.create("td", { innerHTML: res.title || res.name + ":" }, tr);
				var td = dojo.create("td", { innerHTML: this.game.getDisplayValueExt(res.value) }, tr);
			}
		}
	},

	createBtn: function(upgrade){
		var self = this;
		var btn = new com.nuclearunicorn.game.ui.UpgradeButton({
			name : upgrade.title,
			handler: function(btn){
				upgrade.researched = true;

				if (upgrade.handler){
					upgrade.handler(self.game);
				}
			},
			prices: upgrade.prices,
			description: upgrade.description,
			upgrade: upgrade.name
		}, this.game);
		return btn;
	},

	update: function(){
		this.inherited(arguments);

		for (var i = this.craftBtns.length - 1; i >= 0; i--) {
			this.craftBtns[i].update();
		}

		if (this.resTd){
			this.renderResources(this.resTd);
		}
	}
});
