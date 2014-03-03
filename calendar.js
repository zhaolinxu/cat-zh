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
		}
	},
	{
		name: "autumn",
		title: "Autumn",
		
		modifiers:{
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
	dayPerTick: 0.1,
	
	tick: function(){
		this.day += this.dayPerTick;
		
		if (this.day > this.daysPerSeason){
			this.day = 0;
			
			this.season++;
			
			if (this.season > 3){
				this.season = 0;
			}
		}
	},
	
	getCurSeason: function(){
		return this.seasons[this.season];
	}
	
});
