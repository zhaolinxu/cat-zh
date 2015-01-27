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
				title: "Catnip production",		
				resName: "catnip",
				type: "perTick"			
			},
			
			"catnipDemandRatio" : {
				title: "Catnip Demand Ratio",
				resName: "catnip",
				type: "ratio"
			},
			"catnipRatio" : {
				title: "Catnip Ratio",
				resName: "catnip"
			},
			"catnipMax" : {
				title: "Max Catnip",
				resName: "catnip"
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
				title: "Wood Bonus",
				resName: "wood",
				type: "ratio"
			},
			
			"wood" : {
				title: "wood",
				resName: "wood",
				type: "perTick"
			},
			
			"woodPerTick" : {
				title: "Wood production",
				resName: "wood",
				type: "perTick"
			},
			
			//minerals
			
			"mineralsMax" : {
				title: "Max Minerals",
				resName: "minerals"
			},
			
			"mineralsRatio" : {
				title: "Minerals Bonus",
				resName: "minerals",
				type: "ratio"
			},
			
			"mineralsPerTick" : {
				title: "Minerals production",
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
				title: "Iron production",
				resName: "iron",
				type: "perTick"
			},
			
			//gold
			
			"goldPerTick" : {
				title: "Gold production",
				resName: "gold",
				type: "perTick"
			},
			
			//coal
			
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
				title: "Coal Production penalty",
				resName: "coal",
				type: "ratio"
			},
			
			"coalPerTick" : {
				title: "Coal production",
				resName: "coal",
				type: "perTick"
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
			
			//titanium
			
			"titaniumMax" : {
				title: "Max Titanium",
				resName: "titanium"
			},
			
			"titaniumPerTick" : {
				title: "Titanium production",
				resName: "titanium",
				type: "perTick"
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
			
			"manpowerRatio" : {
				title: "Catpower bonus",
				resName: "manpower",
				type: "ratio"
			},
			
			"manpowerPerTick" : {
				title: "catpower",
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
			"learnRatio" : {},
			
			"science" : {
				title: "science",
				resName: "science",
				type: "perTick"
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
				title: "Magneto Boost",
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
				title: "Oil production",
				type: "perTick"
			},
			
			//faith
			
			"faith" : {
				title: "faith",
				resName: "faith",
				type: "perTick"
			},
			
			//uranium
			
			"uraniumPerTick": {
				title: "Uranium production",
				resType: "uranium",
				type: "perTick"
			},
			
			//unobtainium
			
			"unobtainiumPerTick": {
				title: "Unobtainium production",
				resType: "unobtainium",
				type: "perTick"
			},
			
			//unicorns
			
			"unicornsPerTickBase": {
				title: "Unicorn production",
				resType: "unicorns",
				type: "perTick"
			},
			
			//manuscripts
			
			"manuscriptPerTick": {
				title: "Manuscript production",
				resType: "manuscript",
				type: "perTick"
			},
			
			//starchart
			
			"starchartPerTickBase": {
				title: "Starchart production",
				resType: "starchart",
				type: "perTick"
			},
			
			//miscellaneous
			
			"craftRatio": {
				title: "Craft bonus",
				type: "ratio"
			},
			
			"unhappinessRatio": {
				title: "Happiness bonus",
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
	
	//how much ticks are performed per second ( 5 ticks, 200 ms per tick)
	rate: 5,
	
	//xN update rate modifier for debug purpose
	updateRate: 1,
	
	//I wonder why someone may need this
	isPaused: false,
	
	//current selected game tab
	activeTabId: "Bonfire",

	ticksBeforeSave: 400,	//40 seconds ~

	//in ticks
	autosaveFrequency: 400,
	
	//current building selected in the Building tab by a mouse cursor, should affect resource table rendering
	selectedBuilding: null,
	
	//=============================
	//		option settings
	//=============================
	forceShowLimits: false,
	forceHighPrecision: false,
	useWorkers: false,
	colorScheme: "",
	
	timer: null,
	
	//===================
	//	retarded stuff
	//===================
	
	nerfs: 0,
	sorrow: 0,
	
	//===========================================
	//game-related flags that will go to the save
	//===========================================
	
	//on a side note, I hate those flags. Could we use gamePage.opts = []/{}; ?
	karmaKittens: 0,	//counter for karmic reincarnation
	karmaZebras: 0,
	paragonPoints: 0,	//endgame prestige
	deadKittens: 0,
	ironWill: true,		//true if player has no kittens or housing buildings
	
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

	constructor: function(containerId){
		this.id = containerId;
		
		this.tabs = [];
        this.managers = [];
		
		this.opts = {
			usePerSecondValues: true,
			usePercentageResourceValues: false,
			highlightUnavailable: false,
			hideSell: false
		};
		
		this.console = new com.nuclearunicorn.game.log.Console();
		
		this.resPool = new classes.managers.ResourceManager(this);
		this.calendar = new com.nuclearunicorn.game.Calendar(this);
		
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
            { id: "prestige",       class:  "PrestigeManager"   }
        ];
        
        for (i in managers){
            var manager = managers[i];
            this[manager.id] = new window["classes"]["managers"][manager.class](this);
            
            this.managers.push(this[manager.id]);
        }

		//very sloppy design, could we just use an array for tab managers?
		var bonfireTab = new com.nuclearunicorn.game.ui.tab.Bonfire("Bonfire(Old)", this);
		this.addTab(bonfireTab);
		bonfireTab.visible = false;	//deprecated, but you can still use it
		
		this.bonfireTab = bonfireTab;
		
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
		
		this.achievementTab = new com.nuclearunicorn.game.ui.tab.AchTab("Achievements", this);
		this.achievementTab.visible = false;
		this.addTab(this.achievementTab);
		
		//vvvv do not forget to toggle tab visibility below
		
		this.timer = new com.nuclearunicorn.game.ui.Timer();
		

		//Update village resource production. 
		//Since this method is CPU heavy and rarely used, we will call with some frequency, but not on every tick
		this.timer.addEvent(dojo.hitch(this, function(){	
			this.village.updateResourceProduction(); 
		}), 10);	//every 2 seconds
		
		this.timer.addEvent(dojo.hitch(this, function(){ this.updateCraftResources(); }), 5);	//once per 5 ticks
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
	},
	
	getEffectMeta: function(effectName) {
		return this.effectsMgr.statics.effectMeta[effectName];
	},
	
	//TODO: store all managers in a single array and handle them in the common way
	getEffect: function(effectName){
		return this.bld.getEffect(effectName) + 
			this.space.getEffect(effectName);
	},
	
	/**
	 * Display a message in the console. Returns a <span> node of a text container
	 */
	msg: function(message, type){
		var hasCalendarTech = this.science.get("calendar").researched;
		
		if (hasCalendarTech){
			message = "Year " + this.calendar.year + ", " + this.calendar.seasons[this.calendar.season].title + ": " + message;
		}
		
		return this.console.static.msg(message, type);
	},
	
	clearLog: function(){
		this.console.static.clear();
	},
	
	save: function(){
		var saveData = {
			resources: this.resPool.filterMetadata(
				this.resPool.resources, ["name", "value"]
			)
		};
		
		this.village.save(saveData);
		this.calendar.save(saveData);
        
        for (i in this.managers){
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
			
			nerfs: this.nerfs,
			sorrow: this.sorrow,
			
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
		pauseBtn.innerHTML = this.isPaused ? "unpause" : "pause";
	},
	
	updateOptionsUI: function(){
		$("#schemeToggle").val(this.colorScheme);
		$("body").attr("class", "scheme_"+this.colorScheme);
		
		$("#workersToggle")[0].checked 			= this.useWorkers;
		$("#forceHighPrecision")[0].checked		= this.forceHighPrecision;
		$("#usePerSecondValues")[0].checked		= this.opts.usePerSecondValues;
		$("#usePercentageResourceValues")[0].checked 	= this.opts.usePercentageResourceValues;
		$("#highlightUnavailable")[0].checked		= this.opts.highlightUnavailable;
		$("#hideSell")[0].checked			= this.opts.hideSell;
		
	},
	
	load: function(){
		var data = LCstorage["com.nuclearunicorn.kittengame.savedata"];
		if (!data){
			return;
		}
		try {
			var saveData = JSON.parse(data);
			
			//console.log("restored save data:", localStorage);
			if (saveData){
				this.resPool.load(saveData);
				this.village.load(saveData);
				this.calendar.load(saveData);
                
                for (i in this.managers){
                    this.managers[i].load(saveData);
                }
			}
		} catch (ex) {
			console.error("Unable to load game data: ", ex);
			this.msg("Unable to load save data. Close the page and contact the dev.");
		}
		
		//restore tab visibility
		
		this.villageTab.visible = (this.resPool.get("kittens").value > 0 || this.resPool.get("zebras").value > 0);
		this.libraryTab.visible = (this.bld.getBuilding("library").val > 0);
		this.workshopTab.visible = (this.bld.getBuilding("workshop").val > 0);
		this.achievementTab.visible = (this.achievements.hasUnlocked());
		
		//Nice try, probably someday
		/*if (this.science.get("currency").researched){
			this.economyTab.visible = true;
		}*/

		this.diplomacyTab.visible = (this.diplomacy.hasUnlockedRaces());

		this.religionTab.visible = (this.resPool.get("faith").value > 0);
		
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
			
			//-------------------------------------------
			this.sorrow = data.sorrow || 0;
			var nerfs = data.nerfs || 0;

			if (nerfs < this.nerfs && this.calendar.year >= 100){
				this.sorrow++;
				this.msg("Black rain is falling over the village");
			}
			if (this.sorrow){
				$("#sorrowTooltip").html("BLS: " + this.sorrow + "%");
				this.resPool.get("sorrow").value = this.sorrow;
			}
			//-------------------------------------------
			
			
			// ora ora
			if (data.opts){
				for (opt in data.opts){
					this.opts[opt] = data.opts[opt];
				}
			}
			
			this.updateOptionsUI();
		}
	},
	
	//btw, ie11 is horrible crap and should not exist
	saveExport: function(){
		this.save();
		
		var data = LCstorage["com.nuclearunicorn.kittengame.savedata"];
		
		var is_chrome = /*window.chrome*/ true;
		if (is_chrome){
			$("#exportDiv").show();
			$("#exportData").val(btoa(data));
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
		if (data){
			LCstorage["com.nuclearunicorn.kittengame.savedata"] = atob(data);
			this.load();
			this.msg("Save import successful!");
			this.render();
		}
	},
	
	render: function(){

		var midColumn = dojo.byId("midColumn");
		var scrollPosition = midColumn.scrollTop;
		
		var container = dojo.byId(this.id);
		dojo.empty(container);

		var tabNavigationDiv = dojo.create("div", { className: "tabsContainer"}, container);

		
		this.resTable.render();
		this.craftTable.render();

		var visibleTabs = [];
		
		for (var i = 0; i<this.tabs.length; i++){
			var tab = this.tabs[i];
			if (tab.visible){
				visibleTabs.push(tab);
			}
		}
			
		for (var i = 0; i<visibleTabs.length; i++){
			var tab = visibleTabs[i];

			var tabLink = dojo.create("a", {
				href:"#",
				innerHTML: tab.tabName,
				className: "tab",
				style : {
					whiteSpace: "nowrap"
				}
			}, tabNavigationDiv);
			
			if (this.activeTabId == tab.tabId){
				dojo.addClass(tabLink, "activeTab");
			}


			dojo.connect(tabLink, "onclick", this, 
				dojo.partial(
					function(tab){
						this.activeTabId = tab.tabId;
						this.render();
					}, tab)
			);
			
			if (i < visibleTabs.length-1){
				dojo.create("span", {innerHTML:" | "}, tabNavigationDiv);
			}
		}	
		
		
		for (var i = 0; i < this.tabs.length; i++){
			var tab = this.tabs[i];
			
			if (this.activeTabId == tab.tabId){
			
				var divContainer = dojo.create("div", {
					className: "tabInner"
				}, container);
					
				tab.render(divContainer);
				
				break;
			}
		}
		
		midColumn.scrollTop = scrollPosition;
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
	 
	getResourcePerTick: function(resName, calcAutomatedEffect, season){
		
		//STRUCTURES PRODUCTION
		var res = null;
		for (var i = 0; i < this.resPool.resources.length; i++){
			if (this.resPool.resources[i].name == resName){
				res = this.resPool.resources[i];
			}
		}

		var weatherMod = 0;		
		//SEASON MODIFIERS
		if (!season){
			var season = this.calendar.getCurSeason();
		}
		
		weatherMod = this.calendar.getWeatherMod();
		weatherMod = (season.modifiers[res.name] + weatherMod);
		if (weatherMod < -0.95){
			weatherMod = -0.95;
		}

	
		var perTick = this.getEffect(res.name + "PerTickBase");		//per tick accumulator
		
		if (season.modifiers[res.name]){
			perTick = perTick * weatherMod;
		}

		//VILLAGE JOB PRODUCTION
		
		var resMapProduction = this.village.getResProduction();
		var resProduction = resMapProduction[res.name] ? resMapProduction[res.name] : 0;
		
		perTick += resProduction;
		
		//UPGRADE EFFECTS GENERAL
		var workshopResRatio = this.workshop.getEffect(res.name+"Ratio");
		if (workshopResRatio && res.name != "coal"){
			perTick += resProduction * workshopResRatio;
		}
		var workshopResGlobalRatio = this.workshop.getEffect(res.name+"GlobalRatio");
		perTick *= (1 + workshopResGlobalRatio);
		
		//BUILDINGS AND SPACE EFFECTS
		var resRatio = this.getEffect(res.name + "Ratio");
		if (resRatio){
			perTick += perTick * resRatio;
		}
		
		//let's mess a bit with a ice age
		if (resName == "catnip"){
			perTick += perTick * this.calendar.getIceageMod();
		}
		
		//UPGRADE EFFECTS FOR COAL (HACK, TO BE FIXED)
		var workshopResRatio = this.workshop.getEffect(res.name+"Ratio");
		if (workshopResRatio && res.name == "coal"){
			perTick += perTick * workshopResRatio;
		}
		
		//---------- RELIGION EFFECTS -----------
		var relResEffect = this.religion.getEffect(resName+"Ratio");
		if (relResEffect){
			perTick += perTick * relResEffect;
		}

		//---------  PARAGON BONUS ------------
		var paragonRatio = this.resPool.get("paragon").value * 0.01;
		paragonRatio = this.bld.getHyperbolicEffect(paragonRatio, 2);	//well, 200 paragon is probably the END OF THE LINE
		perTick += perTick * paragonRatio;

		//---------  FAITH BONUS --------------
		if (this.religion.getRU("solarRevolution").researched){
			perTick += perTick * (this.religion.getProductionBonus() / 100);
		}
		
		//--------- YEY ANOTHER HACK FOR MAGNETOS ------
		if (!res.transient && this.bld.get("magneto").on > 0){
			
			if (res.name != "oil"){
				var steamworks = this.bld.get("steamworks");
				var swRatio = steamworks.on > 0 ? (1+ steamworks.effects["magnetoBoostRatio"] * steamworks.on) : 1;
				perTick += perTick * this.bld.getEffect("magnetoRatio") * swRatio;
			}
			
		}
		
		//--------- GENERAL PRODUCTION RATIO --------------
		if (!res.transient){
			perTick += perTick * this.bld.getEffect("productionRatio");
		}

		//SPECIAL STEAMWORKS HACK FOR COAL
		var steamworks = this.bld.get("steamworks");
		var swEffectGlobal = steamworks.effects[res.name+"RatioGlobal"];
		if (steamworks.on > 0 && swEffectGlobal ){
			perTick += perTick * swEffectGlobal;
		}
		
		//AUTOMATED STRUCTURES EFFECTS
		if (calcAutomatedEffect){
			var resRatioTick = this.getEffect(res.name + "PerTick");
			if (resRatioTick){
				perTick += resRatioTick;
			}
		}

		//---------  RESOURCE CONSUMPTION -------------
	
		var resMapConsumption = this.village.getResConsumption();
		var resConsumption = resMapConsumption[res.name] || 0;
		
		//var useHypHack = (res.name != "catnip") ? true : false; //Works fine after the rework of diminished returns
		resConsumption = resConsumption + resConsumption * this.bld.getEffect(res.name + "DemandRatio", true);	//use hyp reduction
		
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
		
		var res = null;
		for (var i = 0; i < this.resPool.resources.length; i++){
			if (this.resPool.resources[i].name == resName){
				res = this.resPool.resources[i];
			}
		}

		if (!season){
			var season = this.calendar.getCurSeason();
		}
		
		var stack = [];
		
		stack.push({
			name: "Base",
			type: "fixed",
			value: this.getEffect(res.name + "PerTickBase")
		});
		
		
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
		
		//----------- production -----------
		
		var resMapProduction = this.village.getResProduction();
		var villageStack = [];
		//---->
				villageStack.push({
					name: "Village",
					type: "fixed",
					value: resMapProduction[res.name] || 0
				});
				
				if (res.name != "coal"){
					villageStack.push({
						name: "Upgrades",
						type: "ratio",
						value: this.workshop.getEffect(res.name + "Ratio")
					});
				}
		//<----		
		stack.push(villageStack);
		
		stack.push({
			name: "Upgrades",
			type: "ratio",
			value: this.workshop.getEffect(res.name + "GlobalRatio")
		});

		stack.push({
			name: "Buildings",
			type: "ratio",
			value: this.bld.getEffect(res.name + "Ratio")
		});
		
		//*** SW coal penalty, affected by workshop upgrades
		/*if (res.name == "coal"){
			stack.push({
				name: "Buildings",
				type: "ratio",
				val: this.workshop.getEffect(res.name + "Ratio")
			});
		}*/	//???
		
		stack.push({
			name: "Space",
			type: "ratio",
			value: this.space.getEffect(res.name + "Ratio")
		});
		
		stack.push({
			name: "Religion",
			type: "ratio",
			value: this.religion.getEffect(res.name + "Ratio")
		});
		
		var paragonRatio = this.resPool.get("paragon").value * 0.01;
		paragonRatio = this.bld.getHyperbolicEffect(paragonRatio, 2);	//well, 200 paragon is probably the END OF THE LINE
		stack.push({
			name: "Paragon",
			type: "ratio",
			value: paragonRatio
		});
		
		if (this.religion.getRU("solarRevolution").researched){
			stack.push({
				name: "Faith",
				type: "ratio",
				value: this.religion.getProductionBonus() / 100
			});
		}
		
		//--------- YEY ANOTHER HACK FOR MAGNETOS ------
		if (!res.transient && this.bld.get("magneto").on > 0){
			
			if (res.name != "oil"){
				var steamworks = this.bld.get("steamworks");
				var swRatio = steamworks.on > 0 ? (1+ steamworks.effects["magnetoBoostRatio"] * steamworks.on) : 1;
				stack.push({
					name: "Magnetos",
					type: "ratio",
					value: this.bld.getEffect("magnetoRatio") * swRatio
				});
			}
		}

		if (!res.transient) {		
			stack.push({
				name: "Reactors",
				type: "ratio",
				value: this.bld.getEffect("productionRatio")
			});
		}
		
		stack.push({
			name: "Automated",
			type: "fixed",
			automated: true,
			value: this.getEffect(res.name + "PerTick")
		});

		var steamworks = this.bld.get("steamworks");
		var swEffectGlobal = steamworks.effects[res.name+"RatioGlobal"];
		if (steamworks.on > 0 && swEffectGlobal ){
			stack.push({
				name: "Steamworks",
				type: "ratio",
				value: swEffectGlobal
			});
		}
		
		var resMapConsumption = this.village.getResConsumption();
		var resConsumption = resMapConsumption[res.name] || 0;
		
		//var useHypHack = (res.name != "catnip") ? true : false;		//	Catnip has been fine for a while now
		resConsumption = resConsumption + resConsumption * this.bld.getEffect(res.name + "DemandRatio", true);
		
		stack.push({
			name: "Demand",
			type: "fixed",
			value: resConsumption
		});
		
		return stack;
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
				
			var ratio = this.bld.getEffect("craftRatio");
			
			return ratio + scienceBldAmt * bpRatio;
		}
		
		return this.bld.getEffect("craftRatio");
	},
	
	/**
	 * Update all tab managers, resources and UI controls
	 */ 
	update: function(){
		this.ticksBeforeSave--;
		
		if (this.ticksBeforeSave == 0){
			this.ticksBeforeSave = this.autosaveFrequency;
			this.save();
			
			dojo.style(dojo.byId("autosaveTooltip"), "opacity", "1");
			dojo.animateProperty({
			  node:"autosaveTooltip",
			  properties: {
				  opacity: 0
			  },
			  duration: 1200,
			}).play();
		}

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

		this.updateCalendar();
		this.updateAdvisors();
		
		this.timer.update();
		
		this.resPool.update();

		for (var i = 0; i<this.tabs.length; i++){
			var tab = this.tabs[i];
			
			if (tab.tabId == this.activeTabId){
				tab.update();
			}
		};
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
			res.perTickUI = this.getResourcePerTick(res.name, true);
		}
	},
	
	updateCraftResources: function(){
		//do nothing, outdated
	},
	
	craft: function(resName, value){
		this.workshop.craft(resName, value);
		this.updateCraftResources();
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
		this.updateCraftResources();
		this.updateResources();
	},
	
	updateAdvisors: function(){
		
		if (this.bld.get("field").val == 0){
			return;
		}
		
		var advDiv = dojo.byId("advisorsContainer");
		dojo.empty(advDiv);
		
		var winterDays = 100;
		if (this.calendar.season == "winter"){
			winterDays = 100 - this.calendar.day;
		}

		var catnipPerTick = this.getResourcePerTick("catnip", false, { modifiers:{
			"catnip" : 0.25
		}});	//calculate estimate winter per tick for catnip;
	
		if (this.resPool.get("catnip").value + ( winterDays * catnipPerTick * 10 ) <= 0 ){
			advDiv.innerHTML = "<span>Food advisor: 'Your catnip supply is too low!'<span>"
		}

	},
	
	//TODO: freaking slow, use damn dictionaries
	isResRequired: function(bld, resName){
		if (!bld.prices){
			return false;
		}
		for (var i = 0; i < bld.prices.length; i++){
			if (bld.prices[i].name == resName){
				return true;
			}
		}
		return false;
	},
	
	/**
	 * Attaches onMouseOver/onMouseOut events to a given DOM node in order to display tooltip.
	 * All tooltips will reuse the same container.
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

		resString = this.processResourcePerTickStack(resStack, 0);
		
		if (this.opts.usePercentageResourceValues){
			resString += "<br> Net gain: " + this.getDisplayValueExt(res.perTickUI, true, true);
		}

		if (res.perTickUI < 0) {
			var toZero = res.value / (-res.perTickUI * this.rate);
			resString += "<br>To zero: " + this.toDisplaySeconds(toZero.toFixed());
		} else {
			if (res.maxValue) {
				var toCap = (res.maxValue - res.value) / (res.perTickUI * this.rate);
				if (toCap){
					resString += "<br>To cap: " + this.toDisplaySeconds(toCap.toFixed());
				}
			}
		}
		return resString;
	},

	processResourcePerTickStack: function(resStack, depth){
		var resString = "";
		var hasFixed = false;
		
		for (var i = 0; i < resStack.length; i++){
			var stackElem = resStack[i];
			
			if (stackElem.length){
				var subStack = this.processResourcePerTickStack(stackElem, depth + 1);
				if (subStack.length){
					resString += subStack;
					hasFixed = true;
				}
			}
			
			if (!stackElem.value || (stackElem.type == "ratio" && !hasFixed)){
				continue;
			}

			for (var j = 0; j < depth; j++){
				resString += "*";
			}

			resString += this.getStackElemString(stackElem);
			if (stackElem.type == "fixed") {
				hasFixed = true;
			}
		}

		return resString;
	},

	getStackElemString: function(stackElem){
		var resString = stackElem.name + ":";
			
		if (stackElem.type == "fixed"){
			resString += " " + this.getDisplayValueExt(stackElem.value, true, true);
		} else {
			resString += " " + this.getDisplayValueExt((stackElem.value * 100).toFixed(), true) + "%";
		}
		
		resString += "<br>";
		
		return resString;
	},

	toDisplaySeconds : function (secondsRaw) {
	    var sec_num = parseInt(secondsRaw, 10); // don't forget the second param	    
	    var days    = Math.floor(sec_num / 86400);
	    var hours   = Math.floor((sec_num-(days * 86400)) / 3600);  
	    var minutes = Math.floor((sec_num - (days * 86400 + hours * 3600)) / 60);
	    var seconds = sec_num - (days * 86400) - (hours * 3600) - (minutes * 60);

	    var timeFormated = "";
	    if ( days ) { timeFormated = days + "d "}
	    if ( hours ) {  timeFormated += hours + "h " }
	    if ( minutes) { timeFormated += minutes + "m " }
	    if ( seconds ) { timeFormated += seconds + "s " }

	    return timeFormated;
	},
	
	/**
	 * Converts raw resource value (e.g. 12345.67890) to a formatted representation (i.e. 12.34K)
	 * If 'prefix' flag is true, positive value will be prefixed with '+', e.g. ("+12.34K")
	 */ 
	getDisplayValueExt: function(value, prefix, usePetTickHack){
		
		if(!value) { return 0; }
		
		if (usePetTickHack){
			usePetTickHack = this.opts.usePerSecondValues;
		}
		if (usePetTickHack){
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
		
		for(var i = 0; i < postfixes.length; i++) {
			var p = postfixes[i];
			if(value >= p.limit) {
				return this.getDisplayValueExt(value / p.divisor, prefix) + p.postfix[0];
			}
		}
		
		return this.getDisplayValue(value, prefix) + (usePetTickHack ? "/s" : "");
	},
	
	/**
	 * Formats float value to x.xx or x if value is integer
	 */
	getDisplayValue: function(floatVal, plusPrefix){
		
		var plusSign = "+";
		if (floatVal <= 0 || !plusPrefix){
			plusSign = "";
		}
		
		var fixedAmt = this.forceHighPrecision ? 3 : 2;
		
		if (!floatVal.toFixed){
			return plusSign + floatVal;
		}
		
		if (floatVal.toFixed() == floatVal){
			return plusSign + floatVal.toFixed();
		} else {
			return plusSign + floatVal.toFixed(fixedAmt);
		}
	},
	
	updateCalendar: function(){
		var hasCalendarTech = this.science.get("calendar").researched;
		
		var calendarDiv = dojo.byId("calendarDiv");
		if (hasCalendarTech){
			
			var mod = "";
			if (this.calendar.weather){
				mod = " (" + this.calendar.weather + ") ";
			}

			calendarDiv.innerHTML = "Year " + this.calendar.year + " - " + this.calendar.seasons[this.calendar.season].title + mod + ", day " + this.calendar.day.toFixed();
			document.title = "Kittens Game - Year " + this.calendar.year + ", " + this.calendar.seasons[this.calendar.season].title + ", d. " + this.calendar.day.toFixed();
			
			if (this.ironWill && this.calendar.observeBtn){
				document.title = "[EVENT!]" + document.title;
			}
			
		} else {
			calendarDiv.innerHTML = this.calendar.seasons[this.calendar.season].title
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
		
		if (this.isPaused){
			return;
		}
		
		var timestampStart = new Date().getTime();
		
		this.calendar.tick();
		this.update();
		
		var timestampEnd = new Date().getTime();
		if (window.location.protocol == "file:") {
			
			var tsDiff = timestampEnd - timestampStart;
			this.totalUpdateTime += tsDiff;
			this.ticks++;
			
			var avg = this.totalUpdateTime / this.ticks;
			
			if (tsDiff < 10) {tsDiff = 10;}
			$("#devPanelFPS")[0].innerHTML = "update time: " + tsDiff + " ms, avg: " + avg.toFixed() + " ms";
		}
	},
	
	reset: function(){
		
		var msg = "Are you sure that you want to reset? You will save your achievements and karma points.";
		if (this.resPool.get("kittens").value > 70){
			msg = "Are you sure that you want to reset? You will receive extra karma and paragon points.";
		}else if (this.resPool.get("kittens").value > 60){
			msg = "Are you sure that you want to reset? You will receive extra karma points.";
		}else if (this.resPool.get("kittens").value <= 35){
			msg = "Are you sure that you want to reset? You will receive NO KARMA POINTS. You will save old karma points and achievements.";
		}
		
		if (!confirm(msg)){
			return;
		}

		if (this.resPool.get("kittens").value > 35){
			this.karmaKittens += (this.resPool.get("kittens").value - 35);
		}
		
		if (this.resPool.get("kittens").value > 60){
			this.karmaKittens += (this.resPool.get("kittens").value - 60) * 3;
		}
		
		if (this.resPool.get("kittens").value > 100){
			this.karmaKittens += (this.resPool.get("kittens").value - 100) * 4;
		}
		
		if (this.resPool.get("kittens").value > 150){
			this.karmaKittens += (this.resPool.get("kittens").value - 150) * 5;
		}
		
		if (this.resPool.get("kittens").value > 300){
			this.karmaKittens += (this.resPool.get("kittens").value - 300) * 10;
		}
		
		if (this.resPool.get("kittens").value > 70){
			this.paragonPoints += (this.resPool.get("kittens").value - 70);
		}
		
		this.karmaZebras = parseInt(this.karmaZebras);	//hack
		//that's all folks
		
		//-------------------------- very confusing and convoluted stuff related to karma zebras ---------------
		var totalScience = 0;
		var bonusZebras = 0;
		if (this.science.get("archery").researched && this.karmaZebras < 10){
			bonusZebras = 1;
		}
		for (var i = 0; i < this.science.techs.length; i++){
			var tech = this.science.techs[i];
			if (tech.researched){
				if( tech.cost){
					totalScience += tech.cost;
				}else{
					for (j in tech.prices){
						if (tech.prices[j].name == "science"){
							totalScience += tech.prices[j].val;
						}
					}
				}
			}
		}
		bonusZebras += Math.floor(this.bld.getHyperbolicEffect(totalScience / 10000, 100));
		if (this.resPool.get("zebras").value > 0 ){
			this.karmaZebras += bonusZebras;
		}

		//------------------------------------------------------------------------------------------------------

		var lsData = JSON.parse(LCstorage["com.nuclearunicorn.kittengame.savedata"]);
		if (!lsData){
			lsData = {game: {}};
		}
		dojo.mixin(lsData.game, { 
			karmaKittens: 		this.karmaKittens,
			karmaZebras: 		this.karmaZebras,
			paragonPoints: 		this.paragonPoints,
			nerfs: 				this.nerfs,
			sorrow: 			this.sorrow,
			ironWill : 			true,
			deadKittens: 		0
		});
		
		//------------ we can now carry some of the resources through reset ------------
		var newResources = [];
		var ignoreResources = ["kittens", "zebras", "unicorns", "alicorns", "tears", "furs", "ivory", "spice", "paragon", "karma", "rocket"];
		
		var saveRatio = this.bld.getEffect("resStasisRatio");
		
		var fluxCondensator = this.workshop.get("fluxCondensator");
		for (var i in this.resPool.resources){
			var res = this.resPool.resources[i];
			
			if (res.craftable && res.name != "wood" && !fluxCondensator.researched){
				continue;	//>:
			}
			
			if (dojo.indexOf(ignoreResources, res.name) >= 0) {
				continue;
			} else if (res.name == "timeCrystal"){
				if (this.prestige.getPerk("anachronomancy").researched){
					newResources.push(res);
				}
			} else {
				var newRes = this.resPool.createResource(res.name, res.type);
				newRes.value = res.value * saveRatio;
				newResources.push(newRes);
			}
		}
		
		var saveData = {
			game : lsData.game,
			achievements: lsData.achievements,
			religion: {
				faithRatio: this.religion.faithRatio
			},
			prestige: {
				perks: this.prestige.perks	//never resets
			},
			science: { techs: [] },
			resources: newResources
		};
		
		if (this.prestige.getPerk("anachronomancy").researched){
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
			this.resPool.get("zebras").maxValue = this.karmaZebras;
		}
	},
	
	getTriValue: function(value, stripe){
		return (Math.sqrt(1+8 * value / stripe)-1)/2;
	}
});
