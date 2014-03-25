dojo.declare("com.nuclearunicorn.game.upgrades.WorkshopManager", null, {
	
});


dojo.declare("com.nuclearunicorn.game.ui.tab.Workshop", com.nuclearunicorn.game.ui.tab, {

	render: function(tabContainer){
		
		this.inherited(arguments);
	},
	
	constructor: function(tabName, game){
		var self = this;
		this.game = game;

		/*for (var i = 0; i < this.game.science.techs.length; i++){
			var tech = this.game.science.techs[i];

			var btn = this.createTechBtn(tech);
			
			if (!tech.unlocked || tech.researched){
				btn.setEnabled(false);
			}
			this.addButton(btn);
		}*/
	}
	
	/*createTechBtn: function(tech){
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
	}*/
});
