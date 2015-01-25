dojo.declare("com.nuclearunicorn.core.Control", null, {
	//Base control class. Must be a superclass for all game components.
});

/**
 * core.js - a collection of base classes shared among all components of the game.
 * UI controls go there.
 */


/**
 * A base class for every tab manager component like science, village, bld, etc
 * Ideally every manager should be a subclass of a TabManager. See reference implementation in religion.js
 */
dojo.declare("com.nuclearunicorn.core.TabManager", com.nuclearunicorn.core.Control, {

	/**
	 * This may not be obvious, but all objects instantiated there will be STATIC and shared among all the instances of the class.
	 *
	 * Wrong:
	 *
	 * >>  arrayField: []
	 *
	 * Correct:
	 *
	 * >>  arrayField: null,
	 * >>
	 * >>  constructor: function() { this.arrayField = []; }
	 */
	effectsCached: null,
	meta: null,
	panelData: null,

	/**
	 * Constructors are INHERITED automatically and CHAINED in the class hierarchy
	 */
	constructor: function(){
		this.effectsCached = {};
		this.meta = [];
		this.panelData = {};
	},

	/**
	 * Methods however are NOT. Use this.inherited(arguments) to call a base method;
	 */

	 /**
	 * @param meta	- metadata set (e.g. buildings list, upgrades list, etc)
	 * @param provider - any object having getEffect(metaElem, effectName) method
	 */
	registerMeta: function(meta, provider){
		this.meta.push({meta: meta, provider: provider});
	},

	invalidateCachedEffects: function(){
		this.effectsCached = {};
	},

	registerPanel: function(id, panel){
		if (!this.panelData[id]){
			this.panelData[id] = {
				collapsed: panel.collapsed
			};
		}
		panel.collapsed = this.panelData[id].collapsed;
		dojo.connect(panel, "onToggle", this, function(collapsed){
			this.panelData[id].collapsed = collapsed;
		});
	},

	/**
	 * Returns a cached combined value of effect of all managers.
	 * Will calculate and store cached value if called for a first time.
	 */
	getEffectCached: function(name){
		var cached = this.effectsCached[name];
		if (cached != undefined) { return cached; }

		var effect = 0;
		for (var i = 0; i< this.meta.length; i++){
			var effectMeta = this.getMetaEffect(name, this.meta[i]);
			effect += effectMeta;
		}
		this.effectsCached[name] = effect;
		return effect;
	},

	/**
	 * Returns an effect from a generic array of effects like gamePage.bld.buildingsData
	 * Replacement for getEffect() method
	 */
	getMetaEffect: function(name, metadata){
		var totalEffect = 0;

		for (var i = 0; i < metadata.meta.length; i++){
			var meta = metadata.meta[i];
			//
			// This is an ugly hack for managers like workshop or science
			// Ideally just a getter handler should be called there returning correct value
			//

			var effect;
			if (metadata.provider){
				effect = metadata.provider.getEffect(meta, name) || 0;
			} else {
				effect = meta.effects[name] || 0;

			}
			totalEffect += effect;
		}

		return totalEffect || 0;
	},

	getMeta: function(name, metadata){
		for (var i = 0; i < metadata.length; i++){
			var meta = metadata[i];

			if (meta.name == name){
				return meta;
			}
		}
		console.error("Could not find metadata for ", name, "in", meta);
	},

	loadMetadata: function(meta, saveMeta, fields, handler){
		for(var i = 0; i< saveMeta.length; i++){
			var savedMetaElem = saveMeta[i];

			if (savedMetaElem != null){
				var elem = this.getMeta(savedMetaElem.name, meta);

				if (!elem) { continue; }

				for (var j = 0; j < fields.length; j++){
					var fld = fields[j];
					if (!elem.hasOwnProperty(fld) || !savedMetaElem.hasOwnProperty(fld)){
						//console.warn("Can't find elem." + fld + " in", elem, savedMetaElem);
					}
					if (savedMetaElem[fld] !== undefined) {
						elem[fld] = savedMetaElem[fld];
					}
				}
				if (handler){
					handler(elem);
				}
			}
		}
	},

	filterMetadata: function(meta, fields){
		var filtered = [];
		for(var i = 0; i< meta.length; i++){
			var clone = {};

			for (var j = 0; j < fields.length; j++){
				var fld = fields[j];
				/*if (!meta[i].hasOwnProperty(fld)){
					console.warn("Can't find elem." + fld + " in", meta[i]);
				}*/
				clone[fld] = meta[i][fld];
			}
			filtered.push(clone);
		}
		return filtered;
	}

	//TODO: add saveMetadata

});

/**
 * Simple class from a right-sided console in the game UI
 */
dojo.declare("com.nuclearunicorn.game.log.Console", null, {
	static: {

		spans: [],
		/**
		 * Prints message in the console. Returns a DOM node for the last created message
		 */
		msg : function(message, type){
			var gameLog = dojo.byId("gameLog");

			dojo.forEach(dojo.query("*", gameLog), function(entry, i){
				var opacity = dojo.getStyle(entry, "opacity");
				dojo.setStyle(entry, "opacity", opacity-0.033);
			});

			var span = dojo.create("span", { innerHTML: message, className: "msg" }, gameLog, "first");

			if (type){
				dojo.addClass(span, "type_"+type);
			}


			var spans = this.spans;
			spans.push(span);
			if (spans.length > 31){
				dojo.destroy(spans.shift()); //remove the first element from the array and destroy it
			}


			return span;
		},

		clear: function(){
			// Hack to save active astronomical events
			var event;
			var observeBtn = dojo.byId("observeBtn");
			if (observeBtn) {
				event = observeBtn.parentNode;
			}

			this.spans = [];

			var gameLog = dojo.byId("gameLog");
			dojo.empty(gameLog);

			if (event) {
				dojo.setStyle(event, "opacity", 1);
				dojo.setStyle(observeBtn, "opacity", 1);
				this.spans.push(event);
				dojo.place(event, gameLog, "first");
			}
		}
	}
});

/**
 * A base class for game button. Inventing the wheels since 2014
 */

dojo.declare("com.nuclearunicorn.game.ui.Button", com.nuclearunicorn.core.Control, {

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
			if (this.domNode.style.display === "none"){
				this.domNode.style.display = "block";
			}
		} else {
			if (this.domNode.style.display === "block"){
				this.domNode.style.display = "none";
			}
		}
	},

	setEnabled: function(enabled){
		if ( !this.domNode ){
			return;
		}

		if (enabled){
			if (!this.enabled){
				this.domNode.className = this.domNode.className.replace("disabled","");
			}
		} else {
			if (this.enabled){
				this.domNode.className += " disabled";
			}
		}
		this.enabled = enabled;
	},

	updateEnabled: function(){
		var isEnabled = true;
		
		var prices = this.getPrices();
		if (!this.hasResources(prices)){
			isEnabled = false;
		}
		this.setEnabled(isEnabled);
		
		if (!this.buttonTitle || !this.game.opts.highlightUnavailable){
			return;
		}
		
		//---------------------------------------------------
		//		a bit hackish place for price highlight
		//---------------------------------------------------
		var limited = false;
		for (var i = 0; i< prices.length; i++){
			var res = this.game.resPool.get(prices[i].name);
			if (res.maxValue && prices[i].val > res.maxValue){
				limited = true;
			}
		}
		//---- now highlight some stuff in vanilla js way ---
		if (limited){
			if (this.buttonTitle.className != "limited"){
				this.buttonTitle.className = "limited";
			}
		} else if (this.buttonTitle.className != "") {
			this.buttonTitle.className = "";
		}
	},

	updateVisible: function(){
		//do nothing
	},

	hasResources: function(prices){
		var hasRes = true;
		if (!prices){
			prices = this.getPrices();
		}

		return this.game.resPool.hasRes(prices);
	},

	update: function(){
		this.updateEnabled();
		this.updateVisible();

		if (this.buttonTitle && this.buttonTitle.innerHTML != this.getName()){
			this.buttonTitle.innerHTML = this.getName();
		}

		this.updatePrices();
	},

	getPrices: function(){
		return this.prices;
	},

	/**
	 * Deprecated method for price management (increases price property stored in button)
	 */
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

	/**
	 * Deprecated method for price management (same as above, but decreases price on sale)
	 */
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
				this.game.resPool.addResAmt(price.name,price.val*percent);
				//res.value += price.val * percent;
			}
		}
	},

	getDescription: function(){
		return this.description;
	},

	getName: function(){
		return this.name;
	},

	/**
	 * Renders button. Method is usually called once the tab is created.
	 */
	render: function(btnContainer){

		this.container = btnContainer;

		this.domNode = dojo.create("div", {
			style: {
				position: "relative",
				display: this.visible ? "block" : "none"
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

		this.domNode.className = "btn nosel";

		if (!this.enabled){
			this.domNode.className += " disabled";
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

				left: "170px",
				top: "-1px",

				width: "120px"

			}}, this.domNode);

			/**
			 * Create prices tooltip and store it inside of the button DOM node
			 */


			var tooltipPricesNodes = [];

			for( var i = 0; i < prices.length; i++){
				var price = prices[i];

				var priceItemNode = dojo.create("div", {
						style : {
							overflow: "hidden"
						}
					}, tooltip);

				var res = this.game.resPool.get(price.name);

				var nameSpan = dojo.create("span", { innerHTML: res.title || res.name, style: { float: "left"} }, priceItemNode );
				var priceSpan = dojo.create("span", { innerHTML: this.game.getDisplayValueExt(price.val), style: {float: "right" } }, priceItemNode );

				tooltipPricesNodes.push({ "name" : nameSpan, "price": priceSpan});
			}

			dojo.connect(this.domNode, "onmouseover", this, dojo.partial(function(tooltip){ dojo.setStyle(tooltip, "display", ""); }, tooltip));
			dojo.connect(this.domNode, "onmouseout", this,  dojo.partial(function(tooltip){ dojo.setStyle(tooltip, "display", "none"); }, tooltip));

			this.tooltip = tooltip;
			this.tooltipPricesNodes = tooltipPricesNodes;
		}
	},

	/**
	 * Basically paints prices in red colour if have not enough resources
	 * SLOOOOOW LIKE HELL
	 */
	updatePrices: function(){
		var limited = false;
		if (!this.tooltipPricesNodes) { return; }

		var prices = this.getPrices();

		for (var i = 0; i< prices.length; i++){

			var res = this.game.resPool.get(prices[i].name);
			var hasRes = (res.value < prices[i].val);

			var priceSpan = this.tooltipPricesNodes[i]["price"];
			if (hasRes && !priceSpan.className){
				priceSpan.className = "noRes";
			}else if (!hasRes && priceSpan.className){
				priceSpan.className = "";
			}
		}
	},

	//Fast access snippet to create button links like "on", "off", "sell", etc.
	addLink: function(title, handler, addBreak){

		var linkBreak = null;
		var link = dojo.create("a", {
				href: "#",
				innerHTML: title,
				style:{
					paddingLeft: "2px",
					float: "right",
					cursor: "pointer"
				}
			}, null);

		dojo.connect(link, "onclick", this, dojo.partial(function(handler, event){
			event.stopPropagation();
			event.preventDefault();

			dojo.hitch(this, handler)();

			this.update();
		}, handler));

		if (addBreak){
			linkBreak = dojo.create("span", {
				innerHTML: "|",
				className: "linkBreak",
				style: {float: "right", paddingLeft: "2px"}
			}, this.buttonContent);
		}
		dojo.place(link, this.buttonContent);

		return {
			link: link,
			linkBreak: linkBreak
		};
	},

	/*
	 * Add a link control with a collapsible menu of other links
	 */
	addLinkList: function(links){
		var linkList = {};

		var linksDiv = dojo.create("div", {
			style: {
				float: "right"
			}
		}, this.buttonContent);

		var linksTooltip = dojo.create("div", {
			className: "linkContent",
			style: {
				display: "none",
				position: "absolute",
				float: "right",
				marginTop: "35px",
				zIndex: "100"
			},
		}, linksDiv);

		//linksTooltip.innerHTML = "<div>FOO</div><div>BAR</div><div>BAZ</div>";

		if (!links.length){
			return linkList;
		}
		//------------- root href --------------
		var link = dojo.create("a", {
			href: "#",
			style: {
				display: "block",
				float: "right"
			},
			innerHTML: links[0].title
		}, linksDiv);

		linksTooltip.style.left = link.offsetLeft;	//hack hack hack

		dojo.connect(link, "onclick", this, dojo.partial(function(handler, event){
			event.stopPropagation();
			event.preventDefault();

			dojo.hitch(this, handler)();

			this.update();
		}, links[0].handler));

		linkList[links[0].id] = { link : link };

		if (links.length <= 1){
			return linkList;
		}

		//-----------dropdown

		dojo.connect(linksDiv, "onmouseover", this, dojo.partial(function(tooltip){ dojo.setStyle(tooltip, "display", "block"); }, linksTooltip));
		dojo.connect(linksDiv, "onmouseout", this,  dojo.partial(function(tooltip){ dojo.setStyle(tooltip, "display", "none"); }, linksTooltip));

		for (var i = 1; i< links.length; i++){

			var link = dojo.create("a", {
				href: "#",
				innerHTML: links[i].title,
				style:{
					display: "block",
					width: "30px",
					cursor: "pointer"
				}
			}, linksTooltip);

			dojo.connect(link, "onclick", this, dojo.partial(function(handler, event){
				event.stopPropagation();
				event.preventDefault();

				dojo.hitch(this, handler)();

				this.update();
			}, links[i].handler));
			linkList[links[i].id] = { link : link };
		}

		return linkList;
	}
});

/*
 * Restyled button with slightly more sophisticated tooltip mechanism
 */

dojo.declare("com.nuclearunicorn.game.ui.ButtonModern", com.nuclearunicorn.game.ui.Button, {
	afterRender: function(){
		dojo.addClass(this.domNode, "modern");

		this.renderLinks();

		this.attachTooltip(this.domNode, dojo.partial( this.getTooltipHTML, this));

		this.buttonContent.title = "";	//no old title for modern buttons :V
	},

	getDescription: function(){
		return this.description;
	},

	getTooltipHTML: function(btn){
		//throw "ButtonModern::getTooltipHTML must be implemented";

		var tooltip = dojo.create("div", { style: {
			width: "200px",
			minHeight:"50px"
		}}, null);

		var descDiv = dojo.create("div", {
			innerHTML: this.getDescription(),
			style: {
				textAlign: "center",
				width: "100%",
				maxWidth: "280px",
				paddingBottom: "4px",
				fontSize: "15px",
				color: "gray"
		}}, tooltip);

		if (this.prices){
			dojo.setStyle(descDiv, "borderBottom", "1px solid gray");
			this.renderPrices(tooltip, true);	//simple prices
		}

		return tooltip.outerHTML;
	},

	renderPrices: function(tooltip, simpleUI){
		var craftRatio = this.game.bld.getEffect("craftRatio");
		
		var prices = this.getPrices();
		if (!prices.length){
			return;
		}
		for( var i = 0; i < prices.length; i++){
			var price = prices[i];
			var span = this._renderPriceLine(tooltip, price, simpleUI);

			var res = this.game.resPool.get(price.name);
			var hasRes = (res.value >= price.val);
			//unroll prices to the raw resources
			if (!hasRes && res.craftable && !simpleUI){
				
				if (res.name == "wood"){
					continue;
				}
				
				span.name.innerHTML = "+ " + span.name.innerHTML;
				
				var components = this.game.workshop.getCraft(res.name).prices;
				for (var j in components){
					
					var diff = price.val - res.value;
					var comp = {name: components[j].name, val: Math.floor(components[j].val * diff / (1 + craftRatio))};
					
					var compSpan = this._renderPriceLine(tooltip, comp, simpleUI);
					compSpan.name.innerHTML = "&nbsp;&nbsp;&nbsp;" + compSpan.name.innerHTML;
					compSpan.name.style.color = "gray";	//mark unrolled price component as raw
				}
			}
		}
	},
	
	_renderPriceLine: function(tooltip, price, simpleUI){
		var priceItemNode = dojo.create("div", {
				style : {
					overflow: "hidden"
				}
			}, tooltip);

		var res = this.game.resPool.get(price.name);
		var hasRes = (res.value >= price.val);

		var nameSpan = dojo.create("span", { innerHTML: res.title || res.name, style: { float: "left", paddingRight: "10px"} }, priceItemNode );

		var asterisk = price.val > res.maxValue && res.maxValue ? "*" : "";	//mark limit issues with asterisk

		var priceSpan = dojo.create("span", {
			innerHTML: hasRes || simpleUI ?
				this.game.getDisplayValueExt(price.val) :
				this.game.getDisplayValueExt(res.value) + " / " + this.game.getDisplayValueExt(price.val) + asterisk,
			className: hasRes ? "" : "noRes",
			style: {
				float: "right"
			}
		}, priceItemNode );

		if (!hasRes && res.perTickUI > 0 && !simpleUI){
			var eta = (price.val-res.value) / (res.perTickUI * this.game.rate);
			priceSpan.innerHTML += " (" + this.game.toDisplaySeconds(eta)  + ")";
		}
		
		return {name: nameSpan, price: priceSpan};
	},

	renderEffects: function(tooltip, effectsList, hideTitle){

		if (!hideTitle){
			dojo.create("div", {
				innerHTML: "Effects:",
				style: {
					textAlign: "center",
					width: "100%",
					borderBottom: "1px solid gray",
					paddingBottom: "4px",
					marginBottom: "8px"
			}}, tooltip);
		}

		//-----------------------------------------

		for (effectName in effectsList){
			var effectValue = effectsList[effectName];
			if (effectValue != 0) {
				var effectMeta = this.game.getEffectMeta(effectName);

				if (!effectMeta) {
					effectMeta = {};
				}
				var displayEffectName = effectMeta.title || effectName;

				if (effectMeta.resName && this.game.resPool.get(effectMeta.resName).value == 0){
					continue;	//hide resource-related effects if we did not unlocked this effect yet
				}

				var displayEffectValue;

				if (effectMeta.type === "perTick" && this.game.opts.usePerSecondValues){
					displayEffectValue = this.game.getDisplayValueExt(effectValue * this.game.rate) + "/sec";
				} else if ( effectMeta.type === "ratio" ) {
					displayEffectValue = (effectValue * 100).toFixed(1) + "%";
				} else {
					displayEffectValue = this.game.getDisplayValueExt(effectValue);
				}

				var nameSpan = dojo.create("div", { innerHTML: displayEffectName + ": " + displayEffectValue,
					style: {
						float: "left",
						fontSize: "14px",
						color: "gray",
						clear: "both"
				}}, tooltip );
			}
		}

	},

	attachTooltip: function(container, htmlProvider){
		var tooltip = dojo.byId("tooltip");

		dojo.connect(container, "onmouseover", this, dojo.partial(function(tooltip, htmlProvider, event){
			tooltip.innerHTML = dojo.hitch(this, htmlProvider)();

			var pos = $(container).position();

			//prevent tooltip from leaving the window area
			var scrollBottom = $(window).scrollTop() + $(window).height() - 50;	//50px padding-bottom
			var scrollRight = $(window).scrollLeft() + $(window).width() - 25;	//25px padding-bottom

			if (pos.top + $(tooltip).height() >= scrollBottom){
				pos.top = scrollBottom - $(tooltip).height();
			}

			if (pos.left + $(tooltip).width() + 320 >= scrollRight){
				pos.left = scrollRight - $(tooltip).width() - 320;
			}

			dojo.setStyle(tooltip, "left", (pos.left + 320) + "px");
			dojo.setStyle(tooltip, "top",  (pos.top) + "px");

			dojo.setStyle(tooltip, "display", "");

	    }, tooltip, htmlProvider));

		dojo.connect(container, "onmouseout", this, dojo.partial(function(tooltip, container){
			 dojo.setStyle(tooltip, "display", "none");
		}, tooltip, container));
	},

	renderLinks: function(){
		//do nothing, implement me
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

	children: null,
	
	//------ collapse ------
	
	toggle: null,
	contentDiv: null,

	constructor: function(name, tabManager){
		this.name = name;
		if (tabManager){
			tabManager.registerPanel(name, this);
		}

		this.children = [];
	},

	addChild: function(child){
		this.children.push(child);
	},

	render: function(container){
		var panel = dojo.create("div", {
			className: "panelContainer",
			style: {
				display: this.visible ? "" : "none"
			}
		},
		container);

		this.toggle = dojo.create("div", {
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

		this.contentDiv = dojo.create("div", {
			className: "container",
			style: {
				display: this.collapsed ? "none" : ""
			}
		}, panel);

		dojo.connect(this.toggle, "onclick", this, function(){
			this.collapse(!this.collapsed);
		});

		this.panelDiv = panel;

		return this.contentDiv;
	},
	
	collapse: function(isCollapsed){
		this.collapsed = isCollapsed;

		$(this.contentDiv).toggle(!isCollapsed);
		this.toggle.innerHTML = isCollapsed ? "+" : "-";

		this.onToggle(isCollapsed);
	},

	onToggle: function(isCollapsed){
		//subscribe me!
	},

	setVisible: function(visible){
		this.visible = visible;
		if (this.panelDiv){
			$(this.panelDiv).toggle(visible);
		}
	},

	update: function(){
		dojo.forEach(this.children, function(e, i){ e.update(); });
	}
});

/**
 * Tab
*/
dojo.declare("com.nuclearunicorn.game.ui.tab", com.nuclearunicorn.game.ui.ContentRowRenderer, {

	game: 		null,
	buttons: 	null,

	tabId: 		null,
	tabName: 	null,
	visible: 	true,

	constructor: function(tabName, game){
		this.tabName = tabName;
		this.tabId = tabName;
		this.buttons = [];

		this.game = game;
	},

	render: function(tabContainer){
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
