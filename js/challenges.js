dojo.declare("classes.managers.ChallengesManager", com.nuclearunicorn.core.TabManager, {

	constructor: function(game){
		this.game = game;
	},

    challenges:[/*{
		name: "atheism",
		title: "Atheism",
		description: "Your faith bonus will be permanently capped. Every level of transcendence will increase aprocrypha effectiveness by 10%."
            + "Your game will be reset in order to enable this challenge.",
        enabled: false
	}*/],

	game: null,

	resetState: function(){
		for (var i = 0; i < this.challenges.length; i++){
			var challenge = this.challenges[i];
			challenge.enabled = false;
		}
	},

	save: function(saveData){
		saveData.challenges = {
			challenges: this.filterMetadata(this.challenges, ["name", "enabled"])
		};
	},

	load: function(saveData){
		if (!saveData.challenges){
			return;
		}

		var self = this;

		if (saveData.challenges.challenges){
			this.loadMetadata(this.challenges, saveData.challenges.challenges, ["unlocked", "enabled"], function(loadedElem){
			});
		}
	},

	update: function(){

	},

	getEffect: function(name){
		//return this.getEffectCached(name);
		return this.getMetaEffect(name, { meta: this.challenges, provider: {
			getEffect: function(challenge, effectName){
				if (!perk.challenge || !challenge.enabled){
					return 0;
				}
				return challenge.effects[effectName];
			}
		}});
	},

	getChallenge: function(name){
		return this.getMeta(name, this.challenges);
	},
});

dojo.declare("classes.ui.ChallengeBtn", com.nuclearunicorn.game.ui.BuildingBtn, {

	perk: null,
	hasResourceHover: true,

	constructor: function(opts, game) {
	},

	getMetadata: function(){
		return this.getMeta();
	},

	getMeta: function(){
		if (!this.meta){
			this.meta = this.game.challenge.getChallenge(this.id);
		}
		return this.meta;
	},

	//what a disgrace
	getBuilding: function(){
		return this.getMeta();
	},

	getPrices: function(){
		var price = [{}];
		return price;
	},

	getName: function(){
		var meta = this.getMeta();
		if (meta.enabled){
			return meta.title + " (Complete)";
		} else {
			return meta.title;
		}
	},

	updateEnabled: function(){
		this.inherited(arguments);
		if (this.getMeta().enabled){
			this.setEnabled(false);
		}
	},

	updateVisible: function(){
		this.setVisible(true);
	},

	onClick: function(){
		this.animate();
		/*var perk = this.getPerk();
		if (this.enabled && this.game.science.get("metaphysics").researched && this.hasResources()){
			this.payPrice();
			this.game.paragonPoints -= perk.paragon;

			perk.researched = true;
			if (perk.handler){
				perk.handler(this.game);
			}

			this.update();
		}*/
        //TODO: enable and reset
	},

	getSelectedObject: function(){
		return {"prices": this.getPrices()};
	}
});

dojo.declare("classes.ui.ChallengePanel", com.nuclearunicorn.game.ui.Panel, {

	game: null,

	constructor: function(){
	},

    render: function(container){
		var content = this.inherited(arguments);
		var self = this;
		dojo.forEach(this.game.challenges.challenges, function(challenge, i){
			var button = new classes.ui.ChallengeBtn({
				id: 		challenge.name,
				name: 		challenge.title,
				description: challenge.description
			}, self.game);
			button.render(content);
			self.addChild(button);
		});

	}

});
