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
	
	rate: 1,
	
	activeTabId: 0,
	
	constructor: function(containerId){
		this.id = containerId;
		
		this.tabs = [];
		
		this.resources = {
			kittens: 0,
			catnip: 0
		};
		
		this.resPool = new com.nuclearunicorn.game.core.resourcePool();
		
		var villageTab = new com.nuclearunicorn.game.ui.tab.Village("Kitten village");
		this.addTab(villageTab);
		
		var forrestTab = new com.nuclearunicorn.game.ui.tab.Village("Catnip forrest");
		this.addTab(forrestTab);
		//this.addTab("tab2");
		
	},
	
	
	render: function(){
		var self = this;
		
		var container = dojo.byId(this.id);
		console.log("container:", container);
		dojo.empty(container);
		
		var kittenDiv = dojo.create("div", {}, container);
		kittenDiv.innerHTML = "Kittens:" + this.resources.kittens + 
		"<br>" + "Catnip:" + this.resources.catnip;
		
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
	
	title: "",
	
	handler: null,
	
	domNode: null,
	
	visible: true,
	
	constructor: function(title, handler){
		this.title = title;
		this.handler = handler;
	},
	
	setVisible: function(visible){
		this.visible = visible;
	},
	
	render: function(btnContainer){
		this.domNode = dojo.create("span", { 
			innerHTML: this.title,
			style: {
				border: "1px solid black",
				padding: "5px",
				cursor: "pointer"
			}
		}, btnContainer);
		
		/*if (this.handler){
			dojo.connect(this.domNode, "onclick", this,  function(){
				console.log("foo");
			});
		}*/
		jQuery(this.domNode).click(this.handler);
		//jQuery(this.domNode).click(function(){
		//	console.log("foo");
		//});
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
		dojo.create("span", { innerHTML: this.tabName }, tabContainer);
		dojo.create("br", {}, tabContainer);
		dojo.create("br", {}, tabContainer);
				
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

dojo.declare("com.nuclearunicorn.game.ui.tab.Forrest", com.nuclearunicorn.game.ui.tab, {
	constructor: function(tabName){
		this.inherited(arguments);
		
		
		var self = this;
		
		var btn = new com.nuclearunicorn.game.ui.button("Gather catnip", function(){
			self.game.resources.catnip++;
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

	},
});
