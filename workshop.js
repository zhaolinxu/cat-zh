dojo.declare("com.nuclearunicorn.game.upgrades.WorkshopManager", null, {
	
	game: null,
	
	upgrades:[{
		name: "mineralAxes",
		title: "Mineral Axes",
		description: "Improved version of a stone axes providing permanent +50% wood production boost (NOT IMPLEMENTED YET)",
		effects: {
			"woodRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 100 },
			{ name : "minerals", val: 500 }
		],
		unlocked: true,
		researched: false,
		unlocks: ["ironAxes"],
		handler: function(game){
			//do nothing
		}
	},{
		name: "ironAxes",
		title: "Iron Axes",
		description: "Improved version of a stone axes providing permanent +20% wood production boost (NOT IMPLEMENTED YET)",
		effects: {
			"woodRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 200 },
			{ name : "iron", val: 200 },
		],
		unlocked: true,
		researched: false,
		handler: function(game){
			//do nothing
		}
	}],
	
	constructor: function(game){
		this.game = game;
	}
});

dojo.declare("com.nuclearunicorn.game.ui.UpgradeButton", com.nuclearunicorn.game.ui.button, {
	
});


dojo.declare("com.nuclearunicorn.game.ui.tab.Workshop", com.nuclearunicorn.game.ui.tab, {

	render: function(tabContainer){
		
		this.inherited(arguments);
	},
	
	constructor: function(tabName, game){
		var self = this;
		this.game = game;

		for (var i = 0; i < this.game.workshop.upgrades.length; i++){
			var uprgade = this.game.workshop.upgrades[i];

			var btn = this.createBtn(uprgade);
			
			if (!uprgade.unlocked || uprgade.researched){
				btn.setEnabled(false);
			}
			this.addButton(btn);
		}
	},
	
	createBtn: function(upgrade){
		var self = this;
		var btn = new com.nuclearunicorn.game.ui.UpgradeButton({
			name : upgrade.title,
			handler: function(btn){
				uprgade.researched = true;

				if (uprgade.unlocks && uprgade.unlocks.length){
					for (var i = 0; i < uprgade.unlocks.length; i++){
						//var newTech = btn.getTechByName(tech.unlocks[i]);
						//newTech.unlocked = true;
					}
				}
				
				if (uprgade.handler){
					uprgade.handler(self.game);
				}
				
			},
			prices: upgrade.prices,
			description: upgrade.description,
			upgrade: upgrade.name
		});
		return btn;
	}
});
