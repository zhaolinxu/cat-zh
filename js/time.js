dojo.declare("classes.managers.TimeManager", com.nuclearunicorn.core.TabManager, {
    game: null,

    maxEnergy: 0,   /*Time acceleration energy in ticks*/
    energy: 0,
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

        if (!this.game.science.get("calendar").researched){
            return;
        }

        var timestamp = Date.now();
        var delta = timestamp - ( saveData["time"].timestamp || 0 );
        if (delta <= 0){
            return;
        }

		this.energy += Math.round(delta / ( 60 * 1000 ) ) * game.rate;    //every 60 seconds
        if (this.energy > this.maxEnergy){
            this.energy = this.maxEnergy;
        }

		var bonusSeconds = Math.round((this.energy - saveEnergy) / game.rate);
        if (bonusSeconds > 0){
            this.game.msg("You have recharged " + bonusSeconds + " second"
				+ (bonusSeconds > 1 ? "s" : "") + " of temporal energy");
        }

    },

    save: function(saveData){
       saveData["time"] = {
           timestamp: Date.now(),
           energy: this.energy
       };
    },

    resetState: function(){
		this.energy = 0;
		this.isAccelerated = false;
    },

    update: function(){
        if (this.energy > this.maxEnergy){ //sanity check
            this.energy = this.maxEnergy;
        }
        if (this.isAccelerated && this.energy > 0){
            this.energy--;
        }
        if (!this.energy){
            this.isAccelerated = false;
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
            this.timeSpan.innerHTML +=  " (" + this.game.toDisplaySeconds(this.game.time.energy / game.rate) + ")";
        }

        this.inherited(arguments);
    }
});

dojo.declare("classes.ui.time.ShatterTCBtn", com.nuclearunicorn.game.ui.ButtonModern, {
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