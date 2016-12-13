dojo.declare("classes.managers.Achievements", com.nuclearunicorn.core.TabManager, {
    game: null,

    achievements: [
        {
            name: "unicornConspiracy",
            title: "Unicorn Conspiracy",
            description: "Lift the shroud of the Unicorn conspiracy!",
            condition: function () {
                return ( this.game.resPool.get("unicorns").value > 0 );
            }
        }, {
            name: "uniception",
            title: "Uniception",
            description: "Find the conspiracy within the conspiracy",
            condition: function () {
                return ( this.game.resPool.get("tears").value > 0 );
            }
        }, {
            name: "sinsOfEmpire",
            title: "Sins of a Solar Empire",
            description: "Wait, seriously?",
            condition: function () {
                return ( this.game.resPool.get("alicorn").value > 0 );
            }
        }, {
            name: "anachronox",
            title: "Anachronox",
            description: "Please stop",
            condition: function () {
                return ( this.game.resPool.get("timeCrystal").value > 0 );
            }
        }, {
            name: "deadSpace",
            title: "Dead Space",
            description: "In space no one can hear you meow.",
            condition: function () {
                return ( this.game.resPool.get("necrocorn").value > 0 );
            }
        }, {
            name: "ironWill",
            title: "Iron Will",
            description: "You truly deserved this",
            condition: function () {
                return ( this.game.ironWill && !this.game.resPool.get("kittens").value && this.game.bld.get("mine").val > 0 );
            }
        }, {
            name: "uberkatzhen",
            title: "Uberkatzchen",
            description: "What does not kill you makes you stronger",
            condition: function () {
                return ( this.game.ironWill && !this.game.resPool.get("kittens").value && this.game.bld.get("warehouse").val > 0 );
            }
        }, {
            name: "hundredYearsSolitude",
            title: "One Hundred Years of Solitude",
            description: "How far is too far?",
            condition: function () {
                return ( this.game.ironWill && !this.game.resPool.get("kittens").value && this.game.bld.get("steamworks").val > 0 );
            }
        }, {
            name: "soilUptuned",
            title: "Virgin Soil Upturned",
            description: "Have 45 pastures in Iron Will mode",
            condition: function () {
                return ( this.game.ironWill && !this.game.resPool.get("kittens").value && this.game.bld.get("pasture").val >= 45 );
            }
        }, {
            name: "atlasUnmeowed",
            title: "Atlas Unmeowed",
            description: "Construct a magneto in Iron Will mode",
            condition: function () {
                return ( this.game.ironWill && !this.game.resPool.get("kittens").value && this.game.bld.get("magneto").val > 0 );
            }
        }, {
            name: "meowMeowRevolution",
            title: "Meow Meow Revolution",
            description: "Construct a factory in Iron Will mode",
            condition: function () {
                return ( this.game.ironWill && !this.game.resPool.get("kittens").value && this.game.bld.get("factory").val > 0 );
            }
        }, {
            name: "spaceOddity",
            title: "Space Oddity",
            description: "Complete a Moon Program in Iron Will mode",
            starDescription: "Get Moon Program in IW without any paragon points",
            condition: function () {
                return ( this.game.ironWill && this.game.space.getProgram("moonMission").on );
            },
            starCondition: function () {
                return ( this.game.ironWill && this.game.space.getProgram("moonMission").on && this.game.resPool.get("paragon").value < 10);
            },
            hasStar: true
        }, {
            name: "jupiterAscending",
            title: "Jupiter Ascending",
            description: "Get to the space on a first year",
            condition: function () {
                return ( this.game.space.getProgram("orbitalLaunch").on && this.game.calendar.year <= 1);
            }
        }, {
            name: "shadowOfTheColossus",
            title: "Shadow Of The Colossus",
            description: "Build a Ziggurat having only one kitten",
            condition: function () {
                return ( this.game.bld.get("ziggurat").val > 0 && this.game.village.maxKittens == 1);
            }
        }, {
            name: "sunGod",
            title: "Sun God",
            description: "Gain a total of 696,342 accumulated faith",
            condition: function () {
                return ( this.game.religion.faith >= 696342 );
            }
        }, {
            name: "heartOfDarkness",
            title: "Heart Of Darkness",
            description: "Become the chieftain of a zebra tribe. (How is this even possible?)",
            condition: function () {
                return (this.game.resPool.get("zebras").value > 1);
            }
        }, {
            name: "winterIsComing",
            title: "Winter Is Coming",
            description: "Have 10 kittens dead",
            unethical: true,
            condition: function () {
                return (this.game.deadKittens >= 10);
            }
        }, {
            name: "youMonster",
            title: "You Monster",
            unethical: true,
            description: "Poor kittens.",
            condition: function () {
                return (this.game.deadKittens >= 100);
            }
        }, {
            name: "superUnethicalClimax",
            title: "Super Unethical Climax",
            unethical: true,
            description: "Cheat your way through the game.",
            condition: function () {
                return (this.game.cheatMode);
            }
        }, {
            name: "lotusMachine",
            title: "Lotus Eater Machine",
            description: "Break the cycle of reincarnations",
            condition: function () {
                return (this.game.resPool.get("karma").value >= 1);
            }
        }, {
            name: "serenity",
            title: "Serenity",
            description: "Have 50 kittens without losing any of them",
            condition: function () {
                return (this.game.village.getKittens() >= 50 && this.game.deadKittens == 0);
            }
        },
        {
            name: "utopiaProject",
            title: "Utopia Project",
            description: "Get a total happiness of over 150%",
            starDescription: "Get a total happiness of over 500%",
            condition: function () {
                return (this.game.village.happiness >= 1.5 && this.game.resPool.get("kittens").value > 35);
            },
            starCondition: function () {
                return (this.game.village.happiness >= 5 && this.game.resPool.get("kittens").value > 35);
            },
            hasStar: true
        }, {
            name: "cathammer",
            title: "Cathammer 40K",
            description: "In the grim and dark future of a catkind",
            starDescription: "In the grim and dark future of a catkind there are no resets",
            condition: function () {
                return this.game.stats.getStat("totalYears").val >= 40000;
            },
            starCondition: function () {
                return (this.game.calendar.year >= 40000 + this.game.time.flux);
            },
            hasStar: true
        }, {
            name: "limitlessClicker",
            title: "Limitless Clicker",
            description: "Accumulate 100,000 clicks.",
            starDescription: "Accumulate 1,000,000 clicks.",
            condition: function () {
                return (this.game.stats.getStat("totalClicks").val >= 100000);
            },
            starCondition: function () {
                return (this.game.stats.getStat("totalClicks").val >= 1000000);
            },
            hasStar: true
        }],

    constructor: function (game) {
        this.game = game;
    },

    get: function (name) {
        for (var i = 0; i < this.achievements.length; i++) {
            if (this.achievements[i].name == name) {
                return this.achievements[i];
            }
        }
    },

    hasUnlocked: function () {
        for (var i = 0; i < this.achievements.length; i++) {
            if (this.achievements[i].unlocked) {
                return true;
            }
        }
        return false;
    },

    update: function () {
        for (var i = 0; i < this.achievements.length; i++) {
            var ach = this.achievements[i];
            if (!ach.unlocked && dojo.hitch(this, ach.condition)()) {
                ach.unlocked = true;
                this.game.msg("Achievement unlocked: " + ach.title + "!");
                this.game.achievementTab.visible = true;

                this.updateStatistics();
            }
            if (ach.hasStar && !ach.starUnlocked && dojo.hitch(this, ach.starCondition)()) {
                ach.starUnlocked = true;
                this.game.msg("Achievement star unlocked: " + ach.title + "!");
                this.game.achievementTab.visible = true;

                this.updateStatistics();
            }
        }
    },

    updateStatistics: function () {
        if (this.game.kongregate) {

            var achievementsCount = 0;
            for (var i = 0; i < this.achievements.length; i++) {
                var ach = this.achievements[i];
                if (ach.unlocked) {
                    achievementsCount++;

                    this.game.kongregate.stats.submit("achievement_" + ach.name, 1);
                }
            }

            this.game.kongregate.stats.submit("achievements", achievementsCount);
        }
    },

	resetState: function(){
		for (var i = 0; i < this.achievements.length; i++){
			var ach = this.achievements[i];
			ach.unlocked = false;
			ach.starUnlocked = false;
		}
	},

    save: function (saveData) {
        saveData.achievements = this.game.bld.filterMetadata(this.achievements, ["name", "unlocked", "starUnlocked"]);
    },

    load: function (saveData) {
		this.loadMetadata(this.achievements, saveData.achievements);
    }
});

dojo.declare("com.nuclearunicorn.game.ui.tab.AchTab", com.nuclearunicorn.game.ui.tab, {
	render: function(content){
		var div = dojo.create("div", { }, content);

		div.innerHTML = "";
        var divHeader = dojo.create("div", {}, div);
        var totalAchievements = this.game.achievements.achievements.length;
        var completedAchievements = 0;
		for (var i in this.game.achievements.achievements){
			var ach = this.game.achievements.achievements[i];
            if (ach.unlocked) { completedAchievements++; }
            var className = "achievement";
            if (ach.unlocked && ach.unethical) className += " unethical";
            if (ach.unlocked) className += " unlocked";
            if (ach.starUnlocked) className += " starUnlocked";
			var span = dojo.create("span", {
				className: className,
				title: ach.unlocked ? ach.description : "???",
				innerHTML : ach.unlocked ? ach.title : "???"
			}, div);

			if (!ach.hasStar) {
				continue;
			}

			var star = dojo.create("div", {
                className: 'star',
				innerHTML: ach.starUnlocked ? "&#9733;" : "&#9734;",
				title: ach.starUnlocked ? ach.starDescription : "???"
			}, span);
		}
        divHeader.innerHTML = "Achievements: " + completedAchievements + " of " + totalAchievements;
	}
});
