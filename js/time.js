dojo.declare("classes.managers.TimeManager", com.nuclearunicorn.core.TabManager, {
    game: null,

    /*
     * Amount of years skipped by CF time jumps
     */
    flux: 0,
    isAccelerated: false,   //do not save this flag or else!

    constructor: function(game){
        this.game = game;

		this.registerMetaTime();
		this.setEffectsCachedExisting();
    },

    registerMetaTime: function() {
		this.registerMeta(this.chronoforgeUpgrades, { getEffect: function(bld, effectName){
			return (bld.effects) ? bld.effects[effectName] * bld.val : 0;
		}});

		this.registerMeta(this.voidspaceUpgrades, { getEffect: function(bld, effectName){
			return (bld.effects) ? bld.effects[effectName] * bld.val : 0;
		}});
    },

    save: function(saveData){
       saveData["time"] = {
           timestamp: this.game.pauseTimestamp || Date.now(),
           flux: this.flux,
           cfu: this.filterMetadata(this.chronoforgeUpgrades, ["name", "val", "on"]),
           vsu: this.filterMetadata(this.voidspaceUpgrades, ["name", "val", "on"]),
       };
    },

    load: function(saveData){
        if (!saveData["time"]){
            return;
        }

        this.flux = saveData["time"].flux || 0;

		if (saveData.time.usedCryochambers){ //after reset
				this.loadMetadata(this.voidspaceUpgrades, saveData.time.usedCryochambers, ["name", "val", "on"], function(loadedElem){
			});
		}
        if (saveData.time.cfu){
            this.loadMetadata(this.chronoforgeUpgrades, saveData.time.cfu, ["val", "on"], function(loadedElem){
            });
        }
        if (saveData.time.vsu){
            this.loadMetadata(this.voidspaceUpgrades, saveData.time.vsu, ["val", "on"], function(loadedElem){
            });
        }
        if (this.getVSU("usedCryochambers").val > 0) {
			this.getVSU("usedCryochambers").unlocked = true;
        }

        this.updateEnergyStats();

		this.gainTemporalFlux(saveData["time"].timestamp);
	},

	gainTemporalFlux: function (timestamp){
        if (!this.game.science.get("calendar").researched){
            return;
        }

        var now = Date.now();
        var delta = now - ( timestamp || 0 );
        if (delta <= 0){
            return;
        }

		var temporalAccelerator = this.getCFU("temporalAccelerator");
		var energyRatio = 1 + (temporalAccelerator.val * temporalAccelerator.effects["timeRatio"]);
		var temporalFluxGained = Math.round(delta / ( 60 * 1000 ) * (this.game.rate * energyRatio)); // 5 every 60 seconds

		var temporalFluxAdded = this.game.resPool.addResEvent("temporalFlux", temporalFluxGained);

		var bonusSeconds = Math.floor(temporalFluxAdded / this.game.rate);
        if (bonusSeconds > 0){
            this.game.msg("You have recharged " + bonusSeconds + " second"
				+ (bonusSeconds > 1 ? "s" : "") + " of temporal flux");
        }
    },

    resetState: function(){
		this.isAccelerated = false;

		for (var i = 0; i < this.chronoforgeUpgrades.length; i++) {
			var bld = this.chronoforgeUpgrades[i];
			this.resetStateStackable(bld, bld.isAutomationEnabled, bld.lackResConvert, bld.effects);
		}
		for (var i = 0; i < this.voidspaceUpgrades.length; i++) {
			var bld = this.voidspaceUpgrades[i];
			this.resetStateStackable(bld, bld.isAutomationEnabled, bld.lackResConvert, bld.effects);
		}
    },

    update: function(){
        this.updateEnergyStats();

        if (this.isAccelerated && this.game.resPool.get("temporalFlux").value > 0){
            this.game.resPool.addResEvent("temporalFlux", -1);
        }
        if (!this.game.resPool.get("temporalFlux").value){
            this.isAccelerated = false;
        }
    },

    updateEnergyStats: function(){
        this.game.resPool.get("temporalFlux").maxValue = Math.round(
            this.game.rate * 60 * 10
            * (1 + this.getCFU("temporalBattery").val * 0.25)
        );
    },

	chronoforgeUpgrades: [{
        name: "temporalBattery",
        label: "Temporal Battery",
        description: "Improves your flux energy capacity by 25%",
        prices: [
            { name : "timeCrystal", val: 5 }
        ],
        priceRatio: 1.25,
        unlocked: true
    },{
        name: "temporalAccelerator",
        label: "Temporal Accelerator",
        description: "Improves flux energy generation by 5%",
        prices: [
            { name : "timeCrystal", val: 10 },
            { name : "relic", val: 1000 }
        ],
        priceRatio: 1.25,
        effects: {
            "timeRatio" : 0.05
        },
        unlocked: true
    },{
        name: "ressourceRetrieval",
        label: "Resource Retrieval",
        description: "Retrieve part of your yearly resources when you shatter TC",
        prices: [
            { name : "timeCrystal", val: 1000 }
        ],
        priceRatio: 1.25,
        effects: {
            "shatterTCGain" : 0.01
        },
        unlocked: false
    }],

    voidspaceUpgrades: [{
        name: "cryochambers",
        label: "Cryochambers",
        description: "One kitten will live after reset.<br>You can have one cryochamber per chronosphere",
        prices: [
            { name : "void", val: 100 },
            { name : "timeCrystal", val: 2 },
            { name : "karma", val: 1 }
        ],
        priceRatio: 1.25,
        effects: {
			"maxKittens": 1
        },
        unlocked: false,
        flavor: "Board for the past"
    },{
        name: "usedCryochambers",
        label: "Used Cryochambers",
        description: "Those are unusable cryochambers...",
        prices: [

        ],
        priceRatio: 1.25,
        effects: {

        },
        unlocked: false
    },{
        name: "voidHoover",
        label: "Void Hoover",
        description: "Increase the maximum of void per days in Temporal Paradox",
        prices: [
			{ name: "timeCrystal", val: 10 },
			{ name: "void", val: 250 },
			{ name: "antimatter", val: 1000 }
        ],
        priceRatio: 1.25,
        effects: {
			"temporalParadoxVoid": 1
        },
        unlocked: false
    },{
        name: "chronocontrol",
        label: "Chronocontrol",
        description: "Increase the number of days in Temporal Paradox",
        prices: [
			{ name: "timeCrystal", val: 30 },
			{ name: "void", val: 500 },
			{ name: "temporalFlux", val: 3000}
        ],
        priceRatio: 1.25,
        effects: {
			"temporalParadoxDay": 1,
			"energyConsumption": 15
        },
		calculateEffects: function(self, game){
			self.effects = {
				"temporalParadoxDay": 1 + game.getEffect("temporalParadoxDayBonus"),
				"energyConsumption": 15
			};
		},
        unlocked: false
    }],

    getCFU: function(id){
        return this.getMeta(id, this.chronoforgeUpgrades);
    },

    getVSU: function(id){
        return this.getMeta(id, this.voidspaceUpgrades);
    }
});

dojo.declare("classes.ui.time.AccelerateTimeBtn", com.nuclearunicorn.game.ui.ButtonModern, {

    onClick: function() {
        this.animate();
        if (this.enabled) {
            this.toggle();
        }
    },

    getName: function(){
      return !this.game.time.isAccelerated ? "Tempus Fugit" : "Tempus Stasit";
    },

    toggle: function() {
		if (this.game.resPool.get("temporalFlux").value == 0) {
			this.game.time.isAccelerated = false;
		} else {
			this.game.time.isAccelerated = !this.game.time.isAccelerated;
		}
    }
});

dojo.declare("classes.ui.TimeControlWgt", [mixin.IChildrenAware, mixin.IGameAware], {
    constructor: function(game){
        this.addChild(new classes.ui.time.AccelerateTimeBtn({
            name: "Temporal Control",
            description: "Accelerate and slow time at your whim (+50% acceleration)",
            prices: []
        }, game));
    },

    render: function(container){
        var div = dojo.create("div", null, container);
        var timeSpan = dojo.create("span", null, div);

        this.timeSpan = timeSpan;

        var btnsContainer = dojo.create("div", {style:{paddingTop:"20px"}}, div);
        this.inherited(arguments, [btnsContainer]);
    },

    update: function(){
        this.timeSpan.innerHTML = "Temporal Flux: " + this.game.resPool.get("temporalFlux").value + "/" + this.game.resPool.get("temporalFlux").maxValue;
        if (this.game.resPool.get("temporalFlux").value != 0){
            this.timeSpan.innerHTML +=  " (" + this.game.toDisplaySeconds(this.game.resPool.get("temporalFlux").value / this.game.rate) + ")";
        }

        this.inherited(arguments);
    }
});

dojo.declare("classes.ui.time.ShatterTCBtn", com.nuclearunicorn.game.ui.ButtonModern, {
	hasResourceHover: true,

	onClick: function(){
		this.animate();

		if (this.enabled && this.hasResources()){
			this.payPrice();
			this.doShatter(1);
		}
	},

	getPrices: function() {
		var prices_cloned = $.extend(true, [], this.prices);

		for (var i = 0; i < prices_cloned.length; i++) {
			var price = prices_cloned[i];
			if (price["name"] == "timeCrystal") {
				var fluxBonus = Math.floor((this.game.calendar.year - this.game.time.flux) / 1000) / 100;
				price["val"] -= Math.min(fluxBonus, 0.4);
			}
		}

		return prices_cloned;
	},

    doShatter: function(amt){
        amt = amt || 1;

        var game = this.game;
        var cal = game.calendar;
        cal.day = 0;
        cal.season = 0;

        for (var i=0; i< amt; i++) {
            cal.year+= 1;
            cal.onNewYear();
        }

        if (amt == 1) {
            game.msg("Time crystal destroyed, skipped one year");
        } else {
            game.msg("Time crystal destroyed, skipped " + amt + " years");
        }

        game.time.flux += amt;

		var shatterTCGain = game.getEffect("shatterTCGain");
		if (shatterTCGain > 0) {
			for (var i = 0; i < game.resPool.resources.length; i++){
				var res = game.resPool.resources[i];
				var valueAdd = game.getResourcePerTick(res.name, true) * ( 1 / game.calendar.dayPerTick * game.calendar.daysPerSeason * 4) * shatterTCGain;
				game.resPool.addResEvent(res.name, valueAdd);
			}
		}
    },

    /**
     * TODO: this is a horrible pile of copypaste, can we fix it somehow?
     */
    renderLinks: function(){
        var self = this;

        this.x5 = this.addLink("x5",
            function(){
                this.animate();

                var prices = this.getPrices();
                var hasRes = (prices[0].val * 5 <= this.game.resPool.get("timeCrystal").value);
                if (hasRes){
					this.game.resPool.addResEvent("timeCrystal", -prices[0].val * 5);
                }

                this.doShatter(5);
                this.update();
            }, false
        );
    },

    update: function(){
        this.inherited(arguments);

        var prices = this.getPrices();
        var hasRes = (prices[0].val * 5 <= this.game.resPool.get("timeCrystal").value);

        if (this.x5) {
            dojo.setStyle(this.x5.link, "display", hasRes ? "" : "none");
        }
    },

	getSelectedObject: function(){
		return {"prices": this.getPrices()};
	}
});

/**
 * I wonder if we can get rid of such tremendous amounts of boilerplate code
 */

dojo.declare("classes.ui.time.ChronoforgeBtn", com.nuclearunicorn.game.ui.BuildingStackableBtn, {
    metaCached: null, // Call getMetadata

	getMetadata: function(){
        if (!this.metaCached){
            this.metaCached = this.game.time.getCFU(this.id);
        }
        return this.metaCached;
    },
});

dojo.declare("classes.ui.ChronoforgeWgt", [mixin.IChildrenAware, mixin.IGameAware], {
    constructor: function(game){
        this.addChild(new classes.ui.time.ShatterTCBtn({
            name: "Shatter TC",
            description: "Destroy time crystal and unleash the stored temporal energy.",
            prices: [{name: "timeCrystal", val: 1}],
            handler: function(btn){

            }
        }, game));

        for (var i in game.time.chronoforgeUpgrades){
            var meta = game.time.chronoforgeUpgrades[i];

            this.addChild(new classes.ui.time.ChronoforgeBtn({id: meta.name}, game));
        }

    },

    render: function(container){
        var div = dojo.create("div", null, container);

        var btnsContainer = dojo.create("div", {style:{paddingTop:"20px"}}, div);
        this.inherited(arguments, [btnsContainer]);
    },

    update: function(){
        this.inherited(arguments);
    }
});

dojo.declare("classes.ui.time.VoidSpaceBtn", com.nuclearunicorn.game.ui.BuildingStackableBtn, {
    metaCached: null, // Call getMetadata

	getMetadata: function(){
        if (!this.metaCached){
            this.metaCached = this.game.time.getVSU(this.id);
        }
        return this.metaCached;
    },
});

dojo.declare("classes.ui.VoidSpaceWgt", [mixin.IChildrenAware, mixin.IGameAware], {
    constructor: function(game){

        for (var i in game.time.voidspaceUpgrades){
            var meta = game.time.voidspaceUpgrades[i];
            this.addChild(new classes.ui.time.VoidSpaceBtn({id: meta.name}, game));
        }

    },

    render: function(container){
        var div = dojo.create("div", null, container);

        var btnsContainer = dojo.create("div", {style:{paddingTop:"20px"}}, div);
        this.inherited(arguments, [btnsContainer]);
    },

    update: function(){
        this.inherited(arguments);
    }
});

dojo.declare("classes.ui.ResetWgt", [mixin.IChildrenAware, mixin.IGameAware], {
    constructor: function(game){
        this.addChild(new com.nuclearunicorn.game.ui.ButtonModern({
            name: "Reset",
            description: "Reset current timeline.",
            prices: [],
            handler: function(btn){
                game.reset();
            }
        }, game));
    },

    render: function(container){
        var div = dojo.create("div", null, container);

        var btnsContainer = dojo.create("div", {style:{paddingTop:"20px"}}, div);
        this.inherited(arguments, [btnsContainer]);

        var resetDiv = dojo.create("div", {style:{paddingTop:"20px"}}, div);
        this.resetDiv = resetDiv;
    },

    update: function(){
        this.inherited(arguments);

        var msg = "Reseting the timeline will start the game from the scratch. You will keep all of your statistic and achievements.<br>";
        msg += "<br>Resetting at this point will also give you:<br>";

        var kittens = this.game.resPool.get("kittens").value;
        var stripe = 5;
        var karmaPointsPresent = this.game.getTriValue(this.game.karmaKittens, stripe);
        var karmaPointsAfter = this.game.getTriValue(this.game.karmaKittens + this.game._getKarmaKittens(kittens), stripe);
		var karmaPoints = Math.floor((karmaPointsAfter - karmaPointsPresent) *100)/100;
        var paragonPoints = 0;

        if (kittens > 70){
			paragonPoints = (kittens - 70);
		}

        msg += "Karma points: " + karmaPoints;
        msg += "<br>Paragon points: " + paragonPoints;


        this.resetDiv.innerHTML = msg;
    }
});

dojo.declare("classes.tab.TimeTab", com.nuclearunicorn.game.ui.tab, {

    container: null,

    constructor: function(tabName){
        var timePanel = new com.nuclearunicorn.game.ui.Panel("Time");
        this.addChild(timePanel);

        var timeWgt = new classes.ui.TimeControlWgt(this.game);
        timeWgt.setGame(this.game);
        timePanel.addChild(timeWgt);

        //--------- reset ----------

        this.resetPanel = new com.nuclearunicorn.game.ui.Panel("Reset");
        this.resetPanel.setVisible(true);
        this.addChild(this.resetPanel);

        var resetWgt = new classes.ui.ResetWgt(this.game);
        resetWgt.setGame(this.game);
        this.resetPanel.addChild(resetWgt);

        //--------------------------

        this.cfPanel = new com.nuclearunicorn.game.ui.Panel("Chronoforge");
        this.cfPanel.setVisible(false);
        this.addChild(this.cfPanel);

        var cforgeWgt = new classes.ui.ChronoforgeWgt(this.game);
        cforgeWgt.setGame(this.game);
        this.cfPanel.addChild(cforgeWgt);

        //add CF buttons

        //Shater TC
        //Crystal Hammer (better shattering effect)

        //--------------------------

        this.vsPanel = new com.nuclearunicorn.game.ui.Panel("Void Space");
        this.vsPanel.setVisible(false);
        this.addChild(this.vsPanel);

		var vsWgt = new classes.ui.VoidSpaceWgt(this.game);
        vsWgt.setGame(this.game);
        this.vsPanel.addChild(vsWgt);

    },

    render: function(content){
        this.container = content;

        this.inherited(arguments);
        this.update();
    },

    update: function(){
        this.inherited(arguments);

        var hasCF = this.game.workshop.get("chronoforge").researched;
        if (hasCF){
            this.cfPanel.setVisible(true);
        }

		var hasVS = (this.game.science.get("voidSpace").researched || this.game.time.getVSU("usedCryochambers").val > 0);
        if (hasVS){
            this.vsPanel.setVisible(true);
        }

    }
});
