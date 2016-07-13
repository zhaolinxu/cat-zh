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
    },

    load: function(saveData){
        if (!saveData["time"]){
            return;
        }
		var saveEnergy = saveData["time"].energy || 0;
        this.energy = saveEnergy;
        this.flux = saveData["time"].flux || 0;

        if (!this.game.science.get("calendar").researched){
            return;
        }

        var timestamp = Date.now();
        var delta = timestamp - ( saveData["time"].timestamp || 0 );
        if (delta <= 0){
            return;
        }

        this.updateEnergyStats();

		this.energy += Math.round(delta / ( 60 * 1000 ) ) * this.game.rate;    //every 60 seconds
        if (this.energy > this.maxEnergy){
            this.energy = this.maxEnergy;
        }

		var bonusSeconds = Math.round((this.energy - saveEnergy) / this.game.rate);
        if (bonusSeconds > 0){
            this.game.msg("You have recharged " + bonusSeconds + " second"
				+ (bonusSeconds > 1 ? "s" : "") + " of temporal energy");
        }

        if (saveData.time.cfu){
            this.loadMetadata(this.chronoforgeUpgrades, saveData.time.cfu, ["val", "unlocked"], function(loadedElem){
            });
        }

    },

    save: function(saveData){
       saveData["time"] = {
           timestamp: Date.now(),
           energy: this.energy,
           flux: this.flux,
           cfu: this.filterMetadata(this.chronoforgeUpgrades, ["name", "val", "researched"])
       };
    },

    resetState: function(){
		this.energy = 0;
		this.isAccelerated = false;
    },

    update: function(){
        this.updateEnergyStats();

        if (this.energy > this.maxEnergy){ //sanity check
            this.energy = this.maxEnergy;
        }
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
        action: function(){

        },
        val: 0,
        unlocked: true
    }],

    getCFU: function(id){
        return this.getMeta(id, this.chronoforgeUpgrades);
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
        this.game.time.isAccelerated = !this.game.time.isAccelerated;
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
        this.timeSpan.innerHTML = "Energy: " + this.game.time.energy + "/" + this.game.time.maxEnergy;
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
        cal.year+= amt;

        for (var i=0; i< amt; i++) {
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
                    this.game.resPool.get("timeCrystal").value -= prices[0].val * 5;
                }

                this.doShatter(5);
                this.update();
            }, false
        );

        var prices = this.getPrices();
        var hasRes = (prices[0].val * 5 <= this.game.resPool.get("timeCrystal").value);

        dojo.setStyle(this.x5.link, "display", hasRes ? "" : "none");
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


dojo.declare("classes.tab.TimeTab", com.nuclearunicorn.game.ui.tab, {

    container: null,

    constructor: function(tabName){
        var timePanel = new com.nuclearunicorn.game.ui.Panel("Time");
        this.addChild(timePanel);

        var timeWgt = new classes.ui.TimeControlWgt(this.game);
        timeWgt.setGame(this.game);
        timePanel.addChild(timeWgt);

        this.cfPanel = new com.nuclearunicorn.game.ui.Panel("Chronoforge");
        this.cfPanel.setVisible(false);
        this.addChild(this.cfPanel);

        var cforgeWgt = new classes.ui.ChronoforgeWgt(this.game);
        cforgeWgt.setGame(this.game);
        this.cfPanel.addChild(cforgeWgt);

        //add CF buttons

        //Shater TC
        //Crystal Hammer (better shattering effect)
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
    }
});