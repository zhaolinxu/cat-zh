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
	
	iceage: 0,	//iceage apocalypse level
	
	observeBtn: null,
	
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

		var chance = 25;					//25 OPTK of event per day	(0.25%)
		chance += this.game.bld.getEffect("starEventChance");
		
		if (this.game.rand(10000) < chance && 
			this.game.bld.get("library").val > 0){

			dojo.destroy(this.observeBtn);
			this.observeBtn = null;
			
			var gameLog = dojo.byId("gameLog");
			var node = this.game.msg("A rare astronomical event occured in the sky");
			
			this.observeBtn = dojo.create("input", {
				type: "button",
				value: "Observe"
			}, node);
			
			var observeHandler = function(event, ironwill){

				if ((!event.clientX || !event.clientY) && !ironwill){
					//>:
					this.game.cheatMode = true;
				}

				
				dojo.destroy(this.observeBtn);
				this.observeBtn = null;
				
				var diagram = this.game.resPool.get("starchart");
				var science = this.game.resPool.get("science");
				
				var sciBonus = 25 + 25* this.game.bld.getEffect("scienceRatio");
				science.value += sciBonus;
				this.game.msg("+" + sciBonus.toFixed() + " science!");
				
				if (this.game.science.get("astronomy").researched){
					this.game.msg("You've made a star chart!");
					diagram.value +=1;
				}
			}
			
			dojo.connect(this.observeBtn, "onclick", this, observeHandler);

			var seconds = 60;
			var timeout = setInterval(function(){
				
				dojo.destroy(self.observeBtn);
				self.observeBtn = null;
				
				window.clearInterval(timeout);
				
				var autoChance = self.game.bld.getEffect("starAutoSuccessChance");	//in %

				if(
					(self.game.ironWill && (self.game.rand(100) <= 25)) ||
					(self.game.rand(100) <= autoChance)
				){	
					dojo.hitch(self, observeHandler)({}, true);
				}
				
			}, seconds * 1000);
		}
		
		
		var iwChance = 0;
		if (this.game.ironWill){
			iwChance = 40;	// +0.4 additional chance of falling metheors
		}
		
		var baseChance = 10;
		/*if (this.iceage >=3){
			baseChance = 3;
		}*/
		
		if (this.game.rand(10000) < (baseChance + iwChance) && 
			this.game.science.get("mining").researched){	//0.1% chance of metheors
			
			var minerals = this.game.resPool.get("minerals");
			var mineralsAmt = 50 + 25 * this.game.bld.getEffect("mineralsRatio");
		
			if (this.game.ironWill){
				var mineralsAmt = mineralsAmt + mineralsAmt * 0.1;	//+10% of minerals for iron will
			}
			
			this.game.msg("A meteor fell near the village, +"+ mineralsAmt.toFixed() +" minerals!");
			
			minerals.value += mineralsAmt;
			
			//TODO: make meteors give titanium on higher levels
		}
		
		//------------------------- 0.035% chance of spawning unicorns in Iron Will -----------------
		var zebras = this.game.resPool.get("zebras");
		
		if (this.game.ironWill){
			var archery = this.game.science.get("archery");
			var unicorns = this.game.resPool.get("unicorns");
			if (this.game.rand(100000) <= 17 && unicorns.value < 2 && archery.researched){
				unicorns.value += 1;
				this.game.msg("A unicorn comes to your village attracted by the catnip scent!");
			}	

			if (!zebras.value && archery.researched){
				zebras.value += 1;
				this.game.msg("A mysterious hunter from zebra tribe decides to stop over in the village.");
			}
		}else{
			if (zebras.value > 0 ){
				zebras.value = 0;
				this.game.msg("Zebra hunter has departed from your village.");
			}
		}
		
		//$("#iceage").toggle(this.iceage >= 3); //ONE DAY
		
		//TODO: maybe it is a good idea to start moving daily events to json metadata
		//-------------------------  -------------------
		
		var riftChance = 0 + this.game.religion.getEffect("riftChance");	//5 OPTK
		if (this.game.rand(10000) < riftChance){
			this.game.msg("A rift to the Unicorn Dimension has opened in your village, +500 unicorns!");
			
			this.game.resPool.get("unicorns") += 500;
		}
		
		// -------------- ivory meteors ---------------
		var meteorChance = 0 + this.game.religion.getEffect("ivoryMeteorChance");	//5 OPTK
		if (this.game.rand(10000) < meteorChance){
			
			var ivory = 250 + this.game.rand(1500);
			this.game.msg("Ivory Meteor fell near the village, +" + ivory.toFixed() + " ivory!");
			
			this.game.resPool.get("ivory") += ivory;
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
		
		//-------------------- icage stuff -------------------------
		/*if (this.iceage == 2 && this.game.village.getKittens() >= 60){
			
			this.game.msg("The air is freezing cold");
			this.iceage = 3;
			
		}else if (this.iceage == 1 && this.game.village.getKittens() >= 55){
			
			this.game.msg("The weather is geting colder.");
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
			iceage: this.iceage
		};
	},
	
	load: function(saveData){
		if (saveData.calendar){
			this.year  = saveData.calendar.year;
			this.day  = saveData.calendar.day;
			this.season  = saveData.calendar.season;
			this.weather = saveData.calendar.weather;
			this.bloodmoon = saveData.calendar.iceage ? saveData.calendar.iceage : 0;
		}
	}
	
});

dojo.declare("com.nuclearunicorn.game.calendar.Event", null, {
});
