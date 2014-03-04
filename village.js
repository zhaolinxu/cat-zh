dojo.declare("com.nuclearunicorn.game.villageManager", null, {
	
	kittens: 0,

	maxKittens: 0,
	
	kittensPerTick: 0,	//to be updated (also with per day?)
	
	kittensPerTickBase: 0.01,
	
	//jobs assigned to kittens
	jobs: [{
		name: "woodcutter",
		title: "Woodcutter",
		
		modifiers:{
			"wood" : 0.01
		},
		value: 0
	}],
	
	//resource modifiers per tick
	resourceModifiers: {
		"catnip" : 0
	},

	game: null,
	
	constructor: function(game){
		this.game = game;
	},
	
	update: function(){
		
		var kittensPerTick = this.kittensPerTick + this.kittensPerTickBase;
		this.kittens += kittensPerTick;
		
		if (this.kittens > this.maxKittens){
			this.kittens = this.maxKittens;
		}
		
		var modifiers = this.getResourceModifers();
		
		var catnipVal = this.game.resPool.get("catnip").value;
		var resDiff = catnipVal + modifiers["catnip"];
		
		if (resDiff < 0){
			//console.log("kittens to die:", Math.abs(resDiff.toFixed()));
			
			var starvedKittens = Math.abs(resDiff.toFixed());
			if (starvedKittens > 0){
				this.kittens -= starvedKittens;
				this.game.msg(starvedKittens + " kittens starved to death");
			}
		}
		
		if (this.getFreeKittens() < 0 ){
			this.clearJobs();	//sorry, just stupid solution for this problem
		}
	},
	
	getFreeKittens: function(){
		var total = 0;
		for (var i = 0; i< this.jobs.length; i++){
			total += this.jobs[i].value;
		}
		
		return this.getKittens() - total;
	},
	
	clearJobs: function(){
		for (var i = 0; i< this.jobs.length; i++){
			this.jobs[i].value = 0;
		}
	},
	
	/**
	 * kittens can't be float value, it's an internal representation
	 * to handle cyclic process like birth ratio / death ration
	 */ 
	getKittens: function(){
		return Math.round(this.kittens);	
	},
	
	/**
	 * Get a list of resource modifiers per tick
	 */ 
	
	getResourceModifers: function(){
		
		var res = {
			"catnip" : -1 * this.getKittens()
		};
		
		for (var i = 0; i< this.jobs.length; i++){

			var job = this.jobs[i];
			for (jobResMod in job.modifiers){
				if (!res[jobResMod]){
					res[jobResMod] = job.modifiers[jobResMod];
				}else{
					res[jobResMod] += job.modifiers[jobResMod];
				}
			}
		}
		
		return res;
	},
	
	reset: function(){
		this.kittens = 0;
		this.maxKittens = 0;
	},
	
	save: function(saveData){
		saveData.village = {
			kittens : this.kittens,
			maxKittens: this.maxKittens,
			jobs: this.jobs
		};
	},
	
	load: function(saveData){
		if (saveData.village){
			this.kittens  = saveData.village.kittens;
			this.maxKittens  = saveData.village.maxKittens;
			
			if (saveData.village.jobs.length){
				this.jobs = saveData.village.jobs;
			}
		}
	}
});
