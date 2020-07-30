dojo.declare("classes.managers.NummonStatsManager", com.nuclearunicorn.core.TabManager, {
    
    game: null,
    
    roundThisNumber: function(num){
        num*=1000;
        num+=.5;
        num=Math.floor(num);
        num/=1000;
        return num;
    },
     
    getButton: function(tab, buttonName){
        for(var i in this.game.tabs[tab].buttons){
            if(this.game.tabs[tab].buttons[i].opts.building == buttonName)
                return parseInt(i);
        }
    },

    makeNiceString: function(num, numDigits = 3){
        if(typeof(num) == "number" && num != Infinity){
            num = num.toFixed(numDigits);
            num = num.toString();
            var decimal = num.substr(num.indexOf("."));
            if(decimal == "." + Array(numDigits + 1).join("0"))
                num = num.substr(0,num.indexOf("."));
            for(var i = (num.indexOf(".") != -1 ? num.indexOf(".") - 3 : num.length - 3); i > 0; i -= 3)
                num = num.substr(0,i) + "," + num.substr(i);
        }
        else
            num = num.toString();
        return num;
    },

    getBestUniBuilding: function(log=false){
        if (this.game.bld.getBuildingExt("unicornPasture").meta.val == 0) {return "独角兽牧场";}
        var validBuildings = ["unicornTomb","ivoryTower","ivoryCitadel","skyPalace","unicornUtopia","sunspire"];
        var pastureButton = this.getButton(0, "unicornPasture");
        var unicornsPerSecond = this.game.getEffect("unicornsPerTickBase") * this.game.getRateUI();
        var globalRatio = this.game.getEffect("unicornsGlobalRatio")+1;
        var religionRatio = this.game.getEffect("unicornsRatioReligion")+1;
        var paragonRatio = this.game.prestige.getParagonProductionRatio()+1;
        var faithBonus = this.game.religion.getProductionBonus()/100+1;
        var cycle = 1;
        if(this.game.calendar.cycles[this.game.calendar.cycle].festivalEffects["unicorns"]!=undefined)
            if(this.game.prestige.getPerk("numeromancy").researched && this.game.calendar.festivalDays)
                cycle=this.game.calendar.cycles[this.game.calendar.cycle].festivalEffects["unicorns"];
        var onZig = Math.max(this.game.bld.getBuildingExt("ziggurat").meta.on,1);
        var total = unicornsPerSecond * globalRatio * religionRatio * paragonRatio * faithBonus * cycle;
        var baseUnicornsPerRift = 500 * (1 + this.game.getEffect("unicornsRatioReligion") * 0.1);
        var riftChanceRatio = 1;
        if(this.game.prestige.getPerk("unicornmancy").researched)
            riftChanceRatio *= 1.1;
        var baseRift = this.game.getEffect("riftChance") * riftChanceRatio / (10000 * 2) * baseUnicornsPerRift;
        if(log){
            console.log("Unicorns per second: "+total);
            console.log("Base rift per second average: "+baseRift);
        }
        var bestAmoritization = Infinity;
        var bestBuilding = "";
        var pastureAmor = this.game.bld.getBuildingExt("unicornPasture").meta.effects["unicornsPerTickBase"] * this.game.getRateUI();
        pastureAmor = pastureAmor * globalRatio * religionRatio * paragonRatio * faithBonus * cycle;
        if(log){
            console.log("unicornPasture");
            console.log("\tBonus unicorns per second: "+pastureAmor);
        }
        pastureAmor = this.game.tabs[0].buttons[pastureButton].model.prices[0].val / pastureAmor;
        if(log){
            var baseWait = gamePage.tabs[0].buttons[pastureButton].model.prices[0].val / total;
            var avgWait = gamePage.tabs[0].buttons[pastureButton].model.prices[0].val / (total + baseRift);
            console.log("\tMaximum time to build: " + gamePage.toDisplaySeconds(baseWait) + " | Average time to build: " + gamePage.toDisplaySeconds(avgWait));
            console.log("\tPrice: "+gamePage.tabs[0].buttons[pastureButton].model.prices[0].val+" | Amortization: "+gamePage.toDisplaySeconds(pastureAmor));
        }
        if(pastureAmor < bestAmoritization){
            bestAmoritization = pastureAmor;
            bestBuilding = "独角兽牧场";
        }
        for(var i in this.game.tabs[5].zgUpgradeButtons){
            var btn = this.game.tabs[5].zgUpgradeButtons[i];
            if(validBuildings.indexOf(btn.id)!=-1){
                if(btn.model.visible){
                    unicornPrice = 0;
                    for(var j in btn.model.prices){
                        if(btn.model.prices[j].name=="unicorns")
                            unicornPrice += btn.model.prices[j].val;
                        if(btn.model.prices[j].name=="tears")
                            unicornPrice += btn.model.prices[j].val * 2500 / onZig;
                    }
                    var bld=this.game.religion.getZU(btn.id);
                    var relBonus = religionRatio;
                    var riftChance = this.game.getEffect("riftChance");
                    for(var j in bld.effects){
                        if(j=="unicornsRatioReligion")
                            relBonus += bld.effects[j]
                        if(j=="riftChance")
                            riftChance += bld.effects[j];
                    }
                    var unicornsPerRift = 500 * ((relBonus -1) * 0.1 +1);
                    var riftBonus = riftChance * riftChanceRatio / (10000 * 2) * unicornsPerRift;
                    riftBonus -= baseRift;
                    var amor = unicornsPerSecond * globalRatio * relBonus * paragonRatio * faithBonus * cycle;
                    amor -= total;
                    amor = amor + riftBonus;
                    if(log){
                        console.log(btn.id);
                        console.log("\tBonus unicorns per second: "+amor);
                    }
                    amor = unicornPrice / amor;
                    if(log){
                        var baseWait = unicornPrice / total;
                        var avgWait = unicornPrice / (total + baseRift);
                        var amorSeconds = gamePage.toDisplaySeconds(amor);
                        if(amorSeconds == "")
                            amorSeconds = "NA";
                        console.log("\tMaximum time to build: " + gamePage.toDisplaySeconds(baseWait) + " | Average time to build: " + gamePage.toDisplaySeconds(avgWait));
                        console.log("\tPrice: "+unicornPrice + " | Amortization: "+amorSeconds);
                    }
                    if(amor < bestAmoritization)
                        if(riftBonus > 0 || relBonus > religionRatio && unicornPrice > 0){
                            bestAmoritization = amor;
                            switch (btn.id) {
								case 'unicornTomb':
									bestBuilding = '独角兽坟墓';
									break;
								case 'ivoryTower':
									bestBuilding = '象牙塔';
									break;
								case 'ivoryCitadel':
									bestBuilding = '象牙城堡';
									break;
								case 'skyPalace':
									bestBuilding = '天空宫殿';
									break;
								case 'unicornUtopia':
									bestBuilding = '独角兽理想国';
									break;
								case 'sunspire':
									bestBuilding = '青睐之光';
									break;
							}
                        }
                }
            }
        }
        return bestBuilding;
    },

    getUraniumForThoriumReactors: function(){
        var needed = 250 * .1875 * this.game.bld.getBuildingExt("reactor").meta.val;
        needed /= 1 + this.game.getResCraftRatio({name:"thorium"});
        needed = Math.round(needed * 1000) / 1000;
        return needed;
    },

    getBlueprintCraft: function(){
        return 1 + this.game.getResCraftRatio({ name: "blueprint" });
    },

    getPraiseLoss: function(){
        var tier = this.game.religion.getTranscendenceLevel() + 1;
        var tt=game.religion.getTranscendenceRatio(tier)-game.religion.getTranscendenceRatio(tier-1);
        var perc = this.game.religion.faithRatio / tt * 100;
        var before = Math.round(this.game.religion.getTriValueReligion(tt * perc / 100) * 100);
        var after = Math.round(game.religion.getTriValueReligion(tt * (perc - 100) / 100) * 100);
        var loss = Math.round(before - after);
        var lossRatio = 100 * loss / before;
        perc = Math.round(perc * 1000) / 1000;
        return perc + "%";
        /*var str = "To tier: ";
        str += tier;
        str += "\n Progress: ";
        str += this.makeNiceString(perc);
        str += "%\n Before: ";
        str += this.makeNiceString(before);
        str += "%\n After: ";
        str += this.makeNiceString(after);
        str += "%\n Loss: ";
        str += this.makeNiceString(loss);
        str += "%\n Loss ratio: ";
        str += this.makeNiceString(lossRatio);
        str += "%";
        return str;*/
    },
    
    getNecrocornsPerSecond: function(){
        var numAlicorns = this.game.resPool.get("alicorn").value;
        var curCorruption = this.game.religion.corruption;
        var blsBoost = 1 + Math.sqrt(this.game.resPool.get("sorrow").value * this.game.getEffect("blsCorruptionRatio"));
        var corruptionRate = 1;
        if(this.game.resPool.get("necrocorn").value > 0)
            corruptionRate = 0.25 * (1+ this.game.getEffect("corruptionBoostRatio"));
        corruptionRate *= this.game.getEffect("corruptionRatio") * blsBoost;
        if(numAlicorns <= 0){
            curCorruption = 0;
            corruptionRate = 0;
        }
        corruptionRate *= this.game.getRateUI();
        corruptionRate = Math.floor(corruptionRate * 100000) / 100000;
        if(corruptionRate == Infinity)
            return "Infinity";
        return corruptionRate + "/秒";
    },

    getNecrocornTime: function(){
        var numAlicorns = this.game.resPool.get("alicorn").value;
        var curCorruption = this.game.religion.corruption;
        var blsBoost = 1 + Math.sqrt(this.game.resPool.get("sorrow").value * this.game.getEffect("blsCorruptionRatio"));
        var corruptionRate = 1;
        if(this.game.resPool.get("necrocorn").value > 0)
            corruptionRate = 0.25 * (1 + this.game.getEffect("corruptionBoostRatio"));
        corruptionRate *= this.game.getEffect("corruptionRatio") * blsBoost;
        if(numAlicorns <= 0){
            curCorruption = 0;
            corruptionRate = 0;
        }
        if(corruptionRate == 0)
            return "Infinity";
        return this.game.toDisplaySeconds( (1 - curCorruption) / (corruptionRate * this.game.getRateUI()) );
    },

    getLeviChance: function(){
        var numPyramids = this.game.religion.getZU("blackPyramid").val;
        var numMarkers = this.game.religion.getZU("marker").val;
        var chance = this.roundThisNumber(35 * numPyramids * (1 + 0.1 * numMarkers) / 10);
        return chance + "%";
    },

    getReligionProductionBonusCap: function(){
        var transcendTier = this.game.religion.getTranscendenceLevel();
        var numObelisks = this.game.religion.getTU("blackObelisk").val;
        var atheismBonus = 0;
        if((this.game.challenges.getChallenge("atheism").researched))
            atheismBonus = this.game.religion.getTranscendenceLevel() * 0.1;
        var result = 1000 * (transcendTier * numObelisks * .005 + atheismBonus + 1);
        return result + "%";
    },
    
    getCelestialPerDay: function(){
        var chanceRatio = 1;
        if(this.game.prestige.getPerk("chronomancy").researched)
            chanceRatio *= 1.1;
        chanceRatio *= 1 + this.game.getEffect("timeRatio") * 0.25;
        
        var chance = 25;
        chance += this.game.getEffect("starEventChance") * 10000;
        chance *= chanceRatio;
        if(this.game.prestige.getPerk("astromancy").researched)
            chance *= 2;
        
        chance = Math.round(chance);
        chance /= 100;//It's out of 10,000 originally
        return chance + "%";
    },
    
    getCelestialAutoSuccess: function(){
        var autoChance = this.game.getEffect("starAutoSuccessChance") * 100;
        if(this.game.prestige.getPerk("astromancy").researched)
            autoChance *= 2;
        if(autoChance > 100)
            autoChance = 100;
        return autoChance + "%";
    },
    
    getTitPerZebraTrade: function(){
        var titaniumPerTrade = this.game.resPool.get("ship").value / 100 * 1.5 * 2 + 1.5;
        return titaniumPerTrade;
    },
    
    getZebraTradesToMaxTit: function(){
        var titaniumPerTrade = this.getTitPerZebraTrade();
        var maxTitanium = this.game.resPool.get("titanium").maxValue;
        return Math.ceil(maxTitanium / titaniumPerTrade);
    },
    
    getZebraTradesLeftToMaxTit: function(){
        var titaniumPerTrade = this.getTitPerZebraTrade();
        var titToFill = this.game.resPool.get("titanium").maxValue;
        titToFill -= this.game.resPool.get("titanium").value;
        titToFill = Math.ceil(titToFill / titaniumPerTrade);
        if(titToFill < 0)
            titToFill = 0;
        return titToFill;
    },

    getTCPerSacrifice: function(){
        var numTCPerSacrifice = 1;
        numTCPerSacrifice += this.game.getEffect("tcRefineRatio");
        return numTCPerSacrifice;
    },

    getRelicPerTCRefine: function(){
        return 1 + game.getEffect("relicRefineRatio") * game.religion.getZU("blackPyramid").val;
    },

    setCatnipArray: function(finalResult, theoreticalQuantity, actualQuantity, operation = "*"){
        actualQuantity = actualQuantity || theoreticalQuantity;
        for(var season in finalResult["theoretical"])
            for(var weather in finalResult["theoretical"][season]){
                switch(operation){
                    case "+":
                        finalResult["theoretical"][season][weather] += theoreticalQuantity;
                        break;
                    case "-":
                        finalResult["theoretical"][season][weather] -= theoreticalQuantity;
                        break;
                    case "/":
                        finalResult["theoretical"][season][weather] /= theoreticalQuantity;
                        break;
                    default:
                        finalResult["theoretical"][season][weather] *= theoreticalQuantity;
                }
            }
        for(var season in finalResult["actual"])
            for(var weather in finalResult["actual"][season]){
                switch(operation){
                    case "+":
                        finalResult["actual"][season][weather] += actualQuantity;
                        break;
                    case "-":
                        finalResult["actual"][season][weather] -= actualQuantity;
                        break;
                    case "/":
                        finalResult["actual"][season][weather] /= actualQuantity;
                        break;
                    default:
                        finalResult["actual"][season][weather] *= actualQuantity;
                }
            }
    },

    getCatnipInSeasons: function(log = false){
        var finalResult = {theoretical: {},
                           actual: {}};
        var catnip = this.game.resPool.get("catnip");
        //Buildings
        var theoreticalCatnipPerTickBase = this.game.bld.get("field").effects["catnipPerTickBase"];
        var numFields = this.game.bld.get("field").on;
        var theoreticalCatnipPerTickTotal = theoreticalCatnipPerTickBase * numFields;
        var actualCatnipPerTickTotal = this.game.getEffect("catnipPerTickBase");
        if(log)
            console.log("---INITIAL CATH BUILDING PRODUCTION---" +
                      "\nCatnip per field per tick: " + theoreticalCatnipPerTickBase +
                      "\nNumber of fields: " + numFields +
                      "\nTotal theoretical catnip from fields per tick: " + theoreticalCatnipPerTickTotal +
                      "\nActual catnip from fields per tick: " + actualCatnipPerTickTotal);
        //Space ratio - does nothing. Skipping.
        //=========================================================================================
        //Add space catnip to normal - does nothing. Skipping.
        //=========================================================================================
        //Weather effects
        if(log)
            console.log("---SETTING UP SEASONS AND WEATHER---");
        var weather = {normal: 0,
                       warm: 0.15,
                       cold: -0.15};
        var seasons = this.game.calendar.seasons;
        for(var i in seasons){
            finalResult["theoretical"][seasons[i].name] = {};
            finalResult["actual"][seasons[i].name] = {};
            for(var j in weather){
                finalResult["theoretical"][seasons[i].name][j] = (seasons[i].modifiers["catnip"] || 1) + weather[j];
                if(finalResult["theoretical"][seasons[i].name][j] < -0.95)
                    finalResult["theoretical"][seasons[i].name][j] = -0.95;
                finalResult["theoretical"][seasons[i].name][j] *= theoreticalCatnipPerTickTotal;
                finalResult["actual"][seasons[i].name][j] = (seasons[i].modifiers["catnip"] || 1) + weather[j];
                if(finalResult["actual"][seasons[i].name][j] < -0.95)
                    finalResult["actual"][seasons[i].name][j] = -0.95;
                finalResult["actual"][seasons[i].name][j] *= actualCatnipPerTickTotal;
            }
        }
        //Village job production
        var numFarmers = this.game.village.getJob("farmer").value;
        var theoreticalVillageProduction = 1 * numFarmers;//1 catnip per tick per farmer
        var actualVillageProduction = this.game.village.getResProduction()["catnip"] || 0;
        this.setCatnipArray(finalResult, theoreticalVillageProduction, actualVillageProduction, "+");
        if(log)
            console.log("---VILLAGE PRODUCTION (Adds to previous totals)---" +
                      "\nNumber of farmers in village: " + numFarmers +
                      "\nCatnip produced by farmers in theory (1 per tick per farmer): " + theoreticalVillageProduction +
                      "\nActual catnip produced by farmers: " + actualVillageProduction);
        //Village job production workshop modifiers
        var workshopJobModifier = this.game.getEffect("catnipJobRatio");
        this.setCatnipArray(finalResult, theoreticalVillageProduction * workshopJobModifier,
                                    actualVillageProduction * workshopJobModifier, "+");
        if(log)
            console.log("---VILLAGE PRODUCTION BONUS (Adds to previous totals)---" +
                      "\nModifier from workshop: " + workshopJobModifier +
                      "\nTheoretical bonus: " + (theoreticalVillageProduction * workshopJobModifier) +
                      "\nActual bonus: " + (actualVillageProduction * workshopJobModifier));
        //Production boost - doesn't do anything right now. Skipping.
        //=========================================================================================
        //Building and space production
        var aqueduct = this.game.bld.get("aqueduct");
        var numAqueduct = aqueduct.on;
        var aqueductRatio = aqueduct.stages[aqueduct.stage].effects["catnipRatio"] || 0;
        var hydroponics = this.game.space.getBuilding("hydroponics");
        var numHydroponics = hydroponics.on;
        var theoreticalBuildingRatio = aqueductRatio * numAqueduct;
        theoreticalBuildingRatio += hydroponics.effects["catnipRatio"] * numHydroponics;
        theoreticalBuildingRatio += 1;
        var actualBuildingRatio = 1 + this.game.getEffect("catnipRatio");
        this.setCatnipArray(finalResult, theoreticalBuildingRatio, actualBuildingRatio);
        if(log)
            console.log("---CATH AND SPACE PRODUCTION MULTIPLIERS---" +
                      "\nNumber of Aqueducts: " + numAqueduct +
                      "\n-The following Aqueduct ratio will be zero if you've upgraded to Hydro Farms-" +
                      "\nMulitipler per Aqueduct: " + aqueductRatio +
                      "\nTotal multiplier from Aqueducts: " + (aqueductRatio * numAqueduct) +
                      "\nNumber of Hydroponics (space): " + numHydroponics +
                      "\nMultiplier per Hydroponics: " + hydroponics.effects["catnipRatio"] +
                      "\nTotal multiplier from Hydroponics: " + (hydroponics.effects["catnipRatio"] * numHydroponics) +
                      "\nFinal theoretical building ratio: x" + theoreticalBuildingRatio +
                      "\nActual building ratio: x" + actualBuildingRatio);
        //Religion modifiers - doesn't do anything right now. Skipping.
        //=========================================================================================
        //...Super Ratio? Doesn't seem to have anything for it. Skipping.
        //=========================================================================================
        //This would be steamworks here, but in the base it's a hack to only affect coal - skipping
        //=========================================================================================
        //Paragon bonus
        var paragonProd = 1 + this.game.prestige.getParagonProductionRatio();
        if(this.game.challenges.currentChallenge == "winterIsComing")//If we're in this challenge - after challenge rework,
            paragonProd = 0;                                        //it will need to be reworked
        this.setCatnipArray(finalResult, paragonProd);
        if(log)
            console.log("---PARAGON MULTIPLIER---" +
                      "\nParagon production ratio: " + (100 + 100 * paragonProd) + "%");
        //Paragon... Space production? Does nothing for catnip. Skipping.
        //=========================================================================================
        //Magnetos Boost - specifically does not affect catnip. Skipping.
        //=========================================================================================
        //Reactor production bonus - specifically does not affect catnip. Skipping.
        //=========================================================================================
        //SR Faith bonus
        var srBonus = 1 + this.game.religion.getProductionBonus() / 100;
        this.setCatnipArray(finalResult, srBonus);
        if(log)
            console.log("---SOLAR REVOLUTION MULTIPLIER---" +
                      "\nSolar Revolution bonus: " + (100 * srBonus) + "%");
        //Cosmic radiation, most people will probably have this disabled
        if(!this.game.opts.disableCMBR){
            this.setCatnipArray(finalResult,1 + this.game.getCMBRBonus());
            if(log)
                console.log("---COSMIC RADIATION BONUS (offline progression)---" +
                          "\nCosmic Radiation Bonus Ratio: " + (100 + 100 * this.game.getCMBRBonus()) + "%");
        }
        //Last section of paragon space production - does nothing. Skipping.
        //=========================================================================================
        //Automated production building (catnipPerTickProd) - does nothing. Skipping.
        //=========================================================================================
        //Automated space production, full bonus - does nothing. Skipping.
        //=========================================================================================
        //Cycle effects - set in space buildings, none of which produce catnip themselves
        //=========================================================================================
        //Cycle festival effects
        for(var season in finalResult["theoretical"])
            for(var weather in finalResult["theoretical"][season]){
                var tempEffect = {catnip: finalResult["theoretical"][season][weather]};
                this.game.calendar.cycleEffectsFestival(tempEffect);
                finalResult["theoretical"][season][weather] = tempEffect["catnip"];
            }
        for(var season in finalResult["actual"])
            for(var weather in finalResult["actual"][season]){
                var tempEffect = {catnip: finalResult["actual"][season][weather]};
                this.game.calendar.cycleEffectsFestival(tempEffect);
                finalResult["actual"][season][weather] = tempEffect["catnip"];
            }
        if(log)
            console.log("---CYCLE FESTIVAL EFFECTS---" +
                      "\nCharon is x1.5 to catnip. All others do nothing." +
                      "\nAre we in Charon right now? " + (this.game.calendar.cycle == 0 ? "Yes" : "No"));
        //Building and space pertick - does nothing. Skipping.
        //=========================================================================================
        //Consumption
        //Theoretical
        var numKittens = this.game.village.sim.kittens.length;
        var theoreticalCatnipConsumption = -0.85 * numKittens;
        var pastures = this.game.bld.get("pasture");
        var numPastures = pastures.on;
        var unicPastures = this.game.bld.get("unicornPasture");
        var numUnicPastures = unicPastures.on;
        var theoreticalCatnipConsReduction = pastures.effects["catnipDemandRatio"] * numPastures;
        theoreticalCatnipConsReduction += unicPastures.effects["catnipDemandRatio"] * numUnicPastures;
        theoreticalCatnipConsReduction = this.game.getHyperbolicEffect(theoreticalCatnipConsReduction, 1);
        var theoreticalReducedCatnipConsReduction = theoreticalCatnipConsReduction;
        theoreticalCatnipConsumption *= 1 + theoreticalCatnipConsReduction
        var theoreticalHappinessModifier = 0;
        if(numKittens > 0 && this.game.village.happiness > 1){
            var theoreticalHappinessConsumption = Math.max(this.game.village.happiness - 1, 0);
            var theoreticalWorkerRatio = 1 + (this.game.workshop.get("assistance").researched ? -0.25 : 0);
            if(this.game.challenges.currentChallenge == "anarchy")
                theoreticalHappinessModifier = theoreticalCatnipConsumption * theoreticalHappinessConsumption *
                                           theoreticalWorkerRatio;
            else
                theoreticalHappinessModifier = theoreticalCatnipConsumption * theoreticalHappinessConsumption *
                                           theoreticalWorkerRatio *
                                           (1 - this.game.village.getFreeKittens() / numKittens);
        }
        theoreticalCatnipConsumption += theoreticalHappinessModifier;
        //Actual
        var actualCatnipConsumption = this.game.village.getResConsumption()["catnip"] || 0;
        actualCatnipConsumption *= 1 + this.game.getEffect("catnipDemandRatio");
        var actualHappinessModifier = 0;
        if(numKittens > 0 && this.game.village.happiness > 1){
            var actualHappinessConsumption = Math.max(this.game.village.happiness - 1, 0);
            if(this.game.challenges.currentChallenge == "anarchy")
                actualHappinessModifier = actualCatnipConsumption * actualHappinessConsumption *
                                           (1 + this.game.getEffect("catnipDemandWorkerRatioGlobal"));
            else
                actualHappinessModifier = actualCatnipConsumption * actualHappinessConsumption *
                                           (1 + this.game.getEffect("catnipDemandWorkerRatioGlobal")) *
                                           (1 - this.game.village.getFreeKittens() / numKittens);
        }
        actualCatnipConsumption += actualHappinessModifier;
        this.setCatnipArray(finalResult, theoreticalCatnipConsumption, actualCatnipConsumption, "+");
        if(log)
            console.log("---VILLAGE KITTEN CONSUMPTION (Adds to previous total)---" +
                      "\nNumber of kittens: " + numKittens +
                      "\nTheoretical demand per kitten per tick: " + (-0.85) +
                      "\nTotal initial theoretical demand: " + (-0.85 * numKittens) +
                      "\nTotal initial actual demand: " + (this.game.village.getResConsumption()["catnip"] || 0) +
                      "\nNumber of Pastures: " + numPastures +
                      "\n-The following Pasture ratio will be zero if you've upgraded to Solar Farms-" +
                      "\nReduction ratio per Pasture: " + pastures.effects["catnipDemandRatio"] +
                      "\nTotal preliminary reduction ratio for Pastures: " + (pastures.effects["catnipDemandRatio"] * numPastures) +
                      "\nNumber of Unicorn Pastures: " + numUnicPastures +
                      "\nReduction ratio per Unicorn Pasture: " + unicPastures.effects["catnipDemandRatio"] +
                      "\nTotal preliminary reduction ratio for Unicorn Pastures: " + (unicPastures.effects["catnipDemandRatio"] * numUnicPastures) +
                      "\nTotal preliminary reduction ratio: " + (pastures.effects["catnipDemandRatio"] * numPastures + unicPastures.effects["catnipDemandRatio"] * numUnicPastures) +
                      "\nFinal reduction ratio, after diminishing returns: " + theoreticalReducedCatnipConsReduction +
                      "\nActual reduction ratio after diminishing returns: " + this.game.getEffect("catnipDemandRatio") +
                      "\nTheoretical catnip consumption after reduction ratio: " + ((1 + theoreticalReducedCatnipConsReduction) * (-0.85 * numKittens)) +
                      "\nActual catnip consumption after reduction ratio: " + ((this.game.village.getResConsumption()["catnip"] || 0) * (1 + this.game.getEffect("catnipDemandRatio"))) +
                      "\n===HAPPINESS IMPACT===" +
                      "\n    Happiness level: " + (100 * this.game.village.happiness) + "%" +
                      "\n    Are we in the Anarchy challenge? " + (this.game.challenges.currentChallenge == "anarchy" ? "Yes" : "No") +
                      "\n    Have we researched Robotic Assistance (-25% to happiness demand if so)? " + (this.game.workshop.get("assistance").researched ? "Yes" : "No") +
                      "\n    Final theoretical happiness extra consumption: " + theoreticalHappinessModifier +
                      "\n    Final actual happiness consumption: " + actualHappinessModifier +
                      "\nFinal theoretical catnip consumption: " + theoreticalCatnipConsumption +
                      "\nFinal actual catnip consumption: " + actualCatnipConsumption);
        //Adjust from Per Tick to Per Second
        this.setCatnipArray(finalResult, this.game.getRateUI());
        var currentWeather = this.game.calendar.weather;
        if(currentWeather == null)
            currentWeather = "normal";
        var currentActual = finalResult["actual"][this.game.calendar.seasons[this.game.calendar.season].name][currentWeather];
        if(log)
            console.log("---CONVERSION FROM TICKS TO SECONDS---" +
                      "\nNumber of ticks per second: " + this.game.getRateUI() +
                      "\nCurrent predicted actual catnip per second: " + currentActual +
                      "\nCurrent actual catnip per second: " + (catnip.perTickCached * this.game.getRateUI()) +
                      "\nCatnip per second at cold winter: " + finalResult["actual"]["winter"]["cold"]);
        var theoreticalMatches = true;
        for(var season in finalResult["actual"])
            for(var weather in finalResult["actual"][season])
                if(finalResult["theoretical"][season][weather] != finalResult["actual"][season][weather])
                    theoreticalMatches = false;
        if(log)
            console.log("---FINAL SANITY CHECKS---" +
                      "\nDoes the theoretical result match the actual predicted result? " + (theoreticalMatches ? "Yes" : "No") +
                      "\nDoes the actual predicted result match reality? " + (currentActual == (catnip.perTickCached * this.game.getRateUI()) ? "Yes" : "No") + 
                      "\nDoes the actual predicted result closely match reality? " + ((Math.floor(currentActual * 10 + .5) == Math.floor(catnip.perTickCached * this.game.getRateUI() * 10 + .5)) ? "Yes" : "No"));
        return finalResult;
    },
    
    getCatnipColdWinter: function(){
        var catnip = this.getCatnipInSeasons()["actual"]["winter"]["cold"];
        return catnip;
    },
    
    getCatnipInWarmSpring: function(){
        var catnip = this.getCatnipInSeasons()["actual"]["spring"]["warm"];
        return catnip;
    },

    getParagonProductionBonus: function(){
        var prodRatio = this.game.prestige.getParagonProductionRatio() * 100;
        prodRatio = Math.round(prodRatio * 1000) / 1000;
        return prodRatio + "%";
    },

    getParagonStorageBonus: function(){
        var storeRatio = this.game.prestige.getParagonStorageRatio();
        storeRatio = Math.round(storeRatio * 1000) / 1000;
        return storeRatio + "x";
    },
    
    getTradeAmountAvg: function(race){
        var r = null;
        try{
            r = this.game.diplomacy.get(race);
        }
        catch(e){
        }
        if(r){
            var ratio = this.game.diplomacy.getTradeRatio()+ 1;
            var curSeason = this.game.calendar.getCurSeason().name;
            var sells = [];
            for(var j in r.sells){
                var s = r.sells[j];
                var min = 0;
                var max = 0;
                if(r.name == "zebras" && s.name == "titanium"){
                    var ships = this.game.resPool.get("ship").value;
                    var odds = Math.min(15 + ships * 0.35 , 100);
                    var amt = 1.5 * ((ships / 100) * 2 + 1);
                    min = amt;
                    max = amt;
                    sells[s.name] = amt;
                }
                else{
                    var sratio = s.seasons[curSeason];
                    var tratio = ratio;
                    if(r.name == "leviathans")
                        tratio *= (1 + 0.02 * r.energy);
                    var val = sratio * s.value * (1 - s.delta / 2);
                    max = val;
                    max += Math.floor(s.value * sratio * s.delta);
                    val *= tratio;
                    min = val;
                    max *= tratio;
                    var amt = (min + max) / 2;
                    amt *= s.chance / 100;
                    sells[s.name] = amt;
                }
            }
            return sells;
        }
        return []
    },

    getBlazarsForShatterEngine: function(){
        var numRR = this.game.time.getCFU("ressourceRetrieval").val;
        var uoPerYear = game.getResourcePerTick("unobtainium", true) * ( 1 / game.calendar.dayPerTick * game.calendar.daysPerSeason * 4);
        var tcPerTrade = this.getTradeAmountAvg("leviathans")["timeCrystal"];
        var neededUO = 5000 / tcPerTrade;
        var neededPerc = neededUO / uoPerYear;
        var basePerc = numRR * .01;
        var neededBlazars = Math.max(Math.ceil((neededPerc / basePerc - 1) / .02) , 0);
        return neededBlazars;
    },
    
    getMaxComped: function(){
        var scienceBldMax = this.game.bld.getEffect("scienceMax");
        var compCap = this.game.bld.getEffect("scienceMaxCompendia");
        
        var IWRatio = this.game.ironWill ? 10 : 1;
        var blackLibrary = this.game.religion.getTU("blackLibrary");
        if(this.game.prestige.getPerk("codexLeviathanianus").researched){
            var ttBoostRatio = (0.05 * (1 + blackLibrary.val * (blackLibrary.effects["compendiaTTBoostRatio"] + this.game.getEffect("blackLibraryBonus"))));
            IWRatio *= (1 + ttBoostRatio * this.game.religion.getTranscendenceLevel());
        }
        
        var compCapFinal = scienceBldMax * IWRatio + compCap;
        compCapFinal /= 10;
        return compCapFinal;
    },

    getailvup: function(){
		var lv = Math.exp(14.5);
		var g = this.game.resPool.get("gflops").value;
		var s = this.game.getEffect("gflopsPerTickBase") - this.game.getEffect("gflopsConsumption");
		var ss;
		if (s > 0) {
			if (this.game.bld.get("aiCore").effects["aiLevel"] > 14) {
				ss = '天网已觉醒';
			}
			else {
				ss = this.game.toDisplaySeconds((lv - g) / (s * this.game.getRateUI()));
			}
		}
		else {ss = '∞';}
		return ss;
    },

	getamsx: function(){
		if (!this.game.religion.getZU("blackPyramid").val) {return "提升黑金字塔等级";}
        if (this.game.tabs[5].zgUpgradeButtons.length == 0) {this.game.tabs[5].render();}
		var next;
		var cs = Math.floor(Math.log((12 + this.game.religion.getTU("blackCore").val) / 5) / Math.log(1.15)) + 1;
		var cs1 = 0;
		var cs2 = Math.ceil(this.game.tabs[5].zgUpgradeButtons[9].model.prices[1].val) - this.game.resPool.get("sorrow").maxValue;
		// 黑色连结价格
		var bnexus = this.game.tabs[5].ctPanel.children[0].children[1].model.prices[0].val;
		// 黑色核心价格
		var bcore = this.game.tabs[5].ctPanel.children[0].children[2].model.prices[0].val;
		// 下一个黑金字塔需要圣遗物数量
		var a = (Math.pow(1.15,cs2)-1) / 0.15 * bcore;
		// 黑色连结提升产量
		var bnexusup = 0.001 * cs / bnexus;
		// 黑色核心提升产量
		var bcoreup = 0.001 * this.game.religion.getTU("blackNexus").val / a;
		if (cs2 > 0 && bnexusup >= bcoreup) {
			while (bnexusup >= bcoreup) {
				bnexus *= 1.15;
				bnexusup = 0.001 * cs / bnexus;
				bcoreup += 0.001 / a;
				cs1++;
			}
			next = "黑色连结" + " 次数" + cs1;
		}
		else {
			next = "黑色核心" + " 次数" + cs2;
			if (cs2 < 1) {next = "提升黑金字塔等级";}
		}
        return next;
    },

	getDarkFutureYears: function(){
		return this.game.calendar.darkFutureYears(true);
    },

    //==============================================================================================================================================
    //Finally done with calculation functions, now to get down to adding it to the stats tab
    //==============================================================================================================================================
    
    stats: [
    {
        name: "getBestUniBuilding",
        title: "最佳独角兽建筑",
        val: 0,
    },
    {
        name: "getUraniumForThoriumReactors",
        title: "钍反应堆的铀/秒",
        val: 0,
    },
    {
        name: "getBlueprintCraft",
        title: "每次工艺制作的蓝图",
        val: 0,
    },
    {
        name: "getNecrocornsPerSecond",
        title: "每秒得到的死灵兽",
        val: 0,
    },
    {
        name: "getNecrocornTime",
        title: "距离得到下一个死灵兽的时间",
        val: 0,
    },
    {
        name: "getLeviChance",
        title: "利维坦每年到来的机会",
        val: 0,
    },
    {
        name: "getReligionProductionBonusCap",
        title: "太阳革命极限加成",
        val: 0,
    },
    {
        name: "getPraiseLoss",
        title: "到达下一超越等级的进度",
        val: 0,
    },
    {
        name: "getCelestialPerDay",
        title: "天文事件的几率",
        val: 0,
    },
    {
        name: "getCelestialAutoSuccess",
        title: "天文事件自动成功率",
        val: 0,
    },
    {
        name: "getTitPerZebraTrade",
        title: "每次和斑马贸易得到的钛",
        val: 0,
    },
    {
        name: "getZebraTradesToMaxTit",
        title: "最大斑马交易上限钛",
        val: 0,
    },
    {
        name: "getZebraTradesLeftToMaxTit",
        title: "达到钛上限时与斑马交易剩余次数",
        val: 0,
    },
    {
        name: "getTCPerSacrifice",
        title: "每次牺牲得到的时间水晶",
        val: 0,
    },
    {
        name: "getRelicPerTCRefine",
        title: "每次遗物水晶精炼",
        val: 0,
    },
    {
        name: "getCatnipInWarmSpring",
        title: "暖春的猫薄荷/秒",
        val: 0,
    },
    {
        name: "getCatnipColdWinter",
        title: "寒冬的猫薄荷/秒",
        val: 0,
    },
    {
        name: "getParagonProductionBonus",
        title: "领导力生产加成",
        val: 0,
    },
    {
        name: "getParagonStorageBonus",
        title: "领导力库存加成",
        val: 0,
    },
    {
        name: "getBlazarsForShatterEngine",
        title: "水晶收支平衡所需耀变体加成",
        val: 0,
    },
    {
        name: "getMaxComped",
        title: "最大加成的概要数量",
        val: 0,
    },
    {
        name: "getailvup",
        title: "天网觉醒倒计时",
        val: 0,
    },
    {
        name: "getamsx",
        title: "提高圣遗物产出推荐奥秘神学",
        val: 0,
    },
    {
        name: "getDarkFutureYears",
        title: "黑暗未来惩罚年份",
        val: 0,
    }],
    
    statTitle: "附加统计（不保证准确性）",
    
    statGroups: null,
    
    constructor: function(game){
        this.game = game;
        
        this.statGroups = [
            {
                group: this.stats,
                title: this.statTitle
            }
        ];
        
        for(var i in this.statGroups){
            for(var j in this.statGroups[i].group){
                this.statGroups[i].group[j].calculate = this[this.statGroups[i].group[j].name];
            }
        }
    },
    
    getStat: function(name){
        return this[name]();
    },
    
    save: function(saveData){
    },
    
    load: function(saveData){
    },
    
    resetState: function(){
    }
});

dojo.declare("classes.tab.NummonTab", com.nuclearunicorn.game.ui.tab, {
    
    container: null,
    
    constructor: function(tabName){
    },
    
    render: function(content){
        this.container = content;
        
        this.update();
    },
    
    update: function(){
        dojo.empty(this.container);
        
        for(var idx in this.game.nummon.statGroups){
            var statGroup = this.game.nummon.statGroups[idx];
            dojo.create("h1", {
                innerHTML: statGroup.title
            }, this.container);
            
            var stats = statGroup.group;
            var table = dojo.create("table", {class: 'statTable'}, this.container);
            
            for(var i in stats){
                var stat = stats[i];
                var val = stat.val;
                if(val == Infinity)
                    val = "无限";
                
                stat.val = this.game.nummon[stat.name]();
                
                var tr = dojo.create("tr", null, table);
                dojo.create("td", {
                    innerHTML: stat.title
                }, tr);
                dojo.create("td", {
                    innerHTML: typeof val == "number" ? this.game.getDisplayValueExt(val) : val
                }, tr);
            }
        }
    }
});

NummonInit = function(){
    var managers = [
        {
            id: "nummon", class: "NummonStatsManager"
        }
    ];
    for(var i in managers){
        var manager = managers[i];
        if(gamePage[manager.id] == undefined){
            gamePage[manager.id] = new window["classes"]["managers"][manager.class](gamePage);
            gamePage.managers.push(gamePage[manager.id]);
        }
        else{
            gamePage[manager.id] = new window["classes"]["managers"][manager.class](gamePage);
        }
    }
    
    gamePage.nummonTab = new classes.tab.NummonTab({name: "附加统计", id: "Nummon"}, gamePage);
    gamePage.nummonTab.visible = true;
    var tabExists = false;
    for(var i in gamePage.tabs)
        if(gamePage.tabs[i].tabName == "Nummon"){
            gamePage.tabs[i] == gamePage.nummonTab;
            tabExists = true;
        }
    if(!tabExists)
        gamePage.addTab(gamePage.nummonTab);
    
    gamePage.getTab = function(name){
        switch(name) {
            case "science":
                return this.libraryTab;
            case "village":
                return this.villageTab;
            case "workshop":
                return this.workshopTab;
            case "space":
                return this.spaceTab;
            case "stats":
                return this.statsTab;
            case "nummon":
                return this.nummonTab;
            case "time":
                return this.timeTab;
        }
    };
    
    gamePage.ui.render();
}

NummonInit();