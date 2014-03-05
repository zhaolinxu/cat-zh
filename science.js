/**
 * Weird cat science
 */
dojo.declare("com.nuclearunicorn.game.science.ScienceManager", null, {
	
	game: null,
	
	//list of technologies
	techs:[{
		name: "calendar",
		title: "Calendar",
		description: "By studing the rotation of the Cath around the sun we may find a better understanding of the seasons and time.",
		effect: "Calendar allows you to track days",
		unlocked: true,
		cost: 60	//cos in WCS (weird cat science)
	},{
		name: "irrigation",
		title: "Irrigation",
		description: "By constructing artificial water channels we may improve our catnip fields production",
		effect: "Base fields production improved up to 20%",
		unlocked: false,
		cost: 200
	}],
	
	constructor: function(game){
		this.game = game;
	}
});
