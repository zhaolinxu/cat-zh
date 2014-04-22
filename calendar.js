dojo.declare("com.nuclearunicorn.game.Calendar", null, {
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
