dojo.declare("com.nuclearunicorn.game.log", null, {
	static: {
		msg : function(message){
			dojo.byId("gameLog").innerHTML = 
				dojo.byId("gameLog").innerHTML + "<br>" + message;
		}
	}
});

/**
 * To be used
 */ 
dojo.declare("com.nuclearunicorn.game.ui.resource", null, {
	name: "",
	title: "",
	value: 0
});

dojo.declare("com.nuclearunicorn.game.core.resourcePool", null, {
	resources: null,
	
	constructor: function(){
		this.resources = [];
	},
	
	getResource: function(name){
		for (var i = 0; i < this.resources.length; i++){
			var res = this.resources[i];
			if (res.name == name){
				return res;
			}
		}
	}
});

dojo.declare("com.nuclearunicorn.game.ui.gamePage", null, {
	id: null,
	
	tabs: null,
	
	resources: null,
	
	resPool: null,
	
	rate: 5,
	
	activeTabId: 0,
	
	//dom nodes shit
	
	_resourceDiv: null,

	constructor: function(containerId){
		this.id = containerId;
		
		this.tabs = [];
		
		this.resources = {
			kittens: 0,
			catnip: 0
		};
		
		this.resPool = new com.nuclearunicorn.game.core.resourcePool();
		
		var villageTab = new com.nuclearunicorn.game.ui.tab.Village("Bonfire");
		this.addTab(villageTab);
		
		var forrestTab = new com.nuclearunicorn.game.ui.tab.Forest("Catnip forrest");
		this.addTab(forrestTab);
		//this.addTab("tab2");
		
	},
	
	save: function(){
		var saveData = {
			resources: this.resources
		};
		localStorage["com.nuclearunicorn.kittengame.savedata"] = JSON.stringify(saveData);
	},
	
	load: function(){
		var data = localStorage["com.nuclearunicorn.kittengame.savedata"];
		try {
			var saveData = JSON.parse(data);
			
			//console.log("restored save data:", localStorage);
			if (saveData){
				this.resources = saveData.resources;
			}
		} catch (ex) {
			console.error("Unable to load game data: ", ex);
		}
	},
	
	render: function(){
		var self = this;
		
		var container = dojo.byId(this.id);
		dojo.empty(container);
		
		this._resourceDiv = dojo.create("div", {}, container);
		this.updateResources();

		var tabNavigationDiv = dojo.create("div", { style: {
				position: "relative",
				top: "-70px",
				left: "-20px"
			}}, container);
			
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
		for (var i = 0; i<this.tabs.length; i++){
			var tab = this.tabs[i];
			tab.update();
		};
		
		//update resources tab
		this.updateResources();
	},
	
	updateResources: function(){
		this._resourceDiv.innerHTML = "Kittens:" + this.resources.kittens + 
			"<br>" + "Catnip:" + this.resources.catnip;
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
		
		this.update();
	}
		
});

dojo.declare("com.nuclearunicorn.game.ui.button", null, {
	
	name: "",

	description: "",

	visible: true,
	
	domNode: null,
	
	handler: null,

	prices: null,
	
	constructor: function(opts){
		
		this.name = opts.name;
		this.handler = opts.handler;
		this.description = opts.description;
		
		this.prices = opts.prices ? opts.prices : [];
	},
	
	setVisible: function(visible){
		this.visible = visible;
	},
	
	render: function(btnContainer){
		this.domNode = dojo.create("div", { 
			innerHTML: this.name,
			style: {
				
			},
			title: this.description
		}, btnContainer);
		
		dojo.addClass(this.domNode, "btn");
		dojo.addClass(this.domNode, "nosel");

		jQuery(this.domNode).click(this.handler);
		
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
				dojo.create("span", { innerHTML: price.val, style: {float: "right" } }, priceItemNode );
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
	
	constructor: function(tabName){
		this.tabName = tabName;
		this.buttons = [];
	},
	
	render: function(tabContainer){
		/*dojo.create("span", { innerHTML: this.tabName }, tabContainer);
		dojo.create("br", {}, tabContainer);
		dojo.create("br", {}, tabContainer);*/
				
		for (var i = 0; i<this.buttons.length; i++){
			var button = this.buttons[i];
			button.render(tabContainer);
			dojo.create("br", {}, tabContainer);
			dojo.create("br", {}, tabContainer);
		}
	},
	
	update: function(){
	},
	
	addButton:function(button){
		this.buttons.push(button);
	}
});

dojo.declare("com.nuclearunicorn.game.ui.tab.Forest", com.nuclearunicorn.game.ui.tab, {
	constructor: function(tabName){
		this.inherited(arguments);
		
		
		var self = this;
		
		var btn = new com.nuclearunicorn.game.ui.button({
			name:	 "Gather catnip", 
			handler: function(){
						self.game.resources.catnip++;
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
		this.inherited(arguments);

		var self = this;
		
		var btn = new com.nuclearunicorn.game.ui.button({
			name: 		"Catnip field", 
			handler: 	function(){
							self.game.resources.catnip++;
						},
			description: "Plant some catnip to grow it in the village",
			prices: [ {name : "catnip", val: 10}]
		});
		
		this.addButton(btn);

	},
});
