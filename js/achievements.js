dojo.declare("classes.managers.Achievements", com.nuclearunicorn.core.TabManager, {
    game: null,

    achievements: [
        {
            name: "theElderLegacy",
            title: $I("achievements.theElderLegacy.title"),
            description: $I("achievements.theElderLegacy.desc"),
            condition: function () {
                var date = new Date();
                return (date.getMonth() == 0 && date.getFullYear() == 2017);
            },
            hidden: true
        },
        {
            name: "unicornConspiracy",
            title: $I("achievements.unicornConspiracy.title"),
            description: $I("achievements.unicornConspiracy.desc"),
            condition: function () {
                return ( this.game.resPool.get("unicorns").value > 0 );
            }
        }, {
            name: "uniception",
            title: $I("achievements.uniception.title"),
            description: $I("achievements.uniception.desc"),
            condition: function () {
                return ( this.game.resPool.get("tears").value > 0 );
            }
        }, {
            name: "sinsOfEmpire",
            title: $I("achievements.sinsOfEmpire.title"),
            description: $I("achievements.sinsOfEmpire.desc"),
            condition: function () {
                return ( this.game.resPool.get("alicorn").value > 0 );
            }
        }, {
            name: "anachronox",
            title: $I("achievements.anachronox.title"),
            description: $I("achievements.anachronox.desc"),
            condition: function () {
                return ( this.game.resPool.get("timeCrystal").value > 0 );
            }
        }, {
            name: "deadSpace",
            title: $I("achievements.deadSpace.title"),
            description: $I("achievements.deadSpace.desc"),
            condition: function () {
                return ( this.game.resPool.get("necrocorn").value > 0 );
            }
        }, {
            name: "ironWill",
            title: $I("achievements.ironWill.title"),
            description: $I("achievements.ironWill.desc"),
            condition: function () {
                return ( this.game.ironWill && !this.game.resPool.get("kittens").value && this.game.bld.get("mine").val > 0 );
            }
        }, {
            name: "uberkatzhen",
            title: $I("achievements.uberkatzhen.title"),
            description: $I("achievements.uberkatzhen.desc"),
            condition: function () {
                return ( this.game.ironWill && !this.game.resPool.get("kittens").value && this.game.bld.get("warehouse").val > 0 );
            }
        }, {
            name: "hundredYearsSolitude",
            title: $I("achievements.hundredYearsSolitude.title"),
            description: $I("achievements.hundredYearsSolitude.desc"),
            condition: function () {
                return ( this.game.ironWill && !this.game.resPool.get("kittens").value && this.game.bld.get("steamworks").val > 0 );
            }
        }, {
            name: "soilUptuned",
            title: $I("achievements.soilUptuned.title"),
            description: $I("achievements.soilUptuned.desc"),
            condition: function () {
                return ( this.game.ironWill && !this.game.resPool.get("kittens").value && this.game.bld.get("pasture").val >= 45 );
            }
        }, {
            name: "atlasUnmeowed",
            title: $I("achievements.atlasUnmeowed.title"),
            description: $I("achievements.atlasUnmeowed.desc"),
            condition: function () {
                return ( this.game.ironWill && !this.game.resPool.get("kittens").value && this.game.bld.get("magneto").val > 0 );
            }
        }, {
            name: "meowMeowRevolution",
            title: $I("achievements.meowMeowRevolution.title"),
            description: $I("achievements.meowMeowRevolution.desc"),
            condition: function () {
                return ( this.game.ironWill && !this.game.resPool.get("kittens").value && this.game.bld.get("factory").val > 0 );
            }
        }, {
            name: "spaceOddity",
            title: $I("achievements.spaceOddity.title"),
            description: $I("achievements.spaceOddity.desc"),
            starDescription: $I("achievements.spaceOddity.starDesc"),
            condition: function () {
                return ( this.game.ironWill && this.game.space.getProgram("moonMission").on );
            },
            starCondition: function () {
                return ( this.game.ironWill && this.game.space.getProgram("moonMission").on && this.game.resPool.get("paragon").value < 10);
            },
            hasStar: true
        }, {
            name: "jupiterAscending",
            title: $I("achievements.jupiterAscending.title"),
            description: $I("achievements.jupiterAscending.desc"),
            condition: function () {
                return ( this.game.space.getProgram("orbitalLaunch").on && this.game.calendar.year <= 1);
            }
        }, {
            name: "shadowOfTheColossus",
            title: $I("achievements.shadowOfTheColossus.title"),
            description: $I("achievements.shadowOfTheColossus.desc"),
            condition: function () {
                return ( this.game.bld.get("ziggurat").val > 0 && this.game.village.maxKittens == 1);
            }
        }, {
            name: "sunGod",
            title: $I("achievements.sunGod.title"),
            description: $I("achievements.sunGod.desc"),
            condition: function () {
                return ( this.game.religion.faith >= 696342 );
            }
        }, {
            name: "heartOfDarkness",
            title: $I("achievements.heartOfDarkness.title"),
            description: $I("achievements.heartOfDarkness.desc"),
            condition: function () {
                return (this.game.resPool.get("zebras").value > 1);
            }
        }, {
            name: "winterIsComing",
            title: $I("achievements.winterIsComing.title"),
            description: $I("achievements.winterIsComing.desc"),
            unethical: true,
            condition: function () {
                return (this.game.deadKittens >= 10);
            }
        }, {
            name: "youMonster",
            title: $I("achievements.youMonster.title"),
            unethical: true,
            description: $I("achievements.youMonster.desc"),
            condition: function () {
                return (this.game.deadKittens >= 100);
            }
        }, {
            name: "superUnethicalClimax",
            title: $I("achievements.superUnethicalClimax.title"),
            unethical: true,
            description: $I("achievements.superUnethicalClimax.desc"),
            condition: function () {
                return (this.game.cheatMode);
            }
        }, {
            name: "systemShock",
            title: $I("achievements.systemShock.title"),
            unethical: true,
            description: $I("achievements.systemShock.desc"),
            condition: function () {
                return (this.game.systemShockMode);
            }
        },
        {
            name: "lotusMachine",
            title: $I("achievements.lotusMachine.title"),
            description: $I("achievements.lotusMachine.desc"),
            condition: function () {
                return (this.game.resPool.get("karma").value >= 1);
            }
        }, {
            name: "serenity",
            title: $I("achievements.serenity.title"),
            description: $I("achievements.serenity.desc"),
            condition: function () {
                return (this.game.village.getKittens() >= 50 && this.game.deadKittens == 0);
            }
        },
        {
            name: "utopiaProject",
            title: $I("achievements.utopiaProject.title"),
            description: $I("achievements.utopiaProject.desc"),
            starDescription: $I("achievements.utopiaProject.starDesc"),
            condition: function () {
                return (this.game.village.happiness >= 1.5 && this.game.resPool.get("kittens").value > 35);
            },
            starCondition: function () {
                return (this.game.village.happiness >= 5 && this.game.resPool.get("kittens").value > 35);
            },
            hasStar: true
        }, {
            name: "cathammer",
            title: $I("achievements.cathammer.title"),
            description: $I("achievements.cathammer.desc"),
            starDescription: $I("achievements.cathammer.starDesc"),
            condition: function () {
                return this.game.stats.getStat("totalYears").val >= 40000;
            },
            starCondition: function () {
                return (this.game.calendar.year >= 40000 + this.game.time.flux);
            },
            hasStar: true
        }, {
            name: "limitlessClicker",
            title: $I("achievements.limitlessClicker.title"),
            description: $I("achievements.limitlessClicker.desc"),
            starDescription: $I("achievements.limitlessClicker.starDesc"),
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
                this.game.msg($I("achievements.msg.unlock", [ach.title]));
                this.game.achievementTab.visible = true;

                this.updateStatistics();
            }
            if (ach.hasStar && !ach.starUnlocked && dojo.hitch(this, ach.starCondition)()) {
                ach.starUnlocked = true;
                this.game.msg($I("achievements.msg.starUnlock", [ach.title]));
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
    },

    unlockAll: function(){
        for (var i in this.achievements){
            this.achievements[i].unlocked = true;
        }
        this.game.msg("All achievements are unlocked");
    }
});

dojo.declare("com.nuclearunicorn.game.ui.tab.AchTab", com.nuclearunicorn.game.ui.tab, {
	render: function(content){
		var div = dojo.create("div", { }, content);

		div.innerHTML = "";
        var divHeader = dojo.create("div", {}, div);
        var totalAchievements = 0; /*this.game.achievements.achievements.length*/;
        var completedAchievements = 0;
		for (var i in this.game.achievements.achievements){
			var ach = this.game.achievements.achievements[i];
            if (!ach.unlocked && ach.hidden){
                continue;
            }

            totalAchievements++;

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
        divHeader.innerHTML = $I("achievements.header", [completedAchievements, totalAchievements]);
	}
});
