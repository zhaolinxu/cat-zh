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
			}
		}
	},
	
	onNewDay: function(){
		var self = this;
		
		if (self.observeBtn){
			dojo.destroy(self.observeBtn);
		}
		
		var chance = 10;
		if (this.game.rand(1000) < chance){
			var gameLog = dojo.byId("gameLog");
			this.game.msg("A rare astronomical event occured in the sky");
			
			this.observeBtn = dojo.create("input", {
				type: "button",
				value: "Observe"
			}, gameLog);
			
			dojo.connect(this.observeBtn, "onclick", this, function(){
				dojo.destroy(this.observeBtn);
				
				//console.log("gotcha!");
				var diagram = this.game.resPool.get("starchart");
				var science = this.game.resPool.get("science");
				
				var sciBonus = 25 + 25* this.game.bld.getEffect("scienceRatio");
				science.value += sciBonus;
				this.game.msg("+" + sciBonus + " science!");
				
				if (this.game.science.get("astronomy").researched){
					this.game.msg("You've made a star chart!");
					diagram.value +=1;
				}
			});

			var seconds = 35;
			var timeout = setInterval(function(){
				dojo.destroy(self.observeBtn);
				window.clearInterval(timeout);
			}, seconds * 1000);
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
	},
	
	getWeatherMod: function(){
		if (this.weather == "warm"){
			return 0.15;
		} else if (this.weather == "cold"){
			return -0.15
		}
		return 0;
	},
	
	getCurSeason: function(){
		return this.seasons[this.season];
	},
	
	save: function(saveData){
		saveData.calendar = {
			year : this.year,
			day: this.day,
			season: this.season
		};
	},
	
	load: function(saveData){
		if (saveData.calendar){
			this.year  = saveData.calendar.year;
			this.day  = saveData.calendar.day;
			this.season  = saveData.calendar.season;
		}
	}
	
});

dojo.declare("com.nuclearunicorn.game.calendar.Event", null, {
});
