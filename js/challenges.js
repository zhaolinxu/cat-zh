dojo.declare("classes.managers.ChallengesManager", com.nuclearunicorn.core.TabManager, {

	constructor: function(game){
		this.game = game;
		this.registerMetaChallenges();
		this.setEffectsCachedExisting();
	},

	registerMetaChallenges: function() {
		this.registerMeta(this.challenges, { getEffect: function(challenge, effectName){
			return challenge.effects ? challenge.effects[effectName] * challenge.val : 0;
		}});
	},

    challenges:[{
		name: "atheism",
		label: "Atheism",
		description: "Every level of transcendence will increase aprocrypha effectiveness by 10%."
			+ "<br /> Your game will be reset in order to enable this challenge.",
        researched: false,
        unlocked: false
	}],

	game: null,

	resetState: function(){
		for (var i = 0; i < this.challenges.length; i++){
			var challenge = this.challenges[i];
			challenge.enabled = false;
		}
	},

	save: function(saveData){
		saveData.challenges = {
			challenges: this.filterMetadata(this.challenges, ["name", "researched", "unlocked"])
		};
	},

	load: function(saveData){
		if (!saveData.challenges){
			return;
		}

		var self = this;

		if (saveData.challenges.challenges){
			this.loadMetadata(this.challenges, saveData.challenges.challenges, ["researched", "unlocked"], function(loadedElem){
			});
		}
	},

	update: function(){

	},

	getChallenge: function(name){
		return this.getMeta(name, this.challenges);
	},
});

dojo.declare("classes.ui.ChallengeBtn", com.nuclearunicorn.game.ui.BuildingResearchBtn, {
	metaCached: null, // Call getMetadata

	getMetadata: function(){
		if (!this.metaCached){
			this.metaCached = this.game.challenges.getChallenge(this.id);
		}
		return this.metaCached;
	},

	getSelectedObject: function(){
		return {"prices": this.getPrices()};
	},

	updateVisible: function(){
		this.setVisible(this.getMetadata().unlocked);
	},

	onClick: function(){
		if (confirm("Are you sure you want to achieve this challenge by resseting the game ?")) {
			this.inherited(arguments);
			this.game.resetAutomatic();
		}
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
			var button = new classes.ui.ChallengeBtn({id: challenge.name}, self.game);
			button.render(content);
			self.addChild(button);
		});

	}

});
