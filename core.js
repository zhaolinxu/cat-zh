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
	effectsCachedExisting: null,
	meta: null,
	panelData: null,

	/**
	 * Constructors are INHERITED automatically and CHAINED in the class hierarchy
	 */
	constructor: function(){
		this.effectsCachedExisting= {};
		this.meta = [];
		this.panelData = {};
	},

	/**
	 * Methods however are NOT. Use this.inherited(arguments) to call a base method;
	 */

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
	 * @param meta	- metadata set (e.g. buildings list, upgrades list, etc)
	 * @param provider - any object having getEffect(metaElem, effectName) method
	 */
	registerMeta: function(type, meta, provider){
		if (!type) {
			this.meta.push({meta: meta, provider: provider});
		} else if (type == "research") {
			this.meta.push({
				meta: meta,
				provider: { getEffect : function(item, effect){
					return (item.researched && item.effects) ? item.effects[effect] : 0;
				}}
			});
		} else if (type == "stackable") {
			this.meta.push({
				meta: meta,
				provider: { getEffect : function(item, effect){
					return (item.effects) ? item.effects[effect] * item.on : 0;
				}}
			});
		}
	},

	setEffectsCachedExisting: function() {
		// Set effectsCachedExisting based on meta
		for (var a = 0; a < this.meta.length; a++){
			for (var i = 0; i< this.meta[a].meta.length; i++){
				for (var effect in this.meta[a].meta[i].effects) {
					this.effectsCachedExisting[effect] = 0;
				}
			}
		}
		// Set effectsCachedExisting based on effectsBase
		if (typeof(this.effectsBase) == "object") {
			for (var effect in this.effectsBase) {
				this.effectsCachedExisting[effect] = 0;
			}
		}
	},

	updateEffectCached: function() {
		var effectsBase = this.effectsBase;
		if (effectsBase){
			effectsBase = this.game.resPool.addBarnWarehouseRatio(effectsBase);
		}

		for (var name in this.effectsCachedExisting) {
			// Add effect from meta
			var effect = 0;
			for (var i = 0; i < this.meta.length; i++){
				var effectMeta = this.getMetaEffect(name, this.meta[i]);
				effect += effectMeta;
			}

			// Add effect from effectsBase
			if (effectsBase && effectsBase[name]) {
				effect += effectsBase[name];
			}

			// Add effect in globalEffectsCached, in addition of other managers
			this.game.globalEffectsCached[name] = typeof(this.game.globalEffectsCached[name]) == "number" ? this.game.globalEffectsCached[name] + effect : effect;
		}
	},

	/**
	 * Returns a cached combined value of effect of all managers, for effect existing in the manager
	 * Will calculate effect value of the manager if the value of effect of all managers is not yet implemented (launch of the game)
	 */
	 /*
	getEffect: function(name){
		// Search only if effect exists in the manager
		if (typeof(this.effectsCachedExisting[name]) == "undefined"){
			return 0;
		}
		// Search only if effect is not yet in the globalEffectsCached
		var cached = this.game.globalEffectsCached[name];
		if (cached != undefined) {
			return cached;
		}

		// Search
		var effect = 0;
		for (var i = 0; i< this.meta.length; i++){
			var effectMeta = this.getMetaEffect(name, this.meta[i]);
			effect += effectMeta;
		}
		return effect;
	},
*/
	/**
	 * Returns an effect from a generic array of effects like gamePage.bld.buildingsData
	 * Replacement for getEffect() method
	 */
	getMetaEffect: function(name, metadata){
		var totalEffect = 0;
		if (!metadata.meta){
			return 0;
		}
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

	loadMetadata: function(meta, saveMeta){
		if (!saveMeta){
			console.trace(saveMeta);
			throw "Unable to load save metadata, meta is empty";
		}

		for(var i = 0; i< saveMeta.length; i++){
			var savedMetaElem = saveMeta[i];

			if (savedMetaElem != null){
				var elem = this.getMeta(savedMetaElem.name, meta);

				if (!elem) { continue; }

				for (var fld in savedMetaElem){
					if (fld == name) {
						continue;
					}
					if (!elem.hasOwnProperty(fld)){
						console.warn("Can't find elem." + fld + " in", elem);
					}
					if (savedMetaElem[fld] !== undefined) {
						if (savedMetaElem[fld] != null && typeof(savedMetaElem[fld]) == "object") {
							this.loadMetadata(elem[fld], savedMetaElem[fld]);
						} else {
							elem[fld] = savedMetaElem[fld];
						}
					}
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
	},

	//TODO: add saveMetadata

	/**
	 * TODO: this logic is very confusing. Ideally the only place devs need to change should be building metadata.
	 */
	resetStateStackable: function(bld, isAutomationEnabled, lackResConvert, effects) {
		bld.val = 0;
		bld.on = 0;
		if (bld.noStackable == "undefined") {
			bld.noStackable = false;
		}
		if (bld.name == "reactor" ||
			bld.name == "calciner") {
			bld.isAutomationEnabled = null;
		}

		// Automatic settings of togglable

		if (lackResConvert != undefined) {
			// Exceptions (when convertion is caused by an upgrade)
			bld.togglable = (bld.name == "biolab") ? false : true;
		}

		for (var effect in effects) {
			if (effect == "energyConsumption" || effect == "magnetoRatio" || effect == "productionRatio") {
				// Exceptions (when energyConsumption is caused by an upgrade)
				bld.togglable = (bld.name == "oilWell" || bld.name == "biolab" || bld.name == "chronosphere") ? false : true;
			}
		}
	},

	resetStateResearch: function() {
		//TODO
	}

});

/**
 * Simple class from a right-sided console in the game UI
 *
 * TODO: all ui logic should be completely detached. Ideally game.msg should just post ("/msg") topic.
 */
dojo.declare("com.nuclearunicorn.game.log.Console", null, {
	static: {

		spans: [],

		filters: {
			"astronomicalEvent": {
				title: "Astronomical Events",
				enabled: true,
				unlocked: false
			},
			"hunt": {
				title: "Hunts",
				enabled: true,
				unlocked: false
			},
			"craft": {
				title: "Craft",
				enabled: true,
				unlocked: false
			},
			"workshopAutomation": {
				title: "Workshop Automation",
				enabled: true,
				unlocked: false
			},
			"meteor": {
				title: "Meteors",
				enabled: true,
				unlocked: false
			},
			"ivoryMeteor": {
				title: "Ivory Meteors",
				enabled: true,
				unlocked: false
			},
			"unicornRift": {
				title: "Unicorn Rifts",
				enabled: true,
				unlocked: false
			},
			"alicornRift": {
				title: "Alicorn Rifts",
				enabled: true,
				unlocked: false
			}
		},
		/**
		 * Prints message in the console. Returns a DOM node for the last created message
		 */
		msg : function(message, type, tag, noBullet){
			if (tag && this.filters[tag]){
				var filter = this.filters[tag];

				if (!filter.unlocked){
					filter.unlocked = true;
					this.renderFilters();
				} else if (!filter.enabled){
					return;
				}
			}

			var gameLog = dojo.byId("gameLog");

			if (gameLog) {
				dojo.forEach(dojo.query("*", gameLog), function (entry, i) {
					if (i > 24) {
						dojo.setStyle(entry, "opacity", (1 - (i-24) * 0.066));
					}
				});
			}

			var span = dojo.create("span", { innerHTML: message, className: "msg" }, gameLog, "first");

			if (type){
				dojo.addClass(span, "type_"+type);
			}
			if (noBullet) {
				dojo.addClass(span, "noBullet");
			}

			/**
			 * This code snippet groups the messages under a single date header based on a date stamp.
			 * The logic is not straightforward and a bit hacky. Maybe there is a better way to handle it like tracking the reference to a date node
			 */
			var spans = this.spans;
			if (spans.length>1 && type == 'date' && message==spans[spans.length - 2].innerHTML) {
				dojo.destroy(spans[spans.length - 2]);
				spans.splice(spans.length - 2, 1);
			}
			//----------------------------------------------------------------------------------------------------------

			spans.push(span);
			if (spans.length > 40){
				dojo.destroy(spans.shift()); //remove the first element from the array and destroy it
			}


			return span;
		},

		clear: function(){
			this.spans = [];

			var gameLog = dojo.byId("gameLog");
			dojo.empty(gameLog);
		},

		renderFilters: function(){
			var filters = dojo.byId("logFilters");
			dojo.empty(filters);
			var show = false;

			for (var fId in this.filters){
				if (this.filters[fId].unlocked) {
					this._createFilter(fId, filters);
					show = true;
				}
			}
			$("#logFiltersBlock").toggle(show);
		},

		_createFilter: function(fId, filters){
			var id = "filter-" + fId;

			var checkbox = dojo.create("input", {
					id: id,
					type: "checkbox",
					checked: this.filters[fId].enabled
			}, filters);
			dojo.connect(checkbox, "onclick", this, function(){
				this.filters[fId].enabled = checkbox.checked;
			});

			dojo.create("label", {
				"for": id,
				innerHTML: this.filters[fId].title
			}, filters);
			dojo.create("br", null, filters);
		},

		resetState: function (){
			for (var fId in this.filters){
				var filter = this.filters[fId];
				filter.unlocked = filter.defaultUnlocked || false;
				filter.enabled = true;
			}
			this.renderFilters();
		},

		save: function(saveData){
			saveData.console = {
				filters: this.filters
			};
		},

		load: function(saveData){
			if (saveData.console && saveData.console.filters){
				for (var fId in saveData.console.filters){
					var savedFilter = saveData.console.filters[fId];

					if (this.filters[fId]) {
						this.filters[fId].unlocked = savedFilter.unlocked;
						this.filters[fId].enabled = savedFilter.enabled;
					}
				}
				this.renderFilters();
			}
		}
	}
});

/**
 * A base class for game button. Inventing the wheel since 2014
 */

dojo.declare("com.nuclearunicorn.game.ui.Button", com.nuclearunicorn.core.Control, {

	game: null,
	refundPercentage: 0.5,

	name: "",
	description: "",
	visible: true,
	enabled: true,
	handler: null,
	prices: null,
	priceRatio: null,
	twoRow: null,

	//nodes

	domNode: null,
	container: null,

	tab: null,

	//--------------------
	//left part of the button
	buttonTitle: null,

	constructor: function(opts, game){
		this.game = game;

		this.setOpts(opts);
		this.init();
	},

	setOpts: function(opts){
		this.id = opts.id;
		this.name = opts.name;
		this.handler = opts.handler;
		this.description = opts.description;
		this.twoRow = opts.twoRow;

		this.prices = opts.prices ? opts.prices : [];
		this.priceRatio = opts.priceRatio;

		//screw this
		this.opts = opts;
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
				dojo.removeClass(this.domNode, "disabled");
			}
		} else {
			if (this.enabled){
				dojo.addClass(this.domNode, "disabled");
			}
		}
		this.enabled = enabled;
	},

	updateEnabled: function(){
		this.setEnabled(this.hasResources());

		if (!this.buttonTitle || !this.game.opts.highlightUnavailable){
			return;
		}

		//---------------------------------------------------
		//		a bit hackish place for price highlight
		//---------------------------------------------------
		var limited = this.game.resPool.isStorageLimited(this.getPrices());
		//---- now highlight some stuff in vanilla js way ---
		this.buttonTitle.className = limited ? "limited" : "";

	},

	updateVisible: function(){
		//do nothing
	},

	hasResources: function(prices){
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
				if (res.refundable) {
					this.game.resPool.addResEvent(price.name, price.val * percent);
				} else {
					// No refund at all
				}
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

		if (this.twoRow) {
			dojo.setStyle(this.domNode, "marginLeft", "auto");
			dojo.setStyle(this.domNode, "marginRight", "auto");
		}

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
			}, 70);
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

		var linkHandler = dojo.connect(link, "onclick", this, dojo.partial(function(handler, event){
			event.stopPropagation();
			event.preventDefault();

			dojo.hitch(this, handler, event)();

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
			linkBreak: linkBreak,
			linkHandler: linkHandler
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
	simplePrices: true,
	hasResourceHover: false,

	afterRender: function(){
		dojo.addClass(this.domNode, "modern");

		this.renderLinks();

		this.attachTooltip(this.domNode, dojo.partial( this.getTooltipHTML, this));

		this.buttonContent.title = "";	//no old title for modern buttons :V

		if (this.hasResourceHover) {
			dojo.connect(this.domNode, "onmouseover", this,
				dojo.hitch( this, function(){
					this.game.setSelectedObject(this.getSelectedObject());
				}));
			dojo.connect(this.domNode, "onmouseout", this,
				dojo.hitch( this, function(){
					this.game.clearSelectedObject();
				}));
		}
	},

	getDescription: function(){
		return this.description;
	},

	getFlavor: function(){
		return undefined;
	},

	getEffects: function(){
		return undefined;
	},

	getTooltipHTML: function(btn){
		//throw "ButtonModern::getTooltipHTML must be implemented";

		var tooltip = dojo.create("div", { style: {
			width: "280px"
		}}, null);


		if (this.tooltipName) {
			dojo.create("div", {
				innerHTML: this.getName(),
				style: {
					textAlign: "center",
					width: "100%",
					borderBottom: "1px solid gray",
					paddingBottom: "4px"
			}}, tooltip);
		}

		// description
		var descDiv = dojo.create("div", {
			innerHTML: this.getDescription(),
			style: {
				textAlign: "center",
				width: "100%",
				maxWidth: "280px",
				paddingTop: "4px",
				fontSize: "15px",
				color: "gray"
		}}, tooltip);

		var prices = this.prices;
		var effects = this.getEffects();
		var flavor = this.getFlavor();
		if (prices && prices != "" || effects || flavor && flavor != ""){
			dojo.setStyle(descDiv, "paddingBottom", "8px");

			// prices
			if (prices){
				dojo.setStyle(descDiv, "borderBottom", "1px solid gray");
				this.renderPrices(tooltip, this.getSimplePrices());	//simple prices
			}

			// effects

			if (effects){
				this.renderEffects(tooltip, effects);
			}

			// flavor

			if (flavor && flavor != "") {
				dojo.create("div", {
					innerHTML: flavor,
					className: "flavor",
					style: {
						display: "inline-block",
						paddingTop: "20px",
						float: "right",
						fontSize: "12px",
						fontStyle: "italic"
				}}, tooltip);
			}

		} else {
			dojo.setStyle(descDiv, "paddingBottom", "4px");
		}

		return tooltip.outerHTML;
	},
	getSimplePrices: function() {
		return this.simplePrices;
	},

	renderPrices: function(tooltip, simpleUI){
		var prices = this.getPrices();
		if (!prices.length){
			return;
		}
		for( var i = 0; i < prices.length; i++){
			var price = prices[i];
			var span = this._renderPriceLine(tooltip, price, simpleUI);
		}
	},

	_renderPriceLine: function(tooltip, price, simpleUI, indent){
		var priceItemNode = dojo.create("div", {
				style : {
					overflow: "hidden"
				}
			}, tooltip);

		var res = this.game.resPool.get(price.name);
		var hasRes = (res.value >= price.val);


		var nameSpan = dojo.create("span", { innerHTML: res.title || res.name, style: { float: "left", paddingRight: "10px"} }, priceItemNode );

		var asterisk = res.maxValue && ((price.val > res.maxValue && !indent) || price.baseVal > res.maxValue) ? "*" : "";	//mark limit issues with asterisk

		var priceSpan = dojo.create("span", {
			innerHTML: hasRes || simpleUI ?
				this.game.getDisplayValueExt(price.val) :
				this.game.getDisplayValueExt(res.value) + " / " + this.game.getDisplayValueExt(price.val) + asterisk,
			className: hasRes ? "" : "noRes",
			style: {
				float: "right"
			}
		}, priceItemNode );

		var resPerTick = this.game.getResourcePerTick(res.name, true);
		if (!hasRes && resPerTick > 0 && !simpleUI){
			var eta = (price.val-res.value) / (resPerTick * this.game.getRateUI());
			if (eta >= 1) {
				priceSpan.textContent += " (" + this.game.toDisplaySeconds(eta) + ")";
			}
		}


		//unroll prices to the raw resources
		if (!hasRes && res.craftable && !simpleUI && res.name != "wood"){
			var craft = this.game.workshop.getCraft(res.name);
			if (craft.unlocked) {
				var craftRatio = this.game.getResCraftRatio(res);
				nameSpan.textContent = "+ " + nameSpan.textContent;

				if (!indent) {
					indent = 1;
				}

				var components = this.game.workshop.getCraftPrice(craft);
				for (var j in components) {

					var diff = price.val - res.value;

					// Round up to the nearest craftable amount
					var val = Math.ceil(components[j].val * diff / (1 + craftRatio));
					var remainder = val % components[j].val;
					if (remainder != 0) {
						val += components[j].val - remainder;
					}

					var comp = {name: components[j].name, val: val, baseVal: components[j].val};

					var compSpan = this._renderPriceLine(tooltip, comp, simpleUI, indent + 1);
					for (var k = 0; k < indent; ++k) {
						compSpan.name.innerHTML = "&nbsp;&nbsp;&nbsp;" + compSpan.name.innerHTML;
					}
					compSpan.name.style.color = "gray";	//mark unrolled price component as raw
				}
			}
		}

		return {name: nameSpan, price: priceSpan};
	},

	renderEffects: function(tooltip, effectsList, hideTitle){
		if (Object.keys(effectsList).length === 0) {
			return;
		}

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

		for (var effectName in effectsList){
			var effectValue = effectsList[effectName];
			if (effectValue != 0) {
				var effectMeta = this.game.getEffectMeta(effectName);

				if (effectMeta.resName && !this.game.resPool.get(effectMeta.resName).unlocked){
					continue;	//hide resource-related effects if we did not unlocked this effect yet
				}

				var displayEffectName = effectMeta.title;

				var displayEffectValue = "";

				//display resMax values with global ratios like Refrigeration and Paragon
				if (effectName.substr(-3) === "Max") {
					var res = this.game.resPool.get(effectMeta.resName || effectName.slice(0, -3));
					if (res != false) { // If res is a resource and not just a variable
						effectValue = this.game.resPool.addResMaxRatios(res, effectValue);
					}
				}

				if (effectMeta.type === "perTick" && this.game.opts.usePerSecondValues){
					displayEffectValue = this.game.getDisplayValueExt(effectValue * this.game.rate) + "/sec";
				} else if (effectMeta.type === "perDay"){
					displayEffectValue = this.game.getDisplayValueExt(effectValue) + "/day";
				} else if (effectMeta.type === "perYear"){
					displayEffectValue = this.game.getDisplayValueExt(effectValue) + "/year";
				} else if ( effectMeta.type === "ratio" ) {
					displayEffectValue = this.game.toDisplayPercentage(effectValue, 0, false) + "%";
				} else if ( effectMeta.type === "integerRatio" ){
					displayEffectValue = this.game.getDisplayValueExt(effectValue) + "%";
				} else if ( effectMeta.type === "energy" ){
					displayEffectValue = this.game.getDisplayValueExt(effectValue) + "Wt";
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
		var btn = this;

		var H_OFFSET = 280;

		dojo.connect(container, "onmouseover", this, function() {
			this.game.tooltipUpdateFunc = function(){
				btn.updateTooltip(container, tooltip, htmlProvider);
			};
			this.game.tooltipUpdateFunc();
			var pos = $(container).position();

			//prevent tooltip from leaving the window area
			var scrollBottom = $(window).scrollTop() + $(window).height() - 50;	//50px padding-bottom
			var scrollRight = $(window).scrollLeft() + $(window).width() - 25;	//25px padding-bottom

			if (pos.top + $(tooltip).height() >= scrollBottom){
				pos.top = scrollBottom - $(tooltip).height();
			}

			var V_OFFSET = 0;
			if (pos.left + $(tooltip).width() + H_OFFSET >= scrollRight){
				pos.left = scrollRight - $(tooltip).width() - H_OFFSET;
				V_OFFSET = 35;
			}

			dojo.setStyle(tooltip, "left", (pos.left + H_OFFSET) + "px");
			dojo.setStyle(tooltip, "top",  (pos.top + V_OFFSET ) + "px");

			dojo.setStyle(tooltip, "display", "");
		});

		dojo.connect(container, "onmouseout", this, function(){
			this.game.tooltipUpdateFunc = null;
			dojo.setStyle(tooltip, "display", "none");
		});
	},

	updateTooltip: function(container, tooltip, htmlProvider){
		tooltip.innerHTML = dojo.hitch(this, htmlProvider)();
	},

	renderLinks: function(){
		//do nothing, implement me
	},

	getSelectedObject: function(){
		return null;
	}
});

dojo.declare("com.nuclearunicorn.game.ui.BuildingBtn", com.nuclearunicorn.game.ui.ButtonModern, {
	sellHref: null,
	toggleHref: null,
	hasResourceHover: true,

	buildingName: null,

	constructor: function(opts, game){
		if (opts.building){
			this.buildingName = opts.building;
		}
	},

	init: function(){
		this.prices = this.getPrices();
	},

	getMetadata: function(){
		if (this.buildingName){
			var meta = this.game.bld.get(this.buildingName);
			return meta;
		}
		return null;
	},

	/**
	 * Ugly hack'
	 */
	getMetadataRaw: function(){
		return this.getMetadata();
	},

	getEffects: function(){
		return this.getMetadata().effects;
	},

	getSelectedObject: function(){
		return this.getMetadata();
	},

	getDescription: function(){
		var description = this.getMetadata().description;
		return typeof(description) != "undefined" ? description : "";
	},

	getFlavor: function(){
		var flavor = this.getMetadata().flavor;
		return typeof(flavor) != "undefined" ? flavor : "";
	},

    undo: function(metaId, val){
        if (console && console.warn) {
            console.warn("Not implemented yet!");
        }
    },

	hasSellLink: function(){
		return false;
	},

	/**
	 * Render button links like off/on and sell
	 */
	renderLinks: function(){
		var building = this.getMetadata();
		var bldMeta = this.getMetadataRaw();

		//var sellLinkAdded = false;
		if (bldMeta && bldMeta.val && this.hasSellLink()){
			if (!this.sellHref){
				this.sellHref = this.addLink("sell",
					function(event){
						var end = bldMeta.val - 1;
						if (end > 0 && event.shiftKey) { //no need to confirm if selling just 1
							if (this.game.opts.noConfirm || confirm("Are you sure you want to sell all?")) {
								end = 0;
							}
						}
						while (bldMeta.val > end && this.hasSellLink() ) { //religion upgrades can't sell past 1
							bldMeta.val--;

							this.refund(this.refundPercentage);

							this.prices = this.getPrices();
						}

						if (bldMeta.on > bldMeta.val){
							bldMeta.on = bldMeta.val;
						}
						this.game.upgrade(building.upgrades);
						this.game.render();
					});
				//var sellLinkAdded = true;
			}
		}

		//--------------- style -------------
		if((building.val > 9 || building.name.length > 10) && this.hasSellLink()) {
			//Steamworks and accelerator specifically can be too large when sell button is on
			//(tested to support max 99 bld count)
			dojo.addClass(this.domNode, "small-text");
		}

		//--------------- toggle ------------
		if (typeof(building.togglable) != "undefined" && building.togglable){
			this.remove = this.addLinkList([
			   {
				id: "off1",
				title: "-",
				handler: function(){
					var building = this.getMetadata();
					if (building.on){
						building.on--;
						this.game.upgrade(building.upgrades);
					}
				}
			   },{
				id: "offAll",
				title: "-all",
				handler: function(){
					var building = this.getMetadata();
					if (building.on) {
						building.on = 0;
						this.game.upgrade(building.upgrades);
					}
				}
			   }]
			);

			this.add = this.addLinkList([
			   {
				id: "add1",
				title: "+",
				handler: function(){
					var building = this.getMetadata();
					if (building.on < building.val){
						building.on++;
						this.game.upgrade(building.upgrades);
					}
				}
			   },{
				id: "add",
				title: "+all",
				handler: function(){
					var building = this.getMetadata();
					if (building.on < building.val) {
						building.on = building.val;
						this.game.upgrade(building.upgrades);
					}
				}
			   }]
			);
		}

		if (typeof(building.togglableOnOff) != "undefined"){
			this.toggle = this.addLink( building.on ? "on" : "off",
				function(){
					var building = this.getMetadataRaw();

					building.on = building.on ? 0 : building.val;	//legacy safe switch
					this.game.upgrade(building.upgrades);
				}, true	//use | break
			);
		}

		if (typeof(building.isAutomationEnabled) != "undefined" && building.isAutomationEnabled != null) {
			this.toggleAutomation = this.addLink( building.isAutomationEnabled ? "A" : "*",
				function(){
					var building = this.getMetadataRaw();
					building.isAutomationEnabled = !building.isAutomationEnabled;
				}, true
			);
		}

	},

	update: function(){
		this.inherited(arguments);

		var self = this;

		//we are calling update before render, panic flee
		if (!this.buttonContent){
			return;
		}

		var building = this.getMetadata();
		if (building && building.val){

			// -------------- sell ----------------
			if (this.sellHref){
				dojo.setStyle(this.sellHref.link, "display", (building.val > 0) ? "" : "none");
			}

			//--------------- style -------------
			if(building.val > 9) {
				dojo.setStyle(this.domNode,"font-size","90%");
			}

			if (this.toggle || this.remove || this.add) {
				dojo.removeClass(this.domNode, "bldEnabled");
				dojo.removeClass(this.domNode, "bldlackResConvert");
				if (building.lackResConvert) {
					dojo.toggleClass(this.domNode, "bldlackResConvert", (building.on > 0 ? true : false));
				} else {
					dojo.toggleClass(this.domNode, "bldEnabled", (building.on > 0 ? true : false));
				}
			}

			//--------------- toggle ------------
			/* Always display link, else, when the link disappears, the player can click on the button unintentionally
			if (this.remove){
				dojo.setStyle(this.remove["off1"].link, "display", (building.on > 0) ? "" : "none");
			}
			if (this.add){
				dojo.setStyle(this.add["add1"].link, "display", (building.on < building.val) ? "" : "none");
			}
			*/

			if (this.toggle){
				this.toggle.link.textContent = building.on ? "on" : "off";
				this.toggle.link.title = building.on ? "Building enabled" : "Building disabled";
			}

			if (this.toggleAutomation){
				this.toggleAutomation.link.textContent = building.isAutomationEnabled ? "A" : "*";
				this.toggleAutomation.link.title = building.isAutomationEnabled ? "Automation enabled" : "Automation disabled";
			}

		}
	},

	updateVisible: function(){
		this.setVisible(this.getMetadata().unlocked || this.game.devMode);
	}
});

dojo.declare("com.nuclearunicorn.game.ui.BuildingStackableBtn", com.nuclearunicorn.game.ui.BuildingBtn, {
	getDescription: function(){
		return this.inherited(arguments);
	},

	getName: function(){
		var meta = this.getMetadata();

		if (meta.val == 0) {
			return meta.label;
		} else if (meta.noStackable){
			return meta.label + " (complete)";
		} else if (meta.togglableOnOff){
			return meta.label + " (" + meta.val + ")";
		} else if (meta.togglable) {
			return meta.label + " ("+ meta.on + "/" + meta.val + ")";
		} else {
			return meta.label + " (" + meta.on + ")";
		}
	},

	getPrices: function(){
		var meta = this.getMetadata();
        var ratio = meta.priceRatio || 1;
        var prices = dojo.clone(meta.prices);

        for (var i = 0; i< prices.length; i++){
            prices[i].val = prices[i].val * Math.pow(ratio, meta.val);
        }
        return prices;
    },

	onClick: function(event){
		this.animate();
		var meta = this.getMetadataRaw();
		if (this.enabled && this.hasResources() || this.game.devMode){
			if (
				this.game.ironWill && meta.effects && meta.effects["maxKittens"] > 0 && this.game.science.get("archery").researched &&
				!confirm("This will end iron will. Are you sure?")
			){
				return;
			}
			if (!meta.noStackable && event.shiftKey){
                if (this.game.opts.noConfirm || confirm("Are you sure you want to construct all buildings?")){
					var maxBld = typeof(meta.limitBuild) == "number" ? (meta.limitBuild - meta.val) : 10000;
                    this.build(meta, maxBld);
                }
            } else {
                this.build(meta, 1);
            }
		}
		this.game.render();
	},

	build: function(meta, maxBld){
		var counter = 0;
        if (this.enabled && this.hasResources()){

	        while (this.hasResources() && maxBld > 0){
				this.payPrice();

		        meta.val++;
				meta.on++;

	            // manage togglableOnOff when Off
	            if (meta.togglableOnOff && meta.on == 1){
	                meta.on--;
	            }

	            counter++;
	            maxBld--;
	        }

	        if (counter > 1) {
		        this.game.msg(this.getMetadata().label + " x" + counter + " constructed.", "notice");
			}

			if (meta.breakIronWill) {
				this.game.ironWill = false;
			}

			if (meta.unlocks) {
				this.game.unlock(meta.unlocks);
			}

			if (meta.upgrades) {
				this.game.upgrade(meta.upgrades);
			}
        }

		return counter;
    },

	updateEnabled: function(){
		var meta = this.getMetadata();
		// Beginning with exceptions
		if (typeof(meta.limitBuild) == "number" && meta.limitBuild <= meta.val) {
			this.setEnabled(false);
		} else if (!meta.on || meta.on && !meta.noStackable) {
			this.setEnabled(this.hasResources());
		} else if (meta.on && meta.noStackable){
			this.setEnabled(false);
		}

		if (this.buttonTitle && this.game.opts.highlightUnavailable){
			this.buttonTitle.className = this.game.resPool.isStorageLimited(this.getPrices()) ? "limited" : "";
		}
	}
});

dojo.declare("com.nuclearunicorn.game.ui.BuildingResearchBtn", com.nuclearunicorn.game.ui.BuildingBtn, {
	getDescription: function(){
		var meta = this.getMetadata();
		if (meta.effectDesc && meta.researched){
			return this.inherited(arguments) + "<br>" + "Effect: " + meta.effectDesc;
		} else {
			return this.inherited(arguments);
		}
	},

	getName: function(){
		var meta = this.getMetadata();
		if (meta.researched){
			return meta.label + " (Complete)";
		} else {
			return meta.label;
		}
	},

	getPrices: function() {
		return $.extend(true, [], this.getMetadata().prices); // Create a new array to keep original values
	},

	onClick: function(event){
		this.animate();
		if ((this.enabled && this.hasResources()) || this.game.devMode){
			this.payPrice();

			var meta = this.getMetadata();

			meta.researched = true;

			if (meta.unlocks) {
				this.game.unlock(meta.unlocks);
			}

			if (meta.upgrades) {
				this.game.upgrade(meta.upgrades);
			}

			this.game.render();
		}
	},

	updateEnabled: function(){
		this.inherited(arguments);
		if (this.getMetadata().researched){
			this.setEnabled(false);
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

dojo.declare("mixin.IGameAware", null, {
	game: null,

	setGame: function(game){
		this.game = game;
	}
});

dojo.declare("mixin.IChildrenAware", null, {
	children: null,

	constructor: function(){
		this.children = [];
	},

	addChild: function (child) {
		if (!child) {
			throw "Child can't be null";
		}
		this.children.push(child);
	},

	render: function(container){
		dojo.forEach(this.children, function(e, i){
			e.render(container);
		});
	},

	update: function(){
		dojo.forEach(this.children, function(e, i){ e.update(); });
	}
});
/**
 * Collapsible panel for a tab
 */
dojo.declare("com.nuclearunicorn.game.ui.Panel", [com.nuclearunicorn.game.ui.ContentRowRenderer, mixin.IChildrenAware], {
	game: null,

	collapsed: false,
	visible: true,
	name: "",

	panelDiv: null,


	//------ collapse ------
	toggle: null,
	contentDiv: null,

	constructor: function(name, tabManager){
		this.name = name;
		if (tabManager){
			tabManager.registerPanel(name, this);
		}
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

		this.title = dojo.create("div", {
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

		/*
		 *	Render all children, probably not a best thing from architectual point of view
		 */
		this.inherited(arguments, [this.contentDiv] /* dojo majic */);

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
		this.inherited(arguments);
	},

	setGame: function(game){
		this.game = game;
	}
});

/**
 * Tab
*/
dojo.declare("com.nuclearunicorn.game.ui.tab", [com.nuclearunicorn.game.ui.ContentRowRenderer, mixin.IChildrenAware], {

	game: 		null,
	buttons: 	null,

	tabId: 		null,
	tabName: 	null,
	domNode:  null,
	visible: 	true,

	constructor: function(tabName, game){
		this.tabName = tabName;
		this.tabId = tabName;
		this.buttons = [];

		this.game = game;
	},

	render: function(tabContainer){
		this.inherited(arguments);
		this.initRenderer(tabContainer);
	},

	update: function(){
		this.inherited(arguments);

		/*--------------------------
		Todo: this stuff is really deprecated, move it to the BLDv2 tab?
		---------------------------*/
		for (var i = 0; i<this.buttons.length; i++){
			var button = this.buttons[i];
			button.update();
		}
	},

	updateTab: function(){
	},

	/*--------------------------
	 This stuff is deprecated to
	 ---------------------------*/
	addButton:function(button){
		button.game = this.game;
		button.tab = this;
		this.buttons.push(button);
	}
});

/**
 * TODO: Please deprecate zillion of other instances of this method
 * TODO2: return offset from a htmlProvider.
 * Ideally it should be some structure like
 * {
 * 	x,
 * 	y,
 * 	html
 * }
 */
UIUtils = {
	attachTooltip: function(game, container, topPosition, leftPosition, htmlProvider){
		var tooltip = dojo.byId("tooltip");
		var btn = this;

		dojo.connect(container, "onmouseover", this, function() {
			game.tooltipUpdateFunc = function(){
				tooltip.innerHTML = dojo.hitch(game, htmlProvider)();
			};
			game.tooltipUpdateFunc();
			var pos = $(container).offset();

			//prevent tooltip from leaving the window area
			var scrollBottom = $(window).scrollTop() + $(window).height() - 50;	//50px padding-bottom
			var scrollRight = $(window).scrollLeft() + $(window).width() - 25;	//25px padding-bottom

			if (pos.top + $(tooltip).height() >= scrollBottom){
				pos.top = scrollBottom - $(tooltip).height();
			}

			if (pos.left + $(tooltip).width() + 320 >= scrollRight){
				pos.left = scrollRight - $(tooltip).width() - 320;
			}

			dojo.setStyle(tooltip, "left", (pos.left + leftPosition) + "px");
			dojo.setStyle(tooltip, "top",  (pos.top + topPosition) + "px");

			if (tooltip.innerHTML) {
				dojo.setStyle(tooltip, "display", "");
			}
		});

		dojo.connect(container, "onmouseout", this, function(){
			game.tooltipUpdateFunc = null;
			dojo.setStyle(tooltip, "display", "none");
		});

		return htmlProvider;
	}
};
