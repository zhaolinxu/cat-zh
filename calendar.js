/**
 * Calendar class. Manages time, seasons and random events of the game
 */
dojo.declare("com.nuclearunicorn.game.Calendar", null, {
	game: null,

	seasons: [
	{
		name: "spring",
		title: "Spring",

		modifiers:{
			"catnip" : 1.5
		}
	},
	{
		name: "summer",
		title: "Summer",

		modifiers:{
			"catnip" : 1.0
		}
	},
	{
		name: "autumn",
		title: "Autumn",

		modifiers:{
			"catnip" : 1.0
		}
	},
	{
		name: "winter",
		title: "Winter",

		modifiers:{
			"catnip" : 0.25
		}
	}],

	//Charon, Umbra (black hole), Yarn (terraformable?), Helios (Sun), Cath, Redmoon (Cath satellite), Dune, Piscine, Terminus (ice giant), Kairo (dwarf planet)
	cycles: [
		{
			name: "charon",
			title: "Charon",
			glyph: "&#9049;",
			effects: {
				
			}
		},
		{
			name: "umbra",
			title: "Umbra",
			glyph: "&#9062;",
			effects: {
				
			}
		},
		{
			name: "yarn",
			title: "Yarn",
			glyph: "&#9063;",
			effects: {
				
			}
		},
		{
			name: "helios",
			title: "Helios",
			glyph: "&#8978;",
			effects: {
				
			}
		},
		{
			name: "cath",
			title: "Cath",
			glyph: "&#9022;",
			effects: {
				"sattelite-starchartPerTickBase": 2,
				"sattelite-observatoryRatio": 2,
				"spaceStation-energyConsumption": 1.2
			}
		},
		{
			name: "redmoon",
			title: "Redmoon",
			glyph: "&#9052;",
			effects: {
				
			}
		},
		{
			name: "dune",
			title: "Dune",
			glyph: "&#9067;",
			effects: {
				"planetCracker-uraniumPerTick": 1.1
			}
		},
		{
			name: "piscine",
			title: "Piscine",
			glyph: "&#9096;",
			effects: {
				
			}
		},
		{
			name: "terminus",
			title: "Terminus",
			glyph: "&#9053;",
			effects: {
				
			}
		},
		{
			name: "kairo",
			title: "Kairo",
			glyph: "&#8483;",
			effects: {
				
			}
		}
	],

	season: 0,
	cycle: 0,
	cycleYear: 0,
	yearsPerCycle: 5,

	daysPerSeason: 100,
	day: 0,
	year: 0,
	dayPerTick: 0.1,

	eventChance: 0,

	weather: null,	//warm / cold

	festivalDays: 0,

	observeBtn: null,
	observeHandler: null,
	observeTimeout: null,
	observeClear: function(){
		dojo.destroy(this.observeBtn);
		this.observeBtn = null;
		clearTimeout(this.observeTimeout);
	},

	constructor: function(game, displayElement) {
		this.game = game;
		this.displayElement = displayElement;
	},

	/* Return the whole number of days elapsed in the season, correcting for
	   possible floating-point errors.
	*/
	integerDay: function () {
		return Math.floor(this.day + 0.5 * this.dayPerTick);
	},

	update: function() {

	},

	cycleEffects: function(effects, building_name){
		
		var list_effects_cycle = this.cycles[this.cycle].effects;
		
		var effects_keys = Object.keys(effects);
		for (i = 0; i < effects_keys.length; i++) {
			var effect = effects_keys[i];
			
			var effect_cycle_id = building_name + "-" + effect;
			var ratio = list_effects_cycle[effect_cycle_id] ? list_effects_cycle[effect_cycle_id] : 1;
			effects[effect] *= ratio;
			
		}

		return effects;
	},

	tick: function(){

		this.day += this.dayPerTick;

		var intday = this.integerDay();
		    newseason = false,
		    newyear = false;

		if (Math.abs(this.day - intday) < 0.5 * this.dayPerTick) {
			this.day = intday; /* minimize floating point error */

			if (this.day >= this.daysPerSeason) {
				this.day = 0;
				this.season += 1;
				newseason = true;

				if (this.season >= this.seasons.length) {
					this.season = 0;
					this.year += 1;
					newyear = true;
				}
			}

			/*The new date must be fully computed before any of the individual onNew functions are called
			   to ensure the onNew functions have a consistent view of what the current date is.
			*/
			this.onNewDay();
			if (newseason) {
				this.onNewSeason();
				if (newyear) {
					this.onNewYear();
				}
			}

			/* The update function must be called after the onNew functions, which may make changes
			   that need to be visible (e.g. showing events in the document title)
			*/
			this.update();
		}
	},

	/*
	 * All daily chances are in 1/10K units (OPTK) (0.0X%)
	 */
	onNewDay: function(){
		var self = this;

		if (this.festivalDays){
			this.festivalDays--;
		}

		var chanceRatio = 1;
		var unicornChanceRatio = 1;

		if (this.game.prestige.getPerk("chronomancy").researched){
			chanceRatio = 1.1;
		}
		if (this.game.prestige.getPerk("unicornmancy").researched){
			unicornChanceRatio = 1.1;
		}


		//------------------------- astronomical events -------------------------
		var chance = 25;									//25 OPTK of event per day	(0.25%)
		chance += this.game.bld.getEffect("starEventChance");
		chance *= chanceRatio;

		this.observeHandler = function(event){
			this.observeClear();
			this.game.stats.getStat("eventsObserved").val++;

			var isSilent = false;
			if (this.game.workshop.get("seti").researched){
				isSilent = true;
			}

			var starchart = this.game.resPool.get("starchart");

			var celestialBonus = 0;
			if (this.game.workshop.get("celestialMechanics").researched){
				celestialBonus = 5;	//20% bonus in the normal mode
				if (this.game.ironWill){
					celestialBonus = 15;	//60% in the IW
				}
			}

			var sciBonus = (25 + celestialBonus) * ( 1 + this.game.bld.getEffect("scienceRatio"));
			this.game.resPool.addResAmt("science", sciBonus);

			if (!isSilent){
				this.game.msg("+" + sciBonus.toFixed() + " science!");
			}

			if (this.game.science.get("astronomy").researched){
				if (!isSilent){
					this.game.msg("You've made a star chart!");
				}
				starchart.value +=1;
			}
		}//this.observeHandler

		if (this.game.rand(10000) < chance &&
			this.game.bld.get("library").val > 0){

			var observeTimeout = function(){

				this.observeClear();

				var autoChance = this.game.bld.getEffect("starAutoSuccessChance");	//in %
				var rand = this.game.rand(100);

				if(
					(this.game.ironWill && (self.game.rand(100) <= 25)) ||
					(rand <= autoChance)
				){
					dojo.hitch(this, this.observeHandler)({}, true);
				}

			}//observeTimeout

			if (this.observeBtn){
				dojo.hitch(this, observeTimeout)();
			}
			this.observeClear();

			//---------------- SETI hack-------------------
			if (this.game.workshop.get("seti").researched){
				this.observeHandler();
			}else{
				var gameLog = dojo.byId("gameLog");
				var node = this.game.msg("A rare astronomical event occurred in the sky");

				this.observeBtn = dojo.create("input", {
					id: "observeBtn",
					type: "button",
					value: "Observe"
				}, node);

				dojo.connect(this.observeBtn, "onclick", this, this.observeHandler);

				var seconds = 60;
				this.observeTimeout = setTimeout(dojo.hitch(this, observeTimeout), seconds * 1000);
			}
		}


		//------------------------- meteors -------------------------
		var iwChance = 0;
		if (this.game.ironWill){
			iwChance = 40;	// +0.4 additional chance of falling meteors
		}

		var baseChance = 10 * chanceRatio;
		if (this.game.rand(10000) < (baseChance + iwChance) &&
			this.game.science.get("mining").researched){	//0.1% chance of meteors

			var minerals = this.game.resPool.get("minerals");
			var mineralsAmt = 50 + 25 * this.game.bld.getEffect("mineralsRatio");

			if (this.game.ironWill){
				mineralsAmt += mineralsAmt * 0.1;	//+10% of minerals for iron will
			}

			this.game.msg("A meteor fell near the village, +" + mineralsAmt.toFixed() +" minerals!", null, "meteor");

			if (this.game.workshop.get("celestialMechanics").researched){
				var sciBonus = 15 * ( 1 + this.game.bld.getEffect("scienceRatio"));
				this.game.resPool.addResAmt("science", sciBonus);
				this.game.msg("+" + sciBonus.toFixed() + " science!", null, "meteor");
			}

			minerals.value += mineralsAmt;

			//TODO: make meteors give titanium on higher levels
		}

		//------------------------- 0.035% chance of spawning unicorns in Iron Will -----------------
		var zebras = this.game.resPool.get("zebras");

		if (this.game.ironWill){
			var archery = this.game.science.get("archery");
			var unicorns = this.game.resPool.get("unicorns");
			if (this.game.rand(100000) <= 17 * unicornChanceRatio && unicorns.value < 2 && archery.researched){
				unicorns.value += 1;
				this.game.msg("A unicorn comes to your village attracted by the catnip scent!");
			}

			if (!zebras.value && archery.researched){
				zebras.value += 1;
				this.game.msg("A mysterious hunter from zebra tribe decides to stop over in the village.");
			} else if ( zebras.value > 0 && zebras.value < this.game.karmaZebras){
				if (this.game.rand(100000) <= 500){
					zebras.value += 1;
					this.game.msg("Another zebra hunter joins your village.");
					this.game.render();
				}
			}
		}else{
			var zTreshold = 0;
			if (this.game.prestige.getPerk("zebraDiplomacy").researched){
				//zTreshold = Math.floor((this.game.rand(20) + 5) / 100 * this.game.karmaZebras);   //5 - 25% of hunters will stay
				zTreshold = Math.floor(0.10 * this.game.karmaZebras);   //5 - 25% of hunters will stay
			}
			if (zebras.value > zTreshold ){
				this.game.msg( zebras.value > 1 ?
                    "Zebra hunters have departed from your village." :
                    "Zebra hunter has departed from your village."
                );
                zebras.value = zTreshold;
				this.game.render();
			}
		}
		//TODO: maybe it is a good idea to start moving daily events to json metadata
		//-------------------------  -------------------

		var riftChance = this.game.religion.getEffect("riftChance");	//5 OPTK
		if (this.game.rand(10000) < riftChance * unicornChanceRatio){
			this.game.msg("A rift to the Unicorn Dimension has opened in your village, +500 unicorns!", "notice", "unicornRift");

			this.game.resPool.get("unicorns").value += 500;
		}
		//----------------------------------------------
		var aliChance = this.game.religion.getEffect("alicornChance");	//0.2 OPTK
		if (this.game.rand(100000) < aliChance){
			this.game.msg("An Alicorn has descended from the sky!", "important", "alicornRift");

			this.game.resPool.get("alicorn").value += 1;
		}

		// -------------- ivory meteors ---------------
		var meteorChance = 0 + this.game.religion.getEffect("ivoryMeteorChance");	//5 OPTK
		if (this.game.rand(10000) < meteorChance * unicornChanceRatio){

			var ivory = (250 + this.game.rand(1500) * (1 + this.game.religion.getEffect("ivoryMeteorRatio")));
			this.game.msg("Ivory Meteor fell near the village, +" + ivory.toFixed() + " ivory!", "notice", "ivoryMeteor");

			this.game.resPool.get("ivory").value += ivory;
		}

        this.game.diplomacy.onNewDay();
	},

	onNewSeason: function(){
		this.eventChance = 0;

		if (this.game.rand(100) < 35 && this.year > 3){
			if (this.game.rand(100) < 50){
				this.weather = "warm";
			} else {
				this.weather = "cold";
			}
		}else{
			this.weather = null;
		}

		if (this.season == 2 && this.game.workshop.get("advancedAutomation").researched ){
			this.game.bld.get("steamworks").jammed = false;
		}
	},

	onNewYear: function(){

        var ty = this.game.stats.getStat("totalYears");
		ty.val++;

        if (ty.val < this.year){
            ty.val = this.year;
        }


		if (this.game.bld.get("steamworks").jammed) {
			this.game.bld.get("steamworks").jammed = false;	//reset jammed status
		}

		if ( this.year % 1000 === 0 ){
			this.game.paragonPoints++;
			this.game.stats.getStat("totalParagon").val++;
			this.game.updateKarma();
		}

		var pyramidVal = this.game.religion.getZU("blackPyramid").val;
		var markerVal = this.game.religion.getZU("marker").val;
        if ( pyramidVal > 0 ){
            if (this.game.rand(1000) < 35 * pyramidVal * (1 + 0.1 * markerVal)){   //3.5% per year per BP, x10% per marker
                this.game.diplomacy.unlockElders();
            }
        }

		this.cycleYear++;
		if (this.cycleYear > this.yearsPerCycle){
			this.cycleYear = 0;
			this.cycle++;
			if (this.cycle >= this.cycles.length){
				this.cycle = 0;
			}
		}

        this.game.resPool.get("antimatter").value += this.game.space.getEffect("antimatterProduction");
	},

	getWeatherMod: function(){
		var mod = 0;
		if (this.weather == "warm"){
			mod =  0.15;
		} else if (this.weather == "cold"){
			mod = -0.15
		}
		return mod;
	},

	getCurSeason: function(){
		return this.seasons[this.season];
	},

	resetState: function(){
		this.year = 0;
		this.day = 0;
		this.season = 0;
		this.weather = null;
		this.festivalDays = 0;
		this.cycle = 0;
		this.cycleYear = 0;
		this.observeClear();
	},

	save: function(saveData){
		saveData.calendar = {
			year : this.year,
			day: this.day,
			season: this.season,
			weather: this.weather,
			festivalDays: this.festivalDays,
			cycle: this.cycle,
			cycleYear: this.cycleYear
		};
	},

	load: function(saveData){
		if (saveData.calendar){
			this.year  = saveData.calendar.year;
			this.day  = saveData.calendar.day;
			this.season  = saveData.calendar.season;
			this.weather = saveData.calendar.weather;
			this.festivalDays = saveData.calendar.festivalDays || 0;
			this.cycle = saveData.calendar.cycle || 0;
			this.cycleYear = saveData.calendar.cycleYear || 0;
		}
	}

});

dojo.declare("com.nuclearunicorn.game.calendar.Event", null, {
});
