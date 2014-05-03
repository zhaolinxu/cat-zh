dojo.declare("com.nuclearunicorn.game.ResourceManager", null, {
	
	resourceData: [
	{
		name : "catnip",
		type : "common",
		tradable: true,
		supply: 120,
		supplyDelta: 10,
		demand: 70,
		demandDelta: 10
	},
	{
		name : "wood",
		type : "common",
		tradable: true
	},
	{
		name : "minerals",
		type : "common",
		tradable: true
	},
	{
		name : "iron",
		type : "common",
		tradable: true
	},
	
	//untradable
	
	{
		name : "manpower",
		type : "common",
		tradable: false
	},
	{
		name : "science",
		type : "common",
		tradable: false
	},
	{
		name : "kittens",
		type : "common",
		tradable: false
	},
	{
		name : "kittens",
		type : "common",
		tradable: false
	},
	
	// luxury resources
	
	{
		name : "furs",
		type : "uncommon",
		tradable: true
	},
	{
		name : "ivory",
		type : "uncommon",
		tradable: true
	},
	{
		name : "spice",
		type : "uncommon",
		tradable: true
	},
	{
		name : "unicorns",
		type : "rare",
		tradable: true
	}
	
	],
	
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
		this.addResource("spice", "uncommon");
		
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

		this.resources.push(res);
		
		return res;
	},

	/**
	 * Iterates resources and updates their values with per tick increment
	 */
	update: function(){
					
		//var modifiers = this.village.getResourceModifers();
		
		for (var i = 0; i< this.resources.length; i++){
			var res = this.resources[i];
		
			var resPerTick = this.game.getResourcePerTick(res.name);
			res.value = res.value + resPerTick;
			
			var maxValue = this.game.bld.getEffect(res.name + "Max");
			if (maxValue > 0 ){
				res.maxValue = maxValue;
			}
			
			if (res.value < 0){
				res.value = 0;	//can't be negative
			}
			if (res.value > res.maxValue){
				res.value = res.maxValue;
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
