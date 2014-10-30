/**
 * Behold the bringer of light!
 */ 
dojo.declare("com.nuclearunicorn.game.space.SpaceManager", com.nuclearunicorn.core.TabManager, {
	
	game: null,
	
	programs: [{
		name: "orbitalLaunch",
		title: "Orbital Launch",
		description: "Launch a rocket to a space.",
		researched: false,
		unlocked: true,
		prices: [
			{ name : "starchart", val: 250 },
			{ name : "manpower", val: 5000 },
			{ name : "science", val: 100000 }
		],
		chance: 90,	//success chance in %
		handler: function(game, self){
			game.space.getProgram("sattelite").unlocked = true;
			game.space.getProgram("moonMission").unlocked = true;
		}
	},{
		name: "sattelite",
		title: "Deploy Sattelite",
		description: "Deploy a sattelite. Sattelites improve your observatory effectiveness by 5% and produce starcharts",
		unlocked: false,
		prices: [
			{ name : "starchart", val: 325 },
			{ name : "titanium", val: 2500 },
			{ name : "science", val: 125000 }
		],
		chance: 80,
		priceRatio: 1.08,
		requiredTech: ["sattelites"],
		val: 0,
		upgradable: true,
		handler: function(game, self){
		},
		effects: {
			"observatoryRatio" : 0.05,
			"starchartPerTickBase": 0.001
		}
	},{
		name: "moonMission",
		title: "Moon Mission",
		description: "Launch a rocket to the Crimsonmoon, a Cath planet sattelite",
		unlocked: false,
		researched: false,
		prices: [
			{ name : "starchart", val: 500 },
			{ name : "titanium", val: 5000 },
			{ name : "oil", 	val: 45000 },
			{ name : "science", val: 125000 }
		],
		chance: 60,
		upgradable: false,
		handler: function(game, self){
		}
	}],
	
	constructor: function(game){
		this.game = game;
	},
	
	
	save: function(saveData){
		saveData.space = {
			programs: this.programs
		}
	},
	
	load: function(saveData){
		if (!saveData.space){
			return;
		}

		if (saveData.space.programs){
			this.loadMetadata(this.programs, saveData.space.programs, ["val", "unlocked", "researched"], function(loadedElem){
				//TODO: move to common method (like 'adjust prices'), share with religion code
				var prices = dojo.clone(loadedElem.prices);
				for( var k = 0; k < prices.length; k++){
					var price = prices[k];
					for (var j = 0; j < loadedElem.val; j++){
						price.val = price.val * loadedElem.priceRatio;
					}
				}
			});
		}
	},
	
	update: function(){

	},
	
	getProgram: function(name){
		return this.getMeta(name, this.programs);
	},
	
	getEffect: function(name){
		return this.getMetaEffect(name, {meta:this.programs, provider: {
			getEffect: function(program, effectName){
				if (!program.effects){
					return 0;
				}
				return program.upgradable ? 
					program.effects[effectName] * program.val : 
					program.effects[effectName];
			}
		}});
	}
});

dojo.declare("com.nuclearunicorn.game.ui.SpaceProgramBtn", com.nuclearunicorn.game.ui.BuildingBtn, {

	program: null,
	
	constructor: function(opts, game) {
		
	},

	getProgram: function(){
		if (!this.program){
			this.program = this.game.space.getProgram(this.id);
		}
		return this.program;
	},
	
	getBuilding: function(){
		return this.getProgram();
	},
	
	hasSellLink: function(){
		return false;
	},
	
	getPrices: function(){
	    var prices = dojo.clone(this.getProgram().prices);

	    var program = this.getProgram();
	    var ratio = program.priceRatio || 1.15;
		 
		var prices = dojo.clone(program.prices);
		if (program.upgradable){
			for (var i = 0; i< program.val; i++){
			  for( var j = 0; j < prices.length; j++){
				 prices[j].val = prices[j].val * ratio;
			  }
			}
		}
		prices.push({name: "rocket", val: 1});
	    
	    return prices;
	},
	
	updateVisible: function(){
		var program = this.getProgram();
		if (program.requiredTech){
			for (var i = 0; i< program.requiredTech.length; i++){
				var tech = this.game.science.get(program.requiredTech[i]);
				if (!tech.researched){
					this.setVisible(false);
					return;
				}
			}
		}
		this.setVisible(this.getProgram().unlocked);
	},
	
	updateEnabled: function(){
		this.inherited(arguments);
		if (this.getProgram().researched && !this.getProgram().upgradable){
			this.setEnabled(false);
		}
	},
	
	onClick: function(){
		this.animate();
		var program = this.getProgram();
		if (this.enabled && this.hasResources()){
			
			//TODO: check for chance and display message like "Space program ended with spectacular failure"
			
			if (program.upgradable){
				program.val++;
			}
			
			this.handler(this);
			
			this.payPrice();
			this.update();
		}
	},

	
	getName: function(){
		var program = this.getProgram();
		if (!program.upgradable && program.researched){
			return program.title + " (Complete)";
		}else if (program.upgradable){
			return program.title + " (" + program.val + ")";
		}else {
			return program.title;
		}
	},
	
	getDescription: function(){
		var program = this.getProgram();
		return program.description + "<br>Success chance: " + program.chance + "%";
	},
	
	getTooltipHTML: function(btn){
		 
		var tooltip = dojo.create("div", { style: { 
			width: "280px",
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
		
		return tooltip.outerHTML;
	 }
});

dojo.declare("com.nuclearunicorn.game.ui.tab.SpaceTab", com.nuclearunicorn.game.ui.tab, {
	
	GCPanel: null,
	engineeringPanel: null,

	constructor: function(){
		
	},
	
	render : function(container) {
		var self = this;
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
				}
			}, self.game);
			button.render(content);
			self.GCPanel.addChild(button);
		});
		
		this.engineeringPanel = new com.nuclearunicorn.game.ui.Panel("Engineering", this.game.space);
		var content = this.engineeringPanel.render(container);
		
		var buildRocketBtn = new com.nuclearunicorn.game.ui.ButtonModern({ 
			name: "Rocket",
			description: "Construct a rocket",
			prices: [
				{ name: "alloy", val: 50 },
				{ name: "oil", val: 10000 },
			],
			handler: function(btn){
				btn.game.resPool.get("rocket").value++;	//TODO: i don't like polluting resource there, let's move this into the space manager variable?
			}
		}, this.game);
		buildRocketBtn.render(content);
		this.buildRocketBtn = buildRocketBtn;
	},
	
	update: function(){
		this.GCPanel.update();

		this.buildRocketBtn.update();
	}
});
