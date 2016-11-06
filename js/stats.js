dojo.declare("classes.managers.StatsManager", com.nuclearunicorn.core.TabManager, {
    game: null,

    stats:
        [{
            name: "totalKittens",
            title: "Total Kittens",
            val: 0,
            unlocked: true,
			defaultUnlocked: true
        },{
            name: "kittensDead",
            title: "Kittens Dead",
            val: 0,
            unlocked: true,
			defaultUnlocked: true
        },{
            name: "totalYears",
            title: "Total Years Played",
            val: 0,
            unlocked: true,
			defaultUnlocked: true
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
            calculate: function(game){
				var result = game.stats.getStat("totalYears").val != 0 ? game.stats.getStat("totalKittens").val / Math.ceil(game.stats.getStat("totalYears").val / 100) : 0;
				return result;
            },
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
        calculate: function(game){
        	var result = game.calendar.year != 0 ? game.resPool.get("kittens").value / Math.ceil(game.calendar.year / 100) : 0;
        	return result;
        }},{
        name: "timePlayed",
        title: "Time Played (Hours)",
        val: 0,
        calculate: function (game) {
            var cDay = ((game.calendar.year * 400) + ((game.calendar.season - 1) * 100) + game.calendar.day);
            return Math.round(cDay / 1800 * 10) / 10;
        },
        unlocked: false
    }
    ],

    statGroups: null,

    constructor: function(game){
        this.game = game;

        this.statGroups = [
            {
                group: this.stats,
                title: 'All-Time Stats'
            },
            {
                group: this.statsCurrent,
                title: 'Current Game Stats'
            }
        ];
    },

	resetState: function(){
		for (var i = 0; i < this.stats.length; i++){
			var stat = this.stats[i];
			stat.val = 0;
			stat.unlocked = stat.defaultUnlocked || false;
		}

		for (i = 0; i < this.statsCurrent.length; i++){
			var stat = this.statsCurrent[i];
			stat.val = 0;
			stat.unlocked = stat.defaultUnlocked || false;
		}
	},

	save: function(saveData){
        saveData.stats = this.filterMetadata(this.stats, ["name", "val"]);
        saveData.statsCurrent = this.filterMetadata(this.statsCurrent, ["name", "val"]);
    },

    load: function(saveData){
		this.loadMetadata(this.stats, saveData.stats);
		this.loadMetadata(this.statsCurrent, saveData.statsCurrent);
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
        for (var i in this.statsCurrent) {
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

        dojo.empty(this.container);


        for (var idx in this.game.stats.statGroups) {
            var statGroup = this.game.stats.statGroups[idx];

            dojo.create("h1", {
                innerHTML: statGroup.title
            }, this.container);

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