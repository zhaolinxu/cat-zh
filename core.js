dojo.declare("com.nuclearunicorn.game.log", null, {
	static: {
		msg : function(message){
			dojo.byId("gameLog").innerHTML = 
				dojo.byId("gameLog").innerHTML + "<br>" + message;
		}
	}
});

dojo.declare("com.nuclearunicorn.game.core.resourcePool", null, {
	resources: null,
	
	constructor: function(){
		this.resources = [];
		
		this.addResource("catnip");
		//this.addResource("kittens");
	},
	
	get: function(name){
		for (var i = 0; i < this.resources.length; i++){
			var res = this.resources[i];
			if (res.name == name){
				return res;
			}
		}
		
		//if no resource found, register new
		return this.addResource(name);
	},
	
	addResource: function(name){
		
		var res = {
				name: name,
				title: "",
				value: 0,
				perTick: 0,	
		};
		
		this.resources.push(res);
		
		return res;
	},

	/**
	 * Iterates resources and updates their values with per tick increment
	 */
	update: function(){
		for (var i = 0; i< this.resources.length; i++){
			var res = this.resources[i];
			res.value += res.perTick;
		}
	}
});

dojo.declare("com.nuclearunicorn.game.ui.gamePage", null, {
	id: null,
	
	tabs: null,
	
	//resources: null,
	
	resPool: null,
	
	calendar: null,
	
	bld: null,
	
	rate: 5,
	
	activeTabId: 0,
	
	//dom nodes shit
	
	_resourceDiv: null,

	constructor: function(containerId){
		this.id = containerId;
		
		this.tabs = [];
		
		this.calendar = new com.nuclearunicorn.game.calendar();
		
		this.bld = new com.nuclearunicorn.game.buildings.BuildingsManager();
		
		this.resPool = new com.nuclearunicorn.game.core.resourcePool();
		
		var villageTab = new com.nuclearunicorn.game.ui.tab.Village("Bonfire", this);
		this.addTab(villageTab);
		
		var forrestTab = new com.nuclearunicorn.game.ui.tab.Forest("Catnip forrest", this);
		this.addTab(forrestTab);
		//this.addTab("tab2");
		
	},
	
	save: function(){
		var saveData = {
			resources: this.resPool.resources
		};
		localStorage["com.nuclearunicorn.kittengame.savedata"] = JSON.stringify(saveData);
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
		
		this.resPool.update();
		
		for (var i = 0; i<this.tabs.length; i++){
			var tab = this.tabs[i];
			tab.update();
		};
		
		//update resources tab
		this.updateResources();
		this.updateCalendar();
	},
	
	updateResources: function(){
		//this._resourceDiv.innerHTML = "Kittens:" + this.resPool.get("kittens").value + 
			//"<br>" + "Catnip:" + this.resPool.get("catnip").value;
			
		this._resourceDiv.innerHTML = "";
		for (var i = 0; i < this.resPool.resources.length; i++){
			var res = this.resPool.resources[i];
			this._resourceDiv.innerHTML += res.name + ":" + res.value.toFixed(2) + " (+" + res.perTick.toFixed(2) + ")<br>";
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
	}
		
});

dojo.declare("com.nuclearunicorn.game.ui.button", null, {
	
	game: null,
	
	name: "",

	description: "",

	visible: true,
	
	enabled: true,
	
	handler: null,

	prices: null,
	
	priceRatio: null,
	
	//nodes
	
	domNode: null,
	
	container: null,
	
	tab: null,
	
	building: null,

	constructor: function(opts, game){
		
		this.name = opts.name;
		this.handler = opts.handler;
		this.description = opts.description;
		
		
		
		if (opts.building){
			var bld = game.bld.getBuilding(opts.building);
			
			this.building = bld;
			
			this.prices = bld.prices;
			this.priceRatio = bld.priceRatio;
			
		} else {
			
			this.prices = opts.prices ? opts.prices : [];
			this.priceRatio = opts.priceRatio;
			
		}

	},
	
	setVisible: function(visible){
		this.visible = visible;
	},
	
	setEnabled: function(enabled){
		this.enabled = enabled;
		
		if (enabled){
			if (this.domNode && dojo.hasClass(this.domNode, "disabled")){
				dojo.removeClass(this.domNode, "disabled");
			}
		} else {
			dojo.addClass(this.domNode, "disabled");
		}
	},
	
	update: function(){
		
		//console.log(this.game);
		
		var isEnabled = true;
		
		//todo: move somewhere else?
		if (this.prices.length){
			for( var i = 0; i < this.prices.length; i++){
				var price = this.prices[i];
				
				var res = this.game.resPool.get(price.name);
				if (res.value < price.val){
					isEnabled = false;
					break;
				}
			}
		}
		this.setEnabled(isEnabled);
		
	},
	
	adjustPrice:function( ratio ){
		if (this.prices.length){
			for( var i = 0; i < this.prices.length; i++){
				var price = this.prices[i];
				
				price.val = price.val * ratio;
			}
		}
		
		//console.log(this.prices);
		this.game.render();
	},
	
	payPrice: function(){
		if (this.prices.length){
			for( var i = 0; i < this.prices.length; i++){
				var price = this.prices[i];
				
				var res = this.game.resPool.get(price.name);
				res.value -= price.val;
			}
		}
		
		if (this.building){
			this.building.val++;
		}
	},
	
	render: function(btnContainer){
		var self = this;
		
		this.container = btnContainer;
		
		this.domNode = dojo.create("div", { 
			innerHTML: this.name,
			style: {
				
			},
			title: this.description
		}, btnContainer);
		
		dojo.addClass(this.domNode, "btn");
		dojo.addClass(this.domNode, "nosel");
		
		if (!this.enabled){
			dojo.addClass(this.domNode, "disabled");
		}

		jQuery(this.domNode).click(function(){
			if (self.enabled){
				self.handler(self);
				
				self.payPrice();
				
				if (self.priceRatio){
					self.adjustPrice(self.priceRatio);
				}
			}
		});
		
		if (this.prices.length){
			
			var tooltip = dojo.create("div", { style: {
				display: 	"none",
				border: 	"1px solid black",
				marginTop:	"5px",
				padding: 	"5px"
			}}, this.domNode);
			
			for( var i = 0; i < this.prices.length; i++){
				var price = this.prices[i];
				
				var priceItemNode = dojo.create("div", { 
						style : {
							overflow: "hidden"
						}
					}, tooltip); 
				
				dojo.create("span", { innerHTML: price.name, style: { float: "left"} }, priceItemNode );
				dojo.create("span", { innerHTML: price.val.toFixed(2), style: {float: "right" } }, priceItemNode );
			}
			
			jQuery(this.domNode).hover( 
				function(){ jQuery(tooltip).show(); }, 
				function(){ jQuery(tooltip).hide(); } 
			);
		}
	}


});

dojo.declare("com.nuclearunicorn.game.ui.tab", null, {
	
	game: null,
	
	tabName: null,
	
	buttons: null,
	
	//_tabContainer: null,
	
	constructor: function(tabName, game){
		this.tabName = tabName;
		this.buttons = [];
		
		this.game = game;
	},
	
	render: function(tabContainer){
		/*dojo.create("span", { innerHTML: this.tabName }, tabContainer);
		dojo.create("br", {}, tabContainer);
		dojo.create("br", {}, tabContainer);*/
				
		for (var i = 0; i<this.buttons.length; i++){
			var button = this.buttons[i];
			button.render(tabContainer);
		}
	},
	
	update: function(){
		for (var i = 0; i<this.buttons.length; i++){
			var button = this.buttons[i];
			button.update();
		}
	},
	
	addButton:function(button){
		button.game = this.game;
		button.tab = this;
		this.buttons.push(button);
	}
});

dojo.declare("com.nuclearunicorn.game.ui.tab.Forest", com.nuclearunicorn.game.ui.tab, {
	constructor: function(tabName){
		//this.inherited(arguments);
		
		
		var self = this;
		
		var btn = new com.nuclearunicorn.game.ui.button({
			name:	 "Gather catnip", 
			handler: function(){
						self.game.resPool.get("catnip").value++;
					 }
		});
		this.addButton(btn);
		
		/*var btn = new com.nuclearunicorn.game.ui.button("Plant catnip");
		this.addButton(btn);
		
		var btn = new com.nuclearunicorn.game.ui.button("Eat catnip");
		this.addButton(btn);
		
		var btn = new com.nuclearunicorn.game.ui.button("Refine catnip");
		this.addButton(btn);
		
		var btn = new com.nuclearunicorn.game.ui.button("Build huts");
		this.addButton(btn);*/
	},
});

dojo.declare("com.nuclearunicorn.game.ui.tab.Village", com.nuclearunicorn.game.ui.tab, {
	constructor: function(tabName){
		//this.inherited(arguments);

		var self = this;
		
		var btn = new com.nuclearunicorn.game.ui.button({
			name: 		"Catnip field", 
			handler: 	function(){
							//self.game.resPool.get("catnip").value -= 10;
							self.game.resPool.get("catnip").perTick += 0.013;
						},
			priceRatio: 1.15,
			description: "Plant some catnip to grow it in the village",
			prices: [ 
				{ name : "catnip", val: 10 }
			]
		});
		
		this.addButton(btn);
		
		var btn = new com.nuclearunicorn.game.ui.button({
			name: 		"Refine catnip", 
			handler: 	function(){
							//self.game.resPool.get("catnip").value -= 100;
							self.game.resPool.get("wood").value += 1;
						},
			description: "Refine catnip into the catnip wood",
			prices: [ { name : "catnip", val: 100 }]
		});
		
		this.addButton(btn);
		
		var btn = new com.nuclearunicorn.game.ui.button({
			name: 		"Hut", 
			handler: 	function(){
							//self.game.resPool.get("wood").value -= 100;
						},
			description: "Build a hut",
			building: "hut"
			
		}, this.game);
		
		this.addButton(btn);

	},
});
