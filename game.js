/**
 * A class for a game page container
 * 
 */
 
//dummy workaround with ie9 local storage :V
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

dojo.declare("com.nuclearunicorn.game.ui.gamePage", null, {
	
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
	
	//first one is just a generic concrate modifier affecting timer frequency
	rate: 5,
	
	//this is a update xN modifer for debug purpose
	updateRate: 1,
	
	//I wonder why someone may need this
	isPaused: false,
	
	activeTabId: "Bonfire",
	
	//dom nodes shit
	
	_resourceDiv: null,
	
	ticksBeforeSave: 400,	//40 seconds ~

	//in ticks
	autosaveFrequency: 400,
	
	selectedBuilding: null,
	
	//flags and shit
	forceShowLimits: false,
	useWorkers: false,
	colorScheme: "",
	
	timer: null,
	
	//game-related flags that will go to the save
	karmaKittens: 0,	//counter for karmic reincarnation
	deadKittens: 0,
	ironWill: true,
	
	gatherClicks: 0,	//yes, I do love to annoy people

	constructor: function(containerId){
		this.id = containerId;
		
		this.tabs = [];
		
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
		

		var bonfireTab = new com.nuclearunicorn.game.ui.tab.Bonfire("Bonfire", this);
		this.addTab(bonfireTab);
		
		this.villageTab = new com.nuclearunicorn.game.ui.tab.Village("Small village", this);
		this.villageTab.visible = false;
		this.addTab(this.villageTab);
		
		this.libraryTab = new com.nuclearunicorn.game.ui.tab.Library("Library", this);
		this.libraryTab.visible = false;
		this.addTab(this.libraryTab);
		
		this.workshopTab = new com.nuclearunicorn.game.ui.tab.Workshop("Workshop", this);
		this.workshopTab.visible = false;
		this.addTab(this.workshopTab);
		
		this.economyTab = new com.nuclearunicorn.game.ui.tab.Economy("Economy", this);
		this.economyTab.visible = false;
		this.addTab(this.economyTab);
		
		this.diplomacyTab = new com.nuclearunicorn.game.ui.tab.Diplomacy("Diplomacy", this);
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
		this.timer.addEvent(dojo.hitch(this, function(){ this.updateCraftResources(); }), 5);	//once per 5 ticks
		this.timer.addEvent(dojo.hitch(this, function(){ this.updateResources(); }), 3);	//once per 3 ticks
		//this.timer.addEvent(dojo.hitch(this, function(){ this.achievements.update(); }), 10);	//once per 10 ticks
	},
	
	msg: function(message){
		var hasCalendarTech = this.science.get("calendar").researched;
		
		if (hasCalendarTech){
			message = "Year " + this.calendar.year + ", " + this.calendar.seasons[this.calendar.season].title + ": " + message;
		}
		
		this.console.static.msg(message);
	},
	
	clearLog: function(){
		this.console.static.clear();
	},
	
	save: function(){
		var saveData = {
			resources: this.resPool.resources
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
			useWorkers: this.useWorkers,
			colorScheme: this.colorScheme,
			karmaKittens: this.karmaKittens,
			ironWill : this.ironWill,
			deadKittens: this.deadKittens
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
		}
		
		//restore tab visibility
		
		if (this.bld.getBuilding("hut").val > 0 ){
			this.villageTab.visible = true;
		}
		if (this.bld.getBuilding("library").val > 0 ){
			this.libraryTab.visible = true;
		}
		if (this.bld.getBuilding("workshop").val > 0 ){
			this.workshopTab.visible = true;
		}
		if (this.achievements.hasUnlocked()){
			this.achievementTab.visible = true;
		}
		
		//Nice try, probably someday
		/*if (this.science.get("currency").researched){
			this.economyTab.visible = true;
		}*/

		if (this.diplomacy.hasUnlockedRaces()){
			this.diplomacyTab.visible = true;
		}
		
		if (this.resPool.get("faith").value > 0 ){
			this.religionTab.visible = true;
		}
		
		if (saveData && saveData.game){
			var data = saveData.game;
			
			//console.log(data);

			this.forceShowLimits = data.forceShowLimits ? data.forceShowLimits : false;
			this.colorScheme = data.colorScheme ? data.colorScheme : null;

			this.karmaKittens = (data.karmaKittens !== undefined) ? data.karmaKittens : 0;
			this.deadKittens = (data.deadKittens !== undefined) ? data.deadKittens : 0;
			this.ironWill = (data.ironWill !== undefined) ? data.ironWill : true;
			this.useWorkers = (data.useWorkers !== undefined) ? data.useWorkers : true;
			
			this.updateOptionsUI();
		}
	},
	
	saveExport: function(){
		this.save();
		
		var data = LCstorage["com.nuclearunicorn.kittengame.savedata"];
		
		var is_chrome = window.chrome;
		if (is_chrome){
			$("#exportDiv").show();
			$("#exportData").val(btoa(data));
			$("#exportData").select();
		} else {
			window.prompt("Copy to clipboard: Ctrl+C, Enter", btoa(data));
		}
	},
	
	saveImport: function(){

		var data = window.prompt("Warning, this will overwrite your save!");
		if (data){
			LCstorage["com.nuclearunicorn.kittengame.savedata"] = atob(data);
		
			this.load();
			
			this.msg("Save import successfull!");
		}
	},
	
	render: function(){
		var self = this;
		
		var container = dojo.byId(this.id);
		dojo.empty(container);

		var tabNavigationDiv = dojo.create("div", { style: {
				position: "relative",
				top: "-30px",
				left: "-20px"
			}}, container);

		this.updateResources();
		this.updateCraftResources();
		
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
						self.activeTabId = tab.tabId;
						self.render();
						//console.log("active tab is:", tabId);
					}, tab)
			);
			
			if (i < visibleTabs.length-1){
				dojo.create("span", {innerHTML:"&nbsp;|&nbsp;"}, tabNavigationDiv);
			}
		}	
		
		
		for (var i = 0; i < this.tabs.length; i++){
			var tab = this.tabs[i];
			
			if (this.activeTabId == tab.tabId){
			
				var divContainer = dojo.create("div", {
					className: "tabInner",
					style: {
						border : "1px solid gray",
						padding: "25px"
					}
				}, container);
					
				tab.render(divContainer);
				
				break;
			}
		}
	},
	
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
			var weatherMod = this.calendar.getWeatherMod();
		}
	
		var perTick = this.bld.getEffect(res.name + "PerTickBase");		//per tick accumulator
		
		if (season.modifiers[res.name]){
			perTick = perTick * (season.modifiers[res.name] + weatherMod);
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
		
		//UPGRADE EFFECTS FOR COAL (HACK, TO BE FIXED)
		var workshopResRatio = this.workshop.getEffect(res.name+"Ratio");
		if (workshopResRatio && res.name == "coal"){
			perTick += perTick * workshopResRatio;
		}
		
		//RELIGION EFFECTS
		var relResEffect = this.religion.getEffect(resName+"Ratio");
		if (relResEffect){
			perTick += perTick * relResEffect;
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
		if (steamworks.enabled && steamworks.val != 0 && swEffectGlobal ){
			perTick += perTick * swEffectGlobal;
		}
		
		//---------  RESOURCE CONSUMPTION -------------
	
		var resMapConsumption = this.village.getResConsumption();
		var resConsumption = resMapConsumption[res.name] ? resMapConsumption[res.name] : 0;
		
		//works very wrong on catmip
		var useHypHack = (res.name != "catnip") ? true : false;
		resConsumption = resConsumption + resConsumption * this.bld.getEffect(res.name + "DemandRatio", useHypHack);	//use hyp reduction
		
		perTick += resConsumption;
		
		return perTick;
	},
	
	update: function(){
		
		this.ticksBeforeSave--;
		//console.log("ticks left:", this.ticksBeforeSave);
		
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
		
		this.resPool.update();
		this.bld.update();

		//business logic goes there
		//maybe it will be a good idea to move it elsewhere?
		
		//for example, here kitten resources are calculated per effect, this logic could be unified
		
		var maxKittens = this.bld.getEffect("maxKittens");
		this.village.maxKittens = maxKittens;
		
		this.village.update();
		this.workshop.update();
		this.diplomacy.update();
		this.achievements.update();
		this.religion.update();

		//nah, kittens are not a resource anymore (?)
		var kittens = this.resPool.get("kittens");
		kittens.value = this.village.getKittens();	//just a simple way to display them
		kittens.maxValue = this.village.maxKittens;

		//update resources tab
		//this.updateResources();
		//this.updateCraftResources();
		this.updateCalendar();
		this.updateAdvisors();
		
		this.timer.update();

		for (var i = 0; i<this.tabs.length; i++){
			var tab = this.tabs[i];
			
			if (tab.tabId == this.activeTabId){
				tab.update();
			}
		};
	},
	
	/**
	 * Updates a resource table on the UI
	 */
	updateResources: function(){
		this._resourceDiv = dojo.byId("resContainer");
		var season = this.calendar.getCurSeason();

		//this._resourceDiv.innerHTML = "";	//oh heck no
		dojo.empty(this._resourceDiv);
		
		var resTable = dojo.create("table", { className: "table", style: { width: "100%"} }, this._resourceDiv);
		
		for (var i = 0; i < this.resPool.resources.length; i++){
			var res = this.resPool.resources[i];
			
			if (!res.visible){
				continue;
			}
			
			if (res.value || (res.name == "kittens" && res.maxValue)){
				
				var perTick = this.getResourcePerTick(res.name, true);	//calc automation

				var tr = dojo.create("tr", { class: "resourceRow" }, resTable);
				if (i % 2 == 0){
					dojo.addClass(tr, "odd");
				}
				
				//  highlight resources for selected building
				//--------------------------------------------
				var selBld = this.selectedBuilding;
				if (selBld && this.isResRequired(selBld, res.name)){
					dojo.addClass(tr, "highlited");
				}
				//---------------------------------------------
				
				var tdResName = dojo.create("td", { 
					innerHTML: res.name + ":"
				}, tr);
				
				//console.log("Res:", res, res.type);
				
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
				
				
				var tdResVal = dojo.create("td", { innerHTML: this.getDisplayValueExt(res.value),
					style :{
						width: "320px"
					}
					
				}, tr);
				if (res.maxValue && (res.value * 1.5 > res.maxValue || this.forceShowLimits)){	//50% before limit
					tdResVal.innerHTML += " / <span class='maxRes'>" + this.getDisplayValueExt(res.maxValue) + "<span>";
				}
				
				var tdResPerTick = dojo.create("td", {
					innerHTML: "(" + this.getDisplayValue(perTick, true) + ")",
					style: {cursor:"pointer"}
				}, tr);
				
				this.attachTooltip(tdResPerTick, this.getDetailedResMap(res));
	
				var tdSeasonMod = dojo.create("td", {}, tr);

				if (season.modifiers[res.name] && perTick != 0 ){
					//this._resourceDiv.innerHTML += "<span> [" + ((season.modifiers[res.name]-1)*100) + "%]</span>";
					
					var modifer = (season.modifiers[res.name] + this.calendar.getWeatherMod() -1)*100;
					var resModifierSpan = dojo.create("span", {
							innerHTML: " [" + modifer.toFixed() + "%]",
							title: "Season modifier"
						}, tdSeasonMod);
					if (modifer > 0){
						dojo.setStyle(resModifierSpan, "color","green");
					}else if (modifer < 0){
						dojo.setStyle(resModifierSpan, "color","red");
					} else {
						dojo.setStyle(resModifierSpan, "color","black");
					}
				}
			}
		}
		
		//checkbox
		if (this.bld.get("barn").val > 0){
			var div = dojo.create("div", { style: { paddingTop: "15px" }  }, this._resourceDiv);
			var limitCheckBox = dojo.create("input", {
				type: "checkbox",
				checked: this.forceShowLimits
			}, div);
			
			dojo.connect(limitCheckBox, "onclick", this, function(event){
				event.stopPropagation();
				this.forceShowLimits = !this.forceShowLimits;
			});
			
			dojo.create("span", { innerHTML: "Show max resources"}, div);
		}
	},
	
	updateCraftResources: function(){
		//TODO: reduce regeneration rate
		var self = this;
		
		if ( this.bld.get("workshop").val == 0 ){
			return;
		}
		
		this._craftDiv = dojo.byId("craftContainer");
		//this._craftDiv.innerHTML = "";
		dojo.empty(this._craftDiv);

		var resTable = dojo.create("table", { className: "table", style: { width: "100%"} }, this._craftDiv);
		
		for (var i = 0; i < this.resPool.resources.length; i++){
			var res = this.resPool.resources[i];
			
			if (res.craftable && res.value > 0 ){
				var tr = dojo.create("tr", {}, resTable);
				
				var tdResName = dojo.create("td", { 
					innerHTML: res.title ? res.title : res.name + ":",
					style: {
						width: "75px"
					}
				}, tr);
				
				dojo.create("td", { innerHTML: res.value.toFixed(2),
					style: {
						width: "50px"
					}}, tr);
				
				//sort of hack to override regeneration bug
				
				//TODO: add 'hasRes' check

				var recipe = this.workshop.getCraft(res.name);
				if (!recipe){
					continue;
				}
				
				var td = dojo.create("td", { style: {width: "20px"}}, tr);
				var a = dojo.create("a", { 
					href: "#", 
					innerHTML : "+",
					style: {
						display: this.resPool.hasRes(recipe.prices, 1) ? "" : "none"
					}
				}, td);
				dojo.connect(a, "onclick", this, dojo.partial(function(res, event){ self.craft(res.name, 1); event.preventDefault(); }, res));
				
				var td = dojo.create("td", { style: {width: "20px"}}, tr);
				var a = dojo.create("a", {
					href: "#", 
					innerHTML : "+25",
					style: {
						display: this.resPool.hasRes(recipe.prices, 25) ? "" : "none"
					}
				}, td);
				dojo.connect(a, "onclick", this, dojo.partial(function(res, event){ self.craft(res.name, 25); event.preventDefault(); }, res));
				
				var td = dojo.create("td", { }, tr);
				var a = dojo.create("a", {
					href: "#", 
					innerHTML : "+100",
					style: {
						display: this.resPool.hasRes(recipe.prices, 100) ? "" : "none"
					} 
				}, td);
				dojo.connect(a, "onclick", this, dojo.partial(function(res, event){ self.craft(res.name, 100); event.preventDefault(); }, res));
				
				var td = dojo.create("td", { }, tr);

				//iterate prices and calculate minimal possible amount of craftable resource
				//this may have a negative impact, but update cycle for this div is deliberately rare
				
				var minAmt = Number.MAX_VALUE;
				for (var j = 0; j < recipe.prices.length; j++){
					var totalRes = this.resPool.get(recipe.prices[j].name).value;
					var allAmt = Math.floor(totalRes / recipe.prices[j].val);
					if (allAmt < minAmt){
						minAmt = allAmt;
					}
				}

				var a = dojo.create("a", {
					href: "#", 
					innerHTML : "all",
					style: {
						display: (minAmt > 0 && minAmt < Number.MAX_VALUE) ? "" : "none"
					} 
				}, td);

				dojo.connect(a, "onclick", this, dojo.partial(function(res, event){ 
					self.craftAll(res.name);
					event.preventDefault(); 
				}, res));
				
			}
		}
	},
	
	craft: function(res, value){
		this.workshop.craft(res, value);
		this.updateCraftResources();
		this.updateResources();
	},
	
	craftAll: function(res){
		this.workshop.craftAll(res);
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
	
	attachTooltip: function(container, content){
		var div = dojo.create("div", { style: {position:"relative"}}, container);
		
		var tooltip = dojo.create("div", { 
			classname: "button_tooltip",
			style: {
				display: 	"none",
				border: 	"1px solid black",
				marginLeft:	"4px",
				
				padding: 	"5px",
				position:   "absolute",

				left: "50px",
				top: "-18px",
				width: "180px",
				
				fontWeight: "normal"
			},
			innerHTML: content}, 
		div);

		dojo.connect(container, "onmouseover", this, function(){
			 dojo.setStyle(tooltip, "display", ""); 
			 dojo.setStyle(container, "fontWeight", "bold"); 
	    });
		dojo.connect(container, "onmouseout", this, function(){
			 dojo.setStyle(tooltip, "display", "none"); 
			 dojo.setStyle(container, "fontWeight", "normal");
		});
		
	},
	
	/**
	 * Returns a flat map of resource production
	 */ 
	getDetailedResMap: function(res){
		var resString = "";
		
		var season = this.calendar.getCurSeason();
		var bldResRatio = this.bld.getEffect(res.name+"Ratio");
		var relResRatio = this.religion.getEffect(res.name+"Ratio");
		
		var bldResRatioTick = this.bld.getEffect(res.name + "PerTick");
		var bldResRatioTickBase = this.bld.getEffect(res.name + "PerTickBase");
		
		var perTick = bldResRatioTickBase;
		if (season.modifiers[res.name]){
			perTick = perTick * season.modifiers[res.name];
		}

		resString += "Base: " + this.getDisplayValue(perTick, this);
		var resMod = this.village.getResProduction();
		var resModConsumption = this.village.getResConsumption();
		
		
		var kittensPlus = resMod[res.name] ? resMod[res.name] : 0;
		var kittensMinus = resModConsumption[res.name] ? resModConsumption[res.name] : 0;
		
		//res reduction
		var useHypHack = (res.name != "catnip") ? true : false;
		var kittensMinus = kittensMinus + kittensMinus * this.bld.getEffect(res.name + "DemandRatio", useHypHack);	//use hyperbolic reduction on negative effects
		
		
		bldResRatio = bldResRatio ? bldResRatio : 0;
		relResRatio = relResRatio ? relResRatio : 0;
		
		//steamwork hack for coal
		var steamworks = this.bld.get("steamworks");
		var swEffectGlobal = steamworks.effects[res.name+"RatioGlobal"];
		if (steamworks.enabled && steamworks.val != 0 && swEffectGlobal){
			bldResRatio += swEffectGlobal;
		}
		
		if (bldResRatio || relResRatio){
			resString += "<br>Structures: " + 
				this.getDisplayValue((bldResRatio+relResRatio)*100, true) + "%" + " "+ this.getDisplayValue((bldResRatioTick), true);
		}
		

		
		if (season.modifiers[res.name]){
			resString += "<br>Season: " + ((season.modifiers[res.name]-1)*100) + "%";
		}

		if (kittensPlus + kittensMinus != 0){
			resString += "<br>Kittens: " + this.getDisplayValue(kittensPlus + kittensMinus, true);
		}

		return resString;
	},
	
	
	getDisplayValueExt: function(value, prefix){
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
		
		for( var i in postfixes) {
			var p = postfixes[i];
			if(value >= p.limit) {
				return this.getDisplayValueExt(value / p.divisor, prefix) + p.postfix[0];
			}
		}
		
		return this.getDisplayValue(value, prefix);
	},
	
	/**
	 * Formats float value to x.xx or x if value is integer
	 */
	getDisplayValue: function(floatVal, plusPrefix){
		var plusSign = "+";
		if (floatVal < 0 || !plusPrefix){
			plusSign = "";
		}
		
		if (floatVal.toFixed() == floatVal){
			return plusSign + floatVal.toFixed();
		} else {
			return plusSign + floatVal.toFixed(2);
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
		
		this.calendar.tick();
		try {
			for (var i = 0; i< this.updateRate; i++){
				this.update();
			}
		} catch (ex){
			console.error("Error on calling update(), you should not see this", ex, ex.stack);
		}
	},
	
	reset: function(){
		
		var msg = "Are you sure you want to reset? You will save your achievemenets and karma points.";
		if (this.resPool.get("kittens").value <= 35){
			msg = "Are you sure you want to reset? You will recieve NO KARMA POINTS. You will save old karma points and achievements.";
		}
		
		if (!confirm(msg)){
			return;
		}

		if (this.resPool.get("kittens").value > 35){
			this.karmaKittens += (this.resPool.get("kittens").value - 35);
		}

		
		var lsData = JSON.parse(LCstorage["com.nuclearunicorn.kittengame.savedata"]);
		dojo.mixin(lsData.game, { 
			karmaKittens: this.karmaKittens,
			ironWill : true 
		});
		
		var saveData = {
			game : lsData.game,
			achievements: lsData.achievements
		}
		LCstorage["com.nuclearunicorn.kittengame.savedata"] = JSON.stringify(saveData);
		this.load();
		
		window.location.reload();
	},
	
	//TO BE USED EXTERNALLY
	rand: function(ratio){
		return (Math.floor(Math.random()*ratio));
	},
	
	//Karma has no menu. You get served what you deserve.
	updateKarma: function(){
		var stripe = 5;	//initial amount of kittens per stripe
		var karma = (Math.sqrt(1+8 * this.karmaKittens / stripe)-1)/2;
		
		this.resPool.get("karma").value = karma;
	}
		
});
