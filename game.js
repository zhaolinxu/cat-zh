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
	console: null,
	
	rate: 5,
	
	activeTabId: 0,
	
	//dom nodes shit
	
	_resourceDiv: null,
	
	ticksBeforeSave: 400,	//40 seconds ~

	//in ticks
	autosaveFrequency: 400,

	constructor: function(containerId){
		this.id = containerId;
		
		this.tabs = [];
		
		this.console = new com.nuclearunicorn.game.log.Console();
		
		this.resPool = new com.nuclearunicorn.game.core.resourcePool(this);
		this.calendar = new com.nuclearunicorn.game.Calendar();
		this.village = new com.nuclearunicorn.game.villageManager(this);
		this.resPool.setVillage(this.village);
		
		this.bld = new com.nuclearunicorn.game.buildings.BuildingsManager(this);
		
		this.science = new com.nuclearunicorn.game.science.ScienceManager(this);
		

		var bonfireTab = new com.nuclearunicorn.game.ui.tab.Bonfire("Bonfire", this);
		this.addTab(bonfireTab);
		
		this.villageTab = new com.nuclearunicorn.game.ui.tab.Village("Small village", this);
		this.villageTab.visible = false;
		this.addTab(this.villageTab);
	},
	
	msg: function(message){
		this.console.static.msg(message);
	},
	
	save: function(){
		var saveData = {
			resources: this.resPool.resources
		};
		localStorage["com.nuclearunicorn.kittengame.savedata"] = JSON.stringify(saveData);
		
		console.log("Game saved");
	},
	
	load: function(){
		var data = localStorage["com.nuclearunicorn.kittengame.savedata"];
		try {
			var saveData = JSON.parse(data);
			
			//console.log("restored save data:", localStorage);
			if (saveData){
				this.resPool.resources = saveData.resources;
			}
		} catch (ex) {
			console.error("Unable to load game data: ", ex);
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
			
		this._resourceDiv = dojo.create("div", { style: {
				position: "relative",
				top:"-25px"
			}}, container);
		this.updateResources();
			
		for (var i = 0; i<this.tabs.length; i++){
			var tab = this.tabs[i];
			
			if (!tab.visible){
				continue;
			}
			
			var tabLink = dojo.create("a", {
				href:"#",
				innerHTML: tab.tabName
			}, tabNavigationDiv);
			
			if (this.activeTabId == i){
				dojo.addClass(tabLink, "activeTab");
			}


			dojo.connect(tabLink, "onclick", this, 
				dojo.partial(
					function(tabId){
						self.activeTabId = tabId;
						self.render();
						//console.log("active tab is:", tabId);
					}, i)
			);
			
			if (i < this.tabs.length-1){
				dojo.create("span", {innerHTML:"&nbsp;|&nbsp;"}, tabNavigationDiv);
			}
		}	
		
		
		for (var i = 0; i<this.tabs.length; i++){
			var tab = this.tabs[i];
			
			if (this.activeTabId == i){
			
				var divContainer = dojo.create("div", { 
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
		
		/*if (kittens.value < maxKittens){
			kittens.value += 1;
		}*/
		
		//update resources tab
		this.updateResources();
		this.updateCalendar();
	},
	
	updateResources: function(){
		//this._resourceDiv.innerHTML = "Kittens:" + this.resPool.get("kittens").value + 
			//"<br>" + "Catnip:" + this.resPool.get("catnip").value;
			
		var modifiers = this.village.getResourceModifers();	
		
		var season = this.calendar.getCurSeason();
		

		this._resourceDiv.innerHTML = "";
		for (var i = 0; i < this.resPool.resources.length; i++){
			var res = this.resPool.resources[i];
			if (res.value || res.maxValue){
				
				var perTick = res.perTick;
				if (modifiers[res.name]){
					perTick += modifiers[res.name];
				}
				
				var plusSign = "+";
				if (perTick < 0){
					plusSign = "";
				}
				
				this._resourceDiv.innerHTML += res.name + ":" + this.getDisplayValue(res.value);
				if (res.maxValue){
					this._resourceDiv.innerHTML += "/" + this.getDisplayValue(res.maxValue);
				}
				
				this._resourceDiv.innerHTML += " (" + plusSign + this.getDisplayValue(perTick) + ")";
				
				if (season.modifiers[res.name]){
					//this._resourceDiv.innerHTML += "<span> [" + ((season.modifiers[res.name]-1)*100) + "%]</span>";
					
					var modifer = (season.modifiers[res.name]-1)*100;
					var resModifierSpan = dojo.create("span", {
							innerHTML: " [" + modifer + "%]",
							title: "Season modifier"
						}, null);
					if (modifer>0){
						dojo.setStyle(resModifierSpan, "color","green");
					}else{
						dojo.setStyle(resModifierSpan, "color","red");
					}

					//console.log(resModifierSpan);
					this._resourceDiv.innerHTML += resModifierSpan.outerHTML;
					
				}
				
				this._resourceDiv.innerHTML += "<br>";
				
			}
		}
	},
	
	/**
	 * Formats float value to x.xx or x if value is integer
	 */
	getDisplayValue: function(floatVal){
		if (floatVal.toFixed() == floatVal){
			return floatVal.toFixed();
		} else {
			return floatVal.toFixed(2);
		}
	},
	
	updateCalendar: function(){
		var calendarDiv = dojo.byId("calendarDiv");
		calendarDiv.innerHTML = this.calendar.seasons[this.calendar.season].title + ", day " + this.calendar.day.toFixed();
		
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
		this.update();
	},
	
	reset: function(){
		if (!confirm("NOOO, KITTENS WILL DIE. ARE YOU SURE?")){
			return;
		}
		this.resPool.reset();
		this.village.reset();
	}
		
});
