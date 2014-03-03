/**
 * A class for a game page container
 * 
 */

dojo.declare("com.nuclearunicorn.game.ui.gamePage", null, {
	
	id: null,
	
	tabs: null,
	
	//resources: null,
	
	resPool: null,
	
	calendar: null,
	
	bld: null,
	
	village: null,
	
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
		
		this.resPool = new com.nuclearunicorn.game.core.resourcePool(this);
		
		this.calendar = new com.nuclearunicorn.game.Calendar();
		
		this.village = new com.nuclearunicorn.game.villageManager(this);
		this.resPool.setVillage(this.village);
		
		this.bld = new com.nuclearunicorn.game.buildings.BuildingsManager(this);

		var bonfireTab = new com.nuclearunicorn.game.ui.tab.Bonfire("Bonfire", this);
		this.addTab(bonfireTab);
		
		var villageTab = new com.nuclearunicorn.game.ui.tab.Village("Town Hall", this);
		this.addTab(villageTab);
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

		this._resourceDiv.innerHTML = "";
		for (var i = 0; i < this.resPool.resources.length; i++){
			var res = this.resPool.resources[i];
			if (res.value){
				
				var perTick = res.perTick;
				if (modifiers[res.name]){
					perTick += modifiers[res.name];
				}
				
				var plusSign = "+";
				if (perTick < 0){
					plusSign = "";
				}
				
				this._resourceDiv.innerHTML += res.name + ":" + res.value.toFixed(2) + " (" + plusSign + perTick.toFixed(2) + ")<br>";
			}
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
