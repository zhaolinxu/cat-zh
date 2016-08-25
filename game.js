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
dojo.declare("com.nuclearunicorn.game.ui.Timer", null, {
	handlers: [],
	scheduledHandlers: [],

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
	statics: {
		effectMeta: {
			//=====================
			//		catnip
			//=====================

			//	effect id
			"catnipPerTickBase" : {
				//title to be displayed for effect, id if not defined
				title: "Catnip production",

				//effect will be hidden if resource is not unlocked
				resName: "catnip",

				//value will be affected by opts.usePerSecondValues
				type: "perTick"
			},
			"catnipPerTick" : {
				title: "Catnip conversion",
				resName: "catnip",
				type: "perTick"
			},

			"catnipDemandRatio" : {
				title: "Catnip demand reduction",
				resName: "catnip",
				type: "ratio"
			},
			"catnipRatio" : {
				title: "Catnip bonus",
				resName: "catnip",
				type: "ratio"
			},
			"catnipJobRatio" : {
				title: "Farmer tools",
				resName: "catnip",
				type: "ratio"
			},
			"catnipMax" : {
				title: "Max Catnip",
				resName: "catnip"
			},
			"catnipConsumption" : {
				title: "Catnip Demand",
				resName: "catnip",
				type: "perTick"
			},

			/* Worker pseudoeffect */
			"catnip" : {
				title: "catnip",
				resName: "catnip",
				type: "perTick"
			},

			//wood

			"woodMax" : {
				title: "Max Wood",
				resName: "wood"
			},

			"woodRatio" : {
				title: "Wood bonus",
				resName: "wood",
				type: "ratio"
			},

			"woodJobRatio" : {
				title: "Woodcutter tools",
				resName: "wood",
				type: "ratio"
			},

			"wood" : {
				title: "wood",
				resName: "wood",
				type: "perTick"
			},

			"woodPerTick" : {
				title: "Wood conversion",
				resName: "wood",
				type: "perTick"
			},

			//minerals

			"mineralsMax" : {
				title: "Max Minerals",
				resName: "minerals"
			},

			"mineralsRatio" : {
				title: "Minerals bonus",
				resName: "minerals",
				type: "ratio"
			},

			"mineralsPerTick" : {
				title: "Minerals conversion",
				resName: "minerals",
				type : "perTick"
			},

			"minerals" : {
				title: "minerals",
				resName: "minerals",
				type: "perTick"
			},

			//iron

			"ironMax" : {
				title: "Max Iron",
				resName: "iron"
			},

			"ironPerTick" : {
				title: "Iron conversion",
				resName: "iron",
				type: "perTick"
			},

			//coal

			"coal" : {
				title: "coal",
				resName: "coal",
				type: "perTick"
			},

			"coalMax" : {
				title: "Max Coal",
				resName: "coal"
			},

			"coalPerTickBase" : {
				title: "Coal production",
				resName: "coal",
				type : "perTick"
			},

			"coalRatioGlobal" : {
				title: "Coal production penalty",
				resName: "coal",
				type: "ratio"
			},

			"coalPerTick" : {
				title: "Coal conversion",
				resName: "coal",
				type: "perTick"
			},

			//steel

			"steelPerTick" : {
				title: "Steel conversion",
				type : "perTick"
			},

			//gold

			"goldMax" : {
				title: "Max Gold",
				resName: "gold"
			},

			"gold" : {
				title: "gold",
				resName: "gold",
				type: "perTick"
			},

			"goldPerTick" : {
				title: "Gold conversion",
				resName: "gold",
				type: "perTick"
			},

			//titanium

			"titaniumMax" : {
				title: "Max Titanium",
				resName: "titanium"
			},

			"titaniumPerTick" : {
				title: "Titanium conversion",
				resName: "titanium",
				type: "perTick"
			},

			//oil

			"oilReductionRatio" : {
				title: "Oil consumption reduction",
				type: "ratio"
			},



			//kittens

			"maxKittens" : {
				title: "Kittens",
			},

			//catpower

			"manpowerMax": {
				title: "Max Catpower",
				resName: "manpower"
			},

			"manpower" : {
				title: "catpower",
				resName: "manpower",
				type: "perTick"
			},

			"manpowerJobRatio" : {
				title: "Hunter tools",
				resName: "manpower",
				type: "ratio"
			},

			"manpowerPerTick" : {
				title: "Catpower conversion",
				resName: "manpower",
				type: "perTick"
			},

			//science

			"scienceRatio" : {
				title: "Science bonus",
				type: "ratio"
			},

			"scienceMax" : {
				title: "Max Science"
			},

			"learnRatio" : {
				title: "Skills learning",
				type: "perTick"
			},

			"science" : {
				title: "science",
				resName: "science",
				type: "perTick"
			},

			"observatoryRatio" : {
                title: "Observatory's science ratio",
                type: "ratio"
            },

			//culture

			"cultureMax" : {
				resName: "culture",
				title: "Max Culture"
			},

			"culturePerTickBase" : {
				resName: "culture",
				title: "Culture",
				type: "perTick"
			},

			//oil

			"magnetoBoostRatio" : {
				title: "Magneto boost",
				resName: "oil",				//this is sort of hack to prevent early spoiler on magnetos
				type: "ratio"
			},

			"oilMax" : {
				resName: "oil",
				title: "Max Oil"
			},

			"oilPerTickBase" : {
				resName: "oil",
				title: "Oil production",
				type: "perTick"
			},

			"oilPerTick" : {
				resName: "oil",
				title: "Oil conversion",
				type: "perTick"
			},

			//faith

			"faithMax" : {
				title: "Max Faith",
				resName: "faith"
			},

			"faith" : {
				title: "faith",
				resName: "faith",
				type: "perTick"
			},

			"faithPerTickBase" : {
				title: "Faith",
				resName: "faith",
				type: "perTick"
			},

			//uranium

			"uraniumMax" : {
				title: "Max Uranium",
				resName: "uranium"
			},

			"uraniumPerTick": {
				title: "Uranium conversion",
				resType: "uranium",
				type: "perTick"
			},

			//unobtainium

			"unobtainiumMax" : {
				title: "Max Unobtainium",
				resName: "unobtainium"
			},

			"unobtainiumPerTick": {
				title: "Unobtainium conversion",
				resType: "unobtainium",
				type: "perTick"
			},

			//antimatter
			"antimatterProduction": {
				title: "Antimatter production"
			},

			//unicorns

			"unicornsPerTickBase": {
				title: "Unicorn production",
				resType: "unicorns",
				type: "perTick"
			},

			//manuscripts

			"manuscriptPerTick": {
				title: "Manuscript automated production",
				resType: "manuscript",
				type: "perTick"
			},

			//starchart

			"starchart" : {
				title: "starchart",
				resName: "starchart",
				type: "perTick"
			},

			"starchartPerTickBase": {
				title: "Starchart production",
				resType: "starchart",
				type: "perTick"
			},

			//miscellaneous

			"refineRatio": {
				title: "Catnip refine bonus",
				type: "ratio"
			},

			"craftRatio": {
				title: "Craft bonus",
				type: "ratio"
			},

			"fursDemandRatio" : {
				title: "Furs demand reduction",
				resName: "furs",
				type: "ratio"
			},

			"fursPerTick": {
				title: "Furs conversion",
				resType: "furs",
				type: "perTick"
			},

			"ivoryDemandRatio" : {
				title: "Ivory demand reduction",
				resName: "ivory",
				type: "ratio"
			},

			"ivoryPerTick": {
				title: "Ivory conversion",
				resType: "ivory",
				type: "perTick"
			},

			"spiceDemandRatio" : {
				title: "Spice demand reduction",
				resName: "spice",
				type: "ratio"
			},

			"happiness": {
				title: "Happiness"
			},

			"unhappinessRatio": {
				title: "Unhappiness reduction",
				type: "ratio"
			},

			"mintEffect": {
				title: "Mint effect",
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

			// energy

			"energyProduction": {
				title: "Energy production"
			},
			"energyConsumption": {
				title: "Energy consumption"
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
                title: "Hunts know-how",
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

            // cycleEffects
            "prodTransferBonus_cycleEffect" : {
                title: "Zodiac effect Production transfer bonus",
                type: "ratio"
            },
            "starchartPerTickBase_cycleEffect" : {
                title: "Zodiac effect Starchart production",
                type: "ratio"
            },
            "observatoryRatio_cycleEffect" : {
                title: "Zodiac effect Observatory's science ratio",
                type: "ratio"
            },
            "energyConsumption_cycleEffect" : {
                title: "Zodiac effect Energy consumption",
                type: "ratio"
            },
            "uraniumPerTick_cycleEffect" : {
                title: "Zodiac effect Uranium production",
                type: "ratio"
            },
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
	paragonPoints: 0,	//endgame prestige
	deadKittens: 0,
	ironWill: true,		//true if player has no kittens or housing buildings

	saveVersion: 3,

	//FINALLY
	opts: null,

	gatherTimeoutHandler: null,	//timeout till resetting gather counter, see below
	gatherClicks: 0,	//how many clicks in a row was performed on a gather button
	cheatMode: false,	//flag triggering Super Unethical Climax achievement

	ticks: 0,				//how many ticks passed since the start of the game
	totalUpdateTime: 0,		//total time spent on update cycle in milliseconds, useful for debug/fps counter

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
			IWSmelter: true
		};

		this.console = new com.nuclearunicorn.game.log.Console();

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
		this.timeTab.visible = true;
		this.addTab(this.timeTab);

		this.achievementTab = new com.nuclearunicorn.game.ui.tab.AchTab("Achievements", this);
		this.achievementTab.visible = false;
		this.addTab(this.achievementTab);

        this.statsTab = new classes.tab.StatsTab("Stats", this);
        this.statsTab.visible = false;
        this.addTab(this.statsTab);

		//vvvv do not forget to toggle tab visibility below

		this.timer = new com.nuclearunicorn.game.ui.Timer();


		//Update village resource production.
		//Since this method is CPU heavy and rarely used, we will call with some frequency, but not on every tick
		this.timer.addEvent(dojo.hitch(this, function(){
			this.village.updateResourceProduction();
		}), 10);	//every 2 seconds

		this.timer.addEvent(dojo.hitch(this, function(){

			this.bld.invalidateCachedEffects();
			this.workshop.invalidateCachedEffects();
			this.religion.invalidateCachedEffects();

			this.updateResources();
		}), 5);		//once per 5 ticks

		this.resTable = new com.nuclearunicorn.game.ui.GenericResourceTable(this, "resContainer");
		this.craftTable = new com.nuclearunicorn.game.ui.CraftResourceTable(this, "craftContainer");

		this.timer.addEvent(dojo.hitch(this, function(){ this.resTable.update(); }), 1);	//once per tick
		this.timer.addEvent(dojo.hitch(this, function(){ this.craftTable.update(); }), 3);	//once per 3 tick

		this.timer.addEvent(dojo.hitch(this, function(){ this.achievements.update(); }), 50);	//once per 50 ticks, we hardly need this


		this.effectsMgr = new com.nuclearunicorn.game.EffectsManager();

		//--------------------------
		var dropBoxClient = new Dropbox.Client({ key: 'u6lnczzgm94nwg3' });
		/*https://bloodrizer.ru/games/kittens/dropboxauth.html*/
		var driver = new Dropbox.AuthDriver.Popup({receiverUrl: "https://bloodrizer.ru/games/kittens/dropboxauth.html"});
		dropBoxClient.authDriver(driver);

		this.dropBoxClient = dropBoxClient;
	},

	getEffectMeta: function(effectName) {
		return this.effectsMgr.statics.effectMeta[effectName];
	},

	//TODO: store all managers in a single array and handle them in the common way
	getEffect: function(effectName){
		var effect = this.bld.getEffect(effectName) +
			this.space.getEffect(effectName);
            
        if ( effectName == "tcRefineRatio"){
			effect += this.religion.getEffect(effectName);   
        }
        return effect;
	},

	/**
	 * Display a message in the console. Returns a <span> node of a text container
	 */
	msg: function(message, type, tag){
		var hasCalendarTech = this.science.get("calendar").researched;


		var messageLine = this.console.static.msg(message, type, tag);
		if (messageLine && hasCalendarTech){
			this.console.static.msg("Year " + this.calendar.year + " - " + this.calendar.seasons[this.calendar.season].title, "date", null);
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
		this.paragonPoints = 0;
		this.ironWill = true;
		this.deadKittens = 0;
		this.cheatMode = false;

		this.opts = {
			usePerSecondValues: true,
			usePercentageResourceValues: false,
			highlightUnavailable: false,
			hideSell: false,
			noConfirm: false,
			IWSmelter: true
		};

		this.resPool.resetState();
		this.village.resetState();
		this.calendar.resetState();
		this.console.static.resetState();

		for (var i in this.managers){
			this.managers[i].resetState();
		}

		for (var i in this.tabs){
			if (this.tabs[i].tabId != "Bonfire"){
				this.tabs[i].visible = false;
			}
		}

		this.bld.invalidateCachedEffects();
		this.workshop.invalidateCachedEffects();
		this.religion.invalidateCachedEffects();
		this.village.invalidateCachedEffects();
	},

	save: function(){
		this.ticksBeforeSave = this.autosaveFrequency;

		var saveData = {
			saveVersion: this.saveVersion,
			resources: this.resPool.filterMetadata(
				this.resPool.resources, ["name", "value", "isHidden"]
			)
		};

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
			paragonPoints: this.paragonPoints,
			ironWill : this.ironWill,
			deadKittens: this.deadKittens,
			cheatMode: this.cheatMode,

			opts : this.opts
		};

		LCstorage["com.nuclearunicorn.kittengame.savedata"] = JSON.stringify(saveData);

		console.log("Game saved");
	},

	wipe: function(){
		LCstorage["com.nuclearunicorn.kittengame.savedata"] = null;
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
	},

	updateOptionsUI: function(){
		this.ui.updateOptions();
	},

	load: function(){
		var data = LCstorage["com.nuclearunicorn.kittengame.savedata"];
		if (!data){
			this.calculateAllEffects();
			this.updateOptionsUI();
			return;
		}

		this.resetState();
		try {
			var saveData = JSON.parse(data);

			//console.log("restored save data:", localStorage);
			if (saveData){
				this.migrateSave(saveData);

				this.resPool.load(saveData);
				this.village.load(saveData);
				this.calendar.load(saveData);
				this.console.static.load(saveData);

                for (var i in this.managers){
                    this.managers[i].load(saveData);
                }
			}
		} catch (ex) {
			console.error("Unable to load game data: ", ex);
            console.trace();
			this.msg("Unable to load save data. Close the page and contact the dev.");
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
			this.paragonPoints = (data.paragonPoints !== undefined) ? data.paragonPoints : 0;
			this.deadKittens = (data.deadKittens !== undefined) ? data.deadKittens : 0;
			this.ironWill = (data.ironWill !== undefined) ? data.ironWill : true;
			this.useWorkers = (data.useWorkers !== undefined) ? data.useWorkers : false;

			this.cheatMode = (data.cheatMode !== undefined) ? data.cheatMode : false;
			this.forceHighPrecision = (data.forceHighPrecision !== undefined) ? data.forceHighPrecision : false;

			/*-------------------------------------------
			I don't know how to change it with this.resPool.get("sorrow").maxValue :

			this.sorrow = data.sorrow || 0;
			var nerfs = data.nerfs || 0;

			if (nerfs < this.nerfs && this.calendar.year >= 100){
				this.sorrow++;
				this.msg("Black rain is falling over the village");
			}
			-------------------------------------------*/


			// ora ora
			if (data.opts){
				for (var opt in data.opts){
					this.opts[opt] = data.opts[opt];
				}
			}

			this.updateOptionsUI();
		}
		//------------------------------------

		this.villageTab.visible = (this.resPool.get("kittens").value > 0 || this.resPool.get("zebras").value > 0);
		this.libraryTab.visible = (this.bld.getBuilding("library").val > 0);
		this.workshopTab.visible = (this.bld.getBuilding("workshop").val > 0);
		this.achievementTab.visible = (this.achievements.hasUnlocked());

		if (this.karmaKittens > 0 || this.science.get("math").researched ) {
			this.statsTab.visible = true;
		}

		this.diplomacyTab.visible = (this.diplomacy.hasUnlockedRaces());
		this.religionTab.visible = (this.resPool.get("faith").value > 0);
		this.spaceTab.visible = (this.science.get("rocketry").researched);
		this.timeTab.visible = (this.science.get("calendar").researched);
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
			this.load();
			this.msg("Save import successful!");

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
			// Move upgradable programs from programs to cath planet
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
		var workshopResRatio = this.workshop.getEffect(res.name+"JobRatio");

		perTick += resProduction * workshopResRatio;

		// +*BEFORE PRODUCTION BOOST (UPGRADE EFFECTS GLOBAL)
		perTick *= 1 + this.workshop.getEffect(res.name+"GlobalRatio");

		// +*BUILDINGS AND SPACE PRODUCTION
		perTick *= 1 + this.getEffect(res.name + "Ratio");

		// +*AFTER PRODUCTION BOOST (UPGRADE EFFECTS SUPER)
		perTick *= 1 + this.workshop.getEffect(res.name+"SuperRatio");

		// +*RELIGION EFFECTS
		perTick *= 1 + this.religion.getEffect(resName+"Ratio");

		// +*AFTER PRODUCTION REDUCTION (SPECIAL STEAMWORKS HACK FOR COAL)
		var steamworks = this.bld.get("steamworks");
		var swEffectGlobal = steamworks.effects[res.name+"RatioGlobal"];
		if (steamworks.on > 0 && swEffectGlobal) {
			perTick *= 1 + swEffectGlobal;
		}

		// *PARAGON BONUS
		var ParagonProductionRatio = 1 + this.prestige.getParagonProductionRatio();

		perTick *= ParagonProductionRatio;

			//ParagonSpaceProductionRatio definition 1/4
			var ParagonSpaceProductionRatio = 1 + this.prestige.getParagonProductionRatio() * 0.05;

		// +SPACE AUTOPROD
		var perTickAutoprod = this.getEffect(res.name + "PerTickAutoprod");
		    perTickAutoprod *= 1 + (this.prestige.getParagonProductionRatio() * 0.05);

		perTick += perTickAutoprod;

		// *MAGNETOS PRODUCTION BONUS
		if (!res.transient && this.bld.get("magneto").on > 0){

			var steamworks = this.bld.get("steamworks");
			var swRatio = steamworks.on > 0 ? (1+ steamworks.effects["magnetoBoostRatio"] * steamworks.on) : 1;
			if (res.name != "oil"){
				perTick *= 1 + (this.bld.getEffect("magnetoRatio") * swRatio);
			}

				//ParagonSpaceProductionRatio definition 2/4
				ParagonSpaceProductionRatio += ParagonSpaceProductionRatio * this.bld.getEffect("magnetoRatio") * swRatio; //These special cases need to die in a hole

		}

		// +*REACTOR PRODUCTION BONUS
		if (!res.transient && res.name != "uranium"){
			perTick *= 1 + this.bld.getEffect("productionRatio");

				//ParagonSpaceProductionRatio definition 3/4
				ParagonSpaceProductionRatio += ParagonSpaceProductionRatio * this.bld.getEffect("productionRatio");
		}

		// +*FAITH BONUS
		perTick *= 1 + (this.religion.getProductionBonus() / 100);

			//ParagonSpaceProductionRatio definition 4/4
			ParagonSpaceProductionRatio += ParagonSpaceProductionRatio * this.religion.getProductionBonus() / 100;

		// +AUTOMATED PRODUCTION BUILDING
		perTick += this.getEffect(res.name + "PerTickProd");

		// +AUTOMATED PRODUCTION SPACE (FULL BONUS)
		perTick += (this.getEffect(res.name + "PerTickAutoprodSpace") * spaceRatio) * (1 + (ParagonSpaceProductionRatio-1) * this.getEffect("prodTransferBonus"));
		// +AUTOMATED PRODUCTION SPACE (NOT FULL BONUS)
		perTick += this.getEffect(res.name + "PerTickSpace") *spaceRatio;

		//CYCLE EFFECTS
		//Building dependent, will be a pain to move over. I'll do it later.

		//CYCLE FESTIVAL EFFECTS

		effects = {};
		effects[resName] = perTick;
		this.calendar.cycleEffects(effects);
		perTick = effects[resName];

		// +BUILDING AND SPACE PerTick
		perTick += this.getEffect(res.name + "PerTick");

		// -EARTH CONSUMPTION
		var resMapConsumption = this.village.getResConsumption();
		var resConsumption = resMapConsumption[res.name] || 0;
		resConsumption *= 1 + this.bld.getEffect(res.name + "DemandRatio", true);

		perTick += resConsumption;

		// -SPACE CONSUMPTION
		perTick -= this.space.getEffect(res.name + "Consumption");

		if (isNaN(perTick)){
			return 0;
		}

		return perTick;
	},

	/**
	 * Generates a stack of resource modifiers. (TODO: use it with resource per tick calculation logic)
	 */
	getResourcePerTickStack: function(resName, calcAutomatedEffect, season){

		var res = null;
		for (var i = 0; i < this.resPool.resources.length; i++){
			if (this.resPool.resources[i].name == resName){
				res = this.resPool.resources[i];
				break;
			}
		}

		var stack = [];

		// BUILDING PerTickBase
		stack.push({
			name: "Production",
			type: "fixed",
			value: this.getEffect(res.name + "PerTickBase")
		});

		// SPACE RATIO CALCULATION
		var spaceRatio = 1 + this.getEffect("spaceRatio");
		if (this.workshop.get("spaceManufacturing").researched && res.name!="uranium"){
			var factory = this.bld.get("factory");
			spaceRatio *= (1 + factory.on * factory.effects["craftRatio"] * 0.75);
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
				value: spaceRatio
			});
		//<----
		stack.push(perTickBaseSpaceStack);

			// prodNVillage_bool
			prodNVillage_bool = this.getEffect(res.name + "PerTickBase")+this.getEffect(res.name + "PerTickBaseSpace");

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
					value: this.workshop.getEffect(res.name + "JobRatio")
				});
		//<----
		stack.push(villageStack);

			// prodNVillage_bool
			prodNVillage_bool += resMapProduction[res.name] || 0;

		// +*BEFORE PRODUCTION BOOST (UPGRADE EFFECTS GLOBAL)
		stack.push({
			name: "Upgrades",
			type: "ratio",
			value: this.workshop.getEffect(res.name + "GlobalRatio")
		});

		// +*BUILDINGS AND SPACE PRODUCTION
		stack.push({
			name: "Buildings",
			type: "ratio",
			value: this.bld.getEffect(res.name + "Ratio")
		});

		// +*AFTER PRODUCTION BOOST (UPGRADE EFFECTS SUPER)
		stack.push({
			name: "Boost",
			type: "ratio",
			value: this.workshop.getEffect(res.name + "SuperRatio")
		});

		// +*RELIGION EFFECTS
		stack.push({
			name: "Religion",
			type: "ratio",
			value: this.religion.getEffect(res.name + "Ratio")
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
		stack.push({
			name: "Paragon",
			type: "ratio",
			value: this.prestige.getParagonProductionRatio()
		});

			//ParagonSpaceProductionRatio definition 1/4
			var ParagonSpaceProductionRatio = 1 + this.prestige.getParagonProductionRatio() * 0.05;

		// +SPACE AUTOPROD
		stack.push({
			name: "Conversion Production",
			type: "fixed",
			value: this.getEffect(res.name + "PerTickAutoprod")
		});

		// *MAGNETOS PRODUCTION BONUS
		if (!res.transient && this.bld.get("magneto").on > 0){

			var steamworks = this.bld.get("steamworks");
			var swRatio = steamworks.on > 0 ? (1+ steamworks.effects["magnetoBoostRatio"] * steamworks.on) : 1;
			if (res.name != "oil"){
				stack.push({
					name: "Magnetos",
					type: "ratio",
					value: this.bld.getEffect("magnetoRatio") * swRatio
				});
			}

				//ParagonSpaceProductionRatio definition 2/4
				ParagonSpaceProductionRatio += ParagonSpaceProductionRatio * this.bld.getEffect("magnetoRatio") * swRatio; //These special cases need to die in a hole
		}

		// +*REACTOR PRODUCTION BONUS
		if (!res.transient && res.name != "uranium") {
			stack.push({
				name: "Reactors",
				type: "ratio",
				value: this.bld.getEffect("productionRatio")
			});

				//ParagonSpaceProductionRatio definition 3/4
				ParagonSpaceProductionRatio += ParagonSpaceProductionRatio * this.bld.getEffect("productionRatio");

		}

		// +*FAITH BONUS
		stack.push({
			name: "Faith",
			type: "ratio",
			value: this.religion.getProductionBonus() / 100
		});

			//ParagonSpaceProductionRatio definition 4/4
			ParagonSpaceProductionRatio += ParagonSpaceProductionRatio * this.religion.getProductionBonus() / 100;

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
				value: spaceRatio
			});
			perTickAutoprodSpaceStack.push({
				name: "Paragon",
				type: "ratio",
				value: ParagonSpaceProductionRatio - 1
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
				value: spaceRatio
			});
		//<----
		stack.push(perTickSpace);

		//CYCLE EFFECTS
		//Building dependent, will be a pain to move over. I'll do it later.

		//CYCLE FESTIVAL EFFECTS
		var effects = {};
		effects[res.name] = 1;
		this.calendar.cycleEffects(effects);
		cycleEffect = effects[resName]-1;

		stack.push({
			name: "Cycle Festival Effect",
			type: "ratio",
			value: cycleEffect
		});

		// +BUILDING AND SPACE PerTick
		stack.push({
			name: "Independente production",
			type: "fixed",
			value: this.getEffect(res.name + "PerTick")
		});

		// -EARTH CONSUMPTION && -SPACE CONSUMPTION
		var resMapConsumption = this.village.getResConsumption();
		var resConsumption = resMapConsumption[res.name] || 0;
		resConsumption *= 1 + this.bld.getEffect(res.name + "DemandRatio", true);
		resConsumption -= this.space.getEffect(res.name + "Consumption");

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

		/*
		if (prodNVillage_bool &&
		   (this.getEffect(res.name + "PerTick") || res.name == "catnip")
		) {
			stack.push({
				name: "Prod & Village",
				type: "fixed",
				value: this.resPool.get(res.name).perTickUI - this.getEffect(res.name + "PerTick")
			});
		}

				*/

		return stack;
	},

	getCraftRatio: function() {
		var craftRatio = this.bld.getEffect("craftRatio");
		if (this.village.leader && this.village.leader.trait["name"] == "engineer") {
			craftRatio += 0.05;
		}
		return craftRatio;
	},

	getResCraftRatio: function(res){
		if (res.name == "wood"){
			var refineRatio = this.bld.getEffect("refineRatio");
			if (this.ironWill){
				return ( (1 + refineRatio) * (1 + this.bld.getEffect("woodRatio")) ) - 1;
			} else {
				return refineRatio;
			}
		}

		if (res.name == "blueprint"){
			var bpRatio = this.workshop.getEffect("blueprintCraftRatio");
			var scienceBldAmt = this.bld.get("library").val + this.bld.get("academy").val +
				this.bld.get("observatory").val + this.bld.get("biolab").val;

			var ratio = this.getCraftRatio();

			return ratio + scienceBldAmt * bpRatio;
		}

		if (res.name == "kerosene"){
			var fRatio = this.workshop.getEffect("factoryRefineRatio");

			var amt = this.bld.get("factory").val;
			var ratio = this.getCraftRatio();

			return ratio * (1 + amt * fRatio * 0.75);	//25% penalty
		}

        //get resource specific craft ratio (like factory bonus)
        var resCraftRatio = this.bld.getEffect(res.name + "CraftRatio") || 0;

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

		if (this.ticks % 5 == 0 && this.tooltipUpdateFunc) {
			this.tooltipUpdateFunc();
		}

        //--------------------
        //  Update UI state
        //--------------------
        this.ui.update();
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
		this.resPool.getResourcePerTickAutomateThisTick = [];
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

		/*for (i in this.managers){
		 if (this.managers[i].update){
		 this.managers[i].update();
		 }
		 }*/

		//nah, kittens are not a resource anymore (?)
		var kittens = this.resPool.get("kittens");
		kittens.value = this.village.getKittens();	//just a simple way to display them
		kittens.maxValue = this.village.maxKittens;

		this.updateAdvisors();

		this.timer.update();

		this.resPool.update();
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
			res.perTickUI = this.calcResourcePerTick(res.name);
		}
	},

	getResourcePerTick: function(resName, calcAutomatedEffect){
		var res = this.resPool.get(resName);
		return res.perTickUI;
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

	updateAdvisors: function(){

		if (this.bld.get("field").val == 0){
			return;
		}

		var advDiv = dojo.byId("advisorsContainer");
		dojo.empty(advDiv);

		var winterDays = this.calendar.daysPerSeason -
			(this.calendar.seasons[this.calendar.season].name === "winter" ? this.calendar.day : 0);

		var catnipPerTick = this.calcResourcePerTick("catnip", { modifiers:{
			"catnip" : 0.25
		}});	//calculate estimate winter per tick for catnip;

		if (this.resPool.get("catnip").value + ( winterDays * catnipPerTick / this.calendar.dayPerTick ) <= 0 ){
			advDiv.innerHTML = "<span>Food advisor: 'Your catnip supply is too low!'<span>";
		}

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
	attachTooltip: function(container, resRef){

		var tooltip = dojo.byId("tooltip");
		dojo.empty(tooltip);

		dojo.connect(container, "onmouseover", this, dojo.partial(function(resRef, tooltip, event){
			 if (!resRef.perTickUI){ return;}

			 tooltip.innerHTML = this.getDetailedResMap(resRef);

			 var target = event.originalTarget || event.toElement;	//fucking chrome
			 var pos = $(target).position();
			 if (!pos){
				 return;
			 }

			 dojo.setStyle(tooltip, "left", pos.left + 60 + "px");
			 dojo.setStyle(tooltip, "top",  pos.top + "px");

			 dojo.setStyle(tooltip, "display", "");
			 dojo.setStyle(container, "fontWeight", "bold");

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

		if (this.opts.usePercentageResourceValues){
			resString += "<br> Net gain: " + this.getDisplayValueExt(res.perTickUI, true, true);
		}

		if (res.perTickUI < 0) {
			var toZero = res.value / (-res.perTickUI * this.getRateUI());
			resString += "<br>To zero: " + this.toDisplaySeconds(toZero.toFixed());
		} else {
			if (res.maxValue) {
				var toCap = (res.maxValue - res.value) / (res.perTickUI * this.getRateUI());
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

		for (var i = 0; i < resStack.length; i++){
			var stackElem = resStack[i];

			if (stackElem.length){
				var subStack = this.processResourcePerTickStack(stackElem, res, depth + 1);
				if (subStack.length){
					resString += subStack;
					hasFixed = true;
				}
			}

			if (stackElem.value && stackElem.name == "Prod & Village") {
				resString += "<hr>";
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

		if (stackElem.name == "Conversion Consumption" && this.resPool.getResourcePerTickAutomateThisTick[res.name] == "lack") {
			resString += "<span style=\"color: red;\">&#8776;";
		}

		if (stackElem.type == "fixed"){
			resString += this.getDisplayValueExt(stackElem.value, true, true);
		} else {
			resString += this.getDisplayValueExt((stackElem.value * 100).toFixed(), true) + "%";
		}

		if (stackElem.name == "Conversion Cons" && this.resPool.getResourcePerTickAutomateThisTick[res.name] == "lack") {
			resString += "</span>";
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
			{limit:9e3,divisor:1e3,postfix:['K',' Kilo']}, //WHAT
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

		if (precision === undefined){
			precision = this.forceHighPrecision ? 3 : 2;
		}

		if (!floatVal.toFixed){
			return plusSign + floatVal;
		}

		if (floatVal.toFixed() == floatVal){
			return plusSign + floatVal.toFixed();
		} else {
			return plusSign + floatVal.toFixed(precision);
		}
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
		if (window.location.protocol == "file:") {

			var tsDiff = timestampEnd - timestampStart;
			this.totalUpdateTime += tsDiff;

			var avg = this.totalUpdateTime / this.ticks;

			if (tsDiff < 10) {tsDiff = 10;}
            if ($("#devPanelFPS")[0]) {
                $("#devPanelFPS")[0].innerHTML = "update time: " + tsDiff + " ms, avg: " + avg.toFixed() + " ms";
            }
		}
	},

	reset: function(){
		var msg = "Are you sure that you want to reset? You will get bonus points for happiness. You will also save your achievements and bonus points";
		if (this.resPool.get("kittens").value > 70){
			msg = "Are you sure that you want to reset? You will receive extra happiness and bonus to production.";
		}else if (this.resPool.get("kittens").value > 60){
			msg = "Are you sure that you want to reset? You will receive extra happiness bonus.";
		}else if (this.resPool.get("kittens").value <= 35){
			msg = "Are you sure that you want to reset? You will receive NO BONUS points. You will save old bonus points and achievements.";
		}

		if (!confirm(msg)){
			return;
		}

		this.timer.scheduleEvent(dojo.hitch(this, this._resetInternal));
	},

	discardParagon: function(){
		var msg = "Are you sure that you want to discard all your paragon points? This action can not be undone.";
		if (!confirm(msg)){
			return;
		}
		if (this.paragonPoints > 100){
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

		this.paragonPoints = 0;
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

	_resetInternal: function(){
		var kittens = this.resPool.get("kittens").value;
		if (kittens > 35){
			this.karmaKittens += this._getKarmaKittens(kittens);
		}

		var paragonPoints = 0;
		if (kittens > 70){
			paragonPoints = (kittens - 70);
		}

		this.paragonPoints += paragonPoints;
		this.karmaZebras = parseInt(this.karmaZebras);	//hack
		//that's all folks

		this.stats.getStat("totalParagon").val += paragonPoints;
		this.stats.getStat("totalResets").val++;

		//Reset current game stats
		this.stats.resetStatsCurrent();

		//-------------------------- very confusing and convoluted stuff related to karma zebras ---------------
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
				if( tech.cost){
					totalScience += tech.cost;
				}else{
					for (var j in tech.prices){
						if (tech.prices[j].name == "science"){
							totalScience += tech.prices[j].val;
						}
					}
				}
			}
		}
		bonusZebras += Math.floor(this.bld.getHyperbolicEffect(totalScience / 10000, 100));
		if (this.resPool.get("zebras").value > 0 && this.ironWill){
			this.karmaZebras += bonusZebras;
		}

		//pre-reset faith so people who forgot to do it properly would not be screwed
		if (this.religion.getRU("apocripha").researched){
			this.religionTab.resetFaithInternal(1);
		}
		//------------------------------------------------------------------------------------------------------

		// Trigger a save to make sure we're working with most recent data
		this.save();

		var lsData = JSON.parse(LCstorage["com.nuclearunicorn.kittengame.savedata"]);
		if (!lsData){
			lsData = {game: {}};
		}

		var saveRatio = this.bld.getEffect("resStasisRatio");
		dojo.mixin(lsData.game, {
			karmaKittens: 		this.karmaKittens,
			karmaZebras: 		this.karmaZebras,
			paragonPoints: 		this.paragonPoints,
			ironWill : 			saveRatio > 0 ? false : true,			//chronospheres will disable IW
			deadKittens: 		0
		});

		//------------ we can now carry some of the resources through reset ------------
		var newResources = [];
		var ignoreResources = ["kittens", "zebras", "unicorns", "alicorn", "tears", "furs", "ivory", "spice", "paragon", "karma", "necrocorn"];



		var fluxCondensator = this.workshop.get("fluxCondensator");
		for (var i in this.resPool.resources){
			var res = this.resPool.resources[i];

			if (res.craftable && res.name != "wood" && !fluxCondensator.researched){
				continue;	//>:
			}

			if (dojo.indexOf(ignoreResources, res.name) >= 0) {
				continue;
			} else if (res.name == "timeCrystal"){
				if (anachronomancy.researched){
					newResources.push(res);
				}
			} else if (res.persists){
				newResources.push(res);
			} else {
				var newRes = this.resPool.createResource(res.name, res.type);


				if (!res.craftable){
					newRes.value = res.value * saveRatio;
				} else if (res.value > 0) {
					newRes.value = Math.sqrt(res.value) * saveRatio * 100;
				}

				newResources.push(newRes);
			}
		}

		var saveData = {
			saveVersion: this.saveVersion,
			game : lsData.game,
			achievements: lsData.achievements,
			stats: lsData.stats,
			religion: {
				faithRatio: this.religion.faithRatio,
				tcratio: this.religion.tcratio,
				tu: this.religion.filterMetadata(this.religion.transcendenceUpgrades, ["name", "val"])
			},
			prestige: {
				perks: this.prestige.perks	//never resets
			},
			science: { techs: [], hideResearched: false },
			resources: newResources
		};

		if (anachronomancy.researched){
			saveData.science.techs.push(this.science.get("chronophysics"));
		}
		LCstorage["com.nuclearunicorn.kittengame.savedata"] = JSON.stringify(saveData);

		// Hack to prevent an autosave from occurring before the reload completes
		this.isPaused = true;
		window.location.reload();
	},

	//TO BE USED EXTERNALLY
	rand: function(ratio){
		return (Math.floor(Math.random()*ratio));
	},

	//Karma has no menu. You get served what you deserve.
	updateKarma: function(){
		var stripe = 5;	//initial amount of kittens per stripe
		var karma = this.getTriValue(this.karmaKittens, stripe);

		var milleniums = Math.floor(this.calendar.year / 1000);
		var paragon = milleniums - this.prestige.getSpentParagon();
		if (this.paragonPoints < paragon){
			this.paragonPoints = parseInt(paragon);
		}

		this.resPool.get("karma").value = karma;
		this.resPool.get("paragon").value = parseInt(this.paragonPoints);

		if (this.karmaZebras){
			this.resPool.get("zebras").maxValue = this.karmaZebras+1;
		}
	},

	getTriValue: function(value, stripe){
		return (Math.sqrt(1+8 * value / stripe)-1)/2;
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
		}
	},

	calculateAllEffects: function() {
		// TODO: delegate this to managers? Can't be done in load unfortunately.
		this.upgrade({
			buildings: this.bld.buildingsData.map(function(building){
				return building.name;
			}),
			jobs: this.village.jobs.map(function(job){
				return job.name;
			})
		});
	},

	getUnlockByName: function(unlockId, type){
		switch(type) {
			case "tech":
				return this.science.get(unlockId);
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
			case "space":
				var planet = this.space.getPlanet(unlockId.planet);
				return this.space.getMeta(unlockId.bld, planet.buildings);
			case "stages":
				return this.bld.get(unlockId.bld);
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
				} else if (type == "stages") {
					newUnlock.stages[unlockId.stage].stageUnlocked = true;
				} else {
					newUnlock.unlocked = true;
				}
			}
		}
	},

	upgrade: function(list){
		for (var type in list) {
			if (list[type].length == 0) {
				return;
			}
			for (var i = list[type].length - 1; i >= 0; i--) {
				var item = this.getUnlockByName(list[type][i], type);
				if (item.calculateEffects){
					item.calculateEffects(item, this);
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

            self.kongregate.stats.submit("paragon", self.paragonPoints);
            self.kongregate.stats.submit("karma", self.karmaKittens);

            self.achievements.updateStatistics();
        });
    },

	redeemGift: function(){
		//TODO: give a bonus based on the current researched technologis
		//i.e. 25tc with lte game time tech
		// 5tc with mid game tech
		// unobtainium with pre time tech
		// titanium with pre-space tech
		// something else?
	}
});
