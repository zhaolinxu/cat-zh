dojo.declare("classes.managers.StatsManager", com.nuclearunicorn.core.TabManager, {
    
    stats:
        [{
            name: "totalKittens",
            title: "Total kittens",
            val: 0
        },{
            name: "kittensDead",
            title: "Kittens dead",
            val: 0
        },{
            name: "totalYears",
            title: "Total years played",
            val: 0
        }, {
            name: "totalParagon",
            title: "Total paragon",
            val: 0
        }, {
            name: "eventsObserved",
            title: "Rare events observed",
            val: 0
        }, {
            name: "unicornsSacrificed",
            title: "Unicorns sacrificed",
            val: 0
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
    },

    update: function(){
        
        /*console.log(this.game, this.game.stats);*/

        var stats = this.game.stats.stats;
        
        dojo.empty(this.container);
        var table = dojo.create("table", null, this.container);
        
        for (var i in stats){
            var tr = dojo.create("tr", null, table);
            dojo.create("td", {
                innerHTML: stats[i].title
            }, tr);
            dojo.create("td", {
                style: {
                  paddingLeft: "20px"  
                },
                innerHTML: stats[i].val
            }, tr);
        }    
    }
});