dojo.declare("classes.managers.TimeManager", com.nuclearunicorn.core.TabManager, {
    game: null,

    maxEnergy: 0,   /*Time acceleration energy in ticks*/

    energy: 0,

    constructor: function(game){
        this.game = game;

        this.c = game.rate * 60 * 10;   //10 minute max

    },

    load: function(saveData){
        if (!saveData["time"]){
            return;
        }

        var timestamp = Date.now();
        var delta = timestamp - ( saveData["time"].timestamp || 0 );
        if (delta <= 0){
            return;
        }

        console.log("delta is:", delta);

        var bonusSeconds = Math.round(delta / ( 60 * 1000 ) );    //every 60 seconds
        console.log("bonus seconds:", bonusSeconds);

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
        
    }
});

dojo.declare("classes.ui.TimeControlWgt", [mixin.IChildrenAware, mixin.IGameAware], {
    constructor: function(){

    },

    render: function(container){
        var div = dojo.create("div", null, container);
        var timeSpan = dojo.create("span", null, div);

        this.timeSpan = timeSpan;
    },

    update: function(){
        this.timeSpan.innerHTML = "Energy: " + this.game.time.energy + "/" + this.game.time.maxEnergy;
    }
});

dojo.declare("classes.tab.TimeTab", com.nuclearunicorn.game.ui.tab, {

    container: null,

    constructor: function(tabName){
        var timePanel = new com.nuclearunicorn.game.ui.Panel("Time");
        this.addChild(timePanel);

        var timeWgt = new classes.ui.TimeControlWgt();
        timeWgt.setGame(this.game);
        timePanel.addChild(timeWgt);

        this.cfPanel = new com.nuclearunicorn.game.ui.Panel("Chronoforge");
        this.cfPanel.setVisible(false);
        this.addChild(this.cfPanel);
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