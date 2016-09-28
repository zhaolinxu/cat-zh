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
		description: "+0.018 wood per tick",

		modifiers:{
			"wood" : 0.018
		},
		value: 0,
		unlocked: true,
		defaultUnlocked: true,
        flavor: "Must. Not. Scratch."
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
		description: "+0.04 science per tick",

		modifiers:{},
		calculateEffects: function(self, game){
			var modifiers = {
				"science" : 0.04
			};

			if (game.workshop.get("astrophysicists").researched){
				modifiers["starchart"] = 0.0001;	//i'm not entirely sure if it is too little or too much
			}

			self.modifiers = modifiers;
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
		unlocked: false,
        flavor: "We're so cute we purr at our prey until it dies"
	},{
		name: "miner",
		title: "Miner",
		description: "+0.05 mineral per tick",

		modifiers:{
			"minerals" : 0.05
		},
		value: 0,
		unlocked: false,
        flavor: "I don't really understand how can I hold a pick with my paws"
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

		modifiers:{},
		calculateEffects: function(self, game){
			var coal = 0.015;
			var gold = 0;

			if (game.workshop.get("miningDrill").researched){
				coal += 0.010;
				gold += 0.0005;
			}
			if (game.workshop.get("unobtainiumDrill").researched){
				coal += 0.015;
				gold += 0.0005;
			}
			if (game.workshop.get("geodesy").researched){
				coal += 0.0075;
				gold += 0.0008;
			} else {
				// Drills don't add gold before geodesy.
				gold = 0;
			}

			var modifiers = {
				"coal" : coal
			};
			if (gold > 0){
				modifiers["gold"] = gold;
			}

			self.modifiers = modifiers;
		},
		value: 0,
		unlocked: false
	},{
		name: "engineer",
		title: "Engineers",
		description: "Engineers can operate factories to automate resource production",
		modifiers:{
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

	getEffectLeader: function(trait, defaultObject){
		if(this.leader) {
			var leaderTrait = this.leader.trait["name"];
			if (leaderTrait == trait) {
				// Modify the defautlObject depends on trait
				switch (true) {
					case trait == "engineer": // Crafting bonus
						defaultObject = 0.05;
						break;
					case trait == "merchant": // Trading bonus
						defaultObject = 0.030;
						break;
					case trait == "manager": // Hunting bonus
						defaultObject = 0.5;
						break;
					case trait == "scientist": // Science prices bonus
						for (var i = 0; i < defaultObject.length; i++) {
							if (defaultObject[i].name == "science") {
								defaultObject[i].val *= 0.99;
							}
						}
						break;
					case trait == "wise": // Religion bonus
						for (var i = 0; i < defaultObject.length; i++) {
							if (defaultObject[i].name == "faith") {
								defaultObject[i].val = defaultObject[i].val * 0.9;
							}
							if (defaultObject[i].name == "gold") {
								defaultObject[i].val = defaultObject[i].val * 0.9;
							}
						}
						break;
				}

			}
		}
		return defaultObject;

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

	getJobLimit: function(jobName) {
		if (jobName == "engineer"){
			return this.game.bld.get("factory").val;
		} else {
			return 100000;
		}
	},

	assignJob: function(job){
		var freeKittens = this.getFreeKittens();
		var jobRef = this.getJob(job.name); 	//probably will fix missing ref on loading

		if ( freeKittens > 0 && this.getWorkerKittens(job.name) < this.getJobLimit(job.name) ) {
			this.sim.assignJob(job.name);
			jobRef.value += 1;
		}
	},

	update: function(){

		//calculate kittens
		var kittensPerTick = this.kittensPerTick +
			this.kittensPerTickBase * (1 + this.game.getEffect("kittenGrowthRatio"));

		//Allow festivals to double birth rate.
		if (this.game.calendar.festivalDays > 0) {
			kittensPerTick = kittensPerTick * 2;
		}

		this.sim.maxKittens = this.maxKittens;
		this.sim.update(kittensPerTick);


		var catnipPerTick = this.game.getResourcePerTick("catnip", true);

		var catnipVal = this.game.resPool.get("catnip").value;
		var resDiff = catnipVal + catnipPerTick;

		if (resDiff < 0 && this.sim.getKittens() > 0){

			var starvedKittens = Math.abs(Math.round(resDiff));
			if (starvedKittens > 0){
				starvedKittens = this.sim.killKittens(starvedKittens);
				this.game.msg(starvedKittens + ( starvedKittens === 1 ? " kitten " : " kittens " ) + "starved to death");
				this.game.deadKittens += starvedKittens;
			}
		}

		//check job limits
		for (var i = 0; i < this.jobs.length; i++) {
			var jobName = this.jobs[i].name;
			while (this.getWorkerKittens(jobName) > this.getJobLimit(jobName)) {
				this.sim.removeJob(jobName);
				this.jobs[i].value -= 1;
			}
		}

		if (this.getFreeKittens() < 0 ){
			this.clearJobs();	//sorry, just a stupid solution for this problem
		}

		//calculate production and happiness modifiers
		this.updateHappines();

        //XXX FW7: add some messeging system? Get rid of direct UI update calls completely?
        //this.game.ui.updateFastHunt();
	},

	getFreeKittens: function(){
		var total = 0;
		for (var i = this.jobs.length - 1; i >= 0; i--) {
			total += this.jobs[i].value;
		}

		return this.getKittens() - total;
	},

	getWorkerKittens: function(jobName) {
		var engineer = 0;
		for (var i = this.jobs.length - 1; i >= 0; i--) {
			if (this.jobs[i].name == jobName) {
				engineer = this.jobs[i].value;
			}
		}

		return engineer;
	},

	getFreeEngineer: function() {
		var engineerNoFree = 0;
		for (var i = this.game.workshop.crafts.length -1; i >= 0; i--) {
			engineerNoFree += this.game.workshop.crafts[i].value;
		}

		return this.getWorkerKittens("engineer") - engineerNoFree;
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
			 res["manpower"] += this.game.getHyperbolicEffect((zebras.value-1) * 0.05, 2);
		}

		return res;
	},

	/**
	 * Get cumulative resource production per village population
	 */
	updateResourceProduction: function(){

		var productionRatio = (1 + this.game.getEffect("skillMultiplier")) / 4;

		var res = {
		};

		for (var i in this.sim.kittens){
			var kitten = this.sim.kittens[i];
			if(kitten.job) {
				var job = this.getJob(kitten.job);
				if(job) {
					for (var jobResMod in job.modifiers){
						// Is there a shorter path to this function? I could go from gamePage but I'm trying to keep the style consistent.
						//TODO: move to the village manager
						var mod = this.game.villageTab.getValueModifierPerSkill(kitten.skills[kitten.job] || 0);

						var diff = job.modifiers[jobResMod] + job.modifiers[jobResMod] * ((mod-1) * productionRatio);

						if (diff > 0 ){
							if (kitten.isLeader){
								diff *= this.getLeaderBonus(kitten.rank);
							}
							diff *= this.happiness;	//alter positive resource production from jobs
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

	getLeaderBonus: function(rank){
		return rank == 0 ? 1.0 : (rank + 1) / 1.4;
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

	resetState: function(){
		this.maxKittens = 0;
		this.sim.maxKittens = 0;
		this.leader = null;
		this.senators = [];
		this.sim.kittens = [];

		for (var i = 0; i < this.jobs.length; i++){
			var job = this.jobs[i];
			job.value = 0;
			job.unlocked = job.defaultUnlocked || false;
		}
	},

	save: function(saveData){
		saveData.village = {
			kittens : this.sim.kittens,
			maxKittens: this.maxKittens,
			jobs: this.filterMetadata(this.jobs, ["name", "unlocked", "value"])
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

			if (saveData.village.jobs){
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
		var unhappiness = unhappiness + unhappiness * this.game.getEffect("unhappinessRatio");	//limit ratio by 1.0 by 75% hyperbolic falloff

		if (this.getKittens() > 5){
			happiness -= unhappiness;	//every kitten takes 2% of production rate if >5
		}

		var happinessBonus = this.game.getEffect("happiness");
		happiness += happinessBonus;

		//boost happiness/production by 10% for every uncommon/rare resource
		var resources = this.game.resPool.resources;
		for (var i = resources.length - 1; i >= 0; i--) {
			if (resources[i].type != "common" && resources[i].value > 0){
				happiness += 10;
				if(resources[i].name=="elderBox"&&this.game.resPool.get("wrappingPaper").value){
					happiness-=10; // Present Boxes and Wrapping Paper do not stack.
				}
			}
		}

		if (this.game.calendar.festivalDays){
			happiness += 30;
		}

		var karma = this.game.resPool.get("karma");
		happiness += karma.value;	//+1% to the production per karma point

		var overpopulation = this.getKittens() - this.maxKittens;
		if (overpopulation > 0){
			happiness -= overpopulation * 2;	//overpopulation penalty
		}

		if (happiness < 25){
			happiness = 25;
		}

		this.happiness = happiness/100;
	},

	sendHuntersInternal: function(huntingRes){
		if (!huntingRes){
			huntingRes = {
				furs: 0,
				ivory: 0,
				gold: 0,
				unicorns: 0
			};
		}

		var hunterRatio = this.game.getEffect("hunterRatio") + this.game.village.getEffectLeader("manager", 0);
		var furs = this.rand(80) + this.rand(65 * hunterRatio);
		var fursGain = this.game.resPool.addResEvent("furs", furs);
		huntingRes.furs += fursGain;

		if (this.rand(100) > ( 55 - 2 * hunterRatio)){
			var ivory = this.rand(50) + this.rand(40 * hunterRatio);
			var ivoryGain = this.game.resPool.addResEvent("ivory", ivory);
			huntingRes.ivory += ivoryGain;
		}

		if (this.rand(100) < 5){
			var unicorns = this.game.resPool.addResEvent("unicorns", 1);
			huntingRes.unicorns += unicorns;
		}

		if (this.game.ironWill && this.game.workshop.get("goldOre").researched){
			if (this.rand(100) < 25){
				var gold = this.rand(5) + this.rand(10 * hunterRatio/2);
				var goldGain = this.game.resPool.addResEvent("gold", gold);
				huntingRes.gold += goldGain;
			}
		}

		return huntingRes;
	},

	sendHunters: function(){
		var huntingRes = this.sendHuntersInternal();
		this.printHuntYield(huntingRes, 1);
	},

	huntAll: function(){
		var mpower = this.game.resPool.get("manpower");

		var squads = Math.floor(mpower.value / 100);

		this.huntMultiple(squads);
	},

	huntMultiple: function (squads){
		var mpower = this.game.resPool.get("manpower");
		squads = Math.min(squads, Math.floor(mpower.value / 100));

		if (squads < 1){
			return;
		}
		this.game.resPool.addResEvent("manpower", -(squads * 100));

		var totalYield = null;

		for (var i = squads - 1; i >= 0; i--) {
			totalYield = this.sendHuntersInternal(totalYield);
		}
		this.printHuntYield(totalYield, squads);
	},

	printHuntYield: function (totalYield, squads){
		if (totalYield.unicorns > 0){
			this.game.msg("You got " + (totalYield.unicorns === 1 ? "a unicorn!" : + totalYield.unicorns + " unicorns!"), "important", "hunt");
		}
		var msg = "Your hunters have returned";
		if (squads > 1) {
			msg += " from " + squads + " hunts";
		}
		msg += ". +" + this.game.getDisplayValueExt(totalYield.furs) + " furs";
		if (totalYield.ivory > 0){
			msg += ", +" + this.game.getDisplayValueExt(totalYield.ivory) + " ivory";
		}
		if (totalYield.gold > 0){
			msg += ", +" + this.game.getDisplayValueExt(totalYield.gold) + " gold";
		}
		this.game.msg( msg, null, "hunt" );
	},

	rand: function(val){
		return this.game.rand(val);
	},

	/**
	 * Optimize distribution of jobs dependings on experiencies
	 */
	optimizeJobs: function() {

		var situationJobs = {};
		for (var i = this.game.village.sim.kittens.length - 1; i >= 0; i--) {
			var job = this.game.village.sim.kittens[i].job;
			if (job) {
				if (situationJobs[job] === undefined) {
					situationJobs[job] = 1;
				} else {
					situationJobs[job] = situationJobs[job] + 1;
				}
			}
		}

		if (Object.getOwnPropertyNames(situationJobs).length !== 0) {

			this.game.village.clearJobs();

			// Optimisation share between each jobs by assigning 1 kitten per job until all jobs are reassigned
			while (Object.getOwnPropertyNames(situationJobs).length !== 0) {
				for (var job in situationJobs) {
					this.assignJob(this.getJob(job));
					if (situationJobs[job] == 1) {
						delete situationJobs[job];
					} else {
						situationJobs[job] = situationJobs[job] - 1;
					}
				}
			}

			this.game.villageTab.updateTab();
			this.game.village.updateResourceProduction();
			this.game.updateResources();
		}
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
		title: "Scientist",
		unlocked: true
	},{
		name: "manager",
		title: "Manager",
		unlocked: true
	},{
		name: "engineer",
		title: "Engineer",
		unlocked: true
	},{
		name: "merchant",
		title: "Merchant",
		unlocked: true
	},{
		name: "wise",
		title: "Philosopher",
		unlocked: false
	},{
		name: "metallurgist",
		title: "Metallurgist",
		unlocked: false
	},{
		name: "chemist",
		title: "Chemist",
		unlocked: false
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

		this.exp = 0;
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

		if (this.kittens.length < this.maxKittens) { //Don't do maths if Maxed.
			this.nextKittenProgress += kittensPerTick;
			if (this.nextKittenProgress >= 1) {
				var kittensToAdd = Math.floor(this.nextKittenProgress);
				this.nextKittenProgress = 0;

				for (var iCat = 0; iCat < kittensToAdd; iCat++) {
					if (this.kittens.length < this.maxKittens) {
						this.addKitten();
					}
				}


			}
		}


		var learnRatio = this.game.getEffect("learnRatio");
		var skillRatio = 0.01 + 0.01 * learnRatio;

		for (var i = this.kittens.length - 1; i >= 0; i--) {
			var kitten = this.kittens[i];

			//special hack that migrates kittens to the global exp
			if (!kitten.exp){
				kitten.exp = 0;
				for (var skill in kitten.skills){
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

			if (kitten.job && this.game.calendar.day >= 0){
				if (!kitten.skills[kitten.job]){
					kitten.skills[kitten.job] = 0;
				}
				kitten.skills[kitten.job] += skillRatio;
				kitten.exp += skillRatio;

				for (var skill in kitten.skills){
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
		this.game.villageTab.updateTab();

        if (this.game.kongregate){
            this.game.kongregate.stats.submit("kittens", this.kittens.length);
        }

        this.game.stats.getStat("totalKittens").val += amount;
	},

	killKittens: function(amount){

		if (amount > this.kittens.length) {
			amount = this.kittens.length;
		}

        this.game.stats.getStat("kittensDead").val += amount;

		var killed = this.kittens.splice(this.kittens.length - amount, amount);
		var village = this.game.village;

		//remove dead kittens from government
		for (var i = killed.length - 1; i >= 0; i--){
			var kitten = killed[i];
			if (kitten === village.leader){
				village.leader = null;
			}
			if (kitten.isSenator){
				var k = village.senators.indexOf(kitten);
				if (k > -1){
					village.senators.splice(k,1);
				}
			}
		}
		this.game.villageTab.updateTab();
		this.game.village.updateResourceProduction();
		this.game.updateResources();
		return killed.length;
	},

	getKittens: function(){
		return this.kittens.length;
	},

	rand: function(ratio){
		return (Math.floor(Math.random()*ratio));
	},

	getSkillsSorted: function(skillsDict){
		var skills = [];
		for (var skill in skillsDict){
			skills.push({ "name": skill, "val": skillsDict[skill]});
		}
		skills.sort(function(a, b){return b.val-a.val;});
		return skills;
	},

	getSkillsSortedWithJob: function(skillsDict, job){
		var skills = [];
		for (var skill in skillsDict){
			if (skill != job) {
				skills.push({ "name": skill, "val": skillsDict[skill]});
			}
		}
		skills.sort(function(a, b){return b.val-a.val;});
		skills.unshift({ "name": job, "val": skillsDict[job]});
		return skills;
	},

	/**
	 * Assign a job to a free kitten :
	 * • With leader and register tech buy : a free kitten with Highest skill level in this job or any free if none
	 * • Else : the first free kitten
	 */
	assignJob: function(job){
		var freeKittens = [];
		for (var i = this.kittens.length - 1; i >= 0; i--) {
			var kitten = this.kittens[i];
			if (!kitten.job){
				if (!this.game.workshop.get("register").researched || this.game.village.leader == undefined) {
					freeKittens.push({"id": i});
					continue;
				}
				var val = kitten.skills[job] ? kitten.skills[job] : 0;
				freeKittens.push({"id": i, "val": val});
			}
		}
		freeKittens.sort(function(a, b){return b.val-a.val;});

		if (freeKittens.length){
			this.kittens[freeKittens[0].id].job = job;

			this.game.village.updateResourceProduction();	//out of synch, refresh instantly
		}else{
			console.error("failed to assign job", job);
		}
	},

	/**
	 * Same, but removes the least proficient worker or the first one
	 */
	removeJob: function(job){
		var jobKittens = [];
		for (var i = this.kittens.length - 1; i >= 0; i--) {
			var kitten = this.kittens[i];
            if (kitten.job == job){
				if (!this.game.workshop.get("register").researched || this.game.village.leader == undefined) {
					jobKittens.push({"id": i});
					continue;
				}
                var val = kitten.skills[job] ? kitten.skills[job] : 0;
                jobKittens.push({"id": i, "val": val});
            }
		}
        jobKittens.sort(function(a, b){return a.val-b.val;});

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
	tooltipName: true,

	getJob: function(){
		return this.game.village.getJob(this.jobName);
	},

	constructor: function(opts, game){
		this.jobName = opts.job;
	},

	updateEnabled: function(){
		this.inherited(arguments);
		if (this.game.village.getFreeKittens() == 0 || this.game.village.getJobLimit(this.jobName) <= this.game.village.getWorkerKittens(this.jobName)){
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

	unassignCraftJobs: function(job) {
		if (job.name == "engineer" && this.game.village.getFreeEngineer() == 0) {
			for (var i = 0; i < this.game.workshop.crafts.length; i++) {
				if (this.game.workshop.crafts[i].value > 0) {
					console.log(this.game.workshop.crafts[i]);
					this.game.workshop.crafts[i].value -= 1;
					break;
				}
			}
		}
	},

	unassignJobs: function(amt){
		var job = this.getJob();

		if (job.value < amt){
			amt = job.value;
		}

		for (var i = amt - 1; i >= 0; i--) {
			this.unassignCraftJobs(job);
			job.value -= 1;
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

	getEffects: function() {
		var job = this.getJob();
		return job.modifiers;
	},
	getFlavor: function() {
		var job = this.getJob();
		return job.flavour;
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
		this.sortKittensByExp(sim.kittens);

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

			var leaderHref = dojo.create("a", {
				href: "#", innerHTML: "",
				style: {
					float: "right"
				},
				title: "Make a leader"
			}, linksDiv);

			var unassignHref = dojo.create("a", {
				href: "#", innerHTML: "Unassign&nbsp;Job",
				style: {
					display: kitten.job ? "block" : "none"
				}
			}, linksDiv);

			var senatorHref = dojo.create("a", {
				href: "#", innerHTML: "Make Senator",
				style: {
					display: kitten.isLeader || kitten.isSenator ? "none" : "block"
				}
			}, linksDiv);

			/*var expToPromote = this.game.village.getRankExp(kitten.rank+1);
			var promoteHref = dojo.create("a", {
				href: "#", innerHTML: "Promote (" + this.game.getDisplayValueExt(expToPromote.toFixed()) + " exp)",
				style: {
					display: kitten.exp < expToPromote ? "none" : "block"
				}
			}, linksDiv);*/

			dojo.connect(unassignHref, "onclick", this, dojo.partial(function(game, i, event){
				event.preventDefault();

				var job = game.village.sim.kittens[i].job;
				game.village.getJob(job).value--;

				game.village.sim.kittens[i].job = null;
				game.village.updateResourceProduction();

				game.render();

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

			/*dojo.connect(promoteHref, "onclick", this, dojo.partial(function(census, i, event){
				event.preventDefault();
				var game = census.game;

				var kitten = game.village.sim.kittens[i];
				if (kitten.exp >= game.village.getRankExp(kitten.rank+1)){
					kitten.exp -= game.village.getRankExp(kitten.rank+1);
					kitten.rank++;
				}
				census.renderGovernment(census.container);
				census.update();

			}, this, i));*/

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
                senatorHref: senatorHref,
                leaderHref: leaderHref
			});
		}
	},

	sortKittensByExp: function(kittens){
		var v = this.game.village;
		kittens.sort(function(a,b){
		        if (a.rank > b.rank){
				 return 1;
			} else if (a.rank < b.rank){
				 return -1;
			} else {
				 return a.exp - b.exp;
			}
		});
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

		this.leaderDiv = dojo.create("div", null, governmentDiv);
		//------------------------------------
		var leader = this.game.village.leader;
		var gold = this.game.resPool.get("gold");
		if (leader) {
			var expToPromote = this.game.village.getRankExp(leader.rank);
			var goldToPromote = 25 * (leader.rank + 1);
			this.promoteLeaderHref = dojo.create("a", {
				href: "#", innerHTML: "Promote (" + this.game.getDisplayValueExt(expToPromote.toFixed()) + " exp, " + goldToPromote + " gold)",
				style: {
					display:
						(leader.exp < expToPromote || gold.value < goldToPromote) ? "none" : "block"
				}
			}, this.governmentDiv);

			dojo.connect(this.promoteLeaderHref, "onclick", this, dojo.partial(function(census, leader, event){
				event.preventDefault();
				var game = census.game;

				if (leader.exp >= game.village.getRankExp(leader.rank) && gold.value > goldToPromote){
					leader.exp -= game.village.getRankExp(leader.rank);
					this.game.resPool.addResEvent("gold", -goldToPromote);
					leader.rank++;
				}
				census.renderGovernment(census.container);
				census.update();

			}, this, leader));

			this.unassignLeaderJobHref = dojo.create("a", {
				href: "#", innerHTML: "Unassign Leader Job",
				style: {
					display:
						(leader.job) ? "block" : "none"
				}
			}, this.governmentDiv);

			dojo.connect(this.unassignLeaderJobHref, "onclick", this, dojo.partial(function(census, leader, event){
				event.preventDefault();
				var game = census.game;

				if(leader.job){
					game.village.getJob(leader.job).value--;

					leader.job = null;
					game.village.updateResourceProduction();

					census.renderGovernment(census.container);
					census.update();
					game.render();
				}

			}, this, leader));
		}
		//------------------------------------

		/*var councilDiv = dojo.create("div", {}, governmentDiv);
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

		}*/	//senators

	},

	update: function(){

		//update leader stats
		var leaderInfo = "N/A";
		var leader = this.game.village.leader;
		if (leader){
			var title = leader.trait.title == "None" ? "No trait :< " : leader.trait.title + " (rank " + leader.rank + ")";
			var nextRank = Math.floor(this.game.village.getRankExp(leader.rank));

			leaderInfo = leader.name + " " + leader.surname + ", " + title +
				"<br> exp: " + this.game.getDisplayValueExt(leader.exp);

			if( nextRank > leader.exp) {
				leaderInfo += " (" + Math.floor(leader.exp / nextRank * 100 ) + "%)";
			}

			if (leader.rank > 0){
				leaderInfo += "<br><br>Job bonus: x" + this.game.village.getLeaderBonus(leader.rank).toFixed(1) + " (" + leader.job + ")";
			}

			this.unassignLeaderJobHref.style.display = leader.job ? "block" : "none";
		}
		//TODO: promote leader link

		this.leaderDiv.innerHTML = "<strong>Leader:</strong> " + leaderInfo;


		//TODO: update senators

		for (var i = 0; i < this.records.length; i++) {
            var record = this.records[i];
            var kitten = record.kitten;

            //unassign link
            var job = "";
            if (kitten.job) {
                dojo.setStyle(record.unassignHref, "display", "block");
            } else {
                dojo.setStyle(record.unassignHref, "display", "none");
            }

            //make senator link
            /*if (this.game.village.senators.length == 5 || record.kitten.isSenator){
             dojo.setStyle(record.senatorHref, "display", "none");
             } else {
             dojo.setStyle(record.senatorHref, "display", "block");
             }*/
            dojo.setStyle(record.senatorHref, "display", "none");

            /*var traitTitle = kitten.trait.title;
             var trait = (kitten.trait != "none") ? " - " + traitTitle : "";
             var rank = kitten.rank ? " rank " + kitten.rank : "";*/

            record.content.innerHTML =
            	":3 " + kitten.name + " " + kitten.surname + ", " + kitten.age + " years old, "
            	+ kitten.trait["title"]
            	+ (kitten.rank == 0 ? "" : " (rank " + kitten.rank + ")")
            	+ "<br>"
                 /*+ ", exp: " + this.game.getDisplayValueExt(kitten.exp) */;

            //--------------- skills ----------------
            var skillsArr = kitten.job 	? this.game.village.sim.getSkillsSortedWithJob(kitten.skills, kitten.job)
            							: this.game.village.sim.getSkillsSorted(kitten.skills);

            for (var j = 0; j < Math.min(skillsArr.length,3) ; j++) {

                var exp = skillsArr[j].val;

                if (exp <= 0 || typeof(exp) == "undefined") {
                    break;
                }

				var skillExp = this.game.villageTab.getSkillExpRange(exp);
                var prevExp = skillExp[0];
                var nextExp = skillExp[1];

                var expDiff = exp - prevExp;
                var expRequried = nextExp - prevExp;

                var expPercent = (expDiff / expRequried) * 100;

				if (skillsArr[j].name == kitten.job) {
					var style = "style='font-weight: bold'";

					var productionRatio = (1 + this.game.getEffect("skillMultiplier")) / 4;
					var mod = this.game.villageTab.getValueModifierPerSkill(kitten.skills[kitten.job]);
					var bonus = (mod-1) * productionRatio;
					bonus = bonus > 0 && kitten.isLeader ? (this.game.village.getLeaderBonus(kitten.rank) * (bonus+1) - 1) : bonus;
					bonus = bonus * 100;
					bonus = bonus > 0 ? " +" + bonus.toFixed(0) + "%" : "";
				}
				else {var style = ""; var bonus = "";}

                record.content.innerHTML += "<span title='" + exp.toFixed(2) + "'" + style + ">"
                + this.game.village.getJob(skillsArr[j].name).title + bonus
                + " (" + this.game.villageTab.skillToText(exp) + " " + expPercent.toFixed() + "%)"
                + "</span><br>";
            }

            record.leaderHref.innerHTML = kitten.isLeader ? "&#9733;" : "&#9734;"; //star-shaped link to reduce visual noise

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

dojo.declare("classes.village.ui.VillageButton", com.nuclearunicorn.game.ui.ButtonModern, {
	simplePrices: false,
	hasResourceHover: true,

	getSelectedObject: function(){
		return {"prices": this.getPrices()};
	},
});

dojo.declare("classes.village.ui.FestivalButton", classes.village.ui.VillageButton, {
	x10: null,
	simplePrices: false,

	getSelectedObject: function(){
		return {"prices": this.getPrices()};
	},

	renderLinks: function(){
		var self = this;

		this.x10 = this.addLink("x10",
			function(){
				this.animate();
				this.game.villageTab.holdFestival(10);
				this.game.resPool.addResEvent("manpower", -1500 * 10);
				this.game.resPool.addResEvent("culture", -5000 * 10);
				this.game.resPool.addResEvent("parchment", -2500  *10);
				this.update();
			}, false
		);
	},

	update: function(){
		this.inherited(arguments);

		if (this.game.prestige.getPerk("carnivals").researched){
			var isEnabled = true;
			var prices = this.getPrices();
			if (!this.hasMultipleResources(10)){
				isEnabled = false;
			}
		}
		else {
			isEnabled = false;
		}

		if (this.x10){
			dojo.setStyle(this.x10.link, "display", isEnabled ? "" : "none");
		}
	},

	hasMultipleResources: function(amt){
		return (
			this.game.resPool.get("manpower").value >= 1500 * amt &&
			this.game.resPool.get("culture").value >= 5000 * amt &&
			this.game.resPool.get("parchment").value >= 2500 * amt
		);
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
				if (this.game.opts.noConfirm || confirm("Are you sure?")){
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


		var tr = dojo.create("tr", null, table);

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
		var statsTd = dojo.create("td", { style: "cursor: pointer; width: 50%; text-align: center;"}, tr);

		statsTd.title = "Happiness affects your workers' production. \nRare resources will increase this value whilst over-population will reduce it";

		this.happinessStats = statsTd;

		var controlsTd = dojo.create("td", {}, tr);

		//hunt
		var huntBtn = new classes.village.ui.VillageButton({
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

		//festival
		var festivalBtn = new classes.village.ui.FestivalButton({
				name: "Hold festival",
				description: "Hold a cultural festival to make your kittens happy. (+30% to the happiness for a year)",
				handler: dojo.hitch(this, function(){
					this.holdFestival(1);
				}),
				prices: [
					{ name : "manpower", val: 1500 },
					{ name : "culture", val: 5000 },
					{ name : "parchment", val: 2500 }
				]
		}, this.game);
		festivalBtn.render(controlsTd);
		festivalBtn.setVisible(this.game.science.get("drama").researched);
		this.festivalBtn = festivalBtn;

		//manage
		var optimizeJobsBtn = new classes.village.ui.VillageButton({
			name: "Manage Jobs",
			description: "The leader optimizes job distribution according to kittens' experiences",
			handler: dojo.hitch(this, function(){
				this.game.village.optimizeJobs();
			})
		}, this.game);
		optimizeJobsBtn.render(controlsTd);
		optimizeJobsBtn.setVisible(this.game.village.leader != undefined && this.game.workshop.get("register").researched);
		this.optimizeJobsBtn = optimizeJobsBtn;

		//redeemGift
		var redeemGiftBtn = new classes.village.ui.VillageButton({
			name: "Redeem Gift",
			description: "",
			handler: dojo.hitch(this, function(){
				this.game.redeemGift();
				this.redeemGiftBtn.setVisible(this.game.resPool.get("elderBox").value > 0);
			})
		}, this.game);
		redeemGiftBtn.render(controlsTd);
		redeemGiftBtn.setVisible(this.game.resPool.get("elderBox").value > 0);
		this.redeemGiftBtn = redeemGiftBtn;

		//--------------- bureaucracy ------------------
		this.censusPanel = new com.nuclearunicorn.game.ui.CensusPanel("Census", this.game.village, this.game);
		//this.censusPanel.collapsed = true;
		if (!this.game.science.get("civil").researched){
			this.censusPanel.setVisible(false);
		}

		this.censusPanelContainer = this.censusPanel.render(tabContainer);

		this.update();
	},

	update: function(){
		this.inherited(arguments);

		if (this.tdTop){
			this.tdTop.innerHTML = "Free kittens: " + this.game.village.getFreeKittens() + " / " + this.game.resPool.get("kittens").value;
		}

		if (this.happinessStats){
			var happiness = this.game.village.happiness * 100;
			this.happinessStats.innerHTML = "Happiness: " + Math.floor(happiness) + "%";
		}

		var festivalDays = this.game.calendar.festivalDays;
		if (festivalDays){
			this.happinessStats.innerHTML += "<br\><br\> Festival during "+ this.game.getDisplayValueExt(festivalDays) + " days";
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
		this.updateTab();
	},

	updateTab: function(){
		//-------- update tab title -------
		var freeKittens = this.game.village.getFreeKittens();
		if (freeKittens){
			this.tabName = this.getVillageTitle() + " (" + freeKittens + ")";
		} else {
			this.tabName = this.getVillageTitle();
		}
		if (this.domNode) {
			this.domNode.innerHTML = this.tabName;
		}
	},

	getVillageTitle: function(){
		var kittens = this.game.village.getKittens();
		switch (true) {
			//you gotta be kitten me
		case kittens > 5000:
			return "Elders";
		case kittens > 2000:
			return "Galactic Union";
		case kittens > 1500:
			return "Planetary Council";
		case kittens > 1200:
			return "Consortium";
        case kittens > 1000:
            return "Civilisation";	//all rights reserved, yada yada.
        case kittens > 900:
            return "Society";
        case kittens > 800:
            return "Reich";
        case kittens > 700:
            return "Federation";
        case kittens > 600:
            return "Hegemony";
		case kittens > 500:
			return "Dominion";
		case kittens > 400:
			return "Imperium";
		case kittens > 300:
			return "Empire";
		case kittens > 250:
			return "Megapolis";
		case kittens > 200:
			return "Metropolis";
		case kittens > 150:
			return "City";
		case kittens > 100:
			return "Town";
		case kittens > 50:
			return "Small Town";
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
			return "dabbling";
		case value < 500:
			return "novice";
		case value < 1200:
			return "adequate";
		case value < 2500:
			return "competent";
		case value < 5000:
			return "skilled";
		case value < 9000:
			return "proficient";
		default:
			return "master";
		}
	},

	getSkillExpRange: function(value){
		switch (true) {
		case value < 100:
			return [0,100];
		case value < 500:
			return [100,500];
		case value < 2500:
			return [500,2500];
		case value < 5000:
			return [2500,5000];
		case value < 9000:
			return [5000,9000];
		case value < 20000:
			return [9000,20000];
		default:
			return [20000,value];
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

	holdFestival: function(amt){
		var festivalWasInProgress = this.game.calendar.festivalDays > 0;

		if (this.game.prestige.getPerk("carnivals").researched){
			this.game.calendar.festivalDays += (400 * amt);
		} else {
			this.game.calendar.festivalDays = 400;
		}

		if (festivalWasInProgress){
			this.game.msg("The cultural festival has been extended");
		} else {
			this.game.msg("The cultural festival has started");
		}
		//TODO: some fun message like Molly Chalk is making a play 'blah blah'
	},

	rand: function(ratio){
		return (Math.floor(Math.random()*ratio));
	}
});
