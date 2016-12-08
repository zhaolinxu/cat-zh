/**
 * A class for a game page container
 *
 */

/**
 * Workaround for IE9 local storage :V
 *
 * This fix is intended for IE in general and especially for IE9,
 * where localStorage is defined as system variable.
 *
 */

window.LCstorage = window.localStorage;
if (document.all && !window.localStorage) {
    window.LCstorage = {};
    window.LCstorage.removeItem = function () { };
}

/**
 * Just a simple timer, js timer sucks
 */
dojo.declare("classes.game.Timer", null, {
	handlers: [],
	scheduledHandlers: [],

	ticksTotal: 0,
	timestampStart: null,
	totalUpdateTime: null,


	addEvent: function(handler, frequency){
		this.handlers.push({
			handler: handler,
			frequency: frequency,
			phase: 0
		});
	},

	update: function(){
		for (var i= 0; i < this.handlers.length; i++){
			var h = this.handlers[i];
			h.phase--;
			if (h.phase <= 0){
				h.phase = h.frequency;
				h.handler();
			}
		}
	},

	scheduleEvent: function(handler){
		this.scheduledHandlers.push(handler);
	},

	updateScheduledEvents: function(){
		for (var i in this.scheduledHandlers){
			this.scheduledHandlers[i]();
		}
		this.scheduledHandlers = [];
	},

	beforeUpdate: function(){
		this.timestampStart = new Date().getTime();
	},

	afterUpdate: function(){
		this.ticksTotal++;

		var timestampEnd = new Date().getTime();

		var tsDiff = timestampEnd - this.timestampStart;
		this.totalUpdateTime += tsDiff;


		this.currentTime = tsDiff;
		this.averageTime = Math.round(this.totalUpdateTime / this.ticksTotal);
	}
});

dojo.declare("mixin.IDataStorageAware", null, {
	constructor: function(){
		dojo.subscribe("server/save", dojo.hitch(this, this.save));
		dojo.subscribe("server/load", dojo.hitch(this, this.load));
	}
});

dojo.declare("classes.game.Telemetry", [mixin.IDataStorageAware], {

	guid: null,
	game: null,

	constructor: function(game){
		this.guid = this.generateGuid();
		this.game = game;
	},

	generateGuid: function(){
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	},

	save: function(data){
		data["telemetry"] = {
			guid: this.guid
		};
	},

	load: function(data){
		if (data["telemetry"]){
			this.guid = data["telemetry"].guid || this.generateGuid();
		}
	},

	logEvent: function(eventType, payload){
		var event = {
			guid: this.guid,
			type: eventType,
			timestamp: Date.now(),
			payload: payload,
			appId: this.game.server.telemetryAppId
		};

		if (!this.game.opts.disableTelemetry && this.game.server.telemetryUrl) {
			$.ajax({
				url: this.game.server.telemetryUrl,
				type: "POST",
				crossOrigin: true,
				data: JSON.stringify(event),
				dataType: "json",
				contentType: "text/plain"
			});
		}
	}
});


//TODO: to be replaced with actual server call

dojo.declare("classes.game.Server", null, {

	// Server datas
	//---->
	donateAmt: 0,
	telemetryUrl: null,
	telemetryAppId: "KG",

	showMotd: true,
	motdTitle: null,
	motdContent: null,
	//<----

	game: null,
	motdContentPrevious: null,
	motdFreshMessage: false,

	constructor: function(game){
		this.game = game;
	},

	refresh: function(){
		var self = this;

		console.log("Loading server settings...");
		$.ajax({
			cache: false,
			url: "server.json",
			dataType: "json",
			success: function(json) {
				self.donateAmt = json.donateAmt || 0;
				self.telemetryUrl = json.telemetryUrl;
				self.telemetryAppId = json.telemetryAppId;

				self.showMotd = json.showMotd;
				self.motdTitle = json.motdTitle;
				self.motdContent = json.motdContent;
			}
		}).done(function() {
			if (self.motdContentPrevious != self.motdContent) {
				self.motdContentPrevious = self.motdContent;
				self.motdFreshMessage = true;
			}
		}).fail(function(err) {
			console.log("Unable to parse server.json configuration:", err);
		});

	},

	save: function(saveData) {
		saveData.server = {
			motdContent: this.motdContent
		};
	}
});

/**
 * Undo Change state. Represents a change in one or multiple
 */
dojo.declare("classes.game.UndoChange", null, {
    _static:{
        DEFAULT_TTL : 20
    },
    ttl: 0,
    events: null,

    constructor: function(){
        this.events = [];
    },

    addEvent: function(managerId, metaId, value){
        var event = {
            managerId: managerId,
            metaId: metaId,
            value: value
        };

        this.events.push(event);
    }
});

/*
 * Effects metadata manager
 */
dojo.declare("com.nuclearunicorn.game.EffectsManager", null, {
	game: null,

	constructor: function(game){
		this.game = game;
	},

	effectMeta: function(effectName) {
		var game = this.game;
		for (var i = 0; i < game.resPool.resourceData.length; i++) {
			if (effectName.indexOf(game.resPool.resourceData[i].name) == 0) {
				var resname = game.resPool.resourceData[i].name;
				var restitle = (game.resPool.resourceData[i].title) ? game.resPool.resourceData[i].title : resname;
				restitle = restitle.charAt(0).toUpperCase() + restitle.substring(1, restitle.length);
				var type = effectName.substring(resname.length, effectName.length);
				continue;
			}
		}

		switch (true){
			/* Worker pseudoeffect */
			case type == "":
				return {
					//title to be displayed for effect, id if not defined
					title: restitle,
					//effect will be hidden if resource is not unlocked
					resname: resname,
					//value will be affected by opts.usePerSecondValues
					type: "perTick"
				};
			case type == "PerTick":
				return {
					title: restitle,
					resname: resname,
					type: "perTick"
				};
			case type == "Max":
				return {
					title: "Max " + restitle,
					resname: resname
				};
			case type == "Ratio":
				return {
					title: restitle + " bonus",
					resname: resname,
					type: "ratio"
				};
			case type == "DemandRatio":
				return {
					title: restitle + " demand reduction",
					resname: resname,
					type: "ratio"
				};
			case (type == "PerTickBase" || type == "PerTickBaseSpace"):
				return {
					title: restitle + " production",
					resname: resname,
					type: "perTick"
				};
			case (type == "PerTickCon" || type == "PerTickAutoprod" || type == "PerTickProd" || type == "PerTickSpace" || type == "PerTickAutoprodSpace"):
				return {
					title: restitle + " conversion",
					resname: resname,
					type: "perTick"
				};
			default:
				return 0;
		}
	},

	statics: {
		effectMeta: {
			// Specials meta of resources
			"catnipJobRatio" : {
				title: "Farmer tools",
				resName: "catnip",
				type: "ratio"
			},

			"catnipDemandWorkerRatioGlobal": {
				title: "Workers catnip demand reduction",
				resName: "catnip",
				type: "ratio"
			},

			"woodJobRatio" : {
				title: "Woodcutter tools",
				resName: "wood",
				type: "ratio"
			},

			"manpowerJobRatio" : {
				title: "Hunter tools",
				resName: "manpower",
				type: "ratio"
			},

			"coalRatioGlobal" : {
				title: "Coal production penalty",
				resName: "coal",
				type: "ratio"
			},

			"coalRatioGlobalReduction" : {
				title: "Coal production penalty reduction",
				resName: "coal",
				type: "ratio"
			},

			"oilReductionRatio" : {
				title: "Oil consumption reduction",
				type: "ratio"
			},

			//kittens

			"maxKittens" : {
				title: "Kittens"
			},

			"antimatterProduction": {
				title: "Antimatter production",
				type: "perYear"
			},

			"temporalFluxProduction": {
				title: "Temporal Flux production",
				type: "perYear"
			},

			"temporalFluxProductionChronosphere": {
				title: "Chronosphere's temporal flux production",
				type: "perYear"
			},

			// Miscellaneous

			"observatoryRatio" : {
                title: "Observatory's science ratio",
                type: "ratio"
            },

			"magnetoBoostRatio" : {
				title: "Magneto boost",
				resName: "oil",				//this is sort of hack to prevent early spoiler on magnetos
				type: "ratio"
			},

			"learnRatio" : {
				title: "Skills learning",
				type: "perTick"
			},

			"refineRatio": {
				title: "Catnip refine bonus",
				type: "ratio"
			},

			"craftRatio": {
				title: "Craft bonus",
				type: "ratio"
			},

			"happiness": {
				title: "Happiness"
			},

			"unhappinessRatio": {
				title: "Unhappiness reduction",
				type: "ratio"
			},

			"tradeRatio": {
				title: "Trade ratio",
				type: "ratio"
			},

			"standingRatio": {
				title: "Standing ratio",
				type: "ratio"
			},

			"resStasisRatio": {
				title: "Res-Stasis ratio",
				type: "ratio"
			},

			"beaconRelicsPerDay": {
				title: "Relic production",
				type: "perDay"
			},

			"relicPerDay": {
				title: "Relic production",
				type: "perDay"
			},

			"routeSpeed": {
				title: "Space travel speed",
				type: "fixed"
			},

			// energy

			"energyProduction": {
				title: "Energy production",
				type: "energy"
			},
			"energyConsumption": {
				title: "Energy consumption",
				type: "energy"
            },

			//production

            "productionRatio" : {
                title: "Production bonus",
                type: "ratio"
            },

            "magnetoRatio" : {
                title: "Production bonus",
                type: "ratio"
            },

            "spaceRatio" : {
				title: "Space production bonus",
				type: "ratio"
			},

			"prodTransferBonus": {
				title: "Transferred cath production bonus",
				type: "ratio"
			},

            //starEvent

            "starEventChance" : {
                title: "Astronomical event chance",
                type: "ratio"
            },

            "starAutoSuccessChance" : {
                title: "Auto astronomical event chance",
                type: "ratio"
            },

            //in the tab workshop
            "lumberMillRatio" : {
                title: "Lumber Mill bonus",
                type: "ratio"
            },

            "barnRatio" : {
                title: "Barn expansion",
                type: "ratio"
            },

            "warehouseRatio" : {
                title: "Warehouse expansion",
                type: "ratio"
            },

            "acceleratorRatio" : {
                title: "Accelerator expansion",
                type: "ratio"
            },

            "harborRatio" : {
                title: "Harbor'ship expansion",
                type: "ratio"
            },

            "harborCoalRatio" : {
                title: "Harbor coal expansion",
                type: "ratio"
            },

            "catnipMaxRatio" : {
                title: "Catnip storage expansion",
                type: "ratio"
            },

            "hunterRatio" : {
                title: "Hunting effectivness",
                type: "ratio"
            },

            "solarFarmRatio" : {
                title: "Solar Farm bonus",
                type: "ratio"
            },

            "shipLimit" : {
                title: "Ship limit effect",
                type: "ratio"
            },

            "hutPriceRatio" : {
                title: "Hut price reduction",
                type: "ratio"
            },

            "coalSuperRatio" : {
                title: "Coal bonus",
                type: "ratio"
            },

            "smelterRatio" : {
                title: "Smelter bonus",
                type: "ratio"
            },

            "calcinerRatio" : {
                title: "Calciner bonus",
                type: "ratio"
            },

            "calcinerSteelRatio" : {
                title: "Calciner steel production",
                type: "ratio"
            },

            "calcinerSteelCraftRatio" : {
                title: "Steel plants's calciner bonus",
                type: "ratio"
            },

            "calcinerSteelReactorBonus" : {
                title: "Calciner steel production bonus",
                type: "ratio"
            },

            "libraryRatio" : {
                title: "Library bonus",
                type: "ratio"
            },

            "hydroPlantRatio" : {
                title: "Hydro Plant bonus",
                type: "ratio"
            },

            "spaceScienceRatio" : {
                title: "Space science bonus",
                type: "ratio"
            },

            "oilWellRatio" : {
                title: "Oil bonus",
                type: "ratio"
            },

            "unicornsGlobalRatio" : {
                title: "Unicorns bonus",
                type: "ratio"
            },

            "biofuelRatio" : {
                title: "Bio Fuel bonus",
                type: "ratio"
            },

            "blueprintCraftRatio" : {
                title: "Blueprint craft bonus",
                type: "ratio"
            },

            "skillMultiplier" : {
                title: "Kitten's skill effect",
                type: "ratio"
            },

            "uraniumRatio" : {
                title: "Uranium savings",
                type: "ratio"
            },

            "reactorEnergyRatio" : {
                title: "Reactor energy bonus",
                type: "ratio"
            },

			"reactorThoriumPerTick" : {
                title: "Reactor thorium consumption",
                type: "perTick"
            },

            "starchartGlobalRatio" : {
                title: "Starchart bonus",
                type: "ratio"
            },

            "satnavRatio" : {
                title: "Ship's cost savings",
                type: "ratio"
            },

            "broadcastTowerRatio" : {
                title: "Broadcast Tower bonus",
                type: "ratio"
            },

            "cultureMaxRatio" : {
                title: "Max Culture bonus",
                type: "ratio"
            },

            "lunarOutpostRatio" : {
                title: "Lunar Outpost bonus",
                type: "ratio"
            },

            "crackerRatio" : {
                title: "Cracker bonus",
                type: "ratio"
            },

            "factoryRefineRatio" : {
                title: "Factory refine bonus",
                type: "ratio"
            },

            "timeRatio" :  {
                title: "Temporal flux bonus",
                type: "ratio"
            },

            "temporalParadoxVoid" :  {
                title: "Max void",
                type: "perDay"
            },

            "temporalParadoxDay" :  {
                title: "Day in temporal paradox",
                type: "fixed"
            },

            "temporalParadoxDayBonus" :  {
                title: "Day in temporal paradox",
                type: "fixed"
            },

			"unicornsRatioReligion" :  {
                title: "Unicorns bonus",
                type: "ratio"
            },

			"riftChance" :  {
                title: "Unicorns rift chance",
                type: "fixed"
            },

			"ivoryMeteorChance" :  {
                title: "Ivory meteor chance",
                type: "fixed"
            },

            "ivoryMeteorRatio" :  {
                title: "Ivory meteor bonus",
                type: "ratio"
            },

			"alicornChance" :  {
                title: "Alicorns descent chance",
                type: "fixed"
            },

			"tcRefineRatio" :  {
                title: "Alicorns sacrifice bonus",
                type: "ratio"
            },

			"corruptionRatio" :  {
                title: "Corruption ratio",
                type: "ratio"
            },

			"cultureMaxRatioBonus" :  {
                title: "Ziggurat's max culture bonus",
                type: "ratio"
            },

			"faithRatioReligion" :  {
                title: "Faith bonus",
                type: "ratio"
            },

			"relicRefineRatio" :  {
                title: "Relic refine bonus",
                type: "ratio"
            },

			"blsLimit" :  {
                title: "Max BLS",
                type: "integerRatio"
            },

			"tcResourceRatio" :  {
                title: "Max resources bonus",
                type: "ratio"
            },

            "shatterTCGain" :  {
                title: "Shatter TC ressources retrieved",
                type: "ratio"
            },

			"priceRatio" :  {
                title: "Building's prices",
                type: "ratio"
            },

			"kittenGrowthRatio" :  {
                title: "Kittens birth rate",
                type: "ratio"
            },

			"t1CraftRatio" :  {
                title: "Class 1 engineer's know-how",
                type: "fixed"
            },

			"t2CraftRatio" :  {
                title: "Class 2 engineer's know-how",
                type: "fixed"
            },

			"t3CraftRatio" :  {
                title: "Class 3 engineer's know-how",
                type: "fixed"
            },

			"t4CraftRatio" :  {
                title: "Class 4 engineer's know-how",
                type: "fixed"
            },

			"t5CraftRatio" :  {
                title: "Class 5 engineer's know-how",
                type: "fixed"
            },

			// cycleEffects
			"spaceElevator-prodTransferBonus": {
                title: "Space Elevator - Transferred production bonus",
                type: "ratio"
            },

			"sattelite-starchartPerTickBaseSpace": {
                title: "Sattelite - Startchar production",
                type: "ratio"
            },

			"sattelite-observatoryRatio": {
                title: "Sattelite - Observatory's science ratio",
                type: "ratio"
            },

			"spaceStation-scienceRatio": {
                title: "Space Station - Science bonus",
                type: "ratio"
            },

			"moonOutpost-unobtainiumPerTickSpace": {
                title: "Lunar Outpost - Unobtainium conversion",
                type: "ratio"
            },

			"planetCracker-uraniumPerTickSpace": {
                title: "Planet Cracker - Uranium conversion",
                type: "ratio"
            },

			"hydrofracturer-oilPerTickAutoprodSpace": {
                title: "Hydraulic Fracturer - Oil conversion",
                type: "ratio"
            },

			"researchVessel-starchartPerTickBaseSpace": {
                title: "Research Vessel - Starchart production",
                type: "ratio"
            },

			"sunlifter-energyProduction": {
                title: "Sunlifter - Energy production",
                type: "ratio"
            },

			"spaceBeacon-starchartPerTickBaseSpace": {
                title: "Space Beacon - Starchart production",
                type: "ratio"
            }
		}
	}
});

/**
 * Main game class, can be accessed globally as a 'gamePage' variable
 */

dojo.declare("com.nuclearunicorn.game.ui.GamePage", null, {

	id: null,

	tabs: null,

	//components:

	resPool: null,
	calendar: null,
	bld: null,
	village: null,
	science: null,
	workshop: null,
	diplomacy: null,
	achievements: null,

	console: null,
	telemetry: null,
	server: null,

	//global cache
	globalEffectsCached: {},

	//how much ticks are performed per second ( 5 ticks, 200 ms per tick)
	rate: 5,

	//I wonder why someone may need this
	isPaused: false,

	ticksBeforeSave: 400,	//40 seconds ~

	//in ticks
	autosaveFrequency: 400,

	//current building selected in the Building tab by a mouse cursor, should affect resource table rendering
	selectedBuilding: null,
	setSelectedObject: function(object) {
		this.selectedBuilding = object;
	},
	clearSelectedObject: function() {
		this.selectedBuilding = null;
	},

	//=============================
	//		option settings
	//=============================
	forceShowLimits: false,
	forceHighPrecision: false,
	useWorkers: false,
	colorScheme: "",

	timer: null,

	//===========================================
	//game-related flags that will go to the save
	//===========================================

	//on a side note, I hate those flags. Could we use gamePage.opts = []/{}; ?
	karmaKittens: 0,	//counter for karmic reincarnation
	karmaZebras: 0,
	deadKittens: 0,
	ironWill: true,		//true if player has no kittens or housing buildings

	saveVersion: 15,

	//FINALLY
	opts: null,

	gatherTimeoutHandler: null,	//timeout till resetting gather counter, see below
	gatherClicks: 0,	//how many clicks in a row was performed on a gather button
	cheatMode: false,	//flag triggering Super Unethical Climax achievement

	ticks: 0,				//how many ticks passed since the start of the game
	totalUpdateTime: [0, 0, 0, 0, 0],	//total time spent on update cycle in milliseconds, useful for debug/fps counter. 1 ticks per second have more calculations
	totalUpdateTimeTicks: 5,
	totalUpdateTimeCurrent : 0,

	pauseTimestamp: 0, //time of last pause

	//resource table
	resTable: null,

	effectsMgr: null,

    managers: null,

    keyStates: {
		shiftKey: false
	},

    //TODO: this can potentially be an array
    undoChange: null,

    //ui communication layer
    ui: null,

    //==========    external API's ========
    dropBoxClient: null,

    kongregate: null,

	/*
		Whether the game is in developer mode or no
	 */
	isLocalhost: false,
	devMode: false,

	constructor: function(containerId){
		this.id = containerId;

		this.tabs = [];
        this.managers = [];

		this.opts = {
			usePerSecondValues: true,
			usePercentageResourceValues: false,
			highlightUnavailable: false,
			hideSell: false,
			noConfirm: false,
			IWSmelter: true,
			disableCMBR: false,
			disableTelemetry: true
		};

		this.console = new com.nuclearunicorn.game.log.Console();
		this.telemetry = new classes.game.Telemetry(this);
		this.server = new classes.game.Server(this);
		var data = LCstorage["com.nuclearunicorn.kittengame.savedata"];
		if (data){
			var saveData = JSON.parse(data);
			if (saveData && saveData.server){
				this.server.motdContentPrevious = saveData.server.motdContent;
			}
		}

		this.resPool = new classes.managers.ResourceManager(this);
		this.calendar = new com.nuclearunicorn.game.Calendar(this, dojo.byId("calendarDiv"));

		this.village = new classes.managers.VillageManager(this);
		this.resPool.setVillage(this.village);

        var managers = [
            { id: "workshop",       class:  "WorkshopManager"   },
            { id: "diplomacy",      class:  "DiplomacyManager"  },
            { id: "bld",            class:  "BuildingsManager"  },
            { id: "science",        class:  "ScienceManager"    },
            { id: "achievements",   class:  "Achievements"      },
            { id: "religion",       class:  "ReligionManager"   },
            { id: "space",          class:  "SpaceManager"      },
			{ id: "time",           class:  "TimeManager"       },
            { id: "prestige",       class:  "PrestigeManager"   },
            { id: "challenges",     class:  "ChallengesManager" },
            { id: "stats",       	class:  "StatsManager"      }
        ];

        for (var i in managers){
            var manager = managers[i];
			if (!window["classes"]["managers"][manager.class]){
				throw "Unable to load tab manager '" + manager.class + "'";
			}

            this[manager.id] = new window["classes"]["managers"][manager.class](this);

            this.managers.push(this[manager.id]);
        }

		//very sloppy design, could we just use an array for tab managers?
		var bldTabV2 = new com.nuclearunicorn.game.ui.tab.BuildingsModern("Bonfire", this);
		this.addTab(bldTabV2);

		this.villageTab = new com.nuclearunicorn.game.ui.tab.Village("Small village", this);
		this.villageTab.visible = false;
		this.addTab(this.villageTab);

		this.libraryTab = new com.nuclearunicorn.game.ui.tab.Library("Science", this);
		this.libraryTab.visible = false;
		this.addTab(this.libraryTab);

		this.workshopTab = new com.nuclearunicorn.game.ui.tab.Workshop("Workshop", this);
		this.workshopTab.visible = false;
		this.addTab(this.workshopTab);

		this.diplomacyTab = new com.nuclearunicorn.game.ui.tab.Diplomacy("Trade", this);
		this.diplomacyTab.visible = false;
		this.addTab(this.diplomacyTab);

		this.religionTab = new com.nuclearunicorn.game.ui.tab.ReligionTab("Religion", this);
		this.religionTab.visible = false;
		this.addTab(this.religionTab);

		this.spaceTab = new com.nuclearunicorn.game.ui.tab.SpaceTab("Space", this);
		this.spaceTab.visible = false;
		this.addTab(this.spaceTab);

		this.timeTab = new classes.tab.TimeTab("Time", this);
		this.timeTab.visible = false;
		this.addTab(this.timeTab);

		this.achievementTab = new com.nuclearunicorn.game.ui.tab.AchTab("Achievements", this);
		this.achievementTab.visible = false;
		this.addTab(this.achievementTab);

        this.statsTab = new classes.tab.StatsTab("Stats", this);
        this.statsTab.visible = false;
        this.addTab(this.statsTab);

		//vvvv do not forget to toggle tab visibility below

		this.timer = new classes.game.Timer();

		//Update village resource production.
		//Since this method is CPU heavy and rarely used, we will call with some frequency, but not on every tick
		this.timer.addEvent(dojo.hitch(this, function(){
			this.village.updateResourceProduction();
		}), 10);	//every 2 seconds

		this.timer.addEvent(dojo.hitch(this, function(){
			this.updateCaches();
		}), 5);		//once per 5 ticks

		this.resTable = new com.nuclearunicorn.game.ui.GenericResourceTable(this, "resContainer");

		this.craftTable = new com.nuclearunicorn.game.ui.CraftResourceTable(this, "craftContainer");
		this.timer.addEvent(dojo.hitch(this, function(){ this.craftTable.update(); }), 3);	//once per 3 tick

		this.timer.addEvent(dojo.hitch(this, function(){ this.achievements.update(); }), 50);	//once per 50 ticks, we hardly need this
		this.timer.addEvent(dojo.hitch(this, function(){ this.server.refresh(); }), this.rate * 60 * 10);	//reload MOTD and server info every 10 minutes
		this.timer.addEvent(dojo.hitch(this, function(){ this.heartbeat(); }), this.rate * 60 * 10);	//send heartbeat every 10 min	//TODO: 30 min eventually


		this.effectsMgr = new com.nuclearunicorn.game.EffectsManager(this);

		//--------------------------
		var dropBoxClient = new Dropbox.Client({ key: 'u6lnczzgm94nwg3' });
		/*https://bloodrizer.ru/games/kittens/dropboxauth.html*/
		var driver = new Dropbox.AuthDriver.Popup({receiverUrl: "https://bloodrizer.ru/games/kittens/dropboxauth.html"});
		dropBoxClient.authDriver(driver);

		this.dropBoxClient = dropBoxClient;
	},

	heartbeat: function(){
		this.telemetry.logEvent("heartbeat", {
			opts: this.opts,
			year: this.calendar.year
		});
	},

	/**
	 * Management of effects
	 */
	getEffectMeta: function(effectName) {
		// Try to create Meta automatically, if it fails, check statics, if it fails, by default
		var effectMetaDynamic = this.effectsMgr.effectMeta(effectName);
		if (effectMetaDynamic != 0) {
			return effectMetaDynamic;
		} else {
			var effectMetaStatic = this.effectsMgr.statics.effectMeta[effectName];
			if (typeof(effectMetaStatic) != "undefined") {
				return this.effectsMgr.statics.effectMeta[effectName];
			} else {
				return { title: effectName };
			}
		}
	},

	getEffect: function(effectName){
		 return this.globalEffectsCached[effectName] || 0;
	},

	updateCaches: function() {
		this.globalEffectsCached = {};

		this.workshop.updateEffectCached();
		this.religion.updateEffectCached();
		this.bld.updateEffectCached();
		this.challenges.updateEffectCached();
		this.prestige.updateEffectCached();
		this.space.updateEffectCached();
		this.time.updateEffectCached();
		// TODO : village cache

		this.updateResources();
	},

	// Returns a parabolic-approaching value of the effect that heads to the limit, but unable to approach it completely
	// Updated 7/8/2014: Update for limits that aren't 1. They would scale at the same speed as a limit of 1 and wouldn't properly approach the limit.
	getHyperbolicEffect: function(effect, limit){
		var absEffect = Math.abs(effect);

		var maxUndiminished = 0.75 * limit; //first 75% is free from diminishing returns

		if (absEffect <= maxUndiminished) {
			//Not high enough for diminishing returns to apply
			return effect < 0 ? -absEffect : absEffect;
		}

		var diminishedPortion = absEffect - maxUndiminished;

		var delta = 0.25 * limit; //Lower values will approach 1 more quickly.

		// The last 25% will approach .25 but cannot actually reach it
		var diminishedEffect = (1-(delta/(diminishedPortion+delta)))*0.25*limit;

		var totalEffect = maxUndiminished+diminishedEffect;

		return effect < 0 ? -totalEffect : totalEffect;
	},

	isHyperbolic: function(name) {
		return (name == "catnipDemandRatio" ||
			name == "fursDemandRatio" ||
			name == "ivoryDemandRatio" ||
			name == "spiceDemandRatio" ||
			name == "unhappinessRatio");
	},

	/**
	 * Display a message in the console. Returns a <span> node of a text container
	 */
	msg: function(message, type, tag, noBullet){
		var hasCalendarTech = this.science.get("calendar").researched;


		var messageLine = this.console.static.msg(message, type, tag, noBullet);
		if (messageLine && hasCalendarTech){
			this.console.static.msg("Year " + this.calendar.year.toLocaleString() + " - " + this.calendar.getCurSeasonTitle(), "date", null, false);
		}

		return messageLine;
	},

	clearLog: function(){
		this.console.static.clear();
	},

	saveUI: function(){
		this.save();

		dojo.style(dojo.byId("saveTooltip"), "opacity", "1");
		dojo.animateProperty({
			node:"saveTooltip",
			properties: {
				opacity: 0
			},
			duration: 1200
		}).play();
	},

	resetState: function(){
		this.forceShowLimits = false;
		this.forceHighPrecision = false;
		this.useWorkers = false;
		this.colorScheme = "";
		this.karmaKittens = 0;
		this.karmaZebras = 0;
		this.ironWill = true;
		this.deadKittens = 0;
		this.cheatMode = false;

		if (this.pauseTimestamp){
			this.pauseTimestamp = Date.now();
		}

		this.opts = {
			usePerSecondValues: true,
			usePercentageResourceValues: false,
			highlightUnavailable: false,
			hideSell: false,
			noConfirm: false,
			IWSmelter: true,
			disableCMBR: false,
			disableTelemetry: false
		};

		this.resPool.resetState();
		this.village.resetState();
		this.calendar.resetState();
		this.ui.resetConsole();

		for (var i in this.managers){
			this.managers[i].resetState();
		}

		for (var i in this.tabs){
			if (this.tabs[i].tabId != "Bonfire"){
				this.tabs[i].visible = false;
			}
		}

		this.globalEffectsCached = {};
	},

	_publish: function(topic, arg){
		if (dojo.version.minor == 6) {
			dojo.publish(topic, [arg]);
		} else {
			dojo.publish(topic, arg);
		}
	},

	save: function(){
		this.ticksBeforeSave = this.autosaveFrequency;

		var saveData = {
			saveVersion: this.saveVersion,
			resources: this.resPool.filterMetadata(
				this.resPool.resources, ["name", "value", "unlocked", "isHidden"]
			)
		};

		this.server.save(saveData);
		this.resPool.save(saveData);
		this.village.save(saveData);
		this.calendar.save(saveData);
		this.console.static.save(saveData);

        for (var i in this.managers){
            this.managers[i].save(saveData);
        }

		saveData.game = {
			forceShowLimits: this.forceShowLimits,
			forceHighPrecision: this.forceHighPrecision,
			useWorkers: this.useWorkers,
			colorScheme: this.colorScheme,
			karmaKittens: this.karmaKittens,
			karmaZebras: this.karmaZebras,
			ironWill : this.ironWill,
			deadKittens: this.deadKittens,
			cheatMode: this.cheatMode,

			opts : this.opts
		};

		this._publish("server/save", saveData);
		LCstorage["com.nuclearunicorn.kittengame.savedata"] = JSON.stringify(saveData);

		console.log("Game saved");
	},

	wipe: function(){
		delete(LCstorage["com.nuclearunicorn.kittengame.savedata"]);
	},

	closeOptions: function() {
		$('#optionsDiv').hide();
		this.render();
	},

	toggleScheme: function(){
		var schemeToggle = dojo.byId("schemeToggle");
		this.colorScheme = schemeToggle.value;

		this.updateOptionsUI();
	},

	togglePause: function(){
		var pauseBtn = dojo.byId("pauseBtn");
		this.isPaused = !this.isPaused;
		pauseBtn.innerHTML = this.isPaused ? "unpawse" : "pawse";

		if (this.isPaused){
			this.pauseTimestamp = Date.now();
		} else if (this.pauseTimestamp){
			this.time.gainTemporalFlux(this.pauseTimestamp);
			this.pauseTimestamp = 0;
		}
	},

	updateOptionsUI: function(){
		this.ui.updateOptions();
	},

	load: function(){
		var data = LCstorage["com.nuclearunicorn.kittengame.savedata"];
		this.resetState();
		if (!data){
			this.calculateAllEffects();
			this.updateOptionsUI();
			return;
		}
		var success = true;

		try {
			var saveData = JSON.parse(data);

			//console.log("restored save data:", localStorage);
			if (saveData){
				if (!saveData.saveVersion || saveData.saveVersion != this.saveVersion) {
					this.migrateSave(saveData);
				}

				this.resPool.load(saveData);
				this.village.load(saveData);
				this.calendar.load(saveData);
				this.console.static.load(saveData);
				this.ui.renderFilters();

                for (var i in this.managers){
                    this.managers[i].load(saveData);
                }

				dojo.publish("server/load", saveData);
			}
		} catch (ex) {
			console.error("Unable to load game data: ", ex);
			if (dojo.version.minor == 6) {
				console.log(new Error().stack);
			} else {
				console.trace();
			}

			this.msg("Unable to load save data. Close the page and contact the dev.");
			success = false;
		}

		// Calculate effects (needs to be done after all managers are loaded)
		this.calculateAllEffects();

		if (saveData && saveData.game){
			var data = saveData.game;

			//something should really be done with this mess there
			this.forceShowLimits = data.forceShowLimits ? data.forceShowLimits : false;
			this.colorScheme = data.colorScheme ? data.colorScheme : null;

			this.karmaKittens = (data.karmaKittens !== undefined) ? data.karmaKittens : 0;
			this.karmaZebras = (data.karmaZebras !== undefined) ? data.karmaZebras : 0;
			this.deadKittens = (data.deadKittens !== undefined) ? data.deadKittens : 0;
			this.ironWill = (data.ironWill !== undefined) ? data.ironWill : true;
			this.useWorkers = (data.useWorkers !== undefined) ? data.useWorkers : false;

			this.cheatMode = (data.cheatMode !== undefined) ? data.cheatMode : false;
			this.forceHighPrecision = (data.forceHighPrecision !== undefined) ? data.forceHighPrecision : false;

			// ora ora
			if (data.opts){
				for (var opt in data.opts){
					this.opts[opt] = data.opts[opt];
				}
			}

			this.updateOptionsUI();
		}
		//------------------------------------

		this.villageTab.visible = (this.bld.get("hut").on > 0
			|| this.resPool.get("kittens").unlocked
			|| this.resPool.get("zebras").unlocked
			|| this.time.getVSU("usedCryochambers").val > 0);
		this.libraryTab.visible = (this.bld.get("library").on > 0);
		this.workshopTab.visible = (this.bld.get("workshop").on > 0);
		this.achievementTab.visible = (this.achievements.hasUnlocked());
		this.statsTab.visible = (this.karmaKittens > 0 || this.science.get("math").researched);

		this.diplomacyTab.visible = (this.diplomacy.hasUnlockedRaces());
		this.religionTab.visible = (this.resPool.get("faith").value > 0 || this.challenges.currentChallenge == "atheism" && this.bld.get("ziggurat").val > 0);
		this.spaceTab.visible = (this.science.get("rocketry").researched);
		this.timeTab.visible = (this.science.get("calendar").researched || this.time.getVSU("usedCryochambers").val > 0);

		return success;
	},

	//btw, ie11 is horrible crap and should not exist
	saveExport: function(){
		this.save();

		var data = LCstorage["com.nuclearunicorn.kittengame.savedata"];

		var is_chrome = /*window.chrome*/ true;
		if (is_chrome){
			$("#exportDiv").show();
			$("#exportData").val(LZString.compressToBase64(data));
			$("#exportData").select();
		} else {
			window.prompt("Copy to clipboard: Ctrl+C, Enter", btoa(data));
		}
	},

	saveImport: function(){
		if (!window.confirm("Are your sure? This will overwrite your save!")){
			return;
		}
		var data = $("#importData").val();
		data = data.replace(/\s/g, "");

		var decompress = LZString.decompressFromBase64(data);
		var json;
		if (decompress) {
			json = decompress;
		} else {
			json = atob(data);
		}

		if (!json) {
			return;
		}
		this.timer.scheduleEvent(dojo.hitch(this, function(){
			LCstorage["com.nuclearunicorn.kittengame.savedata"] = json;
			var success = this.load();
			if (success){
				this.msg("Save import successful!");
			}

			this.render();
		}));
		$('#exportDiv').hide();
		$('#optionsDiv').hide();
	},

	saveExportDropbox: function(){
		this.save();
		var data = LCstorage["com.nuclearunicorn.kittengame.savedata"];
		var lzdata = LZString.compressToBase64(data);

		var game = this;

		//cached authentification
		this.dropBoxClient.authenticate({interactive:false});
		if (this.dropBoxClient.isAuthenticated()){
			game.dropBoxClient.writeFile('kittens.save', lzdata, function (){
				game.msg("Save export successful!");
				$('#exportDiv').hide();
				$('#optionsDiv').hide();
			});
			return;
		}

		//interactive authentification
		this.dropBoxClient.authenticate(function (error, client) {
			client.writeFile('kittens.save', lzdata, function (){
				game.msg("Save export successful!");
				$('#exportDiv').hide();
				$('#optionsDiv').hide();
			});
		});
	},

	saveImportDropbox: function(){
		if (!window.confirm("Are your sure? This will overwrite your save!")){
			return;
		}

		var game = this;
		this.dropBoxClient.authenticate({interactive:false});
		if (this.dropBoxClient.isAuthenticated()){
			game.dropBoxClient.readFile('kittens.save', {}, function (error, lzdata){
				game.timer.scheduleEvent(dojo.hitch(game, game._loadSaveJson, lzdata));
				$('#importDiv').hide();
				$('#optionsDiv').hide();
			});
			return;
		}

		this.dropBoxClient.authenticate(function (error, client) {
			client.readFile('kittens.save', {}, function (error, lzdata){
				game.timer.scheduleEvent(dojo.hitch(game, game._loadSaveJson, lzdata));
				$('#importDiv').hide();
				$('#optionsDiv').hide();
			});
		});
	},

	//TODO: add some additional checks and stuff?
	_loadSaveJson: function(lzdata){
		var json = LZString.decompressFromBase64(lzdata);
		LCstorage["com.nuclearunicorn.kittengame.savedata"] = json;

		this.load();
		this.msg("Save import successful!");

		this.render();
	},

	migrateSave: function(save) {
		if (save.saveVersion === undefined) {
			save.saveVersion = 1;
		}

		if (save.saveVersion == 1) {
			// Move Lunar Outpost and Moon Base from programs to moon planet
			if (save.space && save.space.programs && save.space.planets) {
				var buildings = [];
				for (var i = 0; i < save.space.programs.length; i++) {
					var program = save.space.programs[i];
					if (program.name == "moonOutpost" || program.name == "moonBase") {
						program.unlocked = true;
						buildings.push(program);
						save.space.programs.splice(i, 1);
						// Next element has moved back into current index because of splice
						i--;
					}
				}
				for (var i = 0; i < save.space.planets.length; i++) {
					if (save.space.planets[i].name == "moon") {
						save.space.planets[i].buildings = buildings;
						break;
					}
				}
			}

			save.saveVersion = 2;
		}

		if (save.saveVersion == 2) {
			// Move !noStackable programs from programs to cath planet
			if (save.space && save.space.programs && save.space.planets) {
				var buildings = [];
				for (var i = 0; i < save.space.programs.length; i++) {
					var program = save.space.programs[i];
					if (program.name == "spaceElevator" || program.name == "sattelite" || program.name == "spaceStation") {
						program.unlocked = true;
						buildings.push(program);
						save.space.programs.splice(i, 1);
						// Next element has moved back into current index because of splice
						i--;
					}
				}
				save.space.planets.push({name: "cath", buildings: buildings});
			}

			save.saveVersion = 3;
		}

		if (save.saveVersion == 3) {
			// Use .on instead of .val and .enabled for all buildings
			if (save.buildings) {
				for (var i = 0; i < save.buildings.length; i++) {
					save.buildings[i].on = save.buildings[i].val;
				}
			}

			save.saveVersion = 4;
		}

		if (save.saveVersion == 4) {
			// Use .on instead of .val and .enabled for all buildings
			if (save.religion.ru) {
				for (var i = 0; i < save.religion.ru.length; i++) {
					var saveRU = save.religion.ru[i];
					// Hack to fix old saves
					if (saveRU.researched && (saveRU.val == 0 || saveRU.val == null)) {
						saveRU.val = 1;
					}
					saveRU.on = saveRU.val;
				}
			}
			if (save.space) {
				if (save.space.programs) {
					for (var i = 0; i < save.space.programs.length; i++) {
						if (save.space.programs[i].researched) {
							save.space.programs[i].on = 1;
							save.space.programs[i].val = 1;
						}
					}
				}
				if (save.space.planets) {
					for (i = 0; i < save.space.planets.length; i++){
						var planet = save.space.planets[i];
						if (planet.buildings){
							for (var j = 0; j < planet.buildings.length; j++){
								var building = planet.buildings[j];
								building.on = building.val;
							}
						}
					}
				}
			}

			save.saveVersion = 5;
		}

		if (save.saveVersion == 5) {
			// Move energy into a true resource
			if (save.time && save.time.energy && save.resources) {
				var changement = false;
				for (var i = 0; i < save.resources.length; i++) {
					var res = save.resources[i];
					if (res.name == "temporalFlux") {
						res.value = save.time.energy;
						changement = true;
						break;
					}
				}
				if (!changement) {
					var resTE = {
						name : "temporalFlux",
						title: "temporal flux",
						description: "",
						type : "exotic",
						craftable: false,
						visible: false,
						persists: true,
						value: save.time.energy
					};
					save.resources.push(resTE);
				}
			}

			save.saveVersion = 6;
		}

		if (save.saveVersion == 6) {
			if (save.religion){
				if (save.religion.zu) {
					for (i = 0; i < save.religion.zu.length; i++){
						save.religion.zu[i].on = save.religion.zu[i].val;
					}
				}
				if (save.religion.tu) {
					for (i = 0; i < save.religion.tu.length; i++){
						save.religion.tu[i].on = save.religion.tu[i].val;
					}
				}
			}
			if (save.time){
				if (save.time.usedCryochambers) {
					for (i = 0; i < save.time.usedCryochambers.length; i++){
						save.time.usedCryochambers[i].on = save.time.usedCryochambers[i].val;
					}
				}
				if (save.time.cfu) {
					for (i = 0; i < save.time.cfu.length; i++){
						save.time.cfu[i].on = save.time.cfu[i].val;
					}
				}
				if (save.time.vsu) {
					for (i = 0; i < save.time.vsu.length; i++){
						save.time.vsu[i].on = save.time.vsu[i].val;
					}
				}
			}

			save.saveVersion = 8;
		}

		if (save.saveVersion == 8) {
			if (typeof(save.challenges) == "undefined"){
				save.challenges = [];
			}
			save.challenges.currentChallenge = null;

			save.saveVersion = 9;
		}

		if (save.saveVersion == 9) {
			if (save.buildings) {
				for(var i = 0; i < save.buildings.length; i++){
					save.buildings[i].unlockable = save.buildings[i].unlocked;
					save.buildings[i].unlocked = false;
				}
			}
			if (save.space && save.space.programs) {
				for (var i = 0; i < save.space.programs.length; i++) {
					if (save.space.programs[i].name == "rorschachMission" && save.space.programs[i].on == 1) {
						var centaurusSystemMission = {
							name: "centaurusSystemMission",
							val: 0,
							on: 0,
							unlocked: true
						};
						save.space.programs.push(centaurusSystemMission);
					}
				}
			}

			save.saveVersion = 10;
		}

		if (save.saveVersion == 10) {
			if (save.resources){
				for(var i = 0; i< save.resources.length; i++){
					save.resources[i].unlocked = false;
				}
			}

			save.saveVersion = 11;
		}

		if (save.saveVersion == 11) {
			if (typeof(save.challenges) == "undefined"){
				save.challenges = [];
			}
			if (save.religion && save.religion.ru) {
				for (var i = 0; i < save.religion.ru.length; i++) {
					if (save.religion.ru[i].name == "transcendence" && save.religion.ru[i].on == 1) {
						var atheism = {
							name: "atheism",
							researched: false,
							unlocked: true
						};
						if (typeof save.challenges.challenges == "undefined") {
							save.challenges.challenges = [];
						}
						save.challenges.challenges.push(atheism);
						break;
					}
				}
			}

			save.saveVersion = 12;
		}

		if (save.saveVersion == 12) {
			if (save.religion && save.religion.tcratio && save.religion.tu) {
				var transcendenceLevel = this.religion.getTriValueReligion(save.religion.tcratio) * 100;
				transcendenceLevel = Math.round(Math.log(transcendenceLevel));
					if (transcendenceLevel < 0) {
						transcendenceLevel = 0;
					}
				for (var i = 0; i < save.religion.tu.length; i++) {
					if (transcendenceLevel >= this.religion.getTU(save.religion.tu[i].name).tier) {
						save.religion.tu[i].unlocked = true;
					}
				}
			}

			save.saveVersion = 13;
		}

		if (save.saveVersion == 13) {
			if (save.challenges && save.challenges.challenges) {
				for (var i = 0; i < save.challenges.challenges.length; i++) {
					if (save.challenges.challenges[i].name == "atheism") {

						save.challenges.challenges[i].unlocked = false;

						if (save.science && save.science.techs) {
							for (var j = 0; j < save.science.techs.length; j++) {
								if (save.science.techs[j].name == "voidSpace" && save.science.techs[j].researched == true) {
									save.challenges.challenges[i].unlocked = true;
								}
							}
						}

					}
				}
			}

			save.saveVersion = 14;
		}

		if (save.saveVersion == 14) {
			if (save.space && save.space.planets) {
				for (var i in save.space.planets){
					var planet = save.space.planets[i];
					if (planet.buildings){
						for (var j in planet.buildings) {
							var building = planet.buildings[j];
							if (typeof(building.unlocked) != "undefined") {
								building.unlockable = building.unlocked;
							} else {
								building.unlockable = false;
							}
						}
					}
				}
			}

			save.saveVersion = 15;
		}

		return save;

	},

    setUI: function(ui){
        this.ui = ui;
        ui.setGame(this);
    },

	render: function(){
        if (!this.ui){
            throw "Unable to render game state, no UI manager";
        }

        this.ui.render();

		// Once we have rendered the page immidiately update it in order to
		// reduce flicker
		this.update();
		this.calendar.update();
	},

	/**
	 * Returns an estimated production amount per tick for a given resource.
	 *
	 * If calcAutomatedEffect is true, it will also estimate the conditional effects for automated structures,
	 * like smelters or calciners. calcAutomatedEffect should be typically off, or you will give DOUBLE resources for auto structures
	 *
	 * If season is provided, the method will use given season modifiers for resource estimation.
	 * Current resource will be used otherwise.
	 */


	//====================== ONE DAY =====================================
	/*getResourcePerTick: function(resName, calcAutomatedEffect, season){
		var stack = this.getResourcePerTickStack(resName, season);
		var perTick = this.getStackPerTick(stack, calcAutomatedEffect, season);

		return perTick;
	},

	getStackPerTick: function(stack, calcAutomatedEffect, season){
		var perTick = 0;

		for (var i = 0; i< stack.length; i++){
			var s = stack[i];

			if (s.length){
				perTick += this.getStackPerTick(s, calcAutomatedEffect, season) || 0;
			}

			if (s.automated && !calcAutomatedEffect){
				continue;
			}

			if (s.type == "fixed"){
				perTick += s.value || 0;
			} else if (s.type == "ratio"){
				perTick *= (1 + s.value || 0);
			}

		}

		if (isNaN(perTick)){
			return 0;
		}
		return perTick;
	}, */

	calcResourcePerTick: function(resName, season){
		var res = this.resPool.get(resName);

		// BUILDING PerTickBase
		var perTick = this.getEffect(res.name + "PerTickBase");

		// SPACE RATIO CALCULATION
		var spaceRatio = 1 + this.getEffect("spaceRatio");
		if (this.workshop.get("spaceManufacturing").researched && res.name!="uranium"){
			var factory = this.bld.get("factory");
			spaceRatio *= (1 + factory.on * factory.effects["craftRatio"] * 0.75);
		}

		// +SPACE PerTickBase
		var perTickBaseSpace = this.getEffect(res.name + "PerTickBaseSpace") *spaceRatio;

		perTick += perTickBaseSpace;

		// *SEASON MODIFIERS
		if (!season){
			var season = this.calendar.getCurSeason();
		}
		var weatherMod = this.calendar.getWeatherMod();
		    weatherMod = (season.modifiers[res.name] + weatherMod);
		if (weatherMod < -0.95){
			weatherMod = -0.95;
		}

		if (season.modifiers[res.name]){
			perTick *= weatherMod;
		}

		// +VILLAGE JOB PRODUCTION
		var resMapProduction = this.village.getResProduction();
		var resProduction = resMapProduction[res.name] ? resMapProduction[res.name] : 0;

		perTick += resProduction;

		// +VILLAGE JOB PRODUCTION (UPGRADE EFFECTS JOBS)
		var workshopResRatio = this.getEffect(res.name+"JobRatio");

		perTick += resProduction * workshopResRatio;

		// +*BEFORE PRODUCTION BOOST (UPGRADE EFFECTS GLOBAL)
		perTick *= 1 + this.getEffect(res.name+"GlobalRatio");

		// +*BUILDINGS AND SPACE PRODUCTION
		perTick *= 1 + this.getEffect(res.name + "Ratio");

		// +*RELIGION EFFECTS
		perTick *= 1 + this.getEffect(res.name + "RatioReligion");

		// +*AFTER PRODUCTION BOOST (UPGRADE EFFECTS SUPER)
		perTick *= 1 + this.getEffect(res.name+"SuperRatio");

		// +*AFTER PRODUCTION REDUCTION (SPECIAL STEAMWORKS HACK FOR COAL)
		var steamworks = this.bld.get("steamworks");
		var swEffectGlobal = steamworks.effects[res.name+"RatioGlobal"];
		if (steamworks.on > 0 && swEffectGlobal) {
			perTick *= 1 + swEffectGlobal;
		}

		// *PARAGON BONUS
		var paragonProductionRatio = this.prestige.getParagonProductionRatio();
		if (resName == "catnip" && this.challenges.currentChallenge == "winterIsComing") {
			paragonProductionRatio = 0; //winter has come
		}

		perTick *= 1 + paragonProductionRatio;

		//ParagonSpaceProductionRatio definition 1/4
		var paragonSpaceProductionRatio = 1 + paragonProductionRatio * 0.05;

		// +BUILDING AUTOPROD
		var perTickAutoprod = this.getEffect(res.name + "PerTickAutoprod");
		    perTickAutoprod *= paragonSpaceProductionRatio;

		perTick += perTickAutoprod;

		// *MAGNETOS PRODUCTION BONUS
		if (!res.transient && this.bld.get("magneto").on > 0 && res.name != "catnip"){

			var steamworks = this.bld.get("steamworks");
			var swRatio = steamworks.on > 0 ? (1+ steamworks.effects["magnetoBoostRatio"] * steamworks.on) : 1;
			if (res.name != "oil"){
				perTick *= 1 + (this.getEffect("magnetoRatio") * swRatio);
			}

			//ParagonSpaceProductionRatio definition 2/4
			paragonSpaceProductionRatio += paragonSpaceProductionRatio * this.getEffect("magnetoRatio") * swRatio; //These special cases need to die in a hole

		}

		// +*REACTOR PRODUCTION BONUS
		if (!res.transient && res.name != "uranium" && res.name != "catnip"){
			perTick *= 1 + this.getEffect("productionRatio");

			//ParagonSpaceProductionRatio definition 3/4
			paragonSpaceProductionRatio += paragonSpaceProductionRatio * this.getEffect("productionRatio");
		}

		// +*FAITH BONUS
		perTick *= 1 + (this.religion.getProductionBonus() / 100);

		//+COSMIC RADIATION
		if (!this.opts.disableCMBR && res.name != "coal") {
			perTick *= (1 + this.getCMBRBonus());
		}

		//ParagonSpaceProductionRatio definition 4/4
		paragonSpaceProductionRatio += paragonSpaceProductionRatio * this.religion.getProductionBonus() / 100;

		// +AUTOMATED PRODUCTION BUILDING
		perTick += this.getEffect(res.name + "PerTickProd");

		// +AUTOMATED PRODUCTION SPACE (FULL BONUS)
		perTick += (this.getEffect(res.name + "PerTickAutoprodSpace") * spaceRatio) * (1 + (paragonSpaceProductionRatio-1) * this.getEffect("prodTransferBonus"));
		// +AUTOMATED PRODUCTION SPACE (NOT FULL BONUS)
		perTick += this.getEffect(res.name + "PerTickSpace") *spaceRatio;


		//CYCLE EFFECTS
		// Already added because it's space building improvements.

		//CYCLE FESTIVAL EFFECTS

		var effects = {};
		effects[resName] = perTick;
		this.calendar.cycleEffectsFestival(effects);
		perTick = effects[resName];

		// +BUILDING AND SPACE PerTick
		perTick += this.getEffect(res.name + "PerTick");

		// -EARTH CONSUMPTION
		var resMapConsumption = this.village.getResConsumption();
		var resConsumption = resMapConsumption[res.name] || 0;
		resConsumption *= 1 + this.getEffect(res.name + "DemandRatio");
		if (res.name == "catnip" && this.village.sim.kittens.length > 0 && this.village.happiness > 1) {
			var hapinnessConsumption = Math.max(this.village.happiness - 1, 0);
			if (this.challenges.currentChallenge == "anarchy") {
				resConsumption += resConsumption * hapinnessConsumption * (1 + this.getEffect(res.name + "DemandWorkerRatioGlobal"));
			} else {
				resConsumption += resConsumption * hapinnessConsumption * (1 + this.getEffect(res.name + "DemandWorkerRatioGlobal")) * (1 - this.village.getFreeKittens() / this.village.sim.kittens.length);
			}
		}

		perTick += resConsumption;

		if (isNaN(perTick)){
			return 0;
		}

		return perTick;
	},

	/**
	 * Generates a stack of resource modifiers. (TODO: use it with resource per tick calculation logic)
	 */
	getResourcePerTickStack: function(resName, calcAutomatedEffect, season){
		var stack = [];

		var res = null;
		for (var i in this.resPool.resources){
			var _res = this.resPool.resources[i];
			if (_res.name == resName){
				res = _res;
				break;
			}
		}

		if (!res){
			//console.error("Unable to fetch resource stack for resName '" + resName + "'");
			return;
		}

		// BUILDING PerTickBase
		stack.push({
			name: "Production",
			type: "fixed",
			value: this.getEffect(res.name + "PerTickBase")
		});

		// SPACE RATIO CALCULATION
		var spaceRatio = 1 + this.getEffect("spaceRatio");
		if (this.workshop.get("spaceManufacturing").researched && res.name != "uranium"){
			var factory = this.bld.get("factory");
			spaceRatio *= (1 + factory.on * factory.effects["craftRatio"] * 0.75);
			spaceRatio -= 1;
		}

		// +SPACE PerTickBase
		var perTickBaseSpaceStack = [];
		//---->
			perTickBaseSpaceStack.push({
				name: "Space Production",
				type: "fixed",
				value: this.getEffect(res.name + "PerTickBaseSpace")
			});
			perTickBaseSpaceStack.push({
				name: "Space production bonus",
				type: "ratio",
				value: spaceRatio - 1
			});
		//<----
		stack.push(perTickBaseSpaceStack);

		// *SEASON MODIFIERS
		if (!season){
			var season = this.calendar.getCurSeason();
		}
		var weatherMod = this.calendar.getWeatherMod();
		    weatherMod = (season.modifiers[res.name] + weatherMod);
		if (weatherMod < -0.95){
			weatherMod = -0.95;
		}

		stack.push({
			name: "Weather",
			type: "ratio",
			value: weatherMod - 1
		});

		// +VILLAGE JOB PRODUCTION
		var resMapProduction = this.village.getResProduction();
		var villageStack = [];
		//---->
				villageStack.push({
					name: "(:3) Village",
					type: "fixed",
					value: resMapProduction[res.name] || 0
				});
				villageStack.push({
					name: "Tools",
					type: "ratio",
					value: this.getEffect(res.name + "JobRatio")
				});
		//<----
		stack.push(villageStack);

		// +*BEFORE PRODUCTION BOOST (UPGRADE EFFECTS GLOBAL)
		stack.push({
			name: "Upgrades",
			type: "ratio",
			value: this.getEffect(res.name + "GlobalRatio")
		});

		// +*BUILDINGS AND SPACE PRODUCTION
		stack.push({
			name: "Buildings",
			type: "ratio",
			value: this.getEffect(res.name + "Ratio")
		});

		// +*RELIGION EFFECTS
		stack.push({
			name: "Religion",
			type: "ratio",
			value: this.getEffect(res.name + "RatioReligion")
		});

		// +*AFTER PRODUCTION BOOST (UPGRADE EFFECTS SUPER)
		stack.push({
			name: "Boost",
			type: "ratio",
			value: this.getEffect(res.name + "SuperRatio")
		});

		// +*AFTER PRODUCTION REDUCTION (SPECIAL STEAMWORKS HACK FOR COAL)
		var steamworks = this.bld.get("steamworks");
		var swEffectGlobal = steamworks.effects[res.name+"RatioGlobal"];
		if (steamworks.on > 0 && swEffectGlobal ){
			stack.push({
				name: "Steamworks",
				type: "ratio",
				value: swEffectGlobal
			});
		}

		// *PARAGON BONUS
		var paragonProductionRatio = this.prestige.getParagonProductionRatio();
		if (resName == "catnip" && this.challenges.currentChallenge == "winterIsComing") {
			paragonProductionRatio = 0; //winter has come
		}

		stack.push({
			name: "Paragon",
			type: "ratio",
			value: paragonProductionRatio
		});

		//ParagonSpaceProductionRatio definition 1/4
		var paragonSpaceProductionRatio = 1 + paragonProductionRatio * 0.05;

		// +BUILDING AUTOPROD
		var buildingAutoprod = [];
		// ---->
			buildingAutoprod.push({
				name: "Conversion Production",
				type: "fixed",
				value: this.getEffect(res.name + "PerTickAutoprod")
			});
			buildingAutoprod.push({
				name: "Paragon",
				type: "ratio",
				value: paragonProductionRatio * 0.05
			});
		//<----
		stack.push(buildingAutoprod);

		// *MAGNETOS PRODUCTION BONUS
		if (!res.transient && this.bld.get("magneto").on > 0 && res.name != "catnip"){

			var steamworks = this.bld.get("steamworks");
			var swRatio = steamworks.on > 0 ? (1+ steamworks.effects["magnetoBoostRatio"] * steamworks.on) : 1;
			if (res.name != "oil"){
				stack.push({
					name: "Magnetos",
					type: "ratio",
					value: this.getEffect("magnetoRatio") * swRatio
				});
			}

			//ParagonSpaceProductionRatio definition 2/4
			paragonSpaceProductionRatio += paragonSpaceProductionRatio * this.getEffect("magnetoRatio") * swRatio; //These special cases need to die in a hole
		}

		// +*REACTOR PRODUCTION BONUS
		if (!res.transient && res.name != "uranium" && res.name != "catnip") {
			stack.push({
				name: "Reactors",
				type: "ratio",
				value: this.getEffect("productionRatio")
			});

			//ParagonSpaceProductionRatio definition 3/4
			paragonSpaceProductionRatio += paragonSpaceProductionRatio * this.getEffect("productionRatio");

		}

		// +*FAITH BONUS
		stack.push({
			name: "Faith",
			type: "ratio",
			value: this.religion.getProductionBonus() / 100
		});

		if (!this.opts.disableCMBR && res.name != "coal") {
			stack.push({
				name: "CMBR",
				type: "ratio",
				value: this.getCMBRBonus()
			});
		}

		//ParagonSpaceProductionRatio definition 4/4
		paragonSpaceProductionRatio += paragonSpaceProductionRatio * this.religion.getProductionBonus() / 100;

		// +AUTOMATED PRODUCTION BUILDING
		stack.push({
			name: "Conversion Production",
			type: "fixed",
			value: this.getEffect(res.name + "PerTickProd")
		});
		stack.push({ // extra-compare with this.calcResourcePerTick
			name: "Conversion Consumption",
			type: "fixed",
			value: this.getEffect(res.name + "PerTickCon")
		});

		// +AUTOMATED PRODUCTION SPACE
		var perTickAutoprodSpaceStack = [];
		//---->
			perTickAutoprodSpaceStack.push({
				name: "Space Conversion Production",
				type: "fixed",
				value: this.getEffect(res.name + "PerTickAutoprodSpace")
			});
			perTickAutoprodSpaceStack.push({
				name: "Space production bonus",
				type: "ratio",
				value: spaceRatio - 1
			});
			perTickAutoprodSpaceStack.push({
				name: "Space Paragon",
				type: "ratio",
				value: paragonSpaceProductionRatio - 1
			});
			perTickAutoprodSpaceStack.push({
				name: "Bonus Transfert",
				type: "ratio",
				value: this.getEffect("prodTransferBonus")
			});
		//<----
		stack.push(perTickAutoprodSpaceStack);

		// +AUTOMATED PRODUCTION SPACE
		var perTickSpace = [];
		//---->
			perTickSpace.push({
				name: "Space Conversion Production",
				type: "fixed",
				value: this.getEffect(res.name + "PerTickSpace")
			});
			perTickSpace.push({
				name: "Space production bonus",
				type: "ratio",
				value: spaceRatio - 1
			});
		//<----
		stack.push(perTickSpace);

		//CYCLE EFFECT
		// Can't be displayed because it's space building improvements.

		//CYCLE FESTIVAL EFFECTS
		var effects = {};
		effects[res.name] = 1;
		this.calendar.cycleEffectsFestival(effects);
		var cycleEffect = effects[resName]-1;

		stack.push({
			name: "Cycle Festival Effect",
			type: "ratio",
			value: cycleEffect
		});

		// +BUILDING AND SPACE PerTick
		stack.push({
			name: "Without Improvement",
			type: "fixed",
			value: this.getEffect(res.name + "PerTick")
		});

		// +CRAFTING JOB PRODUCTION
		stack.push({
			name: "(:3) Engineer",
			type: "fixed",
			value: this.workshop.getEffectEngineer(res.name, true)
		});

		// -EARTH CONSUMPTION && -SPACE CONSUMPTION
		var resMapConsumption = this.village.getResConsumption();
		var resConsumption = resMapConsumption[res.name] || 0;
		resConsumption *= 1 + this.getEffect(res.name + "DemandRatio");
		if (res.name == "catnip" && this.village.sim.kittens.length > 0 && this.village.happiness > 1) {
			var hapinnessConsumption = Math.max(this.village.happiness - 1, 0);
			if (this.challenges.currentChallenge == "anarchy") {
				resConsumption += resConsumption * hapinnessConsumption * (1 + this.getEffect(res.name + "DemandWorkerRatioGlobal"));
			} else {
				resConsumption += resConsumption * hapinnessConsumption * (1 + this.getEffect(res.name + "DemandWorkerRatioGlobal")) * (1 - this.village.getFreeKittens() / this.village.sim.kittens.length);
			}
		}

		stack.push({
			name: "(:3) Demand",
			type: "fixed",
			value: resConsumption
		});

		// TIME extra-compare with this.calcResourcePerTick
		stack.push({
			name: "Time",
			type: "ratio",
			value: (this.getRateUI() - this.rate) / this.rate
		});

		return stack;
	},

	//CMBR is capped by 20%

	getCMBRBonus: function(){
		var ratio = this.server.donateAmt / 1000;
		return this.getHyperbolicEffect(ratio, 0.2);
	},

	getCraftRatio: function() {
		return this.getEffect("craftRatio") + this.village.getEffectLeader("engineer", 0);
	},

	getResCraftRatio: function(res){
		if (res.name == "wood"){
			var refineRatio = this.getEffect("refineRatio");
			if (this.ironWill){
				return ( (1 + refineRatio) * (1 + this.getEffect("woodRatio")) ) - 1;
			} else {
				return refineRatio;
			}
		}

		if (res.name == "blueprint"){
			var bpRatio = this.getEffect("blueprintCraftRatio");
			var scienceBldAmt = this.bld.get("library").val + this.bld.get("academy").val +
				this.bld.get("observatory").val + this.bld.get("biolab").val;

			var ratio = this.getCraftRatio();

			return ratio + scienceBldAmt * bpRatio;
		}

		if (res.name == "kerosene"){
			var fRatio = this.getEffect("factoryRefineRatio");

			var amt = this.bld.get("factory").on;
			var ratio = this.getCraftRatio();

			return ratio * (1 + amt * fRatio * 0.75);	//25% penalty
		}

        //get resource specific craft ratio (like factory bonus)
        var resCraftRatio = this.getEffect(res.name + "CraftRatio") || 0;

		return this.getCraftRatio() + resCraftRatio;
	},

	/**
	 * Update all tab managers, resources and UI controls
	 */
	update: function(){
		this.ticksBeforeSave--;

		if (this.ticksBeforeSave == 0){
			this.save();

			this.ui.displayAutosave();
		}

		this.timer.beforeUpdate();

		//hack hack hack
		this.updateModel();
		if (this.time.isAccelerated && this.ticks % 2 == 0){
			this.updateModel();
		}

		//hack end
		this.time.update();

		if (this.undoChange){
			this.undoChange.ttl--;

			if (this.undoChange.ttl <= 0){
				this.undoChange = null;
			}
		}
        //--------------------
        //  Update UI state
        //--------------------
        this.ui.update();

		this.timer.afterUpdate();
	},

	getRateUI: function(){
		return this.time.isAccelerated ? this.rate * 1.5 : this.rate;
	},

	/**
	 * How should it be:
	 *
	 * a) we need to use smaller tick intervals (10 per second instead of 5 per second)
	 * b) in accelerated time we will update models more often
	 * c) but we will keep ui update in a old steady rate
	 *
	 * How it works now:
	 *
	 * update method can just kick twice in the accelerated mode
	 *
	 */
	updateModel: function(){

		this.resPool.update();

		this.bld.update();

		//business logic goes there
		//maybe it will be a good idea to move it elsewhere?

		//for example, here kitten resources are calculated per effect, this logic could be unified

		var maxKittens = this.getEffect("maxKittens");
		this.village.maxKittens = maxKittens;

		this.village.update();
		this.workshop.update();
		this.diplomacy.update();
		this.religion.update();
		this.space.update();
		this.challenges.update();

		/*for (i in this.managers){
		 if (this.managers[i].update){
		 this.managers[i].update();
		 }
		 }*/

		this.resPool.resConsHackForResTable();

		//nah, kittens are not a resource anymore (?)
		var kittens = this.resPool.get("kittens");
		kittens.value = this.village.getKittens();	//just a simple way to display them
		kittens.maxValue = this.village.maxKittens;

		this.timer.update();
	},

	huntAll: function(event){
		event.preventDefault();
		this.village.huntAll();
	},

	/**
	 * Updates a perTickValue of resource for UI
	 */
	updateResources: function(){
		/**
		* Updating per tick value is actually a heavy operation. Why don't we do it per 3 tick and cache values?
		*/
		for (var i = 0; i < this.resPool.resources.length; i++){
			var res = this.resPool.resources[i];
			if (res.calculatePerTick) {
				res.perTickCached = this.fixFloatPointNumber(this.calcResourcePerTick(res.name));
			}
		}
	},

	getResourcePerTick: function(resName, withConversion){
		var res = this.resPool.get(resName);
		if (res.calculatePerTick) {
			return withConversion ? res.perTickCached + this.getResourcePerTickConvertion(res.name) : res.perTickCached;
		} else {
			return 0;
		}
	},

	getResourcePerTickConvertion: function(resName) {
		return this.fixFloatPointNumber(this.getEffect(resName + "PerTickCon"));
	},

	craft: function(resName, value){
		this.workshop.craft(resName, value);
		this.updateResources();
	},

	craftAll: function(resName){

		// some way to protect people from refining all catnip during the winter
		if (resName == "wood" && this.getResourcePerTick("catnip", true) <= 0){
			if (!confirm("Are you sure? Your kittens will DIE")){
				return;
			}
		}

		this.workshop.craftAll(resName);
		this.updateResources();
	},

	getRequiredResources: function(bld){
		var res = [];
		if (bld && bld.prices) {
			for (var i = 0; i < bld.prices.length; i++){
				res.push(bld.prices[i].name);
			}
		}
		return res;
	},

	/**
	 * Attaches onMouseOver/onMouseOut events to a given DOM node in order to display tooltip.
	 * All tooltips will reuse the same container.
	 *
	 */
	attachResourceTooltip: function(container, resRef){

		var tooltip = dojo.byId("tooltip");
		dojo.empty(tooltip);

		dojo.connect(container, "onmouseover", this, dojo.partial(function(resRef, tooltip, event){
			if (this.getResourcePerTick(resRef.name, false) != 0
				|| this.getResourcePerTickConvertion(resRef.name) != 0
				|| this.workshop.getEffectEngineer(resRef.name) != 0
				){

				tooltip.innerHTML = this.getDetailedResMap(resRef);

				var target = event.originalTarget || event.toElement;	//fucking chrome
				var pos = $(target).position();
				if (!pos){
				 return;
				}

				dojo.setStyle(tooltip, "left", pos.left + 100 + "px");
				dojo.setStyle(tooltip, "top",  pos.top + "px");

				dojo.setStyle(tooltip, "display", "");
				dojo.setStyle(container, "fontWeight", "bold");
			}
	    }, resRef, tooltip));

		dojo.connect(container, "onmouseout", this, dojo.partial(function(tooltip, container){
			 dojo.setStyle(tooltip, "display", "none");
			 dojo.setStyle(container, "fontWeight", "normal");
		},tooltip, container));

	},

	/**
	 * Returns a flat map of resource production
	 */
	getDetailedResMap: function(res){
		var resString = "";
		var resStack = this.getResourcePerTickStack(res.name);

		resString = this.processResourcePerTickStack(resStack, res, 0);

		var resPertick = this.getResourcePerTick(res.name, true);

		if (this.opts.usePercentageResourceValues){
			resString += "<br> Net gain: " + this.getDisplayValueExt(resPertick, true, true);
		}

		if (resPertick < 0) {
			var toZero = res.value / (-resPertick * this.getRateUI());
			resString += "<br>To zero: " + this.toDisplaySeconds(toZero.toFixed());
		} else {
			if (res.maxValue && res.value < res.maxValue) {
				var toCap = (res.maxValue - res.value) / (resPertick * this.getRateUI());
				if (toCap){
					resString += "<br>To cap: " + this.toDisplaySeconds(toCap.toFixed());
				}
			}
		}
		return resString;
	},

	processResourcePerTickStack: function(resStack, res, depth){
		var resString = "";
		var hasFixed = false;

		for (var i in resStack){
			var stackElem = resStack[i];

			if (stackElem.length){
				var subStack = this.processResourcePerTickStack(stackElem, res, depth + 1);
				if (subStack.length){
					resString += subStack;
					hasFixed = true;
				}
			}

			if (!stackElem.value || (stackElem.type == "ratio" && !hasFixed)){
				continue;
			}

			if (i != 0) {
				for (var j = 0; j < depth; j++){
					resString += "|-> ";
				}
			}

			resString += this.getStackElemString(stackElem, res);
			if (stackElem.type == "fixed") {
				hasFixed = true;
			}
		}

		return resString;
	},

	getStackElemString: function(stackElem, res){
		var resString = stackElem.name + ":&nbsp;<div style=\"float: right;\">";

		if (stackElem.type == "fixed"){
			resString += this.getDisplayValueExt(stackElem.value, true, true);
		} else {
			resString += this.getDisplayValueExt((stackElem.value * 100).toFixed(), true) + "%";
		}

		resString += "</div><br>";

		return resString;
	},

	toDisplaySeconds : function (secondsRaw) {
	    var sec_num = parseInt(secondsRaw, 10); // don't forget the second param

        var year_secs = 86400 * 365;

        var years   = Math.floor(sec_num / year_secs);
	    var days    = Math.floor((sec_num - (years * year_secs)) / 86400);
	    var hours   = Math.floor((sec_num - (years * year_secs) - (days * 86400)) / 3600);
	    var minutes = Math.floor((sec_num - (years * year_secs) - (days * 86400 + hours * 3600)) / 60);
	    var seconds = sec_num - (years * year_secs) - (days * 86400) - (hours * 3600) - (minutes * 60);

        if (years > 0){
            years = this.getDisplayValueExt(years);
        }

	    var timeFormated = "";
        if ( years ) { timeFormated = years + "y "; }
	    if ( days ) { timeFormated += days + "d "; }
        if ( !years ){
            if ( hours ) {  timeFormated += hours + "h "; }
            if ( minutes) { timeFormated += minutes + "m "; }
            if ( seconds ) { timeFormated += seconds + "s "; }
        }

	    return timeFormated;
	},

	/**
	 * The same as toDisplaySeconds, but converts ingame days into xYears xDays
	 * Just for aestetical pleasness
	 */
	toDisplayDays: function(daysRaw){
		var daysNum = parseInt(daysRaw, 10); // don't forget the second param

		var years   = Math.floor(daysNum / (4*100));
		var days = daysNum - (years * 4 * 100);

		if (years > 0){
			years = this.getDisplayValueExt(years);
		}

		var timeFormated = "";
		if ( years ) { timeFormated = years + "y "; }
		if ( days ) { timeFormated += days + "d "; }

		return timeFormated;
	},

	toDisplayPercentage: function(percentage, precision, precisionFixed) {
		percentage *= 100;
		if (precisionFixed) {
			// Prevent 100% whereas it's not really reached
			percentage -= 1 / Math.pow(10, precision);
			if (percentage < 0) {
				percentage = 0;
			}
		} else {
			percentage = this.fixFloatPointNumber(percentage);
			// Seek optimal precision
			if (percentage - Math.floor(percentage) != 0) {
				precision = 1;
				if (percentage*10 - Math.floor(percentage*10) != 0) {
					precision = 2;
					if (percentage*100 - Math.floor(percentage*100) != 0) {
						precision = 3;
						if (percentage*1000 - Math.floor(percentage*1000) != 0) {
							precision = 4;
							if (percentage*10000 - Math.floor(percentage*10000) != 0) {
								precision = 5;
								if (percentage*100000 - Math.floor(percentage*100000) != 0) {
									precision = 6;
									if (percentage*1000000 - Math.floor(percentage*1000000) != 0) {
										precision = 7;
										if (percentage*10000000 - Math.floor(percentage*10000000) != 0) {
											precision = 8;
										}
									}
								}
							}
						}
					}
				}
			}
		}

		return percentage.toFixed(precision);
	},

	/**
	 * Converts raw resource value (e.g. 12345.67890) to a formatted representation (i.e. 12.34K)
	 * If 'prefix' flag is true, positive value will be prefixed with '+', e.g. ("+12.34K")
	 */
	getDisplayValueExt: function(value, prefix, usePerTickHack, precision, postfix){

		if(!value){ return "0"; }

		if (usePerTickHack){
			usePerTickHack = this.opts.usePerSecondValues;
		}
		if (usePerTickHack){
			value = value * this.rate;
		}

		//shamelessly copied from Sandcastle Builder code
		var postfixes=[
			{limit:1e210,divisor:1e210,postfix:['Q',' Quita']},
			{limit:1e42,divisor:1e42,postfix:['W',' Wololo']},
			{limit:1e39,divisor:1e39,postfix:['L',' Lotta']},
			{limit:1e36,divisor:1e36,postfix:['F',' Ferro']},
			{limit:1e33,divisor:1e33,postfix:['H',' Helo']}, //or Ballard
			{limit:1e30,divisor:1e30,postfix:['S',' Squilli']},
			{limit:1e27,divisor:1e27,postfix:['U',' Umpty']},

			{limit:1e24,divisor:1e24,postfix:['Y',' Yotta']},
			{limit:1e21,divisor:1e21,postfix:['Z',' Zeta']},
			{limit:1e18,divisor:1e18,postfix:['E',' Exa']},
			{limit:1e15,divisor:1e15,postfix:['P',' Peta']},
			{limit:1e12,divisor:1e12,postfix:['T',' Tera']},
			{limit:1e9,divisor:1e9,postfix:['G',' Giga']},
			{limit:1e6,divisor:1e6,postfix:['M',' Mega']},
			{limit:9e3,divisor:1e3,postfix:['K',' Kilo']} //WHAT
		];

		postfix = postfix || "";
		var absValue = Math.abs(value);
		for(var i = 0; i < postfixes.length; i++) {
			var p = postfixes[i];
			if(absValue >= p.limit){
				if (usePerTickHack){ // Prevent recursive * this.rate;
					value = value / this.rate;
				}
				return this.getDisplayValueExt(value / p.divisor, prefix, usePerTickHack, precision, postfix + p.postfix[0]);
			}
		}

		return this.getDisplayValue(value, prefix, precision) + postfix + (usePerTickHack ? "/sec" : "");
	},

	/**
	 * Formats float value to x.xx or x if value is integer
	 */
	getDisplayValue: function(floatVal, plusPrefix, precision){

		var plusSign = "+";
		if (floatVal <= 0 || !plusPrefix){
			plusSign = "";
		}

		if (!floatVal.toFixed){
			return plusSign + floatVal;
		}

		if (precision === undefined){
			precision = this.forceHighPrecision ? 3 : 2;
		}

		var mantisa = "";

		if (floatVal != 0) {
			var absVal = Math.abs(floatVal);
			if (absVal < 0.01 && precision == 2 || absVal < 0.001 && precision == 3) {
				mantisa = "(...)";
			}
		}

		if (floatVal.toFixed() == floatVal){
			var toFixed = floatVal.toFixed();
			return plusSign + toFixed;
		} else {
			var toFixed = floatVal.toFixed(precision);
			return plusSign + toFixed + mantisa;
		}
	},

	fixFloatPointNumber: function(number) {
		// Adjust value because of floating-point error
		var numberAdjusted = Math.floor(number * 10000000) / 10000000;
		if (Math.round((number - numberAdjusted) * 10000000)) {
			numberAdjusted = Math.floor((number + 0.000000000000010) * 10000000) / 10000000;
		}
		return numberAdjusted;
	},

	addTab: function(tab){
		this.tabs.push(tab);
		tab.game = this;
	},

	start: function(){
		if (!dojo.isIE && this.useWorkers && window.Worker){	//IE10 has a nasty security issue with running blob workers
			console.log("starting web worker...");
			var blob = new Blob([
				"onmessage = function(e) { setInterval(function(){ postMessage('tick'); }, 1000 / " + this.rate + "); }"]);	//no shitty external js
			var blobURL = window.URL.createObjectURL(blob);

			this.worker = new Worker(blobURL);
			this.worker.addEventListener('message', dojo.hitch(this, function(e) {
				this.tick();
			}));
			this.worker.postMessage("tick");
		} else {
			console.log("starting js timer...");
			//some older browser, perhaps IE. Have a nice idling.
			var timer = setInterval(dojo.hitch(this, this.tick), (1000 / this.rate));
		}
	},

	tick: function(){
		/**
		 * Even if the game is paused, scheduler should still be able to obtain a focus to handle cases like save/load/reset
		 */
		this.timer.updateScheduledEvents();

		if (this.isPaused){
			return;
		}

		var timestampStart = new Date().getTime();

		this.update();
		this.calendar.tick();
		this.ticks++;

		var timestampEnd = new Date().getTime();
		if (this.isLocalhost) {
			this.totalUpdateTimeTicks++;

			var tsDiff = timestampEnd - timestampStart;
			this.totalUpdateTime[this.totalUpdateTimeCurrent] += tsDiff;
			this.totalUpdateTimeCurrent = this.totalUpdateTimeCurrent == 4 ? 0 : this.totalUpdateTimeCurrent + 1;

			var avg = (this.totalUpdateTime[0] + this.totalUpdateTime[1] + this.totalUpdateTime[2] + this.totalUpdateTime[3] + this.totalUpdateTime[4]) / this.totalUpdateTimeTicks;
			var avg0 = this.totalUpdateTime[0] / Math.floor((this.totalUpdateTimeTicks -1) / 5);
			var avg1 = this.totalUpdateTime[1] / Math.floor((this.totalUpdateTimeTicks -2) / 5);
			var avg2 = this.totalUpdateTime[2] / Math.floor((this.totalUpdateTimeTicks -3) / 5);
			var avg3 = this.totalUpdateTime[3] / Math.floor((this.totalUpdateTimeTicks -4) / 5);
			var avg4 = this.totalUpdateTime[4] / Math.floor((this.totalUpdateTimeTicks -5) / 5);

			if (tsDiff < 10) {tsDiff = 10;}
            if ($("#devPanelFPS")[0]) {
                $("#devPanelFPS")[0].innerHTML = "update time: " + tsDiff + " ms,"
                + " avg: " + avg.toFixed() + " ms [ " + avg0.toFixed() + " | " + avg1.toFixed() + " | " + avg2.toFixed() + " | " + avg3.toFixed() + " | " + avg4.toFixed() + "] (click to restart)";
                dojo.connect($("#devPanelFPS")[0], "onclick", this, dojo.partial(function() {
					this.totalUpdateTime[0] = 0;
					this.totalUpdateTime[1] = 0;
					this.totalUpdateTime[2] = 0;
					this.totalUpdateTime[3] = 0;
					this.totalUpdateTime[4] = 0;
					this.totalUpdateTimeCurrent = 0;
					this.totalUpdateTimeTicks = 5;
                }));
            }
		}
	},

	reset: function(){
		var msg = "Are you sure that you want to reset?" +
			"\n\nYou will get bonus points for happiness. You will also save your achievements and bonus points";
		if (this.resPool.get("kittens").value > 70){
			msg = "Are you sure that you want to reset?" +
			"\n\nYou will receive extra happiness and bonus to production.";
		}else if (this.resPool.get("kittens").value > 60){
			msg = "Are you sure that you want to reset?" +
			"\n\nYou will receive extra happiness bonus.";
		}else if (this.resPool.get("kittens").value <= 35){
			msg = "Are you sure that you want to reset?" +
			"\n\nYou will receive NO BONUS points. You will save old bonus points and achievements.";
		}

		if (!confirm(msg)){
			return;
		}

		if (this.challenges.currentChallenge == "atheism" && this.time.getVSU("cryochambers").on > 0) {
			this.challenges.getChallenge("atheism").researched = true;
		}

		this.challenges.currentChallenge = null;
		this.resetAutomatic();
	},

	resetAutomatic: function() {
		this.timer.scheduleEvent(dojo.hitch(this, function(){
			this._resetInternal();
			window.location.reload();
		}));
	},

	discardParagon: function(){
		var msg = "Are you sure that you want to discard all your paragon points? This action can not be undone.";
		if (!confirm(msg)){
			return;
		}
		if (this.resPool.get("paragon").value > 100){
			msg = "You have a lot of paragon points. Are you absolutely sure?";
			if (!confirm(msg)){
				return;
			}
		}
		if (this.ironWill){
			msg = "Warning! Burning paragon will break your Iron Will mode. Do you want to proceed?";
			if (!confirm(msg)){
				return;
			}
		}

		this.resPool.get("burnedParagon").value += this.resPool.get("paragon").value;
		this.resPool.get("paragon").value = 0;
		this.ironWill = false;
		//TODO: add some speical hidden effect for this mechanics
	},

    _getKarmaKittens: function(kittens){
        var karmaKittens = 0;
        if (kittens > 35){
			karmaKittens += (kittens - 35);
		}

		if (kittens > 60){
			karmaKittens += (kittens - 60) * 3;
		}

		if (kittens > 100){
			karmaKittens += (kittens - 100) * 4;
		}

		if (kittens > 150){
			karmaKittens += (kittens - 150) * 5;
		}

		if (kittens > 300){
			karmaKittens += (kittens - 300) * 10;
		}

		if (kittens > 750){
			karmaKittens += (kittens - 750) * 15;
		}

        return karmaKittens;
    },

	_getBonusZebras: function(){
		var totalScience = 0;
		var bonusZebras = 0;

		var anachronomancy = this.prestige.getPerk("anachronomancy");
		if (this.science.get("archery").researched && this.karmaZebras < 10){
			bonusZebras = 1;
		}
		for (var i = 0; i < this.science.techs.length; i++){
			var tech = this.science.techs[i];
			if (tech.name == "chronophysics" && anachronomancy.researched){
				continue;
			}
			if (tech.researched){
				for (var j in tech.prices){
					if (tech.prices[j].name == "science"){
						totalScience += tech.prices[j].val;
						break;
					}
				}
			}
		}
		bonusZebras += Math.floor(this.getHyperbolicEffect(totalScience / 10000, 100));
		return bonusZebras;
	},

	_resetInternal: function(){
		var kittens = this.resPool.get("kittens").value;
		if (kittens > 35){
			this.karmaKittens += this._getKarmaKittens(kittens);
		}

		var paragonPoints = 0;
		if (kittens > 70){
			paragonPoints = (kittens - 70);
		}

		this.resPool.addResEvent("paragon", paragonPoints);
		this.karmaZebras = parseInt(this.karmaZebras);	//hack
		//that's all folks

		this.stats.getStat("totalParagon").val += paragonPoints;
		this.stats.getStat("totalResets").val++;

		this.telemetry.logEvent("reset", this.stats.getStat("totalResets").val);

		//Reset current game stats
		this.stats.resetStatsCurrent();

		//-------------------------- very confusing and convoluted stuff related to karma zebras ---------------
		var bonusZebras = this._getBonusZebras();
		if (this.resPool.get("zebras").value > 0 && this.ironWill){
			this.karmaZebras += bonusZebras;
		}

		//pre-reset faith so people who forgot to do it properly would not be screwed
		if (this.religion.getRU("apocripha").on){
			this.religionTab.resetFaithInternal(1);
		}
		//------------------------------------------------------------------------------------------------------

		// Trigger a save to make sure we're working with most recent data
		this.save();

		var lsData = JSON.parse(LCstorage["com.nuclearunicorn.kittengame.savedata"]);
		if (!lsData){
			lsData = {
				game: {},
				stats: {},
				statsCurrent: {},
				achievements: {}
			};
		}

		var saveRatio = this.bld.get("chronosphere").val > 0 ? this.getEffect("resStasisRatio") : 0; // resStasisRatio excepted when challenge
		dojo.mixin(lsData.game, {
			karmaKittens: 		this.karmaKittens,
			karmaZebras: 		this.karmaZebras,
			ironWill : 			saveRatio > 0 ? false : true,			//chronospheres will disable IW
			deadKittens: 		0
		});

		//------------ we can now carry some of the resources through reset ------------
		var newResources = [];
		var ignoreResources = ["kittens", "zebras", "unicorns", "alicorn", "tears", "furs", "ivory", "spice", "karma", "necrocorn"];


		var anachronomancy = this.prestige.getPerk("anachronomancy");
		var fluxCondensator = this.workshop.get("fluxCondensator");
		for (var i in this.resPool.resources){
			var res = this.resPool.resources[i];

			if ((res.craftable && res.name != "wood" && !fluxCondensator.researched) ||
				dojo.indexOf(ignoreResources, res.name) >= 0){
				continue;	//>:
			}
			var value = 0;

			if (res.name == "timeCrystal"){
				if (anachronomancy.researched){
					value = res.value;
				}
			} else if (res.persists){
				value = res.value;
			} else {
				if (!res.craftable || res.name == "wood"){
					value = res.value * saveRatio;
					if (res.name == "void") {
						value = Math.floor(value);
					}
				} else if (res.value > 0) {
					value = Math.sqrt(res.value) * saveRatio * 100;
				}
			}

			if (value > 0){
				var newRes = this.resPool.createResource(res.name);
				newRes.value = value;
				newResources.push(newRes);
			}
		}

		var newKittens= [];
		if (this.time.getVSU("cryochambers").on > 0) {
			var kittens = this.village.sim.kittens;

			var newKittensSort = [];
			for (i = 0; i < kittens.length; i++) {
				newKittensSort.push({"id": i, "sort": kittens[i].exp}); // Sorted by exp
			}
			newKittensSort.sort(function(a, b){return b.sort-a.sort;});

			for (var j = 0; j < this.time.getVSU("cryochambers").on; j++) {
				if (j < newKittensSort.length){
					delete kittens[newKittensSort[j].id].job;
					newKittens.push(kittens[newKittensSort[j].id]);
				}
			}
		}

		if (newKittens.length > 0) {
			var usedCryochambers_reset = this.time.filterMetadata([this.time.getVSU("usedCryochambers")], ["name", "val", "on"]);
			usedCryochambers_reset[0]["val"] = newKittens.length;
			usedCryochambers_reset[0]["on"] = newKittens.length;
		} else {
			var usedCryochambers_reset = this.time.filterMetadata([this.time.getVSU("usedCryochambers")], ["name", "val", "on"]);
			usedCryochambers_reset[0]["val"] = 0;
			usedCryochambers_reset[0]["on"] = 0;
		}

		var saveData = {
			saveVersion: this.saveVersion,
			game : lsData.game,
			resources: newResources,
			buildings: [],
			challenges: {
				challenges: this.challenges.challenges,
				currentChallenge: this.challenges.currentChallenge
			},
			diplomacy: {
				races: []
			},
			prestige: {
				perks: this.prestige.perks
			},
			religion: {
				faithRatio: this.religion.faithRatio,
				tcratio: this.religion.tcratio,
				zu: [],
				ru: [],
				tu: this.religion.filterMetadata(this.religion.transcendenceUpgrades, ["name", "val", "on", "unlocked"])
			},
			science: {
				hideResearched: false,
				techs: []
			},
			time: {
				cfu: [{
					name: "temporalImpedance",
					unlocked: this.time.getCFU("temporalImpedance").unlocked
				}],
				vsu: [],
				usedCryochambers: usedCryochambers_reset
			},
			village :{
				kittens: newKittens,
				jobs: []
			},
			achievements: lsData.achievements,
			stats: lsData.stats,
			statsCurrent: lsData.statsCurrent
		};

		if (anachronomancy.researched){
			saveData.science.techs.push(this.science.get("chronophysics"));
		}
		LCstorage["com.nuclearunicorn.kittengame.savedata"] = JSON.stringify(saveData);

		// Hack to prevent an autosave from occurring before the reload completes
		this.isPaused = true;
	},

	//TO BE USED EXTERNALLY
	rand: function(ratio){
		return (Math.floor(Math.random()*ratio));
	},

	//Karma has no menu. You get served what you deserve.
	updateKarma: function(){
		var stripe = 5;	//initial amount of kittens per stripe
		var karma = this.getTriValue(this.karmaKittens, stripe);

		this.resPool.get("karma").value = karma;

		if (this.karmaZebras){
			this.resPool.get("zebras").maxValue = this.karmaZebras+1;
		}
	},

	getTriValue: function(value, stripe){
		return (Math.sqrt(1+8 * value / stripe)-1)/2;
	},

	getTriValueOrigin: function(value, stripe) {
		return (Math.pow(value * 2 + 1, 2) - 1) * stripe / 8;
	},

	getTab: function(name) {
		switch(name) {
			case "science":
				return this.libraryTab;
			case "village":
				return this.villageTab;
			case "workshop":
				return this.workshopTab;
			case "space":
				return this.spaceTab;
			case "stats":
				return this.statsTab;
			case "time":
				return this.timeTab;
		}
	},

	calculateAllEffects: function() {
		// TODO: delegate this to managers? Can't be done in load unfortunately.
		this.upgrade({
			tech: this.science.techs.map(function(item){return item.name;}),
			perks: this.prestige.perks.map(function(item){return item.name;}),
			jobs: this.village.jobs.map(function(item){return item.name;}),
			crafts: this.workshop.crafts.map(function(item){return item.name;}),
			upgrades: this.workshop.upgrades.map(function(item){return item.name;}),
			buildings: this.bld.buildingsData.map(function(item){return item.name;}),
			spaceMission: this.space.programs.map(function(item){return item.name;}),
			spaceBuilding: this.space.spaceBuildingsMap,
			planet: this.space.planets.map(function(item){return item.name;}),
			chronoforge: this.time.chronoforgeUpgrades.map(function(item){return item.name;}),
			voidSpace: this.time.voidspaceUpgrades.map(function(item){return item.name;}),
			zigguratUpgrades: this.religion.zigguratUpgrades.map(function(item){return item.name;}),
			religion: this.religion.religionUpgrades.map(function(item){return item.name;}),
			transcendenceUpgrades: this.religion.transcendenceUpgrades.map(function(item){return item.name;}),
			challenges: this.challenges.challenges.map(function(item){return item.name;})
		});
	},

	getUnlockByName: function(unlockId, type){
		switch(type) {
			case "tech":
				return this.science.get(unlockId);
			case "perks":
				return this.prestige.getPerk(unlockId);
			case "jobs":
				return this.village.getJob(unlockId);
			case "crafts":
				return this.workshop.getCraft(unlockId);
			case "upgrades":
				return this.workshop.get(unlockId);
			case "tabs":
				return this.getTab(unlockId);
			case "buildings":
				return this.bld.get(unlockId);
			case "spaceMission":
				return this.space.getProgram(unlockId);
			case "spaceBuilding":
				return this.space.getBuilding(unlockId);
			case "planet":
				return this.space.getPlanet(unlockId);
			case "chronoforge":
				return this.time.getCFU(unlockId);
			case "voidSpace":
				return this.time.getVSU(unlockId);
			case "stages":
				return this.bld.get(unlockId.bld);
			case "zigguratUpgrades":
				return this.religion.getZU(unlockId);
			case "religion":
				return this.religion.getRU(unlockId);
			case "transcendenceUpgrades":
				return this.religion.getTU(unlockId);
			case "challenges":
				return this.challenges.getChallenge(unlockId);
		}
	},

	unlock: function(list){
		for (var type in list) {
			if (list[type].length == 0) {
				return;
			}
			for (var i = list[type].length - 1; i >= 0; i--) {
				var unlockId = list[type][i];
				var newUnlock = this.getUnlockByName(unlockId, type);
				if (type == "tabs") {
					newUnlock.visible = true;
				} else if (type == "buildings") {
					newUnlock.unlockable = true;
				} else if (type == "stages") {
					newUnlock.stages[unlockId.stage].stageUnlocked = true;
				} else if (type == "jobs" && unlockId == "priest" && this.challenges.currentChallenge == "atheism") {
					// do nothing
				} else {
					newUnlock.unlocked = true;
				}
			}
		}
	},

	upgrade: function(list){
		this.updateCaches();
		for (var type in list) {
			if (list[type].length == 0) {
				return;
			}
			for (var i = list[type].length - 1; i >= 0; i--) {
				var item = this.getUnlockByName(list[type][i], type);
				if (item.calculateEffects){
					item.calculateEffects(item, this);
					if (type == "spaceBuilding") {
						this.calendar.cycleEffectsBasics(item.effects, item.name);
					}
				}
			}
		}
	},

	toggleFilters: function(){
		var filtersDiv = $("#logFilters");
		filtersDiv.toggle();

		$("#filterIcon")[0].innerHTML = filtersDiv.is(':visible') ? "-" : "+";
	},

    registerUndoChange: function(){
        var undoChange = new classes.game.UndoChange();
        undoChange.ttl = undoChange._static.DEFAULT_TTL * this.rate;

        this.undoChange = undoChange;

        return undoChange;
    },

    undo: function(){
        if (!this.undoChange) {
            return;
        }

        /**
         * I am too tired to write proper logic, let it be simple hashmap of references
         */
        var managers = {
           "workshop": this.workshop
        };

        for (var i in this.undoChange.events){
            var event = this.undoChange.events[i];
            var mgr = managers[event.managerId];

            if (mgr && mgr.undo){
                mgr.undo(event.metaId, event.value);
            }
        }

        this.undoChange = null;
    },

    //-----------------------------------------------------------------

    initKongregateApi: function(){
        var self = this;
        kongregateAPI.loadAPI(function(){
            self.kongregate = kongregateAPI.getAPI();

            console.log("Kongregate API initialized successfully, updating stats...");

            self.kongregate.stats.submit("paragon", self.resPool.get("paragon").value);
            self.kongregate.stats.submit("karma", self.karmaKittens);

            self.achievements.updateStatistics();
        });
    },

	redeemGift: function(){
		if (this.resPool.get("elderBox").value == 0) {
			return;
		}

		var gift = "Karma";
		if(this.resPool.get("paragon").value >= 100) {
			gift = "Paragon";
		}
		if(this.resPool.get("timeCrystal").value && this.prestige.getPerk("anachronomancy").researched) {
			gift = "TimeCrystal";
		}
		if(this.resPool.get("sorrow").value / this.resPool.get("sorrow").maxValue < 0.25 && this.prestige.getPerk("megalomania").researched && this.religion.getZU("blackPyramid").val < 3) {
			gift = "BLS";
		}
		if(this.religion.getRU("apocripha").on) {
			gift = "Apocrypha";
		}
		if(this.religion.getRU("transcendence").on && this.religion.getTranscendenceLevel() <= 10) {
			gift = "Transcendence";
		}
		if(this.prestige.getPerk("engeneering").researched && !this.prestige.getPerk("renaissance").researched) {
			gift = "Metaphysics";
		}
		if(this.bld.get("chronosphere").on) {
			gift = "Compendiums";
		}

		switch (gift) {
			case "Karma":
				if(this.resPool.get("karma").value > 50) {
					var amt = 25 * Math.min(this.karmaKittens, 25000);
				} else {
					var amt = 5000;
				}
				var karmaGained = this.getTriValue(this.karmaKittens + amt, 5) - this.getTriValue(this.karmaKittens, 5);
				var msg = "Got " + this.getDisplayValueExt(karmaGained) + " Karma!";
				this.karmaKittens += amt;
				break;
			case "Paragon":
				if(this.resPool.get("paragon").value > 500) {
					var amt = Math.min(this.resPool.get("paragon").value, 1000);
				} else {
					var amt = 100;
				}
				var msg = "Got " + this.getDisplayValueExt(amt) + " Paragon!";
				this.resPool.addResEvent("paragon", amt);
				break;
			case "TimeCrystal":
				if(this.resPool.get("timeCrystal").value > 100) {
					var amt = Math.min(this.resPool.get("timeCrystal").value, 2000);
				} else {
					var amt = 50;
				}
				var msg = "Got " + this.getDisplayValueExt(amt) + " Time Crystals!";
				this.resPool.addResEvent("timeCrystal", amt);
				break;
			case "BLS" :
				amt = this.resPool.get("sorrow").maxValue - this.resPool.get("sorrow").value;
				var msg = "Got " + this.getDisplayValueExt(amt) + " Black Liquid Sorrow!";
				this.resPool.addResEvent("sorrow", amt);
				break;
			case "Apocrypha":
				if(this.religion.faithRatio > 10) {
					var amt = 4*Math.min(this.religion.faithRatio, 1000);
				} else {
					var amt = 5;
				}
				var pre = this.religion.getFaithBonus();
				this.religion.faithRatio += amt;
				var post = this.religion.getFaithBonus();
				var apocryphaGained = (post-pre)*100;
				var msg = "Apocrypha Bonus increased by " + this.getDisplayValueExt(apocryphaGained) + "%!";
				break;
			case "Transcendence":
				var amt = this.religion.getTranscendenceRatio(this.religion.getTranscendenceLevel() + 4) - this.religion.getTranscendenceRatio(this.religion.getTranscendenceLevel());
				this.religion.tcratio += amt;
				var msg = "Transcendence Level increased by 4!";
				break;
			case "Metaphysics":
				if(!this.prestige.getPerk("goldenRatio").researched) {
					this.prestige.getPerk("goldenRatio").researched = true;
					this.unlock(this.prestige.getPerk("goldenRatio").unlocks);
					var perk = "Golden Ratio";
				}
				else if (!this.prestige.getPerk("divineProportion").researched) {
					this.prestige.getPerk("divineProportion").researched = true;
					this.unlock(this.prestige.getPerk("divineProportion").unlocks);
					var perk = "Divine Proportion";
				}
				else if (!this.prestige.getPerk("vitruvianFeline").researched) {
					this.prestige.getPerk("vitruvianFeline").researched = true;
					this.unlock(this.prestige.getPerk("vitruvianFeline").unlocks);
					var perk = "Vitruvian Feline";
				}
				else if (!this.prestige.getPerk("renaissance").researched) {
					this.prestige.getPerk("renaissance").researched = true;
					var perk = "Renaissance";
				}
				var msg = "Unlocked " + perk + "!";
				break;
			case "Compendiums":
				if(this.resPool.get("compedium").value>500000) {
					var amt = 4 * this.resPool.get("compedium").value;
				} else {
					var amt = 100000;
				}
				var msg = "Got " + this.getDisplayValueExt(amt) + " Compendiums!";
				this.resPool.addResEvent("compedium", amt);
			break;
		}

		this.msg(msg);
		this.resPool.addResEvent("elderBox", -1);
		this.resPool.addResEvent("wrappingPaper", 1);
	}
});

