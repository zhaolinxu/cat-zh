/**
 * Weird cat science
 */
dojo.declare("com.nuclearunicorn.game.science.ScienceManager", null, {
	
	game: null,
	
	hideResearched: false,	//hide researched techs
	
	//list of technologies
	techs:[{
		name: "calendar",
		title: "Calendar",
		
		description: "Develops the ability to predict the approximate time of change of seasons - ability essential for advanced agriculture.",
		effectDesc: "Calendar provides a way of more precise time tracking",
		
		unlocked: true,
		researched: false,
		cost: 30,	//cos in WCS (weird cat science)
		unlocks: ["agriculture"]
			
	},{
		name: "agriculture",
		title: "Agriculture",
		
		description: "The basis of all civilized life, Agriculture allows working the land for food",
		effectDesc: "Unlocks farmers and Barns",
		
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
		
		description: "Ranged weaponry known as a 'bow'",
		effectDesc: "Unlocks hunters",
		
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
		
		description: "Mining develops the ability to extract mineral resources from the bowels of the Cath",
		effectDesc: "You can build mines",
		
		unlocked: false,
		researched: false,
		cost: 600,
		unlocks: ["metal"]
	},{
		name: "metal",
		title: "Metal working",
		
		description: "The first metal-working technology that provides your civilization with sturdy, durable tools",
		effectDesc: "You can construct smelters that convert ore into the metal",
		
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
		cost: 500,	//mostly does nothing, so pirce is lower
		unlocks: ["civil", "math", "construction", "brewery"]
		
	},{
		name: "brewery",
		title: "Brewery",
		
		description: "Brewing is a non-mandatory technology allowing the processing of a catnip",
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
		description: "The creation of the first true state organ provides many benefits related with better organisation",
		effectDesc: "Unlocks detailed information about your population",
		
		unlocked: false,
		researched: false,
		cost: 1500,
		unlocks: ["currency"]	//currency
	},{
		name: "math",
		title: "Mathematics",
		description: " Mathematics is the most basic building block upon which all physical science is based.",
		effectDesc: "Allows construction of Academies, very efficient research buildings",
		
		unlocked: false,
		researched: false,
		cost: 1000,
		unlocks: []
	},{
		name: "construction",
		title: "Construction",
		description: "Construction represents the advancement of the study of masonry, primarily by adding iron and other metals to the builder's toolbox",
		effectDesc: "Allows your workers to construct the Lumber mill. Unlocks composite bows",
		
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
		effectDesc: "Unlocks gold and economics",
		
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
		}
	},{
		name: "machinery",
		title: "Machinery",
		description: "Previous advances in metal working and science give birth to the concept of a machine, a device with multiple moving parts.",
		effectDesc: "Unlocks steamworks, printing press and factory automation.",
		
		unlocked: false,
		researched: false,
		cost: 15000,
		unlocks: [],
		handler: function(game){
			game.workshop.get("printingPress").unlocked = true;
			game.workshop.get("factoryAutomation").unlocked = true;
			game.workshop.getCraft("paper").unlocked = true;
		}
	},{
		name: "steel",
		title: "Steel",
		description: "Development of the new Steel alloy advances further metal working",
		effectDesc: "Unlocks Coal and Steel production",
		
		unlocked: false,
		researched: false,
		cost: 12000,
		unlocks: [],
		handler: function(game){
			game.workshop.get("deepMining").unlocked = true;
			game.workshop.get("coalFurnace").unlocked = true;
			game.workshop.get("combustionEngine").unlocked = true;
			game.workshop.get("reinforcedWarehouses").unlocked = true;
			game.workshop.get("steelAxe").unlocked = true;
		}
	},{
		name: "theology",
		title: "Theology",
		description: "Theology is the study of religion",
		effectDesc: "Unlocks access to the religion",
		
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 20000},
			{name: 	"manuscript", val: 35}
		],
		unlocks: ["astronomy"],
		handler: function(game){
		}
	},{
		name: "astronomy",
		title: "Astronomy",
		description: "Astronomy is the study of objects in space",
		effectDesc: "Unlocks observatory and star charts",
		
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 28000},
			{name: 	"manuscript", val: 50}
		],
		unlocks: ["navigation"],
		handler: function(game){
		}
	},{
		name: "navigation",
		title: "Navigation",
		description: "Navigation allows serious advancements in sailing and shipbuilding technology",
		effectDesc: "Unlocks construction of the ships (TBD)",
		
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 35000},
			{name: 	"manuscript", val: 75}
		],
		unlocks: ["physics", "archeology"],
		handler: function(game){
			game.workshop.getCraft("ship").unlocked = true;
			game.workshop.get("caravanserai").unlocked = true;
			game.workshop.get("astrolabe").unlocked = true;
			game.workshop.get("titaniumMirrors").unlocked = true;
		}
	},{
		name: "physics",
		title: "Physics",
		description: "TBD",
		effectDesc: "Unlocks some usefull upgrades",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 50000},
			{name: 	"compedium", val: 5}
		],
		unlocks: ["chemistry", "elictricity"],
		handler: function(game){
			game.workshop.get("pneumaticPress").unlocked = true;
			game.workshop.get("pyrolysis").unlocked = true;
		}
	},{
		name: "chemistry",
		title: "Chemistry",
		description: "TBD",
		effectDesc: "(TBD)",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 60000},
			{name: 	"compedium", val: 25}
		],
		unlocks: [],
		handler: function(game){
		}
	},{
		name: "archeology",
		title: "Archeology",
		description: "TBD",
		effectDesc: "(TBD)",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 70000},
			{name: 	"compedium", val: 30}
		],
		unlocks: ["biology"],
		handler: function(game){

		}
	},{
		name: "elictricity",
		title: "Elictricity",
		description: "TBD",
		effectDesc: "(TBD)",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 75000},
			{name: 	"compedium", val: 35}
		],
		unlocks: [],
		handler: function(game){
		}
	},{
		name: "biology",
		title: "Biology",
		description: "TBD",
		effectDesc: "(TBD)",
		unlocked: false,
		researched: false,
		prices: [
			{name : "science", val: 85000},
			{name: 	"compedium", val: 75}
		],
		unlocks: [],
		handler: function(game){
		}
	}
	],
	
	/**
	 * Lost tech blueprints are sort of wonders that are not available instantly
	 */  
	lostTechs:[
	{
		name : "lightTemple",
		title: "Temple of Light",
		unlocked: false,
		constructed: false,
		prices: [{ name : "beam", val: 25}, {name : "block", val: 75}],
		description: "TBD"
	}
	],
	
	constructor: function(game){
		this.game = game;
	},
	
	get: function(techName){
		for( var i = 0; i< this.techs.length; i++){
			if (this.techs[i].name == techName){
				return this.techs[i];
			}
		}
		console.error("Failed to get tech for tech name '"+techName+"'");
		return null;
	},
	
	save: function(saveData){
		saveData.science = {
			techs: this.techs
		}
		saveData.science.hideResearched = this.hideResearched;
	},
	
	load: function(saveData){		
		if (saveData.science){
			this.hideResearched = saveData.science.hideResearched;
			
			var techs = saveData.science.techs;
			//console.log("restored techs:",  techs);
			
			if (saveData.science.techs.length){
				for(var i = 0; i< saveData.science.techs.length; i++){
					var savedTech = saveData.science.techs[i];
					
					if (savedTech != null){
						var tech = this.game.science.get(savedTech.name);
						tech.unlocked = savedTech.unlocked;
						tech.researched = savedTech.researched;
						
						if (tech.researched && tech.handler){
							tech.handler(this.game);	//just in case update tech effects
						}
					}
				}
			}
		}
		
		//re-unlock technologies in case we have modified something
		for (var i = 0; i< this.techs.length; i++ ){
			var tech = this.techs[i];
			
			if (tech.researched && tech.unlocks && tech.unlocks.length){
				//console.log("re-evaluating unlocks on :", tech.name);
				for (var j = 0; j < tech.unlocks.length; j++){
					var newTech = this.get(tech.unlocks[j]);
					newTech.unlocked = true;
				}
			}
		}
		
	}
});

dojo.declare("com.nuclearunicorn.game.ui.TechButton", com.nuclearunicorn.game.ui.Button, {
	
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
			return this.description + "\n" + "Effect: " + tech.effectDesc;
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
	}
});

dojo.declare("com.nuclearunicorn.game.ui.tab.Library", com.nuclearunicorn.game.ui.tab, {

	render: function(tabContainer){
		
		this.buttons = [];
		
		var hasCivil = this.game.science.get("civil");
		
		//--------------------------------------------------------------------
		var div = dojo.create("div", { style: { float: "right"}}, tabContainer);
		var groupCheckbox = dojo.create("input", {
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
		
		dojo.create("span", { innerHTML: "Hide researched techs"}, div);
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
			
			if (!tech.unlocked || tech.researched){
				btn.setEnabled(false);
			}
			this.addButton(btn);
			btn.render(tr);
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
			handler: function(btn){
				tech.researched = true;

				if (tech.unlocks && tech.unlocks.length){
					for (var i = 0; i < tech.unlocks.length; i++){
						var newTech = btn.getTechByName(tech.unlocks[i]);
						newTech.unlocked = true;
					}
				}
				
				if (tech.handler){
					tech.handler(self.game);
				}
				
			},
			prices: tech.prices ? tech.prices : [{
				name:"science",
				val: tech.cost
			}],
			description: tech.description,
			tech: tech.name
		});
		return btn;
	}
});
