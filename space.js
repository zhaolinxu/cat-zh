/**
 * Behold the bringer of light!
 */ 
dojo.declare("com.nuclearunicorn.game.space.SpaceManager", com.nuclearunicorn.core.TabManager, {
	
	game: null,
	
	programs: [{
		name: "orbitalLaunch",
		title: "Orbital Launch",
		researched: false,
		unlocked: true,
		prices: [
			{ name : "starchart", val: 250 },
			{ name : "manpower", val: 5000 },
			{ name : "science", val: 125000 }
		],
		handler: function(game, self){
		}
	}],
	
	constructor: function(game){
		this.game = game;
	},
	
	
	save: function(saveData){

	},
	
	load: function(saveData){
		
	},
	
	update: function(){

	},
	
	getProgram: function(name){
		return this.getMeta(name, this.programs);
	},
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
	    prices.push({name: "rocket", val: 1});
	},
	
	updateVisible: function(){
		this.setVisible(this.getProgram().unlocked);
	},
	
	updateEnabled: function(){
		this.inherited(arguments);
	},
	
	getName: function(){
		return this.getProgram().name;
	},
	
	getTooltipHTML: function(btn){
		 
		var tooltip = dojo.create("div", { style: { 
			width: "180px",
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
		
		this.renderPrices(tooltip, true);	//use simple prices
		
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
