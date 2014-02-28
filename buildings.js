dojo.declare("com.nuclearunicorn.game.buildings.BuildingsManager", null, {
	/* CITY GARDEN WILL BE THERE */
	
	//TODO: use some class hierarchy there?
	buildingsData : [{
		name: "hut",
		unlocked: false,
		
		//prices will eventually go there
		prices: [{ name : "wood", val: 10 }],
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
	}
});
