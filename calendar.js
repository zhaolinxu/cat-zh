dojo.declare("com.nuclearunicorn.game.Calendar", null, {
	seasons: [
	{
		name: "spring",
		title: "Spring"
	}, 
	{
		name: "summer",
		title: "Summer"
	},
	{
		name: "autumn",
		title: "Autumn"
	},
	{
		name: "winter",
		title: "Winter"
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
