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
        if (typeof(bld.stages) == "object"){
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
		if (typeof(bld.stages) == "object"){
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
        this.registerMeta(false, this.buildingsData, {
			getEffect: function(bld, effectName){
				var effect = 0;
				var bld = new classes.BuildingMeta(bld).getMeta();
				// Need a better way to do this...
				if (effectName == "coalRatioGlobal") {
					effect =  bld.effects[effectName];
				// Max effects and Ratio effects depends on constructed buildings
				} else if (effectName.indexOf("Max", effectName.length - 3) != -1 ||
					(bld.name == "biolab" && effectName.indexOf("Ratio", effectName.length - 5) != -1)){
					effect = bld.effects[effectName] * bld.val;
				} else {
					effect = bld.effects[effectName] * bld.on;
				}

				// Previously, catnip demand (or other buildings that both effected the same resource)
				// could have theoretically had more than 100% reduction because they diminished separately,
				// this takes the total effect and diminishes it as a whole.
				if(game.isHyperbolic(effectName) && effect < 0) {
				  effect = game.getHyperbolicEffect(effect, 1.0);
				}

				//probably not the best place to handle this mechanics
				//----------- move to separate part? -----------
				if ((effectName == "productionRatio" || effectName == "magnetoRatio")
					&& (game.resPool.energyCons > game.resPool.energyProd)){
					effect *= game.resPool.getEnergyDelta();
				}

				return effect;
			}
		});
        this.setEffectsCachedExisting();
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

	/***
	 ** STACKABLE BUILDINGS'S SPEC **
	 *
	 * For:
	 *
	 * game.bld.buildingsData
	 * game.religion.zigguratUpgrades
	 * game.religion.religionUpgrades
	 * game.religion.transcendenceUpgrades
	 * game.space.programs
	 * for each buildings of game.space.planets
	 * game.time.chronoforgeUpgrades
	 * game.time.voidspaceUpgrades
	 *
	 * Keys:
	 *
	 * OPTIONAL: things can be setted or not
	 * AUTOMATIC: things must be setted by using resetStateStackable()
	 * Every value can be setted by resetState whereas a hard-value.
	 *
	 * Spec:
	 *
	 * name MANDATORY: string identifier for coding
	 * label MANDATORY: string identifier displayed in the game
	 * description OPTIONAL: string displayed in tooltip to precise what is the building
	 * flavor OPTIONAL: string displayed in tooltip to joke
	 *
	 * stages OPTIONAL: object containing at least the setting of two stages. Each stage is a normal building with those differences :
	 * 	• stageUnlocked: which stage is set at the begining (one of stages has stageUnlocked == true, others stageUnlocked == false)
	 * 	• do not set name, calculateEffects neither action : it must be set only in "principal" building
	 * 	• set label, description, prices, priceRatio, flavor and effects (stage's effects must be set in "principal" building too, see effects spec here)
	 * stage MANDATORY if stages: number selecting building's stage
	 *
	 * unlocked MANDATORY: boolean defining if the building is available for the player or not
	 * unlockable MANDATORY: if true, building will be unlocked automatically once resources are available.
	 * unlockRatio OPTIONAL: boolean defining percentage of price you must have in stock to unlocked the buiding (see price spec here)
	 * requiredTech OPTIONAL: list of technologies in game.science which must be researched to unlocked the building
	 *
	 * price MANDATORY: list containing lines of prices :
	 *  • line of price is formatted like { name : "resourceName", val: resourceNeed }
	 * priceRatio MANDATORY: number multiplying price val in function of how many buildings you have already built (see val spec here)
	 *
	 * val AUTOMATIC: number defining how many buildings are built
	 * on AUTOMATIC: number defining how many buildings are used
	 *
	 * togglable AUTOMATIC: boolean defining if on can be modifiy between 0 AND val by the player
	 * togglableOnOff AUTOMATIC: boolean defining if on can be modifiy either 0 OR val by the player
	 *
	 * unlocks OPTIONAL: list, at each construction, calls game.unlock() with variables in unlocks to unlock parts of the game
	 * upgrades OPTIONAL: list, at each construction, calls game.upgrade() with variables in upgrades which will calls calculateEffects of some buildings (see calculateEffects spec here)
	 *
	 * effects MANDATORY: object containing static effects of the building AND all effects set in calculateEffects stages with a val of 0 AND all effects set in action with a basic value (to display when there is no building)
	 * calculateEffects OPTIONAL: function called by game.upgrade() to calculated some effects. Effects calculate here can't be calculated in action too. Don't forget to check every possibilities (mandatory "else" if there is an "if" for example).
	 * action OPTIONAL: function called each tick to calculated some effects. Effects calculate here can't be calculated in calculatedEffects too. Don't forget to check every possibilities (mandatory "else" if there is an "if" for example). Do not abuse, may have negative performance impact.
	 *
	 * jammed OPTIONAL: boolean checking the possibility to enable or disable a part of action's code. This variable can't be changed by the player.
	 * isAutomationEnabled OPTIONAL: boolean checking the possibility to enable or disable a part of action's code. This variable can be changed by the player.
	 * lackResConvert MANDATORY if conversion in action: boolean checking if conversions are full or not, it's for UI.
	 *
	 * breakIronWill OPTIONAL: if true, at the first construction, it will break Iron Will mod
	 * noStackable OPTIONAL: if true, button associated will have the behavior of a BuildingResearchBtn whereas of a BuildingStackableBtn (used when a researched behavior is changed during the game into a stackable behavior like religion's upgrades)
	 *
	 */

	buildingsData : [
	//----------------------------------- Food production ----------------------------------------
	{
		name: "field",
		label: "Catnip field",
		description: "Plant some catnip to grow in the village. Fields have +50% production in Spring and -75% production in Winter",
		unlockRatio: 0.3,
		unlockable: true,
		prices: [
			{ name : "catnip", val: 10 }
		],
		priceRatio: 1.12,
		effects: {
			"catnipPerTickBase": 0.125
		},
		flavor : "'Nip as far as the eye can see."
	},
	{
		name: "pasture",
		unlockRatio: 0.3,
		stages: [
			{
				label: "Pasture",
				description: "Provides an alternative source of food, which reduces catnip consumption.",
				prices: [
					{ name : "catnip", val: 100 },
					{ name : "wood", val: 10 }
				],
				priceRatio: 1.15,
				effects: {
					"catnipDemandRatio": -0.005
				},
				flavor: "Take a pint o' milk, Sir!",
				stageUnlocked : true
			},
			{
				label: "Solar Farm",
				description: "Provides an additional source of energy depending on the seasons.",
				prices: [
					{ name : "titanium", val: 250 }
				],
				priceRatio: 1.15,
				effects: {
					"energyProduction": 2
				},
				stageUnlocked : false
			}
		],
		effects: {
			"catnipDemandRatio": 0,
			"energyProduction": 0
		},
		action: function(self, game){
			var stageMeta = self.stages[self.stage];
			if (self.stage == 0){
				//do nothing
			} else if (self.stage == 1){
                var effects = {
                    "energyProduction": 2
                };
                effects.energyProduction *= 1 + game.getEffect("solarFarmRatio");
				if (game.calendar.season == 3) {
					effects.energyProduction *= 0.75;
				} else if (game.calendar.season == 1) {
					effects.energyProduction /= 0.75;
				}
                stageMeta.effects = effects;
			}
		}
	},{
		name: "aqueduct",
		unlockRatio: 0.3,
		stages: [
			{
				label: "Aqueduct",
				description: "+3% to catnip production",
				prices: [
					{ name : "minerals", val: 75 }
				],
				priceRatio: 1.12,
				effects: {
					"catnipRatio" : 0.03
				},
				flavor : "No Swimming",
				stageUnlocked : true
			},
			{
				label: "Hydro Plant",
				description: "A modern source of power production",
				prices: [
					{ name : "concrate", val: 100 },
					{ name : "titanium", val: 2500 }
				],
				priceRatio: 1.15,
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
                effects.energyProduction *= 1 + game.getEffect("hydroPlantRatio");
                stageMeta.effects = effects;
            }
        }
	},
	//----------------------------------- Population ----------------------------------------
	{
		name: "hut",
		label: "Hut",
		description: "Build a hut (each has a space for 2 kittens). Kittens need catnip to eat, or they will die.<br>Every kitten consumes about 4 catnip/s",
		unlockRatio: 0.3,
		prices: [
			{ name : "wood", val: 5 }
		],
		priceRatio: 2.5,
		unlockable: true,
		unlocks: {
			//unlock village tab
			tabs: ["village"]
		},
		effects: {
			"maxKittens": 2,
			"manpowerMax": 75
		},
		breakIronWill: true, //har har har
		flavor : "The Nation of Two"
	},
	{
		name: "logHouse",
		label: "Log House",
		description: "Build a house (each has a space for 1 kitten)",
		unlockRatio: 0.3,
		prices: [
			{ name : "wood", val: 200 },
			{ name : "minerals", val: 250 }
		],
		priceRatio: 1.15,
		effects: {
			"maxKittens": 1,
			"manpowerMax": 50
		},
		breakIronWill: true,
		flavor : "The Cabin in the Woods"
	},{
		name: "mansion",
		label: "Mansion",
		description: "A spacy mansion (each has a space for 1 kitten)",
		prices: [
			{ name : "slab", val: 185 },
			{ name : "steel", val: 75 },
			{ name : "titanium", val: 25 }
		],
		priceRatio: 1.15,
		effects: {
			"maxKittens": 1,
			"manpowerMax": 50
		},
		breakIronWill: true,
		flavor: "The best shipping container available"
	},
	//----------------------------------- Science ----------------------------------------
	{
		name: "library",
		label: "Library",
		description: "Build a library to store sacred catkind knowledge. Each upgrade level improves your science output by 10%",
		unlockRatio: 0.3,
		prices: [
			{ name : "wood", val: 25 }
		],
		priceRatio: 1.15,
		unlockable: true,
		unlocks: {
			tabs: ["science"],
			jobs: ["scholar"]
		},
		effects: {
			"scienceRatio": 0,
			"scienceMax": 0,
			"cultureMax": 0
		},
		calculateEffects: function(self, game){
			var effects = {
				"scienceRatio": 0.1,
				"scienceMax": 250,
				"cultureMax": 10
			};
			var libraryRatio = game.getEffect("libraryRatio");
			effects["scienceMax"] *= (1 + game.bld.get("observatory").on * libraryRatio);
			self.effects = effects;
		},
		flavor: "All in Catonese"
	},{
		name: "academy",
		label: "Academy",
		description: "Improves your research ratio and the speed of your kitten skills growth. Each upgrade level improves your science output by 20%",
		unlockRatio: 0.3,
		prices: [
			{ name : "wood", val: 50 },
			{ name : "minerals", val: 70 },
			{ name : "science", val: 100 }
		],
		priceRatio: 1.15,
		effects: {
			"scienceRatio": 0.2,
			"learnRatio": 0.05,
			"cultureMax": 25,
			"scienceMax": 500
		},
		flavor: "Curiosity is the basis of science. Our cats died nobly"
	},{
		name: "observatory",
		label: "Observatory",
		description: "Increases the chance of astronomical events by 0.2%",
		prices: [
			{ name : "scaffold", val: 50 },
			{ name : "slab", val: 35 },
			{ name : "iron", val: 750 },
			{ name : "science", val: 1000 }
		],
		priceRatio: 1.10,
		upgrades: {
			buildings: ["library"]
		},
		effects: {
			"scienceRatio": 0.25,
			"starEventChance": 0.002,
			"starAutoSuccessChance": 0.01,
			"scienceMax": 1000
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

			var ratio = 1 + game.getEffect("observatoryRatio");
			effects["scienceMax"] *= ratio;
			effects["scienceRatio"] *= ratio;

			self.effects = effects;
		},
		flavor: "Yearning to one day catch the red light fairy"
	},{
		name: "biolab",
		label: "Bio Lab",
		description: "Improves effectiveness of catnip refinement by 10%. More effective if powered.",
		prices: [
			{ name : "slab", val: 100 },
			{ name : "alloy", val: 25 },
			{ name : "science", val: 1500 }
		],
		priceRatio: 1.10,
		effects: {
			"scienceRatio": 0.35,
			"refineRatio": 0.1,
			"scienceMax": 1500,
			"energyConsumption": 0,
			"catnipPerTickCon": 0,
			"oilPerTickProd": 0
		},
		calculateEffects: function(self, game){
			var energyCons = 0;
			if (game.workshop.get("biofuel").researched){
				energyCons = 1;
				if (game.challenges.currentChallenge == "energy") {
					energyCons *= 2;
				}
				self.togglable = true;
			}
			self.effects["energyConsumption"] = energyCons;
		},
		lackResConvert: false,
		action: function(self, game){
			if (game.workshop.get("biofuel").researched){

				self.effects["catnipPerTickCon"] = -1;
				self.effects["oilPerTickProd"]= 0.02 * (1 + game.getEffect("biofuelRatio"));

				var amt = game.resPool.getAmtDependsOnStock(
					[{res: "catnip", amt: -self.effects["catnipPerTickCon"]}],
					self.on
				);
				self.effects["catnipPerTickCon"]*=amt;
				self.effects["oilPerTickProd"]*=amt;

				if (self.val) {
					self.effects["scienceRatio"] = 0.35 * (1 + self.on / self.val);
				}

				return amt;
			}
		},
		flavor: "New postdoc positions available."
	},
	//----------------------------------- Resource storage -------------------------------------------
	{
		name: "barn",
		label: "Barn",
		description: "Provides a space to store your resources.",
		unlockRatio: 0.3,
		prices: [
			{ name : "wood", val: 50 }
		],
		priceRatio: 1.75,
		effects: {
			"catnipMax": 0,
			"woodMax": 0,
			"mineralsMax": 0,
			"ironMax": 0,
			"coalMax": 0,
			"goldMax": 0,
			"titaniumMax": 0
			},
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
		flavor: "Rats ain't a problem for us!"
	},
	{
		name: "warehouse",
		label: "Warehouse",
		description: "Provides a space to store your resources",
		prices: [
			{ name : "beam", val: 1.5 },
			{ name : "slab", val: 2 }
		],
		priceRatio: 1.15,
		effects: {
			"catnipMax": 0,
			"woodMax": 0,
			"mineralsMax": 0,
			"ironMax": 0,
			"coalMax": 0,
			"goldMax": 0,
			"titaniumMax": 0
			},
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
		flavor: "All our stocks are scratched"
	},
	{
		name: "harbor",
		label: "Harbour",
		description: "Provides a space to store your resources",
		prices: [
			{ name : "scaffold", val: 5 },
			{ name : "slab", val: 50 },
			{ name : "plate", val: 75 }
		],
		priceRatio: 1.15,
		effects: {
			"catnipMax": 0,
			"woodMax": 0,
			"mineralsMax": 0,
			"ironMax": 0,
			"coalMax": 0,
			"goldMax": 0,
			"titaniumMax": 0
			},
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

			effects["coalMax"] *= (1 + game.getEffect("harborCoalRatio"));

			var cargoShips = game.workshop.get("cargoShips");
			if (cargoShips.researched){
				var shipVal = game.resPool.get("ship").value;

				//100% to 225% with slow falldown on the 75%
				var limit = 2.25 + game.getEffect("shipLimit") * game.bld.get("reactor").on;
				var ratio = 1 + game.getHyperbolicEffect(cargoShips.effects["harborRatio"] * shipVal, limit);

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
		flavor: "Ahoy, landlubbers!"
	},
	//----------------------------------- Resource production ----------------------------------------
	{
		name: "mine",
		label: "Mine",
		description: "Unlocks the miner job. Each upgrade level improves your mineral output by 20%",
		unlockRatio: 0.15,
		prices: [
			{ name : "wood", val: 100 }
		],
		priceRatio: 1.15,
		unlocks: {
			jobs: ["miner"]
		},
		effects: {
			"mineralsRatio": 0,
			"coalPerTickBase": 0
			},
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
		unlockRatio: 0.3,
		prices: [
			{ name : "scaffold", val: 50 },
			{ name : "steel", val: 150 },
			{ name : "slab", val: 1000 }
		],
		priceRatio: 1.15,
		effects: {
			"mineralsRatio": 0.35,
			"coalPerTickBase": 0.015
		},
		flavor : "It's full of mice! Wait, wrong 'quarry'"
	},
	{
		name: "smelter",
		label: "Smelter",
		description: "Smelts ore into metal",
		unlockRatio: 0.3,
		prices: [
			{ name : "minerals", val: 200 }
		],
		priceRatio: 1.15,
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


			var smelterRatio = (1 + game.getEffect("smelterRatio"));
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
		flavor: "Watch your whiskers!"
	},{
		name: "calciner",
		label: "Calciner",
		description: "A highly effective source of metal. Consumes 1.5 minerals and 0.02 oil per tick. Produces iron and a small amount of titanium",
		prices: [
			{ name : "steel", val: 120 },
			{ name : "titanium",  val: 15 },
			{ name : "blueprint",  val: 5 },
			{ name : "oil",  val: 500 }
		],
		priceRatio: 1.15,
		effects: {
			"mineralsPerTickCon" : -1.5,
			"oilPerTickCon" : -0.024,
			"ironPerTickAutoprod" : 0.15,
			"titaniumPerTickAutoprod" : 0.0005,
			"energyConsumption" : 0,
			"ironPerTickCon" : 0,
			"coalPerTickCon": 0,
			"steelPerTickProd": 0
		},
		calculateEffects: function(self, game) {
			self.effects["energyConsumption"] = 1;
			if (game.challenges.currentChallenge == "energy") {
				self.effects["energyConsumption"] *= 2;
			}
		},
		lackResConvert: false,
		action: function(self, game){
			// TODO: How to integrate autoProdRatio with calculateEffects?

			if (self.on < 1){
				return;
			}

			self.effects["oilPerTickCon"] = -0.024; //base + 0.01
			self.effects["mineralsPerTickCon"] = -1.5;
			var calcinerRatio = game.getEffect("calcinerRatio");
			self.effects["titaniumPerTickAutoprod"] = 0.0005 * ( 1 + calcinerRatio*3 );
			self.effects["ironPerTickAutoprod"] = 0.15 * ( 1 + calcinerRatio );

			var amt = game.resPool.getAmtDependsOnStock(
				[{res: "oil", amt: -self.effects["oilPerTickCon"]},
				 {res: "minerals", amt: -self.effects["mineralsPerTickCon"]}],
				self.on
			);
			self.effects["oilPerTickCon"]*=amt;
			self.effects["mineralsPerTickCon"]*=amt;
			self.effects["ironPerTickAutoprod"]*=amt;
			self.effects["titaniumPerTickAutoprod"]*=amt;

			var amtFinal = amt;

			self.effects["ironPerTickCon"] = 0;
			self.effects["coalPerTickCon"] = 0;
			self.effects["steelPerTickProd"] = 0;

			var steelRatio = game.getEffect("calcinerSteelRatio");

			if (steelRatio != 0){

				if (self.isAutomationEnabled == null) {
					self.isAutomationEnabled = true;
				}

				if (self.isAutomationEnabled) {

					// Second conversion of some of the iron that was just created, to steel
					var difference = self.effects["ironPerTickAutoprod"] * steelRatio * game.bld.getAutoProductionRatio(); //HACK
					// Cycle Effect
					var effectsTemp = {};
					effectsTemp["iron"] = difference;
					game.calendar.cycleEffectsFestival(effectsTemp);
					difference = effectsTemp["iron"];

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
					self.effects["steelPerTickProd"]*=(amt*(1 + game.getCraftRatio() * game.getEffect("calcinerSteelCraftRatio") + game.bld.get("reactor").on * game.getEffect("calcinerSteelReactorBonus")));

					amtFinal = (amtFinal + amt) / 2;
				}
			}

			return amtFinal;
		}
	},
	{
		name: "steamworks",
		label: "Steamworks",
		description: "When active, significantly reduces your coal production. Does nothing useful by default, but can do a lot of cool stuff once upgraded.",
		prices: [
			{ name : "steel", val: 65 },
			{ name : "gear",  val: 20 },
			{ name : "blueprint",  val: 1 }
		],
		priceRatio: 1.25,
		effects: {
			"magnetoBoostRatio": 0.15,
			"coalRatioGlobal" : 0,
			"energyProduction": 1,
			"manuscriptPerTickProd": 0
		},
		calculateEffects: function(self, game){
			self.effects["coalRatioGlobal"] = -0.8 + game.getEffect("coalRatioGlobalReduction");

			var amt = 0;
			if (game.workshop.get("printingPress").researched){
				amt = 0.0005;						// 2 per year per SW

				if (game.workshop.get("offsetPress").researched){
					amt *= 4;
				}
				if (game.workshop.get("photolithography").researched){
					amt *= 4;
				}
			}
			self.effects["manuscriptPerTickProd"] = amt;
		},
		jammed: false,
		togglableOnOff: true,
		action: function(self, game){
			if (self.on < 1){
				return;
			}

			if (game.workshop.get("factoryAutomation").researched && !self.jammed){
				if (self.isAutomationEnabled == null) {
					self.isAutomationEnabled = true;
				}

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
				} else {
					return;
				}

				var ratio = game.getCraftRatio();
				// Cap automation at 90% of resource cap to prevent trying to craft more than you have
				var automationRate = Math.min(baseAutomationRate + baseAutomationRate * self.on, 0.9);

				if (game.workshop.get("pneumaticPress").researched && iron.value >= iron.maxValue * (1 - baseAutomationRate)){
					var autoIron = iron.value * (automationRate);

					if (autoIron > game.workshop.getCraft("plate").prices[0].val){
						var amt = Math.floor(autoIron / game.workshop.getCraft("plate").prices[0].val);
						game.workshop.craft("plate", amt);
						game.msg("Spent " + game.getDisplayValueExt(autoIron) + " iron, +" + game.getDisplayValueExt(amt + amt * ratio) + " plates!", null, "workshopAutomation", true);
					}
				}

				if (minerals.value >= minerals.maxValue * (1 - baseAutomationRate)){
					var autoMinerals = minerals.value * (automationRate);
					if (autoMinerals > game.workshop.getCraft("slab").prices[0].val){
						var amt = Math.floor(autoMinerals / game.workshop.getCraft("slab").prices[0].val);
						game.workshop.craft("slab", amt);
						game.msg("Spent " + game.getDisplayValueExt(autoMinerals) + " minerals, +" + game.getDisplayValueExt(amt + amt * ratio) + " slabs!", null, "workshopAutomation", true);
					}
				}

				if (wood.value >= wood.maxValue * (1 - baseAutomationRate)){
					var autoWood = wood.value * (automationRate);
					if (autoWood >= game.workshop.getCraft("beam").prices[0].val){
						var amt = Math.floor(autoWood / game.workshop.getCraft("beam").prices[0].val);
						game.workshop.craft("beam", amt);
						game.msg("Spent " + game.getDisplayValueExt(autoWood) + " wood, +" + game.getDisplayValueExt(amt + amt * ratio) + " beams!", null, "workshopAutomation", true);
					}
				}

				game.msg("Activating workshop automation", null, "workshopAutomation");
				self.jammed = true;				//Jam until next year
			}
		},
		flavor: "I just nap here and it looks like I'm working"
	},{
		name: "magneto",
		label: "Magneto",
		description: "Improves your total resource production by 2%. Every steamworks will boost this effect by 15%. Consumes oil.",
		prices: [
			{ name : "alloy", val: 10 },
			{ name : "gear",  val: 5 },
			{ name : "blueprint",  val: 1 }
		],
		priceRatio: 1.25,
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
		}
	},

	{
		name: "lumberMill",
		label: "Lumber Mill",
		description: "Improves wood production by 10%",
		unlockRatio: 0.3,
		prices: [
			{name : "wood", val: 100},
			{name : "iron", val: 50},
			{name : "minerals", val: 250}
		],
		priceRatio: 1.15,
		effects: {
			"woodRatio" : 0
		},
		calculateEffects: function(self, game){
			self.effects["woodRatio"] = 0.1 + game.getEffect("lumberMillRatio") * 0.1;
		},
		flavor: "Best log analysing tool"
	},
	{
		name: "oilWell",
		label: "Oil Well",
		description: "Produces a bit of oil, +1500 to maximum oil limit",
		prices: [
			{name : "steel", val: 50},
			{name : "gear",  val: 25},
			{name : "scaffold", val: 25}
		],
		priceRatio: 1.15,
		effects: {
			"oilPerTickBase" : 0,
			"oilMax" : 0,
			"energyConsumption": 0
		},
		calculateEffects: function(self, game){
			var effects = {
				"oilPerTickBase" : 0.02,
				"oilMax" : 1500,
				"energyConsumption": 0
			};

			var ratio = 1 + game.getEffect("oilWellRatio");
			effects["oilPerTickBase"] *= ratio;

			if (game.workshop.get("pumpjack").researched){
				effects["energyConsumption"] = 1;
				if (game.challenges.currentChallenge == "energy") {
					effects["energyConsumption"] *= 2;
				}
				self.togglable = true;
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
		unlockable: true,
		unlockRatio: 0.0025,
		prices: [
			{ name : "wood", val: 100 },
			{ name : "minerals", val: 400 }
		],
		priceRatio: 1.15,
		unlocks: {
			tabs: ["workshop"]
		},
		effects: {
			"craftRatio" : 0.06	//6% for craft output
		},
		flavor: "Free toys for workers"
	},{
		name: "factory",
		label: "Factory",
		description: "Improves craft effectiveness",
		prices: [
			{ name : "titanium", val: 2000 },
			{ name : "plate", val: 2500},
			{ name : "concrate", val: 15}
		],
		priceRatio: 1.15,
		effects: {
			"craftRatio": 0,
			"energyConsumption": 0
		},
		calculateEffects: function(self, game){
			var effects = {
				"craftRatio": 0.05
			};

			if (game.workshop.get("factoryLogistics").researched){
				effects["craftRatio"] = 0.06;
			}

			effects["energyConsumption"] = 2;
			if (game.challenges.currentChallenge == "energy") {
				effects["energyConsumption"] *= 2;
			}
			self.effects = effects;
		}
	},{
		name: "reactor",
		label: "Reactor",
		description: "Provides a 5% boost to production while active. Requires uranium to operate.",
		prices: [
			{ name : "titanium",    val: 3500 },
			{ name : "plate", 		val: 5000},
			{ name : "concrate",    val: 50},
			{ name : "blueprint",   val: 25}
		],
		priceRatio: 1.15,
		upgrades: {
			buildings: ["harbor"]
		},
		effects: {
			"uraniumPerTick" : 0,
			"thoriumPerTick": 0,
			"productionRatio": 0.05,
			"uraniumMax" : 250,
			"energyProduction" : 0
		},
		calculateEffects: function(self, game){
			self.effects["uraniumPerTick"]= -0.001 * (1 - game.getEffect("uraniumRatio"));
		},
		action: function(self, game){
			if (game.resPool.get("uranium").value + self.effects["uraniumPerTick"] <= 0){
				self.on = 0;
			}

			self.effects["thoriumPerTick"] = game.getEffect("reactorThoriumPerTick");
			self.effects["energyProduction"] = 10 * ( 1+ game.getEffect("reactorEnergyRatio"));

			if (game.workshop.get("thoriumReactors").researched) {
				if (self.isAutomationEnabled == null) {
					self.isAutomationEnabled = true;
				}
				if (game.resPool.get("thorium").value == 0 || self.isAutomationEnabled == false) {
					self.effects["thoriumPerTick"] = 0;
					self.effects["energyProduction"] -= 2.5;
					self.isAutomationEnabled = false;
				}
			}
		},
		flavor: "Glowing mice are much easier to catch!"
	},{
		name: "accelerator",
		label: "Accelerator",
		description: "Converts titanium to the uranium (sic)",
		prices: [
			{ name : "titanium",    val: 7500 },
			{ name : "concrate",    val: 125  },
			{ name : "uranium",   	val: 25   }
		],
		priceRatio: 1.15,
		effects: {
			"titaniumPerTickCon" : -0.015,
			"uraniumPerTickAutoprod" : 0.0025,
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
		calculateEffects: function(self, game){
			self.effects["energyConsumption"] = 2;
			if (game.challenges.currentChallenge == "energy") {
				self.effects["energyConsumption"] *= 2;
			}

			self.effects["scienceMax"] = 0;
			if (game.workshop.get("lhc").researched){
				self.effects["scienceMax"] = 2500;
			}

			//------------- limit upgrades ------------
			var capRatio = 0;
			if (game.workshop.get("energyRifts").researched){
				capRatio = (1 + game.getEffect("acceleratorRatio"));
			}

			self.effects["catnipMax"]   = 30000 * capRatio;
			self.effects["woodMax"]     = 20000 * capRatio;
			self.effects["mineralsMax"] = 25000 * capRatio;
			self.effects["ironMax"]     =  7500 * capRatio;
			self.effects["coalMax"]     =  2500 * capRatio;
			self.effects["goldMax"]     =   250 * capRatio;
			self.effects["titaniumMax"] =   750 * capRatio;
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
		unlockRatio: 0.3,
		prices: [
			{ name : "wood", val: 500 },
			{ name : "minerals", val: 200 },
			{ name : "gold", val: 10 }
		],
		priceRatio: 1.15,
		effects: {
			"fursDemandRatio"   : -0.04,
			"ivoryDemandRatio"  : -0.04,
			"spiceDemandRatio"  : -0.04,
			"tradeRatio" : 0.015,
			"standingRatio": 0
		},
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
		prices: [
			{ name : "minerals", val: 5000 },
			{ name : "plate", val: 200 },
			{ name : "gold", val: 500 }
		],
		priceRatio: 1.15,
		effects: {
			"manpowerPerTickCon" : -0.75,
			"goldPerTickCon" : -0.005,
			"fursPerTickProd": 0.00875,
			"ivoryPerTickProd": 0.0021,
			"goldMax": 100
		},
		calculateEffects: function (self, game){
			self.effects["goldMax"] = 100 * (1 + game.getEffect("warehouseRatio"));
		},
		lackResConvert: false,
		action: function(self, game){
			// TODO: How to integrate max manpower with calculateEffects?

			if (self.on < 1){
				return;
			}
			self.effects["manpowerPerTickCon"] = -0.75;
			self.effects["goldPerTickCon"] = -0.005; //~5 smelters

			var manpower = game.resPool.get("manpower");
			var mpratio = (manpower.maxValue * 0.007) / 100;

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
				priceRatio: 1.15,
				effects: {
					"unhappinessRatio" : -0.048,
					"culturePerTickBase" : 0.005,
					"cultureMax" : 50
				},
				stageUnlocked : true,
				flavor: "Daily 'All Dogs Go to Heaven' showings"
			},
			{
				label : "Broadcast Tower",
				description: "Generates culture and happiness. More effective with high energy production.",
				prices: [
					{ name : "iron", val: 1250 },
					{ name : "titanium", val: 75 }
				],
				priceRatio: 1.18,
				effects: {
					"culturePerTickBase" : 1,
                    "unhappinessRatio" : -0.75,
					"cultureMax" : 300
				},
				stageUnlocked : false
			}
		],
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

            var broadcastTowerRatio = game.getEffect("broadcastTowerRatio");
            var totalRatio = game.space.getBuilding("sattelite").on * broadcastTowerRatio;

            btower.effects["cultureMax"] *= ( 1 + totalRatio);
            btower.effects["culturePerTickBase"] *= ( 1 + totalRatio);
        }
	},
	{
		name: "chapel",
		label: "Chapel",
		description: "Produces a bit of culture and faith per tick. May be improved with religious upgrades",
		prices: [
			{ name : "minerals", val: 2000 },
			{ name : "culture",  val: 250 },
			{ name : "parchment", val: 250 }
		],
		priceRatio: 1.15,
		effects: {
			"culturePerTickBase" : 0,
			"faithPerTickBase" : 0,
			"cultureMax" : 0
		},
		calculateEffects: function(self, game) {
			if (game.challenges.currentChallenge != "atheism") {
				var effects = {
					"culturePerTickBase" : 0.05,
					"faithPerTickBase" : 0.005,
					"cultureMax" : 200
				};
			} else {
				var effects = {
					"culturePerTickBase" : 0.05,
					"cultureMax" : 200
				};
			}
			self.effects = effects;
		}
	},
	{
		name: "temple",
		label: "Temple",
		description: "Temple of light. Produces culture. May be improved with Theology.",
		prices: [
			{ name : "slab", val: 25 },
			{ name : "plate", val: 15 },
			{ name : "gold", val: 50 },
			{ name : "manuscript", val: 10 }
		],
		priceRatio: 1.15,
		effects: {
			"culturePerTickBase" : 0,
			"faithPerTickBase" : 0,
			"happiness" : 0,
			"manpowerMax" : 0,
			"scienceMax" : 0,
			"cultureMax" : 0,
			"faithMax": 0
		},
		calculateEffects: function(self, game){
			if (game.challenges.currentChallenge != "atheism") {
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
				if (stainedGlass.on){
					effects["culturePerTickBase"] += 0.05 * stainedGlass.on;
				}

				var scholastics = game.religion.getRU("scholasticism");
				if (scholastics.on){
					effects["scienceMax"] = 400 + 100 * scholastics.on;
				}

				var sunAltar = game.religion.getRU("sunAltar");
				if (sunAltar.on){
					effects["faithMax"] += 50 * sunAltar.on;
					effects["happiness"] = 0.4 + 0.1 * sunAltar.on;
				}

				var goldenSpire = game.religion.getRU("goldenSpire");
				if (goldenSpire.on){
					effects["faithMax"] *= (1 + (0.4 + 0.1 * goldenSpire.on));
				}

				var basilica = game.religion.getRU("basilica");
				if (basilica.on){
					effects["cultureMax"] = 75 + 50 * basilica.on;
					effects["culturePerTickBase"] += 0.2 + 0.05 * (basilica.on-1);
				}

				var templars = game.religion.getRU("templars");
				if (templars.on){
					effects["manpowerMax"] = 50 + 25 * templars.on;
				}
			} else {
				var effects = {
					"culturePerTickBase" : 0.1
				};
			}

			self.effects = effects;
		},
		flavor: "All praise Ceiling Cat!"
	},
	{
		name: "unicornPasture",
		label: "Unic. Pasture",
		description: "Allows the taming of unicorns. Reduces catnip consumption by 0.15%",
		unlockRatio: 0.3,
		prices: [
			{ name : "unicorns", val: 2 }
		],
		priceRatio: 1.75,
		effects: {
			"catnipDemandRatio": -0.0015,
			"unicornsPerTickBase" : 0.001
		},
		flavor: "We glue horns on horses"
	},
	//----------------------------------- Wonders ----------------------------------------

	{
		name: "ziggurat",
		label: "Ziggurat",
		description: "The dark legacy of the lost race. Every Ziggurat will improve your culture limits by 8%.<br>May have special usage once Theology is researched.",
		unlockRatio: 0.01,
		prices: [
			{ name : "megalith", val: 75 },
			{ name : "scaffold", val: 50 },
			{ name : "blueprint", val: 1 }
		],
		priceRatio: 1.25,
		effects: {
			cultureMaxRatio: 0.08
		},
		calculateEffects: function(self, game) {
			var effects = {
				cultureMaxRatio: 0.08
			};
			effects["cultureMaxRatio"] = 0.08 + game.getEffect("cultureMaxRatioBonus");
			self.effects = effects;
		}
	},{
		name: "chronosphere",
		label: "Chronosphere",
		description: "Relocates small amount of resources through the time. Can be upgraded further. Every Chronosphere increases the chance of Temporal Paradox.",
		prices: [
			{ name : "unobtainium", val: 2500 },
			{ name : "timeCrystal", val: 1 },
			{ name : "blueprint", 	val: 100 },
			{ name : "science", 	val: 250000 }
		],
		priceRatio: 1.25,
		effects: {
			"resStasisRatio": 0.015, //1.5% of resources will be preserved
			"energyConsumption" : 0,
			"temporalFluxProduction" : 0
		},
		isAutomationEnabled: true,
		upgrades: {
			voidSpace: ["cryochambers"]
		},
		calculateEffects: function(self, game) {
			self.effects["energyConsumption"] = 20;
			if (game.challenges.currentChallenge == "energy") {
				self.effects["energyConsumption"] *= 2;
			}
			self.effects["temporalFluxProduction"] = game.getEffect("temporalFluxProductionChronosphere");
		}
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
		"antimatterMax" : 100
	},

	//deprecated, use getBuildingExt
	get: function(name){
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
			autoProdRatio *= (1 + this.game.getEffect("magnetoRatio") * swRatio);

		// paragon (25%)
			autoProdRatio *= (1 + this.game.prestige.getParagonProductionRatio() * 0.25);

		// reactors
		autoProdRatio *= (1 + this.game.getEffect("productionRatio"));

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

		var ratioDiff = this.game.getEffect(bldName + "PriceRatio") || 0;
		ratioDiff += this.game.getEffect("priceRatio") || 0;

		ratioDiff = this.game.getHyperbolicEffect(ratioDiff, ratioBase);

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

	update: function(){
		for (var i = 0; i < this.buildingsData.length; i++){
			var bld = this.buildingsData[i];

			if (!bld.unlocked){
				if (this.isUnlocked(bld)){
					bld.unlocked = true;
					this.game.render();
				}
			} else {
				//just in case we patched something (shit happens?)
				if (!this.isUnlockable(bld)){
					bld.unlocked = false;
				}
			}

			if (bld.action && (bld.on > 0 || bld.name == "biolab")){
				var amt = bld.action(bld, this.game);
				if (typeof(amt) != "undefined") {
					bld.lackResConvert = (amt == 1 || bld.on == 0) ? false : true;
				}
			}

		}

		/*
		 * Manpower hack for Iron Will mode. 1000 manpower is absolutely required for civilisation unlock.
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
		 } else {
			this.game.bld.effectsBase["manpowerMax"] = 100;
		 }
	},

	isUnlocked: function(building){
		if (!this.isUnlockable(building)){
			return false;
		}

		var isUnlocked = true;

		var building = new classes.BuildingMeta(building).getMeta();
		var unlockRatio = building.unlockRatio;

		if (building.prices.length && typeof(unlockRatio) == "number"){

			for( var i = 0; i < building.prices.length; i++){
				var price = building.prices[i];
				var res = this.game.resPool.get(price.name);

				if (res.value < price.val * unlockRatio){	// 30% required to unlock structure
					isUnlocked = false;
					break;
				}
			}
		}

		return isUnlocked;
	},

	isUnlockable: function(building){
		return this.get(building.name).unlockable;
	},

	save: function(saveData){
		saveData.buildings = this.filterMetadata(this.buildingsData, ["name", "unlocked", "val", "on", "stage", "jammed", "isAutomationEnabled"]);

		if (!saveData.bldData){
			saveData.bldData = {};
		}
		saveData.bldData.groupBuildings = this.groupBuildings;
		saveData.bldData.twoRows = this.twoRows;
	},

	load: function(saveData){
		this.groupBuildings = saveData.bldData ? saveData.bldData.groupBuildings: false;
		this.twoRows = saveData.bldData ? saveData.bldData.twoRows : false;
		this.loadMetadata(this.buildingsData, saveData.buildings);
	},

	resetState: function(){
		for (var i = 0; i < this.buildingsData.length; i++){
			var bld = this.buildingsData[i];

			bld.unlocked = false;

			if (typeof(bld.stages) == "object"){
				bld.stage = 0;
				for (var j = 1; j < bld.stages.length; j++){ //stages[0] should always be unlocked
					bld.stages[j].stageUnlocked = false;
				}
			}

			if (bld.jammed != undefined){
				bld.jammed = false;
			}

			if (bld.isAutomationEnabled != undefined){
				bld.isAutomationEnabled = true;
			}

			this.resetStateStackable(bld, bld.isAutomationEnabled, bld.lackResConvert, bld.effects);
		}
	},

    //============ dev =============
    devAddStorage: function(){
        this.get("warehouse").val += 10;
        this.get("warehouse").on += 10;
        this.get("barn").val += 10;
        this.get("barn").on += 10;
        this.get("harbor").val += 10;
        this.get("harbor").on += 10;
    },

	gatherCatnip: function(){
		this.game.resPool.get("catnip").value++;
	},

	refineCatnip: function(){
		var craftRatio = this.game.getResCraftRatio({name: "wood"}) + 1;
		this.game.resPool.addResEvent("wood", (1 * craftRatio));
	}
});

dojo.declare("classes.game.ui.GatherCatnipButton", com.nuclearunicorn.game.ui.ButtonModern, {
	onClick: function(){
		this.animate();
		this.handler(this);
	}
});

dojo.declare("classes.game.ui.RefineCatnipButton", com.nuclearunicorn.game.ui.ButtonModern, {
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

					this.game.resPool.addResEvent("catnip", -(catnipCost * 100));

					var craftRatio = this.game.getResCraftRatio({name: "wood"}) + 1;
					this.game.resPool.addResEvent("wood", (100 * craftRatio));

					this.update();
				});

		} else {
			dojo.setStyle(this.x100Href.link, "display", catnipVal < (catnipCost * 100) ? "none" : "");
		}

	}

});

dojo.declare("classes.ui.btn.BuildingBtnModern", com.nuclearunicorn.game.ui.BuildingStackableBtn, {
	simplePrices: false,

	getMetadata: function(){
		if (this.buildingName){
			var bld = this.game.bld.getBuildingExt(this.buildingName).getMeta();
			return bld;
		}
		return null;
	},

	getName: function() {
		var meta = this.getMetadata();
		var name = this.inherited(arguments);

		var sim = this.game.village.sim;
		if (meta.name == "hut" && sim.nextKittenProgress && sim.maxKittens <= 10 ){
			name += " [" + (sim.nextKittenProgress*100).toFixed()  +"%]";
		}
		return name;
	},

	/**
	 * Ugly hack
	 **/
	getMetadataRaw: function(){
		if (this.buildingName){
			var bld = this.game.bld.get(this.buildingName);
			return bld;
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

	hasSellLink: function(){
		return !this.game.opts.hideSell;
	},

    build: function(bld, maxBld){
		var counter = this.inherited(arguments);

		//update stats
		this.game.stats.getStat("buildingsConstructed").val += counter;
		this.game.telemetry.logEvent("building",
			{name: bld.name, val: counter}
		);

		// undo
		var undo = this.game.registerUndoChange();
        undo.addEvent("bld", bld.name, counter);
    },

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
					this.addLink("v",function(){
						if (confirm('Do you want to downgrade this building?\n\nYou will lose all of those currently built.')){
							bldExt.meta.stage = bldExt.meta.stage -1 || 0;
							bldExt.meta.val = 0;	//TODO: fix by using separate value flags
							bldExt.meta.on = 0;
							if (bldExt.meta.calculateEffects){
								bldExt.meta.calculateEffects(bldExt.meta, this.game);
							}
							this.game.upgrade(bldExt.meta.upgrades);
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
						if (confirm('Do you want to upgrade this building?\n\nYou will lose all of those currently built.')){
							bldExt.meta.stage = bldExt.meta.stage || 0;
							bldExt.meta.stage++;

							bldExt.meta.val = 0;	//TODO: fix by using separate value flags
							bldExt.meta.on = 0;
							if (bldExt.meta.calculateEffects){
								bldExt.meta.calculateEffects(bldExt.meta, this.game);
							}
							this.game.upgrade(bldExt.meta.upgrades);
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
		if (this.game.ironWill && this.game.bld.get("library").on > 0){
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
			if (i != 0){
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
					whiteSpace: "nowrap"
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

		this.twoRows = (this.activeGroup == "all" || this.activeGroup == "iw");
		this.initRenderer(groupContainer);

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

			var group = this.bldGroups[i].group;

			for (var j = 0; j< group.buildings.length; j++){
				var bldMetaRaw = this.game.bld.get(group.buildings[j]);
				var bld = new classes.BuildingMeta(bldMetaRaw).getMeta();

				var opts = {
					name: 			bld.label,
					description: 	bld.description,
					building: 		bld.name,
					twoRow:			this.twoRows
				};

				var btn = null;
				if (typeof(bld.stages) == "object"){
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

		var btn = new classes.game.ui.GatherCatnipButton({
			name:	 "Gather catnip",
			handler: function(btn){

				clearTimeout(btn.game.gatherTimeoutHandler);
				btn.game.gatherTimeoutHandler = setTimeout(function(){ btn.game.gatherClicks = 0; }, 2500);	//2.5 sec

				btn.game.gatherClicks++;
				if (btn.game.gatherClicks >= 2500 && !btn.game.ironWill){
					btn.game.gatherClicks = 0;
					btn.game.cheatMode = true;
				}

				btn.game.bld.gatherCatnip();
			},
			description: "Gather some catnip in the forest",
			twoRow: this.twoRows
		}, this.game);
		this.addButton(btn);
		//btn.render(container);

		var isEnriched = btn.game.workshop.get("advancedRefinement").researched;

		var btn = new classes.game.ui.RefineCatnipButton({
			name: 		"Refine catnip",
			handler: 	function(btn){
				btn.game.bld.refineCatnip();
			},
			description: "Refine catnip into catnip wood",
			prices: [ { name : "catnip", val: (isEnriched ? 50 : 100) }],
			twoRow: this.twoRows
		}, this.game);
		this.addButton(btn);
		//btn.render(container);
	},

	update: function(){
		this.inherited(arguments);
	}
});
