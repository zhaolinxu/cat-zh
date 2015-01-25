dojo.declare("classes.managers.VillageManager", com.nuclearunicorn.core.TabManager, {

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

	leader: null,	//a reference to a leader kitten for fast access, must be restored on load,
	senators: null,

	getRankExp: function(rank){
		return 500 * Math.pow(1.75, rank);
	},

	getEffect: function(effectName){
		//TODO: calculate leader/senate effects there
	},

	constructor: function(game){
		this.game = game;
		this.sim = new com.nuclearunicorn.game.village.KittenSim(game);

		this.senators = [];
	},

	getJob: function(jobName){
		for (var i = this.jobs.length - 1; i >= 0; i--) {
			if (this.jobs[i].name == jobName){
				return this.jobs[i];
			}
		}
		throw "Failed to get job for job name '"+jobName+"'";
	},

	assignJob: function(job){
		var freeKittens = this.getFreeKittens();
		var jobRef = this.getJob(job.name); 	//probably will fix missing ref on loading

		if ( freeKittens > 0 ){
			this.sim.assignJob(job.name);
			jobRef.value += 1;
		}
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
				this.game.msg(starvedKittens + starvedKittens === 1 ? " kitten " : " kittens " + "starved to death");

				this.game.deadKittens += starvedKittens;
			}
		}

		if (this.getFreeKittens() < 0 ){
			this.clearJobs();	//sorry, just a stupid solution for this problem
		}

		//calculate production and happiness modifiers
		this.updateHappines();

		//--------------------------------------------------------------------	
		if (!this.fastHuntContainer){
			this.fastHuntContainer = $("#fastHuntContainer")[0];
		}

		var showFastHunt = (this.game.resPool.get("manpower").value >= 100);
		//blazing fast vanilla toggle
		if (showFastHunt){
			if (this.fastHuntContainer.style.visibility == "hidden"){
				this.fastHuntContainer.style.visibility = "visible";
			}
		} else {
			if (this.fastHuntContainer.style.visibility == "visible"){
				this.fastHuntContainer.style.visibility = "hidden";
			}
		}
		
		//$("#fastHuntContainer").css("visibility", showFastHunt ? "visible" : "hidden");
	},

	getFreeKittens: function(){
		var total = 0;
		for (var i = this.jobs.length - 1; i >= 0; i--) {
			total += this.jobs[i].value;
		}

		return this.getKittens() - total;
	},

	clearJobs: function(){
		for (var i = this.jobs.length - 1; i >= 0; i--) {
			this.jobs[i].value = 0;
		}
		this.sim.clearJobs();
	},

	getKittens: function(){
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

		//special hack for iron will mode
		var zebras = this.game.resPool.get("zebras");
		if (zebras.value > 0){
			res["manpower"] = res["manpower"] ? res["manpower"] : 0;
			res["manpower"] += 0.15;	//zebras are a bit stronger than kittens
		}
		if (zebras.value > 1){
			 res["manpower"] += (zebras.value-1) * 0.05;
			 res["manpower"] = this.game.bld.getHyperbolicEffect(res["manpower"], 2);
		}

		return res;
	},

	/**
	 * Get cumulative resource production per village population
	 */
	updateResourceProduction: function(){

		var productionRatio = 0.25 +
			this.game.workshop.getEffect("skillMultiplier");	//fast access snippet for tweaking job proficiency

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

		this.leader = null;
		this.senators = [];

		if (saveData.village){
			var kittens = saveData.village.kittens;
			//quick legacy hack, remove in future
			if (!kittens.length) {
				kittens = [];
			}

			this.sim.kittens = [];

			for (var i = kittens.length - 1; i >= 0; i--) {
				var kitten = kittens[i];

				var newKitten = new com.nuclearunicorn.game.village.Kitten();
				newKitten.load(kitten);

				if (newKitten.isLeader){
					this.game.village.leader = newKitten;
				}
				if (newKitten.isSenator){
					this.game.village.senators.unshift(newKitten);
				}

				this.sim.kittens.unshift(newKitten);
			}

			//this.sim.kittens  = kittens;
			this.maxKittens  = saveData.village.maxKittens;

			/*if (saveData.village.jobs.length){
				this.jobs = saveData.village.jobs;
			}*/
			if (saveData.village.jobs.length){
				for (var i = saveData.village.jobs.length - 1; i >= 0; i--) {
					var savedJob = saveData.village.jobs[i];

					var job = this.getJob(savedJob.name);
					job.unlocked = savedJob.unlocked;
					job.value = savedJob.value;
				}
			}
		}

		this.updateResourceProduction();
	},

	/** Calculates a total happiness where result is a value of [0..1] **/
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
		for (var i = resources.length - 1; i >= 0; i--) {
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
			gold: 0,
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


		if (this.game.ironWill && this.game.workshop.get("goldOre").researched){
			if (this.rand(100) > 75){
				var gold = this.game.resPool.get("gold");
				huntingRes.gold = this.rand(5) + this.rand(10 * hunterRatio/2);

				gold.value += huntingRes.gold;
			}
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
		if (huntingRes.gold){
			msg += ", +" + huntingRes.gold + " gold";
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
			gold: 0,
			unicorns: 0
		};

		for (var i = squads - 1; i >= 0; i--) {
			var squadYield = this.sendHuntersInternal();
			totalYield.furs += squadYield.furs;
			totalYield.ivory += squadYield.ivory;
			totalYield.gold += squadYield.gold;
			if (squadYield.isUnicorn) {
				totalYield.unicorns++;
			}
		}
		if (totalYield.unicorns){
			this.game.msg("You got " + totalYield.unicorns === 1 ? "a unicorn!" : + totalYield.unicorns + " unicorns!");
		}
		var msg = "Your hunters have returned";
		if (squads > 1) {
			msg += " from " + squads + " hunts";
		}
		msg += ". +" + this.game.getDisplayValueExt(totalYield.furs) + " furs";
		if (totalYield.ivory){
			msg += ", +" + this.game.getDisplayValueExt(totalYield.ivory) + " ivory";
		}
		if (totalYield.gold){
			msg += ", +" + this.game.getDisplayValueExt(totalYield.gold) + " gold";
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
			"Oscar", "Theo", "Maddie", "Cassie", "Timber", "Meeko", "Micha", "Tami", "Plato" ],
	surnames: ["Smoke", "Dust", "Chalk", "Fur", "Clay", "Paws", "Tails", "Sand", "Scratch", "Berry", "Shadow"],

	traits: [{
		name: "scientist",
		title: "Scientist",//Grr... someone emaciated the evil Scientinst first...
	},{
		name: "manager",
		title: "Manager"
	},{
		name: "engineer",
		title: "Engineer"
	},{
		name: "merchant",
		title: "Merchant"
	},{
		name: "none",
		title: "None"
	}],

	name: "Undefined",
	surname: "Undefined",

	job: null,
	trait: null,

	age: 0,

	skills: null,
	exp: 0,
	rank: 0,

	isLeader: false,
	isSenator: false,

	constructor: function(){
		this.name = this.names[this.rand(this.names.length)];
		this.surname = this.surnames[this.rand(this.surnames.length)];
		this.trait = this.traits[this.rand(this.traits.length)];

		this.age = 16 + this.rand(30);

		this.skills = {};
	},

	getTrait: function(name){
		for (var i = this.traits - 1; i >= 0; i--) {
			if (this.traits[i].name === name){
				return this.trait[i];
			}
		}
	},

	rand: function(ratio){
		return (Math.floor(Math.random()*ratio));
	},

	load: function(data){
		this.name = 	data.name;
		this.surname =  data.surname;
		this.age = 		data.age;
		this.skills = 	data.skills;
		this.exp = 		data.exp || 0;
		this.trait = 	data.trait;
		this.job = 		data.job;
		this.rank =		data.rank || 0;
		this.isLeader = data.isLeader || false;
		this.isSenator = data.isSenator || false;
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

		for (var i = this.kittens.length - 1; i >= 0; i--) {
			var kitten = this.kittens[i];

			//special hack that migrates kittens to the global exp
			if (!kitten.exp){
				kitten.exp = 0;
				for (skill in kitten.skills){
					kitten.exp += kitten.skills[skill];
				}
			}
			//hack
			if (kitten.rank === undefined){
				kitten.rank = 0;
			}
			//hack
			if (!kitten.trait){
				kitten.trait = kitten.traits[kitten.rand(kitten.traits.length)];
			}

			if (kitten.job){
				if (!kitten.skills[kitten.job]){
					kitten.skills[kitten.job] = 0;
				}
				kitten.skills[kitten.job] += skillRatio;
				kitten.exp += skillRatio;

				for (skill in kitten.skills){
					if (skill != kitten.job && kitten.skills[skill] > 0 ){
						kitten.skills[skill] -= 0.001;
						kitten.exp -= 0.001;
					}
				}
			}
		}

	},

	addKitten: function(amount){
		if (!amount) {
			amount = 1;
		}
		for (var i = amount - 1; i >= 0; i--) {
			var kitten = new com.nuclearunicorn.game.village.Kitten();
			this.kittens.push(kitten);
		}
	},

	//just truncate array, I am too lazy to write splice
	killKittens: function(amount){
		if (amount > this.kittens.length) {
			amount = this.kittens.length;
		}
		this.kittens.length -= amount;
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
		for (var i = this.kittens.length - 1; i >= 0; i--) {
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
		for (var i = this.kittens.length - 1; i >= 0; i--) {
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
		for (var i = this.kittens.length - 1; i >= 0; i--) {
			this.kittens[i].job = null;
		}
	}

});

dojo.declare("com.nuclearunicorn.game.ui.JobButton", com.nuclearunicorn.game.ui.ButtonModern, {

	jobName: null,

	unassignHref: null,
	plus25: null,
	minus25: null,

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

	unassignJobs: function(amt){
		var job = this.getJob();

		if (job.value < amt){
			amt = job.value;
		}

		job.value -= amt;
		for (var i = amt - 1; i >= 0; i--) {
			this.game.village.sim.removeJob(job.name);
		}
		this.update();
	},

	assignJobs: function(amt){
		var job = this.getJob();
		for (var i = amt - 1; i >= 0; i--) {
			this.game.village.assignJob(job);
		}
		this.update();
	},

	renderLinks: function(){

		this.unassignLinks = this.addLinkList([
		  {
				id: "unassign",
				title: "[&ndash;]",
				handler: function(){
					this.unassignJobs(1);
				}
		   },{
				id: "unassign5",
				title: "[-5]",
				handler: function(){
					this.unassignJobs(5);
				}
		   },{
				id: "unassign25",
				title: "[-25]",
				handler: function(){
					this.unassignJobs(25);
				}
		   },{
				id: "unassignAll",
				title: "[-all]",
				handler: function(){
					var job = this.getJob();
					this.unassignJobs(job.value);
				}
		   }]
		);

		this.assignLinks = this.addLinkList([
			{
				id: "assign",
				title: "[+]",
				handler: function(){
					this.assignJobs(1);
				}
		   },{
				id: "assign5",
				title: "[+5]",
				handler: function(){
					this.assignJobs(5);
				}
		   },{
				id: "assign25",
				title: "[+25]",
				handler: function(){
					this.assignJobs(25);
				}
		   },{
				id: "assignall",
				title: "[+all]",
				handler: function(){
					var freeKittens = this.game.village.getFreeKittens();
					this.assignJobs(freeKittens);
				}
		   }]
		);
	},

	update: function(){
		//do nothing :V

		this.inherited(arguments);

		/*
		var freeKittens = this.game.village.getFreeKittens();

		var job = this.getJob();
		if (job && this.buttonContent && this.unassignLinks.unassign.link){
			dojo.setStyle(this.unassignLinks.unassign.link, "display", job.value > 0  ? "" : "none");
		}
		if (job && this.buttonContent && this.assignLinks.assign.link){
			dojo.setStyle(this.assignLinks.assign.link, "display", freeKittens > 0  ? "" : "none");
		}

		if (job && this.buttonContent && this.plus25.link){
			dojo.setStyle(this.plus25.link, "display", freeKittens >= 25  ? "" : "none");
		}

		if (job && this.buttonContent && this.minus25.link){
			dojo.setStyle(this.minus25.link, "display", job.value >= 25  ? "" : "none");
		}*/
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

		//---------- effects-------------

		this.renderEffects(tooltip, job.modifiers, true);	//hide title


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

dojo.declare("com.nuclearunicorn.game.ui.village.Census", null, {

	game: null,
	records: null,
	container: null,

	filterJob: null,

	constructor: function(game){
		this.game = game;
		this.records = [];
	},

	render: function(container){
		this.records = [];
		this.container = container;

		dojo.empty(container);
		
		//--------------------------------------------------------------------------------------
		this.governmentDiv = null;
		this.renderGovernment(container);
		//--------------------------------------------
		var navbar = dojo.create("div", { style: {
			height: "24px"
		}}, container);

		//--------------- job filter -----------------
		
		//console.log("filter job:", this.filterJob);

		var jobSelect = dojo.create("select", { style: {float: "right" }}, navbar);

		dojo.create("option", { value: "", innerHTML: "All jobs"}, jobSelect);
		for (var i = 0; i < this.game.village.jobs.length; i++){
			var job = this.game.village.jobs[i];
			if (job.unlocked){
				dojo.create("option", { value: job.name, innerHTML: job.title,
					selected: ( job.name == this.filterJob)
				}, jobSelect);
			}
		}

		dojo.connect(jobSelect, "onchange", this, function(event){
			var job = event.target.value;
			this.filterJob = job;
			this.render(this.container);
		});

		var kittensLimit = 0;

		var sim = this.game.village.sim;
		for (var i = sim.kittens.length - 1; i >= 0 && kittensLimit < 10; i--) {

			var kitten = sim.kittens[i];

			if (this.filterJob && kitten.job != this.filterJob){
				continue;
			}

			kittensLimit++;

			var div = dojo.create("div", {
				style: {
					border: "1px solid gray",
					marginBottom: "5px",
					padding: "5px",
					minHeight: "80px"
				},
				innerHTML: ""
			}, container );

			//--------- content -----------

			var content = dojo.create("div", {
				style: {
					display: "inline-block"
				}
			}, div);

			//--------- links -----------

			var linksDiv = dojo.create("div", {
				style: {
					display: "inline-block",
					float: "right"
				}
			}, div);

			var unassignHref = dojo.create("a", {
				href: "#", innerHTML: "Unassign Job",
				style: {
					display: kitten.job ? "block" : "none"
				}
			}, linksDiv);

			var leaderHref = dojo.create("a", {
				href: "#", innerHTML: "Make Leader",
				style: {
					display: kitten.isLeader || kitten.isSenator ? "none" : "block"
				}
			}, linksDiv);

			var senatorHref = dojo.create("a", {
				href: "#", innerHTML: "Make Senator",
				style: {
					display: kitten.isLeader || kitten.isSenator ? "none" : "block"
				}
			}, linksDiv);

			var expToPromote = this.game.village.getRankExp(kitten.rank+1);
			var promoteHref = dojo.create("a", {
				href: "#", innerHTML: "Promote (" + this.game.getDisplayValueExt(expToPromote.toFixed()) + " exp)",
				style: {
					display: kitten.exp < expToPromote ? "none" : "block"
				}
			}, linksDiv);

			dojo.connect(unassignHref, "onclick", this, dojo.partial(function(game, i, event){
				event.preventDefault();

				var job = game.village.sim.kittens[i].job;
				game.village.getJob(job).value--;

				game.village.sim.kittens[i].job = null;
				game.village.updateResourceProduction();
				
				game.village.render();

			}, this.game, i));

			dojo.connect(leaderHref, "onclick", this, dojo.partial(function(census, i, event){
				event.preventDefault();
				var game = census.game;

				var kitten = game.village.sim.kittens[i];
				if (game.village.leader){
					game.village.leader.isLeader = false;
				}
				kitten.isLeader = true;
				game.village.leader = kitten;

				census.renderGovernment(census.container);
				census.update();
			}, this, i));

			dojo.connect(promoteHref, "onclick", this, dojo.partial(function(census, i, event){
				event.preventDefault();
				var game = census.game;

				var kitten = game.village.sim.kittens[i];
				if (kitten.exp >= game.village.getRankExp(kitten.rank+1)){
					kitten.exp -= game.village.getRankExp(kitten.rank+1);
					kitten.rank++;
				}
				census.renderGovernment(census.container);
				census.update();

			}, this, i));

			//rankExp

			dojo.connect(senatorHref, "onclick", this, dojo.partial(function(census, i, event){
				event.preventDefault();
				
				var game = census.game;

				var kitten = game.village.sim.kittens[i];
				if (game.village.senators.length < 5){
					
					for (i in game.village.senators){
						if (game.village.senators[i] === kitten){
							return;
						}
					}
					
					game.village.senators.push(kitten);
					kitten.isSenator = true;
				}

				census.renderGovernment(census.container);
				census.update();

			}, this, i));

			this.records.push({
				content: content,
				kitten: kitten,
				unassignHref: unassignHref,
				senatorHref: senatorHref
			});
		}
	},
	
	renderGovernment: function(container){
		var governmentDiv = this.governmentDiv;
		if (!this.governmentDiv){
			governmentDiv = dojo.create("div", { style: {
				paddingBottom: "10px"
			}}, container);
			this.governmentDiv = governmentDiv;
		} else {
			dojo.empty(governmentDiv);
		}
		

		var leaderName = "N/A";
		var leader = this.game.village.leader;
		if (leader){
			var title = leader.trait.title == "None" ? "No trait :(" : leader.trait.title + " rank " + leader.rank;
			leaderName = leader.name + " " + leader.surname + " (" + title +")";
		}
		//TODO: promote leader link

		dojo.create("div", { innerHTML: "<strong>Leader:</strong> " + leaderName}, governmentDiv);

		var councilDiv = dojo.create("div", null, governmentDiv);
		var councilList = dojo.create("div", { innerHTML: "<strong>Council:</strong>"}, councilDiv);

		for (var i = this.game.village.senators.length - 1; i >= 0; i--) {
			var senator = this.game.village.senators[i];

			var title = senator.trait.title == "None" ? "No trait" : senator.trait.title + " rank " + senator.rank;
			var span = dojo.create("span", {
				innerHTML : senator.name + " " + senator.surname + " (" + title +")",
				style: {
					display : "block",
					paddingLeft: "15px"
				}
			}, councilList);

			var fireHref = dojo.create("a", {
				href: "#",
				innerHTML: "[-]",
				style: {
					paddingLeft : "5px"
			}}, span);

			dojo.connect(fireHref, "onclick", this, dojo.partial(function(game, i){
				console.log(i);
				game.village.senators[i].isSenator = false;
				game.village.senators.splice(i,1);
				game.render();
			}, this.game, i));
			
		}	//senators

	},

	update: function(){
		
		//TODO: update senators
		
		for (var i = 0; i < this.records.length; i++){
			var record = this.records[i];
			var kitten = record.kitten;

			//unassign link
			var job = "";
			if (kitten.job){
				job = " - " + kitten.job;
				dojo.setStyle(record.unassignHref, "display", "block");
			} else {
				dojo.setStyle(record.unassignHref, "display", "none");
			}
			
			//make senator link
			if (this.game.village.senators.length == 5 || record.kitten.isSenator){
				dojo.setStyle(record.senatorHref, "display", "none");
			} else {
				dojo.setStyle(record.senatorHref, "display", "block");
			}

			var traitTitle = kitten.trait.title;
			var trait = (kitten.trait != "none") ? " - " + traitTitle : "";
			var rank = kitten.rank ? " rank " + kitten.rank : "";

			record.content.innerHTML = "[:3] " + kitten.name + " " + kitten.surname + job  +
				trait + rank + "<br>" +
				"age: " + kitten.age + ", exp: " + this.game.getDisplayValueExt(kitten.exp) ;

			//--------------- skills ----------------
			var skillsArr = this.game.village.sim.getSkillsSorted(kitten.skills);

			for (var j = 0 ; j < skillsArr.length; j++){
				if (j > 1){
					break;
				}

				var exp = skillsArr[j].val;

				var nextExp = this.game.villageTab.getNextSkillExp(exp);	//UGLY
				var prevExp = this.game.villageTab.getPrevSkillExp(exp);	//UGLY

				var expDiff = exp - prevExp;
				var expRequried = nextExp - prevExp;

				var expPercent = (expDiff / expRequried) * 100;

				record.content.innerHTML += "<br>" + "<span title='" + exp.toFixed(2) +
					"'>" +this.game.villageTab.skillToText(exp) + " (" + expPercent.toFixed()  + "%)" + "</span> " + skillsArr[j].name;
			}
		}
	}

});

dojo.declare("com.nuclearunicorn.game.ui.CensusPanel", com.nuclearunicorn.game.ui.Panel, {
	census: null,

	constructor: function(name, village, game){
		this.census = new com.nuclearunicorn.game.ui.village.Census(game);
	},

	render: function(container){
		var panelContainer = this.inherited(arguments);
		this.census.render(panelContainer);
	},

	update: function(){
		this.census.update();
	}
});
//com.nuclearunicorn.game.ui.village.Census
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
				game.village.assignJob(job);
			}, job, game),
			job: job.name
		}, game);
		return btn;
	},

	render: function(tabContainer){

		var self = this;


		this.advModeButtons = [];
		this.buttons = [];

		this.jobsPanel = new com.nuclearunicorn.game.ui.Panel("Jobs", this.game.village);
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

		this.statisticsPanel = new com.nuclearunicorn.game.ui.Panel("Management", this.game.village);
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

		statsTd.title = "Happiness will boost your workers' production. \n Rare resources will increase this value whilst over-population will reduce it";

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
		huntBtn.setVisible(this.game.science.get("archery").researched);
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
		this.censusPanel = new com.nuclearunicorn.game.ui.CensusPanel("Census", this.game.village, this.game);
		//this.censusPanel.collapsed = true;
		if (!this.game.science.get("civil").researched){
			this.censusPanel.setVisible(false);
		}

		this.censusPanelContainer = this.censusPanel.render(tabContainer);
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
			this.huntBtn.setVisible(this.game.science.get("archery").researched);
			this.huntBtn.update();
		}
		if (this.festivalBtn){
			this.festivalBtn.update();
		}

		//update kitten stats

		if (this.censusPanel){
			var hasCivilService = this.game.science.get("civil").researched;
			this.censusPanel.setVisible(hasCivilService);

			this.censusPanel.update();
		}
		if (this.game.ironWill && !this.game.village.getKittens()){
			this.jobsPanel.setVisible(false);
		}else{
			this.jobsPanel.setVisible(true);
		}


		//this.updateCensus();

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
		switch (true) {
		case kittens > 500:
			return "Hegemony";
		case kittens > 400:
			return "Dominion";
		case kittens > 300:
			return "Imperium";
		case kittens > 250:
			return "Empire";
		case kittens > 200:
			return "Metropolis";
		case kittens > 150:
			return "City";
		case kittens > 100:
			return "Town";
		case kittens > 50:
			return "Small town";
		case kittens > 30:
			return "Settlement";
		case kittens > 15:
			return "Village";
		case kittens > 0:
			return "Small Village";
		default:
			return "Outpost";
		}
	},

	skillToText: function(value){
		switch (true) {
		case value < 100:
			return "Dabbling";
		case value < 500:
			return "Novice";
		case value < 1200:
			return "Adequate";
		case value < 2500:
			return "Competent";
		case value < 5000:
			return "Skilled";
		case value < 9000:
			return "Proficient";
		default:
			return "Master";
		}
	},

	getNextSkillExp: function(value){
		switch (true) {
		case value < 100:
			return 100;
		case value < 500:
			return 500;
		case value < 2500:
			return 2500;
		case value < 5000:
			return 5000;
		case value < 9000:
			return 9000
		case value < 20000:
			return 20000;
		default:
			return Number.MAX_VALUE;
		}
	},

	getPrevSkillExp: function(value){
		switch (true) {
		case value > 9000:
			return 9000;
		case value > 5000:
			return 5000;
		case value > 2500:
			return 2500;
		case value > 1200:
			return 1200;
		case value > 500:
			return 500;
		case value > 100:
			return 100;
		default:
			return 0;
		}
	},

	getValueModifierPerSkill: function(value){
		switch (true) {
		case value < 100:
			return 1.0;
		case value < 500:
			return 1.05;	//5%
		case value < 1200:
			return 1.10;
		case value < 2500:
			return 1.18;
		case value < 5000:
			return 1.30;
		case value < 9000:
			return 1.50;
		default:
			return 1.75;
		}
	},

	sendHunterSquad: function(){
		this.game.village.sendHunters();
	},

	holdFestival: function(){
		if (this.game.prestige.getPerk("carnivals").researched){
			this.game.calendar.festivalDays += 400;
		} else {
			this.game.calendar.festivalDays = 400;
		}
		this.game.msg("The cultural festival has started");
		//TODO: some fun message like Molly Chalk is making a play 'blah blah'
	},

	rand: function(ratio){
		return (Math.floor(Math.random()*ratio));
	}
});
