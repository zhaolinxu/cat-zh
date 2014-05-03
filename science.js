/**
 * Weird cat science
 */
dojo.declare("com.nuclearunicorn.game.science.ScienceManager", null, {
	
	game: null,
	
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
		
		description: "Ranged waponry known as a 'bow'",
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
		cost: 800
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
		effectDesc: "Allows your workers to construct the Lumber mill. Unlocks composite bows.",
		
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
		effectDesc: "TBD (may do a lot of cool stuff eventually)",
		
		unlocked: false,
		researched: false,
		cost: 4000,
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
	},
	
	load: function(saveData){
		if (saveData.science){
			var techs = saveData.science.techs;
			//console.log("restored techs:",  techs);
			
			if (saveData.science.techs.length){
				for(var i = 0; i< saveData.science.techs.length; i++){
					var savedTech = saveData.science.techs[i];
					
					if (savedTech != null){
						var tech = this.game.science.get(savedTech.name);
						tech.unlocked = savedTech.unlocked;
						tech.researched = savedTech.researched;
						
						if (tech.unlocked && tech.handler){
							tech.handler(this.game);	//just in case update tech effects
						}
					}
				}
			}
		}
	}
});

dojo.declare("com.nuclearunicorn.game.ui.TechButton", com.nuclearunicorn.game.ui.button, {
	
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
	}
});

dojo.declare("com.nuclearunicorn.game.ui.tab.Library", com.nuclearunicorn.game.ui.tab, {

	render: function(tabContainer){
		
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

		
		this.inherited(arguments);
	},
	
	constructor: function(tabName, game){
		var self = this;
		this.game = game;

		for (var i = 0; i < this.game.science.techs.length; i++){
			var tech = this.game.science.techs[i];

			var btn = this.createTechBtn(tech);
			
			if (!tech.unlocked || tech.researched){
				btn.setEnabled(false);
			}
			this.addButton(btn);
		}
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
			prices:[{
				name:"science",
				val: tech.cost
			}],
			description: tech.description,
			tech: tech.name
		});
		return btn;
	}
});
