dojo.declare("com.nuclearunicorn.game.buildings.BuildingsManager", null, {
	
	game: null,
	
	constructor: function(game){
		this.game = game;
	},
	
	//TODO: use some class hierarchy there?
	buildingsData : [
	{
		name: "field",
		label: "Catnip field",
		unlocked: false,
		prices: [{ name : "catnip", val: 10 }],
		effects: {},
		priceRatio: 1.12,
		
		val: 0
	},
	{
		name: "hut",
		unlocked: false,
		prices: [{ name : "wood", val: 5 }],
		effects: {
			"maxKittens" : 2
		},
		priceRatio: 2.5,
		
		val: 0
	},
	{
		name: "library",
		label: "Library",
		unlocked: false,
		prices: [{ name : "wood", val: 25 }],
		effects: {
			"scienceRatio": 1.2
		},
		priceRatio: 1.15,
		
		val: 0
	},
	{
		name: "barn",
		label: "Barn",
		unlocked: false,
		prices: [{ name : "wood", val: 500 }],
		effects: {
			"scienceRatio": 1.2
		},
		priceRatio: 1.15,
		requiredTech: ["agriculture"],
		
		val: 0
	},
	{
		name: "mine",
		label: "Mine",
		unlocked: false,
		prices: [{ name : "wood", val: 200 }],
		effects: {
			"scienceRatio": 1.2
		},
		priceRatio: 1.15,
		requiredTech: ["mining"],
		
		val: 0
	}
	],
	
	effectsBase: {
		"maxCatnip" : 2000
	},
	
	getBuilding: function(name){
		for (var i = 0; i < this.buildingsData.length; i++){
			var bld = this.buildingsData[i];
			
			if (bld.name == name){
				return bld;
			}
		}
		throw "can not find building data for '" + name + "'";
	},
	
	/**
	 * Returns a total effect value per buildings.
	 * 
	 * For example, if you have N buldings giving K effect,
	 * total value will be N*K
	 * 
	 */ 
	getEffect: function(name){
		var totalEffect = 0;
		
		for (var i = 0; i < this.buildingsData.length; i++){
			var bld = this.buildingsData[i];
			var effect = bld.effects[name];
			
			if (effect && bld.val){
				totalEffect += effect * bld.val;
			}
		}
		
		return totalEffect;
	},
	
	update: function(){
		for (var i = 0; i < this.buildingsData.length; i++){
			var bld = this.buildingsData[i];
			
			if (!bld.unlocked){
				if (this.isConstructionEnabled(bld)){
					bld.unlocked = true;
				}
			}
		}
	},
	
	isConstructionEnabled: function(building){
		var isEnabled = true;
		
		if (building.prices.length){
			for( var i = 0; i < building.prices.length; i++){
				var price = building.prices[i];
				
				var res = this.game.resPool.get(price.name);
				if (res.value < price.val){
					isEnabled = false;
					break;
				}
			}
		}
		
		return isEnabled;
	},
	
	save: function(saveData){
		saveData.buildings = this.buildingsData;
	},
	
	load: function(saveData){
		/*if (saveData.buildings && saveData.buildings.length){
			this.buildingsData  = saveData.buildings;
		}*/
		
		if (saveData.buildings.length){
			for(var i = 0; i< saveData.buildings.length; i++){
					var savedBld = saveData.buildings[i];
					
					if (savedBld != null){
						var bld = this.game.bld.getBuilding(savedBld.name);
						bld.val = savedBld.val;
						bld.unlocked = savedBld.unlocked;
						
						for (var j = 0; j< bld.val; j++){
							for( var k = 0; k < bld.prices.length; k++){
								var price = bld.prices[k];
								price.val = price.val * bld.priceRatio;
							}
						}
					}
			}
		}
	},
	
	reset: function(){
		for (var i = 0; i < this.buildingsData.length; i++){
			var bld = this.buildingsData[i];
			
			bld.val = 0;
		}
	}
});


dojo.declare("com.nuclearunicorn.game.ui.BuildingBtn", com.nuclearunicorn.game.ui.button, {
	sellHref: null,
	
	getName: function(){
		var building = this.getBuilding();
		if (building){
			return this.name + " (" + building.val + ")";
		}
		return this.name;
	},
	
	update: function(){
		this.inherited(arguments);
		
		var self = this;
		
		var building = this.getBuilding();
		if (building && building.val){
			if (!this.sellHref){
				this.sellHref = dojo.create("a", { href: "#", innerHTML: "sell", style:{
						paddingLeft: "4px",
						float: "right",
						cursor: "default"
					}}, null);
					
				dojo.connect(this.sellHref, "onclick", this, function(event){
					event.stopPropagation();
					
					building.val--;
					this.update();
				});
			} else {
				dojo.place(this.sellHref, this.buttonContent);
			}
			/*jQuery(sellHref).click(function(event){
				event.stopPropagation();
				
				building.val--;
				console.log("sold building:", building);
				 self.update();
			});*/
		}
		
	},
	
	updateVisible: function(){
		this.inherited(arguments);
		var building = this.getBuilding();
		
		if (!building){
			return;
		}
		
		if (!building.unlocked){
			this.setVisible(false);
		}else{
			this.setVisible(true);
		}
	}
});

dojo.declare("com.nuclearunicorn.game.ui.tab.Bonfire", com.nuclearunicorn.game.ui.tab, {
	constructor: function(tabName){
		//this.inherited(arguments);

		var self = this;
		
		var btn = new com.nuclearunicorn.game.ui.BuildingBtn({
			name:	 "Gather catnip", 
			handler: function(){
						self.game.resPool.get("catnip").value++;
					 },
			description: "Gathere some catnip in the wood"
		}, this.game);
		this.addButton(btn);
		
		var btn = new com.nuclearunicorn.game.ui.BuildingBtn({
			name: 		"Catnip field", 
			handler: 	function(){
							self.game.resPool.get("catnip").perTick += 0.125;
						},
			description: "Plant some catnip to grow it in the village.\n"+
			"Fields have +50% production in spring and -75% in winter",
			building: "field"
		}, this.game);
		
		this.addButton(btn);
		
		var btn = new com.nuclearunicorn.game.ui.BuildingBtn({
			name: 		"Refine catnip", 
			handler: 	function(){
							//self.game.resPool.get("catnip").value -= 100;
							self.game.resPool.get("wood").value += 1;
						},
			description: "Refine catnip into the catnip wood",
			prices: [ { name : "catnip", val: 100 }]
		}, this.game);
		
		this.addButton(btn);
		
		var btn = new com.nuclearunicorn.game.ui.BuildingBtn({
			name: 		"Hut", 
			handler: 	function(){
							//unlock village tab
							self.game.villageTab.visible = true;
						},
			description: "Build a hut (each has a space for 2 kittens)",
			building: "hut"
			
		}, this.game);
		this.addButton(btn);
		
		var btn = new com.nuclearunicorn.game.ui.BuildingBtn({
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

