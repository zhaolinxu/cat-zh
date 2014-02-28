dojo.declare("com.nuclearunicorn.game.buildings.BuildingsManager", null, {
	/* CITY GARDEN WILL BE THERE */
	
	//TODO: use some class hierarchy there?
	buildingsData : [{
		name: "hut",
		unlocked: false,
		
		//prices will eventually go there
		prices: [{ name : "wood", val: 10 }],
		effects: {
			"maxKittens" : 2
		},
		priceRatio: 1.15,
		
		val: 0
	}],
	
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
	}
});
