dojo.declare("classes.managers.StatsManager", com.nuclearunicorn.core.TabManager, {
    
    stats:
        [{
            name: "totalKittens",
            title: "Total kittens",
            val: 0,
            unlocked: true
        },{
            name: "kittensDead",
            title: "Kittens dead",
            val: 0,
            unlocked: true
        },{
            name: "totalYears",
            title: "Total years played",
            val: 0,
            unlocked: true
        }, {
            name: "totalResets",
            title: "Resets made",
            val: 0,
            unlocked: false
        },{
            name: "totalParagon",
            title: "Total paragon",
            val: 0,
            unlocked: false
        }, {
            name: "eventsObserved",
            title: "Rare events observed",
            val: 0,
            unlocked: false
        }, {
            name: "unicornsSacrificed",
            title: "Unicorns sacrificed",
            val: 0,
            unlocked: false
        }
    ],
    
    load: function(saveData){
        if (saveData.stats) {
            this.loadMetadata(this.stats, saveData.stats, ["val"]);
        }
    },
    
    save: function(saveData){
        saveData.stats = this.filterMetadata(this.stats, ["name", "val"]);

    },
    
    getStat: function(name){
        return this.getMeta(name, this.stats);
    }
});

dojo.declare("classes.tab.StatsTab", com.nuclearunicorn.game.ui.tab, {

    container: null,

    constructor: function(tabName){

    },

    render: function(content){
        this.container = content;

        this.update();
    },

    update: function(){
        
        /*console.log(this.game, this.game.stats);*/

        var stats = this.game.stats.stats;
        
        dojo.empty(this.container);
        var table = dojo.create("table", null, this.container);
        
        for (var i in stats){
            var stat = stats[i];
            
            if (stat.val > 0){
                stat.unlocked = true;
            }
            
            var tr = dojo.create("tr", null, table);
            dojo.create("td", {
                innerHTML: stat.unlocked ? stat.title : "???"
            }, tr);
            dojo.create("td", {
                style: {
                  paddingLeft: "20px"  
                },
                innerHTML: stat.unlocked ? stat.val : ""
            }, tr);
        }    
    }
});