/**
 * A class for a game page container
 * 
 */

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
	
	console: null,
	
	rate: 5,
	
	activeTabName: "Bonfire",
	
	//dom nodes shit
	
	_resourceDiv: null,
	
	ticksBeforeSave: 400,	//40 seconds ~

	//in ticks
	autosaveFrequency: 400,
	
	selectedBuilding: null,

	constructor: function(containerId){
		this.id = containerId;
		
		this.tabs = [];
		
		this.console = new com.nuclearunicorn.game.log.Console();
		
		this.resPool = new com.nuclearunicorn.game.core.resourcePool(this);
		this.calendar = new com.nuclearunicorn.game.Calendar();
		this.village = new com.nuclearunicorn.game.villageManager(this);
		this.workshop = new com.nuclearunicorn.game.upgrades.WorkshopManager(this);
		
		
		this.resPool.setVillage(this.village);
		
		this.bld = new com.nuclearunicorn.game.buildings.BuildingsManager(this);
		
		this.science = new com.nuclearunicorn.game.science.ScienceManager(this);
		

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
		
		//vvvv do not forget to toggle tab visiblity below
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
		
		localStorage["com.nuclearunicorn.kittengame.savedata"] = JSON.stringify(saveData);
		
		console.log("Game saved");
	},
	
	wipe: function(){
		localStorage["com.nuclearunicorn.kittengame.savedata"] = null;
	},
	
	toggleScheme: function(){
		this.colorScheme = (this.colorScheme == "dark") ? "" : "dark";
		$("#gamePageContainer").attr("class", "scheme_"+this.colorScheme);
	},
	
	load: function(){
		var data = localStorage["com.nuclearunicorn.kittengame.savedata"];
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
			
		/*this._resourceDiv = dojo.create("div", {
				style: {
					position: "absolute",
					top: "10px",
					left: "10px"
			}}, container);*/
		this._resourceDiv = dojo.byId("resContainer");
		this.updateResources();
		
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
				innerHTML: tab.tabName
			}, tabNavigationDiv);
			
			if (this.activeTabName == tab.tabName){
				dojo.addClass(tabLink, "activeTab");
			}


			dojo.connect(tabLink, "onclick", this, 
				dojo.partial(
					function(tab){
						self.activeTabName = tab.tabName;
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
			
			if (this.activeTabName == tab.tabName){
			
				var divContainer = dojo.create("div", {
					className: "tabInner",
					style: {
						border : "1px solid gray",
						padding: "25px"
						/*,
						float: "left",
						position: "absolute",
						top: "50px",
						left: "490px"*/
					}
				}, container);
					
				tab.render(divContainer);
				
				break;
			}
		}
	},
	
	getResourcePerTick: function(resName, calcAutomatedEffect){
		
		//STRUCTURES PRODUCTION
		var res = null;
		for (var i = 0; i < this.resPool.resources.length; i++){
			if (this.resPool.resources[i].name == resName){
				res = this.resPool.resources[i];
			}
		}
		
		//SEASON MODIFIERS
		var season = this.calendar.getCurSeason();
		var perTick = res.perTick;		//per tick accumulator :3
		
		if (season.modifiers[res.name]){
			perTick = perTick * season.modifiers[res.name];
		}
		
		//VILLAGE JOB PRODUCTION
		
		var resMapProduction = this.village.getResProduction();
		var resProduction = resMapProduction[res.name] ? resMapProduction[res.name] : 0;
		
		perTick += resProduction;
			

		//UPGRADE EFFECTS
		var workshopResRatio = this.workshop.getEffect(res.name+"Ratio");
		if (workshopResRatio){
			perTick += resProduction * workshopResRatio;
		}

		//BUILDINGS EFFECTS
				
		var bldResRatio = this.bld.getEffect(resName+"Ratio");
		if (bldResRatio){
			perTick += perTick * bldResRatio;
		}
		
		//AUTOMATED STRUCTURES EFFECTS
		if (calcAutomatedEffect){
			var bldResRatioTick = this.bld.getEffect(res.name + "PerTick");
			if (bldResRatioTick){
				perTick += bldResRatioTick;
			}
		}	
		
		//---------  RESOURCE CONSUMPTION -------------
	
		var resMapConsumption = this.village.getResConsumption();
		var resConsumption = resMapConsumption[res.name] ? resMapConsumption[res.name] : 0;
		
		perTick += resConsumption;
		
		return perTick;
	},
	
	update: function(){
		
		this.ticksBeforeSave--;
		//console.log("ticks left:", this.ticksBeforeSave);
		
		if (this.ticksBeforeSave == 0){
			this.ticksBeforeSave = this.autosaveFrequency;
			this.save();
		}
		
		this.resPool.update();
		this.bld.update();
		
		for (var i = 0; i<this.tabs.length; i++){
			var tab = this.tabs[i];
			tab.update();
		};

		//business logic goes there
		//maybe it will be a good idea to move it elsewhere?
		
		//for example, here kitten resources are calculated per effect, this logic could be unified
		
		var maxKittens = this.bld.getEffect("maxKittens");
		this.village.maxKittens = maxKittens;
		
		this.village.update();

		//nah, kittens are not a resource anymore (?)
		var kittens = this.resPool.get("kittens");
		kittens.value = this.village.getKittens();	//just a simple way to display them
		kittens.maxValue = this.village.maxKittens;

		//update resources tab
		this.updateResources();
		this.updateCalendar();
	},
	
	updateResources: function(){
		var season = this.calendar.getCurSeason();

		this._resourceDiv.innerHTML = "";
		var resTable = dojo.create("table", { className: "table" }, this._resourceDiv);
		
		for (var i = 0; i < this.resPool.resources.length; i++){
			var res = this.resPool.resources[i];
			if (res.value || res.maxValue){
				
				var perTick = this.getResourcePerTick(res.name, true);	//calc automation

				var tr = dojo.create("tr", {}, resTable);
				
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
				
				
				var tdResVal = dojo.create("td", { innerHTML: this.getDisplayValue(res.value)}, tr);
				if (res.maxValue){
					tdResVal.innerHTML += "/" + this.getDisplayValue(res.maxValue);
				}
				
				var tdResPerTick = dojo.create("td", {
					innerHTML: "(" + this.getDisplayValue(perTick, true) + ")",
					style: {cursor:"pointer"}
				}, tr);
				
				this.attachTooltip(tdResPerTick, this.getDetailedResMap(res));
	
				var tdSeasonMod = dojo.create("td", {}, tr);

				if (season.modifiers[res.name] && perTick != 0 ){
					//this._resourceDiv.innerHTML += "<span> [" + ((season.modifiers[res.name]-1)*100) + "%]</span>";
					
					var modifer = (season.modifiers[res.name]-1)*100;
					var resModifierSpan = dojo.create("span", {
							innerHTML: " [" + modifer + "%]",
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
		
		var bldResRatioTick = this.bld.getEffect(res.name + "PerTick");
		
		var perTick = res.perTick;
		if (season.modifiers[res.name]){
			perTick = perTick * season.modifiers[res.name];
		}

		resString += "Base: " + this.getDisplayValue(perTick, this);
		var resMod = this.village.getResProduction();
		var resModConsumption = this.village.getResConsumption();
		
		
		var kittensPlus = resMod[res.name] ? resMod[res.name] : 0;
		var kittensMinus = resModConsumption[res.name] ? resModConsumption[res.name] : 0;
		
		
		if (bldResRatio){
			resString += "<br>Structures: " + 
				this.getDisplayValue((bldResRatio)*100, true) + "%" + " "+ this.getDisplayValue((bldResRatioTick), true);
		}
		
		if (season.modifiers[res.name]){
			resString += "<br>Season: " + ((season.modifiers[res.name]-1)*100) + "%";
		}

		if (kittensPlus + kittensMinus != 0){
			resString += "<br>Kittens: " + this.getDisplayValue(kittensPlus + kittensMinus, true);
		}
		

		
		return resString;
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
			calendarDiv.innerHTML = "Year " + this.calendar.year + " - " + this.calendar.seasons[this.calendar.season].title + ", day " + this.calendar.day.toFixed();
		} else {
			calendarDiv.innerHTML = this.calendar.seasons[this.calendar.season].title
		}
		
		//this.calendar
	},
	
	addTab: function(tab){
		//var tab = new com.nuclearunicorn.game.ui.tab(tabName);
		this.tabs.push(tab);
		tab.game = this;
	},
	
	start: function(){
		var timer = setInterval(dojo.hitch(this, this.tick), (1000 / this.rate));
	},
	
	tick: function(){
		//this.resources.kittens++;
		
		this.calendar.tick();
		try {
			this.update();
		} catch (ex){
			console.error("Error on calling update(), you should not see this", ex, ex.stack);
		}
	},
	
	reset: function(){
		if (!confirm("NOOO, KITTENS WILL DIE. ARE YOU SURE?")){
			return;
		}
		this.resPool.reset();
		this.village.reset();
		this.bld.reset();
	}
		
});
