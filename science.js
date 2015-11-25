/**
 * Weird cat science
 */
dojo.declare("classes.managers.ScienceManager", com.nuclearunicorn.core.TabManager, {

	game: null,

	hideResearched: false,	//hide researched techs

	//list of technologies
	techs:[{
		name: "calendar",
		title: "Calendar",

		description: "Develops the ability to predict when the seasons will change. This ability is essential for advanced agriculture.",
		effectDesc: "Calendar provides a way of more precise time tracking",

		unlocked: true,
		researched: false,
		cost: 30,	//cos in WCS (weird cat science)
		unlocks: {
			tech: ["agriculture"]
		},
        flavor: "What day is it again?"

	},{
		name: "agriculture",
		title: "Agriculture",

		description: "The basis of all civilised life, Agriculture allows the working of land for food. Agriculture can significantly improve your food production.",
		effectDesc: "Unlocks Farmers and Barns",

		unlocked: false,
		researched: false,
		cost: 100,
		unlocks: {
			tech: ["mining", "archery"],
			jobs: ["farmer"]
		},
        flavor: "Best thing since sliced bread!"
	},{
		name: "archery",
		title: "Archery",

		description: "Ranged weaponry known as a 'Bow'.",
		effectDesc: "Unlocks Hunters",

		unlocked: false,
		researched: false,
		cost: 300,
		unlocks: {
			tech: ["animal"],
			jobs: ["hunter"]
		}
	},{
		name: "mining",
		title: "Mining",

		description: "Mining develops the ability to extract mineral resources from the bowels of Cath.",
		effectDesc: "You can build Mines",

		unlocked: false,
		researched: false,
		cost: 500,
		unlocks: {
			tech: ["metal"],
			upgrades: ["bolas"]
		},
		flavor: "Pickaxes are easier to hold with opposable thumbs"
	},{
		name: "metal",
		title: "Metal Working",

		description: "The first metal-working technology that provides your civilisation with sturdy, durable tools.",
		effectDesc: "You can construct Smelters that convert ore into metal",

		unlocked: false,
		researched: false,
		cost: 900,
		unlocks: {
			upgrades: ["huntingArmor"]
		}
	},
	{
		name: "animal",
		title: "Animal Husbandry",
		description: "Domestication allows access to various animal resources via the pasture. Improves your food production.",
		effectDesc: "Unlocks Pastures",

		unlocked: false,
		researched: false,
		cost: 500,	//mostly does nothing, so price is lower
		unlocks: {
			tech: ["civil", "math", "construction"]
			//crafts: ["leather"]
		}
	},{
		/*==============	NOT USED ANYMORE   ============*/	
		name: "brewery",
		title: "Catnip Processing",

		description: "Catnip Processing is a non-mandatory technology which improves the process of converting catnip to catnip wood.",
		effectDesc: "Unlocks Catnip Enrichment.",

		unlocked: false,
		researched: false,
		cost: 1200
	},
	//--------------------------------------------------
	{
		name: "civil",
		title: "Civil Service",
		description: "The creation of the first true state organ provides many benefits related to better management of your population.",
		effectDesc: "Unlocks detailed information about your population",

		unlocked: false,
		researched: false,
		cost: 1500,
		unlocks: {
			tech: ["currency"]	//currency
		},
		flavor: "Specialists in Herding Cats"
	},{
		name: "math",
		title: "Mathematics",
		description: "Mathematics is the most basic building block upon which all physical science is based. Improves scientific development.",
		effectDesc: "Allows construction of Academies, very efficient research buildings",

		unlocked: false,
		researched: false,
		cost: 1000,
		unlocks: {
			upgrades: ["celestialMechanics"],
			tabs: ["stats"]
		},
		flavor: "Purr equals Meow times Paw to the square"
	},{
		name: "construction",
		title: "Construction",
		description: "Construction represents the advancement of the study of masonry, primarily by adding iron and other metals to the builder's toolbox. Benefits hunting and base infrastructure.",
		effectDesc: "Allows your workers to construct the Lumber mill. Unlocks Composite Bows",

		unlocked: false,
		researched: false,
		cost: 1300,
		unlocks: {
			tech: ["engineering"],
			upgrades: ["compositeBow", "advancedRefinement"]
		},
		flavor: "Making pillow forts smart!"
	},{
		name: "engineering",
		title: "Engineering",
		description: "Engineering is the science (or art perhaps) of designing complex materials, structures, devices, and systems.",
		effectDesc: "Unlocks aqueducts",

		unlocked: false,
		researched: false,
		cost: 1500,
		unlocks: {
			tech: ["writing"]
		}
	},{
		name: "currency",
		title: "Currency",
		description: "Currency represents a certain amount of wealth. Can significantly boost your development in indirect ways.",
		effectDesc: "Unlocks gold and trade",

		unlocked: false,
		researched: false,
		cost: 2200,
		unlocks: {
			upgrades: ["goldOre"]
		}
	},{
		name: "writing",
		title: "Writing",
		description: "Writing is the art of recording information on material. Writing can influence general happiness and cultural progress of your civilization.",
		effectDesc: "Unlocks Amphitheatres",

		unlocked: false,
		researched: false,
		cost: 3600,
		unlocks: {
			tech: ["philosophy", "machinery", "steel"],
			crafts: ["parchment"]
		},
		flavor: "Writing uses less ink than pawprints"
	},{
		name: "philosophy",
		title: "Philosophy",
		description: "Philosophy is the first abstract science developed by catkind. Philosophy is a basis of spiritual and cultural progress.",
		effectDesc: "Unlocks Temples",

		unlocked: false,
		researched: false,
		cost: 9500,
		unlocks: {
			tech: ["theology"],
			crafts: ["compedium"]
		},
		flavor: "I purr, therefore I am"
	},{
		name: "machinery",
		title: "Machinery",
		description: "Previous advances in metal working and science give birth to the concept of a machine, a device with multiple moving parts.\n" +
			"Machinery introduces a concept of automation which reduces routine operations",
		effectDesc: "Unlocks Steamworks, Crossbows, Printing press and Factory automation.",

		unlocked: false,
		researched: false,
		cost: 15000,
		unlocks: {
			upgrades: ["printingPress", "factoryAutomation", "crossbow"]
		}
	},{
		name: "steel",
		title: "Steel",
		description: "Development of the new Steel alloy advances further metal working. Benefits most of the aspects of development.",
		effectDesc: "Unlocks Coal and Steel production",

		unlocked: false,
		researched: false,
		cost: 12000,
		unlocks: {
			upgrades: ["deepMining", "coalFurnace", "combustionEngine",
						"reinforcedWarehouses", "steelAxe", "steelArmor"],
			crafts: ["steel"]
		}
	},{
		name: "theology",
		title: "Theology",
		description: "Theology is the study of religion. Religion is a key concept affecting cultural, scientific and industrial development.",
		effectDesc: "Unlocks religion",

		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 20000},
			{name: 	"manuscript", val: 35}
		],
		unlocks: {
			tech: ["astronomy"],
			jobs: ["priest"]
		},
		upgrades: {
			buildings: ["temple"]
		},
        flavor: "What is that flaming ball in the sky anyway?"
	},{
		name: "astronomy",
		title: "Astronomy",
		description: "Astronomy is the study of objects in space. Improves scientific development.",
		effectDesc: "Unlocks Observatory and Star charts",

		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 28000},
			{name: 	"manuscript", val: 65}
		],
		unlocks: {
			tech: ["navigation"]
		}
	},{
		name: "navigation",
		title: "Navigation",
		description: "Navigation allows serious advancements in sailing and shipbuilding technology. It should benefit economical development and can lead to discovery of new civilizations.",
		effectDesc: "Unlocks the construction of Trade Ships and overseas trade.",

		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 35000},
			{name: 	"manuscript", val: 100}
		],
		unlocks: {
			tech: ["physics", "archeology", "architecture"],
			crafts: ["ship"],
			upgrades: ["caravanserai", "cargoShips", "astrolabe",
						"titaniumMirrors", "titaniumAxe"]
		}
	},{
		name: "architecture",
		title: "Architecture",
		description: "Architecture allows construction of some new sophisticated structures.",
		effectDesc: "Unlocks Mints and Mansions.",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 42000},
			{name: 	"compedium", val: 10}
		],
		unlocks: {
			tech: ["acoustics"]
		},
		flavor: "Bigger, better cat towers!"
	},{
		name: "physics",
		title: "Physics",
		description: "Physics is a study of laws of nature. Mostly improves your machinery effectiveness.",
		effectDesc: "Unlocks some useful upgrades.",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 50000},
			{name: 	"compedium", val: 35}
		],
		unlocks: {
			tech: ["chemistry", "electricity", "metaphysics"],
			crafts: ["blueprint"],
			upgrades: ["pneumaticPress", "pyrolysis", "steelSaw"]
		}
	},{
		name: "metaphysics",
		title: "Metaphysics",
		description: "Metaphysics is a traditional branch of philosophy concerned with explaining the fundamental nature of being and the world that encompasses it.\nAbsolutely useless.",
		effectDesc: "Does nothing.",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 55000},
			{name: 	"unobtainium", val: 5}
		],
	},{
		name: "chemistry",
		title: "Chemistry",
		description: "The discovery of Chemistry allows the deeper study and understanding of natural elements and their interaction. As a result new resources may be unlocked.",
		effectDesc: "Unlocks Oil and Oil Wells.",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 60000},
			{name: 	"compedium", val: 50}
		],
		unlocks: {
			upgrades: ["alloyAxe", "alloyArmor", "alloyWarehouses", "alloyBarns"],
			crafts: ["alloy"]
		}
	},{
		name: "acoustics",
		title: "Acoustics",
		description: "Acoustics is the study of sound. Though not obviously useful, in a long run it may benefit civilizations thriving for cultural and religious development.",
		effectDesc: "Unlocks Chapels",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 60000},
			{name: 	"compedium", val: 60}
		],
		unlocks: {
			tech: ["drama"]
		}
	},{
		name: "drama",
		title: "Drama and Poetry",
		description: "Drama and poetry are both forms of artistic expression.\nImproves cultural progress.",
		effectDesc: "Unlocks Festivals and Cultural artifacts (TBD)",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 90000},
			{name: 	"parchment", val: 5000}
		],
	},{
		name: "archeology",
		title: "Geology",
		description: "Geology is the science comprising of the study of Cath, the rocks of which it is composed, and the processes by which they change. Can potentially benefit your mining industry.",
		effectDesc: "Unlocks Quarries and Geologists",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 65000},
			{name: 	"compedium", val: 65}
		],
		unlocks: {
			tech: ["biology"],
			jobs: ["geologist"],
			upgrades:["geodesy"]
		},
		flavor: "Different fossils of giant lizards were discovered. Apparently they all died in a sudden but inevitable betrayal."
	},{
		name: "electricity",
		title: "Electricity",
		description: "Electricity unlocks a new way to automate production, benefiting the catkind in all different areas.",
		effectDesc: "Unlocks Magnetos",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 75000},
			{name: 	"compedium", val: 85}
		],
		unlocks: {
			tech: ["industrialization"]
		},
		flavor: "Who knew running around on the carpet could generate such power?"
	},{
		name: "biology",
		title: "Biology",
		description: "Biology deals with living organisms, their characteristics and their use in our society. Improves science and chemistry industry.",
		effectDesc: "Unlocks Bio Labs",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 85000},
			{name: 	"compedium", val: 100}
		],
		unlocks: {
			tech: ["biochemistry"]
		}
	},{
		name: "biochemistry",
		title: "Biochemistry",
		description: "Improves your chemistry and biology-related technologies.",
		effectDesc: "Unlocks biofuel processing",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 145000},
			{name: 	"compedium", val: 500}
		],
		unlocks: {
			tech: ["genetics"],
			upgrades: ["biofuel"]
		}
	},{
		name: "genetics",
		title: "Genetics",
		description: "Technology that further improves upon biology and chemistry. Affects your food industry.",
		effectDesc: "Unlocks genetic engineering(?)",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 190000},
			{name: 	"compedium", val: 1500}
		],
		unlocks: {
			upgrades: ["unicornSelection", "gmo"]
		}
	},{
		name: "industrialization",
		title: "Industrialization",
		description: "Industrialization represents the concept of mass-producing materials, from food products to machine parts.",
		effectDesc: "Unlocks Advanced Automation and Barges",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 100000},
			{name: 	"blueprint", val: 25}
		],
		unlocks: {
			tech: ["mechanization", "metalurgy", "combustion"],
			upgrades: ["barges", "advancedAutomation"]
		}
	},{
		name: "mechanization",
		title: "Mechanization",
		description: "Mechanization provides a lot of ways to automate redundant tasks; hence improving craft, oil pumps and construction technologies.",
		effectDesc: "Unlocks Factories, Pumpjacks and Concrete",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 115000},
			{name: 	"blueprint", val: 45}
		],
		unlocks: {
			tech: ["electronics"],
			crafts: ["concrate"],
			upgrades: ["pumpjack",
						//TODO: move to the separate tech?
						"concreteWarehouses", "concreteBarns", "concreteHuts"]
		}
	},{
		name: "metalurgy",
		title: "Metallurgy",
		description: "Metallurgy improves the process of metal production, benefiting Smelters and Calciners",
		effectDesc: "Unlocks Electrolytic Smelting and Oxidation",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 125000},
			{name: 	"blueprint", val: 60}
		],
		unlocks: {
			upgrades: ["electrolyticSmelting", "oxidation", "miningDrill"]
		}
	},{
		name: "combustion",
		title: "Combustion",
		description: "Combustion provides a number of ways to improve old coal-based automation technologies, such as Steamworks.",
		effectDesc: "Unlocks Offset Printing, Oil Refinery and Fuel Injection",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 115000},
			{name: 	"blueprint", val: 45}
		],
		unlocks: {
			upgrades: ["offsetPress", "fuelInjectors", "oilRefinery"],
			tech: ["ecology"]
		}
	},
	{
		name: "ecology",
		title: "Ecology",
		description: "Ecology is a technology primary focused on the search for new cheap and safe energy sources.",
		effectDesc: "Unlocks Solar Plants",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 125000},
			{name: 	"blueprint", val: 55}
		],
		unlocks: {
			stages: [{bld:"pasture",stage:1}]
		}
	},
	{
		name: "electronics",
		title: "Electronics",
		description: "Electronics unlocks some high level upgrades mainly related to science",
		effectDesc: "Unlocks Broadcast Towers, CAD Systems, Refrigeration and SETI",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 135000},
			{name: 	"blueprint", val: 70}
		],
		unlocks: {
			tech: ["nuclearFission", "rocketry", "robotics"],
			upgrades: ["cadSystems", "refrigeration", "seti", "factoryLogistics"],
            stages: [{bld:"amphitheatre",stage:1}]
		}
	},{
		name: "robotics",
		title: "Robotics",
		description: "Robotics improves automated structures like Calciners",
		effectDesc: "Unlocks Steel Plants, Hydro Plants, Tankers and Rotary Kilns",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 140000},
			{name: 	"blueprint", val: 80}
		],
		unlocks: {
			upgrades: ["steelPlants", "rotaryKiln"],
			crafts: ["tanker"],
			stages: [{bld:"aqueduct",stage:1}]
		}
	},{
		name: "nuclearFission",
		title: "Nuclear Fission",
		description: "Nuclear Fission unlocks Nuclear Reactors and nuclear-related upgrades",
		effectDesc: "Unlocks Nuclear Reactors and Nuclear Vessel",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 150000},
			{name: 	"blueprint", val: 100}
		],
		unlocks: {
			tech: ["nanotechnology", "particlePhysics"],
			upgrades: ["reactorVessel", "nuclearSmelters"]
		}
	},{
		name: "rocketry",
		title: "Rocketry",
		description: "Required for space exploration",
		effectDesc: "Unlocks construction of spaceships and oil processing",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 175000},
			{name: 	"blueprint", val: 125}
		],
		unlocks: {
			tech: ["sattelites", "oilProcessing"],
			tabs: ["space"],
            upgrades: ["oilDistillation"]
		}
	}, {
        name: "oilProcessing",
        title: "Oil Processing",
        description: "Unlocks advanced options of oil processing",
        effectDesc: "Unlocks kerosene and factory processing(TBD)",
        unlocked: false,
        researched: false,
        prices: [],
        prices: [
            {name : "science", val: 215000},
            {name: 	"blueprint", val: 150}
        ],
        unlocks: {
            crafts: ["kerosene"],
            upgrades: [ "factoryProcessing" ]
        }
    },{
        name: "sattelites",
        title: "Satellites",
        description: "Satellites are machines that permanently orbit the planet outside its atmosphere",
        effectDesc: "Unlocks deployment of satellites",
        unlocked: false,
        researched: false,
        prices: [
            {name : "science", val: 190000},
            {name: 	"blueprint", val: 125}
        ],
        unlocks: {
            tech: ["orbitalEngineering" ],
            upgrades: [ "photolithography" ]
        },
        flavor: "Spreading cat videos at the speed of light"
    },{
		name: "orbitalEngineering",
		title: "Orbital Engineering",
		description: "Orbital Engineering allows kitten civilization to develop advanced space projects.",
		effectDesc: "Unlocks Space Stations and the Hubble Telescope",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 250000},
			{name: 	"blueprint", val: 250}
		],
		unlocks: {
			tech: ["exogeology"],
			upgrades: ["hubbleTelescope", "satelliteRadio", "astrophysicists", "solarSatellites"]
		}
	},{
		name: "exogeology",
		title: "Exogeology",
		description: "Exogeology or Planetary Geology studies extraterestial metals and minerals.",
		effectDesc: "Unlocks various Unobtainium upgrades",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 275000},
			{name: 	"blueprint", val: 250}
		],
		unlocks: {
			tech: ["advExogeology"],
			upgrades: ["unobtainiumReflectors", "unobtainiumHuts", "unobtainiumDrill", "hydroPlantTurbines", "storageBunkers"]
		}
	},{
		name: "advExogeology",
		title: "Advanced Exogeology",
		description: "Advanced Exogeology studies new methods of unobtainium processing",
		effectDesc: "Unlocks Eludium and Eludium upgrades",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 325000},
			{name: 	"blueprint", val: 350}
		],
		unlocks: {
			upgrades: ["eludiumCracker", "eludiumReflectors", "eludiumHuts", "mWReactor" /*, "eludiumDrill"*/],
			crafts: ["eludium"]
		}
	},
	{
		name: "nanotechnology",
		title: "Nanotechnology",
		description: "TBD",
		effectDesc: "Unlocks Nanosuits, FL Reactors, Augmentations and PVC",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 200000},
			{name: 	"blueprint", val: 150}
		],
		unlocks: {
			tech: ["superconductors"],
			upgrades: ["augumentation", "nanosuits", "photovoltaic", "fluidizedReactors"]
		}
	},{
		name: "superconductors",
		title: "Superconductors",
		description: "Superconductors are exotic materials that help to optimize energy efficiency of different technologies",
		effectDesc: "Unlocks Cold Fusion and Space Manufacturing",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 225000},
			{name: 	"blueprint", val: 175}
		],
		unlocks: {
            upgrades: ["coldFusion", "spaceManufacturing"],
			tech: ["antimatter"]
		}
	},{
		name: "antimatter",
		title: "Antimatter",
		description: "Antimatter provides some advanced sources of energy and generally benefits scientific advancement",
		effectDesc: "TBD",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 500000},
			{name : "relic",   val: 1}
		],
		unlocks: {
			upgrades: ["amReactors"]
		}
	},{
		name: "particlePhysics",
		title: "Particle Physics",
		description: "Particle physics takes us one step deeper into the understanding of the nature of matter and energy than its ancestor, Nuclear Physics",
		effectDesc: "Unlocks Particle Accelerators, Railguns and Enriched Uranium",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 185000},
			{name: 	"blueprint", val: 135}
		],
		unlocks: {
			tech: ["chronophysics", "dimensionalPhysics"],
			upgrades: ["enrichedUranium", "railgun"]
		}
	},{
		name: "dimensionalPhysics",
		title: "Dimensional Physics",
		description: "Dimensional Physics explores the concepts of space and time",
		effectDesc: "Unlocks Energy Rifts and LHC",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 235000}
		],
		unlocks: {
			upgrades: ["energyRifts", "lhc"]
		}
	},{
		name: "chronophysics",
		title: "Chronophysics",
		description: "Chronophysics studies the nature of time and possibilities of temporal manipulations",
		effectDesc: "Unlocks Chronospheres, Flux Reactors and Stasis Chambers",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 250000},
			{name: 	"timeCrystal", val: 5}
		],
		unlocks: {
			tech: ["tachyonTheory"],
			upgrades: ["stasisChambers", "fluxCondensator"]
		}
	},{
		name: "tachyonTheory",
		title: "Tachyon Theory",
		description: "Tachyonic particles are hypothetical particles that always move faster than light. (TBD!)",
		effectDesc: "Unlocks FTL and Chronoforge",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 750000},
			{name: 	"timeCrystal", val: 25},
			{name : "relic",   val: 1}
		],
		unlocks: {
			upgrades: ["tachyonAccelerators", "chronoforge"]
		}
	}],

	metaCache: null,

	constructor: function(game){
		this.game = game;
		this.metaCache = {};
	},

	get: function(techName){
		var tech = this.metaCache[techName];
		if (tech){
			return tech;
		}

		for (var i = this.techs.length - 1; i >= 0; i--) {
			if (this.techs[i].name == techName){
				this.metaCache[techName] = this.techs[i];
				return this.techs[i];
			}
		}
		console.error("Failed to get tech for tech name '"+techName+"'");
		return null;
	},

	save: function(saveData){
		saveData.science = {
			techs: this.filterMetadata(this.techs, ["name", "unlocked", "researched"]),
			hideResearched: this.hideResearched
		};
	},

	load: function(saveData){
		if (saveData.science){
			this.hideResearched = saveData.science.hideResearched;

			var techs = saveData.science.techs;

			if (saveData.science.techs.length){
				for (var i = saveData.science.techs.length - 1; i >= 0; i--) {
					var savedTech = saveData.science.techs[i];

					if (savedTech != null){
						var tech = this.game.science.get(savedTech.name);
						if (tech){
							tech.unlocked = savedTech.unlocked;
							tech.researched = savedTech.researched;
						}
					}
				}
			}
		}

		//re-unlock technologies in case we have modified something
		for (var i = this.techs.length - 1; i >= 0; i--) {
			var tech = this.techs[i];
			if (!tech.researched) {
				continue;
			}

			this.game.unlock(tech.unlocks);
		}

	},

	unlockAll: function(){
		for (var i = this.techs.length - 1; i >= 0; i--) {
			var tech = this.techs[i];
			tech.researched = true;
			tech.unlocked = true;
			this.game.unlock(tech.unlocks);
		}
		this.game.msg("All techs are unlocked!");
	}
});

dojo.declare("com.nuclearunicorn.game.ui.TechButton", com.nuclearunicorn.game.ui.ButtonModern, {

	techName: null,
	tooltipName: true,
	simplePrices: false,
	hasResourceHover: true,

	constructor: function(opts, game){
		this.techName = opts.tech;
	},

	getTech: function(){
		return this.getTechByName(this.techName);
	},

	getTechByName: function(name){
		return this.game.science.get(name);
	},

	updateEnabled: function(){
		this.inherited(arguments);

		var tech = this.getTech();
		if (tech.researched /*|| !tech.unlocked*/){
			this.setEnabled(false);
		}
	},

	getDescription: function(){
		var tech = this.getTech();
		if (!tech.researched){
			return this.description;
		} else {
			return this.description + "<br>" + "Effect: " + tech.effectDesc;
		}
	},

	getFlavor: function(){
		var tech = this.getTech();
		return tech.flavor;
	},

	getName: function(){
		var tech = this.getTech();
		if (!tech.researched){
			return this.name;
		} else {
			return this.name + " (complete)";
		}
	},

	updateVisible: function(){
		var tech = this.getTech();
		if (!tech.unlocked){
			this.setVisible(false);
		}else{
			this.setVisible(true);
		}

		if (tech.researched && this.game.science.hideResearched){
			this.setVisible(false);
		}
	},

	getSelectedObject: function(){
		return this.getTech();
	}

});

dojo.declare("com.nuclearunicorn.game.ui.tab.Library", com.nuclearunicorn.game.ui.tab, {

	metaphysicsPanel: null,

	render: function(tabContainer){

		this.buttons = [];

		var hasCivil = this.game.science.get("civil");

		//--------------------------------------------------------------------
		var div = dojo.create("div", { style: { float: "right"}}, tabContainer);
		var groupCheckbox = dojo.create("input", {
			id : "toggleResearched",
			type: "checkbox",
			checked: this.game.science.hideResearched,
			style: {
				display: hasCivil ? "" : "none"
			}
		}, div);

		dojo.connect(groupCheckbox, "onclick", this, function(){
			this.game.science.hideResearched = !this.game.science.hideResearched;

			dojo.empty(tabContainer);
			this.render(tabContainer);
		});

		dojo.create("label", { innerHTML: "Hide researched techs", for: "toggleResearched"}, div);
		//---------------------------------------------------------------------

		var table = dojo.create("table", { className: "table", style:{
			width: "100%"
		}}, tabContainer);

		var tr = dojo.create("tr", null, table);

		var tdTop = dojo.create("td", { colspan: 2 },
			dojo.create("tr", null, table));

		this.tdTop = tdTop;


		var tr = dojo.create("tr", null, table);

		var tdLeft = dojo.create("td", null, tr);
		var tdRight = dojo.create("td", null, tr);


		//this.inherited(arguments);


		for (var i = 0; i < this.game.science.techs.length; i++){
			var tech = this.game.science.techs[i];

			var btn = this.createTechBtn(tech);

			btn.updateVisible();
			btn.updateEnabled();

			this.addButton(btn);
			btn.render(tr);
		}


		//------------ metaphysics ----------------
		if (this.game.science.get("metaphysics").researched && this.game.paragonPoints > 0){
			var metaphysicsPanel = new classes.ui.PrestigePanel("Metaphysics");
			metaphysicsPanel.game = this.game;

			var content = metaphysicsPanel.render(tabContainer);

			this.metaphysicsPanel = metaphysicsPanel;
		}

		this.update();
	},

	update: function(){
		this.inherited(arguments);

		if (this.metaphysicsPanel){
			this.metaphysicsPanel.update();
		}
	},

	constructor: function(tabName, game){
		var self = this;
		this.game = game;
	},

	createTechBtn: function(tech){
		var self = this;
		var btn = new com.nuclearunicorn.game.ui.TechButton({
			name : tech.title,
			handler: dojo.partial(function(tech, game, btn){
				tech.researched = true;

				this.game.unlock(tech.unlocks);

				if (tech.upgrades){
					this.game.upgrade(tech.upgrades);
				}
			}, tech, self.game),
			prices: tech.prices ? tech.prices : [{
				name:"science",
				val: tech.cost
			}],
			description: tech.description,
			tech: tech.name
		}, this.game);
		return btn;
	}
});
