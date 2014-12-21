dojo.declare("classes.managers.Achievements", null, {
	game: null,

	achievements: [
	{
		name: "unicornConspiracy",
		title: "Unicorn Conspiracy",
		description: "Lift the shroud of the Unicorn conspiracy!",
		condition: function(){
			return ( this.game.resPool.get("unicorns").value > 0 );
		},
		unlocked: false
	},{
		name: "uniception",
		title: "Uniception",
		description: "Find the conspiracy within the conspiracy",
		condition: function(){
			return ( this.game.resPool.get("tears").value > 0 );
		},
		unlocked: false
	},{
		name: "sinsOfEmpire",
		title: "Sins of a Solar Empire",
		description: "Wait, seriously?",
		condition: function(){
			return ( this.game.resPool.get("alicorn").value > 0 );
		},
		unlocked: false
	},{
		name: "anachronox",
		title: "Anachronox",
		description: "Please stop",
		condition: function(){
			return ( this.game.resPool.get("timeCrystal").value > 0 );
		},
		unlocked: false
	},{
		name: "deadSpace",
		title: "Dead Space",
		description: "In space no one can hear you meow.",
		condition: function(){
			return ( this.game.resPool.get("necrocorn").value > 0 );
		},
		unlocked: false
	},{
		name: "ironWill",
		title: "Iron Will",
		description: "You truly deserved this",
		condition: function(){
			return ( this.game.ironWill && !this.game.resPool.get("kittens").value && this.game.bld.get("mine").val > 0 );
		},
		unlocked: false
	},{
		name: "uberkatzhen",
		title: "Uberkatzchen",
		description: "What does not kill you makes you stronger",
		condition: function(){
			return ( this.game.ironWill && !this.game.resPool.get("kittens").value && this.game.bld.get("warehouse").val > 0 );
		},
		unlocked: false
	},{
		name: "hundredYearsSolitude",
		title: "One Hundred Years of Solitude",
		description: "How far is too far?",
		condition: function(){
			return ( this.game.ironWill && !this.game.resPool.get("kittens").value && this.game.bld.get("steamworks").val > 0 );
		},
		unlocked: false
	},{
		name: "soilUptuned",
		title: "Virgin Soil Upturned",
		description: "Have 45 pastures in Iron Will mode",
		condition: function(){
			return ( this.game.ironWill && !this.game.resPool.get("kittens").value && this.game.bld.get("pasture").val >= 45 );
		},
		unlocked: false
	},{
		name: "atlasUnmeowed",
		title: "Atlas Unmeowed",
		description: "Construct a magneto in Iron Will mode",
		condition: function(){
			return ( this.game.ironWill && !this.game.resPool.get("kittens").value && this.game.bld.get("magneto").val > 0 );
		},
		unlocked: false
	},{
		name: "meowMeowRevolution",
		title: "Meow Meow Revolution",
		description: "Construct a factory in Iron Will mode",
		condition: function(){
			return ( this.game.ironWill && !this.game.resPool.get("kittens").value && this.game.bld.get("factory").val > 0 );
		},
		unlocked: false
	},{
		name: "spaceOddity",
		title: "Space Oddity",
		description: "Complete a Moon Program in Iron Will mode",
		condition: function(){
			return ( this.game.ironWill && this.game.space.getProgram("moonMission").researched );
		},
		unlocked: false
	},{
		name: "sunGod",
		title: "Sun God",
		description: "Gain a total of 696,342 accumulated faith",
		condition: function(){
			return ( this.game.religion.faith >= 696342 );
		},
		unlocked: false
	},{
		name: "heartOfDarkness",
		title: "Heart Of Darkness",
		description: "Become the chieftain of a zebra tribe. (How is this even possible?)",
		condition: function(){
			return (this.game.resPool.get("zebras").value > 1);
		},
		unlocked: false,
	},{
		name: "winterIsComing",
		title: "Winter Is Coming",
		description: "Have 10 kittens dead",
		unethical: true,
		condition: function(){
			return (this.game.deadKittens >= 10);
		},
		unlocked: false
	},{
		name: "youMonster",
		title: "You Monster",
		unethical: true,
		description: "Poor kittens.",
		condition: function(){
			return (this.game.deadKittens >= 100);
		},
		unlocked: false
	},{
		name: "superUnethicalClimax",
		title: "Super Unethical Climax",
		unethical: true,
		description: "Cheat your way through the game.",
		condition: function(){
			return (this.game.cheatMode);
		},
		unlocked: false
	},{
		name: "lotusMachine",
		title: "Lotus Eater Machine",
		description: "Break the cycle of reincarnations",
		condition: function(){
			return (this.game.resPool.get("karma").value >= 1);
		},
		unlocked: false
	},{
		name: "serenity",
		title: "Serenity",
		description: "Have 50 kittens without losing any of them",
		condition: function(){
			return (this.game.village.getKittens() >= 50 && this.game.deadKittens == 0);
		},
		unlocked: false
	},
	{
		name: "utopiaProject",
		title: "Utopia Project",
		description: "Get a total happiness of over 150%",
		condition: function(){
			return (this.game.village.happiness >= 1.5 && this.game.resPool.get("kittens").value > 35);
		},
		unlocked: false
	}
	],

	constructor: function(game){
		this.game = game;
	},

	get: function(name){
		for( var i = 0; i< this.achievements.length; i++){
			if (this.achievements[i].name == name){
				return this.achievements[i];
			}
		}
	},

	hasUnlocked: function(){
		for( var i = 0; i< this.achievements.length; i++){
			if (this.achievements[i].unlocked){
				return true;
			}
		}
		return false;
	},

	update: function(){
		for (var i = 0; i< this.achievements.length; i++){
			var ach = this.achievements[i];
			if (!ach.unlocked && dojo.hitch(this, ach.condition)()){
				ach.unlocked = true;
				this.game.msg("Achievement unlocked: " + ach.title + "!");
				this.game.achievementTab.visible = true;
			}
		}
	},

	save: function(saveData){
		saveData.achievements = this.achievements;
	},

	load: function(saveData){
		var ach = saveData.achievements;
		if (!ach || !ach.length){
			return;
		}
		for(var i = 0; i< ach.length; i++){
			var savedAch = ach[i];

			var a = this.get(savedAch.name);
			a.unlocked = savedAch.unlocked;
		}
	}
});

dojo.declare("com.nuclearunicorn.game.ui.tab.AchTab", com.nuclearunicorn.game.ui.tab, {
	render: function(content){
		var div = dojo.create("div", { }, content);

		div.innerHTML = "";
		for (var i = 0; i< this.game.achievements.achievements.length; i++){
			var ach = this.game.achievements.achievements[i];
			if (ach.unlocked){
				var unethicalClass = ach.unethical ? "unethical" : "";
				div.innerHTML += "<span class='achievement " + unethicalClass + "' style='cursor:pointer' title= '" + ach.description + "'>" + ach.title + "</span>";
			} else {
				div.innerHTML += "<span class='achievement' style='cursor:pointer' title= '???'>???</span>";
			}
		}
	}
});
