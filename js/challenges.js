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

	currentChallenge: null,

    challenges:[
    {
		name: "atheism",
		label: "Atheism",
		description: "Restart the game without faith bonus.",
		effectDesc: "Every level of transcendence will increase aprocrypha effectiveness by 10%.",
        researched: false,
        unlocked: false
	}],

	game: null,

	resetState: function(){
		for (var i = 0; i < this.challenges.length; i++){
			var challenge = this.challenges[i];
			challenge.enabled = false;
		}
		this.currentChallenge = null;
	},

	save: function(saveData){
		saveData.challenges = {
			challenges: this.filterMetadata(this.challenges, ["name", "researched", "unlocked"]),
			currentChallenge: this.currentChallenge
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
		if (saveData.challenges.currentChallenge){
			this.currentChallenge = saveData.challenges.currentChallenge;
		}
	},

	update: function(){

	},

	getChallenge: function(name){
		return this.getMeta(name, this.challenges);
	},
});

dojo.declare("classes.ui.ChallengeBtn", com.nuclearunicorn.game.ui.BuildingBtn, {
	metaCached: null, // Call getMetadata

	getMetadata: function(){
		if (!this.metaCached){
			this.metaCached = this.game.challenges.getChallenge(this.id);
		}
		return this.metaCached;
	},

	getDescription: function() {
		var start = this.inherited(arguments);
		if (this.getMetadata().researched) {
			return start + "<br /><br />Gain: " + this.getMetadata().effectDesc;
		} else {
			return start + "<br /><br />Your game will be reset in order to enable this challenge.";
		}
	},

	getName: function(){
		var meta = this.getMetadata();
		if (meta.name == this.game.challenges.currentChallenge) {
			return meta.label + " (Current)";
		} else if (meta.researched){
			return meta.label + " (Complete)";
		} else {
			return meta.label;
		}
	},

	getPrices: function() {
		return $.extend(true, [], this.getMetadata().prices); // Create a new array to keep original values
	},

	getSelectedObject: function(){
		return {"prices": this.getPrices()};
	},

	updateVisible: function(){
		this.setVisible(this.getMetadata().unlocked);
	},

	onClick: function(){
		if (this.getMetadata().name != this.game.challenges.currentChallenge && (this.enabled || this.game.devMode)){
			if (confirm("Are you sure you want to achieve this challenge by resseting the game ?")) {
				// Set the challenge for after reset
				this.game.challenges.currentChallenge = this.getMetadata().name;
				// Reset with any benefit of chronosphere (ressource, kittens, etc...)
				this.game.bld.get("chronosphere").val = 0;
				this.game.resetAutomatic();
			}
		} else {
			this.animate();
			return;
		}
	},

	updateEnabled: function(){
		this.inherited(arguments);
		if (this.getMetadata().researched){
			this.setEnabled(false);
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
