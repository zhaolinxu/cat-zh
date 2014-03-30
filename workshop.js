dojo.declare("com.nuclearunicorn.game.upgrades.WorkshopManager", null, {
	
	game: null,
	
	upgrades:[{
		name: "mineralAxes",
		title: "Mineral Axes",
		description: "Improved version of a stone axes providing permanent +50% wood production boost",
		effects: {
			"woodRatio" : 0.5
		},
		prices:[
			{ name : "science", val: 100 },
			{ name : "minerals", val: 500 }
		]
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
			
			/*if (!tech.unlocked || tech.researched){
				btn.setEnabled(false);
			}*/
			this.addButton(btn);
		}
	},
	
	createBtn: function(upgrade){
		var self = this;
		var btn = new com.nuclearunicorn.game.ui.UpgradeButton({
			name : upgrade.title,
			handler: function(btn){
				/*tech.researched = true;

				if (tech.unlocks && tech.unlocks.length){
					for (var i = 0; i < tech.unlocks.length; i++){
						var newTech = btn.getTechByName(tech.unlocks[i]);
						newTech.unlocked = true;
					}
				}
				
				if (tech.handler){
					tech.handler(self.game);
				}*/
				
			},
			prices: upgrade.prices,
			description: upgrade.description,
			upgrade: upgrade.name
		});
		return btn;
	}
});
