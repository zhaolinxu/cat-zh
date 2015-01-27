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
		unlocks: ["agriculture"]

	},{
		name: "agriculture",
		title: "Agriculture",

		description: "The basis of all civilised life, Agriculture allows the working of land for food.",
		effectDesc: "Unlocks Farmers and Barns",

		unlocked: false,
		researched: false,
		cost: 100,
		unlocks: ["mining", "archery"],
		handler: function(game){
			game.village.getJob("farmer").unlocked = true;
		}
	},{
		name: "archery",
		title: "Archery",

		description: "Ranged weaponry known as a 'Bow'.",
		effectDesc: "Unlocks Hunters",

		unlocked: false,
		researched: false,
		cost: 300,
		unlocks: ["animal"],
		handler: function(game){
			game.village.getJob("hunter").unlocked = true;
		}
	},{
		name: "mining",
		title: "Mining",

		description: "Mining develops the ability to extract mineral resources from the bowels of Cath.",
		effectDesc: "You can build Mines",

		unlocked: false,
		researched: false,
		cost: 600,
		handler: function(game){
			game.workshop.get("bolas").unlocked = true;
		},
		unlocks: ["metal"]
	},{
		name: "metal",
		title: "Metal working",

		description: "The first metal-working technology that provides your civilisation with sturdy, durable tools.",
		effectDesc: "You can construct Smelters that convert ore into metal",

		unlocked: false,
		researched: false,
		cost: 800,
		handler: function(game){
			game.workshop.get("huntingArmor").unlocked = true;
		}
	},
	{
		name: "animal",
		title: "Animal husbandry",
		description: "Domestication allows the access to various animal resources via the pasture.",
		effectDesc: "Unlocks Pastures",

		unlocked: false,
		researched: false,
		cost: 500,	//mostly does nothing, so price is lower
		unlocks: ["civil", "math", "construction", "brewery"],
		handler: function(game){
			//game.workshop.getCraft("leather").unlocked = true;
		}

	},{
		name: "brewery",
		title: "Brewery",

		description: "Brewery is a non-mandatory technology which improves the process of converting catnip to catnip wood.",
		effectDesc: "Unlocks Catnip Enrichment.",

		unlocked: false,
		researched: false,
		cost: 1200,
		unlocks: [],
		handler: function(game){
			game.workshop.get("advancedRefinement").unlocked = true;
		}
	},{
		name: "civil",
		title: "Civil Service",
		description: "The creation of the first true state organ provides many benefits related with better organization.",
		effectDesc: "Unlocks detailed information about your population",

		unlocked: false,
		researched: false,
		cost: 1500,
		unlocks: ["currency"],	//currency
		flavor: "Specialists in Herding Cats"
	},{
		name: "math",
		title: "Mathematics",
		description: "Mathematics is the most basic building block upon which all physical science is based.",
		effectDesc: "Allows construction of Academies, very efficient research buildings",

		unlocked: false,
		researched: false,
		cost: 1000,
		unlocks: [],
		handler: function(game){
			game.workshop.get("celestialMechanics").unlocked = true;
		}
	},{
		name: "construction",
		title: "Construction",
		description: "Construction represents the advancement of the study of masonry, primarily by adding iron and other metals to the builder's toolbox.",
		effectDesc: "Allows your workers to construct the Lumber mill. Unlocks Composite Bows",

		unlocked: false,
		researched: false,
		cost: 1300,
		unlocks: ["engineering"],
		handler: function(game){
			game.workshop.get("compositeBow").unlocked = true;
		}
	},{
		name: "engineering",
		title: "Engineering",
		description: "Engineering is the science (or art perhaps) of designing complex materials, structures, devices, and systems.",
		effectDesc: "Unlocks aqueducts",

		unlocked: false,
		researched: false,
		cost: 1500,
		unlocks: ["writing"],
		handler: function(game){
		}
	},{
		name: "currency",
		title: "Currency",
		description: "Currency represent a certain amount of wealth",
		effectDesc: "Unlocks gold and trade",

		unlocked: false,
		researched: false,
		cost: 2200,
		unlocks: [],
		handler: function(game){
			game.workshop.get("goldOre").unlocked = true;
		}
	},{
		name: "writing",
		title: "Writing",
		description: "Writing is the art of recording information on material.",
		effectDesc: "Unlocks Amphitheatres",

		unlocked: false,
		researched: false,
		cost: 3600,
		unlocks: ["philosophy", "machinery", "steel"],
		handler: function(game){
			game.workshop.getCraft("parchment").unlocked = true;
		}
	},{
		name: "philosophy",
		title: "Philosophy",
		description: "Philosophy is the first abstract science developed by catkind.",
		effectDesc: "Unlocks Temples",

		unlocked: false,
		researched: false,
		cost: 9500,
		unlocks: ["theology"],
		handler: function(game){
			game.workshop.getCraft("compedium").unlocked = true;
		},
		flavor: "I purr, therefore I am"
	},{
		name: "machinery",
		title: "Machinery",
		description: "Previous advances in metal working and science give birth to the concept of a machine, a device with multiple moving parts.",
		effectDesc: "Unlocks Steamworks, Crossbows, Printing press and Factory automation.",

		unlocked: false,
		researched: false,
		cost: 15000,
		unlocks: [],
		handler: function(game){
			game.workshop.get("printingPress").unlocked = true;
			game.workshop.get("factoryAutomation").unlocked = true;
			game.workshop.get("crossbow").unlocked = true;
		}
	},{
		name: "steel",
		title: "Steel",
		description: "Development of the new Steel alloy advances further metal working.",
		effectDesc: "Unlocks Coal and Steel production",

		unlocked: false,
		researched: false,
		cost: 12000,
		unlocks: [],
		handler: function(game){

			game.workshop.getCraft("steel").unlocked = true;

			game.workshop.get("deepMining").unlocked = true;
			game.workshop.get("coalFurnace").unlocked = true;
			game.workshop.get("combustionEngine").unlocked = true;
			game.workshop.get("reinforcedWarehouses").unlocked = true;
			game.workshop.get("steelAxe").unlocked = true;
			game.workshop.get("steelArmor").unlocked = true;
		}
	},{
		name: "theology",
		title: "Theology",
		description: "Theology is the study of religion",
		effectDesc: "Unlocks religion",

		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 20000},
			{name: 	"manuscript", val: 35}
		],
		unlocks: ["astronomy"],
		handler: function(game){
			game.village.getJob("priest").unlocked = true;
		}
	},{
		name: "astronomy",
		title: "Astronomy",
		description: "Astronomy is the study of objects in space.",
		effectDesc: "Unlocks Observatory and Star charts",

		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 28000},
			{name: 	"manuscript", val: 65}
		],
		unlocks: ["navigation"],
		handler: function(game){
		}
	},{
		name: "navigation",
		title: "Navigation",
		description: "Navigation allows serious advancements in sailing and shipbuilding technology.",
		effectDesc: "Unlocks the construction of Trade Ships and oversea trade",

		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 35000},
			{name: 	"manuscript", val: 100}
		],
		unlocks: ["physics", "archeology", "architecture"],
		handler: function(game){
			game.workshop.getCraft("ship").unlocked = true;

			game.workshop.get("caravanserai").unlocked = true;
			game.workshop.get("cargoShips").unlocked = true;

			game.workshop.get("astrolabe").unlocked = true;
			game.workshop.get("titaniumMirrors").unlocked = true;
			game.workshop.get("titaniumAxe").unlocked = true;
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
		unlocks: ["acoustics"],
		handler: function(game){

		},
		flavor: "Bigger, better cat towers!"
	},{
		name: "physics",
		title: "Physics",
		description: "Physics is a study of laws of nature.",
		effectDesc: "Unlocks some useful upgrades.",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 50000},
			{name: 	"compedium", val: 35}
		],
		unlocks: ["chemistry", "electricity", "metaphysics"],
		handler: function(game){
			game.workshop.get("pneumaticPress").unlocked = true;
			game.workshop.get("pyrolysis").unlocked = true;
			game.workshop.get("steelSaw").unlocked = true;
			game.workshop.getCraft("blueprint").unlocked = true;
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
		unlocks: [],
		handler: function(game){
		}
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
		unlocks: [],
		handler: function(game){
			game.workshop.getCraft("alloy").unlocked = true;
			game.workshop.get("alloyAxe").unlocked = true;
			game.workshop.get("alloyBarns").unlocked = true;
			game.workshop.get("alloyWarehouses").unlocked = true;
			game.workshop.get("alloyArmor").unlocked = true;
		}
	},{
		name: "acoustics",
		title: "Acoustics",
		description: "Acoustics is the study of sound.",
		effectDesc: "Unlocks Chapels",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 65000},
			{name: 	"compedium", val: 65}
		],
		unlocks: ["drama"],
		handler: function(game){

		}
	},{
		name: "drama",
		title: "Drama and Poetry",
		description: "Drama and poetry are both forms of artistic expression.\nThe former expressed through the use of visual performance, the latter through the written word.",
		effectDesc: "Unlocks Festivals and Cultural artefacts(TBD)",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 90000},
			{name: 	"parchment", val: 5000}
		],
		unlocks: [],
		handler: function(game){

		}
	},{
		name: "archeology",
		title: "Geology",
		description: "Geology is the science comprising the study of Cath, the rocks of which it is composed, and the processes by which they change.",
		effectDesc: "Unlocks Quarries and Geologists",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 70000},
			{name: 	"compedium", val: 75}
		],
		unlocks: ["biology"],
		handler: function(game){
			game.village.getJob("geologist").unlocked = true;
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
		unlocks: ["industrialization"],
		handler: function(game){
		},
		flavor: "Who knew running around on the carpet could generate such power?"
	},{
		name: "biology",
		title: "Biology",
		description: "Biology deals with living organisms, their characteristics and their use in our society.",
		effectDesc: "Unlocks Biolabs",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 85000},
			{name: 	"compedium", val: 100}
		],
		unlocks: ["biochemistry"],
		handler: function(game){
		}
	},{
		name: "biochemistry",
		title: "Biochemistry",
		description: "TBD.",
		effectDesc: "Unlocks biofuel processing",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 145000},
			{name: 	"compedium", val: 500}
		],
		unlocks: ["genetics"],
		handler: function(game){
			game.workshop.get("biofuel").unlocked = true;
		}
	},{
		name: "genetics",
		title: "Genetics",
		description: "TBD.",
		effectDesc: "Unlocks genetic engineering(?)",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 190000},
			{name: 	"compedium", val: 1500}
		],
		unlocks: [],
		handler: function(game){
		}
	},{
		name: "industrialization",
		title: "Industrialization",
		description: "Industrialization represents the concept of mass-producing materials, from food products to machine parts.",
		effectDesc: "Unlocks Advanced Automation and Bargets",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 100000},
			{name: 	"blueprint", val: 25}
		],
		unlocks: ["mechanization", "metalurgy", "combustion"],
		handler: function(game){
			game.workshop.get("barges").unlocked = true;
			game.workshop.get("advancedAutomation").unlocked = true;
		}
	},{
		name: "mechanization",
		title: "Mechanization",
		description: "Mechanisation provides a lot of ways to automate redundant tasks; hence improving craft, oil pumps and construction technologies.",
		effectDesc: "Unlocks Factories, Pumpjacks and Concrete",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 115000},
			{name: 	"blueprint", val: 45}
		],
		unlocks: ["electronics"],
		handler: function(game){
			game.workshop.get("pumpjack").unlocked = true;
			game.workshop.getCraft("concrate").unlocked = true;

			//TODO: move to the separate tech?
			game.workshop.get("concreteWarehouses").unlocked = true;
			game.workshop.get("concreteBarns").unlocked = true;
			game.workshop.get("concreteHuts").unlocked = true;
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
		unlocks: [],
		handler: function(game){
			game.workshop.get("electrolyticSmelting").unlocked = true;
			game.workshop.get("oxidation").unlocked = true;
			game.workshop.get("miningDrill").unlocked = true;
		}
	},{
		name: "combustion",
		title: "Combustion",
		description: "Combustion provides a number of ways to improve old coal-based automation technologies, such as Steamworks.",
		effectDesc: "Unlocks Offset Printing and Fuel Injection",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 120000},
			{name: 	"blueprint", val: 50}
		],
		unlocks: [],
		handler: function(game){
			game.workshop.get("offsetPress").unlocked = true;
			game.workshop.get("fuelInjectors").unlocked = true;
			game.workshop.get("oilRefinery").unlocked = true;
		}
	},{
		name: "electronics",
		title: "Electronics",
		description: "Electronics unlocks some high level upgrades mainly related to science",
		effectDesc: "Unlocks CAD Systems, Refrigeration and SETI",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 135000},
			{name: 	"blueprint", val: 70}
		],
		unlocks: ["nuclearFission", "rocketry", "robotics"],
		handler: function(game){
			game.workshop.get("cadSystems").unlocked = true;
			game.workshop.get("refrigeration").unlocked = true;
			game.workshop.get("seti").unlocked = true;
		}
	},{
		name: "robotics",
		title: "Robotics",
		description: "Robotics improves automated structures like Calciners",
		effectDesc: "Unlocks Steel Plants, Tankers and Rotary Kilns",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 140000},
			{name: 	"blueprint", val: 80}
		],
		unlocks: [],
		handler: function(game){
			game.workshop.get("steelPlants").unlocked = true;
			game.workshop.get("rotaryKiln").unlocked = true;
			game.workshop.getCraft("tanker").unlocked = true;
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
		unlocks: ["nanotechnology", "particlePhysics"],
		handler: function(game){
			game.workshop.get("reactorVessel").unlocked = true;
			game.workshop.get("nuclearSmelters").unlocked = true;
		}
	},{
		name: "rocketry",
		title: "Rocketry",
		description: "Required for space exploration",
		effectDesc: "Unlocks construction of spaceships",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 175000},
			{name: 	"blueprint", val: 125}
		],
		unlocks: ["sattelites"],
		handler: function(game){
			game.spaceTab.visible = true;
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
		unlocks: ["orbitalEngineering"],
		handler: function(game){
		}
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
		unlocks: ["exogeology"],
		handler: function(game){
			game.workshop.get("hubbleTelescope").unlocked = true;
			game.workshop.get("astrophysicists").unlocked = true;
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
		unlocks: ["exogeology"],
		handler: function(game){
			game.workshop.get("unobtainiumReflectors").unlocked = true;
			game.workshop.get("unobtainiumHuts").unlocked = true;
			game.workshop.get("unobtainiumDrill").unlocked = true;
		}
	},
	{
		name: "nanotechnology",
		title: "Nanotechnology",
		description: "TBD",
		effectDesc: "Unlocks Nanosuits and Augmentations",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 200000},
			{name: 	"blueprint", val: 150}
		],
		unlocks: [],
		handler: function(game){
			game.workshop.get("augumentation").unlocked = true;
			game.workshop.get("nanosuits").unlocked = true;
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
		unlocks: ["chronophysics", "dimensionalPhysics"],
		handler: function(game){
			game.workshop.get("enrichedUranium").unlocked = true;
			game.workshop.get("railgun").unlocked = true;
		}
	},{
		name: "dimensionalPhysics",
		title: "Dimensional Physics",
		description: "Dimensional Physics explore the concepts of space and time",
		effectDesc: "Unlocks Energy Rifts and LHC",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 235000}
		],
		unlocks: [],
		handler: function(game){
			game.workshop.get("energyRifts").unlocked = true;
			game.workshop.get("lhc").unlocked = true;
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
		unlocks: [],
		handler: function(game){
			game.workshop.get("stasisChambers").unlocked = true;
			game.workshop.get("fluxCondensator").unlocked = true;
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
			techs: this.filterMetadata(this.techs, ["name", "unlocked", "researched"])
		}
		saveData.science.hideResearched = this.hideResearched;
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

							if (tech.researched && tech.handler){
								tech.handler(this.game);	//update tech effects to keep saves consistent
							}
						}
					}
				}
			}
		}

		//re-unlock technologies in case we have modified something
		for (var i = this.techs.length - 1; i >= 0; i--) {
			var tech = this.techs[i];

			if (tech.researched && tech.unlocks && tech.unlocks.length){
				for (var j = tech.unlocks.length - 1; j >= 0; j--) {
					var newTech = this.get(tech.unlocks[j]);
					newTech.unlocked = true;
				}
			}
		}

	},

	unlockAll: function(){
		for (var i = this.techs.length - 1; i >= 0; i--) {
			var tech = this.techs[i];
			tech.researched = true;
			tech.unlocked = true;
		}
		this.game.msg("All techs are unlocked!");
	}
});

dojo.declare("com.nuclearunicorn.game.ui.TechButton", com.nuclearunicorn.game.ui.ButtonModern, {

	techName: null,

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

	getTooltipHTML: function(btn){
		var tech = this.getTech();

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
			innerHTML: this.getDescription(),
			style: {
				textAlign: "center",
				width: "100%",
				borderBottom: "1px solid gray",
				paddingBottom: "4px",
				fontSize: "15px",
				color: "gray"
		}}, tooltip);

		this.renderPrices(tooltip);

		//-------------- flavor stuff -------------

		dojo.create("div", {
			innerHTML: tech.flavour || "flavour text",
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


		var tr = dojo.create("tr", null, table)

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

				if (tech.unlocks && tech.unlocks.length){
					for (var i = tech.unlocks.length - 1; i >= 0; i--) {
						var newTech = btn.getTechByName(tech.unlocks[i]);
						newTech.unlocked = true;
					}
				}

				if (tech.handler){
					tech.handler(game);
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
