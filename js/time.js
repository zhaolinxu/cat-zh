dojo.declare("classes.managers.TimeManager", com.nuclearunicorn.core.TabManager, {
    game: null,

    /*
     * Amount of years skipped by CF time jumps
     */
    flux: 0,

    //should not be visible to player other than on time tab
    heat: 0,
    isAccelerated: false,   //do not save this flag or else!

    constructor: function(game){
        this.game = game;

		this.registerMeta("stackable", this.chronoforgeUpgrades, null);
		this.registerMeta("stackable", this.voidspaceUpgrades, null);
		this.setEffectsCachedExisting();
    },

    save: function(saveData){
       saveData["time"] = {
           timestamp: this.game.pauseTimestamp || Date.now(),
           flux: this.flux,
           heat: this.heat,
           cfu: this.filterMetadata(this.chronoforgeUpgrades, ["name", "val", "on", "heat", "isAutomationEnabled"]),
           vsu: this.filterMetadata(this.voidspaceUpgrades, ["name", "val", "on"])
       };
    },

    load: function(saveData){
        if (!saveData["time"]){
            return;
        }

        this.flux = saveData["time"].flux || 0;
        this.heat = saveData["time"].heat || 0;
		this.loadMetadata(this.chronoforgeUpgrades, saveData.time.cfu);
		this.loadMetadata(this.voidspaceUpgrades, saveData.time.vsu);

		if (saveData.time.usedCryochambers) { //after reset
			this.loadMetadata(this.voidspaceUpgrades, saveData.time.usedCryochambers);
		}

        if (this.getVSU("usedCryochambers").val > 0) {
			this.getVSU("usedCryochambers").unlocked = true;
        }

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

		// Update temporalFluxMax from values loaded
        this.game.updateCaches();
        this.game.resPool.update();

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

        this.flux = 0;
        this.heat = 0;

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
        if (this.isAccelerated && this.game.resPool.get("temporalFlux").value > 0){
            this.game.resPool.addResEvent("temporalFlux", -1);
        }
        if (!this.game.resPool.get("temporalFlux").value){
            this.isAccelerated = false;
        }

        this.heat += this.game.getEffect("heatPerTick");
        if (this.heat < 0){
            this.heat = 0;
        }

        for (var i in this.chronoforgeUpgrades) {
            var cfu = this.chronoforgeUpgrades[i];
            if (cfu.action) {
                cfu.action(cfu, this.game);
            }
        }
    },

	chronoforgeUpgrades: [{
        name: "temporalBattery",
        label: "Temporal Battery",
        description: "Improves your flux energy capacity by 25%",
        prices: [
            { name : "timeCrystal", val: 5 }
        ],
        effects: {
        	"temporalFluxMax": 750
        },
        priceRatio: 1.25,
        unlocked: true
    },{
        name: "blastFurnace",
        label: "Chrono Furnace",
        description: "Operates on chronoheat. Increases the maximum heat limit by 100. Can automatically shatter time crystals.",
        prices: [
            { name : "timeCrystal", val: 25 },
            { name : "relic", val: 5 }
        ],
        priceRatio: 1.25,
        effects: {
            "heatMax" : 100,
            "heatPerTick": -0.02
        },
        heat: 0,
        on: 0,
        isAutomationEnabled: true,
        action: function(self, game){

            if (self.on < self.val){
                self.on = self.val;
            }

            if (!self.on || !self.isAutomationEnabled){
                return;
            }

            self.heat -= game.getEffect("heatPerTick");
            if (self.heat > 100){
                self.heat -= 100;
                game.time.shatter();
            }
        },
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
        name: "temporalImpedance",
        label: "Time Impedance",
        description: "Suppress effect of Dark Future temporal penalty by 1000 years.",
        prices: [
            { name : "timeCrystal", val: 100 },
            { name : "relic", val: 250 }
        ],
        priceRatio: 1.05,
        effects: {
            "timeImpedance" : 1000
        },
        unlocked: false
    },{
        name: "ressourceRetrieval",
        label: "Resource Retrieval",
        description: "Retrieve part of your yearly resources when you shatter TC",
        prices: [
            { name : "timeCrystal", val: 1000 }
        ],
        priceRatio: 1.3,
        limitBuild: 100,
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
            { name : "timeCrystal", val: 2 },
            { name : "void", val: 100 },
            { name : "karma", val: 1 }
        ],
        priceRatio: 1.25,
        limitBuild: 0,
        breakIronWill: true,
        effects: {
			"maxKittens": 1
        },
        upgrades: {
			voidSpace: ["cryochambers"]
		},
        calculateEffects: function(self, game){
			self.limitBuild = game.bld.get("chronosphere").on;
			self.on = Math.min(self.val, self.limitBuild);
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
        limitBuild: 0,
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
			"temporalParadoxDay": 0,
			"energyConsumption": 0
        },
		calculateEffects: function(self, game){
			var effects = {
				"temporalParadoxDay": 1 + game.getEffect("temporalParadoxDayBonus")
			};
			effects["energyConsumption"] = 15;
			if (game.challenges.currentChallenge == "energy") {
				effects["energyConsumption"] *= 2;
			}
			self.effects = effects;
		},
		unlocks: {
			upgrades: ["turnSmoothly"]
		},
        unlocked: false
    }],

	effectsBase: {
		"temporalFluxMax": 60 * 10 * 5,  //10 minutes (5 == this.game.rate)
        "heatMax": 100,
        "heatPerTick" : -0.01
	},

    getCFU: function(id){
        return this.getMeta(id, this.chronoforgeUpgrades);
    },

    getVSU: function(id){
        return this.getMeta(id, this.voidspaceUpgrades);
    },

    shatter: function(amt){
        amt = amt || 1;

        var game = this.game;
        var cal = game.calendar;
        cal.day = 0;
        cal.season = 0;

        var tc = game.resPool.get("timeCrystal");
        if (amt > tc.value){
            amt = tc.value;
        }
        if (amt < 1){
            return;
        }

        for (var i = 0; i < amt; i++) {
            // Calendar
            cal.year+= 1;
            cal.onNewYear(i + 1 == amt);
            // Space ETA
            var routeSpeed = game.getEffect("routeSpeed") != 0 ? game.getEffect("routeSpeed") : 1;
            for (var j in game.space.planets){
                var planet = game.space.planets[j];
                if (planet.unlocked && !planet.reached){
                    planet.routeDays = Math.max(0, planet.routeDays - 400 * routeSpeed);
                }
            }
            // ShatterTC gain
            var shatterTCGain = game.getEffect("shatterTCGain");
            if (shatterTCGain > 0) {
                for (var j = 0; j < game.resPool.resources.length; j++){
                    var res = game.resPool.resources[j];
                    var valueAdd = game.getResourcePerTick(res.name, true) * ( 1 / game.calendar.dayPerTick * game.calendar.daysPerSeason * 4) * shatterTCGain;
                    game.resPool.addResEvent(res.name, valueAdd);
                }
            }
        }

        if (amt == 1) {
            game.msg("Time crystal destroyed, skipped one year");
        } else {
            game.msg("Time crystal destroyed, skipped " + amt + " years");
        }

        game.time.heat += amt*10;
        game.time.flux += amt;

        game.challenges.getChallenge("1000Years").unlocked = true;
        if (game.challenges.currentChallenge == "1000Years" && cal.year >= 1000) {
            game.challenges.researchChallenge("1000Years");
        }
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
		if (this.game.resPool.get("temporalFlux").value <= 0) {
			this.game.time.isAccelerated = false;
			this.game.resPool.get("temporalFlux").value = 0;
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

        UIUtils.attachTooltip(this.game, this.timeSpan, 0, 200, dojo.hitch(this, function(){
            var tooltip = "Temporal flux can be regenerated over time when game page is closed.";

            if (this.game.workshop.get("chronoforge").researched) {
                tooltip += "<br>Temporal heat is generated by Time Crystal shattering and decreases over time. Every 1 unit of heat over the limit will increase Time Crystal shattering price by 1%";
            }

            return tooltip;
        }));


        var btnsContainer = dojo.create("div", {style:{paddingTop:"20px"}}, div);
        this.inherited(arguments, [btnsContainer]);
    },

    update: function(){
        this.timeSpan.innerHTML = "Temporal Flux: " + this.game.resPool.get("temporalFlux").value.toFixed(0) + "/" + this.game.resPool.get("temporalFlux").maxValue;
        var second = this.game.resPool.get("temporalFlux").value / this.game.rate;
        if (second >= 1){
            this.timeSpan.innerHTML +=  " (" + this.game.toDisplaySeconds(second) + ")";
        }

        if (this.game.workshop.get("chronoforge").researched) {
            var heatMax = this.game.getEffect("heatMax");
            if(this.game.time.heat > heatMax){
                this.timeSpan.innerHTML += "<br>Heat: <span style='color:red;'>" + this.game.time.heat.toFixed(2) + "</span>/" + heatMax;
            } else {
                this.timeSpan.innerHTML += "<br>Heat: " + this.game.time.heat.toFixed(2) + "/" + heatMax;
            }
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

    getName: function() {
        var name = this.inherited(arguments);

        if (this.game.time.heat > this.game.getEffect("heatMax")){
            name += " (Overheat)";
        }
        return name;
    },

	getPrices: function() {
		var prices_cloned = $.extend(true, [], this.prices);

		for (var i = 0; i < prices_cloned.length; i++) {
			var price = prices_cloned[i];
            var impedance = this.game.getEffect("timeImpedance");
			if (price["name"] == "timeCrystal") {
                if (this.game.calendar.isDarkFuture()) {
                    price["val"] = 1 + ((this.game.calendar.year - 40000 - this.game.time.flux - impedance) / 1000) * 0.01;
                }
                var heatMax = this.game.getEffect("heatMax");
                if (this.game.time.heat > heatMax) {
                    price["val"] *= (1 + (this.game.time.heat - heatMax) * 0.01);  //1% per excessive heat unit
                }
			}
		}

		return prices_cloned;
	},

	getPricesMultiple: function(amt) {
		var pricesTotal = 0;

		var prices_cloned = $.extend(true, [], this.prices);

		for (var k = 0; k < amt; k++) {
			for (var i = 0; i < prices_cloned.length; i++) {
				var price = prices_cloned[i];
	            var impedance = this.game.getEffect("timeImpedance");
				if (price["name"] == "timeCrystal") {
					var priceLoop = price["val"];
	                if (this.game.calendar.isDarkFuture()) {
	                    priceLoop = 1 - ((this.game.calendar.year - 40000 - this.game.time.flux - impedance) / 1000) * 0.01;
	                }
	                var heatMax = this.game.getEffect("heatMax");
	                if ((this.game.time.heat + k * 10) > heatMax) {
	                    priceLoop *= (1 + (this.game.time.heat + k * 10 - heatMax));  //1% per excessive heat unit
	                }
					pricesTotal += priceLoop;
				}
			}
		}

		return pricesTotal;
	},

    doShatter: function(amt){
        this.game.time.shatter(amt);
    },

    /**
     * TODO: this is a horrible pile of copypaste, can we fix it somehow?
     */
    renderLinks: function(){
        var self = this;

        this.x5 = this.addLink("x5",
            function(){
                this.animate();

                var prices = this.getPricesMultiple(5);
                var hasRes = (prices <= this.game.resPool.get("timeCrystal").value);
                if (hasRes){
					this.game.resPool.addResEvent("timeCrystal", -prices);
                }

                this.doShatter(5);
                this.update();
            }, false
        );
    },

    update: function(){
        this.inherited(arguments);

        var prices = this.getPricesMultiple(5);
        var hasRes = (prices <= this.game.resPool.get("timeCrystal").value);

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

    getName: function(){
        var meta = this.getMetadata();
        if (meta.heat){
            return this.inherited(arguments) + " [" + meta.heat.toFixed(0) + "%]";
        }
        return this.inherited(arguments);
    }
});

dojo.declare("classes.ui.ChronoforgeWgt", [mixin.IChildrenAware, mixin.IGameAware], {
    constructor: function(game){
        this.addChild(new classes.ui.time.ShatterTCBtn({
            name: "Shatter TC",
            description: "Destroy time crystal and unleash the stored temporal energy.<bt> You will jump one year in the future. The price can increase over the time.",
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

	getName: function(){
		var meta = this.getMetadata();
		if (meta.name == "cryochambers" && meta.on != meta.val) {
			return meta.label + " ("+ meta.on + "/" + meta.val + ")";
		} else {
			return this.inherited(arguments);
		}
	},

	getPrices: function() {
		var prices = this.inherited(arguments);
		if (this.getMetadata().name == "cryochambers") {
			for (var i = 0; i < prices.length; i++) {
				if (prices[i].name == "karma") {
					prices[i].val -= prices[i].val * this.game.getHyperbolicEffect(0.01 * this.game.prestige.getBurnedParagonRatio(), 1.0);
				}
			}
		}
		return prices;
	}
});

dojo.declare("classes.ui.time.FixCryochamberBtn", com.nuclearunicorn.game.ui.ButtonModern, {
	hasResourceHover: true,

	onClick: function(){
		this.animate();

		if (this.enabled && this.hasResources()){
			this.payPrice();
			this.doFixCryochamber();
		}
	},

    doFixCryochamber: function(){
		var cry = this.game.time.getVSU("cryochambers");
		var usedCry = this.game.time.getVSU("usedCryochambers");
		if (this.game.workshop.get("chronoforge").researched && usedCry.val != 0) {
			usedCry.val -= 1;
			usedCry.on -= 1;
			cry.val += 1;
			cry.on += 1;
			if (usedCry.on == 0) {
				usedCry.unlocked = false;
			}
		}
    },

	getSelectedObject: function(){
		return {"prices": this.getPrices()};
	},

	updateVisible: function() {
		this.setVisible(this.game.workshop.get("chronoforge").researched && this.game.time.getVSU("usedCryochambers").val != 0);
	}
});

dojo.declare("classes.ui.VoidSpaceWgt", [mixin.IChildrenAware, mixin.IGameAware], {
    constructor: function(game){

		this.addChild(new classes.ui.time.FixCryochamberBtn({
            name: "Fix Cryochamber",
            description: "Tear the space-time to get back a cryochamber before it is used.",
            prices: [
				{name: "timeCrystal", val: 100},
				{name: "void", val: 500},
				{name: "temporalFlux", val: 3000},
            ]
        }, game));

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

        var msg = "Reseting the timeline will start the game from the scratch. You will keep all of your statistic and achievements. You may receive various game bonuses.<br>";
        msg += "<br>Resetting at this point will give you:<br>";

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

        if (this.game.ironWill){
            msg += "<br>Zebra hunters: " + this.game._getBonusZebras();
        }


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
