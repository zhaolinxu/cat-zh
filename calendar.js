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
