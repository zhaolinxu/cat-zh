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
		name: "hunter",
		title: "Hunter",
		description: "+0.05 manpower per tick",
		
		modifiers:{
			"manpower" : 0.05
		},
		value: 0,
		unlocked: false
	},{
		name: "miner",
		title: "Miner",
		description: "+0.05 mineral per tick",
		
		modifiers:{
			"minerals" : 0.05
		},
		value: 0,
		unlocked: false
	}],
	
	//resource modifiers per tick
	resourceModifiers: {
		"catnip" : 0
	},

	game: null,
	
	sim: null,
	
	constructor: function(game){
		this.game = game;
		this.sim = new com.nuclearunicorn.game.village.KittenSim();
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
		
		//calculate kittens
		
		var kittensPerTick = this.kittensPerTick + this.kittensPerTickBase;
		/*this.kittens += kittensPerTick;
		
		if (this.kittens > this.maxKittens){
			this.kittens = this.maxKittens;
		}*/
		this.sim.maxKittens = this.maxKittens;
		this.sim.update(kittensPerTick);

		var modifiers = this.getResourceModifers();
		
		var catnipVal = this.game.resPool.get("catnip").value;
		var resDiff = catnipVal + modifiers["catnip"];
		
		if (resDiff < 0){
			//console.log("kittens to die:", Math.abs(resDiff.toFixed()));
			
			var starvedKittens = Math.abs(resDiff.toFixed());
			if (starvedKittens > 0){
				//this.kittens -= starvedKittens;
				this.sim.killKittens(starvedKittens);
				this.game.msg(starvedKittens + " kittens starved to death");
			}
		}
		
		if (this.getFreeKittens() < 0 ){
			this.clearJobs();	//sorry, just stupid solution for this problem
		}
		
				
		//calculate production and happiness modifers	
		this.updateHappines();
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
		this.sim.clearJobs();
	},
	
	/**
	 * kittens can't be float value, it's an internal representation
	 * to handle cyclic process like birth ratio / death ration
	 */ 
	getKittens: function(){
		//return Math.round(this.kittens);	
		return this.sim.getKittens();
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
				var diff = job.modifiers[jobResMod] * job.value;
				if (diff > 0 ){
					 diff  = diff * this.happiness;	//alter positive resource production from jobs
				}
				
				if (!res[jobResMod]){
					res[jobResMod] = diff;
				}else{
					res[jobResMod] += diff;
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
			kittens : this.sim.kittens,
			maxKittens: this.maxKittens,
			jobs: this.jobs
		};
	},
	
	load: function(saveData){
		if (saveData.village){
			var kittens = saveData.village.kittens;
			//quick legacy hack, remove in future
			if (!kittens.length) {
				kittens = [];
			}
			this.sim.kittens  = kittens;
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
	},
	
	/** Calculates a total happines where result is a value of [0..1] **/
	updateHappines: function(){
		var happiness = 100;
		if (this.getKittens() > 5){
			happiness -= ( this.getKittens()-5 ) * 2;	//every kitten takes 2% of production rate if >5
		}
		
		//boost happiness/production by 10% for every uncommon/rare resource
		var resources = this.game.resPool.resources;
		for (var i = 0; i < resources.length; i++){
			if (resources[i].type != "common" && resources[i].value > 0){
				happiness += 10;
			}
		}
		
		
		if (happiness < 0.25){
			happiness = 0.25;
		}
		
		this.happiness = happiness/100;
	}
});

/**
 * Kitten container
 */ 
dojo.declare("com.nuclearunicorn.game.village.Kitten", null, {
	
	names: ["Angel", "Charlie", "Mittens", "Oreo", "Lily", "Ellie", "Amber", "Molly"],
	surnames: ["Smoke", "Dust", "Chalk", "Fur", "Clay", "Paws", "Tails", "Sand"],
	
	name: "Undefined",
	surname: "Undefined",
	
	job: null,
	
	age: 0,
	
	constructor: function(){
		this.name = this.names[this.rand(this.names.length)];
		this.surname = this.surnames[this.rand(this.surnames.length)];
		
		this.age = 16 + this.rand(30);
	},
	
	rand: function(ratio){
		return (Math.floor(Math.random()*ratio));
	}
});

/**
 * Detailed kitten simulation
 */ 
dojo.declare("com.nuclearunicorn.game.village.KittenSim", null, {
	
	kittens: null,
	
	/**
	 * If 1 or more, will increment kitten pool
	 */ 
	nextKittenProgress : 0,	
	
	maxKittens: 0,
	
	constructor: function(){
		this.kittens = [];
	},
	
	update: function(kittensPerTick){
		this.nextKittenProgress += kittensPerTick;
		if (this.nextKittenProgress >= 1){
			this.nextKittenProgress = 0;
			
			if (this.kittens.length < this.maxKittens){
				this.addKitten();
			}
		}
	},
	
	addKitten: function(){
		var kitten = new com.nuclearunicorn.game.village.Kitten();
		this.kittens.push(kitten);
	},
	
	//just truncate array, I am too lazy to write splice
	killKittens: function(amount){
		this.kittens.length -= amount;
		if (this.kittens.length < 0){
			this.kittens.length = 0;
		}
	},
	
	getKittens: function(){
		return this.kittens.length;
	},
	
	rand: function(ratio){
		return (Math.floor(Math.random()*ratio));
	},
	
	assignJob: function(job){
		for (var i = 0; i< this.kittens.length; i++){
			var kitten = this.kittens[i];
			
			if (!kitten.job){
				kitten.job = job;
				return;
			}
		}
	},
	
	removeJob: function(job){
		for (var i = 0; i< this.kittens.length; i++){
			var kitten = this.kittens[i];
			
			if (kitten.job == job){
				kitten.job = null;
			}
		}
	},
	
	clearJobs: function(){
		for (var i = 0; i< this.kittens.length; i++){
			this.kittens[i].job = null;
		}
	}

});

dojo.declare("com.nuclearunicorn.game.ui.JobButton", com.nuclearunicorn.game.ui.button, {
	
	jobName: null,
	
	sellHref: null,
	
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
	},
	
	update: function(){
		this.inherited(arguments);
		
		var self = this;
		
		var job = this.getJob();
		if (job && job.value){
			if (!this.sellHref){
				this.sellHref = dojo.create("a", { href: "#", innerHTML: "-", style:{
						paddingLeft: "4px",
						float: "right",
						cursor: "default"
					}}, null);
					
				dojo.connect(this.sellHref, "onclick", this, function(event){
					event.stopPropagation();
					
					job.value--;
					self.game.village.sim.removeJob(job.name);
					this.update();
				});
			} else {
				if (this.buttonContent) {	//idk what causes this, to be investigated later
					dojo.place(this.sellHref, this.buttonContent);
				}
			}
		}
	},
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
				description: "Send hunters to the forest",
				handler: function(){
					//do nothing
					self.sendHunterSquad();
				},
				prices: [{ name : "manpower", val: 100 }]
		}, this.game);
		this.advModeButtons.push(huntBtn);
		this.hutnBtn = huntBtn;
		
	},
	
	createJobBtn: function(job, game){
		var btn = new com.nuclearunicorn.game.ui.JobButton({
			name : job.title,
			handler: dojo.partial(function(job){
				
				var freeKittens = game.village.getFreeKittens();
				var jobRef = game.village.getJob(job.name); 	//probably will fix missing ref on loading

				if ( freeKittens > 0 ){
					game.village.sim.assignJob(job.name);
					jobRef.value += 1;
				}
			}, job),
			job: job.name
		}, game);
		return btn;
	},
	
	render: function(tabContainer){
		
		this.jobsPanel = new com.nuclearunicorn.game.ui.Panel("Jobs");
		var jobsPanelContainer = this.jobsPanel.render(tabContainer);
		
		var table = dojo.create("table", { className: "table",
			style:{
			width: "100%"
		}}, jobsPanelContainer);
		
		var tr = dojo.create("tr", null, table);
		
		var tdTop = dojo.create("td", { colspan: 2 },
			dojo.create("tr", null, table));

		this.tdTop = tdTop;
		
		
		var tr = dojo.create("tr", null, table)
		
		var tdLeft = dojo.create("td", null, tr);	
		var tdRight = dojo.create("td", null, tr);
				
		for (var i = 0; i<this.buttons.length; i++){
			var button = this.buttons[i];
			button.render(jobsPanelContainer);
		}
		
		//----------------- happiness and things ----------------------
		
		this.statisticsPanel = new com.nuclearunicorn.game.ui.Panel("Resources");
		var statPanelContainer = this.statisticsPanel.render(tabContainer);
		
		var advVillageTable = dojo.create("table", { style: {
				width: "100%"
			}}, statPanelContainer);
			
		this.advVillageTable = advVillageTable;	
			
			
		var tr = dojo.create("tr", {}, advVillageTable);
		var statsTd = dojo.create("td", {}, tr);

		statsTd.title = "Happiness will boost your workers production. \n Rare resources will increse this value while overpopulation will reduce it";
		
		this.happinessStats = statsTd;
		
		var controlsTd = dojo.create("td", {}, tr);
		
		for (var i = 0; i < this.advModeButtons.length; i++){
			this.advModeButtons[i].render(controlsTd);
		}
		
		//--------------- bureaucracy ------------------
		this.bureaucracyPanel = new com.nuclearunicorn.game.ui.Panel("Census");
		this.bureaucracyPanelContainer = this.bureaucracyPanel.render(tabContainer);
		
	},
	
	update: function(){
		this.inherited(arguments);
		
		if (this.tdTop){
			this.tdTop.innerHTML = "Free kittens: " + this.game.village.getFreeKittens();
		}
		
		if (this.happinessStats){	
			var happiness = this.game.village.happiness * 100;
			this.happinessStats.innerHTML = "Happiness: " + happiness.toFixed() + "%";
		}
		
		if (this.statisticsPanel){
			this.statisticsPanel.setVisible(
				this.game.village.getKittens() >= 5
			);
		}
		this.hutnBtn.update();
		
		//update kitten stats
		
		if (this.bureaucracyPanel){
			var hasCivilService = this.game.science.get("civil").researched;
			this.bureaucracyPanel.setVisible(hasCivilService);
		}
		this.updateCensus();
	},
	
	updateCensus: function(){
		if (this.bureaucracyPanelContainer){
			this.bureaucracyPanelContainer.innerHTML = "";
					
			var sim = this.game.village.sim;
			
			for (var i = 0; i <sim.kittens.length; i++){
				var kitten = sim.kittens[i];
				
				var job = "";
				if (kitten.job){
					job = " - " + kitten.job;
				}
				
				var div = dojo.create("div", {
					style: {
						border: "1px solid gray",
						marginBottom: "5px",
						padding: "5px"
					},
					innerHTML: "[:3] " + kitten.name + " " + kitten.surname + job + "<br>" +
					"age: " + kitten.age
				}, this.bureaucracyPanelContainer );
			}
		}
	},
	
	sendHunterSquad: function(){
		this.game.msg("You hunters returned with some trophies");
		
		var furs = this.game.resPool.get("furs");
		furs.value += this.rand(50);
		
		if (this.rand(100) > 60){
			var ivory = this.game.resPool.get("ivory");
			ivory.value += this.rand(30);
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

