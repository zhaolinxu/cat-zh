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
		unlocked: true,
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
		prices: [{ name : "wood", val: 50 }],
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
		if (saveData.buildings && saveData.buildings.length){
			this.buildingsData  = saveData.buildings;
		}
	},
	
	reset: function(){
		for (var i = 0; i < this.buildingsData.length; i++){
			var bld = this.buildingsData[i];
			
			bld.val = 0;
		}
	}
});
