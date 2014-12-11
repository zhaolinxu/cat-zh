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

	season: 0,

	daysPerSeason: 100,
	day: 0,
	year: 0,
	dayPerTick: 0.1,

	eventChance: 0,

	weather: null,	//warm / cold

	festivalDays: 0,

	iceage: 0,	//Ice Age apocalypse level

	observeBtn: null,
	observeHandler: null,
	observeTimeout: null,
	observeClear: function(){
		dojo.destroy(this.observeBtn);
		this.observeBtn = null;
		clearTimeout(this.observeTimeout);
	},

	constructor: function(game){
		this.game = game;
	},

	tick: function(){

		var nextDay = this.day + this.dayPerTick;
		if ( nextDay.toFixed() > this.day.toFixed()){
			this.onNewDay();
		}

		this.day += this.dayPerTick;

		if (this.day > this.daysPerSeason){
			this.day = 0;

			this.season++;
			this.onNewSeason();

			if (this.season > 3){
				this.season = 0;
				this.year++;

				this.onNewYear();
			}
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
		
		

		var chance = 25 * chanceRatio;									//25 OPTK of event per day	(0.25%)
		if (this.game.bld.get("observatory").enabled){
			chance += this.game.bld.getEffect("starEventChance");
		}

		this.observeHandler = function(event){
			this.observeClear();

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

			this.game.msg("A meteor fell near the village, +"+ mineralsAmt.toFixed() +" minerals!");

			if (this.game.workshop.get("celestialMechanics").researched){
				var sciBonus = 15 * ( 1 + this.game.bld.getEffect("scienceRatio"));
				this.game.resPool.addResAmt("science", sciBonus);
				this.game.msg("+" + sciBonus.toFixed() + " science!");
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
			if (zebras.value > 0 ){
				zebras.value = 0;
				this.game.msg("Zebra hunter has departed from your village.");
				this.game.render();
			}
		}
		//TODO: maybe it is a good idea to start moving daily events to json metadata
		//-------------------------  -------------------

		var riftChance = this.game.religion.getEffect("riftChance");	//5 OPTK
		if (this.game.rand(10000) < riftChance * unicornChanceRatio){
			this.game.msg("A rift to the Unicorn Dimension has opened in your village, +500 unicorns!", "notice");

			this.game.resPool.get("unicorns").value += 500;
		}
		//----------------------------------------------
		var aliChance = this.game.religion.getEffect("alicornChance");	//0.2 OPTK
		if (this.game.rand(100000) < aliChance){
			this.game.msg("An Alicorn has descended from the sky!", "important");

			this.game.resPool.get("alicorn").value += 1;
		}

		// -------------- ivory meteors ---------------
		var meteorChance = 0 + this.game.religion.getEffect("ivoryMeteorChance");	//5 OPTK
		if (this.game.rand(10000) < meteorChance * unicornChanceRatio){

			var ivory = 250 + this.game.rand(1500);
			this.game.msg("Ivory Meteor fell near the village, +" + ivory.toFixed() + " ivory!", "notice");

			this.game.resPool.get("ivory").value += ivory;
		}
	},

	onNewSeason: function(){
		this.eventChance = 0;

		if (this.game.rand(100) < 35 && this.year > 3){
			if (this.game.rand(100) > 50){
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

		//-------------------- Ice Age stuff -------------------------
		/*if (this.iceage == 2 && this.game.village.getKittens() >= 60){

			this.game.msg("The air is freezing cold");
			this.iceage = 3;

		}else if (this.iceage == 1 && this.game.village.getKittens() >= 55){

			this.game.msg("The weather is getting colder.");
			this.iceage = 2;

		}else if (this.iceage == 0 && this.game.village.getKittens() >= 50){

			this.game.msg("Days are getting shorter.");
			this.iceage = 1;
		}*/
	},

	onNewYear: function(){
		if (this.game.bld.get("steamworks").jammed) {
			//this.game.msg("Workshop automation ready for operation");
			this.game.bld.get("steamworks").jammed = false;	//reset jammed status
		}
		
		if ( this.year % 1000 === 0 ){
			this.game.paragonPoints++;
		}

		/**
		 * Endgame players will freak out so we will introduce it gradually
		 */
		/*if (this.iceage >= 3 && this.iceage < 6){
			this.iceage++;

			if (this.iceage != 6){
				this.game.msg("Nights are getting colder");
			} else {
				this.game.msg("An ice age has started");
			}
		}*/
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

	getIceageMod: function(){
		var mod = 0;
		//the end is neigh
		if (this.iceage >= 5){
			mod -= 0.5;
		}else if (this.iceage >=4){
			mod -= 0.35;
		}else if (this.iceage == 3){
			mod -= 0.15;
		}
		return mod;
	},

	getCurSeason: function(){
		return this.seasons[this.season];
	},

	save: function(saveData){
		saveData.calendar = {
			year : this.year,
			day: this.day,
			season: this.season,
			weather: this.weather,
			iceage: this.iceage,
			festivalDays: this.festivalDays
		};
	},

	load: function(saveData){
		if (saveData.calendar){
			this.year  = saveData.calendar.year;
			this.day  = saveData.calendar.day;
			this.season  = saveData.calendar.season;
			this.weather = saveData.calendar.weather;
			this.festivalDays = saveData.calendar.festivalDays || 0;
		}
	}

});

dojo.declare("com.nuclearunicorn.game.calendar.Event", null, {
});
