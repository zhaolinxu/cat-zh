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

/**
 * A base class for every tab manager component like science, village, bld, etc */
dojo.declare("com.nuclearunicorn.core.TabManager", com.nuclearunicorn.core.Control, {
		
	
	getMetaEffect: function(name, metadata){
		var totalEffect = 0;
		
		for (var i = 0; i < metadata.length; i++){
			var meta = metadata[i];

			var effect = meta.effects[name];

			var val = meta.val;
			totalEffect += effect * val;
		}
		
		return totalEffect;
	},
	
	getMeta: function(name, metadata){
		for (var i = 0; i < metadata.length; i++){
			var meta = metadata[i];
			
			if (meta.name == name){
				return meta;
			}
		}
		console.error("Could not find metadata for '" + name + "'");
	},
	
	loadMetadata: function(meta, saveMeta, fields, handler){
		for(var i = 0; i< saveMeta.length; i++){
			var savedMetaElem = saveMeta[i];
			
			if (savedMetaElem != null){
				var elem = this.getMeta(savedMetaElem.name, meta);
				for (var j = 0; j < fields.length; j++){
					var fld = fields[i];
					if (!elem.hasOwnProperty(fld) || !savedMetaElem.hasOwnProperty(fld)){
						console.warn("Can't find elem." + fld + " in", elem, savedMetaElem);
					}
					elem[fields[j]] = savedMetaElem[fields[j]];
				}
				if (handler){
					handler(elem);
				}
			}
		}
	}

});


dojo.declare("com.nuclearunicorn.game.log.Console", null, {
	static: {
		msg : function(message){
			var gameLog = dojo.byId("gameLog");
			
			/*if (gameLog.innerHTML.length + message.length > 5000){
				gameLog.innerHTML = "";
			}
			
			gameLog.innerHTML = 
				gameLog.innerHTML + "<br>" + message;*/
				
			dojo.create("br", {}, gameLog);
			dojo.create("span", { innerHTML: message }, gameLog);
			

		},
		
		clear: function(){
			var gameLog = dojo.byId("gameLog");
			//gameLog.innerHTML = "";
			dojo.empty(gameLog);
		}
	}
});

dojo.declare("com.nuclearunicorn.game.ui.Button", null, {
	
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
	
	//--------------------
	//left part of the button
	buttonTitle: null,

	constructor: function(opts, game){
		
		this.id = opts.id;
		this.name = opts.name;
		this.handler = opts.handler;
		this.description = opts.description;
		
		this.game = game;

		this.prices = opts.prices ? opts.prices : [];
		this.priceRatio = opts.priceRatio;
		
		this.init();
	},
	
	//required by BuildingButton
	init: function(){
		
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
		
		return this.game.resPool.hasRes(prices);
	},
	
	updateVisible: function(){

	},
	
	update: function(){
		this.updateEnabled();
		this.updateVisible();
		
		if (this.buttonTitle){
			this.buttonTitle.innerHTML = this.getName();
		}
	},

	getPrices: function(){
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
		this.game.resPool.payPrices(prices);
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
			className: "btnContent",
			title: this.getDescription() 
		}, this.domNode);
		
		this.buttonTitle = dojo.create("span", {
			innerHTML: this.getName(),
			style: {}
		}, this.buttonContent);

		dojo.addClass(this.domNode, "btn");
		dojo.addClass(this.domNode, "nosel");
		
		if (!this.enabled){
			dojo.addClass(this.domNode, "disabled");
		}

		dojo.connect(this.domNode, "onclick", this, "onClick");
		
		this.afterRender();
	},
	
	animate: function(){
		var btnNode = jQuery(this.domNode);
	
		btnNode.animate({
			opacity: 0.5
		}, 70, function(){
			btnNode.animate({
				opacity: 1.0
			}, 70)
		});
	},
	
	onClick: function(){
		this.animate();

		if (this.enabled && this.hasResources()){
			this.handler(this);
			
			this.payPrice();
			
			if (this.priceRatio){
				this.adjustPrice(this.priceRatio);
			}
			
			this.update();
		}
	},

	afterRender: function(){

		var prices = this.getPrices();
		if (prices.length && !this.tooltip){
			
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
				width: "120px"
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
			
			this.tooltip = tooltip;
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


dojo.declare("com.nuclearunicorn.game.ui.ContentRowRenderer", null, {
	twoRows: false,	//by default every tab/panel has one row only
	
	leftRow: null,
	rightRow: null,
	
	initRenderer: function(content){
		this.content = content;
		
		if (this.twoRows){
			var table = dojo.create("table", { 
				cellpadding: "0",
				cellspacing: "0",
				style: { width: "100%"}
			}, content);
			var tr = dojo.create("tr", {}, table);
			this.leftRow  = dojo.create("td", {style:{verticalAlign: "top"}}, tr);
			this.rightRow = dojo.create("td", {style:{verticalAlign: "top"}}, tr);
		}
	},
	
	/**
	 * Get a DOM Node container for an array element with a given index, starting with 0
	 */ 
	getElementContainer: function(id){
		if (!this.twoRows){
			return this.content;
		}
		
		if (id % 2 == 0){
			return this.leftRow;
		} else {
			return this.rightRow;
		}
	}
});


/**
 * Collapsible panel for a tab
 */ 
dojo.declare("com.nuclearunicorn.game.ui.Panel", com.nuclearunicorn.game.ui.ContentRowRenderer, {
	
	collapsed: false,
	
	visible: true,
	
	name: "",
	
	panelDiv: null,
	
	constructor: function(name){
		this.name = name;
	},
	
	render: function(container){
		var panel = dojo.create("div", {
			className: "panelContainer",
			style: {
				display: this.visible ? "" : "none"
			}
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
		this.visible = visible;
		if (this.panelDiv){
			$(this.panelDiv).toggle(visible);
		}
	}
});

/**
 * Tab
*/
dojo.declare("com.nuclearunicorn.game.ui.tab", com.nuclearunicorn.game.ui.ContentRowRenderer, {
	
	game: null,
	
	tabId: null,
	
	tabName: null,
	
	buttons: null,
	
	visible: true,

	//_tabContainer: null,
	
	constructor: function(tabName, game){
		this.tabName = tabName;
		this.tabId = tabName;
		this.buttons = [];
		
		this.game = game;
	},
	
	render: function(tabContainer){
		/*dojo.create("span", { innerHTML: this.tabName }, tabContainer);
		dojo.create("br", {}, tabContainer);
		dojo.create("br", {}, tabContainer);*/
		
		this.initRenderer(tabContainer);
				
		for (var i = 0; i<this.buttons.length; i++){
			var button = this.buttons[i];
			
			var btnContainer = this.getElementContainer(i);
			button.render(btnContainer);
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
