dojo.declare("classes.managers.TimeManager", com.nuclearunicorn.core.TabManager, {
    game: null,

    maxEnergy: 0,   /*Time acceleration energy in ticks*/
    energy: 0,
    /*
     * Amount of years skipped by CF time jumps
     */
    flux: 0,
    isAccelerated: false,   //do not save this flag or else!

    constructor: function(game){
        this.game = game;

        this.maxEnergy = game.rate * 60 * 10;   //10 minute max

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

    load: function(saveData){
        if (!saveData["time"]){
            return;
        }
		var saveEnergy = saveData["time"].energy || 0;
        this.energy = saveEnergy;
        this.flux = saveData["time"].flux || 0;

		if (saveData.time.usedCryochambers){ //after reset
				this.loadMetadata(this.voidspaceUpgrades, saveData.time.usedCryochambers, ["name", "val", "unlocked"], function(loadedElem){
			});
		}

        if (!this.game.science.get("calendar").researched){
            return;
        }

        var timestamp = Date.now();
        var delta = timestamp - ( saveData["time"].timestamp || 0 );
        if (delta <= 0){
            return;
        }

        if (saveData.time.cfu){
            this.loadMetadata(this.chronoforgeUpgrades, saveData.time.cfu, ["val", "unlocked", "on"], function(loadedElem){
            });
        }
        if (saveData.time.vsu){
            this.loadMetadata(this.voidspaceUpgrades, saveData.time.vsu, ["val", "unlocked", "on"], function(loadedElem){
            });
        }
        this.updateEnergyStats();

		this.energy += Math.round(delta / ( 60 * 1000 ) ) * this.game.rate;    //every 60 seconds
        if (this.energy > this.maxEnergy){
            this.energy = this.maxEnergy;
        }

        var accelerator = this.getCFU("temporalAccelerator"),
            energyRatio =  1 + (accelerator.val * accelerator.effects["timeRatio"]),
		    bonusSeconds = Math.round((this.energy - saveEnergy) / this.game.rate * energyRatio);

        if (bonusSeconds > 0){
            this.game.msg("You have recharged " + bonusSeconds + " second"
				+ (bonusSeconds > 1 ? "s" : "") + " of temporal flux");
        }
    },

    save: function(saveData){
       saveData["time"] = {
           timestamp: Date.now(),
           energy: this.energy,
           flux: this.flux,
           cfu: this.filterMetadata(this.chronoforgeUpgrades, ["name", "val", "researched", "on"]),
           vsu: this.filterMetadata(this.voidspaceUpgrades, ["name", "val", "researched", "on"]),
       };
    },

    resetState: function(){
		this.energy = 0;
		this.isAccelerated = false;

		for (var i = 0; i < this.voidspaceUpgrades.length; i++) {
			var bld = this.voidspaceUpgrades[i];
			this.setToggle(bld, bld.isAutomationEnabled, bld.lackResConvert, bld.effects);
		}
		for (var bld in this.chronoforgeUpgrades) {
			this.setToggle(bld, bld.isAutomationEnabled, bld.lackResConvert, bld.effects);
		}
    },

    update: function(){
        this.updateEnergyStats();

        if (this.energy > this.maxEnergy){ //sanity check
            this.energy = this.maxEnergy;
        }
        game.resPool.get("temporalFlux").value = this.energy;
        if (this.isAccelerated && this.energy > 0){
            this.energy--;
        }
        if (!this.energy){
            this.isAccelerated = false;
        }
    },

    updateEnergyStats: function(){
        this.maxEnergy = Math.round(
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
        val: 0,
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
        val: 0,
        unlocked: true
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
        val: 0,
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
        val: 0,
        unlocked: false
    },{
        name: "voidHoover",
        label: "Void Hoover",
        description: "Increase the maximum of void per days in Temporal Paradox",
        prices: [
			{ name: "timeCrystal", val: 10 },
			{ name: "antimatter", val: 1000 }
        ],
        priceRatio: 1.25,
        effects: {
			"temporalParadoxVoid": 1
        },
        val: 0,
        unlocked: false
    },{
        name: "chronocontrol",
        label: "Chronocontrol",
        description: "Increase the number of days in Temporal Paradox",
        prices: [
			{ name: "timeCrystal", val: 30 },
			{ name: "void", val: 500 },
			{ name: "temporalFlux", val: 5000}
        ],
        priceRatio: 1.25,
        effects: {
			"temporalParadoxDay": 1,
			"energyConsumption": 15
        },
        val: 0,
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
		if (this.game.time.energy == 0) {
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
        this.timeSpan.innerHTML = "Temporal Flux: " + this.game.time.energy + "/" + this.game.time.maxEnergy;
        if (this.game.time.energy){
            this.timeSpan.innerHTML +=  " (" + this.game.toDisplaySeconds(this.game.time.energy / this.game.rate) + ")";
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

dojo.declare("classes.ui.time.ChronoforgeBtn", com.nuclearunicorn.game.ui.BuildingBtn, {
    hasResourceHover: true,
    cache: null,

    onClick: function(event){
        var self = this;

        this.animate();
        var meta = this.getMetadata();
        if (this.enabled && this.hasResources()){
            this.payPrice();
            meta.val++;
            if (meta.on) {
				meta.on++;
            }
        }
    },

    getPrices: function(){
        var ratio = this.getMetadata().priceRatio || 1;
        var prices = dojo.clone(this.cache.prices);

        for (var i = 0; i< prices.length; i++){
            prices[i].val = prices[i].val * Math.pow(ratio, this.cache.val);
        }
        return prices;
    },

    getMetadata: function(){
        if (!this.cache){
            var time = this.game.time;
            var meta = time.getMeta(this.id, time.chronoforgeUpgrades);
            this.cache = meta;
        }
        return this.cache;
    },

    getEffects: function(){
		var bld = this.getMetadata();
		return bld.effects;
	}
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

            this.addChild(new classes.ui.time.ChronoforgeBtn({
                id: meta.name,
                name: meta.label,
                description: meta.description,
                prices: meta.prices,
                handler: function(btn){

                }
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

dojo.declare("classes.ui.time.VoidSpaceBtn", com.nuclearunicorn.game.ui.BuildingBtn, {
    hasResourceHover: true,
    cache: null,

    onClick: function(event){
        var self = this;
		var meta = this.getMetadata();

		if (meta.name == "usedCryochambers") {
			return;
		} else if (meta.name == "cryochambers" && this.getMetadata().val >= this.game.bld.get("chronosphere").val) {
			return;
		}

        this.animate();

        if (this.enabled && this.hasResources()){
            this.payPrice();
            if (meta.name == "chronocontrol") {
				this.game.time.energy -= meta.prices[2].val;
            }
            meta.val++;
            if (meta.on) {
				meta.on++;
            }
        }
    },

    getPrices: function(){
        var ratio = this.getMetadata().priceRatio || 1;
        var prices = dojo.clone(this.cache.prices);

        for (var i = 0; i< prices.length; i++){
            prices[i].val = prices[i].val * Math.pow(ratio, this.cache.val);
        }
        return prices;
    },

    getMetadata: function(){
        if (!this.cache){
            var time = this.game.time;
            var meta = time.getMeta(this.id, time.voidspaceUpgrades);
            this.cache = meta;
        }
        return this.cache;
    },

    getEffects: function(){
		var bld = this.getMetadata();
		return bld.effects;
	}
});

dojo.declare("classes.ui.VoidSpaceWgt", [mixin.IChildrenAware, mixin.IGameAware], {
    constructor: function(game){

        for (var i in game.time.voidspaceUpgrades){
            var meta = game.time.voidspaceUpgrades[i];
            this.addChild(new classes.ui.time.VoidSpaceBtn({
                id: meta.name,
                name: meta.label,
                description: meta.description,
                prices: meta.prices,
                handler: function(btn){

                }
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
