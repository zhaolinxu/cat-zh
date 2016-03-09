/**
 * Diplomacy
 */
dojo.declare("classes.managers.DiplomacyManager", null, {

	game: null,

	races: [{
		name: "lizards",
		title: "Lizards",
		attitude: "friendly",	//neutral, friendly, aggressive
		standing: 0.25,			//chance of trade success, works differently based on attitude
		unlocked: false,
		buys: [
			{name: "minerals", val: 1000}
		],
		sells:[
			{name: "wood", value: 500, chance: 100, delta: 0.08, seasons:{
				"spring": 0.95,
				"summer": 1.35,
				"autumn": 1.15,
				"winter": 1.05
			}}
		],
		collapsed: false
	},{
		name: "sharks",
		title: "Sharks",
		attitude: "neutral",
		unlocked: false,
		buys: [
			{name: "iron", val: 100}
		],
		sells:[
			{name: "catnip", value: 35000, chance: 100, delta: 0.15, seasons:{
				"spring": 1.20,
				"summer": 0.95,
				"autumn": 1.15,
				"winter": 1.45
			}}
		],
		collapsed: false
	},{
		name: "griffins",
		title: "Griffins",
		attitude: "hostile",
		standing: 0.85,
		unlocked: false,
		buys: [
			{name: "wood", val: 500}
		],
		sells:[
			{name: "iron", value: 250, chance: 100, delta: 0.12, seasons:{
				"spring": 0.75,
				"summer": 0.95,
				"autumn": 1.35,
				"winter": 0.80
			}}
		],
		collapsed: false
	},{
		name: "nagas",
		title: "Nagas",
		attitude: "neutral",
		hidden: true,
		unlocked: false,
		buys: [
			{name: "ivory", val: 500}
		],
		sells:[
			{name: "minerals", value: 1000, chance: 100, delta: 0.18, seasons:{
				"spring": 1.25,
				"summer": 1.05,
				"autumn": 0.65,
				"winter": 0.95
			}}
		],
		collapsed: false
	},{
		name: "zebras",
		hidden: true,
		title: "Zebras",
		attitude: "hostile",
		standing: 0.7,			//evil little bastards
		unlocked: false,
		buys: [
			{name: "slab", val: 50}
		],
		sells:[
			{name: "iron", value: 300, chance: 100, delta: 0.08, seasons:{
				"spring": 1.00,
				"summer": 1.15,
				"autumn": 0.90,
				"winter": 0.80
			}},
			{name: "plate", value: 2, chance: 65, delta: 0.25, seasons:{
				"spring": 1.05,
				"summer": 0.85,
				"autumn": 1.05,
				"winter": 1.25
			}},
			{name: "titanium", value: 1, chance: 0, delta: 0, seasons:{
				"spring": 1,
				"summer": 1,
				"autumn": 1,
				"winter": 1
			}}
		],
		collapsed: false
	},{
		name: "spiders",
		hidden: true,
		title: "Spiders",
		attitude: "friendly",
		standing: 0.15,			//friendly, but not much
		unlocked: false,
		buys: [
			{name: "scaffold", val: 50}
		],
		sells:[
			{name: "coal", value: 350, chance: 100, delta: 0.15, seasons:{
				"spring": 1.00,
				"summer": 1.05,
				"autumn": 1.15,
				"winter": 0.95
			}},
		],
		collapsed: false
	},{
		name: "dragons",
		hidden: true,
		title: "Dragons",
		attitude: "neutral",
		standing: 0.25,
		unlocked: false,
		buys: [
			{name: "titanium", val: 250}
		],
		sells:[
			{name: "uranium", value: 1, chance: 95, delta: 0.25, seasons:{
				"spring": 1,
				"summer": 1,
				"autumn": 1,
				"winter": 1
			}}
		],
		collapsed: false
	},{
        name: "leviathans",
		hidden: true,
		title: "Leviathans",
		energy: 0,
		attitude: "neutral",
		standing: 0.15,
		unlocked: false,
        duration: 0,
		buys: [
			{name: "unobtainium", val: 5000}
		],
		sells:[
			{name: "timeCrystal", value: 0.25, chance: 98, delta: 0.15, seasons:{
				"spring": 1,
				"summer": 1,
				"autumn": 1,
				"winter": 1
			}},
			{name: "sorrow", value: 1, chance: 15, delta: 0.1, seasons:{
				"spring": 1,
				"summer": 1,
				"autumn": 1,
				"winter": 1
			}},
            {name: "starchart", value: 250, chance: 50, delta: 0.8, seasons:{
				"spring": 1,
				"summer": 1,
				"autumn": 1,
				"winter": 1
			}},
			{name: "relic", value: 1, chance: 5, delta: 0, seasons:{
				"spring": 1,
				"summer": 1,
				"autumn": 1,
				"winter": 1
			}}
		],
		collapsed: false
    }],

	constructor: function(game){
		this.game = game;
	},

	get: function(raceName){
		for( var i = 0; i< this.races.length; i++){
			if (this.races[i].name == raceName){
				return this.races[i];
			}
		}
		console.error("Failed to get race for id '"+raceName+"'");
		return null;
	},

	getTradeRatio: function() {
		var tradeRatio = this.game.bld.getEffect("tradeRatio");
		if (this.game.village.leader && this.game.village.leader.trait["name"] == "merchant") {
			tradeRatio += 0.030;
		}
		return tradeRatio;
	},

	resetState: function(){
		for (var i = 0; i < this.races.length; i++){
			var race = this.races[i];
			race.unlocked = false;
			race.collapsed = false;
			race.energy = 0;
			race.duration = 0;
		}
	},

	save: function(saveData){
		saveData.diplomacy = {
			races: this.game.bld.filterMetadata(this.races, ["name", "unlocked", "energy", "duration", "collapsed"])
		};
	},

	load: function(saveData){
		if (saveData.diplomacy){
			var diplomacy = saveData.diplomacy.races;


			if (saveData.diplomacy.races && saveData.diplomacy.races){
				for(var i = 0; i< saveData.diplomacy.races.length; i++){
					var savedRace = saveData.diplomacy.races[i];

					if (savedRace != null){
						var race = this.game.diplomacy.get(savedRace.name);

						race.unlocked = savedRace.unlocked;
						race.collapsed = savedRace.collapsed || false;
						//elders stuff
						race.energy = savedRace.energy || null;
						race.duration = savedRace.duration || null;
					}
				}
			}
		}
	},

	hasUnlockedRaces: function(){
		for (var i = 0; i< this.races.length; i++){
			if (this.races[i].unlocked){
				return true;
			}
		}
		return false;
	},

	unlockRandomRace: function(){
		var unmetRaces = [];
		var hasLockedHiddenRaces = false;

		for (var i = 0; i< this.races.length; i++){
			if (!this.races[i].unlocked ){
				if (!this.races[i].hidden){
					unmetRaces.push(this.races[i]);
				}else{
					hasLockedHiddenRaces = true;
				}
			}
		}

		if (!unmetRaces.length && !hasLockedHiddenRaces){
			return null;
		}

		//nagas like highly cultural kittens :3
		var nagas = this.get("nagas");
		if (!nagas.unlocked && this.game.resPool.get("culture").value >= 1500){
			nagas.unlocked = true;
			return nagas;
		}

		var zebras = this.get("zebras");
		if (!zebras.unlocked && this.game.resPool.get("ship").value >= 1){
			zebras.unlocked = true;
			this.game.workshop.get("caravanserai").unlocked = true;
			return zebras;
		}

		var spiders = this.get("spiders");
		if (!spiders.unlocked && this.game.resPool.get("ship").value >= 100 && this.game.resPool.get("science").maxValue > 125000){
			spiders.unlocked = true;
			return spiders;
		}

		var dragons = this.get("dragons");
		if (!dragons.unlocked && this.game.science.get("nuclearFission").researched){
			dragons.unlocked = true;
			return dragons;
		}

		var raceId = (Math.floor(Math.random()*unmetRaces.length));

		if (unmetRaces[raceId]){	//someone reported a bug there, to be investigated later
			unmetRaces[raceId].unlocked = true;
			return unmetRaces[raceId];
		}
		return null;
	},

	update: function(){
		if (!this.hasUnlockedRaces()){

			var unlockYear = 20;
			if (this.game.karmaKittens > 0 ){
				unlockYear = 5;
			}
			if (this.game.prestige.getPerk("diplomacy").researched){
				unlockYear = 1;
			}

			if (this.game.calendar.year < unlockYear){
				return;
			}

			var race = this.unlockRandomRace();

			this.game.diplomacyTab.visible = true;
			this.game.render();

			this.game.msg("An emissary of " + race.title + " comes to your village", "notice");
		}
	},
    //------------ IDK, silly gimmickish stuff -----------
    unlockElders : function(){
        var elders = this.get("leviathans");
		if (elders.duration){	//elder visits do not stack
			return;
		}

        elders.unlocked = true;
        elders.duration += 200 *  (2  + 1 * elders.energy )  /*5 years + 1 per energy unit*/;

        this.game.msg("Elder gods have arrived", "notice");
    },

    onNewDay: function(){
        var elders = this.get("leviathans");
        if (elders.duration <= 0  && elders.unlocked){
			elders.unlocked = false;
			this.game.msg("Elder gods have departed", "notice");

			this.game.render();

			return;
		}
        if (elders.duration > 0){
            elders.duration--;
        }
    }

});


dojo.declare("classes.diplomacy.ui.RacePanel", com.nuclearunicorn.game.ui.Panel, {
	tradeBtn: null,

	onToggle: function(isToggled){
		this.race.collapsed = isToggled;
	},

	update: function(){
		if (this.tradeBtn){
			this.tradeBtn.update();
		}
	}
});

dojo.declare("classes.diplomacy.ui.EldersPanel", classes.diplomacy.ui.RacePanel, {
	feedBtn: null,

	render: function(container){
		var content = this.inherited(arguments);

		var self = this;
		var feedBtn = new com.nuclearunicorn.game.ui.Button({
				name: "Feed elders",
				description: "Offer a sacrifice to the elders.",
				handler: function(){
					var ncorns = this.game.resPool.get("necrocorn");
					var elders = this.game.diplomacy.get("leviathans");
					if (ncorns.value > 0){
						elders.energy++;
						ncorns.value--;
						this.game.msg("Elder gods are pleased", "notice");
					} else {
						this.game.msg("Elder gods are displeased", "notice");
						elders.duration = 0;
					}
				}
			}, this.game);
		feedBtn.render(content);

		this.feedBtn = feedBtn;
		return content;
	},

	update: function(){
		this.inherited(arguments);
		if (this.feedBtn){
			this.feedBtn.update();
		}
	}
});



dojo.declare("com.nuclearunicorn.game.ui.TradeButton", com.nuclearunicorn.game.ui.ButtonModern, {

	race: null,

	trade25Href: null,
	trade100Href: null,
	tradeAllHref: null,

	simplePrices: false,

	constructor: function(opts, game){
		this.race = opts.race;

		this.handler = this.trade;	//weird hack
	},

	afterRender: function(){
		this.inherited(arguments);
		dojo.addClass(this.domNode, "trade");
	},

	tradeInternal: function(suppressMessages){
		var race = this.race;

		var tradeRes = {
		};

		var tradeRatioAttitude = 0;

		var attitudeChance = this.game.rand(100);
		var standingRatio = this.game.bld.getEffect("standingRatio");
		standingRatio = standingRatio ? standingRatio : 0;

		if (this.game.prestige.getPerk("diplomacy").researched){
			standingRatio += 10;
		}

		if (race.attitude == "hostile" && this.game.rand(100) - standingRatio >= race.standing * 100){	//the less you roll the better
			if (!suppressMessages){
				this.game.msg( race.title + " hate you for no reason", null, "trade");
			}
			return;
		}

		if (race.attitude == "friendly" && this.game.rand(100) - standingRatio/2 <= race.standing * 100){	//confusing part, low standing is ok for friendly races
			if (!suppressMessages){
				this.game.msg( race.title + " think your kittens are adorable", null, "trade");
			}
			tradeRatioAttitude = 0.25;
		}

		if (race.name == "leviathans"){
			//reset energy to default limit
			var duration = (400 + 100 * race.energy);
			if (race.duration > duration){
				race.duration = duration;
			}
		}

		for (var j =0; j< race.sells.length; j++){
			var s = race.sells[j];

			var chance = this.game.rand(100);
			if (chance >= s.chance){
				continue;
			}

			var sratio = s.seasons[this.game.calendar.getCurSeason().name];
			var min = s.value * sratio - s.value * sratio * s.delta/2;
			var amt = min + this.game.rand(s.value * sratio * s.delta);

			var ratio = this.game.diplomacy.getTradeRatio();
			amt += amt*ratio;

			var resValue = amt + amt*tradeRatioAttitude;

			tradeRes[s.name] = tradeRes[s.name] ? tradeRes[s.name] + resValue : resValue;
			this.game.resPool.addResAmt(s.name, resValue);

			//this.game.msg("You've got " + this.game.getDisplayValueExt(amt + amt*tradeRatioAttitude) + " " + s.name);

		}
		//-------------------- 35% chance to get spice ------------------
		if (this.game.rand(100) < 35){
			var spiceVal = this.game.rand(50);
			var resValue = 25 +  spiceVal + spiceVal * this.game.diplomacy.getTradeRatio();

			this.game.resPool.addResAmt("spice", resValue);
			tradeRes["spice"] = tradeRes["spice"] ? tradeRes["spice"] + resValue : resValue;
			//this.game.msg("You've got " + this.game.getDisplayValueExt(val) + " spice");
		}

		//-------------- 10% change to get blueprint ---------------

		if (this.game.rand(100) < 10){
			this.game.resPool.addResAmt("blueprint", 1);
			tradeRes["blueprint"] = tradeRes["blueprint"] ? tradeRes["blueprint"] + 1 : 1;
			//this.game.msg("You've got a blueprint!", "notice");
		}

		//-------------- 15% change to get titanium  ---------------

		var shipVal = this.game.resPool.get("ship").value;
		var shipRate = shipVal * 0.35;		//0.35% per ship to get titanium

		if ( this.game.rand(100) < ( 15 + shipRate ) && race.name == "zebras" ){

			var titaniumAmt = 1.5;
			titaniumAmt += titaniumAmt * ( shipVal / 100 ) * 2;	//2% more titanium per ship

			this.game.resPool.addResAmt("titanium", titaniumAmt);
			tradeRes["titanium"] = tradeRes["titanium"] ? tradeRes["titanium"] + titaniumAmt : titaniumAmt;
			//this.game.msg("You've got " + this.game.getDisplayValueExt(titaniumAmt) + " titanium!", "notice");
		}

		//Update Trade Stats
		this.game.stats.getStat("totalTrades").val += 1;
		this.game.stats.getStatCurrent("totalTrades").val += 1;

		return tradeRes;
	},

	trade: function(){
		var yieldRes = this.tradeInternal();

		this.printYieldOutput(yieldRes);
	},

	tradeMultiple: function(amt){
		//------------ safety measure ----------------
		if (!this.hasMultipleResources(amt)) {
			return;
		}

		//-------------- pay prices ------------------

		this.game.resPool.addResAmt("manpower", -50*amt);
		this.game.resPool.addResAmt("gold", -15*amt);
		this.game.resPool.addResAmt(this.race.buys[0].name, -this.race.buys[0].val*amt);

		//---------- calculate yield -----------------

		this.game.msg("You have sent " + amt + " trade caravans", null, "trade");

		var yieldResTotal = {};
		for (var i = 0; i<amt; i++){
			var yieldRes = this.tradeInternal(true);	//suppress msg

			for (var res in yieldRes) {
				yieldResTotal[res] = yieldResTotal[res] ? yieldResTotal[res] + yieldRes[res] : yieldRes[res];
			}
		}

		this.printYieldOutput(yieldResTotal);
	},

	tradeAll: function(){
		var amt = [
			Math.floor(this.game.resPool.get("manpower").value / 50),
			Math.floor(this.game.resPool.get("gold").value / 15),
			Math.floor(this.game.resPool.get(this.race.buys[0].name).value / this.race.buys[0].val)
		];
		var min = Number.MAX_VALUE;
		for (var i = 0; i < amt.length; i++){
			if (min > amt[i]) { min = amt[i]; }
		}

		if (min == Number.MAX_VALUE || min == 0){
			return;
		}

		this.tradeMultiple(min);
	},

	/**
	 * Prints a formatted output of a trade results based on a resource map
	 */
	printYieldOutput: function(yieldResTotal){
		var output = false;
		for (var res in yieldResTotal){
			if (res == "blueprint"){
				this.game.msg("You've got " + this.game.getDisplayValueExt(yieldResTotal[res]) + " " + res + (yieldResTotal[res] > 1 ? "s" : "") + "!", "notice", "trade");
			} else if (res == "titanium"){
				this.game.msg("You've got " + this.game.getDisplayValueExt(yieldResTotal[res]) + " " + res + "!", "notice", "trade");
			} else {
				var resPool = this.game.resPool.get(res);
				var name = resPool.title || res;
				this.game.msg("You've got " + this.game.getDisplayValueExt(yieldResTotal[res]) + " " + name, null, "trade");
			}
			output = true;
		}

		if (yieldResTotal && !output){
			this.game.msg("Your kittens return empty-pawed", null, "trade");
		}
	},

	renderLinks: function(){
		this.tradeAllHref = this.addLink("all",
			function(){
				this.tradeAll();
			}
		);

		this.trade100Href = this.addLink("x100",
			function(){
				this.tradeMultiple(100);
			}
		);

		this.trade25Href = this.addLink("x25",
			function(){
				this.tradeMultiple(25);
			}
		);

		dojo.setStyle(this.trade100Href.link, "display", this.hasMultipleResources(100) ? "" : "none");
		dojo.setStyle(this.trade25Href.link, "display", this.hasMultipleResources(25) ? "" : "none");
	},

	update: function(){
		this.inherited(arguments);

		dojo.setStyle(this.trade100Href.link, "display", this.hasMultipleResources(100) ? "" : "none");
		dojo.setStyle(this.trade25Href.link, "display", this.hasMultipleResources(25) ? "" : "none");
	},

	hasMultipleResources: function(amt){
		return (this.game.resPool.get("manpower").value >= 50 * amt &&
			this.game.resPool.get("gold").value >= 15 * amt &&
			this.game.resPool.get(this.race.buys[0].name).value >=
				this.race.buys[0].val * amt);
	}
});

dojo.declare("classes.trade.ui.SendExplorersButton", com.nuclearunicorn.game.ui.ButtonModern, {
	simplePrices: false,

	afterRender: function(){
		this.inherited(arguments);

		dojo.addClass(this.domNode, "explore");
	}
});

//==================================================================================
//									DIPLOMACY
//==================================================================================

dojo.declare("com.nuclearunicorn.game.ui.tab.Diplomacy", com.nuclearunicorn.game.ui.tab, {

	racePanels: null,

	constructor: function(tabName, game){
		var self = this;
		this.game = game;

		this.racePanels = [];
	},

	render: function(tabContainer){
		this.inherited(arguments);


		this.buttons = [];

		/*
		 * Once race panel is rendered, we will save the panels states.
		 *
		 * However races can be unlocked in random order, so once new race appear,
		 * we will clear array and reinitialise it again
		 */

		var races = [];
		for (var i = 0; i< this.game.diplomacy.races.length; i++){
			var race = this.game.diplomacy.races[i];
			if (race.unlocked){
				races.push(race);
			}
		}
		if (this.racePanels.length != races.length){
			this.racePanels = [];
		}

		var self = this;

		// expand all / collapse all panels

		var expandDiv = dojo.create("div", { class: "expandAllBar" }, tabContainer);



		var expandAll = dojo.create("a", { innerHTML: "Expand all", href: "#" }, expandDiv);
		dojo.create("span", { innerHTML: " | " }, expandDiv );
		var collapseAll = dojo.create("a", { innerHTML: "Collapse all", href: "#" }, expandDiv);

		for (var i = 0; i< races.length; i++){
			var race = races[i];
			if (!race.unlocked){
				continue;
			}

			var racePanel = this.racePanels[i];
			if (!racePanel){
				if (race.name === "leviathans") {
					racePanel = new classes.diplomacy.ui.EldersPanel(race.title+" <span class='attitude'>"+race.attitude+"</span>");
					racePanel.setGame(this.game);
				} else {
					racePanel = new classes.diplomacy.ui.RacePanel(race.title+" <span class='attitude'>"+race.attitude+"</span>");
				}
				this.racePanels.push(racePanel);
			}
			var content = racePanel.render(tabContainer);
			dojo.addClass(content, "trade-race");

			//---------- render stuff there -------------

			var leftColumn = dojo.create("div", {}, content);
			var rightColumn = dojo.create("div",{}, content);
			var clear = dojo.create("div",{}, content);
			dojo.addClass(leftColumn, "left");
			dojo.addClass(rightColumn, "right");
			dojo.addClass(clear, "clear");

			if(racePanel.feedBtn){
				dojo.place(racePanel.feedBtn.domNode, rightColumn, "first");
			}

			var buys = race.buys[0];
			var res = this.game.resPool.get(buys.name);
			dojo.create("div", {
				innerHTML: "<span class='buys'>Buys: </span>" + (res.title || res.name) + " <span class='ammount'>" + buys.val + "</span>"
			}, leftColumn);

			for (var j =0; j< race.sells.length; j++){
				//if (race.sells[j].chance == 100){
					var s = race.sells[j];
					res = this.game.resPool.get(s.name);
					var min = 0;
					var max = 0;

					if (race.name == "zebras" && s.name == "titanium"){
						var val = 1.5 + (1.5 * this.game.resPool.get("ship").value / 100 * 2);

						min = Math.floor(val);
						max = Math.ceil(val);
					} else {
						var sratio = s.seasons[this.game.calendar.getCurSeason().name];

						var tratio = self.game.diplomacy.getTradeRatio();
						var val = s.value + s.value * tratio;

						min = val * sratio - val * sratio * s.delta/2;
						max = val * sratio + val * sratio * s.delta/2;
					}

					var prefix = ( j == 0) ? "<span class='sells'>Sells: </span>" : "<span class='sells'></span>";
					var div = dojo.create("div", {
							innerHTML: prefix + (res.title || res.name) + " <span class='ammount'>"
								+ this.game.getDisplayValueExt(min, false, false, 0) + " - "
								+ this.game.getDisplayValueExt(max, false, false, 0) + "</span>"
						}, leftColumn);
				//}
			}

			var tradePrices = [{ name: "manpower", val: 50}, { name: "gold", val: 15}];
			tradePrices = tradePrices.concat(race.buys);

			var tradeBtn = new com.nuclearunicorn.game.ui.TradeButton({
				name: "Send caravan",
				description: "Trade some of your stuff for the offered resources. Price may vary from season to season.\nYou also have a small chance of getting rare resources.",
				prices: tradePrices,
				race: race
			}, this.game);
			tradeBtn.render(rightColumn);	//TODO: attach it to the panel and do a lot of update stuff
			racePanel.tradeBtn = tradeBtn;
			racePanel.race = race;
			racePanel.collapse(race.collapsed);
		}

		//-----------------	race panels must be created fist -------------
		dojo.connect(collapseAll, "onclick", this, function(){
			for (var i in this.racePanels) {
				this.racePanels[i].collapse(true);
			}
		});
		dojo.connect(expandAll, "onclick", this, function(){
			for (var i in this.racePanels) {
				this.racePanels[i].collapse(false);
			}
		});

		//------------------------------------

		dojo.create("div", { style: {
				marginBottom: "15px"
		} }, tabContainer);

		var exploreBtn = new classes.trade.ui.SendExplorersButton({
			name: "Send explorers",
			description: "Discover more civilizations",
			prices: [{ name: "manpower", val: 1000}],
			handler: function(btn){
				var dip = btn.game.diplomacy;
				var race = dip.unlockRandomRace();

				if (race){
					btn.game.msg("You've found a new civilization!", "notice");
				} else {

					var hint = "";
					if (!dip.get("nagas").unlocked){
						hint = "Maybe you are not cultural enough.";
					} else if (!dip.get("zebras").unlocked){
						hint = "Maybe you should try to reach another continents.";
					} else if (!dip.get("spiders").unlocked){
						hint = "Maybe you are not scientific enough.";
					} else if (!dip.get("dragons").unlocked){
						hint = "Maybe you should be more technologically advanced.";
					} else {
						hint = "Maybe there are no more civilizations left?";	//AHAHA NO
					}

					btn.game.msg("Your explorers failed to find anyone. *** " + hint + " ***");
					var res = btn.game.resPool.get("manpower");
					res.value += 950;
				}

				btn.game.render();
			}
		}, this.game);
		var btn = exploreBtn.render(tabContainer);
		this.exploreBtn = exploreBtn;

		var clear1 = dojo.create("div",{}, tabContainer);
		dojo.addClass(clear1, "clear");

		this.update();
	},


	update: function(){
		this.inherited(arguments);

		for (var i = 0; i< this.racePanels.length; i++){
			this.racePanels[i].update();
		}

		if (this.exploreBtn){
			this.exploreBtn.update();
		}
		this.updateTab();
	},

	updateTab: function(){
		//-------- update tab title -------
		var elders = this.game.diplomacy.get("leviathans");
		if (elders.unlocked){
			this.tabName = "Trade" + " (!)";
		} else {
			this.tabName = "Trade";
		}
		if (this.domNode) {
			this.domNode.innerHTML = this.tabName;
		}
	},

	rand: function(ratio){
		return (Math.floor(Math.random()*ratio));
	}
});
