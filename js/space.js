/**
 * Behold the bringer of light!
 */
dojo.declare("classes.managers.SpaceManager", com.nuclearunicorn.core.TabManager, {

	/*
	 * Planets and celestial bodies from left to right:
	 *
	 * Charon, Umbra (black hole), Yarn (terraformable?), Helios (Sun), Cath, Redmoon (Cath satellite), Dune, Piscine, Terminus (ice giant), Kairo (dwarf planet)
	 *
	 */

	game: null,

	hideResearched: false,

	programs: [{
		name: "orbitalLaunch",
		title: "Orbital Launch",
		description: "Launch a rocket to a space.",
		researched: false,
		unlocked: true,
		defaultUnlocked: true,
		prices: [
			{name: "starchart", val: 250},
			{name: "manpower", val: 5000},
			{name: "science", val: 100000},
			{name: "oil", val: 15000}
		],
        unlocks: {
            planet: "cath",
            programs: ["moonMission"]
        }
	},{
		name: "moonMission",
		title: "Moon Mission",
		description: "Launch a rocket to Redmoon, a Cath planet satellite",
		unlocked: false,
		researched: false,
		prices: [
			{name: "starchart", val: 500},
			{name: "titanium", 	val: 5000},
			{name: "science", 	val: 125000},
			{name: "oil", 		val: 45000}
		],
		upgradable: false,
        unlocks: {
            planet: "moon",
            programs: ["duneMission", "piscineMission"]
        }
	},{
		name: "duneMission",
		title: "Dune Mission",
		description: "Dune is a large and lifeless planet covered by sand and volcanic rock.",
		unlocked: false,
		researched: false,
		prices: [
			{name: "starchart", val: 1000},
			{name: "titanium", val: 7000},
			{name: "science", val: 175000},
			{name: "kerosene", val: 75}
		],
		upgradable: false,
		handler: function(game, self){
			game.space.getProgram("heliosMission").unlocked = true;
		},
		unlocks: {
            planet: "dune"
        }
	},{
		name: "piscineMission",
		title: "Piscine Mission",
		description: "Piscine is a gigantic aquatic planet composed of an acid body and a methane atmosphere",
		unlocked: false,
		researched: false,
		prices: [
			{name: "starchart", val: 1500},
			{name: "titanium", val: 9000},
			{name: "science", val: 200000},
			{name: "kerosene", val: 250}
		],
		upgradable: false,
		handler: function(game, self){
			game.space.getProgram("terminusMission").unlocked = true;
		},
        unlocks: {
            planet: "piscine"
        }
	},{
		name: "heliosMission",
		title: "Helios Mission",
		description: "Helios is a G2V spectral type star in the center of the Cath solar system.",
		unlocked: false,
		researched: false,
		prices: [
			{name: "starchart", val: 3000},
			{name: "titanium", val: 15000},
			{name: "science", val: 250000},
			{name: "kerosene", val: 1250}
		],
		upgradable: false,
		handler: function(game, self){
			game.space.getProgram("yarnMission").unlocked = true;
		},
        unlocks: {
            planet: "helios"
        }
	},{
		name: "terminusMission",
		title: "T-minus Mission",
		description: "Terminus is a supermassive ice giant at the far end of a Helios solar system.",
		unlocked: false,
		researched: false,
		prices: [
			{name: "starchart", val: 2500},
			{name: "titanium", val: 12000},
			{name: "science", val: 225000},
			{name: "kerosene", val: 750}
		],
		upgradable: false,
		handler: function(game, self){
			game.space.getProgram("heliosMission").unlocked = true;
			game.space.getProgram("kairoMission").unlocked = true;
		},
        unlocks: {
            planet: "terminus"
        }
	},{
		name: "kairoMission",
		title: "Kairo Mission",
		description: "Kairo is a dwarf planet in the far end of the Cath solar system.",
		unlocked: false,
		researched: false,
		prices: [
			{name: "starchart", val: 5000},
			{name: "titanium", 	val: 20000},
			{name: "science", 	val: 300000},
			{name: "kerosene", 	val: 7500}
		],
		upgradable: false,
		handler: function(game, self){
			game.space.getProgram("rorschachMission").unlocked = true;
		},
		unlocks: {
			planet: "kairo"
		}
	},{
		name: "rorschachMission",
		title: "???",
		description: "???",
		unlocked: false,
		researched: false,
		prices: [
			{name: "starchart", val: 15000},
			{name: "titanium", 	val: 80000},
			{name: "science", 	val: 500000},
			{name: "kerosene", 	val: 25000}
		],
		upgradable: false,
		handler: function(game, self){
		},
		unlocks: {
		}
	},{
		name: "yarnMission",
		title: "Yarn Mission",
		description: "Yarn is a class M planet with high moderate climate, seas and oxygen atmosphere.",
		unlocked: false,
		researched: false,
		prices: [
			{name: "starchart", val: 7500},
			{name: "titanium", 	val: 35000},
			{name: "science", 	val: 350000},
			{name: "kerosene", 	val: 12000}
		],
		upgradable: false,
		handler: function(game, self){
			//game.space.getProgram("heliosMission").unlocked = true;
		},
		unlocks: {
			planet: "yarn"
		}
	}],

	//============================================================================

	planets:
	[{
		name: "cath",
		title: "Cath",
		unlocked: false,
		buildings: [{
			name: "spaceElevator",
			title: "Space Elevator",
			description: "Every Space Elevator reduces oil requirements for space missions by 5%. Improves all space structures production effectiveness by 1%",
			unlocked: true,
			upgradable:true,
			priceRatio: 1.15,
			prices: [
				{name: "titanium", val: 6000},
				{name: "science", val: 75000},
				{name: "unobtainium", val: 50},
			],
			requiredTech: ["orbitalEngineering", "nanotechnology"],
			val: 0,
			effects: {
				"oilReductionRatio": 0,
				"spaceRatio": 0,
				"prodTransferBonus" : 0
			},
			calculateEffects: function(game, self){
				self.effects = {
					"oilReductionRatio": 0.05,
					"spaceRatio": 0.01,
					"prodTransferBonus" : 0.001
				};
			},
			togglable: false,
			tunable: false
		},{
			name: "sattelite",
			title: "Satellite",
			description: "Deploy a satellite. Satellites improve your observatory effectiveness by 5% and produce starcharts",
			unlocked: true,
			prices: [
				{name: "starchart", val: 325},
				{name: "titanium", val: 2500},
				{name: "science", val: 100000},
				{name: "oil", val: 15000}
			],
			priceRatio: 1.08,
			requiredTech: ["sattelites"],
			val: 0,
			on: 0,
			upgradable: true,
			togglable: true,
			tunable: true,
			effects: {
				"observatoryRatio": 0,
				"starchartPerTickBaseSpace": 0,
				"energyConsumption": 0,
				"energyProduction": 0
			},
			calculateEffects: function(game, self){
				self.effects = {
					"observatoryRatio": 0.05,
					"starchartPerTickBaseSpace": 0.001,
					"energyConsumption": 0,
					"energyProduction": 0
				};

				if (game.workshop.get("solarSatellites").researched) {
					self.effects["energyProduction"] = 1;
					self.togglable = false;
					self.tunable = false;
				}
				else {
					self.effects["energyConsumption"] = 1;
				}
			}
		},{
			name: "spaceStation",
			title: "Space Station",
			description: "Deploy a space station. Each station generates science and provide a space for 2 astronauts",
			unlocked: true,
			prices: [
				{name: "starchart", val: 425},
				{name: "alloy", 	val: 750},
				{name: "science", val: 150000},
				{name: "oil", val: 35000}
			],
			priceRatio: 1.12,
			requiredTech: ["orbitalEngineering"],
			val: 0,
			on: 0,
			togglable: true,
			tunable: true,
			upgradable: true,
			handler: function(game, self){
				game.ironWill = false;			//sorry folks
			},
			effects: {
				"maxKittens": 0,
				"scienceRatio": 0,
				"energyConsumption": 0
			},
			calculateEffects: function(game, self){
				self.effects = {
					"maxKittens": 2,
					"scienceRatio": 0.5,
					"energyConsumption": 10
				};
			}
		}]
	},{
		name: "moon",
		title: "Moon",
		unlocked: false,
		buildings: [{
			name: "moonOutpost",
			title: "Lunar Outpost",
			description: "Deploy a nuclear powered mining outpost on Redmoon",
			unlocked: true,
			priceRatio: 1.12,
			prices: [
				{name: "starchart", val: 650},
				{name: "uranium",  val: 500},
				{name: "alloy",    val: 750},
				{name: "concrate", val: 150},
				{name: "science", val: 100000},
				{name: "oil", val: 55000}
			],
			upgradable: true,
			togglable: 	true,
			tunable: 	true,

			handler: function(game, self){
				//game.workshop.get("unobtainiumAxe").unlocked = true;
				//game.workshop.get("unobtainiumSaw").unlocked = true;
			},
			val:  0,
			on:	  0,
			effects: {
				"energyConsumption": 0,
				"uraniumPerTickCon": 0,
				"unobtainiumPerTickSpace": 0,
				"uraniumPerTickCon": 0,
				"unobtainiumPerTickSpace": 0
			},
			calculateEffects: function(game, self){
				self.effects = {
					"energyConsumption": 5
				};
			},
			action: function(game, self){
				self.effects["uraniumPerTickCon"] = -0.35;
				self.effects["unobtainiumPerTickSpace"] = 0.007 * (1+ game.workshop.getEffect("lunarOutpostRatio"));
				var amt = game.resPool.getAmtDependsOnStock(
					[{res: "uranium", amt: -self.effects["uraniumPerTickCon"]}],
					self.on
				);
				self.effects["uraniumPerTickCon"]*=amt;
				self.effects["unobtainiumPerTickSpace"]*=amt;
			}
		},{
			name: "moonBase",
			title: "Moon base",
			description: "Establish a base on a surface of Redmoon",
			unlocked: true,
			priceRatio: 1.12,
			prices: [
				{name: "starchart", 	val: 700},
				{name: "titanium", 		val: 9500},
				{name: "concrate", 		val: 250},
				{name: "science", 		val: 100000},
				{name: "unobtainium", 	val: 50},
				{name: "oil", 			val: 70000}
			],
			effects: {
				"catnipMax"         : 0,
				"woodMax"           : 0,
				"mineralsMax"       : 0,
				"ironMax"           : 0,
				"coalMax"           : 0,
				"titaniumMax"       : 0,
				"oilMax"            : 0,
				"unobtainiumMax"    : 0,
				"energyConsumption" : 0
			},
			calculateEffects: function(game, self){
				self.effects = {
					"catnipMax"         : 45000,
					"woodMax"           : 25000,
					"mineralsMax"       : 30000,
					"ironMax"           : 9000,
					"coalMax"           : 3500,
					"titaniumMax"       : 1250,
					"oilMax"            : 3500,
					"unobtainiumMax"    : 150,
					"energyConsumption" : game.workshop.get("amBases").researched ? 5 : 10
				};
			},
			upgradable: true,
			togglable: 	true,
			tunable: 	true,
			on: 0,
			val: 0
		}]
	},{
		name: "dune",
		title: "Dune",
		unlocked: false,
        buildings: [{
            name: "planetCracker",
            title: "Planet Cracker",
            description: "USS Mining Vessel Hissmeowra that can crack an entire planet",
            unlocked: true,
            priceRatio: 1.18,
            prices: [
                {name: "starchart", val: 2500},
                {name: "alloy",  val: 1750},
                {name: "science", val: 125000},
                {name: "kerosene", val: 50}
            ],
            upgradable: true,
            togglable: 	false,
            tunable: 	false,
            val:  0,
            on:	  0,
            effects: {
				"uraniumPerTickSpace" : 0,
				"uraniumMax" : 0
            },
			calculateEffects: function (game, self){
				self.effects = {
					"uraniumPerTickSpace" : 0.3
						* (1 + game.workshop.getEffect("crackerRatio")),
					"uraniumMax" : 1750
				};
			},
            action: function(game, self){
            }
        },{
            name: "hydrofracturer",
            title: "Hydraulic Fracturer",
            description: "Produces a high-pressure stream of oil. Every Space Elevator will boost this production by 0.1% of the global production multiplier.",
            unlocked: true,
            priceRatio: 1.18,
            prices: [
                {name: "starchart", val: 750},
                {name: "alloy",  val: 1025},
                {name: "science", val: 150000},
                {name: "kerosene", val: 100}
            ],
            upgradable: true,
            togglable: 	false,
            tunable: 	false,
            val:  0,
            on:	  0,
            effects: {
				"oilPerTickAutoprodSpace": 0
            },
			calculateEffects: function(game, self){
				self.effects = {
					"oilPerTickAutoprodSpace": 0.5
				};
			},
            action: function(game, self){
            }
        }]
	},{
		name: "piscine",
		title: "Piscine",
		unlocked: false,
		buildings: [{
            name: "researchVessel",
            title: "Research Vessel",
            description: "Mobile research space vessel.",
            unlocked: true,
            priceRatio: 1.15,
            prices: [
                {name: "starchart", val: 500},
                {name: "alloy",  val: 2500},
                {name: "titanium", val: 12500},
                {name: "kerosene", val: 250}
            ],
            upgradable: true,
            togglable: 	false,
            tunable: 	false,
            val:  0,
            on:	  0,
            effects: {
				"starchartPerTickBaseSpace": 0,
				"scienceMax": 0
			},
            calculateEffects: function(game, self){
				self.effects = {
					"starchartPerTickBaseSpace": 0.01,
					"scienceMax": 10000 * (1 + game.workshop.getEffect("spaceScienceRatio"))
				};
            }
        },{
            name: "orbitalArray",
            title: "Orbital Array",
            description: "Provide a 2% production bonus to all space structures",
            unlocked: true,
            priceRatio: 1.15,
            prices: [
                {name: "eludium",  val: 100},
                {name: "science", val: 250000},
                {name: "kerosene", val: 500}
            ],
            upgradable: true,
            togglable: 	true,
            tunable: 	true,
            val:  0,
            on:	  0,
            effects: {
				"spaceRatio": 0,
				"energyConsumption" : 0
				},
            calculateEffects: function(game, self){
				self.effects = {
					"spaceRatio": 0.02,
					"energyConsumption" : 20
				};
            }
        }]
	},{
		name: "helios",		//technically it is a planet from the game point of view
		title: "Helios",
		unlocked: false,
		buildings: [{
            name: "sunlifter",
            title: "Sunlifter",
            description: "Generates antimatter once per year.",
            unlocked: true,
            priceRatio: 1.15,
            prices: [
                {name: "science", val: 500000},
                {name: "eludium", val: 250},
                {name: "kerosene", val: 2500}
            ],
            upgradable: true,
            togglable: 	false,
            tunable: 	false,
            val:  0,
            on:	  0,
            effects: {
				"antimatterProduction": 0,
				"energyProduction" : 0
			},
            calculateEffects: function(game, self){
				self.effects = {
					"antimatterProduction": 1,
					"energyProduction" : 30
				};
            }
        }]
	},{
		name: "terminus",
		title: "T-Minus",
		unlocked: false,
        buildings:[{
            name: "cryostation",
            title: "Cryostation",
            description: "A vast storage facility complex",
            unlocked: true,
            priceRatio: 1.12,
            prices: [
                {name: "eludium", val: 25       },
                {name: "concrate", val: 1500    },
                {name: "science", val: 200000   },
                {name: "kerosene", val: 500   }
            ],
            effects: {
				"woodMax"       : 0,
				"mineralsMax"   : 0,
				"ironMax"       : 0,
				"coalMax"       : 0,
				"uraniumMax"    : 0,
				"titaniumMax"   : 0,
				"oilMax"        : 0,
				"unobtainiumMax": 0
			},
            calculateEffects: function(game, self){
				self.effects = {
					"woodMax"       : 200000,
					"mineralsMax"   : 200000,
					"ironMax"       : 50000,
					"coalMax"       : 25000,
					"uraniumMax"    : 5000,
					"titaniumMax"   : 7500,
					"oilMax"        : 25000,
					"unobtainiumMax": 750
				};
            },
            upgradable: true,
            val: 0
        }
        ]
	},{
		name: "kairo",
		title: "Kairo",
		unlocked: false,
		buildings:[
			{
				name: "spaceBeacon",
				title: "Space Beacon",
				description: "An AM-powered space station used for research and interstellar navigation.",
				unlocked: true,
				priceRatio: 1.15,
				prices: [
					{name: "starchart", 	val: 25000 },
					{name: "antimatter", 	val: 50 },
					{name: "alloy", 		val: 25000 },
					{name: "kerosene", 		val: 7500   }
				],
				effects: {
					"starchartPerTickBaseSpace": 0,
					"scienceMax": 0,
					"relicPerDay": 0
				},
				calculateEffects: function(game, self){
					self.effects = {
						"starchartPerTickBaseSpace": 0.025,
						"scienceMax": 25000 * (1 + game.workshop.getEffect("spaceScienceRatio")),
						"relicPerDay": game.workshop.getEffect("beaconRelicsPerDay")
					};
				},
				upgradable: true,
				val: 0
			}
		]
	},{
		name: "yarn",
		title: "Yarn",
		unlocked: false,
		buildings:[
			{
				name: "terraformingStation",
				title: "Terraforming Station",
				description: "Explode a charge of antimatter to melt yarn ice and throw an oxygen into the atmosphere",
				unlocked: false,
				priceRatio: 1.25,
				prices: [
					{name: "antimatter", val: 25  },
					{name: "uranium", val: 5000  },
					{name: "kerosene", val: 5000   }
				],
				effects: {
					"maxKittens": 0,
					"catnipConsumption": 0
				},
				calculateEffects: function(game, self){
					self.effects = {
						"maxKittens": 1,
						"catnipConsumption": 250
					};
				},
				upgradable: true,
				val: 0
			},
			{
				name: "hydroponics",
				title: "Hydroponics",
				description: "State of the art automated hydroponic system. Increase catnip limit by 10%. Increase catnip production by 2.5%",
				unlocked: false,
				priceRatio: 1.15,
				prices: [
					{name: "kerosene", val: 500 }
				],
				effects: {
					"catnipMaxRatio" : 0,
					"catnipRatio" : 0
				},
				calculateEffects: function(game, self){
					self.effects = {
						"catnipMaxRatio" : 0.1,
						"catnipRatio" : 0.025
					};
				},
				upgradable: true,
				val: 0
			}
		]
	}],

	metaCache: null,

	//============================================================================

	constructor: function(game){
		this.game = game;
		this.metaCache = {};
		this.registerMetaSpace();
	},

	registerMetaSpace: function(){
		this.registerMeta(this.programs, { getEffect: function(program, effectName){
			if (!program.effects){
				return 0;
			}
			var val = program.togglable ? program.on: program.val;
			return program.upgradable ?
				program.effects[effectName] * val:
				program.effects[effectName];
		}});

		for (planet of this.planets) {
			this.registerMeta(planet.buildings, { getEffect: function(building, effectName){
				if (!building.effects){
					return 0;
				}
				var val = building.togglable ? building.on: building.val;
				return building.effects[effectName] * val;
			}});
		}
	},

	resetState: function(){
		for (var i = 0; i < this.programs.length; i++){
			var program = this.programs[i];

			program.unlocked = program.defaultUnlocked || false;
			program.researched = false;

			if (program.upgradable){
				program.val = 0;
				if (program.on != undefined){
					program.on = 0;
				}
			}
		}

		for (i = 0; i < this.planets.length; i++){
			var planet = this.planets[i];
			planet.unlocked = false;

			if (planet.buildings){
				for (var j = 0; j < planet.buildings.length; j++){
					var program = planet.buildings[j];
					program.val = 0;
					if (program.on != undefined){
						program.on = 0;
					}
				}
			}
		}

		this.hideResearched = false;
	},

	save: function(saveData){

		var planets = this.filterMetadata(this.planets, ["name", "buildings"]);

		for (var i = 0; i < planets.length; i++){
			var planet = planets[i];
			if (planet.buildings){
				planet.buildings = this.filterMetadata(planet.buildings, ["name", "val", "on"]);
			}
		}

		saveData.space = {
			programs: this.filterMetadata(this.programs, ["name", "val", "on", "unlocked", "researched"]),
			planets: planets,
			hideResearched: this.hideResearched
		};
	},

	load: function(saveData){
		if (!saveData.space){
			return;
		}

		var self = this;

		this.hideResearched = saveData.space.hideResearched || false;

		if (saveData.space.programs){
			this.loadMetadata(this.programs, saveData.space.programs, ["val", "on", "unlocked", "researched"], function(loadedElem){
				//TODO: move to common method (like 'adjust prices'), share with religion code
				var prices = dojo.clone(loadedElem.prices);
				for (var k = prices.length - 1; k >= 0; k--) {
					var price = prices[k];
					for (var j = 0; j < loadedElem.val; j++){
						price.val = price.val * loadedElem.priceRatio;
					}
				}
			});
		}
		// programs and shit
		for (var i = this.programs.length - 1; i >= 0; i--) {
			var program = this.programs[i];
			if (program.researched){
				if (program.handler) {
					program.handler(this.game, program);
				}

				if (program.unlocks){
					//TODO: move to some common method?
					if (program.unlocks.planet){
						this.game.space.getPlanet(program.unlocks.planet).unlocked = true;
					}
					if (program.unlocks.programs){
						dojo.forEach(program.unlocks.programs, function(uprogram, i){
							self.game.space.getProgram(uprogram).unlocked = true;
						});
					}
				}
			}
		}
		//planets
		if (saveData.space.planets){
			for (var i in saveData.space.planets){
				var savePlanet = saveData.space.planets[i];
				var planet = this.getMeta(savePlanet.name, this.planets);

				if (planet && planet.buildings && savePlanet.buildings){
					this.loadMetadata(planet.buildings, savePlanet.buildings, ["val", "on"], function(loadedElem){
					});
				}
			}
		}

		this.invalidateCachedEffects();
	},

	update: function(){
		for (var i = this.programs.length - 1; i >= 0; i--) {
			var program = this.programs[i];

			if (program.calculateEffects){
				program.calculateEffects(this.game, program);
				this.game.calendar.cycleEffects(program.effects, program.name);
			}

			if (program.action && program.val > 0){
				program.action(this.game, program);
			}
		}
		for (var i in this.planets){
			var planet = this.planets[i];

			for (var j in planet.buildings){
				var bld = planet.buildings[j];

				if (bld.calculateEffects){
					bld.calculateEffects(this.game, bld);
					this.game.calendar.cycleEffects(bld.effects, bld.name);
				}

				if (bld.action && bld.val > 0){
					bld.action(this.game, bld);
				}
			}
		}
	},

	getProgram: function(name){
		if (this.metaCache[name]){
			return this.metaCache[name];
		}

		for (var i = this.programs.length - 1; i >= 0; i--){
			var program = this.programs[i];
			if (program.name == name){
				this.metaCache[name] = program;
				return program;
			}
		}

		for (i = this.planets.length - 1; i >= 0; i--){
			var planet = this.planets[i];
			if (planet.buildings){
				for (var j = planet.buildings.length - 1; j >= 0; j--){
					var bld = planet.buildings[j];
					if (bld.name == name){
						this.metaCache[name] = bld;
						return bld;
					}
				}
			}
		}
	},

	getPlanet: function(name){
		return this.getMeta(name, this.planets);
	},

	getEffect: function(name){
		var self = this;

		var totalEffect = this.getEffectCached(name);

		if ((name == "spaceRatio")
			&& (this.game.resPool.energyCons > this.game.resPool.energyProd)){
			totalEffect = totalEffect * this.game.resPool.getEnergyDelta();
		}
		return totalEffect;
	},

	/**
	 * This method is probably slow as hell, revisit it
	 */
	getAutoProductionRatio: function(useTransferBonus){
        var ratio = ( 1 + this.getEffect("spaceRatio"));
		if (useTransferBonus){
			ratio *= ( 1 + ((this.game.bld.getAutoProductionRatio(false, 0.05) - 1) * (this.getEffect("prodTransferBonus"))));
		}

		if (this.game.workshop.get("spaceManufacturing").researched){
			var factory = this.game.bld.get("factory");
			ratio *= (1 + factory.on * factory.effects["craftRatio"] * 0.75);
		}
		return ratio;
	}
});

dojo.declare("com.nuclearunicorn.game.ui.SpaceProgramBtn", com.nuclearunicorn.game.ui.BuildingBtn, {

	program: null,
	simplePrices: false,
	hasResourceHover: true,

	constructor: function(opts, game) {
		if(opts.onClickComplete){
			this.onClickComplete = opts.onClickComplete;
		}
	},

	getProgram: function(){
		if (!this.program){
			this.program = this.game.space.getProgram(this.id);
		}
		return this.program;
	},

	getMetadata: function(){
		return this.getProgram();
	},

	hasSellLink: function(){
		return false;
	},

    getPrices: function() {
        var program = this.getProgram();
        var ratio = program.priceRatio || 1.15;

        var prices = dojo.clone(program.prices);
        if (program.upgradable){
            for (var i = 0; i< prices.length; i++){
                if (prices[i].name !== "oil") {
                    prices[i].val = prices[i].val * Math.pow(ratio, program.val);
                 } else {
                    prices[i].val = prices[i].val * Math.pow(1.05, program.val);
                 }
            }
        }
        for (var i = 0; i < prices.length; i++){
            if (prices[i].name == "oil"){
                var reductionRatio = this.game.bld.getHyperbolicEffect(this.game.space.getEffect("oilReductionRatio"), 0.75);
                prices[i].val *= (1 - reductionRatio);
            }
        }

        return prices;
    },

	updateVisible: function(){
		var program = this.getProgram();
		if (program.requiredTech){
			for (var i = program.requiredTech.length - 1; i >= 0; i--) {
				var tech = this.game.science.get(program.requiredTech[i]);
				if (!tech.researched){
					this.setVisible(false);
					return;
				}
			}
		}
		if (program.researched && !program.upgradable && this.game.space.hideResearched){
			this.setVisible(false);
			return;
		}
		this.setVisible(this.getProgram().unlocked);
	},

	updateEnabled: function(){
		this.inherited(arguments);
		if (this.getProgram().researched && !this.getProgram().upgradable){
			this.setEnabled(false);
		}
	},

	onClick: function(event){
		var self = this;

		this.animate();
		var program = this.getProgram();
		if (this.enabled && this.hasResources()){

			if (program.upgradable && event.shiftKey){
                if (this.game.opts.noConfirm || confirm("Are you sure you want to construct all buildings?")){
                    this.buildAll(program);
                }
            } else {
                this.build(program);
            }

			this.handler(this);

			if (program.unlocks){
				if (program.unlocks.planet){
					this.game.space.getPlanet(program.unlocks.planet).unlocked = true;
				}
				if (program.unlocks.programs){
					dojo.forEach(program.unlocks.programs, function(uprogram, i){
						self.game.space.getProgram(uprogram).unlocked = true;
					});
				}
			}

			if (program.upgrades){
				this.game.upgrade(program.upgrades);
			}
			this.onClickComplete();
			this.update();
		}
	},

	onClickComplete: function(){

	},

    build: function(bld){
        this.payPrice();

        if (bld && bld.upgradable){
            bld.val++;

            //to not force player re-click '+' button all the time
            if (bld.on && bld.tunable){
                bld.on++;
            }

            //price check is sorta heavy operation, so we will store the value in the button
            this.prices = this.getPrices();
        }
    },

    buildAll: function(bld){
        //this is a bit ugly and hackish, but I'm to tired to write proper wrapper code;
        var counter = 0;
        while (this.hasResources()){
            this.build(bld);
            counter++;
        }
        this.game.msg(bld.title + " x"+counter+ " constructed.", "notice");
    },


	getName: function(){
		var program = this.getProgram();
		if (!program.upgradable && program.researched){
			return program.title + " (Complete)";
		}else if (program.upgradable){
			return this.inherited(arguments);
		}else {
			return program.title;
		}
	},

	getDescription: function(){
		var program = this.getProgram();
		return program.description;
	},

	getEffects: function(){
		var program = this.getProgram();
		return program.effects;
	},

	getSelectedObject: function(){
		return this.getMetadata();
	}
});

dojo.declare("classes.ui.space.PlanetBuildingBtn", com.nuclearunicorn.game.ui.SpaceProgramBtn, {
	planet: null,

	setOpts: function(opts){
		this.inherited(arguments);
		this.planet = opts.planet;
	},

	getProgram: function(){
		var space = this.game.space;
		if (!this.program){
			var planet = space.getMeta(this.planet.name, space.planets);
			this.program = space.getMeta(this.id, this.planet.buildings);

		}
		return this.program;
	},

	updateVisible: function(){
		var program = this.getProgram();
		if (program.requiredTech){
			for (var i = program.requiredTech.length - 1; i >= 0; i--) {
				var tech = this.game.science.get(program.requiredTech[i]);
				if (!tech.researched){
					this.setVisible(false);
					return;
				}
			}
		}
		this.setVisible(this.getProgram().unlocked);
	},

	onClick: function(event){
		var self = this;

		this.animate();
		var program = this.getProgram();
		if (this.enabled && this.hasResources()){

			if (program.upgradable && event.shiftKey){
                if (this.game.opts.noConfirm || confirm("Are you sure you want to construct all buildings?")){
                    this.buildAll(program);
                }
            } else {
                this.build(program);
            }
			if (program.handler){
				program.handler(this.game, program);
			}
			if (program.upgrades){
				this.game.upgrade(program.upgrades);
			}
		}
	}
});

dojo.declare("classes.ui.space.PlanetPanel", com.nuclearunicorn.game.ui.Panel, {
	planet: null,

	render: function(){
		var content = this.inherited(arguments);

		var self = this;

		dojo.forEach(this.planet.buildings, function(building, i){
			var button = new classes.ui.space.PlanetBuildingBtn({
				id: 		building.name,
				name: 		building.title,
				description: building.description,
				prices: building.prices,
				planet: self.planet
			}, self.game);

			button.render(content);
			self.addChild(button);
		});
	}
});

dojo.declare("com.nuclearunicorn.game.ui.tab.SpaceTab", com.nuclearunicorn.game.ui.tab, {

	GCPanel: null,

	constructor: function(){

	},

	render: function(container) {
		var self = this;

		//--------------------------------------------------------------------
		var div = dojo.create("div", { style: { float: "right"}}, container);
		var groupCheckbox = dojo.create("input", {
			id : "toggleResearched",
			type: "checkbox",
			checked: this.game.space.hideResearched
		}, div);

		dojo.connect(groupCheckbox, "onclick", this, function(){
			this.game.space.hideResearched = !this.game.space.hideResearched;

			dojo.empty(container);
			this.render(container);
		});

		dojo.create("label", { innerHTML: "Hide complete missions", for: "toggleResearched"}, div);
		//---------------------------------------------------------------------

		//padding div to preserve markup
		dojo.create("div", { style: { height: "20px"}}, container);

		this.GCPanel = new com.nuclearunicorn.game.ui.Panel("Ground Control", this.game.space);
		var content = this.GCPanel.render(container);

		dojo.forEach(this.game.space.programs, function(program, i){
			var button = new com.nuclearunicorn.game.ui.SpaceProgramBtn({
				id: 		program.name,
				name: 		program.title,
				description: program.description,
				prices: program.prices,
				handler: function(btn){
					var program = btn.getProgram();
					program.researched = true;

					if (program.handler){
						program.handler(btn.game, program);
					}
				},
				onClickComplete: function(){
					dojo.empty(container);
					self.render(container);
				}
			}, self.game);
			button.render(content);
			self.GCPanel.addChild(button);
		});

        //------------ space space I'm in space -------------
        this.planetPanels = [];
        dojo.forEach(this.game.space.planets, function(planet, i){
            if (planet.unlocked){
                var planetPanel = new classes.ui.space.PlanetPanel(planet.title, self.game.space);
                planetPanel.planet = planet;
                planetPanel.setGame(self.game);
                var content = planetPanel.render(container);

                self.planetPanels.push(planetPanel);
            }
        });

		this.update();
	},

	update: function(){
		this.GCPanel.update();

        dojo.forEach(this.planetPanels, function(panel, i){
            panel.update();
        });
	}
});
