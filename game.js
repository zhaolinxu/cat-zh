/**
 * A class for a game page container
 * 
 */
 
/**
 * Workaround for ie9 local storage :V
 * 
 * This fix is intended for IE in general and especially for IE9, 
 * where localStorage is defined as system variable.
 * 
 */ 

window.LCstorage = window.localStorage;
if (document.all && !window.localStorage)
{
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
				resName: "catpower"
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
				title: "Max Culture",
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
			
			//unicorns
			
			"unicornsPerTickBase": {
				title: "Unicorn production",
				resType: "unicorns",
				type: "perTick"
			},
			
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
 * Generic resource table for res/craft panels in the game.
 * 
 * Instead of re-creating the DOM tree every tick they are capable of rendering 
 * outline table and then updating related cells
 */ 

dojo.declare("com.nuclearunicorn.game.ui.GenericResourceTable", null, {
	
	game: null,
	containerId: null,
	
	resRows: null,
	
	constructor: function(game, containerId){
		this.game = game;
		this.containerId = containerId;
		
		this.resRows = [];

	},
	
	render: function(){
		if (!this.containerId) { throw "Container id is undefined for res table"; }
		dojo.empty(this.containerId);
		
		this.resRows = [];
		
		var resTable = dojo.create("table", { className: "table resTable", style: { width: "100%"} }, this.containerId);
		
		for (var i = 0; i < this.game.resPool.resources.length; i++){
			var res = this.game.resPool.resources[i];
			
			if (!res.visible){
				continue;
			}
			//migrate dual resources (e.g. blueprint) to lower table once craft recipe is unlocked
			if (res.craftable && this.game.workshop.getCraft(res.name).unlocked && res.name != "wood"){
				continue;
			}
			
			var tr = dojo.create("tr", { class: "resourceRow" }, resTable);
			
			
			var isVisible = (res.value > 0 || (res.name == "kittens" && res.maxValue));
			dojo.setStyle(tr, "display", isVisible ? "" : "none");
			//	---------------- name ----------------------
			
			var tdResName = dojo.create("td", { innerHTML: ( res.title || res.name )  + ":", style: { width: "60px"} }, tr);
			
			if (res.type == "uncommon"){
				dojo.setStyle(tdResName, "color", "Coral");
			}
			if (res.type == "rare"){
				dojo.setStyle(tdResName, "color", "orange");
				dojo.setStyle(tdResName, "textShadow", "1px 0px 10px Coral");
			}
			if (res.color){
				dojo.setStyle(tdResName, "color", res.color);
			}

			//	---------------- amt ----------------------
			var tdAmt = dojo.create("td", null, tr);
			tdAmt.innerHTML = this.game.getDisplayValueExt(res.value);
			
			//	---------------- max ----------------------
			var tdMax = dojo.create("td", { className: "maxRes" }, tr);
			tdMax.innerHTML = this.game.getDisplayValueExt(res.maxValueUI);
			
			//	---------------- +tick ----------------------
			var tdPerTick = dojo.create("td", null, tr);
			
			this.game.attachTooltip(tdPerTick, res);
			
			var tdWeatherMod = dojo.create("td", null, tr);
			
			this.resRows.push({
				resRef: res,
				rowRef: tr,
				resAmt : tdAmt,
				resMax : tdMax,
				resTick: tdPerTick,
				resWMod: tdWeatherMod
			});
		}
	},
	
	/**
	 * This section is performance-critical. Using non vanilla js here is a very *BAD* idea.
	 */ 
	update: function(){
		for (var i = 0; i < this.resRows.length; i++){
			var row = this.resRows[i];
			var res = row.resRef;
			
			var isVisible = (res.value > 0 || (res.name == "kittens" && res.maxValue));
			var isHidden = (row.rowRef.style.display === "none");
			if (isHidden && !isVisible){
				continue;
			}else if(isHidden && isVisible){
				row.rowRef.style.display = "";
			}

			//  highlight resources for selected building
			//--------------------------------------------
			var selBld = this.game.selectedBuilding;
			if (selBld && this.game.isResRequired(selBld, res.name)){
				className = "resourceRow highlited";
			} else {
				className = "resourceRow";
			}
			if (row.rowRef.className != className){	//surprisingly, this check makes setClass ~50% faster
				row.rowRef.className = className;
			}
			
			//---------------------------------------------

			row.resAmt.innerHTML  = this.game.getDisplayValueExt(res.value);
			
			if (res.value > res.maxValue * 0.95){
				//rowClass += " resLimitNotice";
				row.resAmt.className = "resLimitNotice";
			} else if (res.value > res.maxValue * 0.75){
				row.resAmt.className = "resLimitWarn";
			} else if (row.resAmt.className){
				row.resAmt.className = "";
			}

			
			var maxResValue = res.maxValue ? "/" + this.game.getDisplayValueExt(res.maxValue) : "";
			row.resMax.innerHTML  = maxResValue;

			var perTick = this.game.opts.usePerSecondValues ? res.perTickUI * this.game.rate : res.perTickUI;
			var postfix = this.game.opts.usePerSecondValues ? "/sec" : "";
			 
			var perTickValue = perTick ? "(" + this.game.getDisplayValue(perTick, true) + postfix + ")" : "";
			row.resTick.innerHTML = perTickValue;

			row.resTick.style.cursor = res.perTickUI ? "pointer" : "default";
			
			//weather mod
			var season = this.game.calendar.getCurSeason();
			if (season.modifiers[res.name] && res.perTickUI != 0 ){
					
				var modifer = (season.modifiers[res.name] + this.game.calendar.getWeatherMod() - 1)*100;
				row.resWMod.innerHTML = modifer ? "[" + modifer.toFixed() + "%]" : "";

				if (modifer > 0){
					dojo.setStyle(row.resWMod, "color", "green");
				}else if (modifer < 0){
					dojo.setStyle(row.resWMod, "color", "red");
				} else {
					if (row.resWMod.style.color != "black"){
						row.resWMod.style.color = "black";
					}
				}
			}
		}
	},
	
	attachTooltip: function(container, htmlProvider){
		var tooltip = dojo.byId("tooltip");
		
		dojo.connect(container, "onmouseover", this, dojo.partial(function(tooltip, htmlProvider, event){
			 tooltip.innerHTML = dojo.hitch(this, htmlProvider)();
			 
			 var target = event.originalTarget || event.toElement;	//fucking chrome
			 var pos = $(target).position();
			 if (!pos){
				 return;
			 }
			 
			 dojo.setStyle(tooltip, "left", pos.left + 60 + "px");
			 dojo.setStyle(tooltip, "top",  pos.top + "px");
			
			 dojo.setStyle(tooltip, "display", ""); 
			 dojo.setStyle(container, "fontWeight", "bold"); 
			 
	    }, tooltip, htmlProvider));
	    
		dojo.connect(container, "onmouseout", this, dojo.partial(function(tooltip, container){
			 dojo.setStyle(tooltip, "display", "none"); 
			 dojo.setStyle(container, "fontWeight", "normal");
		}, tooltip, container));
	}
});

/**
 * Same as resources, but no per tick values
 */ 
dojo.declare("com.nuclearunicorn.game.ui.CraftResourceTable", com.nuclearunicorn.game.ui.GenericResourceTable, {
	
	workshop: null,
	
	constructor: function(game){
		this.workshop = game.bld.get("workshop");
	},
	
	
	//TODO: merge with workshop?
	getResourceCraftRatio: function(res){
		return this.game.getResCraftRatio(res);
	},

	render: function(){
		if (!this.containerId) { throw "container id is undefined for res table"; }
		dojo.empty(this.containerId);
		
		this.resRows = [];
		
		var resTable = dojo.create("table", { className: "table resTable craftTable", style: { width: "100%"} }, this.containerId);

		for (var i = 0; i < this.game.resPool.resources.length; i++){
			var res = this.game.resPool.resources[i];
			
			if (!res.craftable){
				continue;
			}
			
			var craftRatio = this.getResourceCraftRatio(res);
			
			//sort of hack to override regeneration bug
			var recipe = this.game.workshop.getCraft(res.name);
				
			//self-recovery hack to discard removed resources
			//TODO: remove the reference from the res pool
			if (!recipe){
				res.value = 0;
				continue;
			}

			var tr = dojo.create("tr", { class: "resourceRow" }, resTable);
			
			var isVisible = (recipe.unlocked && res.value > 0 && this.workshop.val > 0);
			dojo.setStyle(tr, "display", isVisible ? "" : "none");
			//	---------------- name ----------------------
			
			var tdResName = dojo.create("td", { 
					innerHTML: res.title || res.name + ":",
					style: {
						width: "75px"
					}
				}, tr);
			if (res.color){
				dojo.setStyle(tdResName, "color", res.color);
			}

			//	---------------- amt ----------------------
			var tdAmt = dojo.create("td", null, tr);
			tdAmt.innerHTML = this.game.getDisplayValueExt(res.value);
			
			//	---------------- + ----------------------
			
			
			var td = dojo.create("td", { style: {width: "20px", cursor: "pointer"}}, tr);
				var a1 = dojo.create("a", { 
					href: "#", 
					innerHTML : "+" + (1 * (1+craftRatio)).toFixed(),
					style: {
						display: this.game.resPool.hasRes(recipe.prices, 1) ? "" : "none"
					}
				}, td);
			dojo.connect(a1, "onclick", this, dojo.partial(function(res, event){ this.game.craft(res.name, 1); event.preventDefault(); }, res));
			this.attachTooltip(td, dojo.partial( function(recipe){
				
				var tooltip = dojo.create("div", { className: "button_tooltip" }, null);
				
				for( var i = 0; i < recipe.prices.length; i++){
					var price = recipe.prices[i];
					
					var priceItemNode = dojo.create("div", null, tooltip); 
					
					var nameSpan = dojo.create("span", { innerHTML: price.name, style: { float: "left"} }, priceItemNode );
					var priceSpan = dojo.create("span", { innerHTML: this.game.getDisplayValueExt(price.val), style: {float: "right", paddingLeft: "6px" } }, priceItemNode );
				}
				return tooltip.outerHTML;
			
			}, recipe));	
			
			//	---------------- +25 ----------------------
			var td = dojo.create("td", { style: {width: "20px"}}, tr);
				var a25 = dojo.create("a", {
					href: "#", 
					innerHTML : "+" + (25 * (1+craftRatio)).toFixed(),
					style: {
						display: this.game.resPool.hasRes(recipe.prices, 25) ? "" : "none"
					}
				}, td);
			dojo.connect(a25, "onclick", this, dojo.partial(function(res, event){ this.game.craft(res.name, 25); event.preventDefault(); }, res));

			//	---------------- +100 ----------------------
			var td = dojo.create("td", { style: {width: "20px"}}, tr);
				var a100 = dojo.create("a", {
					href: "#", 
					innerHTML : "+" + (100 * (1+craftRatio)).toFixed(),
					style: {
						display: this.game.resPool.hasRes(recipe.prices, 100) ? "" : "none"
					}
				}, td);
			dojo.connect(a100, "onclick", this, dojo.partial(function(res, event){ this.game.craft(res.name, 100); event.preventDefault(); }, res));

			
			//	---------------- +all ----------------------
			var td = dojo.create("td", { }, tr);
			

			var aAll = dojo.create("a", {
				href: "#", 
				innerHTML : "all",
				style: {
					display: this.hasMinAmt(recipe) ? "" : "none"
				} 
			}, td);

			dojo.connect(aAll, "onclick", this, dojo.partial(function(res, event){ 
				this.game.craftAll(res.name);
				event.preventDefault(); 
			}, res));
			
			this.resRows.push({
				resRef: res,
				recipeRef: recipe,
				rowRef: tr,
				resAmt : tdAmt,
				a1 : a1,
				a25: a25,
				a100: a100,
				aAll: aAll
			});
		}
	},
	
	hasMinAmt: function(recipe){
		var minAmt = Number.MAX_VALUE;
		for (var j = 0; j < recipe.prices.length; j++){
			var totalRes = this.game.resPool.get(recipe.prices[j].name).value;
			var allAmt = Math.floor(totalRes / recipe.prices[j].val);
			if (allAmt < minAmt){
				minAmt = allAmt;
			}
		}
		
		return minAmt > 0 && minAmt < Number.MAX_VALUE;
	},
	
	update: function(){
		for (var i = 0; i < this.resRows.length; i++){
			var row = this.resRows[i];
			var res = row.resRef;
			
			//---------------------------------------------
			var recipe = this.game.workshop.getCraft(res.name);
			var isVisible = (res.value > 0 && recipe.unlocked && this.workshop.val > 0);
			
			var isHidden = (row.rowRef.style.display === "none");
			if (isHidden && !isVisible){
				continue;
			}else if(isHidden && isVisible){
				row.rowRef.style.display = "";
			}
			
			//  highlight resources for selected building
			//--------------------------------------------
			var className;
			
			var selBld = this.game.selectedBuilding;
			if (selBld && this.game.isResRequired(selBld, res.name)){
				className = "resourceRow highlited";
			} else {
				className = "resourceRow";
			}
			if (row.rowRef.className != className){
				row.rowRef.className = className;
			}

			//dojo.setStyle(row.rowRef, "display", isVisible ? "" : "none");
			
			row.resAmt.innerHTML  = this.game.getDisplayValueExt(res.value);
			
			dojo.setStyle(row.a1, "display", this.game.resPool.hasRes(row.recipeRef.prices, 1) ? "" : "none");
			dojo.setStyle(row.a25, "display", this.game.resPool.hasRes(row.recipeRef.prices, 25) ? "" : "none");
			dojo.setStyle(row.a100, "display", this.game.resPool.hasRes(row.recipeRef.prices, 100) ? "" : "none");
			
			dojo.setStyle(row.aAll, "display", this.hasMinAmt(row.recipeRef) ? "" : "none");
		}
	}
});




/**
 * Main game class, can be accessed globably as a 'gamePage' variable
 */ 

dojo.declare("com.nuclearunicorn.game.ui.GamePage", null, {
	
	id: null,
	
	tabs: null,

	//componenst:
	
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
	
	//xN update rate modifer for debug purpose
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
	totalUpdateTime: 0,		//total time spent on update cycle in miliseconds, usefull for debug/fps counter
	
	//resource table 
	resTable: null,		
	
	effectsMgr: null,	

	constructor: function(containerId){
		this.id = containerId;
		
		this.tabs = [];
		
		this.opts = {
			usePerSecondValues: true
		};
		
		this.console = new com.nuclearunicorn.game.log.Console();
		
		this.resPool = new com.nuclearunicorn.game.ResourceManager(this);
		this.calendar = new com.nuclearunicorn.game.Calendar(this);
		
		this.village = new com.nuclearunicorn.game.villageManager(this);
		this.resPool.setVillage(this.village);
		
		this.workshop 		= 	new com.nuclearunicorn.game.upgrades.WorkshopManager(this);
		this.diplomacy 		= 	new com.nuclearunicorn.game.upgrades.DiplomacyManager(this);
		this.bld 			= 	new com.nuclearunicorn.game.buildings.BuildingsManager(this);
		this.science 		= 	new com.nuclearunicorn.game.science.ScienceManager(this);
		this.achievements 	= 	new com.nuclearunicorn.game.Achievements(this);
		this.religion 		= 	new com.nuclearunicorn.game.religion.ReligionManager(this);
		

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
		
		this.economyTab = new com.nuclearunicorn.game.ui.tab.Economy("Economy", this);
		this.economyTab.visible = false;
		this.addTab(this.economyTab);
		
		this.diplomacyTab = new com.nuclearunicorn.game.ui.tab.Diplomacy("Trade", this);
		this.diplomacyTab.visible = false;
		this.addTab(this.diplomacyTab);
		
		this.religionTab = new com.nuclearunicorn.game.ui.tab.ReligionTab("Religion", this);
		this.religionTab.visible = false;
		this.addTab(this.religionTab);
		
		this.achievementTab = new com.nuclearunicorn.game.ui.tab.AchTab("Achievements", this);
		this.achievementTab.visible = false;
		this.addTab(this.achievementTab);
		
		//vvvv do not forget to toggle tab visiblity below
		
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
		
		this.bld.save(saveData);
		this.village.save(saveData);
		this.calendar.save(saveData);
		this.science.save(saveData);
		this.workshop.save(saveData);
		this.diplomacy.save(saveData);
		this.achievements.save(saveData);
		this.religion.save(saveData);

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
		pauseBtn.innerHTML = this.isPaused ? "unpause" : "pause";
	},
	
	updateOptionsUI: function(){
		$("#schemeToggle").val(this.colorScheme);
		$("body").attr("class", "scheme_"+this.colorScheme);
		
		$("#workersToggle")[0].checked = this.useWorkers;
		$("#forceHighPrecision")[0].checked	= this.forceHighPrecision;
		$("#usePerSecondValues")[0].checked	= this.opts.usePerSecondValues;
		
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
				this.bld.load(saveData);
				this.village.load(saveData);
				this.calendar.load(saveData);
				this.science.load(saveData);
				this.workshop.load(saveData);
				this.diplomacy.load(saveData);
				this.achievements.load(saveData);
				this.religion.load(saveData);
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
	},
	
	/**
	 * Returns an estimated productuion amount per tick for a given resource.
	 * 
	 * If calcAutomatedEffect is true, it will also estimate the conditional effects for automated structures,
	 * like smelters or calciners. calcAutomatedEffect should be typically off, or you will give DOUBLE resources for auto structures
	 * 
	 * If season is provided, the method will use given season modifiers for resource estimation. 
	 * Current resource will be used otherwise.
	 */ 
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

	
		var perTick = this.bld.getEffect(res.name + "PerTickBase");		//per tick accumulator
		
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
		
		//BUILDINGS EFFECTS
		var bldResRatio = this.bld.getEffect(res.name + "Ratio");
		if (bldResRatio){
			perTick += perTick * bldResRatio;
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
			
			var sw = this.bld.get("steamworks");
			
			if (res.name != "oil"){
				var steamworks = this.bld.get("steamworks");
				var swRatio = steamworks.on > 0 ? (1+ sw.effects["magnetoBoostRatio"] * this.bld.get("steamworks").on) : 1;
				perTick += perTick * this.bld.getEffect("magnetoRatio") * swRatio;
			}
			
		}
		
		//--------- GENERAL PRODUCTION RATIO --------------
		if (!res.transient){
			perTick += perTick * this.bld.getEffect("productionRatio");
		}
		
		//AUTOMATED STRUCTURES EFFECTS
		if (calcAutomatedEffect){
			var bldResRatioTick = this.bld.getEffect(res.name + "PerTick");
			if (bldResRatioTick){
				perTick += bldResRatioTick;
			}
		}

		//SPECIAL STEAMWORKS HACK FOR COAL
		var steamworks = this.bld.get("steamworks");
		var swEffectGlobal = steamworks.effects[res.name+"RatioGlobal"];
		if (steamworks.on > 0 && swEffectGlobal ){
			perTick += perTick * swEffectGlobal;
		}

		//---------  RESOURCE CONSUMPTION -------------
	
		var resMapConsumption = this.village.getResConsumption();
		var resConsumption = resMapConsumption[res.name] || 0;
		
		//works very wrong on catmip
		var useHypHack = (res.name != "catnip") ? true : false;
		resConsumption = resConsumption + resConsumption * this.bld.getEffect(res.name + "DemandRatio", useHypHack);	//use hyp reduction
		
		perTick += resConsumption;
		
		if (isNaN(perTick)){
			return 0;
		}
		
		return perTick;
	},
	
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
			value: this.bld.getEffect(res.name + "PerTickBase")
		});
		
		
		var weatherMod = this.calendar.getWeatherMod();
		weatherMod = (season.modifiers[res.name] + weatherMod);
		if (weatherMod < -0.95){
			weatherMod = -0.95;
		}
		
		stack.push({
			name: "Weather",
			type: "ratio",
			value: weatherMod
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
			
			var sw = this.bld.get("steamworks");
			
			if (res.name != "oil"){
				var steamworks = this.bld.get("steamworks");
				var swRatio = steamworks.on > 0 ? (1+ sw.effects["magnetoBoostRatio"] * this.bld.get("steamworks").on) : 1;
				stack.push({
					name: "Magnetos",
					type: "ratio",
					value: this.bld.getEffect("magnetoRatio") * swRatio
				});
			}
		}
		
		stack.push({
			name: "Reactors",
			type: "ratio",
			value: this.bld.getEffect("productionRatio") * swRatio
		});
		
		stack.push({
			name: "Automated",
			type: "fixed",
			value: this.bld.getEffect(res.name + "PerTick")
		});
		
		var steamworks = this.bld.get("steamworks");
		var swEffectGlobal = steamworks.effects[res.name+"RatioGlobal"];
		if (steamworks.on > 0 && swEffectGlobal ){
			stack.push({
				name: "Steamworks",
				type: "fixed",
				value: swEffectGlobal
			});
		}
		
		var resMapConsumption = this.village.getResConsumption();
		var resConsumption = resMapConsumption[res.name] || 0;
		
		var useHypHack = (res.name != "catnip") ? true : false;		//	TODO: ************ WTF!?? ***************
		resConsumption = resConsumption + resConsumption * this.bld.getEffect(res.name + "DemandRatio", useHypHack);
		
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
		
		var maxKittens = this.bld.getEffect("maxKittens");
		this.village.maxKittens = maxKittens;
		
		this.village.update();
		this.workshop.update();
		this.diplomacy.update();
		this.religion.update();

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

		for (var i = 0; i < resStack.length; i++){
			var stackElem = resStack[i];
			
			if (stackElem.length){
				//TODO: use recursive iteration
				for (elem in stackElem){
					resString += "&nbsp;*&nbsp;" + this.getStackElemString(stackElem[elem]);
				}
			}
			
			if (!stackElem.value){
				continue;
			}

			resString += this.getStackElemString(stackElem);
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
	    var hours   = Math.floor(sec_num / 3600);
	    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	    var seconds = sec_num - (hours * 3600) - (minutes * 60);

	    var timeFormated = "";
	    if ( hours ) {  timeFormated = hours + "h " }
	    if ( minutes) { timeFormated += minutes + "m " }
	    if ( seconds ) { timeFormated += seconds + "s " }

	    return timeFormated;
	},
	
	/**
	 * Converts raw resource value (e.g. 12345.67890) to a formated representation (i.e. 12.34K)
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
		
		//shamelesly copied from Sandcastle Builder code
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
			$("#devPanel")[0].innerHTML = "update time: " + tsDiff + " ms, avg: " + avg.toFixed() + " ms";
		}
	},
	
	reset: function(){
		
		var msg = "Are you sure you want to reset? You will save your achievements and karma points.";
		if (this.resPool.get("kittens").value > 70){
			msg = "Are you sure you want to reset? You will recieve extra karma and paragon points.";
		}else if (this.resPool.get("kittens").value > 60){
			msg = "Are you sure you want to reset? You will recieve extra karma points.";
		}else if (this.resPool.get("kittens").value <= 35){
			msg = "Are you sure you want to reset? You will recieve NO KARMA POINTS. You will save old karma points and achievements.";
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
		
		this.karmaZebras = this.resPool.get("zebras").value + 1;

		var lsData = JSON.parse(LCstorage["com.nuclearunicorn.kittengame.savedata"]);
		dojo.mixin(lsData.game, { 
			karmaKittens: this.karmaKittens,
			karmaZebras: this.karmaZebras,
			paragonPoints: this.paragonPoints,
			ironWill : true,
			deadKittens: 0
		});
		
		var saveData = {
			game : lsData.game,
			achievements: lsData.achievements,
			religion: {
				faithRatio: this.religion.faithRatio
			}
		}
		LCstorage["com.nuclearunicorn.kittengame.savedata"] = JSON.stringify(saveData);

		// Hack to prevent an autosave from occuring before the reload completes
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
		
		this.resPool.get("karma").value = karma;
		this.resPool.get("paragon").value = this.paragonPoints;
	},
	
	getTriValue: function(value, stripe){
		return (Math.sqrt(1+8 * value / stripe)-1)/2;
	}
});
