/**
 * Weird cat science
 */
dojo.declare("com.nuclearunicorn.game.science.ScienceManager", null, {
	
	game: null,
	
	//list of technologies
	techs:[{
		name: "calendar",
		title: "Calendar",
		
		description: "By studing the rotation of the Cath around the sun we may find a better understanding of the seasons and time.",
		effectDesc: "Calendar provides a way of more precise time tracking",
		
		unlocked: true,
		researched: false,
		cost: 60,	//cos in WCS (weird cat science)
		unlocks: ["irrigation"]
			
	},{
		name: "irrigation",
		title: "Irrigation",
		
		description: "By constructing artificial water channels we may improve our catnip fields production",
		effectDesc: "Base fields production improved up to 20%",
		
		unlocked: false,
		researched: false,
		cost: 200
	}],
	
	constructor: function(game){
		this.game = game;
	},
	
	get: function(techName){
		for( var i = 0; i< this.techs.length; i++){
			if (this.techs[i].name == techName){
				return this.techs[i];
			}
		}
		throw "Failed to get job for job name '"+techName+"'";
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
		if (tech.researched || !tech.unlocked){
			this.setEnabled(false);
		}
	}
});

dojo.declare("com.nuclearunicorn.game.ui.tab.Library", com.nuclearunicorn.game.ui.tab, {

	render: function(tabContainer){
		
		var table = dojo.create("table", { style:{
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
