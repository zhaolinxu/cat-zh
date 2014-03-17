dojo.declare("com.nuclearunicorn.game.villageManager", null, {
	
	kittens: 0,

	maxKittens: 0,
	
	kittensPerTick: 0,	//to be updated (also with per day?)
	
	kittensPerTickBase: 0.01,
	
	catnipPerKitten: -0.85,	/* amount of catnip per tick that kitten consumes */
	
	happiness: 1,	//percents of happiness modifier
	
	//jobs assigned to kittens
	jobs: [{
		name: "woodcutter",
		title: "Woodcutter",
		description: "+0.015 wood per tick",
		
		modifiers:{
			"wood" : 0.015
		},
		value: 0,
		unlocked: true
	},{
		name: "farmer",
		title: "Farmer",
		description: "+1 catnip per tick",
		
		modifiers:{
			"catnip" : 1
		},
		value: 0,
		unlocked: false
	},{
		name: "scholar",
		title: "Scholar",
		description: "+0.05 science per tick",
		
		modifiers:{
			"science" : 0.05
		},
		value: 0,
		unlocked: false
	},{
		name: "stonecutter",
		title: "Stonecutter",
		description: "+0.01 stone per tick",
		
		modifiers:{
			"stone" : 0.01
		},
		value: 0,
		unlocked: false
	},{
		name: "hunter",
		title: "Hunter",
		description: "+0.01 manpower per tick",
		
		modifiers:{
			"manpower" : 0.01
		},
		value: 0,
		unlocked: false
	}],
	
	//resource modifiers per tick
	resourceModifiers: {
		"catnip" : 0
	},

	game: null,
	
	constructor: function(game){
		this.game = game;
	},
	
	getJob: function(jobName){
		for( var i = 0; i< this.jobs.length; i++){
			if (this.jobs[i].name == jobName){
				return this.jobs[i];
			}
		}
		throw "Failed to get job for job name '"+jobName+"'";
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
		var kittens = this.getKittens();
		
		var res = {
			"catnip" : this.catnipPerKitten * kittens,
			"furs" : -0.01 * kittens,
			"ivory" : -0.007 * kittens
		};
		
		for (var i = 0; i< this.jobs.length; i++){

			var job = this.jobs[i];
			for (jobResMod in job.modifiers){
				if (!res[jobResMod]){
					res[jobResMod] = job.modifiers[jobResMod] * job.value;
				}else{
					res[jobResMod] += job.modifiers[jobResMod] * job.value;
				}
			}
		}
		
		return res;
	},
	
	reset: function(){
		this.kittens = 0;
		this.maxKittens = 0;
		
		this.clearJobs();
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
			
			/*if (saveData.village.jobs.length){
				this.jobs = saveData.village.jobs;
			}*/
			if (saveData.village.jobs.length){
				for(var i = 0; i< saveData.village.jobs.length; i++){
					var savedJob = saveData.village.jobs[i];
					
					var job = this.getJob(savedJob.name);
					job.unlocked = savedJob.unlocked;
					job.value = savedJob.value;
				}
			}
		}
	}
});


dojo.declare("com.nuclearunicorn.game.ui.JobButton", com.nuclearunicorn.game.ui.button, {
	
	jobName: null,
	
	getJob: function(){
		return this.game.village.getJob(this.jobName);
	},
	
	constructor: function(opts, game){
		this.jobName = opts.job;
	},
	
	updateEnabled: function(){
		this.inherited(arguments);
		if (this.game.village.getFreeKittens() == 0 ){
			this.setEnabled(false);
		}
	},
	
	getName: function(){
		var job = this.getJob();
		return this.name + " (" + job.value + ")";
	},
	
	getDescription: function(){
		var job = this.getJob();
		return job.description;
	},
	
	updateVisible: function(){
		//this.inherited(arguments);
		
		var job = this.getJob();
		
		if (!job.unlocked){
			this.setVisible(false);
		}else{
			this.setVisible(true);
		}
	}
});

/**
 * Village tab to manage jobs
 */ 

dojo.declare("com.nuclearunicorn.game.ui.tab.Village", com.nuclearunicorn.game.ui.tab, {
	
	tdTop: null,
	
	advModeButtons : null,
	
	constructor: function(tabName, game){
		//this.inherited(arguments);
		
		
		var self = this;
		this.game = game;

		
		for (var i = 0; i < this.game.village.jobs.length; i++){
			var job = this.game.village.jobs[i];
			
			var btn = this.createJobBtn(job, game);
			this.addButton(btn);
		}
		
		var btn = new com.nuclearunicorn.game.ui.button({ name:"Clear",
			handler: function(){
				self.game.village.clearJobs();
			}
		});
		this.addButton(btn);
		
		//----------- adv mode buttons ---------------
		this.advModeButtons = [];
		
		var huntBtn = new com.nuclearunicorn.game.ui.button({
				name: "Send hunters",
				handler: function(){
					//do nothing
					self.sendHunterSquad();
				},
				prices: [{ name : "manpower", val: 100 }]
		}, game);
		this.advModeButtons.push(huntBtn);
		
	},
	
	createJobBtn: function(job, game){
		var btn = new com.nuclearunicorn.game.ui.JobButton({
			name : job.title,
			handler: dojo.partial(function(job){
				
				var freeKittens = game.village.getFreeKittens();
				var jobRef = game.village.getJob(job.name); 	//probably will fix missing ref on loading

				if ( freeKittens > 0 ){
					jobRef.value += 1;
				}
			}, job),
			job: job.name
		}, game);
		return btn;
	},
	
	render: function(tabContainer){
		
		var table = dojo.create("table", { style:{
			width: "100%"
		}}, tabContainer);
		
		var tr = dojo.create("tr", null, table);
		
		var tdTop = dojo.create("td", { colspan: 2 },
			dojo.create("tr", null, table));

		this.tdTop = tdTop;
		
		
		var tr = dojo.create("tr", null, table)
		
		var tdLeft = dojo.create("td", null, tr);	
		var tdRight = dojo.create("td", null, tr);
				
		this.inherited(arguments);
		
		//----------------- happiness and things ----------------------
		
		var advVillageTable = dojo.create("table", { style: {
				width: "100%"
			}}, tabContainer);
		var tr = dojo.create("tr", {}, advVillageTable);
		var statsTd = dojo.create("td", {}, tr);
		
		statsTd.innerHTML = "Happiness: 100%";
		
		var controlsTd = dojo.create("td", {}, tr);
		
		for (var i = 0; i < this.advModeButtons.length; i++){
			this.advModeButtons[i].render(controlsTd);
		}
	},
	
	update: function(){
		this.inherited(arguments);
		
		if (this.tdTop){
			this.tdTop.innerHTML = "Free kittens: " + this.game.village.getFreeKittens();
		}
	},
	
	sendHunterSquad: function(){
		this.game.msg("You hunters returned with some trophies");
		
		var furs = this.game.resPool.get("furs");
		furs.value += this.rand(5);
		
		if (this.rand(100) > 60){
			var ivory = this.game.resPool.get("ivory");
			ivory.value += this.rand(3);
		}
		
		if (this.rand(100) > 95){
			var unicorns = this.game.resPool.get("unicorns");
			unicorns.value += 1;
		}
	},
	
	
	rand: function(ratio){
		return (Math.floor(Math.random()*ratio));
	}
});

