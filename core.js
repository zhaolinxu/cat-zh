dojo.declare("com.nuclearunicorn.core.Control", null, {

	handlers: null,
	
	constructor: function(){
		this.handlers = [];
	},

	connect: function(node, event, context, handler){
		var handler = dojo.connect(node, event, context, handler);
		this.handlers.push(handler);
	}
});


dojo.declare("com.nuclearunicorn.game.log.Console", null, {
	static: {
		msg : function(message){
			var gameLog = dojo.byId("gameLog");
			
			if (gameLog.innerHTML.length + message.length > 5000){
				gameLog.innerHTML = "";
			}
			
			gameLog.innerHTML = 
				gameLog.innerHTML + "<br>" + message;

		},
		
		clear: function(){
			var gameLog = dojo.byId("gameLog");
			gameLog.innerHTML = "";
		}
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
	
	buildingName: null,

	constructor: function(opts, game){
		
		this.name = opts.name;
		this.handler = opts.handler;
		this.description = opts.description;
		
		this.game = game;

		if (opts.building){
			this.buildingName = opts.building;
			
			var bld = this.getBuilding();
			this.priceRatio = bld.priceRatio;
			
		} else {
			
			this.prices = opts.prices ? opts.prices : [];
			this.priceRatio = opts.priceRatio;
			
		}
	},
	
	setVisible: function(visible){
		this.visible = visible;
		
		if (!this.domNode){
			return;
		}
		
		// locked structures are invisible
		if (this.visible){
			dojo.setStyle(this.domNode, "display", "");
		} else {
			dojo.setStyle(this.domNode, "display", "none");
		}
	},
	
	setEnabled: function(enabled){
		this.enabled = enabled;
		
		if ( !this.domNode ){
			return;
		}
		
		if (enabled){
			if (dojo.hasClass(this.domNode, "disabled")){
				dojo.removeClass(this.domNode, "disabled");
			}
		} else {
			dojo.addClass(this.domNode, "disabled");
		}
	},
	
	updateEnabled: function(){
		var isEnabled = true;
		if (!this.hasResources()){
			isEnabled = false;
		}
		
		this.setEnabled(isEnabled);
	},
	
	hasResources: function(){
		var hasRes = true;
		
		var prices = this.getPrices();
		
		//todo: move somewhere else?
		if (prices.length){
			for( var i = 0; i < prices.length; i++){
				var price = prices[i];
				
				var res = this.game.resPool.get(price.name);
				if (res.value < price.val){
					hasRes = false;
					break;
				}
			}
		}
		return hasRes;
	},
	
	updateVisible: function(){
		// locked structures are invisible
		var building = this.getBuilding();
		if (this.building){
			if (!this.building.unlocked){
				this.setVisible(false);
			} else {
				this.setVisible(true);
			}
		}
	},
	
	update: function(){
		this.updateEnabled();
		this.updateVisible();
		
		if (this.buttonContent){
			this.buttonContent.innerHTML = this.getName();
		}
	},
	
	getBuilding: function(){
		if (this.buildingName){
			return this.game.bld.getBuilding(this.buildingName);
		}
		return null;
	},
	
	getPrices: function(){
		if (this.buildingName){
			var building = this.getBuilding();
			return building.prices;
		}
		return this.prices;
	},
	
	adjustPrice:function( ratio ){
		var prices = this.getPrices();
		if (prices.length){
			for( var i = 0; i < prices.length; i++){
				var price = prices[i];
				
				price.val = price.val * ratio;
			}
		}
		
		this.game.render();
	},
	
	rejustPrice: function( ratio){
		var prices = this.getPrices();
		if (prices.length){
			for( var i = 0; i < prices.length; i++){
				var price = prices[i];
				
				price.val = price.val / ratio;

			}
		}
		this.game.render();
	},
	
	payPrice: function(){
		var prices = this.getPrices();
		if (prices.length){
			for( var i = 0; i < prices.length; i++){
				var price = prices[i];
				
				var res = this.game.resPool.get(price.name);
				res.value -= price.val;
			}
		}
		
		if (this.buildingName){
			var building = this.getBuilding();
			building.val++;
		}
	},
	
	refund: function(percent){
		var prices = this.getPrices();
		if (prices.length){
			for( var i = 0; i < prices.length; i++){
				var price = prices[i];
				
				var res = this.game.resPool.get(price.name);
				res.value += price.val * percent;
			}
		}
	},
	
	getDescription: function(){
		return this.description;
	},
	
	getName: function(){
		return this.name;
	},
	
	render: function(btnContainer){
		var self = this;
		
		this.container = btnContainer;
		
		this.domNode = dojo.create("div", { 
			style: {
				position: "relative",
				display: this.visible ? "" : "none"
			}
		}, btnContainer);
		
		this.buttonContent = dojo.create("div", {
			innerHTML: this.getName(),
			style: {
				
			},
			title: this.getDescription()
		}, this.domNode);

		dojo.addClass(this.domNode, "btn");
		dojo.addClass(this.domNode, "nosel");
		
		if (!this.enabled){
			dojo.addClass(this.domNode, "disabled");
		}

		dojo.connect(this.domNode, "onclick", this, function(){
			//color:"#bfb"
			
			var btnNode = jQuery(self.domNode);
			//console.log(btnNode);
			
			btnNode.animate({
				opacity: 0.5
			}, 70, function(){
				btnNode.animate({
					opacity: 1.0
				}, 70)
			});
			//btnNode.effect("highlight", {color: "#bfb"}, 400);
			
			if (self.enabled && self.hasResources()){
				self.handler(self);
				
				self.payPrice();
				
				if (self.priceRatio){
					self.adjustPrice(self.priceRatio);
				}
			}
		});
		
		this.afterRender()
	},
	
	afterRender: function(){

		var prices = this.getPrices();
		if (prices.length){
			
			var tooltip = dojo.create("div", { 
			classname: "button_tooltip",
			style: {
				display: 	"none",
				border: 	"1px solid black",
				marginLeft:	"4px",
				
				padding: 	"5px",
				position:   "absolute",
				/*left: "110px",
				top: "35px",*/
				left: "170px",
				top: "-1px",
				width: "120px",
			}}, this.domNode);
			
			for( var i = 0; i < prices.length; i++){
				var price = prices[i];
				
				var priceItemNode = dojo.create("div", { 
						style : {
							overflow: "hidden"
						}
					}, tooltip); 
				
				dojo.create("span", { innerHTML: price.name, style: { float: "left"} }, priceItemNode );
				dojo.create("span", { innerHTML: this.game.getDisplayValueExt(price.val), style: {float: "right" } }, priceItemNode );
			}

			dojo.connect(this.domNode, "onmouseover", this, function(){ dojo.setStyle(tooltip, "display", ""); });
			dojo.connect(this.domNode, "onmouseout", this, function(){ dojo.setStyle(tooltip, "display", "none"); });
		}
		
	}
});


dojo.declare("com.nuclearunicorn.game.ui.Spacer", null, {
	
	title: "",
	
	constructor: function(title){
		this.title = title;
	},
	
	render: function(container){
		dojo.create("div", { innerHTML: this.title, className: "spacer"}, container);
	},
	
	update: function(){
	}
});

/**
 * Collapsible panel for a tab
 */ 
dojo.declare("com.nuclearunicorn.game.ui.Panel", null, {
	collapsed: false,
	
	name: "",
	
	panelDiv: null,
	
	constructor: function(name){
		this.name = name;
	},
	
	render: function(container){
		var panel = dojo.create("div", {
			className: "panelContainer"
		},
		container);
			
		var toggle = dojo.create("div", {
			innerHTML: this.collapsed ? "+" : "-",
			className: "toggle",
			style: {
				float: "right"
			}
		}, panel);	
		
		dojo.create("div", {
			innerHTML: this.name,
			className: "title"
		}, panel);
		
		var contentDiv = dojo.create("div", {
			className: "container",
			style: {
				display: this.collapsed ? "none" : ""
			}
		}, panel);	
		
		dojo.connect(toggle, "onclick", this, function(){
			this.collapsed = !this.collapsed;
			
			$(contentDiv).toggle();
			toggle.innerHTML = this.collapsed ? "+" : "-";
		});
		
		this.panelDiv = panel;
		
		return contentDiv;
	},
	
	setVisible: function(visible){
		$(this.panelDiv).toggle(visible);
	}
});

/**
 * Tab
*/
dojo.declare("com.nuclearunicorn.game.ui.tab", null, {
	
	game: null,
	
	tabName: null,
	
	buttons: null,
	
	visible: true,
	
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
