dojo.declare("com.nuclearunicorn.game.ResourceManager", null, {
	
	//=========================================
	//				COMMON
	//=========================================
	resourceData: [
	{
		name : "catnip",
		type : "common",
		visible: true
	},{
		name : "wood",
		type : "common",
		craftable: true,
		visible: true
	},{
		name : "minerals",
		type : "common",
		visible: true
	},{
		name : "coal",
		type : "common",
		visible: true
	},{
		name : "iron",
		type : "common",
		visible: true
	},{
		name : "titanium",
		type : "common",
		visible: true,
	},{
		name : "gold",
		type : "common",
		visible: true
	},{
		name : "oil",
		type : "common",
		visible: true
	},
	
	//=========================================
	//			   TRANSIENT
	//=========================================
	{
		name : "manpower",
		title: "catpower",
		type : "common",
		visible: true,
		transient: true,		//cant be affected by magneto bonus
		color: "#DBA901"
	},{
		name : "science",
		type : "common",
		visible: true,
		transient: true,
		color: "#01A9DB"
	},{
		name : "culture",
		type : "common",
		visible: true,
		transient: true,
		color: "#DF01D7"
	},{
		name : "faith",
		type : "common",
		visible: true,
		transient: true,
		color: "gray"
	},{
		name : "kittens",
		type : "common",
		transient: true,
		visible: true
	},{
		name : "zebras",
		type : "common",
		transient: true,
		visible: true
	},{
		name : "starchart",
		type : "common",
		transient: true,
		visible: true
	},{
		name : "blueprint",
		type : "common",
		transient: true,
		visible: true,
		craftable: true,
		color: "#01A9DB"
	},
	
	//=========================================
	// 			  luxury resources
	//=========================================
	{
		name : "furs",
		type : "uncommon",
		transient: true,
		visible: true
	},{
		name : "ivory",
		type : "uncommon",
		transient: true,
		visible: true
	},{
		name : "spice",
		type : "uncommon",
		transient: true,
		visible: true
	},{
		name : "unicorns",
		type : "rare",
		transient: true,
		visible: true
	},{
		name : "alicorn",
		title: "alicorns",
		type : "rare",
		visible: true
	},{
		name : "tears",
		type : "rare",
		visible: true
	},{
		name : "karma",
		type : "rare",
		visible: true
	},{
		name : "paragon",
		type : "common",
		visible: true,
		color: "#6141CD"
	},{
		name : "timeCrystal",
		title: "time crystal",
		type : "common",
		visible: true,
		color: "#14CD61"
	},
	
	//=========================================
	// 				    CRAFT 
	//=========================================
	{
		name : "beam",
		type : "common",
		craftable: true
	},{
		name : "slab",
		type : "common",
		craftable: true
	},{
		name : "concrate",
		title: "concrete",
		type : "common",
		craftable: true
	},{
		name : "plate",
		type : "common",
		craftable: true
	},{
		name : "steel",
		type : "common",
		craftable: true,
		visible: false,
		color: "gray"
	},{
		name : "alloy",
		type : "common",
		craftable: true,
		visible: false,
		color: "gray"
	},{
		name : "gear",
		type : "common",
		craftable: true,
		color: "gray"
	},{
		name : "scaffold",
		type : "common",
		craftable: true,
		color: "#FF7F50"
	},{
		name : "ship",
		type : "common",
		craftable: true,
		color: "#FF7F50"
	},{
		name : "parchment",
		type : "common",
		craftable: true,
		color: "#DF01D7"
	},{
		name : "manuscript",
		type : "common",
		craftable: true,
		color: "#01A9DB"
	},{
		name : "compedium",
		title: "compendium",
		type : "common",
		craftable: true,
		color: "#01A9DB"
	},{
		name : "megalith",
		type : "common",
		craftable: true,
		color: "gray"
	}],
	
	resources: null,
	
	village: null,
	
	game: null,
	
	constructor: function(game){
		this.game = game;
		
		this.resources = [];
		
		for (var i = 0; i< this.resourceData.length; i++){
			var res = dojo.clone(this.resourceData[i]);
			res.value = 0;
			res.perTick = 0;
			this.resources.push(res);
		}
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

		this.resources.push(res);
		
		return res;
	},
	
	addResAmt: function(name, value){
		var res = this.get(name);

		if (value){
			res.value += value;
		}
		if (res.maxValue && res.value > res.maxValue){
			res.value = res.maxValue;
		}
		if (res.value < 0){
			res.value = 0;
		}
	},

	/**
	 * Iterates resources and updates their values with per tick increment
	 */
	update: function(){
					
		//var modifiers = this.village.getResourceModifers();
		
		for (var i = 0; i< this.resources.length; i++){
			var res = this.resources[i];

			var maxValue = this.game.bld.getEffect(res.name + "Max");
			maxValue += this.game.workshop.getEffect(res.name + "Max");
			
			if (res.name == "wood" || res.name == "minerals" || res.name == "iron"){	//that starts to look awfull
				maxValue = maxValue + maxValue * this.game.workshop.getEffect("barnRatio");
			}
			
			if (res.name == "catnip" && this.game.workshop.get("silos").researched){
				maxValue = maxValue + maxValue * this.game.workshop.getEffect("barnRatio") * 0.25;
			}
			
			if (res.name == "wood" || 
				res.name == "minerals" || 
				res.name == "iron" || 
				res.name == "steel" || 
				res.name == "coal" || 
				res.name == "gold"){
				if (this.game.workshop.getEffect("warehouseRatio")){
					maxValue = maxValue + maxValue * this.game.workshop.getEffect("warehouseRatio");
				}
			}
			
			var paragon = this.game.resPool.get("paragon").value;
			maxValue += maxValue * (paragon/1000);	//every 100 paragon will give a 10% bonus to the storage capacity
			
			
			if (maxValue > 0 ){
				res.maxValue = maxValue;
			}
			
			if (res.value < 0){
				res.value = 0;	//can't be negative
			}
			
			var resPerTick = this.game.getResourcePerTick(res.name) || 0;
			
			res.value = res.value + resPerTick;
			if (res.maxValue && res.value > res.maxValue){
				res.value = res.maxValue;
			}
			
			if (isNaN(res.value)){
				res.value = 0;	//safe switch
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
	},

	/**
	 * Retruns true if user has enough resources to construct AMT building with given price
	 */ 
	hasRes: function(prices, amt){
		if (amt){
			prices = dojo.clone(prices);
		
			for (var i = 0; i< prices.length; i++){
				prices[i].val *= amt;
			}
		}
		
		var hasRes = true;
		if (prices.length){
			for( var i = 0; i < prices.length; i++){
				var price = prices[i];
				
				var res = this.get(price.name);
				if (res.value < price.val){
					hasRes = false;
					break;
				}
			}
		}
		return hasRes;
	},
	
	payPrices: function(prices){
		if (prices.length){
			for( var i = 0; i < prices.length; i++){
				var price = prices[i];
				
				var res = this.get(price.name);
				res.value -= price.val;
			}
		}
	}
});
