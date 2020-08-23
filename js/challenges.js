dojo.declare("classes.managers.ChallengesManager", com.nuclearunicorn.core.TabManager, {

	constructor: function(game){
		this.game = game;
		this.registerMeta("stackable", this.challenges, null);
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
		repeatEffectDesc: $I("challendge.winterIsComing.repeatEffect.desc"),
		researched: false,
		unlocked: true
	},{
		name: "anarchy",
		label: $I("challendge.anarchy.label"),
		description: $I("challendge.anarchy.desc"),
		effectDesc: $I("challendge.anarchy.effect.desc"),
		repeatEffectDesc: $I("challendge.anarchy.repeatEffect.desc"),
		researched: false,
		unlocked: true
	},{
		name: "energy",
		label: $I("challendge.energy.label"),
		description: $I("challendge.energy.desc"),
		effectDesc: $I("challendge.energy.effect.desc"),
		repeatEffectDesc: $I("challendge.energy.repeatEffect.desc"),
        researched: false,
		unlocked: false,
		upgrades: {
			buildings: ["library", "biolab", "calciner", "oilWell", "factory", "accelerator", "chronosphere", "aiCore"],
			spaceBuilding: ["sattelite", "spaceStation", "moonOutpost", "moonBase", "orbitalArray", "containmentChamber"],
			voidSpace: ["chronocontrol"]
		},
		effects: {
			"challengeReward": -0.1
		}
	},{
		name: "atheism",
		label: $I("challendge.atheism.label"),
		description: $I("challendge.atheism.desc"),
		effectDesc: $I("challendge.atheism.effect.desc"),
		repeatEffectDesc: $I("challendge.atheism.repeatEffect.desc"),
		effects: {
			"solarRevolutionLimit": 1
		},
		calculateEffects: function(self, game) {
			self.effects["solarRevolutionLimit"] = game.religion.transcendenceTier;
		},
        researched: false,
        unlocked: false
	},{
		name: "1000Years",
		label: $I("challendge.1000Years.label"),
		description: $I("challendge.1000Years.desc"),
		effectDesc: $I("challendge.1000Years.effect.desc"),
		repeatEffectDesc: $I("challendge.1000Years.repeatEffect.desc"),
		researched: false,
		unlocked: false
	},{
		name: "blackSky",
		label: $I("challendge.blackSky.label"),
		description: $I("challendge.blackSky.desc"),
		effectDesc: $I("challendge.blackSky.effect.desc"),
		researched: false,
		unlocked: false
	}],

	game: null,

	resetState: function(){
		for (var i = 0; i < this.challenges.length; i++){
			var challenge = this.challenges[i];
			challenge.enabled = false;
			this.resetStateStackable(challenge);
		}
		this.currentChallenge = null;
	},

	save: function(saveData){
		saveData.challenges = {
			challenges: this.filterMetadata(this.challenges, [
				"name", 
				"researched", 	//deprecated
				"val", 
				"unlocked", 
				"active"		//if currently active or not
			])
		};
	},

	load: function(saveData){
		if (!saveData.challenges){
			return;
		}

		this.loadMetadata(this.challenges, saveData.challenges.challenges);

		//legacy saves compatibility mode
		var currentChallenge = saveData.challenges.currentChallenge;
		if (currentChallenge){
			this.getChallenge(currentChallenge).active = true;
		}
	},

	update: function(){
		// energy
		if (this.getChallenge("energy").unlocked == false) {
			if (this.game.resPool.energyProd != 0 || this.game.resPool.energyCons != 0) {
				this.getChallenge("energy").unlocked = true;
			}
		} 
		if (this.isActive("energy")) {
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
		} else if (this.isActive("anarchy")) {
			if (this.game.bld.get("aiCore").val > 0){
				this.researchChallenge("anarchy");
			}
		} else if (this.isActive("blackSky")) {
			if (this.game.space.getBuilding("spaceBeacon").val > 0) {
				this.researchChallenge("blackSky");
			}
		}

		// winterIsComing
		if (this.isActive("winterIsComing")) {
			if (this.game.space.getPlanet("helios").reached){
				this.researchChallenge("winterIsComing");
			}
		}


	},

	getChallenge: function(name){
		return this.getMeta(name, this.challenges);
	},

	/*
		returns true if challenge currently in progress
	*/
	isActive: function(name){
		return !!this.getChallenge(name).active;
	},

	researchChallenge: function(challenge) {
		if (this.isActive(challenge)){
			this.getChallenge(challenge).researched = true;
			this.getChallenge(challenge).active = false;
			this.game.msg($I("challendge.btn.log.message.on.complete", [this.getChallenge(challenge).label]));
			this.game.calculateAllEffects();
		}
	},

	/**
	 * Apply challenges marked by player as pending
	 */
	applyPending: function(){
		var game = this.game;
		game.ui.confirm(
			$I("challendge.btn.confirmation.title"), 
			$I("challendge.btn.confirmation.msg"), function() 
		{
			// Set the challenge for after reset
			for (var i = 0; i < this.game.challenges.challenges.length; i++){
				var challenge = this.game.challenges.challenges[i];
				if (challenge.pending){
					challenge.active = true;
				}
			}
			// Reset with any benefit of chronosphere (resources, kittens, etc...)

			game.bld.get("chronosphere").val = 0;
			game.bld.get("chronosphere").on = 0;
			game.time.getVSU("cryochambers").val = 0;
			game.time.getVSU("cryochambers").on = 0;

			game.resetAutomatic();
		}, function() {
		});
	},

	getEnergyMod: function() {
		return (
			this.isActive("energy") ? 2 : 1
		) * 
			this.getChallengeReward("energy");
	},

	//TODO: rewrite using the general getEffect logic

	/*getChallengeEffect: function(name, type) {
		var challenge = this.getChallenge(name);
		if (name == "energy") {
			return 2 + 0.1 * challenge.val;
		}
	},*/

	getChallengeReward: function(name){
		var challenge = this.getChallenge(name);
		return 1 + this.game.getLimitedDR(
			challenge.val * challenge.effects["challengeReward"], 
			challenge.effects["challengeRewardLimit"] || 1
		);
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
			var msgChronosphere = model.metadata.name == "ironWill" ? $I("challendge.btn.chronosphere.with.ironWill.desc") : $I("challendge.btn.chronosphere.desc");
		} else {
			var msgChronosphere = "";
		}
		return this.inherited(arguments) + $I("challendge.btn.desc", [model.metadata.effectDesc, msgChronosphere]) ;
	},

	getName: function(model){

		var meta = model.metadata;
		var name = meta.label;
		if (meta.active || meta.name == this.game.challenges.active) {
			name = $I("challendge.btn.name.current", [meta.label]);
		} else if (meta.researched){
			name = $I("challendge.btn.name.complete", [meta.label]);
		} 
		if (meta.pending){
			name += " (" + $I("challendge.pending") + ")";
		}
		return name;
	},

	updateVisible: function(model){
		model.visible = model.metadata.unlocked;
	},

	getPrices: function(model) {
		return $.extend(true, [], model.metadata.prices); // Create a new array to keep original values
	},

	buyItem: function(model, event, callback) {
		/*if (model.metadata.name == this.game.challenges.currentChallenge
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
		});*/

		this.togglePending(model);
	},

	togglePending: function(model){
		if (model.metadata.name == "ironWill") {
			return;
		}
		model.metadata.pending = !model.metadata.pending;
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

dojo.declare("classes.tab.ChallengesTab", com.nuclearunicorn.game.ui.tab, {
	render: function(container){
		this.challengesPanel = new classes.ui.ChallengePanel($I("challendge.panel.label"), this.game.challenges);
		this.challengesPanel.game = this.game;
		this.challengesPanel.render(container);

		//consition panel to be reviewed

		/*this.conditionsPanel = new classes.ui.ConditionPanel($I("challendge.condition.panel.label"), this.game.challenges);
		this.conditionsPanel.game = this.game;
		this.conditionsPanel.render(container);*/

		dojo.create("div", { style: {
				marginBottom: "15px"
		} }, container);

		var applyPendingBtn = new com.nuclearunicorn.game.ui.ButtonModern({
			name: $I("challendge.applyPending.label"),
			description: $I("challendge.applyPending.desc"),
			handler: dojo.hitch(this, function(){
				this.game.challenges.applyPending();
			}),
			controller: new com.nuclearunicorn.game.ui.ButtonController(this.game, {
				updateVisible: function (model) {
					model.visible = false;
					for (var i = 0; i < this.game.challenges.challenges.length; i++){
						if (this.game.challenges.challenges[i].pending){
							model.visible = true;
						}
					}
				}, 
				getName: function(){
					var numPending = 0;
					for (var i = 0; i < this.game.challenges.challenges.length; i++){
						if (this.game.challenges.challenges[i].pending){
							numPending++;
						}
					}
					return $I("challendge.applyPending.label", [numPending]);
				}
			})
		}, this.game);
		applyPendingBtn.render(container);
		this.applyPendingBtn = applyPendingBtn;
	},

	update: function(){
		this.challengesPanel.update();
		//this.conditionsPanel.update();
		this.applyPendingBtn.update();
	}
});
