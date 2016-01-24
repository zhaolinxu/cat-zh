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

        if (!this.game.science.get("calendar").researched){
            return;
        }

        var timestamp = Date.now();
        var delta = timestamp - ( saveData["time"].timestamp || 0 );
        if (delta <= 0){
            return;
        }

        var bonusSeconds = Math.round(delta / ( 60 * 1000 ) );    //every 60 seconds
        if (bonusSeconds){
            this.game.msg("You have recharged " + bonusSeconds + " seconds of temporal energy");
        }

        this.energy += bonusSeconds * game.rate;
        if (this.energy > this.maxEnergy){
            this.energy = this.maxEnergy;
        }
    },

    save: function(saveData){
       saveData["time"] = {
           timestamp: Date.now()
       }
    },
    
    resetState: function(){
        
    },

    update: function(){
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
            description: "Accelerate and slow time at your whim",
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
            this.timeSpan.innerHTML +=  " (" + this.game.toDisplaySeconds(this.game.time.energy/this.game.rate) + ")";
        }

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

        //add CF buttons

        //Shater TC
        //Crystal Hammer (better shattering chance)
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