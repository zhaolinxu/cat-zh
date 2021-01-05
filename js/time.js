dojo.declare("classes.managers.TimeManager", com.nuclearunicorn.core.TabManager, {
    game: null,

    /*
     * Amount of years skipped by CF time jumps
     */
    flux: 0,

    //should not be visible to player other than on time tab
    heat: 0,
    isAccelerated: false,

    timestamp: null,    /*NO FUCKING timestamp resources*/

    constructor: function(game){
        this.game = game;

		this.registerMeta("stackable", this.chronoforgeUpgrades, null);
		this.registerMeta("stackable", this.voidspaceUpgrades, null);
		this.setEffectsCachedExisting();
    },

    save: function(saveData) {
        saveData.time = {
            timestamp: this.game.pauseTimestamp || Date.now(),
            flux: this.flux,
            heat: this.heat,
            isAccelerated: this.isAccelerated,
            cfu: this.filterMetadata(this.chronoforgeUpgrades, ["name", "val", "on", "heat", "unlocked"]),
            vsu: this.filterMetadata(this.voidspaceUpgrades, ["name", "val", "on"])
        };
        this._forceChronoFurnaceStop(saveData.time.cfu);
    },

    _forceChronoFurnaceStop: function(cfuSave) {
        for (var i = 0; i < cfuSave.length; i++) {
            var upgrade = cfuSave[i];
            if (upgrade.name == "blastFurnace") {
                upgrade.isAutomationEnabled = false;
                return;
            }
        }
    },

    load: function(saveData){
        if (!saveData["time"]){
            return;
        }

        this.flux = saveData["time"].flux || 0;
        this.heat = saveData["time"].heat || 0;
        this.isAccelerated = saveData["time"].isAccelerated || 0;
		this.loadMetadata(this.chronoforgeUpgrades, saveData.time.cfu);
		this.loadMetadata(this.voidspaceUpgrades, saveData.time.vsu);

		this.getCFU("timeBoiler").unlocked = this.getCFU("blastFurnace").val > 0;

		if (saveData.time.usedCryochambers) { //after reset
			this.loadMetadata(this.voidspaceUpgrades, saveData.time.usedCryochambers);
		}

        if (this.getVSU("usedCryochambers").val > 0) {
			this.getVSU("usedCryochambers").unlocked = true;
        }

        //console.log("restored save data timestamp as", saveData["time"].timestamp);
        var ts = saveData["time"].timestamp || Date.now();

        this.gainTemporalFlux(ts);
        this.timestamp = ts;
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
		var temporalFluxGained = Math.round(delta / ( 60 * 1000 ) * (this.game.ticksPerSecond * energyRatio)); // 5 every 60 seconds

		var temporalFluxAdded = this.game.resPool.addResEvent("temporalFlux", temporalFluxGained);

		var bonusSeconds = Math.floor(temporalFluxAdded / this.game.ticksPerSecond);
        if (bonusSeconds > 0){
            this.game.msg($I("time.redshift.temporalFlux", [bonusSeconds]));
        }
    },

    resetState: function(){
		this.isAccelerated = false;

        this.timestamp = Date.now();
        this.flux = 0;
        this.heat = 0;

		for (var i = 0; i < this.chronoforgeUpgrades.length; i++) {
			var bld = this.chronoforgeUpgrades[i];
			this.resetStateStackable(bld);
		}
		for (var i = 0; i < this.voidspaceUpgrades.length; i++) {
			var bld = this.voidspaceUpgrades[i];
			this.resetStateStackable(bld);
		}
    },

    update: function(){
        if (this.isAccelerated && this.game.resPool.get("temporalFlux").value > 0){
            this.game.resPool.addResEvent("temporalFlux", -1);
        }
        if (!this.game.resPool.get("temporalFlux").value){
            this.isAccelerated = false;
        }

        //if we have spare chronoheat
        if (this.heat > 0) {
            var perTick = Math.min(this.game.getEffect("heatPerTick"), this.heat);
            this.getCFU("blastFurnace").heat += perTick;
            this.heat -= perTick;
            if (this.heat < 0) {
                this.heat = 0;
            }
        }

        for (var i in this.chronoforgeUpgrades) {
            var cfu = this.chronoforgeUpgrades[i];
            if (cfu.action) {
                cfu.action(cfu, this.game);
            }
        }
        this.calculateRedshift();
    },

    calculateRedshift: function(){
        var currentTimestamp = Date.now();
        var delta = this.game.opts.enableRedshift
            ? currentTimestamp - this.timestamp
            : 0;
        //console.log("redshift delta:", delta, "old ts:", this.timestamp, "new timestamp:", currentTimestamp);

        this.timestamp = currentTimestamp;
        if (delta <= 0){
            return;
        }
        var daysOffset = Math.round(delta / 2000);

        /*avoid shift because of UI lags*/
        if (daysOffset < 3){
           return;
        }

        var maxYears = this.game.calendar.year >= 1000 || this.game.resPool.get("paragon").value > 0 ? 40 : 10;
        var offset = this.game.calendar.daysPerSeason * this.game.calendar.seasonsPerYear * maxYears;

        //limit redshift offset by 1 year
        if (daysOffset > offset){
            daysOffset = offset;
        }

        //populate cached per tickValues
        this.game.resPool.update();
        this.game.updateResources();
        var resourceLimits = this.game.resPool.fastforward(daysOffset);

        var numberEvents = this.game.calendar.fastForward(daysOffset);
        this.game.bld.fastforward(daysOffset);
        this.game.workshop.fastforward(daysOffset);
        this.game.village.fastforward(daysOffset);
        this.game.space.fastforward(daysOffset);
        this.game.religion.fastforward(daysOffset);

        this.game.resPool.enforceLimits(resourceLimits);

         // Transfer chronoheat to the forge
        if (this.heat > 0) {								//if we have spare chronoheat
            var perTickHeatTransfer = this.game.getEffect("heatPerTick");
            var heatAttemptTransfer = daysOffset * this.game.calendar.ticksPerDay * perTickHeatTransfer;
            var heatTransfer = Math.min(this.heat, heatAttemptTransfer);

            var blastFurnace = this.getCFU("blastFurnace");
            blastFurnace.heat += heatTransfer;
            this.heat -= heatTransfer;

            // Shatter time crystals from the heated forge
            if (blastFurnace.on && blastFurnace.isAutomationEnabled && blastFurnace.heat >= 100){
                var amt = Math.floor(blastFurnace.heat / 100);
                blastFurnace.heat -= 100 * amt;
                this.shatter(amt);
            }
        }

        this.game.msg($I("time.redshift", [daysOffset]) + (numberEvents ? $I("time.redshift.ext",[numberEvents]) : ""));
    },

	chronoforgeUpgrades: [{
        name: "temporalBattery",
        label: $I("time.cfu.temporalBattery.label"),
        description: $I("time.cfu.temporalBattery.desc"),
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
        label: $I("time.cfu.blastFurnace.label"),
        description: $I("time.cfu.blastFurnace.desc"),
        prices: [
            { name : "timeCrystal", val: 25 },
            { name : "relic", val: 5 }
        ],
        priceRatio: 1.25,
        effects: {
            "heatPerTick": 0.02,
            "heatMax" : 100
        },
        calculateEffects: function(self, game) {
            self.effects["heatMax"] = 100 + game.getEffect("heatMaxExpansion");
        },
        heat: 0,
        on: 0,
        isAutomationEnabled: false,
        action: function(self, game) {
            self.calculateEffects(self, game);

            if (self.isAutomationEnabled == null) {
                self.isAutomationEnabled = false;
            }

            if (self.on < self.val){
                self.on = self.val;
            }

            if (!self.on || !self.isAutomationEnabled){
                return;
            }

            if (self.heat >= 100){
                var amt = Math.floor(self.heat / 100);
                if (amt > 5){
                    amt = 5; //limit calculations needed per tick
                }
                self.heat -= 100 * amt;
                game.time.shatter(amt);
            }
        },
		unlocks: {
			chronoforge: ["timeBoiler"]
		},
        unlocked: true
    },{
        name: "timeBoiler",
        label: $I("time.cfu.timeBoiler.label"),
        description: $I("time.cfu.timeBoiler.desc"),
        prices: [
            { name: "timeCrystal", val: 25000 }
        ],
        priceRatio: 1.25,
        effects: {
            "heatMaxExpansion": 10,
            "energyConsumption": 1
        },
        upgrades: {
            chronoforge: ["blastFurnace"]
        },
        // TODO Actually "action" is almost always just updating effects (unclear from the name), better separate the 2 concerns: update effects (can be done several times per tick) and perform specific action (only once per tick!)
        // TODO Separation of concerns currently done only for AI Core, Time Boilers and Hydroponics (REQUIRED by non-proportional effect!), will be systematized later
        updateEffects: function(self, game) {
            // TB #1: 10; Total:  10; Average: 10
            // TB #2: 30; Total:  40; Average: 20
            // TB #3: 50; Total:  90; Average: 30
            // TB #4: 90; Total: 160; Average: 40
            // etc.
            self.effects["heatMaxExpansion"] = 10 * self.on;
            self.effects["energyConsumption"] = self.on;
        },
        action: function(self, game) {
            self.updateEffects(self, game);
        },
        unlocked: false
    },{
        name: "temporalAccelerator",
        label: $I("time.cfu.temporalAccelerator.label"),
        description: $I("time.cfu.temporalAccelerator.desc"),
        prices: [
            { name : "timeCrystal", val: 10 },
            { name : "relic", val: 1000 }
        ],
        priceRatio: 1.25,
        effects: {
            "timeRatio" : 0.05
        },
        upgrades: {
            chronoforge: ["temporalImpedance"]
        },
        unlocked: true
    },{
        name: "temporalImpedance",
        label: $I("time.cfu.temporalImpedance.label"),
        description: $I("time.cfu.temporalImpedance.desc"),
        prices: [
            { name : "timeCrystal", val: 100 },
            { name : "relic", val: 250 }
        ],
        priceRatio: 1.05,
        effects: {
            "timeImpedance" : 1000
        },
        calculateEffects: function(self, game) {
            self.effects["timeImpedance"] = Math.round(1000 * (1 + game.getEffect("timeRatio")));
        },
        unlocked: false
    },{
        name: "ressourceRetrieval",
        label: $I("time.cfu.ressourceRetrieval.label"),
        description: $I("time.cfu.ressourceRetrieval.desc"),
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
        label: $I("time.vsu.cryochambers.label"),
        description: $I("time.vsu.cryochambers.desc"),
        prices: [
            { name : "karma", val: 1 },
            { name : "timeCrystal", val: 2 },
            { name : "void", val: 100 }
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
        flavor: $I("time.vsu.cryochambers.flavor")
    },{
        name: "usedCryochambers",
        label: $I("time.vsu.usedCryochambers.label"),
        description: $I("time.vsu.usedCryochambers.desc"),
        prices: [

        ],
        priceRatio: 1.25,
        limitBuild: 0,
        effects: {

        },
        unlocked: false
    },{
        name: "voidHoover",
        label: $I("time.vsu.voidHoover.label"),
        description: $I("time.vsu.voidHoover.desc"),
        prices: [
			{ name: "antimatter", val: 1000 },
			{ name: "timeCrystal", val: 10 },
			{ name: "void", val: 250 }
        ],
        priceRatio: 1.25,
        effects: {
			"temporalParadoxVoid": 1
        },
        unlocked: false
    },{
        name: "voidRift",
        label: $I("time.vsu.voidRift.label"),
        description: $I("time.vsu.voidRift.desc"),
        prices: [
            { name: "void", val: 75 }
        ],
        priceRatio: 1.3,
        effects: {
            "umbraBoostRatio": 0.1,
            "globalResourceRatio": 0.02
        },
        upgrades: {
            spaceBuilding: ["hrHarvester"]
        },
        unlocked: false
    },{
        name: "chronocontrol",
        label: $I("time.vsu.chronocontrol.label"),
        description: $I("time.vsu.chronocontrol.desc"),
        prices: [
			{ name: "temporalFlux", val: 3000},
			{ name: "timeCrystal", val: 30 },
			{ name: "void", val: 500 }
        ],
        priceRatio: 1.25,
        effects: {
			"temporalParadoxDay": 0,
			"energyConsumption": 15
        },
		calculateEffects: function(self, game){
			self.effects["temporalParadoxDay"] = 1 + game.getEffect("temporalParadoxDayBonus");
		},
		unlockScheme: {
			name: "vintage",
			threshold: 1
		},
		unlocks: {
			upgrades: ["turnSmoothly"]
		},
        unlocked: false
    },{
        name: "voidResonator",
        label: $I("time.vsu.voidResonator.label"),
        description: $I("time.vsu.voidResonator.desc"),
        prices: [
            { name: "timeCrystal", val: 1000 },
            { name: "relic", val: 10000 },
            { name: "void", val: 50 }
        ],
        priceRatio: 1.25,
        effects: {
            "voidResonance" : 0.1
        },
        unlocked: false
    }],

	effectsBase: {
		"heatPerTick" : 0.01,
		"heatMax": 100,
		"temporalFluxMax": 60 * 10 * 5  //10 minutes (5 == this.game.ticksPerSecond)
	},

    getCFU: function(id){
        return this.getMeta(id, this.chronoforgeUpgrades);
    },

    getVSU: function(id){
        return this.getMeta(id, this.voidspaceUpgrades);
    },

    shatter: function(amt) {
        if (game.opts.fastShatter){
            this.fastShatter(amt);
        } else {
            this.originShatter(amt);
        }
    },

    fastShatter: function(amt) {
        // fast shatter
        amt = amt || 1;

        var game = this.game;
        var cal = game.calendar;

        var shatterTCGain = game.getEffect("shatterTCGain") * (1 + game.getEffect("rrRatio"));
        var aiApocalypseLevel = 0;
        var aiLevel = this.game.bld.get("aiCore").effects["aiLevel"];
        if (aiLevel > 14 && (this.game.science.getPolicy("transkittenism").researched != true)){
			var aiApocalypseLevel = aiLevel - 14;
		}
        var destroyRatio = aiApocalypseLevel * 0.01;

        var daysPerYear = cal.daysPerSeason * cal.seasonsPerYear;
        var ticksPerYear = daysPerYear * cal.ticksPerDay;
        var ticksPerCycle = ticksPerYear * cal.yearsPerCycle;
        var yearsPerEra = cal.yearsPerCycle * cal.cyclesPerEra;

        var firstCycle = cal.cycle;
        var firstCycleYear = cal.cycleYear;
        var firstYear = cal.year;
        var finalYear = firstYear + amt;
        var remainingYearsInFirstCycle = cal.yearsPerCycle - firstCycleYear;
        var remainingDaysInFirstYear = cal.daysPerSeason * (cal.seasonsPerYear - cal.season) - cal.day;
        var remainingTicksInFirstYear = remainingDaysInFirstYear * cal.ticksPerDay;
        var totalDays = remainingDaysInFirstYear + (amt - 1) * daysPerYear;
        var totalTicks = totalDays * cal.ticksPerDay;
        if (amt < remainingYearsInFirstCycle) { // not cross cycle
            var finalCycle = firstCycle;
            var finalCycleYear  = firstCycleYear + amt;
        } else { // cross cycle
            var remainingYearsLastEra = (amt - remainingYearsInFirstCycle) % yearsPerEra;
            var remainingCycles = Math.floor(remainingYearsLastEra / cal.yearsPerCycle);
            // incomplete cycle in last era
            var finalCycle = (firstCycle + remainingCycles + 1) % cal.cyclesPerEra;
            var finalCycleYear = remainingYearsLastEra % cal.yearsPerCycle;
        }
        var _1000years = Math.floor((cal.year + amt) / 1000) - Math.floor(cal.year / 1000);


        cal.day = 0;
        cal.season = 0;

        // ShatterTC gain
        if (shatterTCGain > 0) {
            // ===================================================================================================
            //
            // First, the fast shatter calculates the total years of each cycle and builds a cache of resource production for each cycle.
            // Then the fast shatter will first try the FAST MODE:
            //   multiply the production cache and the total year to obtain the final resource amount.
            //   If the final resource amount is not negative, the attempt is considered successful, otherwise it enters the SLOW MODE.
            //   If the fast shatter is successful and have AI apocalypse, the function will try to FAST AI:
            //     if a resource has a maximum value and the annual production is greater than the maximum value that AI can destroy:
            //       only calculate the last year of AI destruction
            //     Otherwise(no maximum or the annual production is not greater than AI can destroy)
            //       the function will recalculate this resource from the first year.
            //     If a negative value appears during the calculation, it also enters the SLOW MODE.
            // SLOW MODE:
            //   SLOW MODE calculation will first try WHOLE CYCLE MODE: calculate whole cycle at a time.
            //   If AI apocalypse, or a negative value appears during the calculation, WHOLE CYCLE MODE failed. then enter YEAR BY YEAR MODE
            //   YEAR BY YEAR MODE:
            //     Calculate production year by year.
            //     if the positive and negative of resources change, the cache will be updated in the next year's calculation
            // 
            //
            // copy from origin shatter function:
            //   XXX Partially duplicates resources#fastforward and #enforceLimits, some nice factorization is probably possible
            //   
            // ===================================================================================================


            var remainingYears = amt;
            var resourcesLimit = [];

            // var productionPerTickInCycle = {};
            //  productionPerYearInCycle
            var prodPYInCycle = {}; // gen per tick {cycle id: [resources production per year], }
            // var prodPYEnginnerCache = {}; // { resource name: prodution, }
            // var prodPYEnginner = {}; // { resource name: [production, {price name: price, }], }
            var resourcesIndexTable = {}; // {name: index}
            var yearsInCycles1000Years = [{}];
            var update = function(dict, key, value) {if (key in dict) {dict[key] += value} else {dict[key] = value}};

            var fakeCal = {
                year: firstYear,
                cycle: firstCycle,
                cycleYear: firstCycleYear
            }
            var fakeUpdateCycle = function(years) {
                fakeCal.year += years;
                fakeCal.cycleYear += years;
                if (fakeCal.cycleYear >= cal.yearsPerCycle) {
                    // new cycle
                    fakeCal.cycle += Math.floor(fakeCal.cycleYear / cal.yearsPerCycle);
                    fakeCal.cycleYear %= cal.yearsPerCycle
                    if (fakeCal.cycle >= cal.cyclesPerEra) {
                        fakeCal.cycle %= cal.cyclesPerEra;
                    }
                }
            }
            


            // =========================================================================================
            // calculates the total years of each cycle
            // =========================================================================================


            if (_1000years) {

                // first 1000-year
                var remainingYears1000 = 1000 - (cal.year % 1000);
                var yearsInCycles = yearsInCycles1000Years[0];

                var remainingYearsLastEra1000 = (remainingYears1000 - remainingYearsInFirstCycle) % yearsPerEra;
                var remainingCycles1000 = Math.floor(remainingYearsLastEra1000 / cal.yearsPerCycle);
                var finalCycle1000 = (firstCycle + remainingCycles1000 + 1) % cal.cyclesPerEra;
                var finalCycleYear1000 = remainingYearsLastEra1000 % cal.yearsPerCycle;
                
                // this code appear three times. I try writing as a function, but it need too many arguments...
                if (remainingYears1000 < remainingYearsInFirstCycle) { // not cross cycle
                    yearsInCycles[firstCycle] = remainingYears1000 - 1;
                } else { // cross cycle
                    // full eras
                    var eras = Math.floor((remainingYears1000 - remainingYearsInFirstCycle) / yearsPerEra);
                    for (var i = 0; i < cal.cyclesPerEra; i++) {
                        yearsInCycles[i] = eras * cal.yearsPerCycle;
                    }
    
                    // incomplete era
                    // first cycle
                    update(yearsInCycles, firstCycle, remainingYearsInFirstCycle - 1); // exclude first year
                    // full cycles in last era
                    for (var i = 0; i < remainingCycles1000; i++) {
                        update(yearsInCycles, (firstCycle + i + 1) % cal.cyclesPerEra, cal.yearsPerCycle);
                    }
                    // incomplete cycle in last era
                    update(yearsInCycles, finalCycle1000, finalCycleYear1000);
                }

                // full 1000-years
                if (_1000years > 1) {
                    var commonData = {};
                    var yearsPerCycle1000 = 1000 / yearsPerEra * cal.yearsPerCycle;
                    for (var i = 0; i < cal.cyclesPerEra; i++) {
                        commonData[i] = yearsPerCycle1000;
                    }
                    for (var i = 0; i < _1000years-1; i++) {
                        yearsInCycles1000Years.push(commonData); // ro
                    }
                }

                // last 1000-year
                var remainingYears1000 = (cal.year + amt) % 1000;

                var remainingYearsInFirstCycle1000 = cal.yearsPerCycle - finalCycleYear1000;

                var remainingYearsLastEra1000 = (remainingYears1000 - remainingYearsInFirstCycle1000) % yearsPerEra;
                var remainingCycles1000 = Math.floor(remainingYearsLastEra1000 / cal.yearsPerCycle);
                var firstCycle1000 = finalCycle1000;
                var finalCycle1000 = (firstCycle1000 + remainingCycles1000 + 1) % cal.cyclesPerEra;
                var finalCycleYear1000 = remainingYearsLastEra1000 % cal.yearsPerCycle;

                yearsInCycles1000Years.push({});
                var yearsInCycles = yearsInCycles1000Years[yearsInCycles1000Years.length-1];
                if (remainingYears1000 < remainingYearsInFirstCycle1000) { // not cross cycle
                    yearsInCycles[firstCycle1000] = remainingYears1000;
                } else { // cross cycle
                    // full eras
                    var eras = Math.floor((remainingYears1000 - remainingYearsInFirstCycle1000) / yearsPerEra);
                    for (var i = 0; i < cal.cyclesPerEra; i++) {
                        yearsInCycles[i] = eras * cal.yearsPerCycle;
                    }

                    // incomplete era
                    // first cycle
                    update(yearsInCycles, firstCycle1000, remainingYearsInFirstCycle1000);
                    // full cycles in last era
                    for (var i = 0; i < remainingCycles1000; i++) {
                        update(yearsInCycles, (firstCycle1000 + i + 1) % cal.cyclesPerEra, cal.yearsPerCycle);
                    }
                    // incomplete cycle in last era
                    update(yearsInCycles, finalCycle1000, finalCycleYear1000);
                }
            } else {
                var yearsInCycles = yearsInCycles1000Years[0];
                
                if (remainingYears < remainingYearsInFirstCycle) { // not cross cycle
                    yearsInCycles[firstCycle] = remainingYears - 1;
                } else { // cross cycle
                    // full eras
                    var eras = Math.floor((remainingYears - remainingYearsInFirstCycle) / yearsPerEra);
                    for (var i = 0; i < cal.cyclesPerEra; i++) {
                        yearsInCycles[i] = eras * cal.yearsPerCycle;
                    }
    
                    // incomplete era
                    // first cycle
                    update(yearsInCycles, firstCycle, remainingYearsInFirstCycle - 1); // exclude first year
                    // full cycles in last era
                    for (var i = 0; i < remainingCycles; i++) {
                        update(yearsInCycles, (firstCycle + i + 1) % cal.cyclesPerEra, cal.yearsPerCycle);
                    }
                    // incomplete cycle in last era
                    update(yearsInCycles, finalCycle, finalCycleYear);
                }
            }

            // =========================================================================================
            // build production cache
            // =========================================================================================

            
            // enginner craft production cache

            // now only paragon will get per 1000y, and paragon have no effect for enginner craft
            // so craft cache will not refresh when 1000y passby
            // var maxCraftPerYear = {};
            // var maxCraftFirstYear = {};
            // var craftRelate = {}; // {resource name: [related resources]}
            // for (var i in this.game.workshop.crafts) {
            //     var craft = this.game.workshop.crafts[i]
            //     if (craft.value > 0) {
            //         craftRelate[craft.name] = [];
            //         var unitsPerTick = this.game.workshop.getEffectEngineer(craft.name, false) * shatterTCGain;
            //         var unitsPerYear = unitsPerTick * ticksPerYear;
            //         maxCraftPerYear[craft.name] = unitsPerYear;
            //         var unitsFirstYear = unitsPerTick * remainingTicksInFirstYear;
            //         maxCraftFirstYear[craft.name] = unitsFirstYear;
            //         var ratio = this.game.getResCraftRatio(craft.name);
            //         prodPYEnginner[craft.name] = [ratio, {}];
            //         for (var j in craft.prices) {
            //             price = craft.prices[j];
            //             craftRelate[craft.name].push(price.name);
            //             prodPYEnginner[craft.name][1][price.name] = price.val;
            //         }
            //     }
            // }

            // total production cache
            var resCache = []; // use for restore resources when fast mode failed
            var firstLoop = true;
            var prodFirstYear = [];
            var cycles = Object.keys(yearsInCycles).length;
            // var plog={};
            for (var x = 0; x < cycles; x++) {
                var currentCycle = cal.cycle;
                prodPYInCycle[currentCycle] = [];
                var resPerYear = cal.getProductionPerYear();
                for (var i = 0; i < this.game.resPool.resources.length; i++) {
                    var res = this.game.resPool.resources[i];
                    var productionPerTick = this.game.getResourcePerTick(res.name, true) * shatterTCGain;
                    var productionPerYear = productionPerTick * ticksPerYear;
                    var specialProduction = (res.name in resPerYear) ? resPerYear[res.name] : 0
                    var totalProduction = productionPerYear + specialProduction
                    prodPYInCycle[currentCycle].push(totalProduction);
                    if (firstLoop) {
                        prodFirstYear.push(productionPerTick * remainingTicksInFirstYear + specialProduction);
                        resourcesIndexTable[res.name] = i;
                        resCache.push(res.value);
                        resLimit = Math.max(res.value, res.maxValue || Number.POSITIVE_INFINITY);
                        resourcesLimit.push(resLimit);
                    }
                    // if (i==17){
                    //     var index = this.game.resPool.get('paragon').value +' '+currentCycle;
                    //     if (plog[index]) {
                    //
                    //     } else {
                    //         plog[index]=''+totalProduction+' '+this.game.getDetailedResMap(this.game.resPool.get('starchart'));
                    //     }
                    // }
                }
                cal.updateCycle(cal.yearsPerCycle); // we will set right cycle in the end
                firstLoop = false;
            }
            // console.log(plog);

            var refreshCycleProduction = function(cycle, refreshLimit=false) {
                cal.cycle = cycle;
                cal.updateCycle(0, true);
                var resPerYear = cal.getProductionPerYear();
                for (var i = 0; i < this.game.resPool.resources.length; i++) {
                    var res = this.game.resPool.resources[i];
                    var productionPerTick = this.game.getResourcePerTick(res.name, true) * shatterTCGain;
                    var productionPerYear = productionPerTick * ticksPerYear;
                    var specialProduction = (res.name in resPerYear) ? resPerYear[res.name] : 0
                    var totalProduction = productionPerYear + specialProduction
                    // if (i==17){
                    //     var index = this.game.resPool.get('paragon').value +' '+cycle;
                    //     if (plog[index]) {

                    //     } else {
                    //         plog[index]=''+totalProduction+' '+this.game.getDetailedResMap(this.game.resPool.get('starchart'));
                    //     }
                    // }
                    prodPYInCycle[cycle][i] = totalProduction;

                    // caps will not update during shatter
                    // if (refreshLimit) {
                    //     resLimit = Math.max(res.value, res.maxValue || Number.POSITIVE_INFINITY);
                    //     resourcesLimit[i] = resLimit;
                    // }
                }
            }
            var refreshEraProduction = function() {
                for (var i = 0; i < cal.cyclesPerEra; i++) {
                    refreshCycleProduction(i, i==0);
                }
            }

            // var fastEnginnerCraft = function (resName, resPool, maxTimes) {
            //     var craft = prodPYEnginner[resName];
            //     var prod = craft[0];
            //     var swt = typeof(resPool[0].value) === 'undefined';

            //     var prodIndex = resourcesIndexTable[resName];
            //     if (swt) {
            //         var units = (resourcesLimit[prodIndex] - resPool[prodIndex]) / prod;
            //     } else {
            //         var units = (resourcesLimit[prodIndex] - resPool[prodIndex].value) / prod;
            //     }
            //     if (units == 0)
            //         return;

            //     var prices = craft[1];
            //     for (var priceName in prices) {
            //         var price = prices[priceName];
            //         var priceIndex = resourcesIndexTable[priceName];
            //         units = Math.min((resPool[priceIndex].value || resPool[priceIndex]) / price, units);
            //     }
            //     units = Math.min(Math.floor(units), maxTimes);

            //     if (units) {
            //         if (swt) {
            //             resPool[prodIndex] += prod * units;
            //         } else {
            //             resPool[prodIndex].value += prod * units;
            //         }
            //         for (var priceName in prices) {
            //             var price = prices[priceName];
            //             var resIndex = resourcesIndexTable[priceName];
            //             if (swt) {
            //                 resPool[resIndex] -= price * units
            //             } else {
            //                 resPool[resIndex].value -= price * units
            //             }
            //         }
            //     }
            // };
            // var fastEnginnerCraftAll = function (resPool, maxTimesFunc) {
            //     for (var resName in prodPYEnginner) {
            //         fastEnginnerCraft(resName, resPool, maxTimesFunc(resName));
            //     }
            // };


            // ============================================================================
            // calc total produtcions
            // ============================================================================

            var cacheInvalide = false;

            // var successed = (function fastCalc(){
            var successed;
            FAST_MODE:
            {
                // try run in FAST MODE

                // first year remaining days
                for (var i in prodFirstYear) {
                    var res = this.game.resPool.resources[i];
                    // var productionEnginner = (i in prodFirstYearEnginner) ? prodFirstYearEnginner[i] : 0;
                    res.value += prodFirstYear[i]; // + productionEnginner;
                    // res.value = Math.min(res.value, resourcesLimit[i]);
                }

                // full years
                for (var _1000Index in yearsInCycles1000Years) {
                    for (var resourceIndex in resCache) {
                        var res = this.game.resPool.resources[resourceIndex];
                        for (var cycleIndex in yearsInCycles1000Years[_1000Index]) {
                            res.value += prodPYInCycle[cycleIndex][resourceIndex] * yearsInCycles1000Years[_1000Index][cycleIndex];
                            // if (res.value > resourcesLimit[resourceIndex]) {
                            //     res.value = resourcesLimit[resourceIndex];
                            //     break;
                            // }
                            if (res.value < 0) {
                                // failed
                                // back to slow mode
                                successed = false;
                                break FAST_MODE;
                                // return false;
                            }
                        }
                    }

                    if (_1000Index + 1 != yearsInCycles1000Years.length) {
                        // this 1000 year is end
                        cal.onNew1000YearAddResources();
                        // refresh perTickCached
                        // game.updateResources();
                        refreshEraProduction();
                        cacheInvalide = true;
                    }
                }
                // console.log(plog);
                
                // enginner craft
                // fastEnginnerCraftAll(this.game.resPool.resources, function (x) { return (amt-1)*maxCraftPerYear[x] + maxCraftFirstYear[x] });
                if (this.game.workshop.get("chronoEngineers").researched) {
                    this.game.workshop.craftByEngineers(totalTicks * shatterTCGain);
                }
                for (var resourceIndex in resCache) {
                    var res = this.game.resPool.resources[resourceIndex];
                    if (res.value > resourcesLimit[resourceIndex]) {
                        res.value = resourcesLimit[resourceIndex];
                    }
                }
                successed = true;
                //return true;
            }//)();

            if (aiApocalypseLevel && successed) {

                // filter resources aiCanDestroy
                var recalcList = [];
                for (var i in resCache) {
                    var res = this.game.resPool.resources[i];
                    if (res.aiCanDestroy) {
                        if (res.maxValue) {
                            for (var cycleIndex in prodPYInCycle) {
                                if (prodPYInCycle[cycleIndex][i] < res.maxValue * destroyRatio) {
                                    recalcList.push(i);
                                    // for (var j in craftRelate[res.name]) {
                                    //     var index = resourceIndex[craftRelate[res.name][j]]
                                    //     if (!(index in recalcList)) {
                                    //         recalcList.push(index);
                                    //     }
                                    // }
                                    break;
                                }
                            }
                            if (!(i in recalcList)) {
                                res.value -= res.value * destroyRatio;
                            }
                        } else {
                            // unlimited resources
                            recalcList.push(i);
                        }
                    }
                }

                
                // var currentYear = firstYear;
                // var resCache2 = resCache.slice();
                var firstLoop = true;

                if (_1000years) {
                    // restore paragon
                    var restoreList = cal.getProductionPer1000Year();
                    for (var resName in restoreList) {
                        var resIndex = resourcesIndexTable[resName];
                        this.game.resPool.resources[resIndex].value = resCache[resIndex].value;
                    }
                    refreshEraProduction();
                }

                FastAI:
                while (fakeCal.year < finalYear) {
                    var currentCycle = fakeCal.cycle;
                    for (var i in recalcList) {
                        var resourceIndex = recalcList[i];
                        var res = this.game.resPool.resources[resourceIndex];
                        if (firstLoop) {
                            res.value = Math.min(resCache[resourceIndex] + prodFirstYear[resourceIndex], resourcesLimit[resourceIndex]);
                        } else {
                            res.value += prodPYInCycle[currentCycle][resourceIndex];
                            res.value = Math.min(res.value, resourcesLimit[resourceIndex]);
                        }
                        // if (res.name in prodPYEnginner) {
                        //     fastEnginnerCraft(
                        //         res.name,
                        //         this.game.resPool.resources,
                        //         maxCraftPerYear[res.name]
                        //     );
                        // }
                        res.value -= res.value * destroyRatio;
                        if (res.value <= 0) {
                            successed = false;
                            break FastAI;
                        }
                    }
                    firstLoop = false;
                    // currentYear += 1;

                    fakeUpdateCycle(1);

                    if (fakeCal.year % 1000 === 0) {
                        cal.onNew1000YearAddResources();
                        refreshEraProduction();
                    }
                }
            }

            if (!successed) {
                // SLOW MODE

                // restore resources if need
                if (cacheInvalide) {
                    for (var i = 0; i < resCache.length; i++) {
                        this.game.resPool.resources[i].value = resCache[i];
                    }
                    refreshEraProduction();
                    cacheInvalide = false;
                }

                // first year remaining days
                for (var i in prodFirstYear) {
                    if (resCache[i] === 0 && prodFirstYear[i] < 0) {
                        continue;
                    }
                    resCache[i] += prodFirstYear[i]; // + productionEnginner;
                    // resCache[i] = Math.min(resCache[i], resourcesLimit[i]);
                    if (aiApocalypseLevel && this.game.resPool.resources[i].aiCanDestroy) {
                        resCache[i] -= resCache[i] * destroyRatio;
                    }
                    if (resCache[i] < 0) {
                        resCache[i] = 0;
                        cacheInvalide = true;
                    }
                }
                // fastEnginnerCraftAll(resCache, function (x) { return  maxCraftFirstYear[x] });

                // set time back
                fakeCal.year = firstYear;
                fakeCal.cycle = firstCycle;
                fakeCal.cycleYear = firstCycleYear;
                fakeUpdateCycle(1);

                var step = Math.min(cal.yearsPerCycle - cal.cycleYear, 1000 - (fakeCal.year % 1000));

                while (fakeCal.year < finalYear) {
                    // calc loop

                    var currentCycle = fakeCal.cycle;
                    var failed = false;

                    TryFullCycle:
                    if (!aiApocalypseLevel) {
                        resCache2 = resCache.slice();
                        // try calc full cycle if no ai
                        for (var resourceIndex in resCache) {
                            if (resCache2[resourceIndex] === 0 && prodPYInCycle[currentCycle][resourceIndex] < 0) {
                                continue;
                            }
                            // var res = this.game.resPool.resources[resourceIndex];
                            // resCache2[resourceIndex] += fastCache[currentCycle][resourceIndex] * remainingYearsInCycle;
                            resCache2[resourceIndex] += prodPYInCycle[currentCycle][resourceIndex] * step;
                            // if (resCache2[resourceIndex] > resourcesLimit[resourceIndex]) {
                            //     resCache2[resourceIndex] = resourcesLimit[resourceIndex];
                            // }
                            if (resCache2[resourceIndex] < 0 ) {
                                failed = true;
                                break TryFullCycle;
                            }
                        }
                        // fastEnginnerCraftAll(resCache, function (x) { return maxCraftPerYear[x] * step});
                    } else {
                        failed = true;
                    }
                    if (failed) {
                        resCache2 = resCache.slice();
                        // needUpdate = true;
                        // cacheInvalide = false;
                        for (var x = 0; x < step; x++) {

                            // production without enginners
                            // if (needUpdate) var resPerYear = cal.getProductionPerYear();
                            for (var i in resCache) {
                                var nagetive = resCache2[i] < 0;
                                // if (needUpdate) {
                                //     resName = this.game.resPool.resources[i].name;
                                //     prodPYInCycle[currentCycle][i] = this.game.getResourcePerTick(resName, true) * shatterTCGain * ticksPerYear;
                                //     if (resName in resPerYear) {
                                //         prodPYInCycle[currentCycle][i] += resPerYear[resName];
                                //     }
                                // }
                                var prod = prodPYInCycle[currentCycle][i];
                                resCache2[i] += prod;
                                // resCache2[i] = Math.min(resCache2[i], resourcesLimit[i]);
                                if (nagetive !== (resCache2[i] < 0)) {
                                    if (resCache2[i] < 0) {
                                        resCache2[i] = 0;
                                    }
                                    this.game.resPool.resources[i].value = resCache2[i];
                                    cacheInvalide = true;
                                }
                            }

                            // enginner craft
                            // fastEnginnerCraftAll(resCache2, function (x) { return maxCraftPerYear[x] });
                            // ai
                            if (aiApocalypseLevel) {
                                for (var i in resCache) {
                                    if (this.game.resPool.resources[i].aiCanDestroy) {
                                        resCache2[i] -= resCache2[i] * destroyRatio;
                                    }
                                }
                            }

                            // needUpdate = cacheInvalide;
                            // cacheInvalide = false;
                            if (cacheInvalide) {
                                // saveResources(resCache2);
                                refreshEraProduction();
                                cacheInvalide = false;
                            }
                        }
                    }
                    resCache = resCache2;
                    fakeUpdateCycle(step);
                    // remainingYears -= remainingYearsInCycle;
                    // currentYear += step;

                    if (fakeCal.year % 1000 === 0) {
                        // cal.onNew1000YearAddResources();
                        var p = cal.getProductionPer1000Year();
                        for (var resourceName in p) {
                            var resourceIndex = resourcesIndexTable[resourceName];
                            this.game.resPool.addResEvent(resourceName, p[resourceName]);
                            resCache[resourceIndex] = this.game.resPool.resources[resourceIndex].value;
                        }
                        // refresh perTickCached
                        // game.updateResources();
                        refreshEraProduction();
                    }

                    if (finalYear - fakeCal.year > cal.yearsPerCycle) {
                        step = cal.yearsPerCycle;
                    } else {
                        step = finalYear - fakeCal.year;
                    }
                    // 1000 year fix
                    if (1000 - (fakeCal.year % 1000) < step) {
                        step = 1000 - (fakeCal.year % 1000);
                    }
                }
                // store resources
                if (this.game.workshop.get("chronoEngineers").researched) {
                    for (var i = 0; i < resCache.length; i++) {
                        this.game.resPool.resources[i].value = resCache[i];
                    }
                    this.game.workshop.craftByEngineers(totalTicks * shatterTCGain);
                }
                for (var i = 0; i < resCache.length; i++) {
                    this.game.resPool.resources[i].value = Math.min(resCache[i], resourcesLimit[i]);
                }
            }
        } else {// if (!(shatterTCGain > 0))
            for (var i = 0; i < _1000years; i++) {
                cal.onNew1000YearAddResources();
            }
            // refresh perTickCached
            // game.updateResources();
            // cycle have no effect for resource gen per year
            var resPerYear = cal.getProductionPerYear();
            for (var i = 0; i < this.game.resPool.resources.length; i++) {
                var res = this.game.resPool.resources[i];
                if (res.name in resPerYear) {
                    var limit = Math.max(res.value, res.maxValue || Number.POSITIVE_INFINITY);
                    res.value = Math.min(res.value + resPerYear[res.name]*amt, limit);
                }
            }
        }
        // else if (aiApocalypseLevel) { // shatterTCGain < 0
        if (aiApocalypseLevel) {
            
            if (!(shatterTCGain > 0)) {
                for (var i in this.game.resPool.resources){
                    var res = this.game.resPool.resources[i];
                    if (res.aiCanDestroy) {
                        res.value = Math.max(res.value*Math.pow(1 - destroyRatio, amt), 0);
                    }
                }
            }

            if (amt == 1) {
                this.game.msg($I("ai.apocalypse.msg", [aiApocalypseLevel]), "alert", "ai");
            } else {
                this.game.msg($I("ai.apocalypse.shatter.msg", [amt]), "alert", "ai");
            }
        }

        // set time
        cal.year = finalYear;
        cal.cycle = finalCycle;
        cal.cycleYear = finalCycleYear;
        cal.updateCycle(0, true);

        // Space ETA
        var routeSpeed = game.getEffect("routeSpeed") || 1;
        for (var i in game.space.planets) {
            var planet = game.space.planets[i];
            if (planet.unlocked && !planet.reached) {
                planet.routeDays = Math.max(0, planet.routeDays - totalDays * routeSpeed);
            }
        }

        var triggersOrderOfTheVoid = game.getEffect("voidResonance") > 0;
        if (triggersOrderOfTheVoid) {
            game.religion.triggerOrderOfTheVoid(totalTicks);
        }


        this.flux += amt - 1 + remainingDaysInFirstYear / daysPerYear;

        game.challenges.getChallenge("1000Years").unlocked = true;
        if (game.challenges.currentChallenge == "1000Years" && cal.year >= 1000) {
            game.challenges.researchChallenge("1000Years");
        }

        // split from calendar.js: onNewYear()
        cal.onNewYearStackable(amt);
        cal.onNewYearNotStackable();
        this.game.ui.render();

        if (amt == 1) {
            game.msg($I("time.tc.shatterOne"), "", "tc");
        } else {
            game.msg($I("time.tc.shatter",[amt]), "", "tc");
        }
    },

    originShatter: function(amt){
        amt = amt || 1;

        var game = this.game;
        var cal = game.calendar;

        var routeSpeed = game.getEffect("routeSpeed") || 1;
        var shatterTCGain = game.getEffect("shatterTCGain") * (1 + game.getEffect("rrRatio"));
        var triggersOrderOfTheVoid = game.getEffect("voidResonance") > 0;

        var daysPerYear = cal.daysPerSeason * cal.seasonsPerYear;
        var remainingDaysInFirstYear = cal.daysPerSeason * (cal.seasonsPerYear - cal.season) - cal.day;
        cal.day = 0;
        cal.season = 0;

        for (var i = 0; i < amt; i++) {
            var remainingDaysInCurrentYear = i == 0 ? remainingDaysInFirstYear : daysPerYear;
            var remainingTicksInCurrentYear = remainingDaysInCurrentYear * cal.ticksPerDay;

            // Space ETA
            for (var j in game.space.planets) {
                var planet = game.space.planets[j];
                if (planet.unlocked && !planet.reached) {
                    planet.routeDays = Math.max(0, planet.routeDays - remainingDaysInCurrentYear * routeSpeed);
                }
            }

            // ShatterTC gain
            if (shatterTCGain > 0) {
                // XXX Partially duplicates resources#fastforward and #enforceLimits, some nice factorization is probably possible
                var limits = {};
                for (var j = 0; j < game.resPool.resources.length; j++) {
                    var res = game.resPool.resources[j];
                    limits[res.name] = Math.max(res.value, res.maxValue || Number.POSITIVE_INFINITY);
                    game.resPool.addRes(res, game.getResourcePerTick(res.name, true) * remainingTicksInCurrentYear * shatterTCGain, false, true);
                }
                if (this.game.workshop.get("chronoEngineers").researched) {
                    this.game.workshop.craftByEngineers(remainingTicksInCurrentYear * shatterTCGain);
                }
                for (var j = 0; j < game.resPool.resources.length; j++) {
                    var res = game.resPool.resources[j];
                    res.value = Math.min(res.value, limits[res.name]);
                }
            }

            if (triggersOrderOfTheVoid) {
                game.religion.triggerOrderOfTheVoid(remainingTicksInCurrentYear);
            }

            // Calendar
            cal.year++;
            cal.onNewYear(i + 1 == amt);
        }

        if (amt == 1) {
            game.msg($I("time.tc.shatterOne"), "", "tc");
        } else {
            game.msg($I("time.tc.shatter",[amt]), "", "tc");
        }

        this.flux += amt - 1 + remainingDaysInFirstYear / daysPerYear;

        game.challenges.getChallenge("1000Years").unlocked = true;
        if (game.challenges.isActive("1000Years") && cal.year >= 1000) {
            game.challenges.researchChallenge("1000Years");
        }
    },

    unlockAll: function(){
        for (var i in this.cfu){
            this.cfu[i].unlocked = true;
        }
        this.game.msg("All time upgrades are unlocked");
    }
});

dojo.declare("classes.ui.time.AccelerateTimeBtnController", com.nuclearunicorn.game.ui.ButtonModernController, {
    fetchModel: function(options) {
        var model = this.inherited(arguments);
        var self = this;
        model.toggle = {
            title: this.game.time.isAccelerated ? $I("btn.on.minor") : $I("btn.off.minor"),
            tooltip: this.game.time.isAccelerated ? $I("time.AccelerateTimeBtn.tooltip.accelerated") : $I("time.AccelerateTimeBtn.tooltip.normal"),
            cssClass: this.game.time.isAccelerated ? "fugit-on" : "fugit-off",
            handler: function(btn, callback) {
                if (self.game.resPool.get("temporalFlux").value <= 0) {
                    self.game.time.isAccelerated = false;
                    self.game.resPool.get("temporalFlux").value = 0;
                } else {
                    self.game.time.isAccelerated = !self.game.time.isAccelerated;
                }
                callback(true);
            }
        };
        return model;
    },

    buyItem: function() {
    }
});

dojo.declare("classes.ui.time.AccelerateTimeBtn", com.nuclearunicorn.game.ui.ButtonModern, {
    renderLinks: function() {
        this.toggle = this.addLink(this.model.toggle);
    },

    update: function() {
        this.inherited(arguments);
        this.updateLink(this.toggle, this.model.toggle);
    }
});

dojo.declare("classes.ui.TimeControlWgt", [mixin.IChildrenAware, mixin.IGameAware], {
    constructor: function(game){
        this.addChild(new classes.ui.time.AccelerateTimeBtn({
            name: $I("time.AccelerateTimeBtn.label"),
            description: $I("time.AccelerateTimeBtn.desc"),
            prices: [],
            controller: new classes.ui.time.AccelerateTimeBtnController(game)
        }, game));
    },

    render: function(container){
        var div = dojo.create("div", null, container);
        var timeSpan = dojo.create("span", null, div);

        this.timeSpan = timeSpan;

        UIUtils.attachTooltip(this.game, this.timeSpan, 0, 200, dojo.hitch(this, function(){
            var tooltip = $I("time.flux.desc");

            if (this.game.workshop.get("chronoforge").researched) {
                tooltip += "<br>" + $I("time.chronoheat");
            }

            return tooltip;
        }));


        var btnsContainer = dojo.create("div", {style:{paddingTop:"20px"}}, div);
        this.inherited(arguments, [btnsContainer]);
    },

    update: function() {
        var temporalFlux = this.game.resPool.get("temporalFlux");
        this.timeSpan.innerHTML = $I("time.flux") + ": " + this.game.getDisplayValueExt(temporalFlux.value) + " / " + temporalFlux.maxValue;

        var remainingTemporalFluxInSeconds = temporalFlux.value / this.game.ticksPerSecond;
        this.timeSpan.innerHTML += " (" + (remainingTemporalFluxInSeconds < 1 ? "0" + $I("unit.s") : this.game.toDisplaySeconds(remainingTemporalFluxInSeconds)) + " / " + this.game.toDisplaySeconds(temporalFlux.maxValue / this.game.ticksPerSecond) + ")";

        if (this.game.workshop.get("chronoforge").researched) {
            this.timeSpan.innerHTML += "<br>" + $I("time.heat") + ": ";
            var heatMax = this.game.getEffect("heatMax");
            if (this.game.time.heat > heatMax) {
                // When innerHTML is appended with a HTML element, it must be completely (START + content + END) in one strike, otherwise the element is automatically closed before its content is appended
                this.timeSpan.innerHTML += "<span style='color:red;'>" + this.game.getDisplayValueExt(this.game.time.heat) + "</span>";
            } else {
                this.timeSpan.innerHTML += this.game.getDisplayValueExt(this.game.time.heat);
            }
            this.timeSpan.innerHTML += " / " + this.game.getDisplayValueExt(heatMax);

            var heatPerSecond = this.game.getEffect("heatPerTick") * this.game.ticksPerSecond;
            var remainingHeatDissipationInSeconds = this.game.time.heat / heatPerSecond;
            this.timeSpan.innerHTML += " (" + (remainingHeatDissipationInSeconds < 1 ? "0" + $I("unit.s") : this.game.toDisplaySeconds(remainingHeatDissipationInSeconds)) + " / " + this.game.toDisplaySeconds(heatMax / heatPerSecond) + ")";
        }

        this.inherited(arguments);
    }
});

dojo.declare("classes.ui.time.ShatterTCBtnController", com.nuclearunicorn.game.ui.ButtonModernController, {

    defaults: function() {
        var result = this.inherited(arguments);
        result.hasResourceHover = true;
        return result;
    },

    fetchModel: function(options) {
        var model = this.inherited(arguments);
        model.nextCycleLink = this._newLink(model, this.game.calendar.yearsPerCycle);
        model.previousCycleLink = this._newLink(model, this.game.calendar.yearsPerCycle * (this.game.calendar.cyclesPerEra - 1));
        model.tenErasLink = this._newLink(model, 10 * this.game.calendar.yearsPerCycle * this.game.calendar.cyclesPerEra);
        return model;
    },

    _newLink: function(model, shatteredQuantity) {
        var self = this;
        return {
            visible: this.game.opts.showNonApplicableButtons || 
                (this.getPricesMultiple(model, shatteredQuantity).timeCrystal <= this.game.resPool.get("timeCrystal").value &&
                (this.getPricesMultiple(model, shatteredQuantity).void <= this.game.resPool.get("void").value)
            ),
            title: "x" + shatteredQuantity,
            handler: function(event) {
                self.doShatterAmt(model, shatteredQuantity);
            }
        };
    },

    getName: function(model) {
        var name = this.inherited(arguments);
        if (this.game.time.heat > this.game.getEffect("heatMax")) {
            name += $I("common.warning");
        }
        return name;
    },

    getPrices: function(model) {
		var prices_cloned = $.extend(true, [], model.options.prices);

        if(this.game.getEffect("shatterVoidCost")){
            var shatterVoidCost = this.game.getEffect("shatterVoidCost");
            prices_cloned.push({
                name: "void",
                val: shatterVoidCost
            });
        }

		for (var i in prices_cloned) {
			var price = prices_cloned[i];
			if (price["name"] == "timeCrystal") {
                var darkYears = this.game.calendar.darkFutureYears(true);
                if (darkYears > 0) {
                    price["val"] = 1 + ((darkYears) / 1000) * 0.01;
                }
                var heatMax = this.game.getEffect("heatMax");
                if (this.game.time.heat > heatMax) {
                    price["val"] *= (1 + (this.game.time.heat - heatMax) * 0.01);  //1% per excessive heat unit
                }

                price["val"] *= (1 + this.game.getLimitedDR(this.game.getEffect("shatterCostReduction"),1) + this.game.getEffect("shatterCostIncreaseChallenge"));
            }
            else if(price["name"] == "void"){
                var heatMax = this.game.getEffect("heatMax");
                if (this.game.time.heat > heatMax) {
                    price["val"] *= (1 + (this.game.time.heat - heatMax) * 0.01);  //1% per excessive heat unit
                }
            }
        }
		return prices_cloned;
	},

	getPricesMultiple: function(model, amt) {
		var pricesTotal = {
            void: 0,
            timeCrystal: 0
        };

		var prices_cloned = $.extend(true, [], model.options.prices);
        var heatMax = this.game.getEffect("heatMax");

        var heatFactor = this.game.challenges.getChallenge("1000Years").researched ? 5 : 10;

        if(this.game.getEffect("shatterVoidCost")){
            var shatterVoidCost = this.game.getEffect("shatterVoidCost");
            prices_cloned.push({
                name: "void",
                val: shatterVoidCost
            });
        }
        
		for (var k = 0; k < amt; k++) {
			for (var i in prices_cloned) {
				var price = prices_cloned[i];
				if (price["name"] == "timeCrystal") {
					var priceLoop = price["val"];
                        var darkYears = this.game.calendar.darkFutureYears(true);
	                if (darkYears > 0) {
	                    priceLoop = 1 + ((darkYears) / 1000) * 0.01;
	                }
	                if ((this.game.time.heat + k * heatFactor) > heatMax) {
	                    priceLoop *= (1 + (this.game.time.heat + k * heatFactor - heatMax) * 0.01);  //1% per excessive heat unit
	                }

                    priceLoop *= (1 + this.game.getLimitedDR(this.game.getEffect("shatterCostReduction"),1) + 
                        this.game.getEffect("shatterCostIncrease"));

                    pricesTotal.timeCrystal += priceLoop;
                    
				}else if (price["name"] == "void"){
                    var priceLoop = price["val"];
	                if ((this.game.time.heat + k * heatFactor) > heatMax) {
	                    priceLoop *= (1 + (this.game.time.heat + k * heatFactor - heatMax) * 0.01);  //1% per excessive heat unit
                    }
                    pricesTotal.void += priceLoop;
                }
			}
		}
        pricesTotal.void = Math.round(pricesTotal.void * 1000) / 1000;
		return pricesTotal;
	},

    buyItem: function(model, event, callback){
        if (model.enabled && this.hasResources(model)) {
            var price = this.getPrices(model);
            for (var i in price){
                this.game.resPool.addResEvent(price[i].name, -price[i].val);
            }
            callback(this.doShatter(model, 1));
        }
        callback(false);
        return true;
    },

    doShatterAmt: function(model, amt) {
        if (!model.enabled) {
            return;
        }
        var price = this.getPricesMultiple(model, amt);
        if(price.void){
            if (price.timeCrystal <= this.game.resPool.get("timeCrystal").value &&
            price.void || -1 <= this.game.resPool.get("void").value) {
                this.game.resPool.addResEvent("timeCrystal", -price.timeCrystal);
                this.game.resPool.addResEvent("void", -price.void);
                this.doShatter(model, amt);
            }
        }
        else if (price.timeCrystal <= this.game.resPool.get("timeCrystal").value) {
            this.game.resPool.addResEvent("timeCrystal", -price.timeCrystal);
            this.doShatter(model, amt);
        }
    },

    doShatter: function(model, amt) {
        var factor = this.game.challenges.getChallenge("1000Years").researched ? 5 : 10;
        this.game.time.heat += amt*factor;
        this.game.time.shatter(amt);
    },

    updateVisible: function(model){
        model.visible = (this.game.resPool.get("timeCrystal").value >= 1);
    }
});

dojo.declare("classes.ui.time.ShatterTCBtn", com.nuclearunicorn.game.ui.ButtonModern, {
    /**
     * TODO: this is a horrible pile of copypaste, can we fix it somehow?
     * => the whole button-controller-model stuff will be factorized in order to reduce copy&paste
     */
    renderLinks: function() {
        this.tenEras = this.addLink(this.model.tenErasLink);
        this.previousCycle = this.addLink(this.model.previousCycleLink);
        this.nextCycle = this.addLink(this.model.nextCycleLink);
    },

    update: function() {
        this.inherited(arguments);
        dojo.style(this.nextCycle.link, "display", this.model.nextCycleLink.visible ? "" : "none");
        dojo.style(this.previousCycle.link, "display", this.model.previousCycleLink.visible ? "" : "none");
        dojo.style(this.tenEras.link, "display", this.model.tenErasLink.visible ? "" : "none");

        if  (this.model.tenErasLink.visible) {
            dojo.addClass(this.tenEras.link,"rightestLink");
            dojo.removeClass(this.previousCycle.link,"rightestLink");
        } else if (this.model.previousCycleLink.visible) {
            dojo.addClass(this.previousCycle.link,"rightestLink");
            dojo.removeClass(this.nextCycle.link,"rightestLink");
        } else if (this.model.nextCycleLink.visible) {
            dojo.addClass(this.nextCycle.link,"rightestLink");
        }
    }
});

/**
 * I wonder if we can get rid of such tremendous amounts of boilerplate code
 */

dojo.declare("classes.ui.time.ChronoforgeBtnController", com.nuclearunicorn.game.ui.BuildingStackableBtnController, {
    getMetadata: function(model){
        if (!model.metaCached){
            model.metaCached = this.game.time.getCFU(model.options.id);
        }
        return model.metaCached;
    },

    getName: function(model){
        var meta = model.metadata;
        if (meta.heat){
            return this.inherited(arguments) + " [" + this.game.getDisplayValueExt(meta.heat) + "%]";
        }
        return this.inherited(arguments);
    }
});

dojo.declare("classes.ui.ChronoforgeWgt", [mixin.IChildrenAware, mixin.IGameAware], {
    constructor: function(game){
        this.addChild(new classes.ui.time.ShatterTCBtn({
            name: $I("time.shatter.tc"),
            description: $I("time.shatter.tc.desc"),
            prices: [{name: "timeCrystal", val: 1}],
            controller: new classes.ui.time.ShatterTCBtnController(game)
        }, game));
        var controller = new classes.ui.time.ChronoforgeBtnController(game);
        for (var i in game.time.chronoforgeUpgrades){
            var meta = game.time.chronoforgeUpgrades[i];

            this.addChild(new com.nuclearunicorn.game.ui.BuildingStackableBtn({id: meta.name, controller: controller }, game));
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

dojo.declare("classes.ui.time.VoidSpaceBtnController", com.nuclearunicorn.game.ui.BuildingStackableBtnController, {
    getMetadata: function(model){
        if (!model.metaCached){
            model.metaCached = this.game.time.getVSU(model.options.id);
        }
        return model.metaCached;
    },

	getName: function(model){
		var meta = model.metadata;
		if (meta.name == "cryochambers" && meta.on != meta.val) {
			return meta.label + " (" + meta.on + "/" + meta.val + ")";
		} else {
			return this.inherited(arguments);
		}
	},

	getPrices: function(model) {
		var prices = this.inherited(arguments);
		if (model.metadata.name == "cryochambers") {
			for (var i = 0; i < prices.length; i++) {
				if (prices[i].name == "karma") {
					prices[i].val -= prices[i].val * this.game.getLimitedDR(0.01 * this.game.prestige.getBurnedParagonRatio(), 1);
				}
			}
		}
		return prices;
	}
});

dojo.declare("classes.ui.time.FixCryochamberBtnController", com.nuclearunicorn.game.ui.ButtonModernController, {
    defaults: function() {
        var result = this.inherited(arguments);
        result.hasResourceHover = true;
        return result;
    },

	buyItem: function(model, event, callback) {
		if (!model.enabled) {
			callback(false);
			return;
		}

		var fixCount = event.shiftKey
			? 1000
			: event.ctrlKey || event.metaKey /*osx tears*/
				? this.game.opts.batchSize || 10
				: 1;
		fixCount = Math.min(fixCount, this.game.time.getVSU("usedCryochambers").val);

		var fixHappened = false;
		for (var count = 0; count < fixCount && this.hasResources(model); ++count) {
			this.payPrice(model);
			fixHappened |= this.doFixCryochamber(model);
		}
		callback(fixHappened);
	},

    doFixCryochamber: function(model){
		var cry = this.game.time.getVSU("cryochambers");
		var usedCry = this.game.time.getVSU("usedCryochambers");
		if (this.game.workshop.get("chronoforge").researched && usedCry.val) {
			usedCry.val -= 1;
			usedCry.on -= 1;
			cry.val += 1;
			cry.on += 1;
			if (!usedCry.on) {
				usedCry.unlocked = false;
			}
            return true;
		}
        return false;
    },

	updateVisible: function(model) {
		model.visible = this.game.workshop.get("chronoforge").researched && this.game.time.getVSU("usedCryochambers").val != 0;
	}
});

dojo.declare("classes.ui.VoidSpaceWgt", [mixin.IChildrenAware, mixin.IGameAware], {
    constructor: function(game){

		this.addChild(new com.nuclearunicorn.game.ui.ButtonModern({
            name: $I("time.fixCryochambers.label"),
            description: $I("time.fixCryochambers.desc"),
            prices: [
				{name: "temporalFlux", val: 3000},
				{name: "timeCrystal", val: 100},
				{name: "void", val: 500}
            ],
            controller: new classes.ui.time.FixCryochamberBtnController(game)
        }, game));

        var controller = new classes.ui.time.VoidSpaceBtnController(game);
        for (var i in game.time.voidspaceUpgrades){
            var meta = game.time.voidspaceUpgrades[i];
            this.addChild(new com.nuclearunicorn.game.ui.BuildingStackableBtn( {
                    id: meta.name,
                    controller: controller
                }, game));
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
            name: $I("menu.reset"),
            description: $I("time.reset.desc"),
            prices: [],
            handler: function(btn){
                game.reset();
            },
            controller: new com.nuclearunicorn.game.ui.ButtonModernController(game)
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

        var msg = $I("time.reset.instructional");

        var kittens = this.game.resPool.get("kittens").value;
        var stripe = 5;
        var karmaPointsPresent = this.game.getUnlimitedDR(this.game.karmaKittens, stripe);
        var karmaPointsAfter = this.game.getUnlimitedDR(this.game.karmaKittens + this.game._getKarmaKittens(kittens), stripe);
		var karmaPoints = Math.floor((karmaPointsAfter - karmaPointsPresent) * 100) / 100;
        var paragonPoints = 0;

        if (kittens > 70){
			paragonPoints = (kittens - 70);
		}

        msg += "<br>" + $I("time.reset.karma") + ": " + karmaPoints;
        msg += "<br>" + $I("time.reset.paragon") + ": " + paragonPoints;

        if (this.game.ironWill){
            msg += "<br>" + $I("time.reset.zebra") + ": " + this.game._getBonusZebras();
        }


        this.resetDiv.innerHTML = msg;
    }
});

dojo.declare("classes.tab.TimeTab", com.nuclearunicorn.game.ui.tab, {

    container: null,

    constructor: function(tabName){
        var timePanel = new com.nuclearunicorn.game.ui.Panel($I("tab.name.time"));
        this.addChild(timePanel);

        var timeWgt = new classes.ui.TimeControlWgt(this.game);
        timeWgt.setGame(this.game);
        timePanel.addChild(timeWgt);

        //--------- reset ----------

        this.resetPanel = new com.nuclearunicorn.game.ui.Panel($I("menu.reset"));
        this.resetPanel.setVisible(true);
        this.addChild(this.resetPanel);

        var resetWgt = new classes.ui.ResetWgt(this.game);
        resetWgt.setGame(this.game);
        this.resetPanel.addChild(resetWgt);

        //--------------------------

        this.cfPanel = new com.nuclearunicorn.game.ui.Panel($I("workshop.chronoforge.label"));
        this.cfPanel.setVisible(false);
        this.addChild(this.cfPanel);

        var cforgeWgt = new classes.ui.ChronoforgeWgt(this.game);
        cforgeWgt.setGame(this.game);
        this.cfPanel.addChild(cforgeWgt);

        //add CF buttons

        //Shater TC
        //Crystal Hammer (better shattering effect)

        //--------------------------

        this.vsPanel = new com.nuclearunicorn.game.ui.Panel($I("science.voidSpace.label"));
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
