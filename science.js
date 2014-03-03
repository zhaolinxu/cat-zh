/**
 * Weird cat science
 */
dojo.declare("com.nuclearunicorn.game.science.ScienceManager", null, {
	
	game: null,
	
	//list of technologies
	techs:[{
		name: "calendar",
		cost: 100,	//cos in WCS (weird cat science)
	}],
	
	constructor: function(game){
		this.game = game;
	}
});
