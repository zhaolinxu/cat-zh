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
		description: "+0.06 catpower per tick",
		
		modifiers:{
			"manpower" : 0.06
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
	},{
		name: "priest",
		title: "Priest",
		description: "+0.0015 faith per tick",
		
		modifiers:{
			"faith" : 0.0015
		},
		value: 0,
		unlocked: false
	},{
		name: "geologist",
		title: "Geologist",
		description: "+0.015 coal per tick",
		
		modifiers:{
			"coal" : 0.015
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
		this.sim = new com.nuclearunicorn.game.village.KittenSim(game);
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

		this.sim.maxKittens = this.maxKittens;
		this.sim.update(kittensPerTick);


		var catnipPerTick = this.game.getResourcePerTick("catnip");
		
		var catnipVal = this.game.resPool.get("catnip").value;
		var resDiff = catnipVal + catnipPerTick;
		
		if (resDiff < 0){

			var starvedKittens = Math.abs(resDiff.toFixed());
			if (starvedKittens > 0){
				this.sim.killKittens(starvedKittens);
				this.game.msg(starvedKittens + " kittens starved to death");
				
				this.game.deadKittens += starvedKittens;
			}
		}
		
		if (this.getFreeKittens() < 0 ){
			this.clearJobs();	//sorry, just a stupid solution for this problem
		}
				
		//calculate production and happiness modifers	
		this.updateHappines();
		
		var showFastHunt = (this.game.resPool.get("manpower").value >= 100);
		$("#fastHuntContainer").css("visibility", showFastHunt ? "visible" : "hidden");
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
	 * 
	 * This method returns positive villager production that can be multiplied by building bonuses
	 */ 
	getResProduction: function(){
		if (!this.resourceProduction){
			this.updateResourceProduction();	//lazy synch
		}
		var res = dojo.clone(this.resourceProduction);
		
		//special hack for ironwill mode
		var zebras = this.game.resPool.get("zebras");
		if (zebras.value > 0){
			res["manpower"] = res["manpower"] ? res["manpower"] : 0;
			res["manpower"] += 0.15 * zebras.value;	//zebras are a bit stronger than kittens
		}
		
		return res;
	},
	
	/**
	 * Get camulative resource production per village population
	 */ 
	updateResourceProduction: function(){
		
		var productionRatio = 0.25 + 
			this.game.workshop.getEffect("skillMultiplier");	//fast access snippet for tweaking job profficiency
		
		var res = {
		};

		for (i in this.sim.kittens){
			var kitten = this.sim.kittens[i]
			if(kitten.job) {
				var job = this.getJob(kitten.job);
				if(job) {
					for (jobResMod in job.modifiers){
						// Is there a shorter path to this function? I could go from gamePage but I'm trying to keep the style consistent.
						//TODO: move to the village manager
						var mod = this.game.villageTab.getValueModifierPerSkill(kitten.skills[kitten.job]);
						
						var diff = job.modifiers[jobResMod] + job.modifiers[jobResMod] * ((mod-1) * productionRatio);
						
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
			}
		}
		this.resourceProduction = res;
	},
	
	/**
	 * Same but with negative values
	 */
	
	getResConsumption: function(){
		var kittens = this.getKittens();

		var res = {
			"catnip" : this.catnipPerKitten * kittens,
			"furs" : -0.01 * kittens,
			"ivory" : -0.007 * kittens,
			"spice" : -0.001 * kittens
		};
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

		this.updateResourceProduction();
	},
	
	/** Calculates a total happines where result is a value of [0..1] **/
	updateHappines: function(){
		var happiness = 100;
		
		var unhappiness = ( this.getKittens()-5 ) * 2;
		var unhappiness = unhappiness + unhappiness * this.game.bld.getEffect("unhappinessRatio", true);	//limit ratio by 1.0 by 75% hyperbolic falloff
		
		if (this.getKittens() > 5){
			happiness -= unhappiness;	//every kitten takes 2% of production rate if >5
		}
		
		var happinessBonus = this.game.bld.getEffect("happiness");
		happiness += happinessBonus;
		
		//boost happiness/production by 10% for every uncommon/rare resource
		var resources = this.game.resPool.resources;
		for (var i = 0; i < resources.length; i++){
			if (resources[i].type != "common" && resources[i].value > 0){
				happiness += 10;
			}
		}
		
		if (this.game.calendar.festivalDays){
			happiness += 30;
		}
		
		var karma = this.game.resPool.get("karma");
		happiness += karma.value;	//+1% to the production per karma point
		
		
		if (happiness < 25){
			happiness = 25;
		}
		
		this.happiness = happiness/100;
	},
	
	sendHuntersInternal: function(){
		var huntingRes = {
			furs: 0,
			ivory: 0,
			isUnicorn: false
		};

		var furs = this.game.resPool.get("furs");
		
		var hunterRatio = this.game.workshop.getEffect("hunterRatio");
		huntingRes.furs = this.rand(65) + this.rand(65 * hunterRatio);
		furs.value += huntingRes.furs;
		
		if (this.rand(100) > ( 55 - 2 * hunterRatio)){
			var ivory = this.game.resPool.get("ivory");
			huntingRes.ivory = this.rand(40) + this.rand(40 * hunterRatio);
			
			ivory.value += huntingRes.ivory;
		}
		
		if (this.rand(100) > 95){
			var unicorns = this.game.resPool.get("unicorns");
			unicorns.value += 1;
			huntingRes.isUnicorn = true;
		}
		
		return huntingRes;
	},

	sendHunters: function(){
		var huntingRes = this.sendHuntersInternal();
		if (huntingRes.isUnicorn){
			this.game.msg("You got a unicorn!", "important");
		}
		var msg = "Your hunters have returned. +" + huntingRes.furs + " furs";
		if (huntingRes.ivory){
			msg += ", +" + huntingRes.ivory + " ivory";
		}
		this.game.msg( msg );
	},
	
	huntAll: function(){
		var mpower = this.game.resPool.get("manpower");
		
		var squads = Math.floor(mpower.value / 100);
		if (squads < 1){
			return;
		}
		mpower.value -= squads*100;
		
		var totalYield = {
			furs: 0,
			ivory: 0,
			unicorns: 0
		};
		
		for( var i = 0; i< squads; i++ ){
			var squadYield = this.sendHuntersInternal();
			totalYield.furs += squadYield.furs;
			totalYield.ivory += squadYield.ivory;
			if (squadYield.isUnicorn) { totalYield.unicorns++; }
		}
		if (totalYield.unicorns){
			if(totalYield.unicorns == 1){
				this.game.msg("You got a unicorn!");
			} else {
				this.game.msg("You got " + totalYield.unicorns + " unicorns!", "important");
			}
		}
		var msg = "Your hunters have returned";
		if (squads > 1) {
			msg += " from " + squads + " hunts";
		}
		msg += ". +" + this.game.getDisplayValueExt(totalYield.furs) + " furs";
		if (totalYield.ivory){
			msg += ", +" + this.game.getDisplayValueExt(totalYield.ivory) + " ivory";
		}
		this.game.msg( msg );
		
	},
	
	rand: function(val){
		return this.game.rand(val);
	}
});

/**
 * Kitten container
 */ 
dojo.declare("com.nuclearunicorn.game.village.Kitten", null, {
	
	names: ["Angel", "Charlie", "Mittens", "Oreo", "Lily", "Ellie", "Amber", "Molly", "Jasper",
			"Oscar", "Theo", "Maddie", "Cassie", "Timber", "Meeko", "Micha" ],
	surnames: ["Smoke", "Dust", "Chalk", "Fur", "Clay", "Paws", "Tails", "Sand", "Scratch"],
	
	name: "Undefined",
	surname: "Undefined",
	
	job: null,
	
	age: 0,
	
	skills: null,
	
	constructor: function(){
		this.name = this.names[this.rand(this.names.length)];
		this.surname = this.surnames[this.rand(this.surnames.length)];
		
		this.age = 16 + this.rand(30);
		
		this.skills = {};
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
	
	game: null,
	
	/**
	 * If 1 or more, will increment kitten pool
	 */ 
	nextKittenProgress : 0,	
	
	maxKittens: 0,
	
	constructor: function(game){
		this.kittens = [];
		this.game = game;
	},
	
	update: function(kittensPerTick){
		this.nextKittenProgress += kittensPerTick;
		if (this.nextKittenProgress >= 1){
			this.nextKittenProgress = 0;
			
			if (this.kittens.length < this.maxKittens){
				this.addKitten();
			}
		}
		
		var learnRatio = this.game.bld.getEffect("learnRatio");
		var skillRatio = 0.01 + 0.01 * learnRatio;
		
		for (var i = 0; i< this.kittens.length; i++){
			var kitten = this.kittens[i];
			if (kitten.job){
				if (!kitten.skills[kitten.job]){
					kitten.skills[kitten.job] = 0;
				}
				kitten.skills[kitten.job] += skillRatio;
				
				for (skill in kitten.skills){
					if (skill != kitten.job && kitten.skills[skill] > 0 ){
						kitten.skills[skill] -= 0.001;
					}
				}
			}
		}
			
	},
	
	addKitten: function(amount){
		if (!amount) { amount = 1 };
		for (var i = 0; i < amount; i ++){
			var kitten = new com.nuclearunicorn.game.village.Kitten();
			this.kittens.push(kitten);
		}
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
	
	getSkillsSorted: function(skillsDict){
		var skills = [];
		for (skill in skillsDict){
			skills.push({ "name": skill, "val": skillsDict[skill]});
		}
		skills.sort(function(a, b){return b.val-a.val});
		return skills;
	},
	
	/**
	 * Assign a job to a free kitten with highest skill level in this job or any free if none
	 */ 
	assignJob: function(job){
		var freeKittens = [];
		for (var i = 0; i< this.kittens.length; i++){
			var kitten = this.kittens[i];
			if (!kitten.job){
				var val = kitten.skills[job] ? kitten.skills[job] : 0;
				freeKittens.push({"id": i, "val": val});
			}
		}
		freeKittens.sort(function(a, b){return b.val-a.val});

		if (freeKittens.length){
			this.kittens[freeKittens[0].id].job = job;
			
			this.game.village.updateResourceProduction();	//out of synch, refresh instantly
		}else{
			console.error("failed to assign job", job);
		}
	},
	
	/**
	 * Same, but removes the least proficient worker
	 */ 
	removeJob: function(job){
		var jobKittens = [];
        for (var i = 0; i< this.kittens.length; i++){
            var kitten = this.kittens[i];
            if (kitten.job == job){
                var val = kitten.skills[job] ? kitten.skills[job] : 0;
                jobKittens.push({"id": i, "val": val});
            }
        }
        jobKittens.sort(function(a, b){return a.val-b.val});

        if (jobKittens.length){
            this.kittens[jobKittens[0].id].job = null;

            this.game.village.updateResourceProduction();   //out of synch, refresh instantly
        }else{
            console.error("failed to remove job", job);
        }
	},
	
	clearJobs: function(){
		for (var i = 0; i< this.kittens.length; i++){
			this.kittens[i].job = null;
		}
	}

});

dojo.declare("com.nuclearunicorn.game.ui.JobButton", com.nuclearunicorn.game.ui.ButtonModern, {
	
	jobName: null,
	
	unassignHref: null,
	
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
	
	renderLinks: function(){
		this.unassignHref = this.addLink("[&ndash;]", 
			function(){
				var job = this.getJob();
				
				if (!job.value){
					return;
				}
				
				job.value--;
				this.game.village.sim.removeJob(job.name);
				this.update();
			}, true	//use | break
		);
	},
	
	update: function(){
		this.inherited(arguments);

		var job = this.getJob();
		if (job && this.buttonContent && this.unassignHref.link	/* mystic bug */){
			dojo.setStyle(this.unassignHref.link, "display", job.value > 0  ? "" : "none");
		}
	},
	
	getTooltipHTML: function(btn){
		var job = this.getJob();
		
		var tooltip = dojo.create("div", { style: { 
			width: "280px",
			minHeight:"50px"
		}}, null);
		
		dojo.create("div", { 
			innerHTML: this.getName(), 
			style: {
				textAlign: "center",
				width: "100%",
				borderBottom: "1px solid gray",
				paddingBottom: "4px"
		}}, tooltip);
		
		//----------- description -------
		/*
		dojo.create("div", { 
			innerHTML: job.description, 
			style: {
				textAlign: "center",
				width: "100%",
				borderBottom: "1px solid gray",
				paddingBottom: "4px",
				fontSize: "15px",
				color: "gray"
		}}, tooltip);*/
		
		//---------- effects-------------
		
		dojo.create("div", { 
			innerHTML: "", 
			style: {
				textAlign: "center",
				width: "100%",
				paddingBottom: "4px",
				marginBottom: "8px"
		}}, tooltip);
		
		//-----------------------------------------

		for (effectName in job.modifiers){
			var nameSpan = dojo.create("div", { innerHTML: effectName + ": +" + this.game.getDisplayValueExt(job.modifiers[effectName]) + " ( +" + 
				this.game.getDisplayValueExt(job.modifiers[effectName] * job.value) + " total)", 
				style: { 
					float: "left",
					fontSize: "14px",
					color: "gray",
					clear: "both"
			}}, tooltip );
		}
		
		dojo.create("div", { style: { minHeight:"20px"} }, tooltip);
		
		//-------------- flavor stuff -------------
		
		dojo.create("div", { 
			innerHTML: job.flavour || "flavor text",
			className: "flavor",
			style: {
				position: "absolute",
				bottom: "2px",
				right: "4px",
				fontSize: "12px",
				fontStyle: "italic"
		}}, tooltip);
			
		return tooltip.outerHTML;
	}
});

/**
 * Village tab to manage jobs
 */ 

dojo.declare("com.nuclearunicorn.game.ui.tab.Village", com.nuclearunicorn.game.ui.tab, {
	
	tdTop: null,
	
	advModeButtons : null,
	
	huntBtn: null,
	
	festivalBtn: null,
	
	constructor: function(tabName, game){
		this.game = game;

		this.advModeButtons = [];
	},
	
	createJobBtn: function(job, game){
		var btn = new com.nuclearunicorn.game.ui.JobButton({
			name : job.title,
			handler: dojo.partial(function(job, game){
				
				var freeKittens = game.village.getFreeKittens();
				var jobRef = game.village.getJob(job.name); 	//probably will fix missing ref on loading

				if ( freeKittens > 0 ){
					game.village.sim.assignJob(job.name);
					jobRef.value += 1;
				}
			}, job, game),
			job: job.name
		}, game);
		return btn;
	},
	
	render: function(tabContainer){
		
		var self = this;
		
		
		this.advModeButtons = [];
		this.buttons = [];
		
		this.jobsPanel = new com.nuclearunicorn.game.ui.Panel("Jobs");
		if (this.game.ironWill && !this.game.village.getKittens()){
			this.jobsPanel.setVisible(false);
		}
		
		var jobsPanelContainer = this.jobsPanel.render(tabContainer);
		
		var table = dojo.create("table", { className: "table",
			style:{
			width: "100%"
		}}, jobsPanelContainer);
		
		
		//-----------------------------------------------------------
		for (var i = 0; i < this.game.village.jobs.length; i++){
			var job = this.game.village.jobs[i];
			
			var btn = this.createJobBtn(job, this.game);
			
			btn.updateEnabled();
			btn.updateVisible();
			
			btn.render(jobsPanelContainer);
			this.addButton(btn);
		}
		
		var btn = new com.nuclearunicorn.game.ui.ButtonModern({ name:"Clear",
			description: "Clear all jobs",
			handler: dojo.hitch(this, function(){
				if (confirm("Are you sure?")){
					this.game.village.clearJobs();
				}
			})
		});
		btn.render(jobsPanelContainer);
		this.addButton(btn);
		//------------------------------------------------------------
		
		var tr = dojo.create("tr", null, table);
		
		var tdTop = dojo.create("td", { colspan: 2 },
			dojo.create("tr", null, table));

		this.tdTop = tdTop;
		
		
		var tr = dojo.create("tr", null, table)
		
		var tdLeft = dojo.create("td", null, tr);	
		var tdRight = dojo.create("td", null, tr);

		//----------------- happiness and things ----------------------
		
		this.statisticsPanel = new com.nuclearunicorn.game.ui.Panel("Resources");
		if (this.game.village.getKittens() < 5 && this.game.resPool.get("zebras").value == 0){
			this.statisticsPanel.setVisible(false);
		}
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
		
		//hunt
		
		var huntBtn = new com.nuclearunicorn.game.ui.ButtonModern({
				name: "Send hunters",
				description: "Send hunters to the forest",
				handler: dojo.hitch(this, function(){
					this.sendHunterSquad();
				}),
				prices: [{ name : "manpower", val: 100 }]
		}, this.game);
		huntBtn.render(controlsTd);
		this.huntBtn = huntBtn;
		
		var festivalBtn = new com.nuclearunicorn.game.ui.ButtonModern({
				name: "Hold festival",
				description: "Hold a cultural festival to make your kittens happy. (+30% to the happiness for a year)",
				handler: dojo.hitch(this, function(){
					this.holdFestival();
				}),
				prices: [
					{ name : "manpower", val: 1500 },
					{ name : "culture", val: 5000 },
					{ name : "parchment", val: 2500 }
				]
		}, this.game);
		
		if (!this.game.science.get("drama").researched){
			festivalBtn.setVisible(false);
		}
		
		festivalBtn.render(controlsTd);
		this.festivalBtn = festivalBtn;
		
		//--------------- bureaucracy ------------------
		this.bureaucracyPanel = new com.nuclearunicorn.game.ui.Panel("Census");
		this.bureaucracyPanel.collapsed = true;
		if (!this.game.science.get("civil").researched){
			this.bureaucracyPanel.setVisible(false);
		}
		
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
		
		var festivalDays = this.game.calendar.festivalDays;
		if (festivalDays){
			this.happinessStats.innerHTML += " ("+festivalDays+" days)";
		}
		
		if (this.statisticsPanel){
			this.statisticsPanel.setVisible(
				this.game.village.getKittens() >= 5 || this.game.resPool.get("zebras").value > 0
			);
		}
		if (this.huntBtn){
			this.huntBtn.update();
		}
		if (this.festivalBtn){
			this.festivalBtn.update();
		}
		
		//update kitten stats
		
		if (this.bureaucracyPanel){
			var hasCivilService = this.game.science.get("civil").researched;
			this.bureaucracyPanel.setVisible(hasCivilService);
		}
		if (this.game.ironWill && !this.game.village.getKittens()){
			this.jobsPanel.setVisible(false);
		}else{
			this.jobsPanel.setVisible(true);
		}
		
		
		this.updateCensus();
		
		//-------- update tab title -------
		var freeKittens = this.game.village.getFreeKittens();
		if (freeKittens){
			this.tabName = this.getVillageTitle() + " (" + freeKittens + ")";
		} else {
			this.tabName = this.getVillageTitle();
		}
	},
	
	getVillageTitle: function(){
		var kittens = this.game.village.getKittens();
		if (kittens > 300){
			return "Imperium";
		} else if (kittens > 200){
			return "Metropolis";
		} if (kittens > 150){
			return "City";
		} else if (kittens > 100){
			return "Town";
		} else if (kittens > 50){
			return "Small town";
		} else if (kittens > 30){
			return "Settlement";
		} else if (kittens > 15){
			return "Village";
		} else if (kittens > 0){
			return "Small Village";
		} else {
			return "Outpost";
		}
	},
	
	updateCensus: function(){
		
		if (!this.bureaucracyPanel || this.bureaucracyPanel.collapsed && !this.bureaucracyPanel.visible){
			return;
		}
		
		if (this.bureaucracyPanelContainer){
			dojo.empty(this.bureaucracyPanelContainer);
					
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
				
				/*
				 * //good stuff but regeneration is to fast
				 * if (kitten.job){
					var unassignHref = dojo.create("a", { href: "#", innerHTML: "[-]", style: { float: "right"}}, div);
					dojo.connect(unassignHref, "onclick", this, dojo.partial(function(sim, i, event){ 
						event.preventDefault(); 
						sim.kittens[i].job = null; 
					}, this.game.village.sim, i));
				}*/
				
				var skillsArr = this.getSkillsSorted(kitten.skills);

				for (var j = 0 ; j < skillsArr.length; j++){
					if (j > 1){
						break;
					}
					
					var exp = skillsArr[j].val;
					
					var nextExp = this.getNextSkillExp(exp);
					var prevExp = this.getPrevSkillExp(exp);
					
					var expDiff = exp - prevExp;
					var expRequried = nextExp - prevExp;
					
					var expPercent = (expDiff / expRequried) * 100;
					
					div.innerHTML += "<br>" + "<span title='" + exp.toFixed(2) + 
						"'>" +this.skillToText(exp) + " (" + expPercent.toFixed()  + "%)" + "</span> " + skillsArr[j].name;
				}
			}
		}
	},
	
	/**
	 * TODO: potential performance impact
	 */ 
	getSkillsSorted: function(skillsDict){
		return this.game.village.sim.getSkillsSorted(skillsDict);
	},
	
	skillToText: function(value){
		if (value < 100 ){
			return "Dabbling";
		} else if (value < 500){
			return "Novice";
		} else if (value < 1200){
			return "Adequate";
		} else if (value < 2500){
			return "Competent";
		} else if (value < 5000){
			return "Skilled";
		} else if (value < 9000){
			return "Proficient";
		} else {
			return "Master";
		}
	},
	
	getNextSkillExp: function(value){
		if (value < 100){
			return 100;
		} else if (value < 500){
			return 500;
		} else if (value < 2500){
			return 2500;
		} else if (value < 5000){
			return 5000;
		} else if (value < 9000){
			return 9000
		} else if (value < 20000){
			return 20000;
		} else {
			return Number.MAX_VALUE;
		}
	},
	
	getPrevSkillExp: function(value){
		if (value > 9000){
			return 9000;
		} else if (value > 5000){
			return 5000;
		} else if (value > 2500){
			return 2500;
		} else if (value > 1200){
			return 1200;
		} else if (value > 500){
			return 500;
		} else if (value > 100){
			return 100;
		} else {
			return 0;
		}
	},
	
	getValueModifierPerSkill: function(value){
		if (value < 100 ){
			return 1.0;
		} else if (value < 500){
			return 1.05;	//5%
		} else if (value < 1200){
			return 1.10;
		} else if (value < 2500){
			return 1.18;
		} else if (value < 5000){
			return 1.30;
		} else if (value < 9000){
			return 1.50;
		} else {
			return 1.75;
		}
	},
	
	sendHunterSquad: function(){
		this.game.village.sendHunters();
	},
	
	holdFestival: function(){
		this.game.calendar.festivalDays = 400;	//nope, they don't stack
		this.game.msg("The cultural festival has started");
		//TODO: some fun message like Molly Chalk is making a play 'blah blah'
	},
	
	rand: function(ratio){
		return (Math.floor(Math.random()*ratio));
	}
});

