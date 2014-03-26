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
		this.addResource("wood");
		this.addResource("minerals");	//?
		
		//uncommon resources
		this.addResource("furs", "uncommon");
		this.addResource("ivory", "uncommon");
		
		//unique resources
		this.addResource("unicorns", "rare");
	},
	
	get: function(name){
		for (var i = 0; i < this.resources.length; i++){
			var res = this.resources[i];
			if (res.name == name){
				return res;
			}
		}
		
		//if no resource found, register new
		return this.addResource(name, "common");
	},
	
	addResource: function(name, type){
		
		var res = {
				name: name,
				title: "",
				value: 0,
				perTick: 0,	
				type: "common"
		};
		
		if (type){
			res.type = type;
		}
		
		console.log(res);
		
		this.resources.push(res);
		
		return res;
	},

	/**
	 * Iterates resources and updates their values with per tick increment
	 */
	update: function(){
					
		var modifiers = this.village.getResourceModifers();
		var bld	
		
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
			
			//res ratio modifier
			var bldResRatio = this.game.bld.getEffect(res.name+"Ratio");
			if (bldResRatio){
				perTickBase += perTickBase * bldResRatio;
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
	},
	
	load: function(saveData){
		if (saveData.resources){
			var resources = saveData.resources;
			if (resources.length){
				for(var i = 0; i< resources.length; i++){
					var savedRes = resources[i];
					
					if (savedRes != null){
						var res = this.get(savedRes.name);
						res.value = savedRes.value;
						res.perTick = savedRes.perTick;
					}
				}
			}
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
		return this.description;
	},
	
	getName: function(){
		return this.name;
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
		
		this.afterRender()
	},
	
	afterRender: function(){

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
