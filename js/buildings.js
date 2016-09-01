/**
 * Metadata wrapper, move to the core?
 **/
dojo.declare("classes.Metadata", null, {
	meta: null,

    constructor: function(meta){
        if (!meta){
            throw "Building metadata must be provided for classes.Building instance";
        }
        this.meta = meta;
    },

    getMeta: function(){
		return this.meta;
	},

	set: function(attr, val){
        this.meta[attr] = val;
    }
});

/**
 * On a second thought, using meta wrappers/adapters does not seems like a such good idea.
 * We probably should have an model class governed by a metadata, not an adapter
 */
dojo.declare("classes.BuildingMeta", classes.Metadata, {

    getMeta: function(){
        var bld = this.meta;
        if (bld.upgradable && bld.stages){
			//some specific hack for stagable buildings
			if (bld.stage >= bld.stages.length){
				bld.stage = bld.stages.length-1;
			}
			return dojo.mixin(
                dojo.clone(bld), bld.stages[bld.stage || 0]);
        }
        return bld;
    },

    set: function(attr, value){
		var bld = this.meta;
		if (bld.upgradable){
			var stage = bld.stages[bld.stage || 0];

			//try to set stage attribute if defined in metadata
			if (stage[attr] != undefined) {
				//throw "Invalid attribute '" + attr + "'";
				stage[attr] = value;
				return;
			}
		}
		this.meta[attr] = value;
	}
});

dojo.declare("classes.managers.BuildingsManager", com.nuclearunicorn.core.TabManager, {

	game: null,

    metaCache: null,

	groupBuildings: false,
	twoRows: false,

	constructor: function(game){
		this.game = game;
        this.metaCache = {};
        this.registerMetaBuilding();
	},

	registerMetaBuilding: function() {
		this.registerMeta(this.buildingsData, {
			getEffect: function(bld, effectName){
				var effect = 0;
				var bld = new classes.BuildingMeta(bld).getMeta();
				// Need a better way to do this...
				if (bld.togglable && effectName.indexOf("Max", effectName.length - 3) === -1 &&
                    !(bld.name == "biolab" && effectName.indexOf("Ratio", effectName.length - 5) != -1)){

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
		buildings: ["mine", "quarry", "lumberMill", "oilWell", "accelerator"]
	},{
		name: "industry",
		title: "Industry",
		buildings: ["steamworks", "magneto", "smelter", "calciner", "factory", "reactor" ]
	},
	{
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
		buildings: ["ziggurat", "chronosphere"]
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
		description: "Plant some catnip to grow in the village. "+
			"Fields have +50% production in Spring and -75% production in Winter",
		unlocked: false,
		prices: [{ name : "catnip", val: 10 }],
		effects: {
			"catnipPerTickBase": 0.125
		},
		priceRatio: 1.12,
		val: 0,
		flavor : "'Nip as far as the eye can see."
	},
	{
		name: "pasture",
		upgradable: true,
		unlocked: false,
		stages: [
			{
				label: "Pasture",
				description: "Provides an alternative source of food, which reduces catnip consumption.",
				prices: [{ name : "catnip", val: 100 }, { name : "wood", val: 10 }],
				effects: {
					"catnipDemandRatio": -0.005
				},
				requiredTech: ["animal"],
				priceRatio: 1.15,
				flavor: "Take a pint o' milk, Sir!",
				stageUnlocked : true
			},
			{
				label: "Solar Farm",
				description: "Provides an additional source of energy.",
				prices: [{ name : "titanium", val: 250 }],
				effects: {
					"energyProduction": 2
				},
				requiredTech: ["ecology"],
				priceRatio: 1.15,
				stageUnlocked : false
			}
		],
		effects: {
			"catnipDemandRatio": 0,
			"energyProduction": 0
		},
		stage: 0,
		val: 0,

		calculateEffects: function(self, game){
			var stageMeta = self.stages[self.stage];
			if (self.stage == 0){
				//do nothing
			} else if (self.stage == 1){
                var effects = {
                    "energyProduction": 2
                };
                effects.energyProduction *= 1 + game.workshop.getEffect("solarFarmRatio");
                stageMeta.effects = effects;
			}
		}
	},{
		name: "aqueduct",
		label: "Aqueduct",
		upgradable: true,
		unlocked: false,
		requiredTech: ["engineering"],
		stages: [
			{
				label: "Aqueduct",
				description: "+3% to catnip production",
				prices: [
					{ name : "minerals", val: 75 }],
				effects: {
					"catnipRatio" : 0.03
				},
				priceRatio: 1.12,
				flavor : "No Swimming",
				stageUnlocked : true
			},
			{
				label: "Hydro Plant",
				description: "A modern source of power production",
				priceRatio: 1.15,
				prices: [
					{ name : "concrate", val: 100 },
					{ name : "titanium", val: 2500 }
				],
				effects: {
					"energyProduction" : 5
				},
				stageUnlocked : false
			}
		],
		effects: {
			"catnipRatio": 0,
			"energyProduction": 0
		},
        calculateEffects: function(self, game){
            var stageMeta = self.stages[self.stage];
            if (self.stage == 0){
                //do nothing
            } else if (self.stage == 1){
                var effects = {
                    "energyProduction": 5
                };
                effects.energyProduction *= 1 + game.workshop.getEffect("hydroPlantRatio");
                stageMeta.effects = effects;
            }
        },
		stage: 0,
		val: 0
	},
	//----------------------------------- Population ----------------------------------------
	{
		name: "hut",
		label: "Hut",
		description: "Build a hut (each has a space for 2 kittens). Kittens need catnip to eat, or they will die.<br>Every kitten consumes about 4 catnip/s",
		unlocked: false,
		prices: [{ name : "wood", val: 5 }],
		effects: {
			"maxKittens": 2,
			"manpowerMax": 75
		},
		priceRatio: 2.5,
		breakIronWill: true, //har har har
		unlocks: {
			//unlock village tab
			tabs: ["village"]
		},

		val: 0,
		flavor : "The Nation of Two"
	},
	{
		name: "logHouse",
		label: "Log House",
		description: "Build a house (each has a space for 1 kitten)",
		unlocked: false,
		prices: [{ name : "wood", val: 200 }, { name : "minerals", val: 250 }],
		effects: {
			"maxKittens": 1,
			"manpowerMax": 50
		},
		priceRatio: 1.15,
		requiredTech: ["construction"],
		breakIronWill: true,
		val: 0,
		flavor : "The Cabin in the Woods"
	},{
		name: "mansion",
		label: "Mansion",
		description: "A spacy mansion (each has a space for 1 kitten)",
		unlocked: false,
		prices: [{ name : "slab", val: 185 }, { name : "steel", val: 75 }, { name : "titanium", val: 25 }],
		effects: {
			"maxKittens": 1,
			"manpowerMax": 50
		},
		priceRatio: 1.15,
		ignorePriceCheck: true,
		requiredTech: ["architecture"],
		breakIronWill: true,
		val: 0,
		flavor: "The best shipping container available"
	},
	//----------------------------------- Science ----------------------------------------
	{
		name: "library",
		label: "Library",
		description: "Build a library to store sacred catkind knowledge. Each upgrade level improves your science output by 10%",
		unlocked: false,
		prices: [{ name : "wood", val: 25 }],
		effects: {
			"scienceRatio": 0,
			"scienceMax": 0,
			"cultureMax": 0
			},
		priceRatio: 1.15,
		unlocks: {
			tabs: ["science"],
			jobs: ["scholar"]
		},
		calculateEffects: function(self, game){
			var effects = {
				"scienceRatio": 0.1,
				"scienceMax": 250,
				"cultureMax": 10
			};
			var libraryRatio = game.workshop.getEffect("libraryRatio");
			effects["scienceMax"] *= (1 + game.bld.get("observatory").val * libraryRatio);
			self.effects = effects;
		},
		val: 0,
		flavor: "All in Catonese"
	},{
		name: "academy",
		label: "Academy",
		description: "Improves your research ratio and the speed of your kitten skills growth. Each upgrade level improves your science output by 20%",
		unlocked: false,
		prices: [{ name : "wood", val: 50 },
				 {name : "minerals", val: 70 },
				 { name : "science", val: 100 }],
		effects: {
			"scienceRatio": 0.2,
			"learnRatio": 0.05,
			"cultureMax": 25,
			"scienceMax": 500
		},
		priceRatio: 1.15,
		requiredTech: ["math"],
		val: 0,
		flavor: "Curiosity is the basis of science. Our cats died nobly"
	},{
		name: "observatory",
		label: "Observatory",
		description: "Increases the chance of astronomical events by 0.2%",
		unlocked: false,
		prices: [{ name : "scaffold", val: 50 },
				 { name : "slab", val: 35 },
				 { name : "iron", val: 750 },
				 { name : "science", val: 1000 }
		],
		effects: {
			"scienceRatio": 0,
			"starEventChance": 0,
			"starAutoSuccessChance": 0,
			"scienceMax": 0
			},
		priceRatio: 1.10,
		ignorePriceCheck: true,
		requiredTech: ["astronomy"],
		upgrades: {
			buildings: ["library"]
		},
		action: function(self, game){
			var effects = {
				"scienceRatio": 0.25,
				"starEventChance": 0.002,
				"starAutoSuccessChance": 0.01,
				"scienceMax": 1000
			};

			if (game.workshop.get("astrolabe").researched){
				effects["scienceMax"] = 1500;
			}

			var ratio = 1 + game.space.getEffect("observatoryRatio");
			effects["scienceMax"] *= ratio;
			effects["scienceRatio"] *= ratio;

			self.effects = effects;
		},
		val: 0,
		flavor: "Yearning to one day catch the red light fairy"
	},{
		name: "biolab",
		label: "Bio Lab",
		description: "Improves effectiveness of catnip refinement by 10%",
		unlocked: false,
		prices: [{ name : "slab", val: 100 },
				 { name : "alloy", val: 25 },
				 { name : "science", val: 1500 }
		],
		enabled: true,
		effects: {
			"scienceRatio": 0.35,
			"refineRatio": 0.1,
			"catnipPerTickCon": 0,
			"oilPerTickProd": 0,
			"scienceMax": 1500,
			"energyConsumption": 0
		},
		priceRatio: 1.10,
		ignorePriceCheck: true,
		requiredTech: ["biology"],
		calculateEffects: function(self, game){
			var effects = {
				"scienceRatio": 0.35,
				"refineRatio": 0.1,
				"catnipPerTickCon": 0,
				"oilPerTickProd": 0,
				"scienceMax": 1500,
				"energyConsumption": 0
			};

			self.togglable = false;
			self.tunable = false;
			if (game.workshop.get("biofuel").researched){
				self.togglable = true;
				self.tunable = true;
			}

			self.effects = effects;
		},
		lackResConvert: false,
		action: function(self, game){
			if (game.workshop.get("biofuel").researched){
				self.effects["energyConsumption"] = 1;

			self.effects["catnipPerTickCon"] = -1;
			self.effects["oilPerTickProd"]= 0.02 * (1 + game.workshop.getEffect("biofuelRatio"));

			var amt = game.resPool.getAmtDependsOnStock(
				[{res: "catnip", amt: -self.effects["catnipPerTickCon"]}],
				self.on
			);
			self.effects["catnipPerTickCon"]*=amt;
			self.effects["oilPerTickProd"]*=amt;

			return amt;
			}
		},
		val: 0,
		on: 0,
		flavor: "New postdoc positions available."
	},
	//----------------------------------- Resource storage -------------------------------------------
	{
		name: "barn",
		label: "Barn",
		description: "Provides a space to store your resources.",
		unlocked: false,
		prices: [{ name : "wood", val: 50 }],
		effects: {
			"catnipMax": 0,
			"woodMax": 0,
			"mineralsMax": 0,
			"ironMax": 0,
			"coalMax": 0,
			"goldMax": 0,
			"titaniumMax": 0
			},
		priceRatio: 1.75,
		requiredTech: ["agriculture"],
		calculateEffects: function (self, game){
			var effects = {
				"catnipMax": 5000,
				"woodMax": 200,
				"mineralsMax": 250,
				"ironMax": 50,
				"coalMax": 60,
				"goldMax": 10,
				"titaniumMax": 2
			};

			self.effects = game.resPool.addBarnWarehouseRatio(effects);
		},
		val: 0,
		flavor: "Rats ain't a problem for us!"
	},
	{
		name: "warehouse",
		label: "Warehouse",
		description: "Provides a space to store your resources",
		unlocked: false,
		prices: [{ name : "beam", val: 1.5 }, { name : "slab", val: 2 }],
		effects: {
			"catnipMax": 0,
			"woodMax": 0,
			"mineralsMax": 0,
			"ironMax": 0,
			"coalMax": 0,
			"goldMax": 0,
			"titaniumMax": 0
			},
		priceRatio: 1.15,
		ignorePriceCheck: true,
		requiredTech: ["construction"],
		calculateEffects: function(self, game){
			var effects = {
				"catnipMax": 0,
				"woodMax": 150,
				"mineralsMax": 200,
				"ironMax": 25,
				"coalMax": 30,
				"goldMax": 5,
				"titaniumMax": 10
			};

			if (game.workshop.get("silos").researched){
				effects["catnipMax"] = 750;
			}

			self.effects = game.resPool.addBarnWarehouseRatio(effects);
		},
		val: 0,
		flavor: "All our stocks are scratched"
	},
	{
		name: "harbor",
		label: "Harbour",
		description: "Provides a space to store your resources",
		unlocked: false,
		prices: [{ name : "scaffold", val: 5 }, { name : "slab", val: 50 }, { name : "plate", val: 75 }],
		effects: {
			"catnipMax": 0,
			"woodMax": 0,
			"mineralsMax": 0,
			"ironMax": 0,
			"coalMax": 0,
			"goldMax": 0,
			"titaniumMax": 0
			},
		priceRatio: 1.15,
		ignorePriceCheck: true,
		requiredTech: ["navigation"],
		calculateEffects: function(self, game){
			var effects = {
				"catnipMax": 2500,
				"woodMax": 700,
				"mineralsMax": 950,
				"ironMax": 150,
				"coalMax": 100,
				"goldMax": 25,
				"titaniumMax": 50
			};

			effects["coalMax"] *= (1 + game.workshop.getEffect("harborCoalRatio"));

			var cargoShips = game.workshop.get("cargoShips");
			if (cargoShips.researched){
				var shipVal = game.resPool.get("ship").value;

				//100% to 225% with slow falldown on the 75%
				var limit = 2.25 + game.workshop.getEffect("shipLimit") * game.bld.get("reactor").val;
				var ratio = 1 + game.bld.getHyperbolicEffect(cargoShips.effects["harborRatio"] * shipVal, limit);

				effects["catnipMax"] *= ratio;
				effects["woodMax"] *= ratio;
				effects["mineralsMax"] *= ratio;
				effects["ironMax"] *= ratio;
				effects["coalMax"] *= ratio;
				effects["goldMax"] *= ratio;
				effects["titaniumMax"] *= ratio;
			}

			self.effects = game.resPool.addBarnWarehouseRatio(effects);
		},
		val: 0,
		flavor: "Ahoy, landlubbers!"
	},
	//----------------------------------- Resource production ----------------------------------------
	{
		name: "mine",
		label: "Mine",
		description: "Unlocks the miner job. Each upgrade level improves your mineral output by 20%",
		unlocked: false,
		prices: [{ name : "wood", val: 100 }],
		effects: {
			"mineralsRatio": 0,
			"coalPerTickBase": 0
			},
		priceRatio: 1.15,
		requiredTech: ["mining"],
		unlockRatio: 0.15,

		unlocks: {
			jobs: ["miner"]
		},
		val: 0,
		calculateEffects: function(self, game){
			var effects = {
				"mineralsRatio": 0.2,
				"coalPerTickBase": 0
			};

			if (game.workshop.get("deepMining").researched){
				//fun but ugly hack
				effects["coalPerTickBase"] = 0.003;
			}

			self.effects = effects;
		},
		flavor: "100 days without diggor mortis"
	},{
		name: "quarry",
		label: "Quarry",
		description: "Quarries each improve your mining efficiency by 35% and produce a bit of coal",
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
		val: 0,
		flavor : "It's full of mice! Wait, wrong 'quarry'"
	},
	{
		name: "smelter",
		label: "Smelter",
		description: "Smelts ore into metal",
		unlocked: false,
		enabled: false,
		on: 0,
		togglable: true,
		tunable: true,
		prices: [{ name : "minerals", val: 200 }],
		priceRatio: 1.15,
		requiredTech: ["metal"],
		effects: {
			"woodPerTickCon": -0.05,
			"mineralsPerTickCon": -0.1,
			"ironPerTickAutoprod": 0.02,
			"coalPerTickAutoprod": 0,
			"goldPerTickAutoprod": 0,
			"titaniumPerTickAutoprod": 0
		},
		lackResConvert: false,
		action: function(self, game){
			// TODO: How to integrate autoProdRatio with calculateEffects?

			if (self.on < 1){
				return;
			}

			var iron = game.resPool.get("iron");

			//safe switch for IW to save precious resources, as per players request
			//only if option is enabled, because Chris says so
			if (game.ironWill && game.opts.IWSmelter && iron.value > iron.maxValue * 0.95){
				self.enabled = false;
				self.on = 0;
				return;
			}

			self.effects = {
				"woodPerTickCon": 0,
				"mineralsPerTickCon": 0,
				"ironPerTickAutoprod": 0.02,
				"coalPerTickAutoprod": 0,
				"goldPerTickAutoprod": 0,
				"titaniumPerTickAutoprod": 0
			};


			var smelterRatio = (1 + game.workshop.getEffect("smelterRatio"));
			self.effects["ironPerTickAutoprod"] = 0.02 * smelterRatio;

			if (game.workshop.get("goldOre").researched){
				self.effects["goldPerTickAutoprod"] = 0.001;
			}

			if (game.workshop.get("coalFurnace").researched){
				self.effects["coalPerTickAutoprod"] = 0.005 * smelterRatio;
			}

			if (game.workshop.get("nuclearSmelters").researched){
				self.effects["titaniumPerTickAutoprod"] = 0.0015;
			}

			self.effects["woodPerTickCon"] = -0.05;
			self.effects["mineralsPerTickCon"] = -0.1;

			var amt = game.resPool.getAmtDependsOnStock(
				[{res: "wood", amt: -self.effects["woodPerTickCon"]},
				 {res: "minerals", amt: -self.effects["mineralsPerTickCon"]}],
				self.on
			);
			self.effects["woodPerTickCon"]*=amt;
			self.effects["mineralsPerTickCon"]*=amt;
			self.effects["ironPerTickAutoprod"]*=amt;
			self.effects["goldPerTickAutoprod"]*=amt;
			self.effects["coalPerTickAutoprod"]*=amt;
			self.effects["titaniumPerTickAutoprod"]*=amt;

			return amt;
		},
		val: 0,
		flavor: "Watch your whiskers!"
	},{
		name: "calciner",
		label: "Calciner",
		description: "A highly effective source of metal. Consumes 1.5 minerals and 0.02 oil per tick. Produces iron and a small amount of titanium",
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
		effects: {
			"mineralsPerTickCon" : 0,
			"ironPerTickCon" : 0,
			"ironPerTickAutoprod" : 0.15,
			"titaniumPerTickAutoprod" : 0.0005,
			"oilPerTickCon" : 0,
			"energyConsumption" : 1,
			"coalPerTickCon": 0,
			"steelPerTickProd": 0
		},
		lackResConvert: false,
		action: function(self, game){
			// TODO: How to integrate autoProdRatio with calculateEffects?

			if (self.on < 1){
				return;
			}

			self.effects["oilPerTickCon"] = -0.024; //base + 0.01
			self.effects["mineralsPerTickCon"] = -1.5;
			var calcinerRatio = game.workshop.getEffect("calcinerRatio");
			self.effects["titaniumPerTickAutoprod"] = 0.0005 * ( 1 + calcinerRatio*3 );
			self.effects["ironPerTickAutoprod"] = 0.15 * ( 1 + calcinerRatio );

			amt = game.resPool.getAmtDependsOnStock(
				[{res: "oil", amt: -self.effects["oilPerTickCon"]},
				 {res: "minerals", amt: -self.effects["mineralsPerTickCon"]}],
				self.on
			);
			self.effects["oilPerTickCon"]*=amt;
			self.effects["mineralsPerTickCon"]*=amt;
			self.effects["ironPerTickAutoprod"]*=amt;
			self.effects["titaniumPerTickAutoprod"]*=amt;

			var amtFinal = amt;

			var steelRatio = game.workshop.getEffect("calcinerSteelRatio");

			if (steelRatio && self.isAutomationEnabled){

				// Second conversion of some of the iron that was just created, to steel
				var difference = self.effects["ironPerTickAutoprod"] * steelRatio * game.bld.getAutoProductionRatio(); //HACK
				self.effects["ironPerTickCon"] = -difference;
				self.effects["coalPerTickCon"] = -difference;
				self.effects["steelPerTickProd"] = difference / 100;

				amt = game.resPool.getAmtDependsOnStock(
					[{res: "iron", amt: -self.effects["ironPerTickCon"]},
					 {res: "coal", amt: -self.effects["coalPerTickCon"]}],
					self.on
				);
				self.effects["ironPerTickCon"]*=amt;
				self.effects["coalPerTickCon"]*=amt;
				self.effects["steelPerTickProd"]*=(amt*(1 + game.getCraftRatio() * game.workshop.getEffect("calcinerSteelCraftRatio") + game.bld.get("reactor").val * game.workshop.getEffect("calcinerSteelReactorBonus")));

				amtFinal = (amtFinal + amt) / 2;
			}

			return amtFinal;
		},
		isAutomationEnabled: true, /* Commented until I figure out a way to fit more buttons */
		val: 0
	},
	{
		name: "steamworks",
		label: "Steamworks",
		description: "When active, significantly reduces your coal production. Does nothing useful by default, but can do a lot of cool stuff once upgraded.",
		unlocked: false,
		enabled: false,
		togglable: true,
		on: 0,
		jammed: false,
		prices: [
			{ name : "steel", val: 65 },
			{ name : "gear",  val: 20 },
			{ name : "blueprint",  val: 1 }
		],
		priceRatio: 1.25,
		ignorePriceCheck: true,
		requiredTech: ["machinery"],
		effects: {
			"magnetoBoostRatio": 0,
			"coalRatioGlobal" : 0,
			"energyProduction": 0,
			"manuscriptPerTickProd": 0
		},
		calculateEffects: function(self, game){
			var effects = {
				"magnetoBoostRatio": 0.15,
				"coalRatioGlobal" : -0.8,	//to be revisited later
				"manuscriptPerTickProd": 0,
				"energyProduction": 1
			};

			var coalRatio = game.workshop.getEffect("coalRatioGlobal");
			effects["coalRatioGlobal"] += coalRatio;

			self.effects = effects;
		},
		action: function(self, game){
			if (self.on < 1){
				return;
			}

			if (game.workshop.get("printingPress").researched){
				var amt = 0.0005;						// 2 per year per SW

				if (game.workshop.get("offsetPress").researched){
					amt *= 4;
				}
				if (game.workshop.get("photolithography").researched){
					amt *= 4;
				}
				self.effects["manuscriptPerTickProd"] = amt;
			}

			if (self.effects["manuscriptPerTickProd"]){
				self.effects["manuscriptPerTickProd"]*=self.on;
			}

			if (game.workshop.get("factoryAutomation").researched && !self.jammed){
				var baseAutomationRate = 0.02;

				var wood = game.resPool.get("wood");
				var minerals = game.resPool.get("minerals");
				var iron = game.resPool.get("iron");

				if (wood.maxValue == 0 || minerals.maxValue == 0) {
					// Hack to prevent factory automation from starting
					// when the page is first loaded, before caps are
					return;
				}
				if (
					wood.value >= wood.maxValue * (1 - baseAutomationRate) ||
					minerals.value >= minerals.maxValue * (1 - baseAutomationRate) ||

					(game.workshop.get("pneumaticPress").researched &&
						iron.value >= iron.maxValue * (1 - baseAutomationRate))
				){

					if (!self.isAutomationEnabled){
						game.msg("Skipping workshop automation...", null, "workshopAutomation");
						self.jammed = true;
						return;
					}

					game.msg("Activating workshop automation", null, "workshopAutomation");
					self.jammed = true;				//Jam until next year
				} else {
					return;
				}

				var ratio = game.getCraftRatio();
				// Cap automation at 90% of resource cap to prevent trying to craft more than you have
				var automationRate = Math.min(baseAutomationRate + baseAutomationRate * self.on, 0.9);

				if (wood.value >= wood.maxValue * (1 - baseAutomationRate)){
					var autoWood = wood.value * (automationRate);
					if (autoWood >= game.workshop.getCraft("beam").prices[0].val){
						var amt = Math.floor(autoWood / game.workshop.getCraft("beam").prices[0].val);
						game.workshop.craft("beam", amt);
						game.msg("Spent " + game.getDisplayValueExt(autoWood) + " wood, +" + game.getDisplayValueExt(amt + amt * ratio) + " beams!", null, "workshopAutomation");
					}
				}
				if (minerals.value >= minerals.maxValue * (1 - baseAutomationRate)){
					var autoMinerals = minerals.value * (automationRate);
					if (autoMinerals > game.workshop.getCraft("slab").prices[0].val){
						var amt = Math.floor(autoMinerals / game.workshop.getCraft("slab").prices[0].val);
						game.workshop.craft("slab", amt);
						game.msg("Spent " + game.getDisplayValueExt(autoMinerals) + " minerals, +" + game.getDisplayValueExt(amt + amt * ratio) + " slabs!", null, "workshopAutomation");
					}
				}

				if (game.workshop.get("pneumaticPress").researched && iron.value >= iron.maxValue * (1 - baseAutomationRate)){
					var autoIron = iron.value * (automationRate);

					if (autoIron > game.workshop.getCraft("plate").prices[0].val){
						var amt = Math.floor(autoIron / game.workshop.getCraft("plate").prices[0].val);
						game.workshop.craft("plate", amt);
						game.msg("Spent " + game.getDisplayValueExt(autoIron) + " iron, +" + game.getDisplayValueExt(amt + amt * ratio) + " plates!", null, "workshopAutomation");
					}
				}
			}
		},
		val: 0,
		isAutomationEnabled: true,
		flavor: "I just nap here and it looks like I'm working"
	},{
		name: "magneto",
		label: "Magneto",
		description: "Improves your total resource production by 2%. Every steamworks will boost this effect by 15%. Consumes oil.",
		unlocked: false,
		enabled: false,
		togglable: true,
		tunable: true,
		on: 0,
		prices: [
			{ name : "alloy", val: 10 },
			{ name : "gear",  val: 5 },
			{ name : "blueprint",  val: 1 }
		],
		priceRatio: 1.25,
		ignorePriceCheck: true,
		requiredTech: ["electricity"],
		effects: {
			"oilPerTick" : -0.05,
			"magnetoRatio": 0.02,
			"energyProduction" : 5
		},
		action: function(self, game){
			if (self.on < 1){
				return;
			}
			self.effects["oilPerTick"]= -0.05;

			var oil = game.resPool.get("oil");
			if (oil.value+self.effects["oilPerTick"] <= 0){
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
			"woodRatio" : 0
		},
		priceRatio: 1.15,
		val: 0,
		requiredTech: ["construction"],
		canUpgrade: true,
		calculateEffects: function(self, game){
			var effects = {
				"woodRatio" : 0.1
			};

			var ratio = 1 + game.workshop.getEffect("lumberMillRatio");
			effects["woodRatio"] *= ratio;

			self.effects = effects;
		},
		flavor: "Best log analysing tool"
	},
	{
		name: "oilWell",
		label: "Oil Well",
		description: "Produces a bit of oil, +1500 to maximum oil limit",
		unlocked: false,
		prices: [
			{name : "steel", val: 50},
			{name : "gear",  val: 25},
			{name : "scaffold", val: 25}
		],
		effects: {
			"oilPerTickBase" : 0,
			"oilMax" : 0,
			"energyConsumption": 0
		},
		priceRatio: 1.15,
		ignorePriceCheck: true,
		val: 0,
		on: 0,
		requiredTech: ["chemistry"],
		canUpgrade: true,
		togglable: false,
		tunable: false,
		calculateEffects: function(self, game){
			var effects = {
				"oilPerTickBase" : 0.02,
				"oilMax" : 1500,
				"energyConsumption": 0
			};

			var ratio = 1 + game.workshop.getEffect("oilWellRatio");
			effects["oilPerTickBase"] *= ratio;

			if (game.workshop.get("pumpjack").researched){
				effects["energyConsumption"] = 1;
				self.togglable = true;
				self.tunable = true;
			}else {
				self.on = self.val; // Hack to not turn off while pumpjack is researched
			}

			self.effects = effects;
		},
		flavor: "Rise early, work hard, strike oil."
	},
	//----------------------------------- Other ----------------------------------------
	{
		name: "workshop",
		label: "Workshop",
		description: "Provides a vast variety of upgrades. Improves craft effectiveness by 6%",
		unlocked: false,
        ignorePriceCheck: true,
		prices: [
			{ name : "wood", val: 100 },
			{ name : "minerals", val: 400 }
		],
		effects: {
			"craftRatio" : 0.06	//6% for craft output
		},
		priceRatio: 1.15,
		unlocks: {
			tabs: ["workshop"]
		},
		val: 0,
		flavor: "Free toys for workers"
	},{
		name: "factory",
		label: "Factory",
		description: "Improves craft effectiveness",
		unlocked: false,
		ignorePriceCheck: true,
		prices: [
			{ name : "titanium", val: 2000 },
			{ name : "plate", val: 2500},
			{ name : "concrate", val: 15}
		],
		effects: {
			"craftRatio": 0,
			"energyConsumption": 0
		},
		calculateEffects: function(self, game){
			var effects = {
				"craftRatio": 0.05,
				"energyConsumption": 2
			};

			if (game.workshop.get("factoryLogistics").researched) {
				effects["craftRatio"] = 0.06;
			}

			self.effects = effects;
		},
		priceRatio: 1.15,
		val: 0,
		on: 0,
		togglable: true,
		tunable: true,
		requiredTech: ["mechanization"]
	},{
		name: "reactor",
		label: "Reactor",
		description: "Provides a 5% boost to production while active. Requires uranium to operate.",
		unlocked: false,
		ignorePriceCheck: true,
		togglable: true,
		tunable: true,
		on: 0,
		prices: [
			{ name : "titanium",    val: 3500 },
			{ name : "plate", 		val: 5000},
			{ name : "concrate",    val: 50},
			{ name : "blueprint",   val: 25}
		],
		effects: {
			"uraniumPerTick" : 0,
			"productionRatio": 0,
			"uraniumMax" : 0,
			"energyProduction" : 0
		},
		priceRatio: 1.15,
		val: 0,
		requiredTech: ["nuclearFission"],
		upgrades: {
			buildings: ["harbor"]
		},
		calculateEffects: function(self, game){
			var effects = {
				"uraniumPerTick" : -0.001,
				"productionRatio": 0.05,
				"uraniumMax" : 250,
				"energyProduction" : 10
			};

			effects["uraniumPerTick"] *= (1 - game.workshop.getEffect("uraniumRatio"));
            effects["energyProduction"] *= ( 1+ game.workshop.getEffect("reactorEnergyRatio"));

			self.effects = effects;
		},
		action: function(self, game){
			var uranium = game.resPool.get("uranium");

			self.effects["uraniumPerTick"]= -0.001 * (1 - game.workshop.getEffect("uraniumRatio"));

			if (uranium.value+self.effects["uraniumPerTick"] <= 0){
				self.on = 0;
				self.enabled = false;
			}
		},
		flavor: "Glowing mice are much easier to catch!"
	},{
		name: "accelerator",
		label: "Accelerator",
		description: "Converts titanium to the uranium (sic)",
		unlocked: false,
		ignorePriceCheck: true,
		togglable: true,
		tunable: true,
		on: 0,
		prices: [
			{ name : "titanium",    val: 7500 },
			{ name : "concrate",    val: 125  },
			{ name : "uranium",   	val: 25   }
		],
		effects: {
			"titaniumPerTickCon" : 0,
			"uraniumPerTickAutoprod" : 0,
			"scienceMax": 0,
			"catnipMax": 0,
			"woodMax": 0,
			"mineralsMax": 0,
			"ironMax": 0,
			"coalMax": 0,
			"goldMax": 0,
			"titaniumMax": 0,
			"energyConsumption": 0
		},
		priceRatio: 1.15,
		val: 0,
		requiredTech: ["particlePhysics"],
		calculateEffects: function(self, game){
			var effects = {
				"titaniumPerTickCon" : 0,
				"uraniumPerTickAutoprod" : 0.0025,
				"scienceMax": 0,
				"catnipMax": 0,
				"woodMax": 0,
				"mineralsMax": 0,
				"ironMax": 0,
				"coalMax": 0,
				"goldMax": 0,
				"titaniumMax": 0,
				"energyConsumption": 2
			};

			if (game.workshop.get("lhc").researched){
				effects["scienceMax"] = 2500;
			}
			//------------- limit upgrades ------------
			var capRatio = (1+game.workshop.getEffect("acceleratorRatio"));
			if (game.workshop.get("energyRifts").researched){
				effects["catnipMax"]   = 30000 * capRatio;
				effects["woodMax"]     = 20000 * capRatio;
				effects["mineralsMax"] = 25000 * capRatio;
				effects["ironMax"]     =  7500 * capRatio;
				effects["coalMax"]     =  2500 * capRatio;
				effects["goldMax"]     =   250 * capRatio;
				effects["titaniumMax"] =   750 * capRatio;
			}

			self.effects = effects;
		},
		lackResConvert: false,
		action: function(self, game){
			// TODO: How to integrate autoProdRatio with calculateEffects?

			self.effects["titaniumPerTickCon"] = -0.015;
			self.effects["uraniumPerTickAutoprod"] = 0.0025;

			var amt = game.resPool.getAmtDependsOnStock(
				[{res: "titanium", amt: -self.effects["titaniumPerTickCon"]}],
				self.on
			);
			self.effects["titaniumPerTickCon"]*=amt;
			self.effects["uraniumPerTickAutoprod"]*=amt;

			return amt;
		},
		flavor: "Large Catron Collider"
	},
	{
		name: "tradepost",
		label: "Tradepost",
		description: "The heart of your trading empire. Improves trade effectiveness by 1.5%, reduces rare resource consumption by 4%",
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
			"tradeRatio" : 0.015,
			"standingRatio": 0
		},
		priceRatio: 1.15,
		val: 0,
		requiredTech: ["currency"],
		calculateEffects: function(self, game){
			var effects = {
				"fursDemandRatio"   : -0.04,
				"ivoryDemandRatio"  : -0.04,
				"spiceDemandRatio"  : -0.04,
				/*"silkDemandRatio"   : -0.04,*/
				"tradeRatio" : 0.015,
				"standingRatio": 0
			};

			var seri = game.workshop.get("caravanserai");
			if (seri.researched){
				effects["standingRatio"] = seri.effects["standingRatio"];
			}

			self.effects = effects;
		},
        flavor: "I hope they have yarn"
	},{
		name: "mint",
		label: "Mint",
		description: "Produces luxurious resources proportional to your max catpower. Consumes catpower and a bit of gold.",
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
			"mintEffect" : 0,
			"manpowerPerTickCon" : 0,
			"goldPerTickCon" : 0,
			"fursPerTickProd": 0,
			"ivoryPerTickProd": 0,
			"goldMax": 0
		},
		priceRatio: 1.15,
		val: 0,
		requiredTech: ["architecture"],
		calculateEffects: function (self, game){
			self.effects = {
				"mintEffect" : 0.007,
				"manpowerPerTickCon" : 0,
				"goldPerTickCon" : 0,
				"fursPerTickProd": 0,
				"ivoryPerTickProd": 0,
				"goldMax": 100 * (1 + game.workshop.getEffect("warehouseRatio"))
			};
		},
		ignorePriceCheck: true,
		lackResConvert: false,
		action: function(self, game){
			// TODO: How to integrate max manpower with calculateEffects?

			if (self.on < 1){
				return;
			}
			self.effects["manpowerPerTickCon"] = -0.75;
			self.effects["goldPerTickCon"] = -0.005; //~5 smelters
			
			var manpower = game.resPool.get("manpower");
			var mpratio = (manpower.maxValue * self.effects["mintEffect"]) / 100;

			self.effects["fursPerTickProd"]  = mpratio * 1.25;	//2
			self.effects["ivoryPerTickProd"] = mpratio * 0.3;	//1.5

			var amt = game.resPool.getAmtDependsOnStock(
				[{res: "manpower", amt: -self.effects["manpowerPerTickCon"]},
				 {res: "gold", amt: -self.effects["goldPerTickCon"]}],
				self.on
			);
			self.effects["manpowerPerTickCon"]*=amt;
			self.effects["goldPerTickCon"]*=amt;
			self.effects["fursPerTickProd"]*=amt;
			self.effects["ivoryPerTickProd"]*=amt;

			return amt;
		}
	},
	//-------------------------- Culture -------------------------------
	{
		name: "amphitheatre",
		unlocked: false,
		upgradable: true,
		effects: {
			"unhappinessRatio" : 0,
			"culturePerTickBase" : 0,
			"cultureMax" : 0
		},
		stages: [
			{
				label: "Amphitheatre",
				description: "Reduces negative effects of overpopulation by 5%. This effect stacks but has diminishing return. Produces culture.",
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
				flavor: "Daily 'All Dogs Go to Heaven' showings",
				stageUnlocked : true
			},
			{
				label : "Broadcast Tower",
				description: "Generates culture and happiness. More effective with high energy production.",
				prices: [
					{ name : "iron", val: 1250 },
					{ name : "titanium", val: 75 }
				],
				effects: {
					"culturePerTickBase" : 1,
                    "unhappinessRatio" : -0.75,
					"cultureMax" : 300
				},
				priceRatio: 1.18,
				stageUnlocked : false
			}
		],
		ignorePriceCheck: true,
		val: 0,
		stage: 0,
		requiredTech: ["writing"],
        action: function(self, game){
           //very ugly and crappy stuff
            var btower = self.stages[1];

            btower.effects["cultureMax"] = 300;
            btower.effects["culturePerTickBase"] = 1;

            var energyRatio = (game.resPool.energyProd / game.resPool.energyCons);
            if (energyRatio > 1){
                if (energyRatio > 1.75){
                    energyRatio = 1.75;
                }
                btower.effects["cultureMax"] = Math.floor( (300 * energyRatio) *1000)/1000;
                btower.effects["culturePerTickBase"] = Math.floor( (1 * energyRatio) *1000)/1000;
            }

            var broadcastTowerRatio = game.workshop.getEffect("broadcastTowerRatio");
            var totalRatio = game.space.getProgram("sattelite").val * broadcastTowerRatio;

            btower.effects["cultureMax"] *= ( 1 + totalRatio);
            btower.effects["culturePerTickBase"] *= ( 1 + totalRatio);
        }
	},
	{
		name: "chapel",
		label: "Chapel",
		description: "Produces a bit of culture and faith per tick. May be improved with religious upgrades",
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
		val: 0,
		requiredTech: ["acoustics"]
	},
	{
		name: "temple",
		label: "Temple",
		description: "Temple of light. Produces culture. May be improved with Theology.",
		unlocked: false,
		prices: [
			{ name : "slab", val: 25 },
			{ name : "plate", val: 15 },
			{ name : "gold", val: 50 },
			{ name : "manuscript", val: 10 }
		],
		effects: {
			"culturePerTickBase" : 0,
			"faithPerTickBase" : 0,
			"happiness" : 0,
			"manpowerMax" : 0,
			"scienceMax" : 0,
			"cultureMax" : 0,
			"faithMax": 0
		},
		priceRatio: 1.15,
		ignorePriceCheck: true,
		val: 0,
		requiredTech: ["philosophy"],
		calculateEffects: function(self, game){
			var effects = {
				"culturePerTickBase" : 0.1,
				"faithPerTickBase" : 0,
				"happiness" : 0,
				"manpowerMax" : 0,
				"scienceMax" : 0,
				"cultureMax" : 0,
				"faithMax": 100
			};

			var theology = game.science.get("theology");
			if (theology.researched){
				effects["faithPerTickBase"] = 0.0015;
			}

			var stainedGlass = game.religion.getRU("stainedGlass");
			if (stainedGlass.researched){
				effects["culturePerTickBase"] += 0.05 * stainedGlass.val;
			}

			var scholastics = game.religion.getRU("scholasticism");
			if (scholastics.researched){
				effects["scienceMax"] = 400 + 100 * scholastics.val;
			}

			var sunAltar = game.religion.getRU("sunAltar");
			if (sunAltar.researched){
				effects["faithMax"] += 50 * sunAltar.val;
				effects["happiness"] = 0.4 + 0.1 * sunAltar.val;
			}

			var goldenSpire = game.religion.getRU("goldenSpire");
			if (goldenSpire.researched){
				effects["faithMax"] *= (1 + (0.4 + 0.1 * goldenSpire.val));
			}

			var basilica = game.religion.getRU("basilica");
			if (basilica.researched){
				effects["cultureMax"] = 75 + 50 * basilica.val;
				effects["culturePerTickBase"] += 0.2 + 0.05 * (basilica.val-1);
			}

			var templars = game.religion.getRU("templars");
			if (templars.researched){
				effects["manpowerMax"] = 50 + 25 * templars.val;
			}

			self.effects = effects;
		},
		flavor: "All praise Ceiling Cat!"
	},
	{
		name: "unicornPasture",
		label: "Unic. Pasture",
		description: "Allows the taming of unicorns. Reduces catnip consumption by 0.15%",
		unlocked: false,
		prices: [
			{ name : "unicorns", val: 2 }
		],
		effects: {
			"catnipDemandRatio": -0.0015,
			"unicornsPerTickBase" : 0.001
		},
		priceRatio: 1.75,
		val: 0,
		requiredTech: ["animal"],
		canUpgrade: true,
		flavor: "We glue horns on horses"
	},
	//----------------------------------- Wonders ----------------------------------------

	{
		name: "ziggurat",
		label: "Ziggurat",
		description: "The dark legacy of the lost race. May have special usage once Theology is researched.",
		unlocked: false,
		prices: [
			{ name : "megalith", val: 75 },
			{ name : "scaffold", val: 50 },
			{ name : "blueprint", val: 1 }
		],
		effects: {
		},
		priceRatio: 1.25,
		unlockRatio: 0.01,	//1% of resources required to unlock building instead of default 30
		val: 0,
		requiredTech: ["construction"]
	},{
		name: "chronosphere",
		label: "Chronosphere",
		description: "Relocates small amount of resources through the time. Can be upgraded further. Every chronosphere increases the chance of Temporal Paradox.",
		unlocked: false,
		ignorePriceCheck: true,
		prices: [
			{ name : "unobtainium", val: 2500 },
			{ name : "timeCrystal", val: 1 },
			{ name : "blueprint", 	val: 100 },
			{ name : "science", 	val: 250000 }
		],
		effects: {
			"resStasisRatio": 0.015,		//1.5% of resources will be preserved
			"energyConsumption" : 20

			/** TODO: cryochambers upgrade for kittens migration */
		},
		priceRatio: 1.25,
		val: 0,
		requiredTech: ["chronophysics"]
	}
	],

	effectsBase: {
		"manpowerMax"	: 100,
		"catnipMax"		: 5000,
		"woodMax"		: 200,
		"mineralsMax"	: 250,
		"faithMax" 		: 100,
		"cultureMax"	: 100,
		"uraniumMax"	: 250,
		"unobtainiumMax": 150,
		"antimatterMax": 1000
	},

	get: function(name){
		return this.getBuilding(name);
	},

    //deprecated, use getBuildingExt
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
     * Returns a class wrapper around the building metadata
     */
    getBuildingExt: function(name){
        var bldExt = this.metaCache[name];
        if (bldExt){
            return bldExt;
        }
        for (var i = 0; i < this.buildingsData.length; i++){
			var bld = this.buildingsData[i];
			if (bld.name == name){
                var bldExt = new classes.BuildingMeta(bld);
                this.metaCache[name] = bldExt;
                return bldExt;
            }
        }
    },

	getAutoProductionRatio: function(){
		var autoProdRatio = 1;
		//	faith
		autoProdRatio *= ( 1 + this.game.religion.getProductionBonus() / 100);
		//	SW
		var steamworks = this.get("steamworks");
		var swRatio = steamworks.on > 0 ? (1+ steamworks.effects["magnetoBoostRatio"] * this.get("steamworks").on) : 1;
			autoProdRatio *= (1 + this.getEffect("magnetoRatio") * swRatio);

		// paragon (25%)
			autoProdRatio *= (1 + this.game.prestige.getParagonProductionRatio() * 0.25);

		// reactors
		autoProdRatio *= (1 + this.getEffect("productionRatio"));

		var effects = {};
		effects["iron"] = autoProdRatio; // Iron because Steel Plants
		game.calendar.cycleEffects(effects);
		autoProdRatio = effects["iron"];

		return autoProdRatio;

		//This function must stay atm for Steel Plants
	},

	/**
	 * Since there are now dynamic effects affecting price ratio, it should be calculated there
	 * All direct calls to bld.price ratio should be considered deprecated
	 */
	getPriceRatio: function(bldName){
		var bld = this.getBuildingExt(bldName).getMeta();
		var ratio = bld.priceRatio;

		var ratioBase = ratio - 1;

		var ratioDiff = this.game.workshop.getEffect(bldName + "PriceRatio") || 0;
		ratioDiff += this.game.prestige.getEffect("priceRatio") || 0;

		ratioDiff = this.getHyperbolicEffect(ratioDiff, ratioBase);

		return ratio + ratioDiff;
	},

	/**
	 * For fucks sake, finally we have a non-concrete dynamic price calculation algorithm
	 * It only took a couple of months. TODO: potential performance impact?
	 */
	 getPrices: function(bldName) {
		var bld = this.getBuildingExt(bldName).getMeta();
		var ratio = this.getPriceRatio(bldName);

		var prices = dojo.clone(bld.prices);

		for (var i = 0; i< prices.length; i++){
			prices[i].val = prices[i].val * Math.pow(ratio, bld.val);
		}
	    return prices;
	 },

	/**
	 * Returns a total effect value generated by all buildings.
	 *
	 * For example, if you have N buildings giving K effect,
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

		//probably not the best place to handle this mechanics
		//----------- move to separate part? -----------
		if (
			(name == "productionRatio" || name == "magnetoRatio")
			&& (this.game.resPool.energyCons > this.game.resPool.energyProd)){

            var delta = this.game.resPool.getEnergyDelta();
			totalEffect = totalEffect * delta;
		}


		return totalEffect ? totalEffect : 0;
	},

	/*
	 * Returns a parabolic-approaching value of the effect that heads to the limit, but unable to approach it completely
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

		var delta = 0.25*limit; //Lower values will approach 1 more quickly.

		// The last 25% will approach .25 but cannot actually reach it
		var diminishedEffect = (1-(delta/(diminishedPortion+delta)))*0.25*limit;

		var totalEffect = maxUndiminished+diminishedEffect;

		return effect < 0 ? -totalEffect : totalEffect;
	},

	update: function(){
		for (var i = 0; i < this.buildingsData.length; i++){
			var bld = this.buildingsData[i];

			if (!bld.unlocked){
				if (this.isConstructionEnabled(bld)){
					bld.unlocked = true;
					this.game.render();
				}
			} else {
				//just in case we patched something (shit happens?)
				if (!this.isTechUnlocked(bld)){
					bld.unlocked = false;
				}
			}

			if (bld.action && bld.val > 0){
				var amt = bld.action(bld, this.game);
				if (typeof(amt) != "undefined") {
					if (amt == 1) {
						bld.lackResConvert = false;
					} else {
						bld.lackResConvert = true;
					}
				}
			}

		}

		/*
		 * Manpower hack for Iron Will mode. 1000 manpower is absolutely required for civilisation unlock.
		 * There may be some microperf tweaks, but let's keep it simple
		 */
		this.game.bld.effectsBase["manpowerMax"] = 100;
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

		var building = new classes.BuildingMeta(building).getMeta();

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
		saveData.buildings = this.filterMetadata(this.buildingsData, ["name", "unlocked", "enabled", "val", "on", "stage", "jammed", "isAutomationEnabled"]);

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
					var bld = this.game.bld.getBuildingExt(savedBld.name);
					if (!bld) { continue; }

					bld.set("val", savedBld.val);
					bld.set("unlocked", savedBld.unlocked);

					if(savedBld.on != undefined){
						bld.set("on", savedBld.on);
					}

					if (savedBld.jammed != undefined){
						bld.set("jammed", savedBld.jammed);
					}
					if (savedBld.isAutomationEnabled != undefined){
						bld.set("isAutomationEnabled", savedBld.isAutomationEnabled);
					}
					bld.set("enabled", savedBld.enabled);
					if (bld.meta.upgradable){
						bld.set("stage", savedBld.stage);
					}
				}
			}
		}

		this.invalidateCachedEffects();
	},

	resetState: function(){
		for (var i = 0; i < this.buildingsData.length; i++){
			var bld = this.buildingsData[i];

			bld.val = 0;
			bld.unlocked = false;

			if (bld.enabled != undefined){
				bld.enabled = false;
			}
			if (bld.on != undefined){
				bld.on = 0;
			}

			if (bld.upgradable){
				bld.stage = 0;
				for (var j = 1; j < bld.stages.length; j++){ //stages[0] should always be unlocked
					bld.stages[j].stageUnlocked = false;
				}
			}

			if (bld.jammed != undefined){
				bld.jammed = false;
			}
		}
	},

    //============ dev =============
    devAddStorage: function(){
        this.getBuilding("warehouse").val += 10;
        this.getBuilding("barn").val += 10;
        this.getBuilding("harbor").val += 10;
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

	getMetadata: function(){
		if (this.buildingName){
			var meta = this.game.bld.getBuilding(this.buildingName);
			return meta;
		}
		return null;
	},

	/**
	 * Ugly hack'
	 */
	getMetadataRaw: function(){
		return this.getMetadata();
	},

	getPrices: function(){
		if (this.buildingName){
			var prices = this.game.bld.getPrices(this.buildingName);
			return prices;
		}
		return this.prices;
	},

	onClick: function(event){
		this.animate();
		if ((this.enabled && this.hasResources()) || this.game.devMode){

			if (this.handler) {
				this.handler(this);
			}

			var building = this.getMetadataRaw();
			this.game.unlock(building.unlocks);

			if (building.breakIronWill) {
				this.game.ironWill = false;
			}

			if (event.shiftKey){
                if (this.game.opts.noConfirm || confirm("Are you sure you want to construct all buildings?")){
                    this.buildAll(building);
                }
            } else {
                this.build(building);
            }

			//TODO: fix this mess vvvvvvvvvvv
			if (building.togglable && (!building.on)) {
				building.on = 0;
			}

			if (!building.tunable && building.enabled){
				building.on = building.val;
			}
			//TODO: fix this mess ^^^^^^^^^^^

			if (building.upgrades){
				this.game.upgrade(building.upgrades);
			}

			this.game.render();
		}
	},


    build: function(bld){
        this.payPrice();

        if (bld){
            bld.val++;

            //to not force player re-click '+' button all the time
            if (bld.on && bld.tunable){
                bld.on++;
            }

            //price check is sorta heavy operation, so we will store the value in the button
            this.prices = this.getPrices();

			//update stats
			this.game.stats.getStat("buildingsConstructed").val += 1;
        }
        var undo = this.game.registerUndoChange();
        undo.addEvent("bld", bld.name, 1);
    },

    buildAll: function(bld){
        //this is a bit ugly and hackish, but I'm to tired to write proper wrapper code;
        var counter = 0;
        while (this.hasResources()){
            this.build(bld);
            counter++;
        }
        this.game.msg(new classes.BuildingMeta(bld).getMeta().label + " x" + counter + " constructed.", "notice");
        var undo = this.game.registerUndoChange();
        undo.addEvent("bld", bld.name, counter);
    },

    undo: function(metaId, val){
        if (console && console.warn) {
            console.warn("Not implemented yet!");
        }
    },

	getBuildingName: function(){
		return this.name;
	},

	getName: function(lackResConvert){
		var building = this.getMetadata();
		if (building){
			if (building.togglable) {
				var name = this.getBuildingName();

				var prefix = building.tunable ? ( building.on + "/" ) : "";
				var sufix = building.lackResConvert ? " !" : "";
				return name + " ("+ prefix + building.val + ")" + sufix;
			} else {
				var name = this.getBuildingName();
				return name + " (" + building.val + ")";
			}
		}
		return this.name;
	},

	getDescription: function(){
		var building = this.getMetadata();
		if (!building || (building && !building.jammed)){
			return this.description;
		} else {
			return this.description + "<br>" + "***Maintenance***";
		}
	},

	hasSellLink: function(){
		return true && !this.game.opts.hideSell;
	},

	/**
	 * Render button links like off/on and sell
	 */
	renderLinks: function(){
		var building = this.getMetadata();
		var bldMeta = this.getMetadataRaw();

		if (bldMeta && bldMeta.val && this.hasSellLink()){
			if (!this.sellHref){
				this.sellHref = this.addLink("sell",
					function(event){
						var end = bldMeta.val - 1;
						if (end > 0 && event.shiftKey) { //no need to confirm if selling just 1
							if (this.game.opts.noConfirm || confirm("Are you sure you want to sell all?")) {
								end = 0;
							}
						}
						while (bldMeta.val > end && this.hasSellLink() ) { //religion upgrades can't sell past 1
							bldMeta.val--;

							this.refund(0.5);

							this.prices = this.getPrices();
						}

						if (bldMeta.on > bldMeta.val){
							building.on = bldMeta.val;
						}
						this.game.upgrade(building.upgrades);
						this.game.render();
					});
			}
		}

		//--------------- toggle ------------

		if (!building.tunable && !building.togglable){
			return;
		}

		//TODO: is this even supposed to work?
		if (building.tunable){
			if (!this.remLinks){
				this.remLinks = this.addLinkList([
				   {
					id: "off1",
					title: "-",
					handler: function(){
						var building = this.getMetadata();
						if (building.on){
							building.on--;
							this.game.upgrade(building.upgrades);
						}
					}
				   },{
					id: "offAll",
					title: "-all",
					handler: function(){
						var building = this.getMetadata();
						if (building.on) {
							building.on = 0;
							this.game.upgrade(building.upgrades);
						}
					}
				   }]
				);
			}
			if (!this.addLinks){
				this.addLinks = this.addLinkList([
				   {
					id: "add1",
					title: "+",
					handler: function(){
						var building = this.getMetadata();
						if (building.on < building.val){
							building.on++;
							this.game.upgrade(building.upgrades);
						}
					}
				   },{
					id: "add",
					title: "+all",
					handler: function(){
						var building = this.getMetadata();
						if (building.on < building.val) {
							building.on = building.val;
							this.game.upgrade(building.upgrades);
						}
					}
				   }]
				);
			}
		}

		if (!this.toggle && !building.tunable){
			this.toggle = this.addLink( building.enabled ? "off" : "on",
				function(){
					var building = this.getMetadataRaw();
					building.enabled = !building.enabled;

					building.on = building.enabled ? building.val : 0;	//legacy safe switch
					this.game.upgrade(building.upgrades);
				}, true	//use | break
			);
		}

		if (!this.toggleAutomation &&
			(building.name == "steamworks" || (building.name == "calciner" && this.game.opts.hideSell)))
		{
			this.toggleAutomation = this.addLink( building.enabled ? "A" : "*",
				function(){
					var building = this.getMetadataRaw();
					building.isAutomationEnabled = !building.isAutomationEnabled;
				}, true
			);
		}

		if(building.val > 9 && this.hasSellLink()) {
			//Steamworks and accelerator specifically can be too large when sell button is on
			//(tested to support max 99 bld count)
			dojo.addClass(this.domNode, "small-text");
		}
	},

	update: function(){
		this.inherited(arguments);

		var self = this;

		//we are calling update before render, panic flee
		if (!this.buttonContent){
			return;
		}

		var building = this.getMetadata();
		if (building && building.val){

			// -------------- sell ----------------
			if (this.sellHref){
				dojo.setStyle(this.sellHref.link, "display", (building.val > 0) ? "" : "none");
			}

			//--------------- toggle ------------

			if (!building.action && !building.togglable){
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
				this.toggle.link.textContent = building.enabled ? "off" : "on";
				this.toggle.link.title = building.enabled ? "Building enabled" : "Building disabled";
			}

			if (this.toggleAutomation){
				this.toggleAutomation.link.textContent = building.isAutomationEnabled ? "A" : "*";
				this.toggleAutomation.link.title = building.isAutomationEnabled ? "Automation enabled" : "Automation disabled";

				var isAutomationResearched = this.game.workshop.get("factoryAutomation").researched;
				this.isAutomationResearched = true;
				dojo.setStyle(this.toggleAutomation.link, "display", isAutomationResearched ? "" : "none");
				dojo.setStyle(this.toggleAutomation.linkBreak, "display", isAutomationResearched ? "" : "none");
			}

			dojo.toggleClass(this.domNode, "bldEnabled", (building.on > 0 ? true : false));

			if(building.val > 9) {
				dojo.setStyle(this.domNode,"font-size","90%");
			}
		}
	},

	updateVisible: function(){
		this.inherited(arguments);
		var building = this.getMetadata();

		if (!building){
			return;
		}

		if (!building.unlocked && !this.game.devMode){
			this.setVisible(false);
		}else{
			this.setVisible(true);
		}
	}
});

dojo.declare("com.nuclearunicorn.game.ui.GatherCatnipButton", com.nuclearunicorn.game.ui.ButtonModern, {
	onClick: function(){
		this.animate();
		this.handler(this);
	}
});

dojo.declare("com.nuclearunicorn.game.ui.RefineCatnipButton", com.nuclearunicorn.game.ui.ButtonModern, {
	x100Href: null,

	update: function(){
		this.inherited(arguments);
		var catnipVal = this.game.resPool.get("catnip").value;
		var catnipCost = this.prices[0].val;
	    // -------------- x100 ----------------

		if (!this.x100Href){
			this.x100Href = this.addLink("x100",
				function(){

					var catnipVal = this.game.resPool.get("catnip").value;

					if (catnipVal < (catnipCost * 100)){
						this.game.msg("not enough catnip!");
					}

					this.game.resPool.get("catnip").value -= (catnipCost * 100);

					var craftRatio = this.game.getResCraftRatio({name: "wood"}) + 1;
					this.game.resPool.get("wood").value += 100 * craftRatio;

					this.update();
				});

		} else {
			dojo.setStyle(this.x100Href.link, "display", catnipVal < (catnipCost * 100) ? "none" : "");
		}

	}

});

dojo.declare("classes.ui.btn.BuildingBtnModern", com.nuclearunicorn.game.ui.BuildingBtn, {
	simplePrices: false,
	hasResourceHover: true,

	getMetadata: function(){
		if (this.buildingName){
			var bld = this.game.bld.getBuildingExt(this.buildingName).getMeta();
			return bld;
		}
		return null;
	},

	/**
	 * Ugly hack
	 **/
	getMetadataRaw: function(){
		if (this.buildingName){
			var bld = this.game.bld.getBuilding(this.buildingName);
			return bld;
		}
		return null;
	},

	getDescription: function(){
		return this.description;
	},

	getFlavor: function(){
		var bld = this.getMetadata();
		return bld.flavor;
	},

	getEffects: function(){
		var bld = this.getMetadata();
		return bld.effects;
	},

	getSelectedObject: function(){
		return this.getMetadata();
	}
});

//-------------------    special stagable bld exclusive button ------------------------------------------------
dojo.declare("classes.ui.btn.StagingBldBtn", classes.ui.btn.BuildingBtnModern, {
	stageLinks: null,

	constructor: function(){
		this.stageLinks = [];
	},

	renderLinks: function(){
		this.inherited(arguments);
		var bldExt = this.game.bld.getBuildingExt(this.buildingName);

		var stages = bldExt.getMeta().stages.length;
		var stage = bldExt.meta.stage || 0;

		if (this.stageLinks.length > 0){
			return;
		}
		for (var i = 1; i < stages; i++){
			if (i <= stage){
				//downgrade
				this.stageLinks.push(
					this.addLink("V",function(){
						if (confirm('Do you want to downgrade building?')){
							bldExt.meta.stage = bldExt.meta.stage -1 || 0;
							bldExt.meta.val = 0;	//TODO: fix by using separate value flags
							if (bldExt.meta.calculateEffects){
								bldExt.meta.calculateEffects(bldExt.meta, this.game);
							}
							this.game.render();
						}
					})
				);
			} else {
				//upgrade
				if (!bldExt.getMeta().stages[i].stageUnlocked){
					continue;
				}
				this.stageLinks.push(
					this.addLink("^",function(){
						if (confirm('Do you want to upgrade building? You will lose all existing buildings.')){
							bldExt.meta.stage = bldExt.meta.stage || 0;
							bldExt.meta.stage++;

							bldExt.meta.val = 0;	//TODO: fix by using separate value flags
							if (bldExt.meta.calculateEffects){
								bldExt.meta.calculateEffects(bldExt.meta, this.game);
							}
							this.game.render();
						}
					})
				);
			} //if
		}
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
			if (!groups[i].buildings.length){	//empty groups are visible by default
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

		this.update();
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
				var bldMetaRaw = this.game.bld.get(group.buildings[j]);
				var bld = new classes.BuildingMeta(bldMetaRaw).getMeta();

				var opts = {
					name: 			bld.label,
					description: 	bld.description,
					building: 		bld.name,
					handler: 		bld.handler
				};

				var btn = null;
				if (bld.upgradable){
					var btn = new classes.ui.btn.StagingBldBtn(opts, this.game);
				} else {
					var btn = new classes.ui.btn.BuildingBtnModern(opts, this.game);
				}

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

		var btn = new com.nuclearunicorn.game.ui.GatherCatnipButton({
			name:	 "Gather catnip",
			handler: function(btn){
						clearTimeout(btn.game.gatherTimeoutHandler);
						btn.game.gatherTimeoutHandler = setTimeout(function(){ btn.game.gatherClicks = 0; }, 2500);	//2.5 sec

						btn.game.gatherClicks++;
						if (btn.game.gatherClicks >= 2500 && !btn.game.ironWill){
							btn.game.gatherClicks = 0;
							btn.game.cheatMode = true;
						}

						btn.game.resPool.get("catnip").value++;
					 },
			description: "Gather some catnip in the forest"
		}, this.game);
		this.addButton(btn);
		//btn.render(container);

		var isEnriched = btn.game.workshop.get("advancedRefinement").researched;

		var btn = new com.nuclearunicorn.game.ui.RefineCatnipButton({
			name: 		"Refine catnip",
			handler: 	function(btn){
							var craftRatio = btn.game.getResCraftRatio({name: "wood"}) + 1;
							btn.game.resPool.get("wood").value += 1 * craftRatio;
						},
			description: "Refine catnip into catnip wood",
			prices: [ { name : "catnip", val: (isEnriched ? 50 : 100) }]
		}, this.game);
		this.addButton(btn);
		//btn.render(container);
	},

	update: function(){
		this.inherited(arguments);
	}
});
