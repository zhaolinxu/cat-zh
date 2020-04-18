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
		label: $I("challendge.ironWill.label"),
		description: $I("challendge.ironWill.desc"),
		effectDesc: $I("challendge.ironWill.effect.desc"),
        researched: false,
        unlocked: true
	},{
		name: "winterIsComing",
		label: $I("challendge.winterIsComing.label"),
		description: $I("challendge.winterIsComing.desc"),
		effectDesc: $I("challendge.winterIsComing.effect.desc"),
		researched: false,
		unlocked: true
	},{
		name: "anarchy",
		label: $I("challendge.anarchy.label"),
		description: $I("challendge.anarchy.desc"),
		effectDesc: $I("challendge.anarchy.effect.desc"),
		researched: false,
		unlocked: true
	},{
		name: "energy",
		label: $I("challendge.energy.label"),
		description: $I("challendge.energy.desc"),
		effectDesc: $I("challendge.energy.effect.desc"),
        researched: false,
		unlocked: false
	},{
		name: "atheism",
		label: $I("challendge.atheism.label"),
		description: $I("challendge.atheism.desc"),
		effectDesc: $I("challendge.atheism.effect.desc"),
        researched: false,
        unlocked: false
	},{
		name: "1000Years",
		label: $I("challendge.1000Years.label"),
		description: $I("challendge.1000Years.desc"),
		effectDesc: $I("challendge.1000Years.effect.desc"),
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
				(this.game.space.getBuilding("sattelite").val > 0 && this.game.workshop.get("solarSatellites").researched) &&
				this.game.space.getBuilding("sunlifter").val > 0 &&
				this.game.space.getBuilding("tectonic").val > 0 &&
				this.game.space.getBuilding("hrHarvester").val > 0
			) {
				this.researchChallenge("energy");
			}
		} else if (this.currentChallenge == "anarchy") {
			if (this.game.bld.get("aiCore").val > 0){
				this.researchChallenge("anarchy");
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
			this.game.msg($I("challendge.btn.log.message.on.complete", [this.getChallenge(challenge).label]));
			this.game.calculateAllEffects();
		}
	}
});

dojo.declare("classes.ui.ChallengeBtnController", com.nuclearunicorn.game.ui.BuildingBtnController, {

	getMetadata: function(model){
        if (!model.metaCached){
            model.metaCached = this.game.challenges.getChallenge(model.options.id);
        }
        return model.metaCached;
    },

    getDescription: function(model) {
		if (this.game.bld.get("chronosphere").val > 0) {
			var msgChronosphere = model.metadata.name == "ironWill" ? $I("challendge.btn.chronosphere.with.ironWill.desc"): $I("challendge.btn.chronosphere.desc");
		} else {
			var msgChronosphere = "";
		}
		return this.inherited(arguments) + $I("challendge.btn.desc", [model.metadata.effectDesc, msgChronosphere]) ;
	},

	getName: function(model){

		var meta = model.metadata;
		if (meta.name == this.game.challenges.currentChallenge) {
			return $I("challendge.btn.name.current", [meta.label]);
		} else if (meta.researched){
			return $I("challendge.btn.name.complete", [meta.label]);
		} else {
			return meta.label;
		}
	},

	updateVisible: function(model){
		model.visible = model.metadata.unlocked;
	},

	getPrices: function(model) {
		return $.extend(true, [], model.metadata.prices); // Create a new array to keep original values
	},

	buyItem: function(model, event, callback) {
		if (model.metadata.name == this.game.challenges.currentChallenge
		 || (!model.enabled && !this.game.devMode)) {
			callback(false);
			return;
		}

		var game = this.game;
		game.ui.confirm($I("challendge.btn.confirmation.title"), $I("challendge.btn.confirmation.msg"), function() {
			// Set the challenge for after reset
			game.challenges.currentChallenge = model.metadata.name == "ironWill"
				? null
				: model.metadata.name;
			// Reset with any benefit of chronosphere (resources, kittens, etc...)
			game.bld.get("chronosphere").val = 0;
			game.bld.get("chronosphere").on = 0;
			game.time.getVSU("cryochambers").val = 0;
			game.time.getVSU("cryochambers").on = 0;
			game.resetAutomatic();
			callback(true);
		}, function() {
			callback(false);
		});
	},

	updateEnabled: function(model){
		this.inherited(arguments);
		if (model.metadata.researched){
			model.enabled = false;
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
		var controller = new classes.ui.ChallengeBtnController(self.game);
		dojo.forEach(this.game.challenges.challenges, function(challenge, i){
			var button = new com.nuclearunicorn.game.ui.BuildingBtn({id: challenge.name, controller: controller}, self.game);
			button.render(content);
			self.addChild(button);
		});

	}

});
