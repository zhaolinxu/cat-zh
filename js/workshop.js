dojo.declare("classes.managers.WorkshopManager", com.nuclearunicorn.core.TabManager, {

	game: null,

	hideResearched: false,

	upgrades:[
		//--------------------- food upgrades ----------------------
		{
		name: "mineralHoes",
		label: "Mineral Hoes",
		description: "Your farmers are 50% more effective",
		effects: {
			"catnipJobRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 100 },
			{ name : "minerals", val: 275 }
		],
		unlocks: {
			upgrades: ["ironHoes"]
		}
	},{
		name: "ironHoes",
		label: "Iron Hoes",
		description: "Your farmers are 30% more effective",
		effects: {
			"catnipJobRatio" : 0.3
		},
		prices:[
			{ name : "science", val: 200 },
			{ name : "iron", val: 25 }
		],
	},
	//--------------------- wood upgrades ----------------------
	{
		name: "mineralAxes",
		label: "Mineral Axe",
		description: "Woodcutters are 70% more effective",
		effects: {
			"woodJobRatio" : 0.7
		},
		prices:[
			{ name : "science", val: 100 },
			{ name : "minerals", val: 500 }
		],
		unlocks: {
			upgrades: ["ironAxes"]
		}
	},{
		name: "ironAxes",
		label: "Iron Axe",
		description: "Woodcutters are 50% more effective",
		effects: {
			"woodJobRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 200 },
			{ name : "iron", val: 50 }
		]
	},{
		name: "steelAxe",
		label: "Steel Axe",
		description: "Very sharp and durable axes. Woodcutters are 50% more effective",
		effects: {
			"woodJobRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 20000 },
			{ name : "steel", val: 75 }
		]
	},{
		name: "reinforcedSaw",
		label: "Reinforced Saw",
		description: "Improve Lumber Mill efficiency by 20%",
		effects: {
			"lumberMillRatio" : 0.2
		},
		prices:[
			{ name : "science", val: 2500 },
			{ name : "iron", val: 1000 }
		],
		upgrades: {
			buildings: ["lumberMill"]
		}
	},{
		name: "steelSaw",
		label: "Steel Saw",
		description: "Improve Lumber Mill efficiency by 20%",
		effects: {
			"lumberMillRatio" : 0.2
		},
		prices:[
			{ name : "science", val: 52000 },
			{ name : "steel", val: 750 }
		],
		upgrades: {
			buildings: ["lumberMill"]
		},
		unlocks: {
			upgrades: ["titaniumSaw"]
		}
	},{
		name: "titaniumSaw",
		label: "Titanium Saw",
		description: "Improve Lumber Mill efficiency by 15%",
		effects: {
			"lumberMillRatio" : 0.15
		},
		prices:[
			{ name : "science", val: 70000 },
			{ name : "titanium", val: 500 }
		],
		upgrades: {
			buildings: ["lumberMill"]
		},
		unlocks: {
			upgrades: ["alloySaw"]
		}
	},{
		name: "alloySaw",
		label: "Alloy Saw",
		description: "Improve Lumber Mill efficiency by 15%",
		effects: {
			"lumberMillRatio" : 0.15
		},
		prices:[
			{ name : "science", val: 85000 },
			{ name : "alloy", val: 75 }
		],
		upgrades: {
			buildings: ["lumberMill"]
		}
	},{
		name: "titaniumAxe",
		label: "Titanium Axe",
		description: "Indestructible axes. Woodcutters are 50% more effective.",
		effects: {
			"woodJobRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 38000 },
			{ name : "titanium", val: 10 }
		]
	},{
		name: "alloyAxe",
		label: "Alloy Axe",
		description: "The more you use them, the sharper they are! Woodcutters are 50% more effective.",
		effects: {
			"woodJobRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 70000 },
			{ name : "alloy", val: 25 }
		]
	},
	//--------------------- unobtainium stuff --------------------------
	{
		name: "unobtainiumAxe",
		label: "Unobtainium Axe",
		description: "Those axes are literally unobtainable! Woodcutters are 50% more effective.",
		effects: {
			"woodJobRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 125000 },
			{ name : "unobtainium", val: 75 }
		]
	},
	{
		name: "unobtainiumSaw",
		label: "Unobtainium Saw",
		description: "Improve Lumber Mill efficiency by 25%",
		effects: {
			"lumberMillRatio" : 0.25
		},
		prices:[
			{ name : "science", val: 145000 },
			{ name : "unobtainium", val: 125 }
		],
		upgrades: {
			buildings: ["lumberMill"]
		}
	},
	//--------------------- storage upgrades ----------------------
	{
		name: "stoneBarns",
		label: "Expanded Barns",
		description: "75% more storage space for wood and iron",
		effects: {
			"barnRatio" : 0.75
		},
		prices:[
			{ name : "science", val: 500 },
			{ name : "wood", val: 1000 },
			{ name : "minerals", val: 750 },
			{ name : "iron", val: 50 }
		],
		upgrades: {
			buildings: ["barn", "warehouse", "harbor"]
		}
	},{
		name: "reinforcedBarns",
		label: "Reinforced Barns",
		description: "80% more storage space for wood and iron",
		effects: {
			"barnRatio" : 0.80
		},
		prices:[
			{ name : "science", val: 800 },
			{ name : "beam", val: 25 },
			{ name : "slab", val: 10 },
			{ name : "iron", val: 100 }
		],
		upgrades: {
			buildings: ["barn", "warehouse", "harbor"]
		},
		unlocks: {
			upgrades: ["titaniumBarns"]
		}
	},{
		name: "reinforcedWarehouses",
		label: "Reinforced Warehouses",
		description: "Storage facilities store 25% more resources",
		effects: {
			"warehouseRatio" : 0.25
		},
		prices:[
			{ name : "science", val: 15000 },
			{ name : "plate", val: 50 },
			{ name : "steel", val: 50 },
			{ name : "scaffold", val: 25 }
		],
		upgrades: {
			buildings: ["barn", "warehouse", "harbor", "mint"]
		},
		unlocks: {
			upgrades: ["ironwood"]
		}
	},{
		name: "titaniumBarns",
		label: "Titanium Barns",
		description: "Storage facilities store twice as many resources",
		effects: {
			"barnRatio" : 1
		},
		prices:[
			{ name : "science", val: 60000 },
			{ name : "titanium", val: 25 },
			{ name : "steel",    val: 200 },
			{ name : "scaffold", val: 250 }
		],
		upgrades: {
			buildings: ["barn", "warehouse", "harbor"]
		}
	},{
		name: "alloyBarns",
		label: "Alloy Barns",
		description: "Storage facilities store twice as many resources",
		effects: {
			"barnRatio" : 1
		},
		prices:[
			{ name : "science", val: 75000 },
			{ name : "alloy", val: 20 },
			{ name : "plate",    val: 750 }
		],
		upgrades: {
			buildings: ["barn", "warehouse", "harbor"]
		}
	},{
		name: "concreteBarns",
		label: "Concrete Barns",
		description: "Storage facilities store 75% more resources",
		effects: {
			"barnRatio" : 0.75
		},
		prices:[
			{ name : "science", val: 100000 },
			{ name : "concrate", val: 45 },
			{ name : "titanium",    val: 2000 }
		],
		upgrades: {
			buildings: ["barn", "warehouse", "harbor"]
		}
	},{
		name: "titaniumWarehouses",
		label: "Titanium Warehouses",
		description: "Storage facilities store 50% more resources",
		effects: {
			"warehouseRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 70000 },
			{ name : "titanium", val: 50 },
			{ name : "steel",    val: 500 },
			{ name : "scaffold", val: 500 }
		],
		upgrades: {
			buildings: ["barn", "warehouse", "harbor", "mint"]
		}
	},{
		name: "alloyWarehouses",
		label: "Alloy Warehouses",
		description: "Storage facilities store 45% more resources",
		effects: {
			"warehouseRatio" : 0.45
		},
		prices:[
			{ name : "science", val: 90000 },
			{ name : "titanium", val: 750 },
			{ name : "alloy",    val: 50 }
		],
		upgrades: {
			buildings: ["barn", "warehouse", "harbor", "mint"]
		}
	},{
		name: "concreteWarehouses",
		label: "Concrete Warehouses",
		description: "Storage facilities store 35% more resources",
		effects: {
			"warehouseRatio" : 0.35
		},
		prices:[
			{ name : "science", val: 100000 },
			{ name : "titanium", val: 1250 },
			{ name : "concrate", val: 35 }
		],
		upgrades: {
			buildings: ["barn", "warehouse", "harbor", "mint"]
		}
	},{
		name: "storageBunkers",
		label: "Storage Bunkers",
		description: "Storage facilities store 20% more resources",
		effects: {
			"warehouseRatio" : 0.20
		},
		prices:[
			{ name : "science", 	val: 25000 },
			{ name : "unobtainium", val: 500 },
			{ name : "concrate", 	val: 1250 }
		],
		upgrades: {
			buildings: ["barn", "warehouse", "harbor", "mint"]
		}
	},
	//==================== accelerators ==============
	{
		name: "energyRifts",
		label: "Energy Rifts",
		description: "Accelerators will now create rifts to a pocket dimension",
		effects: {
		},
		prices:[
			{ name : "science", val: 200000 },
			{ name : "titanium", val: 7500 },
			{ name : "uranium", val: 250 }
		],
		upgrades: {
			buildings: ["accelerator"]
		}
	},{
		name: "stasisChambers",
		label: "Stasis Chambers",
		description: "Energy Rifts are twice as effective",
		effects: {
			"acceleratorRatio" : 0.95
		},
		prices:[
			{ name : "science", val: 235000 },
			{ name : "alloy", val: 	 200 },
			{ name : "uranium", val: 2000 },
			{ name : "timeCrystal", val: 1 }
		],
		upgrades: {
			buildings: ["accelerator"]
		},
		unlocks: {
			upgrades: ["voidEnergy"]
		}
	},{
		name: "voidEnergy",
		label: "Void Energy",
		description: "Energy Rifts are even more effective at storing resources.",
		effects: {
			"acceleratorRatio" : 0.75
		},
		prices:[
			{ name : "science",     val: 275000 },
			{ name : "alloy",       val: 250 },
			{ name : "uranium",     val: 2500 },
			{ name : "timeCrystal", val: 2 }
		],
		upgrades: {
			buildings: ["accelerator"]
		},
		unlocks: {
			upgrades: ["darkEnergy"]
		}
	},{
		name: "darkEnergy",
		label: "Dark Energy",
		description: "Energy Rifts are 2.5 times as effective at storing resources.",
		effects: {
			"acceleratorRatio" : 2.5	//TODO: ratio is a subject of change
		},
		prices:[
			{ name : "science",     val: 350000 },
			{ name : "eludium",       val: 75 },
			{ name : "timeCrystal", val: 3 }
		],
		upgrades: {
			buildings: ["accelerator"]
		}
	},{
		name: "chronoforge",
		label: "Chronoforge",
		description: "An alien technology related to time manipulation.",
		prices:[
			{ name : "science",     val: 500000 },
			{ name : "relic",     	val: 5 },
			{ name : "timeCrystal", val: 10 }
		]
	},{
		name: "tachyonAccelerators",
		label: "Tachyon Accelerators",
		description: "Energy Rifts are 5 times as effective",
		effects: {
			"acceleratorRatio" : 5
		},
		prices:[
			{ name : "science",     val: 500000 },
			{ name : "eludium",     val: 125 },
			{ name : "timeCrystal", val: 10 }
		],
		upgrades: {
			buildings: ["accelerator"]
		}
	},{
		name: "fluxCondensator",
		label: "Flux Condensator",
		description: "Chronosphere will now affect craftable resources.",
		effects: {
		},
		prices:[
			{ name : "alloy", 	val: 	 250 },
			{ name : "unobtainium", val: 5000 },
			{ name : "timeCrystal", val: 5 }
		]
	},{
		name: "lhc",
		label: "LHC",
		description: "Every accelerator will provide a bonus to maximum science",
		effects: {
		},
		prices:[
			{ name : "science", val: 250000 },
			{ name : "unobtainium", val: 100 },
			{ name : "alloy", val: 150 },
		],
		upgrades: {
			buildings: ["accelerator"]
		}
	},
	//----------- energy stuff ---------
	{
		name: "photovoltaic",
		label: "Photovoltaic Cells",
		description: "Solar Farms are 50% more effective",
		prices:[
			{ name : "science", val: 75000 },
			{ name : "titanium", val: 5000 }
		],
		effects: {
			"solarFarmRatio" : 0.5
		},
		upgrades: {
			buildings: ["pasture"]
		}
	},
	{
		name: "solarSatellites",
		label: "Solar Satellites",
		description: "Satellites will now generate energy instead of consuming it",
		prices:[
			{ name : "science", val: 225000 },
			{ name : "alloy", 	val: 750 }
		],
		upgrades: {
			spaceBuilding: ["sattelite"]
		}
	},
	//	------------- harbour stuff ------------
	{
		name: "cargoShips",
		label: "Cargo Ships",
		description: "Every ship will give a 1% bonus to Harbor capacity",
		effects: {
			"harborRatio" : 0.01
		},
		prices:[
			{ name : "science", val: 55000 },
			{ name : "blueprint", val: 15 }
		],
		upgrades: {
			buildings: ["harbor"]
		},
		flavor: "It's like a tuna can, but bigger"
	},{
		name: "barges",
		label: "Barges",
		description: "Harbors store more coal",
		effects: {
			"harborCoalRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 100000 },
			{ name : "titanium", val: 1500 },
			{ name : "blueprint", val: 30 }
		],
		upgrades: {
			buildings: ["harbor"]
		}
	},{
		name: "reactorVessel",
		label: "Reactor Vessel",
		description: "Every reactor improves ship potential by 5%",
		effects: {
			"shipLimit" : 0.05
		},
		prices:[
			{ name : "science", val: 135000 },
			{ name : "titanium", val: 5000 },
			{ name : "uranium",  val: 125 }
		],
		upgrades: {
			buildings: ["harbor"]
		},
	},{
		name: "ironwood",
		label: "Ironwood Huts",
		description: "Hut price ratio reduced by 50%",
		effects: {
			"hutPriceRatio" : -0.5
		},
		prices:[
			{ name : "science", val: 30000 },
			{ name : "wood", val: 15000 },
			{ name : "iron", val: 3000 },
		],
		unlocks: {
			upgrades: ["silos"]
		}
	},{
		name: "concreteHuts",
		label: "Concrete Huts",
		description: "Hut price ratio reduced by 30%",
		effects: {
			"hutPriceRatio" : -0.30
		},
		prices:[
			{ name : "science", val: 125000 },
			{ name : "concrate", val: 45 },
			{ name : "titanium", val: 3000 },
		],
	},{
		name: "unobtainiumHuts",
		label: "Unobtainium Huts",
		description: "Hut price ratio reduced by 25%",
		effects: {
			"hutPriceRatio" : -0.25
		},
		prices:[
			{ name : "science", val: 200000 },
			{ name : "unobtainium", val: 350 },
			{ name : "titanium", val: 15000 },
		],
	},{
		name: "eludiumHuts",
		label: "Eludium Huts",
		description: "Hut price ratio reduced by 10%",
		effects: {
			"hutPriceRatio" : -0.1
		},
		prices:[
			{ name : "science", val: 275000 },
			{ name : "eludium", val: 125 }
		],
	},
	{
		name: "silos",
		label: "Silos",
		description: "Warehouses can now store catnip",
		effects: {
		},
		prices:[
			{ name : "science", val: 50000 },
			{ name : "steel", val: 125 },
			{ name : "blueprint", val: 5 }
		],
		upgrades: {
			buildings: ["barn", "warehouse", "harbor"]
		},
		unlocks: {
			upgrades: ["titaniumWarehouses"]
		},
		flavor: "With carpeting and climbing holds of course"
	},{
		name: "refrigeration",
		label: "Refrigeration",
		description: "Expands catnip limit by 75%",
		effects: {
			"catnipMaxRatio" : 0.75
		},
		prices:[
			{ name : "science", val: 125000 },
			{ name : "titanium", val: 2500 },
			{ name : "blueprint", val: 15 }
		]
	},
	//--------------------- hunt upgrades ----------------------
	{
		name: "compositeBow",
		label: "Composite Bow",
		description: "An improved version of a bow which provides a permanent +50% boost to catpower production",
		effects: {
			"manpowerJobRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 500 },
			{ name : "iron", val: 100 },
			{ name : "wood", val: 200 }
		]
	},{
		name: "crossbow",
		label: "Crossbow",
		description: "An improved version of a bow which provides a permanent +25% boost to catpower production",
		effects: {
			"manpowerJobRatio" : 0.25
		},
		prices:[
			{ name : "science", val: 12000 },
			{ name : "iron", val: 1500 }
		]
	},{
		name: "railgun",
		label: "Railgun",
		description: "Deadly electromagnetic weapon. +25% boost to catpower production",
		effects: {
			"manpowerJobRatio" : 0.25
		},
		prices:[
			{ name : "science", val: 150000 },
			{ name : "titanium", val: 5000 },
			{ name : "blueprint", val: 25 }
		]
	},{
		name: "bolas",
		label: "Bolas",
		description: "Throwing weapon made of heavy stone weights. Your hunters are twice as effective",
		effects: {
			"hunterRatio" : 1
		},
		prices:[
			{ name : "science", val: 1000 },
			{ name : "minerals", val: 250 },
			{ name : "wood", val: 50 }
		],
		flavor: "Weaponized yarn"
	},{
		name: "huntingArmor",
		label: "Hunting Armour",
		description: "Hunters are 3 times as effective",
		effects: {
			"hunterRatio" : 2
		},
		prices:[
			{ name : "science", val: 2000 },
			{ name : "iron", val: 750 }
		],
        flavor: "At least they are wearing something..."
	},{
		name: "steelArmor",
		label: "Steel Armour",
		description: "Hunters are a bit more effective",
		effects: {
			"hunterRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 10000 },
			{ name : "steel", val: 50 }
		]
	},{
		name: "alloyArmor",
		label: "Alloy Armour",
		description: "Hunters are a bit more effective",
		effects: {
			"hunterRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 50000 },
			{ name : "alloy", val: 25 }
		]
	},{
		name: "nanosuits",
		label: "Nanosuits",
		description: "Maximum catpower!",
		effects: {
			"hunterRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 185000 },
			{ name : "alloy", val: 250 }
		]
	},{
		name: "caravanserai",
		label: "Caravanserai",
		description: "Your tradeposts have a very minor effect on race standing",
		effects: {
			"standingRatio" : 0.35	//0.35% per tradepost
		},
		prices:[
			{ name : "science", val: 25000 },
			{ name : "ivory", val: 10000 },
			{ name : "gold", val: 250 }
		],
		upgrades: {
			buildings: ["tradepost"]
		},
		flavor: "Now hiring: cuter kittens"
	},
	//--------------------- stuff ----------------------
	{
		name: "advancedRefinement",
		label: "Catnip Enrichment",
		description: "Catnip refines twice as well",
		effects: {
		},
		prices:[
			{ name : "science", val: 500 },
			{ name : "catnip", val: 5000 }
		],
		handler: function(game){
			game.workshop.getCraft("wood").prices = [{name: "catnip", val: 50}];
		},
		flavor: "It's all fun and games 'til someone gets pounced"
	},{
		name: "goldOre",
		label: "Gold Ore",
		description: "Small percentage of ore will be smelted into gold",
		effects: {
		},
		prices:[
			{ name : "minerals", val: 800 },
			{ name : "iron", 	 val: 100 },
			{ name : "science",  val: 1000 }
		],
		flavor: "Shiny!"
	},{
		name: "geodesy",
		label: "Geodesy",
		description: "Geologists are more effective and can find gold.",
		effects: {
		},
		prices:[
			{ name : "titanium", val: 250 },
			{ name : "starchart", val: 500 },
			{ name : "science",  val: 90000 }
		],
		upgrades: {
			jobs: ["geologist"]
		},
		flavor: "Gold sniffing cats"
	},{
		name: "register",
		label: "Register",
		description: "Leader manage jobs depending on experience.",
		effects: {
		},
		prices:[
			{ name : "gold", 	 val: 10 },
			{ name : "science",  val: 500 }
		]
	},{
		name: "strenghtenBuild",
		label: "Concrete Pillars",
		description: "Repair barn and warehouse cracks with concrete.",
		effects: {
			"barnRatio" : 0.05,
			"warehouseRatio" : 0.05
		},
		prices:[
			{ name : "science", val: 100000 },
			{ name : "concrate", val: 50 }
		],
		unlocks: {
			upgrades: ["concreteWarehouses", "concreteBarns", "concreteHuts"]
		},
		upgrades: {
			buildings: ["barn", "warehouse", "harbor", "mint"]
		}
	},
	//TODO: thouse two upgrades may be buggy like hell, we should really really revisit handler logic
	{
		name: "miningDrill",
		label: "Mining Drill",
		description: "Geologists are more effective",
		effects: {
		},
		prices:[
			{ name : "titanium", val: 1750 },
			{ name : "steel", 	 val: 750 },
			{ name : "science",  val: 100000 }
		],
		upgrades: {
			jobs: ["geologist"]
		},
	},{
		name: "unobtainiumDrill",
		label: "Unobtainium Drill",
		description: "Geologists are even more effective",
		effects: {
		},
		prices:[
			{ name : "unobtainium", val: 250 },
			{ name : "alloy", 	 	val: 1250 },
			{ name : "science",  	val: 250000 }
		],
		upgrades: {
			jobs: ["geologist"]
		},
	},
	//--------------------- coal upgrades ----------------------
	{
		name: "coalFurnace",
		label: "Coal Furnace",
		description: "Smelters produce coal while burning wood",
		effects: {
		},
		prices:[
			{ name : "minerals", val: 5000 },
			{ name : "iron", 	 val: 2000 },
			{ name : "beam", 	 val: 35 },
			{ name : "science",  val: 5000 }
		],
		flavor: "So warm... so sleepy..."
	},{
		name: "deepMining",
		label: "Deep Mining",
		description: "Mines will also produce coal",
		effects: {
		},
		prices:[
			{ name : "iron", 	 val: 1200 },
			{ name : "beam", 	 val: 50 },
			{ name : "science",  val: 5000 }
		],
		upgrades: {
			buildings: ["mine"]
		},
		flavor: "Yummy Canaries!"
	},{
		name: "pyrolysis",
		label: "Pyrolysis",
		description: "Coal output is boosted by 20%",
		effects: {
			"coalSuperRatio": 0.2
		},
		prices:[
			{ name : "compedium", 	 val: 5 },
			{ name : "science",  val: 35000 }
		]
	},{
		name: "electrolyticSmelting",
		label: "Electrolytic Smelting",
		description: "Smelters are twice as effective",
		effects: {
			"smelterRatio": 0.95
		},
		prices:[
			{ name : "titanium", val: 2000 },
			{ name : "science",  val: 100000 }
		]
	},{
		name: "oxidation",
		label: "Oxidation",
		description: "Calciners are twice as effective at producing iron and 4 times at producing titanium",
		effects: {
			"calcinerRatio": 0.95
		},
		prices:[
			{ name : "steel", val: 5000 },
			{ name : "science",  val: 100000 }
		]
	},{
		name: "steelPlants",
		label: "Steel Plants",
		description: "10% of the calciners' iron output will be converted to steel",
		effects: {
			"calcinerSteelRatio" : 0.1
		},
		prices:[
			{ name : "titanium", val: 3500 },
			{ name : "gear", 	 val: 750 },
			{ name : "science",  val: 140000 }
		],
		unlocks: {
			upgrades: ["automatedPlants"]
		}
	},{
		name: "automatedPlants",
		label: "Automated Plants",
		description: "Steel Plants are boosted by 25% of your craft ratio",
		effects: {
			"calcinerSteelCraftRatio" : 0.25
		},
		prices:[
			{ name : "alloy", val: 750 },
			{ name : "science",  val: 200000 }
		],
        unlocks: {
			upgrades: ["nuclearPlants"]
		},
	},{
		name: "nuclearPlants",
		label: "Nuclear Plants",
		description: "Steel Plants are additionally boosted by 2% of your craft ratio per Reactor",
		effects: {
			"calcinerSteelReactorBonus" : 0.02
		},
		prices:[
			{ name : "uranium", val: 10000 },
			{ name : "science",  val: 250000 }
		]
	},{
		name: "rotaryKiln",
		label: "Rotary Kiln",
		description: "Calciners are 75% more effective at producing iron and 3 times at producing titanium",
		effects: {
			"calcinerRatio": 0.75
		},
		prices:[
			{ name : "titanium", val: 5000 },
			{ name : "gear", 	 val: 500 },
			{ name : "science",  val: 145000 }
		]
	},
	{
		name: "fluidizedReactors",
		label: "Fluidized Reactors",
		description: "Calciners are twice as effective",
		effects: {
			"calcinerRatio": 1
		},
		prices:[
			{ name : "alloy", val: 200 },
			{ name : "science", val: 175000 }
		]
	},
	{
		name: "nuclearSmelters",
		label: "Nuclear Smelters",
		description: "Smelters can now produce titanium",
		effects: {
		},
		prices:[
			{ name : "uranium", val: 250 },
			{ name : "science",  val: 165000 }
		]
	},
	//--------------------- automation upgrades ----------------------
	{
		name: "printingPress",
		label: "Printing Press",
		description: "Steamworks automatically print manuscripts",
		effects: {
		},
		prices:[
			{ name : "gear", 	 val: 45 },
			{ name : "science",  val: 7500 }
		],
		upgrades: {
			buildings: ["steamworks"]
		}
	},{
		name: "offsetPress",
		label: "Offset Press",
		description: "Printing press is 4 times as effective",
		effects: {
		},
		prices:[
			{ name : "gear", 	 val: 250 },
			{ name : "oil", 	 val: 15000 },
			{ name : "science",  val: 100000 }
		],
		upgrades: {
			buildings: ["steamworks"]
		},
		flavor: "Paper goes in, cat pictures come out."
	},{
		name: "photolithography",
		label: "Photolithography",
		description: "Printing press is 4 times as effective",
		effects: {
		},
		prices:[
			{ name : "alloy", 	 val: 1250 },
			{ name : "oil", 	 val: 50000 },
			{ name : "uranium",  val: 250 },
			{ name : "science",  val: 250000 }
		],
		upgrades: {
			buildings: ["steamworks"]
		}
	},{
		name: "factoryAutomation",
		label: "Workshop Automation",
		description: "Once per year Steamworks will refine small quantities of craftable resources when they are at the limit",
		effects: {
		},
		prices:[
			{ name : "gear", 	 val: 25 },
			{ name : "science",  val: 10000 }
		],
		flavor: "Includes autofeeders"
	},{
		name: "advancedAutomation",
		label: "Advanced Automation",
		description: "Workshop Automation will be activated twice per year.",
		effects: {
		},
		prices:[
			{ name : "gear", 	 val: 75 },
			{ name : "blueprint",  val: 25 },
			{ name : "science",  val: 100000 }
		]
	},{
		name: "pneumaticPress",
		label: "Pneumatic Press",
		description: "Workshop automation will also convert iron to plates",
		effects: {
		},
		prices:[
			{ name : "gear", 	 val: 30 },
			{ name : "blueprint",  val: 5 },
			{ name : "science",  val: 20000 }
		]
	},{
		name: "combustionEngine",
		label: "High Pressure Engine",
		description: "Reduces coal consumption of Steamworks by 20%",
		effects: {
			"coalRatioGlobalReduction" : 0.2
		},
		prices:[
			{ name : "gear", 	 val: 25 },
			{ name : "blueprint",  val: 5 },
			{ name : "science",  val: 20000 },
		],
		upgrades: {
			buildings: ["steamworks"]
		},
        flavor: "A better mousetrap"
	},{
		name: "fuelInjectors",
		label: "Fuel Injectors",
		description: "Reduces coal consumption of Steamworks by 20%",
		effects: {
			"coalRatioGlobalReduction" : 0.2
		},
		prices:[
			{ name : "gear", 	 val: 250 },
			{ name : "oil", 	 val: 20000 },
			{ name : "science",  val: 100000 }
		],
		upgrades: {
			buildings: ["steamworks"]
		}
	},
	{
		name: "factoryLogistics",
		label: "Factory Logistics",
		description: "Factories are providing bigger bonus to craft effectiveness",
		effects: {
		},
		prices:[
			{ name : "gear", 	 val: 250 },
			{ name : "titanium", val: 2000 },
			{ name : "science",  val: 100000 }
		],
		upgrades: {
			buildings: ["factory"]
		}
	},{
		name: "factoryOptimization",
		label: "Factory Optimization",
		description: "Improves Engineer's effectiveness",
		effects: {
			"t1CraftRatio": 10,
			"t2CraftRatio": 2
		},
		prices:[
			{ name : "gear", 	 val: 125 },
			{ name : "titanium", val: 1250 },
			{ name : "science",  val: 75000 }
		]
	},{
		name: "factoryRobotics",
		label: "Factory Robotics",
		description: "Improves Engineer's effectiveness",
		effects: {
			"t1CraftRatio": 10,
			"t2CraftRatio": 5,
			"t3CraftRatio": 2
		},
		prices:[
			{ name : "gear", 	 val: 250 },
			{ name : "titanium", val: 2500 },
			{ name : "science",  val: 100000 }
		]
	}, {
		name: "spaceManufacturing",
		label: "Space Manufacturing",
		description: "Factories are providing bonus to Space Elevators and Orbital Arrays",
		effects: {
		},
		prices:[
			{ name : "titanium", val: 125000 },
			{ name : "science",  val: 250000 }
		],
		upgrades: {
			buildings: ["factory"]
		}
	},
	//--------------------- science upgrades ----------------------
	{
		name: "celestialMechanics",
		label: "Celestial Mechanics",
		description: "Celestial events and meteors will generate additional science",
		effects: {},
		prices:[
			{ name : "science",  val: 250 },
		]
	},{
		name: "astrolabe",
		label: "Astrolabe",
		description: "Improves Observatory's max science bonus by 50%",
		effects: {},
		prices:[
			{ name : "titanium", val: 5 },
			{ name : "starchart",  val: 75 },
			{ name : "science",  val: 25000 },
		]
	},
	{
		name: "titaniumMirrors",
		label: "Titanium Reflectors",
		description: "Improved telescope reflectors. Every observatory will give 2% to Library effectiveness.",
		effects: {
			"libraryRatio" : 0.02
		},
		prices:[
			{ name : "titanium", val: 15 },
			{ name : "starchart",  val: 20 },
			{ name : "science",  val: 20000 },
		],
		upgrades: {
			buildings: ["library"]
		},
		flavor: "Did that light spot just move?"
	},
	{
		name: "unobtainiumReflectors",
		label: "Unobtainium Reflectors",
		description: "Improved telescope reflectors. Every observatory will give an additional 2% to Library effectiveness.",
		effects: {
			"libraryRatio" : 0.02
		},
		prices:[
			{ name : "unobtainium", val: 75 },
			{ name : "starchart",  val: 750 },
			{ name : "science",  val: 250000 },
		],
		upgrades: {
			buildings: ["library"]
		}
	},
	{
		name: "eludiumReflectors",
		label: "Eludium Reflectors",
		description: "Improved telescope reflectors. Every observatory will give an additional 2% to Library effectiveness.",
		effects: {
			"libraryRatio" : 0.02
		},
		prices:[
			{ name : "eludium", val: 15 },
			{ name : "science",  val: 250000 }
		],
		upgrades: {
			buildings: ["library"]
		}
	},
    {
        name: "hydroPlantTurbines",
        label: "Hydro Plant Turbines",
        description: "Unobtainium-based turbines. Hydro plants are 15% more effective.",
        effects: {
            "hydroPlantRatio": 0.15
        },
        prices: [
            {name: "unobtainium", val: 125},
            {name: "science", val: 250000}
        ],
        upgrades: {
            buildings: ["aqueduct"]
        }
    },{
		name: "amBases",
		label: "Antimatter Bases",
		description: "Reduce energy consumption for Lunar Bases by 50%",
		prices: [
			{name: "eludium", val: 15},
			{name: "antimatter", val: 250}
		],
		upgrades: {
			spaceBuilding: ["moonBase"]
		}
	},{
		name: "amDrive",
		label: "Antimatter Drive",
		description: "Antimatter-powered rocket engine",
		prices:[
			{ name : "antimatter", val: 125 },
			{ name : "science",  val: 450000 }
		],
		effects: {
			"routeSpeed" : 25
		}
	},{
		name: "amFission",
		label: "Antimatter Fission",
		description: "Engineers are 25% more effective at production of eludium",
		prices:[
			{ name : "antimatter", val: 175 },
			{ name : "thorium", val: 7500 },
			{ name : "science",  val: 525000 }
		],
		effects: {
			"eludiumAutomationBonus" : 0.25
		}
	},{
		name: "amReactors",
		label: "Antimatter Reactors",
		description: "Your Research Vessels and Space Beacons are twice as effective",
		effects: {
			"spaceScienceRatio": 0.95
		},
		prices: [
			{name: "eludium", val: 35},
			{name: "antimatter", val: 750}
		],
		upgrades: {
			spaceBuilding: ["researchVessel", "spaceBeacon"]
		},
		unlocks: {
			upgrades: ["amReactorsMK2"]
		}
	},{
		name: "amReactorsMK2",
		label: "Advanced AM Reactors",
		description: "Your Research Vessels and Space Beacons are 1.5x more effective",
		effects: {
			"spaceScienceRatio": 1.5
		},
		upgrades: {
			spaceBuilding: ["researchVessel", "spaceBeacon"]
		},
		prices: [
			{name: "eludium", val: 70},
			{name: "antimatter", val: 1750}
		],
		unlocks: {
			upgrades: ["voidReactors"]
		}
	},{
		name: "voidReactors",
		label: "Void Reactors",
		description: "Your Research Vessels are 4 times as effective",
		effects: {
			"spaceScienceRatio": 4
		},
		upgrades: {
			spaceBuilding: ["researchVessel", "spaceBeacon"]
		},
		prices: [
			{name: "void", val: 250},
			{name: "antimatter", val: 2500}
		]
	},{
		name: "relicStation",
		label: "Relic Station",
		description: "Upgrade Space Beacons with Relic research stations. Every Relic Station will reverse engineer relics yelding 0.01 relic per day",
		effects: {
			"beaconRelicsPerDay": 0.01
		},
		upgrades: {
			spaceBuilding: ["spaceBeacon"]
		},
		prices: [
			{name: "eludium", val: 100},
			{name: "antimatter", val: 5000}
		]
	},
	//---------------------- oil ---------------
	{
		name: "pumpjack",
		label: "Pumpjack",
		description: "Improves effectiveness of Oil Wells by 45%. Every Oil Well will consume 1Wt/t.",
		effects: {
			"oilWellRatio" : 0.45
		},
		prices:[
			{ name : "titanium", val: 250 },
			{ name : "gear", 	 val: 125 },
			{ name : "science",  val: 100000 }
		],
		upgrades: {
			buildings: ["oilWell"]
		}
	},{
		name: "biofuel",
		label: "Biofuel processing",
		description: "Biolabs will convert catnip into oil",
		effects: {
		},
		prices:[
			{ name : "titanium", val: 1250 },
			{ name : "science",  val: 150000 }
		],
		upgrades: {
			buildings: ["biolab"]
		}
	},
	{
		name: "unicornSelection",
		label: "Unicorn Selection",
		description: "Improves Unicorn Pasture effectiveness by 25%",
		effects: {
			"unicornsGlobalRatio": 0.25
		},
		prices:[
			{ name : "titanium", val: 1500 },
			{ name : "science",  val: 175000 }
		]
	},
	{
		name: "gmo",
		label: "GM Catnip",
		description: "Genetically modified catnip that will improve biolab oil yield by 60%",
		effects: {
			"biofuelRatio": 0.6
		},
		prices:[
			{ name : "titanium", val: 1500 },
			{ name : "catnip",   val: 1000000 },
			{ name : "science",  val: 175000 }
		],
		upgrades: {
			buildings: ["biolab"]
		}
	},
	//------------------- blueprints ----------------
	{
		name: "cadSystems",
		label: "CAD System",
		description: "All scientific buildings will improve effectiveness of blueprint crafting",
		effects: {
			"blueprintCraftRatio" : 0.01
		},
		prices:[
			{ name : "titanium", val: 750 },
			{ name : "science",  val: 125000 }
		]
	},{
		name: "seti",
		label: "SETI",
		description: "A large array of electronic telescopes. Makes astronomical events automatic and silent",
		effects: {
		},
		prices:[
			{ name : "titanium", val: 250 },
			{ name : "science",  val: 125000 }
		]
	},{
		name: "logistics",
		label: "Logistics",
		description: "Kitten skills are 15% more effective",
		effects: {
			"skillMultiplier" : 0.15
		},
		prices:[
			{ name : "gear", val: 100 },
			{ name : "scaffold",  val: 1000 },
			{ name : "science",  val: 100000 }
		]
	},{
		name: "augumentation",
		label: "Augmentations",
		description: "Kitten skills are 100% more effective",
		effects: {
			"skillMultiplier" : 1
		},
		prices:[
			{ name : "titanium", val: 5000 },
			{ name : "uranium",  val: 50 },
			{ name : "science",  val: 150000 }
		]
	},{
		name: "internet",
		label: "Internet",
		description: "Kittens learn skills with each other",
		effects: {},
		prices:[
			{ name : "titanium", val: 5000 },
			{ name : "uranium",  val: 50 },
			{ name : "science",  val: 150000 }
		]
	},{
		name: "neuralNetworks",
		label: "Neural Networks",
		description: "Engineers effectiveness doubles at cost of the double energy consumption",
		effects: {},
		prices:[
			{ name : "titanium", val: 7500 },
			{ name : "science",  val: 200000 }
		]
	},{
		name: "assistance",
		label: "Robotic Assistance",
		description: "Factory robots automating routine tasks. Workers require less catnip.",
		effects: {
			"catnipDemandWorkerRatioGlobal" : -0.25
		},
		prices:[
			{ name : "steel", val: 10000 },
			{ name : "gear", val: 250 },
			{ name : "science", val: 100000 }
		]
	},{
		name: "enrichedUranium",
		label: "Enriched Uranium",
		description: "Reduce uranium consumption of reactors by 25%",
		effects: {
			"uraniumRatio" : 0.25
		},
		prices:[
			{ name : "titanium", val: 7500 },
			{ name : "uranium",  val: 150 },
			{ name : "science",  val: 175000 }
		],
		upgrades: {
			buildings: ["reactor"]
		}
	},{
        name: "coldFusion",
        label: "Cold Fusion",
        description: "Increase Reactors energy output by 25%",
        effects: {
            "reactorEnergyRatio": 0.25
        },
        prices:[
            { name : "eludium",  val: 25 },
            { name : "science",  val: 200000 }
        ],
        upgrades: {
            buildings: ["reactor"]
        }
    },{
        name: "thoriumReactors",
        label: "Thorium Reactors",
        description: "Increase Reactors energy output by 25% by the addition of thorium",
        effects: {
            "reactorEnergyRatio": 0.25,
            "reactorThoriumPerTick": -0.05
        },
        prices:[
            { name : "thorium",  val: 10000 },
            { name : "science",  val: 400000 }
        ],
        upgrades: {
            buildings: ["reactor"]
        },
		unlocks: {
			upgrades: ["enrichedThorium"]
		}
    },{
		name: "enrichedThorium",
		label: "Enriched Thorium",
		description: "Reactors will now consume 25% less thorium",
		effects: {
			"reactorThoriumPerTick": 0.0125
		},
		prices:[
			{ name : "thorium",  val: 12500 },
			{ name : "science",  val: 500000 }
		],
		upgrades: {
			buildings: ["reactor"]
		}
	},
	//------------------- starcharts / space ----------------
	{
		name: "hubbleTelescope",
		label: "Hubble Space Telescope",
		description: "Improves starchart production by 30%",
		effects: {
			"starchartGlobalRatio" : 0.30
		},
		prices:[
			{ name : "alloy", 	 val: 1250 },
			{ name : "oil", 	 val: 50000 },
			{ name : "science",  val: 250000 }
		],
		unlocks: {
			upgrades: ["satnav"]
		}
	},
	{
		name: "satnav",
		label: "Satellite Navigation",
		description: "Every satellite reduce starchart requirement of ships by 1.25%",
		effects: {
			"satnavRatio" : 0.0125
		},
		prices:[
			{ name : "alloy", 	 val: 750 },
			{ name : "science",  val: 200000 }
		]
	},{
        name: "satelliteRadio",
        label: "Satellite Radio",
        description: "Every satellite will boost the effect of Broadcast Towers by 0.5%",
        effects: {
            "broadcastTowerRatio" : 0.005
        },
        prices:[
            { name : "alloy", 	 val: 5000 },
            { name : "science",  val: 225000 }
        ]
    },
	{
		name: "astrophysicists",
		label: "Astrophysicists",
		description: "Each scholar will now generate starcharts.",
		effects: {
		},
		prices:[
			{ name : "unobtainium", val: 350 },
			{ name : "science",  val: 250000 }
		],
		upgrades: {
			jobs: ["scholar"]
		}
	},{
		name: "mWReactor",
		label: "Microwarp Reactors",
		description: "A new eludium-based reactor for Lunar Outposts. Unobtainium production is 75% more effective.",
		effects: {
			"lunarOutpostRatio" : 0.75
		},
		prices:[
			{ name : "eludium", val: 50 },
			{ name : "science",  val: 150000 }
		]
	},
	{
		name: "eludiumCracker",
		label: "Planet Busters",
		description: "Hissmeowra's output is twice as effective.",
		effects: {
			"crackerRatio" : 1.0
		},
		prices:[
			{ name : "eludium", val: 250 },
			{ name : "science",  val: 275000 }
		],
		upgrades: {
			spaceBuilding: ["planetCracker"]
		}
	},
	{
		name: "thoriumEngine",
		label: "Thorium Drive",
		description: "A new rocket engine to go faster in space.",
		prices:[
			{ name : "ship", val: 10000 },
			{ name : "gear", val: 40000 },
			{ name : "alloy", val: 2000 },
			{ name : "thorium", val: 100000 },
			{ name : "science",  val: 400000 }
		],
		effects: {
			"routeSpeed" : 50
		}
	},
	//------------------- oil --------------------------
    {
		name: "oilRefinery",
		label: "Oil Refinery",
		description: "Improves effectiveness of oil wells by 35%",
		effects: {
			"oilWellRatio" : 0.35
		},
		prices:[
			{ name : "titanium", val: 1250 },
			{ name : "gear", 	 val: 500 },
			{ name : "science",  val: 125000 }
		],
		upgrades: {
			buildings: ["oilWell"]
		}
	},{
        name: "oilDistillation",
        label: "Oil Distillation",
        description: "Oil output is improved by 75%.",
        effects: {
            "oilWellRatio" : 0.75
        },
        prices:[
            { name : "titanium", val: 5000 },
            { name : "science",  val: 175000 }
        ],
        upgrades: {
            buildings: ["oilWell"]
        }
    },{
        name: "factoryProcessing",
        label: "Factory Processing",
        description: "Every factory will increase oil refinement effectiveness by 5%.",
        effects: {
            "factoryRefineRatio" : 0.05
        },
        prices:[
            { name : "titanium", val: 7500   },
            { name : "concrate", val: 125    },
            { name : "science",  val: 195000 }
        ]
    },
    //---------------- Void Space ---------------
    {
        name: "voidAspiration",
        label: "Void Aspiration",
        description: "Unlocks Void Hoover.",
        effects: {

        },
        prices:[
            { name : "timeCrystal", val: 15 },
            { name : "antimatter", val: 2000 }
        ],
        unlocks: {
            voidSpace: ["voidHoover"]
        }
    },{
        name: "distorsion",
        label: "Distorsion",
        description: "Improve Chronocontrol effectiveness.",
        effects: {
			"temporalParadoxDayBonus": 2
        },
        prices:[
            { name : "timeCrystal", val: 25 },
            { name : "antimatter", val: 2000 },
            { name : "void", val: 1000 },
            { name : "science", val: 300000 }
        ],
        upgrades: {
            voidSpace: ["chronocontrol"]
        }
    },{
        name: "turnSmoothly",
        label: "Turn smoothly",
        description: "Chronosphere gather temporal flux.",
        effects: {
			"temporalFluxProductionChronosphere": 1
        },
        prices:[
			{ name : "unobtainium", val: 100000 },
			{ name : "timeCrystal", val: 25 },
			{ name : "void", val: 750 },
			{ name : "temporalFlux", val: 6500 }
        ],
        upgrades: {
            buildings: ["chronosphere"]
        }
    }
    ],

	//=============================================================
	//					     CRAFT RECIPES
	//=============================================================

	crafts:[{
		name: "wood",
		label: "Refine Catnip",
		description: "A sturdy block of catnip wood. Difficult to process, but great building material.",
		prices:[
			{name: "catnip", val: 100}
		],
		ignoreBonuses: true,
		progressHandicap: 1,
		tier: 1
	},{
		name: "beam",
		label: "Wooden Beam",
		description: "Simple support structure made of a wood. Required for advanced construction.",
		prices:[
			{name: "wood", val: 175}
		],
		progressHandicap: 1,
		tier: 1
	},{
		name: "slab",
		label: "Stone Slab",
		description: "A small slab composed of minerals. Required for advanced construction.",
		prices:[
			{name: "minerals", val: 250}
		],
		progressHandicap: 1,
		tier: 1
	},{
		name: "concrate",
		label: "Concrete",
		description: "A block of reinforced concrete.",
		prices:[
			{name: "slab", val: 2500},
			{name: "steel", val: 25}
		],
		progressHandicap: 9,
		tier: 4
	},{
		name: "plate",
		label: "Metal Plate",
		description: "A metal plate. Required for advanced construction.",
		prices:[
			{name: "iron", val: 125}
		],
		progressHandicap: 4,
		tier: 1
	},{
		name: "steel",
		label: "Steel",
		description: "A durable metal made by smelting iron and coal. Required for construction of gears and complex machinery.",
		prices:[
			{name: "iron", val: 100},
			{name: "coal", val: 100}
		],
		progressHandicap: 4,
		tier: 2
	},{
		name: "gear",
		label: "Gear",
		description: "An integral part of automated structures.",
		prices:[
			{name: "steel", val: 15}
		],
		progressHandicap: 5,
		tier: 3
	},{
		name: "alloy",
		label: "Alloy",
		description: "A durable alloy of steel, iron and titanium. Required for advanced buildings and upgrades.",
		prices:[
			{name: "steel", val: 75 },
			{name: "titanium", val: 10}
		],
		progressHandicap: 7,
		tier: 4
	},{
		name: "eludium",
		label: "Eludium",
		description: "Extremely rare and expensive alloy of unobtanium and titanium.",
		prices:[
			{name: "alloy", val: 2500 },
			{name: "unobtainium", val: 1000}
		],
		progressHandicap: 300,
		tier: 5
	},{
		name: "scaffold",
		label: "Scaffold",
		description: "A large structure made of wood beams required for construction of very complex buildings and objects",
		prices:[
			{ name: "beam", val: 50 }
		],
		progressHandicap: 2,
		tier: 2
	},{
		name: "ship",
		label: "Trade Ship",
		description: "Ships can be used to discover new civilisations. May improve chances of getting certain rare resources",
		prices:[
			{ name: "scaffold", val: 100 },
			{ name: "plate",    val: 150 },
			{ name: "starchart", val: 25 }
		],
		upgrades: {
			buildings: ["harbor"]
		},
		progressHandicap: 20,
		tier: 3
	},{
		name: "tanker",
		label: "Tanker",
		description: "Increase maximum oil capacity by 500",
		prices:[
			{ name: "ship", 		val: 200 },
			{ name: "alloy",    	val: 1250 },
			{ name: "blueprint", 	val: 5 }
		],
		upgrades: {
			buildings: ["harbor"]
		},
		progressHandicap: 20,
		tier: 5
	},{
        name: "kerosene",
        label: "Kerosene",
        description: "A rocket fuel processed from oil",
        prices:[
            { name: "oil", val: 7500 }
        ],
		progressHandicap: 5,
		tier: 2
    },{
		name: "parchment",
		label: "Parchment",
		description: "A material for writing on made from animal skin, required for cultural buildings.",
		prices:[
			{name: "furs", val: 175}
		],
		progressHandicap: 1,
		tier: 1
	},{
		name: "manuscript",
		label: "Manuscript",
		description: "Written document required for technological advancement. Every manuscript will give a minor bonus to a maximum culture (this effect has a diminishing return)",
		prices:[
			{name: "parchment", val: 25},
			{name: "culture", val: 400}
		],
		progressHandicap: 2,
		tier: 2
	},{
		name: "compedium",
		label: "Compendium",
		description: "A sum of all modern knowledge of catkind. Every compendium will give +10 to max science",
		prices:[
			{name: "manuscript", val: 50},
			{name: "science", val: 10000}
		],
		progressHandicap: 5,
		tier: 3
	},{
		name: "blueprint",
		label: "Blueprint",
		description: "Strange piece of paper with blue lines.",
		prices:[
			{name: "compedium", val: 25},
			{name: "science", val: 25000}
		],
		progressHandicap: 10,
		tier: 3
	},{
		name: "thorium",
		label: "Thorium",
		description: "A highly radioactive and unstable fuel",
		prices:[
			{ name: "uranium", val: 250 }
		],
		progressHandicap: 5,
		tier: 3
	},{
		name: "megalith",
		label: "Megalith",
		description: "A massive block that can be used to construct enormous structures",
		prices:[
			{ name: "slab", val: 75 },
			{ name: "beam", val: 35 },
			{ name: "plate", val: 5 }
		],
		progressHandicap: 5,
		tier: 3
	}],

	effectsBase: {
		"scienceMax" : 0,
		"cultureMax" : 0,
		"oilMax" : 0
	},

	metaCache: null,

	constructor: function(game){
		this.game = game;
		this.metaCache = {};
		this.registerMeta("research", this.upgrades, null);
		this.setEffectsCachedExisting();
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
		return null;
	},

	resetState: function(){
		for (var i = 0; i < this.upgrades.length; i++){
			var upgrade = this.upgrades[i];
			if (upgrade.name == "mineralHoes" ||
				upgrade.name == "ironHoes" ||
				upgrade.name == "mineralAxes" ||
				upgrade.name == "ironAxes" ||
				upgrade.name == "stoneBarns" ||
				upgrade.name == "reinforcedBarns") {
				upgrade.unlocked = true;
			} else {
				upgrade.unlocked = false;
			}
			upgrade.researched = false;
		}

		for (i = 0; i < this.crafts.length; i++){
			var craft = this.crafts[i];
			if (craft.name == "wood" ||
				craft.name == "beam" ||
				craft.name == "slab" ||
				craft.name == "plate" ||
				craft.name == "gear" ||
				craft.name == "scaffold" ||
				craft.name == "manuscript" ||
				craft.name == "megalith") {
				craft.unlocked = true;
			} else {
				craft.unlocked = false;
			}
			craft.value = 0;
			craft.progress = 0;
			if (typeof(craft.progressHandicap) == "undefined") {
				craft.progressHandicap = 1;
			}
		}

		//ugh
		this.getCraft("wood").prices = [{name: "catnip", val: 100}];

		this.hideResearched = false;
	},

	save: function(saveData){
		saveData.workshop = {
			hideResearched: this.hideResearched,
			upgrades: this.filterMetadata(this.upgrades, ["name", "unlocked", "researched"]),
			crafts: this.filterMetadata(this.crafts, ["name", "unlocked", "value", "progress"])
		};
	},

	load: function(saveData){
		if (!saveData["workshop"]){
			return;
		}

		this.hideResearched = saveData.workshop.hideResearched;
		this.loadMetadata(this.upgrades, saveData.workshop.upgrades);
		this.loadMetadata(this.crafts, saveData.workshop.crafts);

		for (var i = 0; i < this.upgrades.length; i++){
			var upgrade = this.upgrades[i];
			if (upgrade.researched){
				if (upgrade.handler) {
					upgrade.handler(this.game);	//just in case update workshop upgrade effects
				}
				if (upgrade.unlocks) {
					this.game.unlock(upgrade.unlocks);
				}
			}
		}

	},

	getCraftPrice: function(craft){
		if (craft.name != "ship"){
			return craft.prices;
		}

		//special ship hack
		var prices = dojo.clone(craft.prices);
		for (var i = prices.length - 1; i >= 0; i--) {
			if (prices[i].name == "starchart"){
				prices[i].val = prices[i].val *
					(1 - this.game.getHyperbolicEffect(
						this.game.getEffect("satnavRatio") * this.game.space.getBuilding("sattelite").on,
						0.75));
			}
		}
		return prices;
	},

	craft: function (res, amt, suppressUndo){

		var craft = this.getCraft(res);
		var craftRatio = this.game.getResCraftRatio({name:res});

		var craftAmt = amt * (1 + craftRatio);
		var prices = dojo.clone(this.getCraftPrice(craft));

		for (var i = prices.length - 1; i >= 0; i--) {
			prices[i].val *= amt;
		}


		if (this.game.resPool.hasRes(prices)){
			this.game.resPool.payPrices(prices);
			this.game.resPool.addResEvent(res,craftAmt);
			if (craft.upgrades){
				this.game.upgrade(craft.upgrades);
			}

			this.game.stats.getStat("totalCrafts").val += 1;
			this.game.stats.getStatCurrent("totalCrafts").val += 1;

            if (!suppressUndo) {
                var undo = this.game.registerUndoChange();
                undo.addEvent("workshop", /* TODO: use manager.id and pass it in proper way as manager constructor*/
                    res, amt);
            }

            return true;

		}else{
			console.log("not enough resources for", prices);
			return false;
		}
	},

	getEffectEngineer: function(resName, afterCraft) {
		var craft = this.getCraft(resName);
		if (craft == null) {
			return 0;
		} else {
			var resMapProduction = this.game.village.getResProduction();
			var kittenResProduction = resMapProduction["ES" + resName] ? resMapProduction["ES" + resName] : 0;

			var tierCraftRatio = this.game.getEffect("t" + craft.tier + "CraftRatio") || 0;
			if (tierCraftRatio == 0) {
				tierCraftRatio = 1;
			}

			// (One * bonus / handicap) crafts per engineer per 10 minutes
			var effectPerTick = ( 1 / (600 * this.game.rate)) * (kittenResProduction * tierCraftRatio) / craft.progressHandicap;

			return afterCraft ? effectPerTick * this.game.getResCraftRatio({name:resName}) : effectPerTick;
		}
	},

    undo: function(metaId, val){
		var res = this.game.resPool.get(metaId);
		var craftRatio = this.game.getResCraftRatio(res);
		this.game.msg( this.game.getDisplayValueExt(val * (1+craftRatio)) + " " + (res.title || res.name) + " refunded");
        this.craft(metaId, -val, true /*do not create cyclic undo*/);
    },

	//returns a total number of resoruces possible to craft for this recipe
	getCraftAllCount: function(craftName){
		var recipe = this.getCraft(craftName);
		var prices = this.getCraftPrice(recipe);

		var minAmt = Number.MAX_VALUE;
		for (var j = prices.length - 1; j >= 0; j--) {
			var totalRes = this.game.resPool.get(prices[j].name).value;
			var allAmt = Math.floor(totalRes / prices[j].val);
			if (allAmt < minAmt){
				minAmt = allAmt;
			}
		}
		return minAmt;
	},

	//Crafts maximum possible amount for given recipe name
	craftAll: function(craftName){
		var minAmt = this.getCraftAllCount(craftName);
		if (minAmt > 0 && minAmt < Number.MAX_VALUE){
			var craftRatio = this.game.getResCraftRatio({name:craftName});
			var bonus = minAmt * craftRatio;

			var res = this.game.resPool.get(craftName);
			this.game.msg( "+" + this.game.getDisplayValueExt(minAmt + bonus) + " " + (res.title || craftName) + " crafted", null, "craft");
			this.craft(craftName, minAmt);
		}
	},

	clearEngineers: function(){
		for (var i = this.crafts.length - 1; i >= 0; i--){
			this.crafts[i].value = 0;
		}
	},

	update: function(){
		this.effectsBase["scienceMax"] = Math.floor(this.game.resPool.get("compedium").value * 10);
		var cultureBonusRaw = Math.floor(this.game.resPool.get("manuscript").value);
		this.effectsBase["cultureMax"] = this.game.getTriValue(cultureBonusRaw, 0.01);
		this.effectsBase["oilMax"] = Math.floor(this.game.resPool.get("tanker").value * 500);

		//sanity check
		if (this.game.village.getFreeEngineer() < 0){
			this.clearEngineers();
		}

		for (var i = 0; i < this.crafts.length; i++){
			var craft = this.crafts[i];

			var prices = this.getCraftPrice(craft);

			//check and cache if you can't craft even once due to storage limits
			craft.isLimited = this.game.resPool.isStorageLimited(prices);

			if (craft.value == 0) {
				continue;
			}

			if(craft.progress >= 1) {
				var units = Math.floor(craft.progress);
				var craftSuccess = this.isLimited ? false : this.craft(craft.name, units, true);
				if (craftSuccess) {
					craft.progress = craft.progress - units;
				}
			} else {
				var currentProgress = this.getEffectEngineer(craft.name, false);

				if (this.game.resPool.hasRes(prices, craft.progress + currentProgress)) {
					craft.isLimitedAmt = false;
					craft.progress += currentProgress;
				} else {
					craft.isLimitedAmt = true;
				}
			}
		}

	},

	unlock: function(upgrade){
		upgrade.researched = true;

		if (upgrade.handler){
			upgrade.handler(this.game);
		}

		if (upgrade.unlocks) {
			this.game.unlock(upgrade.unlocks);
		}

		if (upgrade.upgrades) {
			// Hack so the new upgrade's effects are counted
			this.game.upgrade(upgrade.upgrades);
		}
	},

	unlockAll: function(){
		for (var i in this.upgrades){
			this.unlock(this.upgrades[i]);
		}
		this.game.msg("All upgrades are unlocked!");
	}
});

dojo.declare("com.nuclearunicorn.game.ui.UpgradeButton", com.nuclearunicorn.game.ui.BuildingResearchBtn, {
	metaCached: null, // Call getMetadata
	tooltipName: true,
	simplePrices: false,

	getMetadata: function(){
		if (!this.metaCached){
			this.metaCached = this.game.workshop.get(this.id);
		}
		return this.metaCached;
	},

	updateVisible: function(){
		var upgrade = this.getMetadata();
		if (!upgrade.unlocked){
			this.setVisible(false);
		}else{
			this.setVisible(true);
		}

		if (upgrade.researched && this.game.workshop.hideResearched){
			this.setVisible(false);
		}
	},

	renderLinks: function(){
		if (this.game.devMode && !this.devUnlockHref){
			this.devUnlockHref = this.addLink("[+]", this.unlock);
		}
	},

});

dojo.declare("com.nuclearunicorn.game.ui.CraftButton", com.nuclearunicorn.game.ui.ButtonModern, {
	craftName: null,
	hasResourceHover: true,
	simplePrices: false,

	constructor: function(opts, game){
		this.craftName = opts.craft;
	},

	onClick: function(){
		this.animate();
		this.handler(this);
	},

	updateVisible: function(){
		var craft = this.game.workshop.getCraft(this.craftName);

		if (craft.unlocked){
			this.setVisible(true);
		}else{
			this.setVisible(false);
		}
	},

	getSelectedObject: function(){
		return this.game.workshop.getCraft(this.craftName);
	},

	getName: function(){
		var craft = this.game.workshop.getCraft(this.craftName);
		if (this.game.science.get("mechanization").researched && craft.value != 0) {
			var progressDisplayed = this.game.toDisplayPercentage(craft.progress, 0, true);
			if (progressDisplayed > 99){
				progressDisplayed = 99;
			}

			return this.name + " (" + craft.value + ") [" + progressDisplayed + "%]";
		} else {
			return this.inherited(arguments);
		}
	},

	getDescription: function(){
		var craft = this.game.workshop.getCraft(this.craftName);
		var desc = craft.description;

		if (this.game.science.get("mechanization").researched){
			desc += "<br><br>Engineer's optimal rank: " + craft.tier;

			var tierBonus = this.game.getEffect("t" + craft.tier + "CraftRatio") || 1;
			if (tierBonus != 1) {
				desc += "<br>Engineers expertise: " + this.game.getDisplayValueExt(((tierBonus-1)* 100).toFixed(), true) + "%";
			}

			if (craft.progressHandicap != 1) {
				var difficulty = this.game.getDisplayValueExt(((-(1 - (1 / craft.progressHandicap)))* 100).toFixed(2), true);
				desc += "<br>Craft difficulty: " + difficulty + "%";
			}

			if (craft.value != 0) {
				var countdown = (1 / (this.game.workshop.getEffectEngineer(craft.name, false) * 5)).toFixed(0);
				desc += "<br>=> One craft every: " + countdown + "sec";
			}
		}
		return desc;
	},

	setEnabled: function(enabled){
		this.inherited(arguments);

		dojo.removeClass(this.domNode, "bldEnabled");
		dojo.removeClass(this.domNode, "bldlackResConvert");
		var craft = this.game.workshop.getCraft(this.craftName);
		if (craft.value > 0) {
			if (craft.isLimitedAmt) {
				dojo.addClass(this.domNode, "bldlackResConvert");
			} else {
				dojo.addClass(this.domNode, "bldEnabled");
			}
		}
	},

	assignCraftJob: function(value) {
		var craft = this.game.workshop.getCraft(this.craftName);

		var valueCorrected = this.game.village.getFreeEngineer() > value ? value : this.game.village.getFreeEngineer();

		var valueAdded = 0;
		for (var i = 0; i < valueCorrected; i++) {
			var success = this.game.village.sim.assignCraftJob(craft);

			if (success) {
				valueAdded += 1;
			} else {
				break;
			}
		}
		craft.value += valueAdded;
	},

	unassignCraftJob: function(value) {
		var craft = this.game.workshop.getCraft(this.craftName);

		var valueCorrected = craft.value > value ? value : craft.value;

		craft.value -= valueCorrected;
		for (var i = 0; i < valueCorrected; i++) {
			this.game.village.sim.unassignCraftJob(craft);
		}
	},

	renderLinks: function(){
		if (this.game.science.get("mechanization").researched) {

			this.unassignCraftLinks = this.addLinkList([
			  {
					id: "unassign",
					title: "[&ndash;]",
					handler: function(){
						this.unassignCraftJob(1);
					}
			   },{
					id: "unassign5",
					title: "[-5]",
					handler: function(){
						this.unassignCraftJob(5);
					}
			   },{
					id: "unassign25",
					title: "[-25]",
					handler: function(){
						this.unassignCraftJob(25);
					}
			   }]
			);

			this.assignCraftLinks = this.addLinkList([
				{
					id: "assign",
					title: "[+]",
					handler: function(){
						this.assignCraftJob(1);
					}
			   },{
					id: "assign5",
					title: "[+5]",
					handler: function(){
						this.assignCraftJob(5);
					}
			   },{
					id: "assign25",
					title: "[+25]",
					handler: function(){
						this.assignCraftJob(25);
					}
			   }]
			);

		}
	}

});

dojo.declare("com.nuclearunicorn.game.ui.tab.Workshop", com.nuclearunicorn.game.ui.tab, {

	tdTop: null,

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
		dojo.create("span", { innerHTML: "Craft effectiveness: +" + (this.game.getCraftRatio() * 100).toFixed(0) + "%" }, div);

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
		var tdTop = dojo.create("td", { colspan: 2, style: {cursor: "pointer"} }, td);

		this.tdTop = tdTop;

		UIUtils.attachTooltip(this.game, this.tdTop, 5, 0, function(){
			return "You will gain one engineer slot per factory.<br>Every engineer can be assigned to the crafting job which they will perform automatically.";
		});

		var self = this;
		var crafts = this.game.workshop.crafts;
		for (var i = 0; i < crafts.length; i++ ){
			var craft =  crafts[i];
			var craftBtn = new com.nuclearunicorn.game.ui.CraftButton({
				name: craft.label,
				description: craft.description,
				craft: craft.name,
				prices: this.game.workshop.getCraftPrice(craft),
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

		this.update();
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
		var btn = new com.nuclearunicorn.game.ui.UpgradeButton({id: upgrade.name}, this.game);
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

		if (this.tdTop && this.game.science.get("mechanization").researched) {
			this.tdTop.innerHTML = "Free engineers: " + this.game.village.getFreeEngineer() + " / " + this.game.village.getWorkerKittens("engineer");
		} else {
			this.tdTop.innerHTML = "";
		}
	}
});
