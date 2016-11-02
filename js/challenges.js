dojo.declare("classes.managers.ChallengesManager", com.nuclearunicorn.core.TabManager, {

	constructor: function(game){
		this.game = game;
		this.registerMeta("research", this.challenges, null);
		this.setEffectsCachedExisting();
	},

	currentChallenge: null,

    challenges:[
    {
		name: "ironWill",
		label: "Iron Will",
		description: "Iron Will is a bit hidden challenge and you don't need to click here to enable it: reset the game and play without kittens.",
		effectDesc: "Nothing",
        researched: false,
        unlocked: true
	},{
		name: "winterIsComing",
		label: "Winter Has Come",
		description: "Restart the game with only winter seasons.<br><br>Goal: Get to Helios.",
		effectDesc: "Weather is better overall.",
		researched: false,
		unlocked: true
	},{
		name: "anarchy",
		label: "Anarchy",
		description: "Restart the game with kittens acting their own way : kittens are lazy, always eat extra catnip and can't be assigned as leaders.<br><br>Goal: TBD.",
		effectDesc: "TBD",
		researched: false,
		unlocked: true
	},{
		name: "energy",
		label: "Energy",
		description: "Restart the game with consumption of energy multiply by 2.<br /><br />Goal: Unlock all energy production buildings and build at least one of them.",
		effectDesc: "Production bonuses cuts caused by negative energy are divided by 2.",
        researched: false,
		unlocked: false
	},{
		name: "atheism",
		label: "Atheism",
		description: "Restart the game without faith bonus.<br /><br />Goal: Reset with at least one cryochamber.",
		effectDesc: "Every level of transcendence will increase aprocrypha effectiveness by 10%.",
        researched: false,
        unlocked: false
	},{
		name: "1000Years",
		label: "1000 years",
		description: "Goal: Reach year 1000.",
		effectDesc: "TBD",
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

		this.loadMetadata(this.challenges, saveData.challenges.challenges);

		if (saveData.challenges.currentChallenge){
			this.currentChallenge = saveData.challenges.currentChallenge;
		}
	},

	update: function(){
		// energy
		if (this.getChallenge("energy").unlocked == false) {
			if (this.game.resPool.energyProd != 0 || this.game.resPool.energyCons != 0) {
				this.getChallenge("energy").unlocked = true;
			}
		} else if (this.currentChallenge == "energy") {
			if (
				(this.game.bld.get("pasture").val > 0 && this.game.bld.get("pasture").stage == 1) &&
				(this.game.bld.get("aqueduct").val > 0 && this.game.bld.get("aqueduct").stage == 1) &&
				this.game.bld.get("steamworks").val > 0 &&
				this.game.bld.get("magneto").val > 0 &&
				this.game.bld.get("reactor").val > 0 &&
				this.game.space.getBuilding("sattelite").val > 0 &&
				this.game.space.getBuilding("sunlifter").val > 0 &&
				this.game.space.getBuilding("tectonic").val > 0
			) {
				this.researchChallenge("energy");
			}
		}
		// winterIsComing
		if (this.currentChallenge == "winterIsComing") {
			if (this.game.space.getPlanet("helios").reached){
				this.researchChallenge("winterIsComing");
			}
		}
	},

	getChallenge: function(name){
		return this.getMeta(name, this.challenges);
	},

	researchChallenge: function(challenge) {
		if (challenge == this.currentChallenge){
			this.getChallenge(challenge).researched = true;
			this.currentChallenge = null;
			this.game.msg("Congratulations ! You achieve the challenge " + this.getChallenge(challenge).label + ".");
		}
	}
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
		if (this.game.bld.get("chronosphere").val > 0) {
			var msgChronosphere = " You won't gain reset bonus from chronospheres.";
			msgChronosphere += this.getMetadata().name == "ironWill" ? "<br />WARNING: the reset bonus from chronospheres will automatically disable IW." : "";
		} else {
			var msgChronosphere = "";
		}
		return this.inherited(arguments) + "<br />Gain: " + this.getMetadata().effectDesc + "<br /><br />Your game will be reset in order to enable this challenge." + msgChronosphere;
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
			if (confirm("Are you sure you want to start this challenge by resetting the game ?")) {
				// Set the challenge for after reset
				if (this.getMetadata().name == "ironWill") {
					this.game.challenges.currentChallenge = null;
				} else {
					this.game.challenges.currentChallenge = this.getMetadata().name;
				}
				// Reset with any benefit of chronosphere (ressource, kittens, etc...)
				this.game.bld.get("chronosphere").val = 0;
				this.game.bld.get("chronosphere").on = 0;
				this.game.time.getVSU("cryochambers").val = 0;
				this.game.time.getVSU("cryochambers").on = 0;
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
