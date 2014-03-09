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

dojo.declare("com.nuclearunicorn.game.core.resourcePool", null, {
	
	resources: null,
	
	village: null,
	
	game: null,
	
	constructor: function(game){
		this.game = game;
		
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
					
		var modifiers = this.village.getResourceModifers();	
		
		for (var i = 0; i< this.resources.length; i++){
			var res = this.resources[i];
			var perTickBase = res.perTick;
			
			//update BASE production rates per season (probably should be in the calendar)	
			
			if (res.name == "catnip"){
				var curSeason = this.game.calendar.getCurSeason();
				
				if (curSeason.name == "spring"){
					perTickBase *= 1.5;	//+50%
				}
				if (curSeason.name == "winter"){
					perTickBase *= 0.25; //-75%
				}
			}
			
			res.value += perTickBase;
			
			if (modifiers[res.name]){
				res.value += modifiers[res.name];
			}
			
			if (res.value < 0){
				res.value = 0;	//can't be negative
			}
		}
	},
	
	setVillage: function(village){
		this.village = village;
	},
	
	reset: function(){
		this.resources = [];
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
		
		var prices = this.getPrices();
		
		//todo: move somewhere else?
		if (prices.length){
			for( var i = 0; i < prices.length; i++){
				var price = prices[i];
				
				var res = this.game.resPool.get(price.name);
				if (res.value < price.val){
					isEnabled = false;
					break;
				}
			}
		}
		
		this.setEnabled(isEnabled);
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
		
		//console.log(this.prices);
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
	
	getDescription: function(){
		return this.description
	},
	
	getName: function(){
		return this.name
	},
	
	render: function(btnContainer){
		var self = this;
		
		this.container = btnContainer;

		
		this.domNode = dojo.create("div", { 

		}, btnContainer);
		
		this.buttonContent = dojo.create("div", {
			innerHTML: this.getName(),
			style: {
				
			},
			title: this.getDescription()
		}, this.domNode);
			
		
		// locked structures are invisible
		if (!this.visible){
			dojo.setStyle(this.domNode, "display", "none");
		}
		
		dojo.addClass(this.domNode, "btn");
		dojo.addClass(this.domNode, "nosel");
		
		if (!this.enabled){
			dojo.addClass(this.domNode, "disabled");
		}

		jQuery(this.domNode).click(function(){
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
			
			if (self.enabled){
				self.handler(self);
				
				self.payPrice();
				
				if (self.priceRatio){
					self.adjustPrice(self.priceRatio);
				}
			}
		});
		
		var prices = this.getPrices();
		if (prices.length){
			
			var tooltip = dojo.create("div", { style: {
				display: 	"none",
				border: 	"1px solid black",
				marginTop:	"5px",
				padding: 	"5px"
			}}, this.domNode);
			
			for( var i = 0; i < prices.length; i++){
				var price = prices[i];
				
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

dojo.declare("com.nuclearunicorn.game.ui.tab.Bonfire", com.nuclearunicorn.game.ui.tab, {
	constructor: function(tabName){
		//this.inherited(arguments);

		var self = this;
		
		var btn = new com.nuclearunicorn.game.ui.button({
			name:	 "Gather catnip", 
			handler: function(){
						self.game.resPool.get("catnip").value++;
					 },
			description: "Gathere some catnip in the wood"
		}, this.game);
		this.addButton(btn);
		
		var btn = new com.nuclearunicorn.game.ui.button({
			name: 		"Catnip field", 
			handler: 	function(){
							self.game.resPool.get("catnip").perTick += 0.125;
						},
			description: "Plant some catnip to grow it in the village.\n"+
			"Fields have +50% production in spring and -75% in winter",
			building: "field"
		}, this.game);
		
		this.addButton(btn);
		
		var btn = new com.nuclearunicorn.game.ui.button({
			name: 		"Refine catnip", 
			handler: 	function(){
							//self.game.resPool.get("catnip").value -= 100;
							self.game.resPool.get("wood").value += 1;
						},
			description: "Refine catnip into the catnip wood",
			prices: [ { name : "catnip", val: 100 }]
		}, this.game);
		
		this.addButton(btn);
		
		var btn = new com.nuclearunicorn.game.ui.button({
			name: 		"Hut", 
			handler: 	function(){
							//unlock village tab
							self.game.villageTab.visible = true;
						},
			description: "Build a hut (each has a space for 2 kittens)",
			building: "hut"
			
		}, this.game);
		this.addButton(btn);
		
		var btn = new com.nuclearunicorn.game.ui.button({
			name: 		"Library", 
			handler: 	function(){
							//unlock library tab
							self.game.libraryTab.visible = true;
							self.game.village.getJob("scholar").unlocked = true;
						},
			description: "Build a library to store sacred catkind knowledge",
			building: "library"
			
		}, this.game);
		this.addButton(btn);

	},
	
	/**
	 * 
	 */
	render: function(){
		this.inherited(arguments);
	}
});
