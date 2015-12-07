dojo.declare("classes.managers.StatsManager", com.nuclearunicorn.core.TabManager, {


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
        }
    ],

    calcStatsAllTime: [{
        name: "averageKittens",
        title: "Avg. Kittens Born (Per Century)",
        val: 0,
        calculate: function (game) { return parseInt(game.stats.getStat("totalKittens").val / (game.stats.getStat("totalYears").val / 100)) },
        unlocked: false
    }],

    calcStatsCurrent: [{
        name: "averageKittens",
        title: "Avg. Kittens Born (Per Century)",
        val: 0,
        calculate: function (game) { return parseInt(game.resPool.get("kittens").value / (game.calendar.year / 100)) },
        unlocked: false
    }],

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
    },

    getStatCurrent: function (name) {
        var stat = this.getMeta(name, this.calcStatsCurrent);
        if (stat.calculate) stat.val = stat.calculate(gamePage);
        return stat;
    },

    getStatAllTime: function (name) {
        var stat = this.getMeta(name, this.calcStatsAllTime);
        if (stat.calculate) stat.val = stat.calculate(gamePage);
        return stat;
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

        var statGroups = [
            {
                group: this.game.stats.stats,
                title: 'General Stats'
            },
            {
                group: this.game.stats.calcStatsCurrent,
                title: 'Current Game Stats'
            },
            {
                group: this.game.stats.calcStatsAllTime,
                title: 'All-Time Stats'
            }
        ];

        for (idx in statGroups) {
            var statGroup = statGroups[idx];
            dojo.create("h1", null, this.container).innerHTML = statGroup.title;
            var stats = statGroup.group;
            var table = dojo.create("table", null, this.container);

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
                    style: {
                        paddingLeft: "20px"
                    },
                    innerHTML: stat.unlocked ? this.game.getDisplayValueExt(stat.val) : ""
                }, tr);
            }
        }
        //Add Calculate Stats
        //dojo.create("h1", null, this.container).innerHTML = "Current Game Stats";
        //
        //dojo.create("h1", null, this.container).innerHTML = "All-Time Stats";
        //var calcStats = this.game.stats.calcStatsAllTime;
        //var table = dojo.create("table", null, this.container);
        //
        //for (var i in calcStats) {
        //    var stat = calcStats[i];
        //
        //    stat.val = stat.calculate(this.game);
        //
        //
        //    if (stat.val > 0) {
        //        stat.unlocked = true;
        //    }
        //
        //    var tr = dojo.create("tr", null, table);
        //    dojo.create("td", {
        //        innerHTML: stat.unlocked ? stat.title : "???"
        //    }, tr);
        //    dojo.create("td", {
        //        style: {
        //            paddingLeft: "20px"
        //        },
        //        innerHTML: stat.unlocked ? this.game.getDisplayValueExt(stat.val) : ""
        //    }, tr);
        //}


    }
});