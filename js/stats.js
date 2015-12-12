dojo.declare("classes.managers.StatsManager", com.nuclearunicorn.core.TabManager, {
    game: null,

    stats:
        [{
            name: "totalKittens",
            title: "Total Kittens",
            val: 0,
            unlocked: true
        },{
            name: "kittensDead",
            title: "Kittens Dead",
            val: 0,
            unlocked: true
        },{
            name: "totalYears",
            title: "Total Years Played",
            val: 0,
            unlocked: true
        }, {
            name: "totalResets",
            title: "Resets Made",
            val: 0,
            unlocked: false
        },{
            name: "totalParagon",
            title: "Total Paragon",
            val: 0,
            unlocked: false
        }, {
            name: "eventsObserved",
            title: "Rare Events Observed",
            val: 0,
            unlocked: false
        }, {
            name: "unicornsSacrificed",
            title: "Unicorns Sacrificed",
            val: 0,
            unlocked: false
        }, {
            name: "buildingsConstructed",
            title: "Buildings Constructed",
            val: 0,
            unlocked: false
        }, {
            name: "totalClicks",
            title: "Total Clicks",
            val: 0,
            unlocked: false
        },{
            name: "totalTrades",
            title: "Trades Completed",
            val: 0,unlocked: false
        },{
            name: "totalCrafts",
            title: "Crafting Times",
            val: 0,unlocked: false
        },{
            name: "averageKittens",
            title: "Avg. Kittens Born (Per Century)",
            val: 0,
            calculate: function (game) { return parseInt(game.stats.getStat("totalKittens").val / (game.stats.getStat("totalYears").val / 100)); },
            unlocked: false
        }
    ],

    statsCurrent: [{
        name: "totalTrades",
        title: "Trades Completed",
        val: 0,
        unlocked: false
    },{
        name: "totalCrafts",
        title: "Crafting Times",
        val: 0,
        unlocked: false
    },{
        name: "averageKittens",
        title: "Avg. Kittens Born (Per Century)",
        val: 0,
        calculate: function (game) { return parseInt(game.resPool.get("kittens").value / (game.calendar.year / 100)); },
        unlocked: false
    }],

    //TODO: calculate function should use this.game; not have game passed in. If someone wants to update that.

    constructor: function (game) {
        this.game = game;
    },

    load: function(saveData){
        if (saveData.stats) {
            this.loadMetadata(this.stats, saveData.stats, ["val"]);
        }
        if (saveData.statsCurrent) {
            this.loadMetadata(this.statsCurrent, saveData.statsCurrent, ["val"]);
        }
    },

    save: function(saveData){
        saveData.stats = this.filterMetadata(this.stats, ["name", "val"]);
        saveData.statsCurrent = this.filterMetadata(this.statsCurrent, ["name", "val"]);
    },

    getStat: function(name){
        return this.getMeta(name, this.stats);
    },

    getStatCurrent: function (name) {
        var stat = this.getMeta(name, this.statsCurrent);
        if (stat.calculate) stat.val = stat.calculate(this.game);
        return stat;
    },

    resetStatsCurrent: function () {
        for (i in this.statsCurrent) {
            this.statsCurrent[i].val = 0;
        }
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

        //var stats = this.game.stats.stats;


        dojo.empty(this.container);


        //TODO: This should really be moved to classes.managers.StatsManager; and use a getMeta option.
        //I'm just lazy. - Kida
        var statGroups = [
            {
                group: this.game.stats.stats,
                title: 'All-Time Stats'
            },
            {
                group: this.game.stats.statsCurrent,
                title: 'Current Game Stats'
            }
        ];


        for (idx in statGroups) {
            var statGroup = statGroups[idx];
            dojo.create("h1", null, this.container).innerHTML = statGroup.title;
            var stats = statGroup.group;
            var table = dojo.create("table", {class: 'statTable'}, this.container);

            for (var i in stats) {
                var stat = stats[i];

                if (stat.calculate) {
                    stat.val = stat.calculate(this.game);
                }

                if (stat.val > 0) {
                    stat.unlocked = true;
                }

                var tr = dojo.create("tr", null, table);
                dojo.create("td", {
                    innerHTML: stat.unlocked ? stat.title : "???"
                }, tr);
                dojo.create("td", {
                    innerHTML: stat.unlocked ? this.game.getDisplayValueExt(stat.val) : ""
                }, tr);
            }
        }



    }
});