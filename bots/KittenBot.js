//localStorage.setItem("lastname", "Smith");
//localStorage.getItem("lastname");
//Monkey Wapper - Delete in monkey
var unsafeWindow = window;
var GM_setValue = function (key, value) {
    console.log('setValue', key, value);
    localStorage.setItem(key, value);
};
var GM_getValue = function (key, value) {
    var ret = localStorage.getItem(key);
    console.log('getValue', key, ret);
    if (!ret) { ret = value; }
    return ret;
};
//-----------------------

// Your code here...



if (unsafeWindow && unsafeWindow.jQuery) {
    $ = unsafeWindow.jQuery;
}

var kittenBot = function() {

    var gp;

    if (unsafeWindow && unsafeWindow.gamePage) {
        gp = unsafeWindow.gamePage;
    } else {
        if (gamePage) { gp = gamePage; }
    }


    console.log("AutoClicker Running: " + new Date());
    //var res = $(".resourceRow")
    var myResIdx = gp.resPool.resources;
    var myRes = {};

    var getResources = function () {
        myResIdx = gp.resPool.resources;
        myRes = {};
        for (var i = 0; i < myResIdx.length; i++) {
            //var name = myResIdx[i].title || myResIdx[i].name;
            myRes[myResIdx[i].title] = myResIdx[i];
            myRes[myResIdx[i].name] = myResIdx[i];
            if (myResIdx[i].title) myRes[myResIdx[i].title.toLowerCase()] = myResIdx[i];
            myRes[myResIdx[i].name.toUpperCase()] = myResIdx[i];
        }
    };

    getResources();

    if (gp.resPool.energyProd && gp.resPool.energyCons) {
        myRes['energy'] = {value: gp.resPool.energyProd - gp.resPool.energyCons, maxValue: gp.resPool.energyProd}
    }

    //console.log(myRes)
    var scriptEnabled = GM_getValue('scriptEnabled', true);

    var crafts = $("#craftContainer .craftTable .resourceRow");
    var myCrafts = {};
    var sciTime = new Date();
    var sciDelay = 60000;
    var sciMaxTime = new Date();

    var noTopSci = false;
    var isDevel = false;

    var eludiumDate = new Date();
    var eludiumDelay = 60000;

    //how ofther to reload the page (clear memoray leaks.)
    var refreshInt = 6 * 20; //6 * 30 //30 minutes.
    var refreshCnt = 0;

    var popMode = GM_getValue('popMode', true);
    //how often to check for population buildings in popMode
    var popBuildInt = 6 * 2;
    var popBuildCnt = popBuildInt;

    var fastFaith = GM_getValue('fastFaith', .1);

    if (popBuildInt > refreshInt) popBuildInt = refreshInt - 2;

    crafts.each(function (idx, item) {
        var items = $(item).find("td");
        myCrafts[$(items[0]).text().toLowerCase().replace(/[^a-z]/g, '')] = items[2];
    });


    //Smart-Bar
    var bar = $('<div id="devInfo">Testing</div>');
    //$('#gameLog').before(bar);

    //Smart-Function
    var smartBuildings = {}
    var smartGetButton = function (tabName, btnName) {
        for (var tab in gp.tabs) {
            if (gp.tabs[tab].tabId === tabName && gp.tabs[tab].visible) {
                for (var i in gp.tabs[tab].buttons) {
                    if (gp.tabs[tab].buttons[i].name === btnName) return gp.tabs[tab].buttons[i];
                }
            }
        }
    };

    var smartLog = function (msg) {
        gp.console.static.msg(msg);
        console.log(msg)
    };


    //Smart-Craft ('Called by auto-build')
    var smartCraftRequest = {}; //'beam' = 50;
    var smartCraftAddRequest = function (item, amt) { //add a requet and it will be granted.
        if (!smartCraftRequest[item]) smartCraftRequest[item] = amt;
        if (smartCraftRequest[item] < amt) smartCraftRequest[item] = amt;
    }
    var smartCraftClearRequest = function (item) { //add a requet and it will be granted.
        if (smartCraftRequest[item] && myRes[item].value >= smartCraftRequest[item]) {
            smartCraftRequest[item] = 0;
        }
    }
    var smartCraft = function () {

        if (!scriptEnabled) return;

        console.log(JSON.stringify(smartCraftRequest))
        var getMax = function (values) {
            var max = 0;
            for (i in values) {
                if (values[i] > max) max = parseInt(values[i]);
            }
            return max;
        }

        var buildValues;
        var buildValue;
        var buildType;

        //Beam
        buildValues = [];
        buildValue = 0;
        buildType = 'beam';
        if (gp.workshop.getCraft(buildType).unlocked && myRes['wood'].value > myRes['wood'].maxValue * .5) {
            var beamRatio = gp.getResCraftRatio({name: buildType});
            var scaffRatio = gp.getResCraftRatio({name: 'scaffold'});
            if (myRes['wood'].value > myRes[buildType].value * 175) buildValues.push(parseInt((myRes['wood'].value - (myRes[buildType].value * 175)) / 175));
            if (myRes['wood'].value > (myRes['wood'].maxValue - (myRes['wood'].perTickUI * 5 * 11))) buildValues.push(((myRes['wood'].perTickUI * 5 * 120) / 175) + 1);
            if (smartCraftRequest[buildType] && myRes[buildType].value < smartCraftRequest[buildType]) buildValues.push((smartCraftRequest[buildType] - myRes[buildType].value) / beamRatio);
            if (smartCraftRequest['scaffold'] && myRes[buildType].value < (smartCraftRequest['scaffold'] * 50) / scaffRatio && ((smartCraftRequest['scaffold'] * 50) / scaffRatio) * (175 / beamRatio) < myRes['wood'].maxValue * 4) buildValues.push((((smartCraftRequest['scaffold'] * 50) / scaffRatio) - myRes[buildType].value) / beamRatio);
            buildValue = getMax(buildValues)
            if (buildValue * 175 > myRes['wood'].value) buildValue = parseInt((myRes['wood'].value / 175)) - 1;
            if (buildValue > 0) {
                gp.craft(buildType, buildValue, true);
                smartLog("Kittens Crafted: " + buildValue + " Beams.")
            }
            smartCraftClearRequest(buildType);
        }


        //Slab
        buildValues = [];
        buildValue = 0;
        buildType = 'slab';
        if (gp.workshop.getCraft(buildType).unlocked && myRes['minerals'].value > myRes['minerals'].maxValue * .5) {
            if (myRes['minerals'].value > myRes[buildType].value * 250) buildValues.push(parseInt((myRes['minerals'].value - (myRes[buildType].value * 250)) / 250));
            if (myRes['minerals'].value > (myRes['minerals'].maxValue - (myRes['minerals'].perTickUI * 5 * 11))) buildValues.push(((myRes['minerals'].perTickUI * 5 * 120) / 250) + 1);
            if (smartCraftRequest[buildType] && myRes[buildType].value < smartCraftRequest[buildType]) buildValues.push(smartCraftRequest[buildType] - myRes[buildType].value);
            buildValue = getMax(buildValues)
            if (buildValue * 250 > myRes['minerals'].value) buildValue = parseInt((myRes['minerals'].value / 250)) - 1;
            if (buildValue > 0) {
                gp.craft(buildType, buildValue, true);
                smartLog("Kittens Crafted: " + buildValue + " Slabs.")
            }
            smartCraftClearRequest(buildType);
        }

        //Steel
        buildValues = [];
        buildValue = 0;
        buildType = 'steel';
        if (gp.workshop.getCraft(buildType).unlocked && myRes['coal'].value > myRes['coal'].maxValue * .5) {
            if (myRes['coal'].value > myRes[buildType].value * 100) buildValues.push(parseInt((myRes['coal'].value - (myRes[buildType].value * 100)) / 100));
            if (myRes['coal'].value > (myRes['coal'].maxValue - (myRes['coal'].perTickUI * 5 * 11))) buildValues.push(((myRes['coal'].perTickUI * 5 * 120) / 100) + 1);
            buildValue = getMax(buildValues)
            if (buildValue * 100 > myRes['coal'].value) buildValue = parseInt((myRes['coal'].value / 100)) - 1;
            if (buildValue * 100 > myRes['iron'].value) buildValue = parseInt((myRes['iron'].value / 100)) - 1;
            if (buildValue > 0) {
                gp.craft(buildType, buildValue, true);
                smartLog("Kittens Crafted: " + buildValue + " Steel.")
            }
            smartCraftClearRequest(buildType);
        }


        //Plate
        buildValues = [];
        buildValue = 0;
        buildType = 'plate';
        if (gp.workshop.getCraft(buildType).unlocked && myRes['iron'].value > myRes['iron'].maxValue * .5) {
            if (myRes['iron'].value > myRes[buildType].value * 125) buildValues.push((myRes['iron'].value - (myRes[buildType].value * 125)) / 125);
            if (myRes['iron'].value > (myRes['iron'].maxValue - (myRes['iron'].perTickUI * 5 * 11))) buildValues.push(((myRes['iron'].perTickUI * 5 * 120) / 125) + 1);
            buildValue = getMax(buildValues)
            if (buildValue * 125 > myRes['iron'].value) buildValue = parseInt((myRes['iron'].value / 125)) - 1;
            if (buildValue > 0) {
                gp.craft(buildType, buildValue, true);
                smartLog("Kittens Crafted: " + buildValue + " Plate.")
            }
            smartCraftClearRequest(buildType);
        }

        //Gear
        buildValues = [];
        buildValue = 0;
        buildType = 'gear';
        if (!popMode && gp.workshop.getCraft(buildType).unlocked && myRes['steel'].value > 15) {
            var gearRatio = gp.getResCraftRatio({name: buildType});
            if (myRes['steel'].value > myRes['gold'].maxValue * 1.5 && myRes['steel'].value > (myRes[buildType].value * 30) + 15) {
                buildValues.push((myRes['steel'].value - (myRes[buildType].value * 30)) / 15);
                buildValues.push((myRes['steel'].value - (myRes['gold'].maxValue * 1.5)) / 15);
            }
            if (smartCraftRequest['gear'] && myRes[buildType].value < smartCraftRequest[buildType]) {
                buildValues.push((smartCraftRequest[buildType] - myRes[buildType].value) / gearRatio)
            }
            buildValue = getMax(buildValues)
            var bonus = 0;
            if (smartCraftRequest['steel']) bonus += smartCraftRequest['steel']
            if (buildValue * 15 > myRes['steel'].value + bonus) buildValue = parseInt(((myRes['steel'].value - bonus) / 15)) - 1;
            if (buildValue > 0) {
                gp.craft(buildType, buildValue, true);
                smartLog("Kittens Crafted: " + buildValue + " Plate.")
            }
            smartCraftClearRequest(buildType);
        }


    }
    var smartCraftTmr;
    smartCraftTmr = setInterval(smartCraft, 5000)

    //Smart-Events
    //Handles Things like space-start; trade caravans; unique builds
    var smartSpaceMissions = function (missionName) {

        if (gp.spaceTab.visible) {

            var launch = gp.space.getProgram(missionName);

            if (launch.researched) { return true }
            ;
            if (launch.unlocked) {
                var canGet = gp.resPool.hasRes(launch.prices);
                if (launch.prices[0].name == 'starchart' && myRes['starchart'].value < launch.prices[0].val) canGet = false;
                if (canGet) {
                    gamePage.activeTabId = 'Space';
                    gamePage.render();
                    var btn = $(".btnContent:contains('" + launch.title + "')");
                    if (btn && btn.length == 1) {
                        btn.click();
                        smartLog("Kittens In Space: " + launch.title)
                    }
                    gamePage.activeTabId = 'Bonfire';
                    gamePage.render();
                }
            }
        }
        return false;
    }

    var smartObserveAstro = function () {
        var aobs = $("#gameLog").find("input");
        if (aobs && aobs.length > 0) {
            aobs.click()
        }
        return false;
    }

    var smartHunt = function () {
        //hunters
        if (myRes['catpower'].value > (myRes['catpower'].maxValue * .8) && myRes['catpower'].value > 100) {
            $("#fastHuntContainer a").click();
        }
        if (myRes['catpower'].value > 10000 && myRes['catpower'].perTickUI > 200) {
            $("#fastHuntContainer a").click();
        }

        return false;
    }

    var tradeLevel = 0;
    var tradeYear = 1;
    var smartTradeUnlock = function () {

        if (gp.diplomacyTab.visible) {
            console.log('trade', tradeLevel)
            var clickTrade = function () {
                gamePage.activeTabId = 'Trade';
                gamePage.render();
                $(".btnContent:contains('Send explorers')").click();
                tradeLevel = gp.diplomacyTab.racePanels.length;

                gamePage.activeTabId = 'Bonfire';
                gamePage.render();
            }
            if (tradeLevel == 0) { //Lizards
                gamePage.activeTabId = 'Trade';
                gamePage.render();
                tradeLevel = gp.diplomacyTab.racePanels.length;
                gamePage.activeTabId = 'Bonfire';
                gamePage.render();
            } else if (tradeLevel == 1 || tradeLevel == 2) { //Sharks, //Griffins
                if (gp.calendar.year >= tradeYear && myRes['catpower'].value > 1000) {
                    clickTrade();
                    if (tradeLevel == 1 || tradeLevel == 2) tradeYear = 21;
                }
            } else if (tradeLevel == 3) { //Nagas
                if (myRes['culture'].value > 1500 && myRes['catpower'].value > 1000) {
                    clickTrade();
                }
            } else if (tradeLevel == 4) { //Zebras
                if (myRes['ship'].value > 0 && myRes['catpower'].value > 1000) {
                    clickTrade();
                }
            } else if (tradeLevel == 5) { //Spiders
                if (myRes['ship'].value > 100 && myRes['science'].value > 125000 && myRes['catpower'].value > 1000) {
                    clickTrade();
                }
            } else if (tradeLevel == 6) { //Dragons
                if (myRes['science'].value > 150000 && myRes['catpower'].value > 1000) {
                    var tech = gp.science.get('nuclearFission')
                    if (tech.unlocked && tech.researched) {
                        clickTrade();
                        if (tradeLevel > 6) return true; //Trades Finished.
                    }
                }
            }

        }
        return false;
    }

    var smartEvents = [
        function () { return smartHunt() },
        function () { return smartObserveAstro() },
        function () { return smartTradeUnlock() },
        function () { return smartSpaceMissions('orbitalLaunch') },
        function () { return smartSpaceMissions('moonMission') },
        function () { return smartSpaceMissions('duneMission') },
        function () { return smartSpaceMissions('piscineMission') },
        function () { return smartSpaceMissions('heliosMission') },
        function () { return smartSpaceMissions('terminusMission') },
        function () { return smartSpaceMissions('kairoMission') },
        function () { return smartSpaceMissions('yarnMission') }
    ]
    var smartEvent = function () {
        if (!scriptEnabled) return;


        //console.log('events', JSON.stringify(smartEvents))
        for (fn in smartEvents) {
            var result = smartEvents[fn]();
            if (result) smartEvents.splice(fn, 1)
            if (result) break;
        }

        if (smartEvents.length == 0) clearInterval(smartEventTmr);
        return true;

    }
    var smartEventTmr;
    smartEventTmr = setInterval(smartEvent, 1000)

    //Smart-Sci
    var smartSciOrders = [
        ['Science', 'calendar'],
        ['Science', 'agriculture'],
        ['Science', 'mining'],
        ['Science', 'archery'],
        ['Science', 'metal'],
        ['Workshop', 'mineralAxes'],
        ['Workshop', 'mineralHoes'],
        ['Workshop', 'bolas'],
        ['Science', 'animal'],
        ['Workshop', 'ironAxes', ['Science', 'math']],
        ['Workshop', 'stoneBarns'],
        ['Workshop', 'ironHoes'],
        ['Science', 'construction'],
        ['Science', 'math'],
        ['Science', 'civil'],
        ['Science', 'currency'],
        ['Workshop', 'goldOre'],
        ['Science', 'engineering'],
        ['Workshop', 'advancedRefinement'],
        ['Workshop', 'celestialMechanics'],
        ['Workshop', 'compositeBow'],
        ['Science', 'writing'],
        ['Workshop', 'reinforcedBarns'],
        ['Science', 'steel'],
        ['Science', 'machinery'],
        ['Science', 'philosophy'],
        ['Workshop', 'huntingArmor'],
        ['Workshop', 'deepMining'],
        ['Workshop', 'coalFurnace'],
        ['Workshop', 'crossbow'],
        ['Workshop', 'reinforcedWarehouses'],
        ['Workshop', 'ironwood'],
        ['Workshop', 'steelAxe'],
        ['Workshop', 'steelArmor'],
        ['Workshop', 'printingPress'],
        ['Science', 'theology'],
        ['Science', 'astronomy'],
        ['Science', 'navigation'],
        ['Workshop', 'caravanserai'],
        ['Workshop', 'titaniumAxe'],
        ['Workshop', 'titaniumBarns'],
        ['Workshop', 'titaniumMirrors'],
        ['Science', 'architecture'],
        ['Science', 'physics'],
        ['Science', 'chemistry'],
        ['Science', 'acoustics'],
        ['Science', 'archeology'],
        ['Science', 'electricity'],
        ['Workshop', 'cargoShips'],
        ['Science', 'industrialization'],
        ['Workshop', 'geodesy'],
        ['Workshop', 'silos'],
        ['Workshop', 'astrolabe'],
        ['Workshop', 'alloySaw'],
        ['Workshop', 'alloyArmor'],
        ['Workshop', 'alloyBarns'],
        ['Workshop', 'alloyWarehouses'],
        ['Science', 'biology'],
        ['Science', 'biochemistry'],
        ['Workshop', 'biofuel'],
        ['Science', 'mechanization'], //Mechanization
        ['Workshop', 'concreteHuts'],//Concrete Huts
        ['Workshop', 'concreteWarehouses'],//Concrete Warehouses
        ['Workshop', 'concreteBarns'],//Concrete Barns
        ['Science', 'drama'],
        ['Science', 'metalurgy'],//Metallurgy
        ['Workshop', 'electrolyticSmelting'],//Electrolytic Smelting
        ['Workshop', 'miningDrill'],//Mining Drill
        ['Workshop', 'oxidation'], //Oxidation
        ['Workshop', 'pumpjack'],//Pumpjack
        ['Science', 'combustion'],//Combustion
        ['Science', 'ecology'],//Ecology
        ['Workshop', 'fuelInjectors'],//Fuel Injectors
        ['Science', 'electronics'],//Electronics
        ['Workshop', 'seti'],//SETI
        ['Workshop', 'cadSystems'],//CAD System
        ['Workshop', 'offsetPress'],//Offset Press
        ['Workshop', 'oilRefinery'],//Oil Refinery
        ['Workshop', 'combustionEngine'],
        ['Science', 'robotics']//Robotics
    ]
    var smartSci = function (idx) {

        if (!scriptEnabled) return;
        if (smartSciOrders.length < 1) return;

        var sciOrder = smartSciOrders[0]
        var techName = sciOrder[1]
        var tech;
        if (sciOrder[0] == "Science") {
            tech = gp.science.get(techName);
        } else {
            tech = gp.workshop.get(techName);
        }


        if (tech.researched) {
            smartSciOrders.shift();
            smartSci();
            return;
        }

        if (tech.unlocked) {
            var canGet = false
            var prices = {};
            if (tech.cost) prices = [{name: "science", val: tech.cost}];
            if (tech.prices) prices = tech.prices;
            canGet = gp.resPool.hasRes(prices);

            if (canGet) {
                gamePage.activeTabId = sciOrder[0];
                gamePage.render();
                var btn = smartGetButton(sciOrder[0], tech.title)
                console.log(btn);
                if (btn && btn.enabled && btn.visible && btn.handler) {
                    smartLog("Kittens Researched: " + tech.title)
                    $(".btnContent:contains('" + tech.title + "')").click();
                    smartSciOrders.shift();
                }
                gamePage.activeTabId = 'Bonfire';
                gamePage.render();
            } else {
                //Let's ask for resources
                for (iType in prices) {
                    smartCraftAddRequest(prices[iType].name, prices[iType].val)
                }
            }
        }

        //console.log(btn && btn.enabled && btn.visible)

    }
    var smartSciTmr;
    smartSciTmr = setInterval(smartSci, 1000)

    //Smart-Pop
    // Woodcutter, Farmer, Scholar, Hunter, Miner, Priest, Geologist
    var smartPopOrders = [
        [2, 0, 2, 0, 0, 0, 0],
        [3, 1, 2, 0, 0, 0, 0],
        [4, 1, 2, 0, 1, 0, 0],
        [4, 1, 2, 1, 2, 0, 0],
        [14, 2, 3, 3, 3, 0, 0],
        [30, 2, 4, 10, 10, 0, 0],
        [35, 2, 4, 20, 16, 0, 0],
        [40, 2, 6, 25, 20, 5, 20],
        [50, 2, 6, 25, 25, 5, 20],
        [60, 2, 10, 60, 30, 10, 60],
        [70, 2, 10, 60, 32, 60, 70],
        [80, 2, 10, 80, 35, 80, 80],
        [100, 2, 15, 100, 45, 100, 100],
        [100, 2, 25, 100, 45, 1000, 100]
    ]
    var smartPopOrdersLast = GM_getValue('smartPopOrdersLast', -1);
    var smartPop = function () {

        if (!scriptEnabled) {
            clearTimeout(smartPopTmr);
            smartPopTmr = setTimeout(smartPop, 5000);
            return;
        }
        ;

        var freeKittens = gp.village.getFreeKittens()

        if (freeKittens > 0) {
            gamePage.activeTabId = 'Small village';
            gamePage.render();
            var amtKittens = smartPopOrders[0];

            var popAssign = 0;
            do {

                if (smartPopOrdersLast + 1 > amtKittens.length - 1) smartPopOrdersLast = -1;
                for (var i = smartPopOrdersLast + 1; i < amtKittens.length; i++) {
                    var desire = amtKittens[i]
                    var current = gp.village.jobs[i].value

                    if (desire > current) {
                        //console.log('add: ' + gp.village.jobs[i].title)
                        if (gp.villageTab.buttons[i].visible) {
                            gp.villageTab.buttons[i].handler();
                            smartLog("Kittens Assigned: " + gp.village.jobs[i].title)
                        }
                        freeKittens--;
                    }

                    smartPopOrdersLast = i;
                    GM_setValue('smartPopOrdersLast', smartPopOrdersLast);
                }
                popAssign++;
            } while (freeKittens > 0 && popAssign < 100)

            var next = true
            for (var i = 0; i < amtKittens.length; i++) {
                var desire = amtKittens[i]
                var current = gp.village.jobs[i].value
                if (desire > current) {
                    next = false;
                }
            }

            if (next) smartPopOrders.shift()
            if (freeKittens > 0) { smartPop() } //Try again.

            gamePage.activeTabId = 'Bonfire';
            gamePage.render();
        }

        smartPopTmrDelay += 100
        if (freeKittens > 0 && smartPopTmrDelay > 1000) smartPopTmrDelay = 1000;
        if (smartPopTmrDelay > 60000 || myRes['kittens'].value == gp.village.maxKittens) smartPopTmrDelay = 60000;
        clearTimeout(smartPopTmr);
        smartPopTmr = setTimeout(smartPop, smartPopTmrDelay);

    }
    var smartPopTmr
    var smartPopTmrDelay = 1000;
    smartPopTmr = setTimeout(smartPop, smartPopTmrDelay)

    //Smart-Build
    var priceCheck = function (bld, prices, req) {
        var isMaxLimited = false
        var canBuild = true
        var priceName = {};
        for (resPri in prices) {
            priceName[prices[resPri].name] = prices[resPri].val
        }
        for (res in req) {
            var resC = gp.resPool.get(res).value;
            var resP = 0
            if (priceName[res]) resP = priceName[res];
            //console.log(priceName)
            if (resC < req[res] + resP) {
                canBuild = false;
                if (gp.resPool.get(res).maxValue != 0 && gp.resPool.get(res).maxValue < req[res] + resP) {
                    isMaxLimited = true;
                }
            }
            //console.log(res, gp.resPool.get(res), buildId[2][res], resP, buildId[2][res]+resP, resC)
        }
        return [canBuild, isMaxLimited]
    }
    var warehouseCheck = function (bld, prices) {
        return priceCheck(bld, prices, {
            'beam': (gp.bld.getBuilding('warehouse').val * 2) + 25,
            'slab': (gp.bld.getBuilding('warehouse').val * 2) + 10
        })
    }

    var observatoryCheck = function (bld, prices) {
        return priceCheck(bld, prices, {
            'scaffold': parseInt(prices[0].val * (2 - (.01 * bld.val)) - prices[0].val),
            'slab': parseInt(prices[1].val * (2 - (.01 * bld.val))) - prices[1].val
        })
    }

    //GM_setValue('buildDex', 19)
    var buildDex = 1 //GM_getValue('buildDex', 1);
    var smartBuildOrders = [ //-1 means build until other condition are met.
        [['field', 20], ['hut', 1]], //1
        [['library', 1], ['hut', 2]], //2
        [['field', 30], ['library', 3], ['hut', 3]],//3
        [['field', 40], ['library', 4], ['hut', 4]],//4
        [['library', -1], ['hut', -1], ['field', -1], ['Science', 'mining']],//5 (//Mining)
        [['field', 50], ['mine', 1]], //6
        [['field', 50], ['mine', 2], ['workshop', 1], ['barn', 3], ['library', 8]], //7
        [['field', 60], ['library', 10], ['hut', 6]], //8
        [['mine', -1], ['field', -1], ['Science', 'animal']], //Wait for mineral hoe, axe, bola, make more mines. //9 (Hunters)
        [['smelter', 1], ['workshop', 2], ['field', 90], ['library', 12], ['pasture', 4], ['mine', 5], ['barn', 4]],
        [['mine', 7], ['hut', 10000], ['unicornPasture', 10000]],
        [['field', -1], ['logHouse', 5], ['unicornPasture', 10000]], //12
        [['field', -1], ['logHouse', -1], ['aqueduct', -1], ['academy', -1], ['workshop', -1], ['logHouse', 8], ['lumberMill', 2]],
        [['field', -1], ['mine', -1], ['warehouse', -1, warehouseCheck], ['barn', -1], ['library', -1], ['hut', 10000], ['workshop', 10000], ['unicornPasture', 10000]],
        [['warehouse', -1, warehouseCheck], ['amphitheatre', 2], ['tradepost', 1], ['academy', 20], ['lumberMill', 6], ['warehouse', 6], ['smelter', 12], ['barn', 10], ['logHouse', 35], ['hut', 8]],
        [['lumberMill', 20], ['warehouse', 20], ['smelter', 14], ['mine', 30], ['workshop', 10000], ['logHouse', 10000], ['hut', 10000]],
        [['amphitheatre', 14], ['lumberMill', 28], ['tradepost', 16], ['smelter', 31], ['mine', 38], ['pasture', 45], ['academy', 38],
            ['library', 50], ['aqueduct', 50], ['barn', 10000], ['workshop', 10000], ['logHouse', 10000], ['hut', 10000],
            ['warehouse', 30], ['unicornPasture', 10000]], //17
        [['field', -1], ['temple', 1], ['amphitheatre', 21], ['lumberMill', 34], ['tradepost', 22], ['smelter', 39], ['mine', 44],
            ['academy', 46], ['library', 56], ['aqueduct', 60], ['barn', 10000], ['workshop', 10000], ['logHouse', 10000], ['hut', 10000],
            ['warehouse', 42], ['unicornPasture', 10000]], //18
        [['field', -1], ['observatory', -1, observatoryCheck], ['observatory', 7],
            ['temple', 5], ['amphitheatre', 28], ['lumberMill', 37], ['tradepost', 27], ['smelter', 51], ['mine', 57],
            ['academy', 58], ['library', 62], ['aqueduct', 68], ['barn', 10000], ['workshop', 10000], ['logHouse', 10000], ['hut', 10000],
            ['warehouse', 46], ['unicornPasture', 10000]], //19
        [['mine', -1], ['lumberMill', -1], ['academy', -1], ['Science', 'navigation']],
        [['harbor', 7]],
        [['field', -1], ['observatory', -1, observatoryCheck], ['observatory', 7], ['temple', 5], ['amphitheatre', 28], ['lumberMill', 10000],
            ['tradepost', 27], ['smelter', 51], ['mine', 10000], ['harbor', 8],
            ['academy', 58], ['library', 62], ['aqueduct', 68], ['barn', 10000], ['workshop', 10000], ['logHouse', 10000], ['hut', 10000],
            ['warehouse', 46], ['unicornPasture', 10000]], //19
        [['warehouse', 50, warehouseCheck], ['observatory', 50]]
    ]


    //Smart Prune
    var validateBuildOrders = function () {
        //find the build index that does not pass (ignores 10000, and -1)
        var index = -1;
        for (iIa = 0; iIa < smartBuildOrders.length; iIa++) {
            for (iI = 0; iI < smartBuildOrders[iIa].length; iI++) {
                var buildId = smartBuildOrders[iIa][iI];
                var bldName = buildId[0];
                var bldDesire = buildId[1];
                if (bldName != 'Science' && bldDesire < 10000 && bldDesire > 0) {
                    var meta = gp.bld.getBuilding(bldName);
                    if ((bldName == 'aqueduct' || bldName == 'amphitheatre' || bldName == 'pasture') && meta.stage > 0) {
                    } else {
                        if (meta.val < bldDesire) {
                            index = iIa + 1;
                            break;
                        }
                    }
                }
            }
            if (index > 0) break;
        }
        if (index == -1) index = smartBuildOrders.length + 1;
        console.log('init indx', index)
        buildDex = index;
    }
    validateBuildOrders();

    smartBuildOrders.splice(0, buildDex - 1); //Destory to step

    var smartBuild = function () {

        if (!scriptEnabled) return;
        //console.log(JSON.stringify(smartBuildOrders))
        //console.log(JSON.stringify(smartBuildOrders[0]))
        if (gamePage.activeTabId != 'Bonfire') return;
        if (smartBuildOrders.length == 0) {
            clearInterval(smartBuildTmr);
            return true;
        }

        var runAgain = false;
        for (iI = smartBuildOrders[0].length - 1; iI >= 0; iI--) {
            var buildId = smartBuildOrders[0][iI]
            var bldName = buildId[0]

            if (bldName == "Science") {
                var techName = buildId[1];
                var tech = gp.science.get(techName);
                if (tech.researched) {
                    smartBuildOrders[0].splice(iI, 1);
                    runAgain = true;
                }
                //Find and Try and Build Resources for 'Tech'
            } else {
                var meta = gp.bld.getBuilding(bldName);

                //Check if it is in stage 2
                if ((bldName == 'aqueduct' || bldName == 'amphitheatre' || bldName == 'pasture') && meta.stage > 0) {
                    smartBuildOrders[0].splice(iI, 1);
                    runAgain = true;
                    break;
                }

                var buildCnt = buildId[1]
                if (buildCnt == -1) {
                    buildCnt = 0; //Skip; unless
                    for (iA = smartBuildOrders[0].length - 1; iA >= 0; iA--) {

                        if (smartBuildOrders[0][iA][1] != -1) {
                            buildCnt = 1000; //Build to whenever.
                            break;
                        }
                    }
                }
                //console.log(bldName, buildCnt)
                if (meta.unlocked && meta.val < buildCnt) {
                    var prices = gp.bld.getPrices(bldName);

                    var canBuild = gp.resPool.hasRes(prices);
                    var isMaxLimited = false;
                    //console.log(bldName, canBuild)
                    if (canBuild && buildId[2]) {//Has + resources.
                        var check = buildId[2](meta, prices)
                        canBuild = check[0];
                        isMaxLimited = check[1];
                    }
                    if (canBuild) {
                        var label
                        if (meta.stages) {
                            label = meta.stages[meta.stage].label
                        } else {
                            label = meta.label
                        }
                        var button = smartGetButton('Bonfire', label)
                        //console.log(bldName, button)
                        if (button && button.enabled && button.visible) {
                            smartLog("Kittens Built: " + label)
                            $(".btnContent:contains('" + label + "')").click();
                            if (bldName == "smelter") {
                                if ($(".btnContent:contains('" + label + "')").text().indexOf("0/1")) {

                                    var building = meta;
                                    if (building.on < building.val) {
                                        building.on++;
                                        gp.upgrade(building.upgrades);
                                    }
                                }
                            }
                            //button.onClick({shiftKey: false});
                        }
                    } else {
                        //Check if Limited by max
                        var isLimited = gp.resPool.isStorageLimited(prices);

                        if (isMaxLimited || isLimited || bldName == 'unicornPasture') {
                            buildCnt = 0; //Built to Max.
                        }
                    }
                }
                if (meta.val >= buildCnt) {
                    smartBuildOrders[0].splice(iI, 1);
                    runAgain = true;
                }
            }
        }

        if (smartBuildOrders.length > 0) {
            var msgB = "<div>" + (parseInt(buildDex) + 1) + " of " + smartBuildOrders.length + " (" +
                JSON.stringify(smartBuildOrders[0]).replace(/\[/g, "").replace(/\]/g, "").replace(/",/g, ":").replace(/"/g, "")
                + ")</div>"
            $("#devInfo").html(msgB)
            //console.log(smartBuildOrders[0].length, buildDex+1, JSON.stringify(smartBuildOrders[0]))
        }

        //console.log(JSON.stringify(smartBuildOrders[0]))
        if (smartBuildOrders[0].length == 0) {
            smartBuildOrders.shift();
            buildDex++;
            GM_setValue('buildDex', buildDex)
            runAgain = true;
            //if (smartBuildOrders.length>0) smartLog("New Build Orders: " +  buildDex + ' - ' + JSON.stringify(smartBuildOrders[0]));
        }

        if (smartBuildOrders.length == 0) {
            clearInterval(smartBuildTmr);
            return true;
        }

        if (runAgain) smartBuild();

        if (myRes['kittens'].value < gp.village.maxKittens) {
            smartPopTmrDelay = 500;
            smartPop();
        }


    }
    var smartBuildTmr;
    smartBuildTmr = setInterval(smartBuild, 2000)


    //Smart Cat-Nip + Inital Wood
    var smartCipMax = 20000 //STop clicking catnip at
    var smartCatnipTmr;

    var smartCatnip = function () {
        if (!scriptEnabled) return;
        if (gamePage.activeTabId == "Bonfire") {
            $(".btnContent:contains('Gather catnip')").click();
            if (myRes['catnip'].value > 100 && myRes['catnip'].value > myRes['kittens'].value * 400 && (myRes['catnip'].value > myRes['wood'].value * 25 || myRes['catnip'].value > myRes['catnip'].maxValue - 100)) {
                $(".btnContent:contains('Refine catnip')").click();
            }
        }
        if (myRes['catnip'].value > smartCipMax) clearInterval(smartCatnipTmr)
    }
    if (myRes['catnip'].maxValue < smartCipMax) {
        smartCatnipTmr = setInterval(smartCatnip, 10)
    }


    var days = []; //statHistory
    var dayLng; //statHistory (long term avg.)
    var dayCnt = 0; //running number of days.
    //console.log(gp)
    var toggleScript = $('<span class="toggleScript">').text((scriptEnabled) ? ' S: ON ' : ' S: OFF ').click(function () {
        scriptEnabled = !scriptEnabled
        if (scriptEnabled) { $('.toggleScript').text(" S: ON ") } else { $('.toggleScript').text(" S: OFF ") }
        GM_setValue('scriptEnabled', scriptEnabled)
    })
    var toggleFaith = $('<span class="toggleFaith">').text(" - F: " + fastFaith).click(function () {
        if (fastFaith == .1) { fastFaith = .99 } else { fastFaith = .1 }
        $('.toggleFaith').text(" - F: " + fastFaith)
        GM_setValue('fastFaith', fastFaith)

    })

    var togglePop = $('<span class="togglePop">').text((popMode) ? ' - P: ON ' : ' - P: OFF ').click(function () {
        popMode = !popMode
        $('.togglePop').text((popMode) ? ' - P: ON ' : ' - P: OFF ')
        GM_setValue('popMode', popMode)

    })

    $("#topBar>div:eq(0)>span:eq(0)").append($('<span style="opacity: .8; font-size: 8pt">').html(' - PPC: <span class="ppc" style="color: lightblue; opacity: .9">0</span> | ' +
            'DPM: <span class="dpm" style="color: lightblue; opacity: .9">0</span> | ' +
            'MPY: <span class="mpy" style="color: lightblue; opacity: .9">0</span> | ' +
            'PPH: <span class="pph" style="color: lightblue; opacity: .9">0</span> | ' +
            '(<span class="dpmp" style="color: lightblue; opacity: .9">100%</span>, <span class="dpmpl" style="color: lightblue; opacity: .9">100%</span>) ')
        .append(toggleScript, toggleFaith, togglePop))
    var statFn = function () {
        //paragon per year
        //Kittens-70 / Year
        var cDay = ((gp.calendar.year * 400) + ((gp.calendar.season - 1) * 100) + gp.calendar.day)
        var ppy = (parseInt(myRes['kittens'].value - 70) / (cDay / 400));
        var ppc = ppy * 100;
        $(".ppy").text(ppy.toFixed(3));
        $(".ppc").text(ppc.toFixed(1));


        //Days per minute

        //cDay = 1 //Year * 400 + Day.
        if (days.length >= 14) days.pop()
        days.unshift([cDay, new Date()])

        if (!dayLng) dayLng = [cDay, new Date()]

        var avgTime = days[0][1] - days[days.length - 1][1]
        var avgDays = days[0][0] - days[days.length - 1][0]
        var dpm = 60 / ((avgTime / 1000) / avgDays)
        dayCnt += avgDays;
        if (!dpm) dpm = 30;
        //console.log(avgTime, avgDays , dpm, days[0][0], days[days.length-1][0], days)
        $(".dpm").text(dpm.toFixed(1));
        //Day per minute %
        //100% = 30
        //(dpm / 30) * 100
        var dpmp = (dpm / 30) * 100
        $(".dpmp").text(dpmp.toFixed(1) + '%');

        var dpmpl = ((60 / (((days[0][1] - dayLng[1]) / 1000) / (days[0][0] - dayLng[0]))) / 30) * 100
        if (!dpmpl) dpmpl = 100;
        $(".dpmpl").text(dpmpl.toFixed(1) + '% / ' + (days[0][0] - dayLng[0]).toFixed(0));

        //minutes per yer
        //400 / dpm
        var mpy = (400 / dpm)
        $(".mpy").text(mpy.toFixed(1));

        ////pargon per hour (real time)
        //400 / Days Per Minute = (Real Time Year in minutes) 400 / 2 = 200 Minutes (per year)
        // 60 / (Real Time Year in minutes) (60 / 200) = 0.3 Years per Hour.
        // paragon per hour = (paragon per year) * (Years Per hour)

        var pph = (60 / mpy) * ppy;
        $(".pph").text(pph.toFixed(1));

    }

    setInterval(statFn, 10000);
    statFn();

    var autoRun = function () {

        if (isDevel) return;

        if (!scriptEnabled) return;

        console.log('auto')
        //Auto Refresh....
        if (refreshCnt == refreshInt) {
            //Save
            $("#headerLinks>a:contains('Save')").click();
            console.log('save')
        }

        if (refreshCnt > refreshInt) {
            //Refresh
            console.log('refresh', location.href)
            $("#headerLinks>a:contains('Save')").click();

            $.ajax({
                cache: false,
                type: 'get',
                timeout: 2000,
                url: location.href,
                success: function (data, textStatus, XMLHttpRequest) {

                    if (textStatus == 'success') {
                        console.log('run refresh');
                        setTimeout(function () {
                            location.reload();
                        }, 1000)
                    } else {
                        console.log('Error: ' + textStatus);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr.status);
                    console.log(xhr.statusText);
                    console.log(xhr.responseText);
                }

            });


            refreshCnt = parseInt(refreshCnt * .5);
        }

        refreshCnt++;

        //$('#clearLogHref').click();

        //AStronomical
        //var aobs = $("#gameLog").find("input")
        //if (aobs && aobs.length > 0) {
        //console.log('Astronomical Events: ' && aobs.length)
        //    aobs.click()
        //}


        autoFestival = function () {

            if (gp.calendar.festivalDays || !gp.science.get('drama').researched)
                return;

            gamePage.activeTabId = 'Small village';
            gamePage.render();

            var btnFes = $(".btnContent:contains('Hold festival')")

            if (btnFes && !btnFes.parent().hasClass('disabled')) {
                console.log('Start festival')
                btnFes.click();
            }

            gamePage.activeTabId = 'Bonfire';
            gamePage.render();

        }

        if (gamePage.activeTabId == "Bonfire" && (popMode || myRes['parchment'].value > 200000)) { autoFestival() }
        ;


        //hunters
        //if (myRes['catpower'].value > (myRes['catpower'].maxValue * .8) && myRes['catpower'].value > 100) {
        //    $("#fastHuntContainer a").click();
        //}
        //if (myRes['catpower'].value > 10000 && myRes['catpower'].perTickUI > 200) {
        //    $("#fastHuntContainer a").click();
        //}
        //if (myRes['catnip'].maxValue < 20000) return;


        //Population Mode:

        popBuildCnt++
        if (popMode && gamePage.activeTabId == "Bonfire" && popBuildCnt > popBuildInt) {
            //console.log('try build')
            popBuildCnt = 0;
            var blds = {};
            var bldsCnt = 0;
            var getBlds = function () {
                blds = {};
                bldsCnt = 0;
                $('.tabInner .btnContent').each(function (idx, obj) {
                    var inner = $(obj).text();
                    var key = inner.split(' ')[0];
                    var objNo = $(obj).parent().hasClass('disabled');
                    if (!objNo) {
                        blds[key] = $(obj)
                        bldsCnt++;
                    }
                })
            }
            getBlds();
            if (blds['Hut']) {
                blds['Hut'].click();
                gp.msg("Built (popMode): Hut.", "notice")
                console.log("Built (popMode): Workshop.", "notice");
                return true;
            }

            if (blds['Log']) {
                blds['Log'].click();
                gp.msg("Built (popMode): Log.", "notice")
                console.log("Built (popMode): Log.", "notice");
                return true;
            }

            if (blds['Mansion']) {
                blds['Mansion'].click();
                gp.msg("Built (popMode): Mansion", "notice")
                console.log("Built (popMode): Mansion.", "notice");
                return true;
            }

            if (myRes['unobtainium'].maxValue > 5000) {
                gamePage.activeTabId = 'Space';
                gamePage.render();

                var spaceBlds = {};
                var spaceBldsCnt = 0;

                var getSpaceBlds = function () {
                    blds = {};
                    bldsCnt = 0;
                    $('.tabInner .btnContent').each(function (idx, obj) {
                        var inner = $(obj).text();
                        var key = inner.split(' (')[0].replace(' ', '');
                        var objNo = $(obj).parent().hasClass('disabled');
                        if (!objNo) {
                            spaceBlds[key] = $(obj)
                            spaceBldsCnt++;
                        }
                    })
                }

                getSpaceBlds()

                var buildSpace = function () {


                    if (spaceBlds['SpaceStation'] && myRes['energy'].value > 10) {
                        spaceBlds['SpaceStation'].click();
                        gp.msg("Built: SpaceStation", "notice")
                        console.log("Built: SpaceStation.", "notice");
                        return true;
                    }

                    if (spaceBlds['SpaceElevator']) {
                        spaceBlds['SpaceElevator'].click();
                        gp.msg("Built: SpaceElevator", "notice")
                        console.log("Built: SpaceElevator.", "notice");
                        return true;
                    }

                    console.log(myRes['energy'].value,
                        myRes['alloy'].value,
                        myRes['unobtainium'].value);
                    if (myRes['energy'].value < 20 || (myRes['alloy'].value > myRes['science'].maxValue / 140 &&
                        myRes['unobtainium'].value > myRes['unobtainium'].maxValue - 100)) {

                        //eludium

                        if (gamePage.workshop.getCraft('eludium').unlocked) {

                            var amt = parseInt(myRes['unobtainium'].value / 1000) - 1
                            var amtC = parseInt(myRes['alloy'].value / 2500) - 1
                            if (amtC < amt) amt = amtC;
                            gp.craft('eludium', amt, true);

                        }

                        if (spaceBlds['Sunlifter'] && myRes['energy'].value < 20) {
                            spaceBlds['Sunlifter'].click();
                            gp.msg("Built: Sunlifter", "notice")
                            console.log("Built: Sunlifter.", "notice");
                            return true;
                        }

                    }
                }
                buildSpace();
                gamePage.activeTabId = 'Bonfire';
                gamePage.render();
            }
        }


        if (myRes['science'].value < (myRes['science'].maxValue - 100)) {
            //Not at Max.
            sciMaxTime = new Date();

        }


        //console.log(!noTopSci, !popMode, myRes['science'].value > (myRes['science'].maxValue - 100))
        //Science
        if (!noTopSci && !popMode && myRes['science'].value > (myRes['science'].maxValue - 100)) {
            //Try Science Tap

            var newTime = new Date();

            //console.log('sci', newTime - sciTime, sciDelay, newTime - sciMaxTime);
            //console.log('Max Time', newTime - sciMaxTime)

            if (newTime - sciTime > sciDelay && newTime - sciMaxTime > 60000) {
                console.log('Try Science', (newTime - sciTime) / 1000);
                sciTime = newTime;
                var origTab = gamePage.activeTabId;
                gamePage.activeTabId = 'Science';
                gamePage.render();

                var scis = [];
                var scisCnt = 0;
                var getScis = function () {
                    scis = [];
                    scisCnt = 0;
                    $('.tabInner>table .btnContent').each(function (idx, obj) {
                        var inner = $(obj).text();
                        var key = inner;
                        var objNo = $(obj).parent().hasClass('disabled');
                        if (!objNo) objNo = ($(obj).parent().css('display') != "block");
                        if (!objNo) objNo = (key == "Drama and Poetry");
                        if (!objNo) objNo = (key == "Acoustics");
                        if (!objNo) {

                            //scis[key] = $(obj)
                            scis.push([key, $(obj)])
                            scisCnt++;
                        }
                    })
                }
                getScis();

                //console.log(scis);

                if (scis && scis.length > 0 && scis[0] && scis[0][1]) {
                    console.log("Researched: " + scis[0][0]);
                    gp.msg("Researched: " + scis[0][0], "notice")
                    scis[0][1].click();
                    sciDelay = 360000;
                } else {
                    //Try 'Workshop'
                    var works = [];
                    var worksCnt = 0;
                    gamePage.activeTabId = 'Workshop';
                    gamePage.render();
                    var getWorks = function () {
                        works = [];
                        worksCnt = 0;
                        $('.tabInner .panelContainer:first .btnContent').each(function (idx, obj) {
                            var inner = $(obj).text();
                            var key = inner;
                            var objNo = $(obj).parent().hasClass('disabled');
                            if (!objNo) objNo = ($(obj).parent().css('display') != "block");
                            if (!objNo) objNo = (key == "Barges");
                            if (!objNo) objNo = (key == "Silos");
                            if (!objNo) objNo = (key == "Refrigeration");
                            if (!objNo) objNo = (key == "Caravanserai");
                            if (!objNo) objNo = (key == "Printing Press");
                            if (!objNo) objNo = (key == "Offset Press");
                            if (!objNo) objNo = (key == "Photolithography");
                            if (!objNo) objNo = (key == "Workshop Automation");
                            if (!objNo) objNo = (key == "Advanced Automation");
                            if (!objNo) objNo = (key == "Pneumatic Press");
                            if (!objNo) objNo = (key == "High Pressure Engine");
                            if (!objNo) objNo = (key == "Fuel Injectors");
                            if (!objNo) objNo = (key == "Factory Logistics");
                            if (!objNo) objNo = (key == "Celestial Mechanics");
                            if (!objNo) {

                                //scis[key] = $(obj)
                                works.push([key, $(obj)])
                                worksCnt++;
                            }
                        })
                    }
                    getWorks();

                    if (works && works.length > 0 && works[0] && works[0][1]) {

                        console.log("Researched (Workshop): " + works[0][0]);
                        gp.msg("Researched (Workshop): " + works[0][0], "notice")
                        works[0][1].click();
                        sciDelay = 360000;

                    } else {
                        sciDelay = sciDelay + 300000;
                        if (sciDelay > (1000 * 60 * 60)) sciDelay = (1000 * 60 * 60);
                    }

                }

                //console.log(scis)
                if (gamePage.activeTabId != origTab) {
                    gamePage.activeTabId = origTab;
                    gamePage.render();
                }
            }

        }


        //Building

        if (!popMode && smartBuildOrders.length == 0 && gamePage.activeTabId == "Bonfire" &&
            (myRes['wood'].value > (myRes['wood'].maxValue * .7) || myRes['minerals'].value > (myRes['minerals'].maxValue * .7)) &&
            (myRes['gold'].maxValue < 500 || myRes['slab'].value > (myRes['gold'].maxValue * 1.5)) &&
            (myRes['gold'].maxValue < 500 || myRes['beam'].value > (myRes['gold'].maxValue * 1.5))) {
            var blds = {};
            var bldsCnt = 0;


            var getBlds = function () {
                blds = {};
                bldsCnt = 0;
                $('.tabInner .btnContent').each(function (idx, obj) {
                    var inner = $(obj).text();
                    var key = inner.split(' ')[0];

                    var objNo = $(obj).parent().hasClass('disabled');
                    if (!objNo) {
                        blds[key] = $(obj)
                        bldsCnt++;
                    }
                })
            }

            console.log('Run build...');

            var buildBld = function () {
                //gamePage.activeTabId = "Bonfire"; gamePage.render();

                getBlds();
                var goldMax = myRes['gold'].maxValue

                if (bldsCnt > 2) {
                    if (blds['Workshop']) {
                        blds['Workshop'].click();
                        gp.msg("Built: Workshop.", "notice")
                        console.log("Built: Workshop.", "notice");
                        return true;
                    }

                    if (blds['Hut']) {
                        blds['Hut'].click();
                        gp.msg("Built: Hut.", "notice")
                        console.log("Built: Hut.", "notice");
                        return true;
                    }

                    if (blds['Log']) {
                        blds['Log'].click();
                        gp.msg("Built: Log.", "notice")
                        console.log("Built: Log.", "notice");
                        return true;
                    }

                    if (blds['Catnip'] && myRes['catnip'].perTickUI > 0 && myRes['gold'] > 90) {
                        blds['Catnip'].click();
                        gp.msg("Built: Catnip.", "notice")
                        console.log("Built: Catnip.", "notice");
                        return true;
                    }

                    if (blds['Pasture'] && myRes['catnip'].perTickUI > 0 && myRes['gold'] > 90) {
                        blds['Pasture'].click();
                        gp.msg("Built: Pasture.", "notice")
                        console.log("Built: Pasture.", "notice");
                        return true;
                    }

                    if (blds['Mine']) {
                        blds['Mine'].click();
                        gp.msg("Built: Mine.", "notice")
                        console.log("Built: Mine.", "notice");
                        return true;
                    }

                    if (blds['Smelter'] && myRes['wood'].perTickUI > 10 && myRes['minerals'].perTickUI > 10) {
                        blds['Smelter'].click();
                        gp.msg("Built: Smelter.", "notice")
                        console.log("Built: Smelter.", "notice");
                        return true;
                    }

                    if (blds['Barn']) {
                        blds['Barn'].click();
                        gp.msg("Built: Barn.", "notice")
                        console.log("Built: Barn.", "notice");
                        return true;
                    }

                    if (blds['Academy'] && myRes['science'].value > (myRes['science'].maxValue * .9)) {
                        blds['Academy'].click();
                        gp.msg("Built: Academy.", "notice")
                        console.log("Built: Academy.", "notice");
                        return true;
                    }

                    if (blds['Library']) {
                        blds['Library'].click();
                        gp.msg("Built: Library.", "notice")
                        console.log("Built: Library.", "notice");
                        return true;
                    }


                    if (blds['Unic.']) {
                        blds['Unic.'].click();
                        gp.msg("Built: Unic.", "notice")
                        console.log("Built: Unic.", "notice");
                        return true;
                    }


                    if (blds['Lumber'] && myRes['iron'].value > myRes['iron'].maxValue * .6 && myRes['plate'].value > myRes['gold'].maxValue * 2) {
                        blds['Lumber'].click();
                        gp.msg("Built: Lumber", "notice")
                        console.log("Built: Lumber.", "notice");
                        return true;
                    }

                    if (blds['Amphitheatre'] && myRes['parchment'].value > goldMax * .9) {
                        var count = parseInt(blds['Amphitheatre'].text().split('(')[1].split(')')[0])
                        if (count < 20) {
                            blds['Amphitheatre'].click();
                            gp.msg("Built: Amphitheatre", "notice")
                            console.log("Built: Amphitheatre.", "notice");
                            return true;
                        } else {
                            if (myRes['parchment'].value > myRes['gold'].maxValue && myRes['manuscript'].value > myRes['gold'].maxValue && myRes['compendium'].value > myRes['gold'].maxValue / 10) {
                                blds['Amphitheatre'].click();
                                gp.msg("Built: Amphitheatre", "notice")
                                console.log("Built: Amphitheatre.", "notice");
                                return true;
                            }
                        }
                    }

                    if (blds['Mansion']) {
                        var count = parseInt(blds['Mansion'].text().split('(')[1].split(')')[0])
                        var slab = 185 * Math.pow(1.15, count);
                        var steel = 75 * Math.pow(1.15, count);
                        var titanium = 25 * Math.pow(1.15, count);

                        if ((myRes['titanium'].value > titanium * 4 || myRes['titanium'].value > myRes['titanium'].maxValue * .9) && myRes['slab'].value > (slab * 2) + goldMax && myRes['steel'].value > (steel * 2) + goldMax &&
                            myRes['titanium'].value > myRes['titanium'].maxValue * .7) {
                            blds['Mansion'].click();
                            gp.msg("Built: Mansion", "notice")
                            console.log("Built: Mansion.", "notice");
                            return true;
                        }
                    }

                    if (blds['Harbour']) {
                        var count = parseInt(blds['Harbour'].text().split('(')[1].split(')')[0])
                        var scaffold = 5 * Math.pow(1.15, count);
                        var slab = 50 * Math.pow(1.15, count);
                        var plate = 75 * Math.pow(1.15, count);
                        //console.log('Harbour', myRes['scaffold'].value, scaffold * 5, myRes['slab'].value,slab * 3,myRes['plate'].value,plate * 2)
                        if (myRes['scaffold'].value > (scaffold * 3) + goldMax && myRes['slab'].value > (slab * 2) + goldMax && myRes['plate'].value > (plate * 2) + goldMax) {
                            blds['Harbour'].click();
                            gp.msg("Built: Harbour", "notice")
                            console.log("Built: Harbour.", "notice");
                            return true;
                        }
                    }

                    if (blds['Observatory'] && myRes['iron'].value > myRes['iron'].maxValue * .8) {
                        var count = parseInt(blds['Observatory'].text().split('(')[1].split(')')[0])
                        var scaffold = 50 * Math.pow(1.10, count);
                        var slab = 35 * Math.pow(1.10, count);
                        //var iron = 750 * Math.pow(1.10, count);
                        if (myRes['scaffold'].value > (scaffold * 2) + goldMax && myRes['slab'].value > (slab * 2) + goldMax) {
                            blds['Observatory'].click();
                            gp.msg("Built: Observatory", "notice")
                            console.log("Built: Observatory.", "notice");
                            return true;
                        }
                    }

                    if (blds['Quarry'] && myRes['iron'].value > myRes['iron'].maxValue * .8) {
                        var count = parseInt(blds['Quarry'].text().split('(')[1].split(')')[0])
                        var scaffold = 50 * Math.pow(1.15, count);
                        var slab = 1000 * Math.pow(1.15, count);
                        var steel = 150 * Math.pow(1.15, count);
                        //var iron = 750 * Math.pow(1.10, count);
                        if (myRes['scaffold'].value > (scaffold * 3) + goldMax && myRes['slab'].value > (slab * 2) + goldMax && myRes['steel'].value > (steel * 2) + goldMax) {
                            blds['Quarry'].click();
                            gp.msg("Built: Quarry", "notice")
                            console.log("Built: Quarry.", "notice");
                            return true;
                        }
                    }

                    if (blds['Oil']) {
                        var count = parseInt(blds['Oil'].text().split('(')[1].split(')')[0])
                        var scaffold = 25 * Math.pow(1.15, count);
                        var gear = 25 * Math.pow(1.15, count);
                        var steel = 50 * Math.pow(1.15, count);
                        //var iron = 750 * Math.pow(1.10, count);
                        if (myRes['scaffold'].value > (scaffold * 3) + goldMax && myRes['gear'].value > (gear * 3) && myRes['steel'].value > (steel * 2) + goldMax) {
                            blds['Oil'].click();
                            gp.msg("Built: Oil", "notice")
                            console.log("Built: Oil.", "notice");
                            return true;
                        }
                    }

                    if (blds['Warehouse']) {
                        var count = parseInt(blds['Warehouse'].text().split('(')[1].split(')')[0])
                        var beam = 1.5 * Math.pow(1.15, count);
                        var slab = 2 * Math.pow(1.15, count);
                        if (myRes['beam'].value > (beam * 2) + (goldMax * 4) && myRes['slab'].value > (slab * 2) + (goldMax * 4)) {
                            blds['Warehouse'].click();
                            gp.msg("Built: Warehouse", "notice")
                            console.log("Built: Warehouse.", "notice");
                            return true;
                        }
                    }

                    if (blds['Temple']) {
                        var count = parseInt(blds['Temple'].text().split('(')[1].split(')')[0])
                        var gold = 50 * Math.pow(1.15, count);
                        var slab = 25 * Math.pow(1.15, count);
                        var plate = 15 * Math.pow(1.15, count);
                        var manuscript = 10 * Math.pow(1.15, count);
                        if (myRes['gold'].value > goldMax - 50 && myRes['gold'].value > gold * 4 && myRes['manuscript'].value > manuscript * 4 && myRes['plate'].value > plate * 4 && myRes['slab'].value > slab * 5) {
                            blds['Temple'].click();
                            gp.msg("Built: Temple", "notice")
                            console.log("Built: Temple.", "notice");
                            return true;
                        }
                    }

                    if (blds['Calciner'] && myRes['energy'].value > 1) {
                        var count = parseInt(blds['Calciner'].text().split('(')[1].split(')')[0])
                        var steel = 120 * Math.pow(1.15, count);
                        var titanium = 15 * Math.pow(1.15, count);
                        var blueprint = 5 * Math.pow(1.15, count);
                        var oil = 500 * Math.pow(1.15, count);
                        if (myRes['oil'].perTickUI > .3 && myRes['steel'].value > steel * 3 && myRes['titanium'].value > titanium * 3 && myRes['blueprint'].value > blueprint * 5 && myRes['oil'].value > oil) {
                            blds['Calciner'].click();
                            gp.msg("Built: Calciner", "notice")
                            console.log("Built: Calciner.", "notice");
                            return true;
                        }
                    }


                    if (blds['Aqueduct']) {
                        blds['Aqueduct'].click();
                        gp.msg("Built: Aqueduct.", "notice")
                        console.log("Built: Aqueduct.", "notice");
                        return true;
                    }

                    if (blds['Factory'] && myRes['titanium'].value > myRes['titanium'].maxValue - 15 && myRes['plate'].value > myRes['titanium'].maxValue && myRes['energy'].value > 2) {
                        blds['Factory'].click();
                        gp.msg("Built: Factory", "notice")
                        console.log("Built: Factory.", "notice");
                        return true;
                    }

                    if (blds['Magneto']) {
                        blds['Magneto'].click();
                        gp.msg("Built: Magneto", "notice")
                        console.log("Built: Magneto.", "notice");
                        return true;
                    }

                    if (blds['Solar'] && myRes['titanium'].value > myRes['titanium'].maxValue - 15) {
                        blds['Solar'].click();
                        gp.msg("Built: Solar", "notice")
                        console.log("Built: Solar.", "notice");
                        return true;
                    }

                    if (blds['Hydro'] && myRes['titanium'].value > myRes['titanium'].maxValue - 15) {
                        var count = parseInt(blds['Hydro'].text().split('(')[1].split(')')[0])
                        var conc = 100 * Math.pow(1.15, count);
                        if (myRes['concrete'].value > conc * 3) {
                            blds['Hydro'].click();
                            gp.msg("Built: Hydro", "notice")
                            console.log("Built: Hydro.", "notice");
                            return true;
                        }
                    }

                    //end game builds
                    if (myRes['unobtainium'].value > 555 &&
                        myRes['uranium'].value > myRes['uranium'].maxValue * .8) {

                        var passPlate = myRes['plate'].value > myRes['coal'].maxValue
                        var passConc = myRes['concrete'].value > myRes['unobtainium'].maxValue * 2
                        var passBlue = myRes['blueprint'].value > myRes['unobtainium'].maxValue
                        var passTita = myRes['titanium'].value > myRes['titanium'].maxValue * .8
                        var passGold = myRes['gold'].value > myRes['gold'].maxValue * .8
                        var passAlloy = myRes['alloy'].value > myRes['uranium'].maxValue / 2


                        if (blds['Mansion'] && passTita) {
                            blds['Mansion'].click();
                            gp.msg("Built: Mansion", "notice")
                            console.log("Built Adv: Mansion.", "notice");
                            return true;
                        }

                        if (blds['Calciner'] && passTita && passBlue && myRes['energy'].value > 1) {
                            blds['Calciner'].click();
                            gp.msg("Built: Calciner", "notice")
                            console.log("Built Adv: Calciner.", "notice");
                            return true;
                        }

                        if (blds['Reactor'] && passTita && passPlate && passConc && passBlue) {
                            blds['Reactor'].click();
                            gp.msg("Built: Reactor", "notice")
                            console.log("Built Adv: Reactor.", "notice");
                            return true;
                        }

                        if (blds['Accelerator'] && passTita && passConc && myRes['energy'].value > 2) {
                            blds['Accelerator'].click();
                            gp.msg("Built: Accelerator", "notice")
                            console.log("Built Adv: Accelerator.", "notice");
                            return true;
                        }

                        if (blds['Steamworks'] && passBlue) {
                            blds['Steamworks'].click();
                            gp.msg("Built: Steamworks", "notice")
                            console.log("Built Adv: Steamworks.", "notice");
                            return true;
                        }

                        if (blds['Oil']) {
                            blds['Oil'].click();
                            gp.msg("Built: Oil", "notice")
                            console.log("Built Adv: Oil.", "notice");
                            return true;
                        }

                        if (blds['Harbour'] && passPlate) {
                            blds['Harbour'].click();
                            gp.msg("Built: Harbour", "notice")
                            console.log("Built Adv: Harbour.", "notice");
                            return true;
                        }

                        if (blds['Quarry']) {
                            blds['Quarry'].click();
                            gp.msg("Built: Quarry", "notice")
                            console.log("Built Adv: Quarry.", "notice");
                            return true;
                        }


                        if (blds['Chapel']) {
                            blds['Chapel'].click();
                            gp.msg("Built: Chapel", "notice")
                            console.log("Built Adv: Chapel.", "notice");
                            return true;
                        }

                        if (blds['Temple'] && passPlate && passGold && passTita) {
                            blds['Temple'].click();
                            gp.msg("Built: Temple", "notice")
                            console.log("Built Adv: Temple.", "notice");
                            return true;
                        }

                        if (blds['Bio'] && passAlloy) {
                            blds['Bio'].click();
                            gp.msg("Built: Bio", "notice")
                            console.log("Built Adv: Bio.", "notice");
                            return true;
                        }

                        if (blds['Tradepost'] && passGold && passTita) {
                            blds['Tradepost'].click();
                            gp.msg("Built: Tradepost", "notice")
                            console.log("Built Adv: Tradepost.", "notice");
                            return true;
                        }

                        if (blds['Broadcast'] && passTita && passPlate) {
                            blds['Broadcast'].click();
                            gp.msg("Built: Broadcast", "notice")
                            console.log("Built Adv: Broadcast.", "notice");
                            return true;
                        }

                        if (blds['Mint'] && passPlate && passGold && passTita) {
                            blds['Mint'].click();
                            gp.msg("Built: Mint", "notice")
                            console.log("Built Adv: Mint.", "notice");
                            return true;
                        }

                        if (blds['Catnip']) {
                            blds['Catnip'].click();
                            gp.msg("Built: Catnip", "notice")
                            console.log("Built Adv: Catnip.", "notice");
                            return true;
                        }

                        if (blds['Hydro'] && passConc && myRes['titanium'].value > myRes['titanium'].maxValue - 100) {
                            blds['Hydro'].click();
                            gp.msg("Built: Hydro", "notice")
                            console.log("Built Adv: Hydro.", "notice");
                            return true;
                        }

                        //if (blds['Ziggurat']) {
                        //blds['Ziggurat'].click();
                        //gp.msg("Built: Ziggurat", "notice")
                        //console.log("Built: Ziggurat.", "notice");
                        //return true;
                        //}


                    }


                } else {
                    return false;
                }

                return false;

            }

            var bulidTimer = function () {
                if (buildBld()) {
                    setTimeout(bulidTimer, 1000)
                }
            }

            bulidTimer();


        }

        //Space Building
        //If starchart>unobtainiumMax

        if (!popMode && gamePage.activeTabId == "Bonfire" && myRes['unobtainium'].value > 10 && myRes['unobtainium'].value > myRes['unobtainium'].maxValue * .8 && myRes['starchart'].value > myRes['unobtainium'].maxValue * 2) {

            var spaceFunc = function () {


                var spaceBlds = {};
                var spaceBldsCnt = 0;

                var getSpaceBlds = function () {
                    blds = {};
                    bldsCnt = 0;
                    $('.tabInner .btnContent').each(function (idx, obj) {
                        var inner = $(obj).text();
                        var key = inner.split(' (')[0].replace(' ', '');
                        var objNo = $(obj).parent().hasClass('disabled');
                        if (!objNo) {
                            spaceBlds[key] = $(obj)
                            spaceBldsCnt++;
                        }
                    })
                }
                getSpaceBlds()

                if (spaceBlds['T-minusMission']) {
                    spaceBlds['T-minusMission'].click();
                    gp.msg("Built: T-minusMission", "notice")
                    console.log("Built: T-minusMission.", "notice");
                    return true;
                }

                if (spaceBlds['HeliosMission']) {
                    spaceBlds['HeliosMission'].click();
                    gp.msg("Built: HeliosMission", "notice")
                    console.log("Built: HeliosMission.", "notice");
                    return true;
                }


                if (spaceBlds['ResearchVessel']) {
                    spaceBlds['ResearchVessel'].click();
                    gp.msg("Built: ResearchVessel", "notice")
                    console.log("Built: ResearchVessel.", "notice");
                    return true;
                }


                if (spaceBlds['LunarOutpost'] && myRes['energy'].value > 5 && (myRes['uranium'].perTickUI * 5) > 1.8) {
                    spaceBlds['LunarOutpost'].click();
                    gp.msg("Built: LunarOutpost", "notice")
                    console.log("Built: LunarOutpost.", "notice");
                    return true;
                }

                if (spaceBlds['PlanetCracker']) {
                    spaceBlds['PlanetCracker'].click();
                    gp.msg("Built: PlanetCracker", "notice")
                    console.log("Built: PlanetCracker.", "notice");
                    return true;
                }

                if (spaceBlds['Moonbase'] && myRes['energy'].value > 10) {
                    spaceBlds['Moonbase'].click();
                    gp.msg("Built: Moonbase", "notice")
                    console.log("Built: Moonbase.", "notice");
                    return true;
                }

                if (spaceBlds['SpaceElevator'] & myRes['unobtainium'].value > myRes['unobtainium'].maxValue - 5) {
                    spaceBlds['SpaceElevator'].click();
                    gp.msg("Built: SpaceElevator", "notice")
                    console.log("Built: SpaceElevator.", "notice");
                    return true;
                }

                if (spaceBlds['Satellite']) {
                    spaceBlds['Satellite'].click();
                    gp.msg("Built: Satellite", "notice")
                    console.log("Built: Satellite.", "notice");
                    return true;
                }

                if (spaceBlds['HydraulicFracturer']) {
                    spaceBlds['HydraulicFracturer'].click();
                    gp.msg("Built: HydraulicFracturer", "notice")
                    console.log("Built: HydraulicFracturer.", "notice");
                    return true;
                }

                if (spaceBlds['OrbitalArray'] && myRes['energy'].value > 20) {
                    spaceBlds['OrbitalArray'].click();
                    gp.msg("Built: OrbitalArray", "notice")
                    console.log("Built: OrbitalArray.", "notice");
                    return true;
                }

                if (spaceBlds['SpaceElevator']) {
                    spaceBlds['SpaceElevator'].click();
                    gp.msg("Built: SpaceElevator", "notice")
                    console.log("Built: SpaceElevator.", "notice");
                    return true;
                }

                if (spaceBlds['Cryostation']) {
                    spaceBlds['Cryostation'].click();
                    gp.msg("Built: Cryostation", "notice")
                    console.log("Built: Cryostation.", "notice");
                    return true;
                }

                if (spaceBlds['SpaceStation'] && myRes['energy'].value > 10) {
                    spaceBlds['SpaceStation'].click();
                    gp.msg("Built: SpaceStation", "notice")
                    console.log("Built: SpaceStation.", "notice");
                    return true;
                }

                if (spaceBlds['Sunlifter']) {
                    spaceBlds['Sunlifter'].click();
                    gp.msg("Built: Sunlifter", "notice")
                    console.log("Built: Sunlifter.", "notice");
                    return true;
                }


                //console.log(spaceBlds)
            }

            gamePage.activeTabId = 'Space';
            gamePage.render();
            spaceFunc();
            gamePage.activeTabId = 'Bonfire';
            gamePage.render();

        }

        var craftFn = function () {

            var craftMsg = [];
            //parchment
            if (gamePage.workshop.getCraft('parchment').unlocked &&
                (myRes['furs'].value > myRes['minerals'].maxValue || (popMode && myRes['furs'].value > myRes['coal'].maxValue)) &&
                myRes['furs'].value > 175) {
                var amt = parseInt((myRes['furs'].value - myRes['minerals'].maxValue) / 175)
                if (popMode) {
                    amt = parseInt((myRes['furs'].value - myRes['coal'].maxValue) / 175)
                }
                if (amt < 1) amt = 1;
                gp.craft('parchment', amt, true);
                craftMsg.push(amt + " parchment")
            }


            //manuscript
            if (gamePage.workshop.getCraft('manuscript').unlocked &&
                myRes['parchment'].value > myRes['gold'].maxValue &&
                (myRes['parchment'].value > myRes['manuscript'].value * 2 || myRes['parchment'].value > myRes['titanium'].maxValue) &&
                myRes['culture'].value > (myRes['culture'].maxValue * .7) && myRes['culture'].value > 1600) {

                var amt = parseInt((myRes['parchment'].value - (myRes['manuscript'].value * 2)) / 25)
                if (myRes['parchment'].value > myRes['titanium'].maxValue) amt = parseInt((myRes['parchment'].value - myRes['titanium'].maxValue) / 25);
                var amtC = parseInt(myRes['culture'].value / 400) - 1
                if (amtC < amt) amt = amtC;
                if (amt < 1) amt = 1;

                gp.craft('manuscript', amt, true);
                craftMsg.push(amt + " manuscript")

            }

            //compendium
            if (gamePage.workshop.getCraft('compedium').unlocked &&
                myRes['manuscript'].value > 100 &&
                (myRes['manuscript'].value > myRes['compendium'].value * 10 || (popMode && myRes['manuscript'].value > myRes['gold'].maxValue)) &&
                myRes['science'].value > (myRes['science'].maxValue * .9) && myRes['science'].value > 10000) {

                var amt = parseInt((myRes['manuscript'].value - (myRes['compendium'].value * 10)) / 50)
                if (popMode) {
                    amt = parseInt((myRes['manuscript'].value - 100) / 50)
                }

                var amtC = parseInt(myRes['science'].value / 10001) - 2
                if (amtC < amt) amt = amtC;
                if (amt < 1) amt = 1;

                gp.craft('compedium', amt, true);
                craftMsg.push(amt + " compedium")
            }

            //blueprint
            var blueAmt = parseInt(myRes['blueprint'].value / 150)
            if (blueAmt < 3) blueAmt = 3;


            if (!popMode && gamePage.workshop.getCraft('blueprint').unlocked &&
                myRes['compendium'].value > 200 &&
                myRes['compendium'].value > myRes['blueprint'].value * blueAmt &&
                myRes['blueprint'].value < myRes['gold'].maxValue &&
                myRes['blueprint'].value < myRes['titanium'].maxValue / 100 &&
                myRes['compendium'].value > myRes['uranium'].maxValue &&
                myRes['science'].value > (myRes['science'].maxValue * .9) && myRes['science'].value > 25000) {


                var amt = parseInt((myRes['compendium'].value - (myRes['blueprint'].value * 3)) / 25)
                var amtC = parseInt(myRes['science'].value / 25000) - 1
                if (amtC < amt) amt = amtC;
                if (amt < 1) amt = 1;

                gp.craft('blueprint', amt, true);
                craftMsg.push(amt + " blueprint")

            }

            //plate
            //if (myRes['iron'].value > (myRes['iron'].maxValue * .999) && myRes['iron'].value > 125) {
            //    var amt = parseInt(myRes['iron'].value / 125 * .1)
            //    if (amt<1) amt = 1;
            //    gp.craft('plate', amt, true);
            //    craftMsg.push(amt + " plate")
            //}

            //steel
            //if (gamePage.workshop.getCraft('steel').unlocked &&
            //    myRes['iron'].value > 100 &&
            //   myRes['coal'].value > (myRes['coal'].maxValue - (myRes['coal'].perTickUI * 5 * 15)) && myRes['coal'].value > 100) {
            //    var amt = parseInt(myRes['coal'].value / 100 * .1)
            //    if (myRes['iron'].value < myRes['coal'].value) { amt = 1; }
            //    if (amt<1) amt = 1;
            //    gp.craft('steel', amt, true);
            //    craftMsg.push(amt + " steel")
            //}

            //alloy
            if (gamePage.workshop.getCraft('alloy').unlocked &&
                myRes['titanium'].value > (myRes['titanium'].maxValue * .8) &&
                myRes['steel'].value > myRes['gold'].maxValue * 1.5 &&
                myRes['steel'].value > (myRes['alloy'].value + 1) * 20) {
                var amt = 1;
                if (myRes['steel'].value > 2500 && myRes['titanium'].value > 500) amt = 2;
                if (myRes['steel'].value > 10000 && myRes['titanium'].value > 2000) amt = 8;
                if (myRes['steel'].value > 20000 && myRes['titanium'].value > 4000) amt = 16;
                if (myRes['steel'].value > 40000 && myRes['titanium'].value > 8000) amt = 32;
                if (myRes['steel'].value > 80000 && myRes['titanium'].value > 16000) amt = 64;
                if (myRes['steel'].value > 160000 && myRes['titanium'].value > 32000) amt = 128;
                if (myRes['steel'].value > 320000 && myRes['titanium'].value > 64000) amt = 256;
                gp.craft('alloy', amt, true);
                craftMsg.push(amt + " alloy")
            }

            //gear
            //if (!popMode && gamePage.workshop.getCraft('gear').unlocked &&
            //    myRes['steel'].value > myRes['gold'].maxValue * 1.5 &&
            //    myRes['steel'].value > (myRes['gear'].value + 1) * 20) {
            //    var amt = 1;
            //    if (myRes['steel'].value > 2000) amt = 4;
            //    if (myRes['steel'].value > 4000) amt = 8;
            //    if (myRes['steel'].value > 8000) amt = 16;
            //    if (myRes['steel'].value > 16000) amt = 32;
            //    if (myRes['steel'].value > 32000) amt = 64;
            //    if (myRes['steel'].value > 64000) amt = 128;
            //    if (myRes['steel'].value > 128000) amt = 256;
            //    gp.craft('gear', amt, true);
            //    craftMsg.push(amt + " gear")
            //}

            //beam
            // if (gamePage.workshop.getCraft('beam').unlocked &&
            //     myRes['wood'].value > (myRes['wood'].maxValue - (myRes['wood'].perTickUI * 5 * 15)) && myRes['wood'].value > 175) {
            //     var amt = parseInt(myRes['wood'].value / 175 * .1)
            //     if (amt<1) amt = 1;
            //    gp.craft('beam', amt, true);
            //   craftMsg.push(amt + " beam")
            // }

            //scaffold
            if (gamePage.workshop.getCraft('scaffold').unlocked &&
                myRes['beam'].value > (myRes['gold'].maxValue * 1.2) + 50 &&
                myRes['beam'].value > (myRes['scaffold'].value + 1) * 3) {
                var amt = parseInt((myRes['beam'].value - (myRes['gold'].maxValue * 1.2)) / 175) + 1;
                gp.craft('scaffold', amt, true);
                craftMsg.push(amt + " scaffold")
            }

            //ship
            if (gamePage.workshop.getCraft('ship').unlocked &&
                myRes['scaffold'].value > (myRes['gold'].maxValue * 1.5) &&
                (myRes['scaffold'].value > ((myRes['ship'].value + 1) * 5)) &&
                (myRes['ship'].value < 2000 || myRes['plate'].value > (myRes['ship'].value + 1) * 2) &&
                (myRes['starchart'].value > myRes['ship'].value * 1.5) &&
                myRes['starchart'].value > 50 && myRes['plate'].value > myRes['gold'].maxValue * 1.5) {

                var amt = 1;
                if (myRes['starchart'].value > 1000) amt = 2;
                if (myRes['starchart'].value > 5000) amt = 4;
                if (myRes['starchart'].value > 10000) amt = 8;
                if (myRes['starchart'].value > 25000) amt = 16;
                if (myRes['starchart'].value > 50000) amt = 32;
                if (myRes['starchart'].value > 100000) amt = 64;
                if (myRes['starchart'].value > 500000) amt = 128;
                if (myRes['starchart'].value > 1000000) amt = 256;
                gp.craft('ship', amt, true);
                craftMsg.push(amt + " ship")
            }

            //tanker
            if (gamePage.workshop.getCraft('tanker').unlocked &&
                myRes['alloy'].value > 5000 &&
                myRes['blueprint'].value > 100 &&
                myRes['ship'].value > myRes['tanker'].value * 200 &&
                myRes['ship'].value > 200) {
                gp.craft('tanker', 1, true);
                craftMsg.push(1 + " tanker")
            }

            //slab
            //if (myRes['minerals'].value > (myRes['minerals'].maxValue - (myRes['minerals'].perTickUI * 5 * 15)) && myRes['minerals'].value > 250) {
            //    var amt = parseInt(myRes['minerals'].value / 250 * .1)
            //    if (amt<1) amt = 1;
            //    gp.craft('slab', amt, true);
            //    craftMsg.push(amt + " slab")
            //}


            //concrete
            if (!popMode && myRes['slab'].value > myRes['gold'].maxValue + 2500 && myRes['slab'].value > myRes['concrete'].value * 500) {

                var amt = parseInt((myRes['slab'].value - (myRes['concrete'].value * 500)) / 2500);
                var amtS = parseInt((myRes['steel'].value) / 25);
                if (amtS < amt) amt = amtS;
                if (amt < 1) amt = 1;
                gp.craft('concrate', amt, true);
                craftMsg.push(amt + " concrete")

            }


            //kerosene
            if (gamePage.workshop.getCraft('kerosene').unlocked &&
                myRes['oil'].value > myRes['oil'].maxValue * .99 &&
                myRes['oil'].value > 7500) {
                var amt = 1;
                if (myRes['oil'].value > 500000) amt = 3;
                if (myRes['oil'].value > 900000) amt = 6;
                gp.craft('kerosene', amt, true);
                craftMsg.push(amt + " kerosene")
            }

            //megalith
            if (!popMode && gamePage.workshop.getCraft('megalith').unlocked &&
                myRes['slab'].value > myRes['megalith'].value * 100 && myRes['slab'].value > myRes['minerals'].maxValue &&
                myRes['beam'].value > myRes['megalith'].value * 100 && myRes['beam'].value > myRes['wood'].maxValue &&
                myRes['plate'].value > myRes['megalith'].value * 30) {

                var amtS = parseInt(((myRes['slab'].value - (myRes['megalith'].value * 100)) + 1) / 75);
                var amtB = parseInt(((myRes['beam'].value - (myRes['megalith'].value * 100)) + 1) / 35);
                var amtP = parseInt(((myRes['plate'].value - (myRes['megalith'].value * 30)) + 1) / 5);
                var amt = amtS
                if (amtB < amt) amt = amtB;
                if (amtP < amt) amt = amtP;
                if (amt < 1) amt = 1;
                //amt = 1
                //gp.craft('megalith', amt, true);
                //craftMsg.push(amt + " megalith")

            }

            //eludium
            if (!popMode && myRes['unobtainium'].value < myRes['unobtainium'].maxValue - 25) eludiumDate = (new Date());
            //console.log((new Date()) - eludiumDate, eludiumDelay, ((new Date()) - eludiumDate)>eludiumDelay)
            if (((new Date()) - eludiumDate) > eludiumDelay) {
                if (!popMode && gamePage.workshop.getCraft('eludium').unlocked &&
                    myRes['unobtainium'].value > 1000 &&
                    myRes['alloy'].value > 2500 &&
                    myRes['unobtainium'].value > myRes['unobtainium'].maxValue - 5) {

                    if (myRes['unobtainium'].value > 3000) eludiumDelay = 10000;
                    gp.craft('eludium', 1, true);
                    craftMsg.push(1 + " eludium")

                }
            }

            if (craftMsg.length > 0) {
                gp.msg("Crafted: " + craftMsg.join(', '), "notice");
            }

        }
        craftFn();


        //handle faith
        if (myRes['faith'].value > (myRes['faith'].maxValue * fastFaith) && myRes['faith'].value > 50) {
            var origTab = gamePage.activeTabId;
            gamePage.activeTabId = 'Religion';
            gamePage.render();
            var btnPraise = $(".btnContent:contains('Praise the sun')");
            var btnGoldenSpire = $(".btnContent:contains('Golden Spire')");
            var btnSolarChant = $(".btnContent:contains('Solar Chant')");

            if (!btnSolarChant.parent().hasClass('disabled')) { btnSolarChant.click() }
            else if (!btnGoldenSpire.parent().hasClass('disabled')) {btnGoldenSpire.click()}
            else { btnPraise.click() }
            //console.log(btnGoldenSpire.parent().hasClass('disabled'), btnSolarChant.parent().hasClass('disabled'));
            gamePage.activeTabId = origTab;
            gamePage.render();
        }

        //handle Trade (low Food)
        if ((myRes['catnip'].value < (myRes['catnip'].maxValue - 60000) || myRes['catnip'].value < (myRes['catnip'].maxValue * .5))
            && myRes['gold'].value > 15 && myRes['iron'].value > 125 && myRes['catpower'].value > 50 && myRes['catnip'].value < myRes['catnip'].maxValue * .8
            && myRes['catnip'].value < 400000) {
            var origTab = gamePage.activeTabId;
            gamePage.activeTabId = 'Trade';
            gamePage.render();
            if (gamePage.diplomacyTab.racePanels.length > 2) {
                gp.msg("Catnip low, traded for food.", "notice");
                gamePage.diplomacyTab.racePanels[1].tradeBtn.tradeMultiple(1); // foods

            }
            if (gamePage.activeTabId != origTab) {
                gamePage.activeTabId = origTab;
                gamePage.render();
            }
        }

        //handle
        var perGold = parseInt(myRes['gold'].perTickUI * 5) + 1;
        if (myRes['gold'].value > (myRes['gold'].maxValue - (perGold * 15)) && myRes['gold'].value > 15) {

            var tradeIdx = -1;
            var origTab = gamePage.activeTabId;
            var tradeAmt = 1;

            // tradeAmt = parseInt(myRes['gold'].value / 1500)
            tradeAmt = parseInt(perGold);
            //console.log(parseInt(perGold),myRes['gold'].perTickUI*5, tradeAmt)
            if (tradeAmt < 1) tradeAmt = 1;


            //slab for rares.

            if (myRes['slab'].value > 200 &&
                myRes['catpower'].value > 50 &&
                myRes['titanium'].value < myRes['titanium'].maxValue - 100) {

                gamePage.activeTabId = 'Trade';
                gamePage.render();
                if (gamePage.diplomacyTab.racePanels.length > 4) {
                    tradeIdx = 4;
                    gp.msg("Trade " + tradeAmt + " with Zibras", "notice")
                }
            }


            //ivory
            if (tradeIdx < 0) {
                if (myRes['ivory'].value > (myRes['gold'].maxValue * 4) + 600 &&
                    myRes['catpower'].value > 50 && myRes['gold'].value < 20000) {
                    gamePage.activeTabId = 'Trade';
                    gamePage.render();
                    if (gamePage.diplomacyTab.racePanels.length > 3) {
                        tradeIdx = 3;
                        gp.msg("Trade with Nagas", "notice")
                    }

                }
            }

            //food for wood.
            if (tradeIdx < 0) {
                if (myRes['catnip'].value > (myRes['catnip'].maxValue * .5) && myRes['catnip'].value > 5000 && myRes['catnip'].perTickUI > 0 &&
                    myRes['iron'].value > 125 && myRes['catpower'].value > 50 &&
                    myRes['catnip'].value < 150000 && myRes['gold'].value < 20000) {
                    gamePage.activeTabId = 'Trade';
                    gamePage.render();
                    if (gamePage.diplomacyTab.racePanels.length > 1) {
                        gp.craftAll('wood');
                        tradeIdx = 1;
                        gp.msg("Trade with Sharks. Sell All Wood.", "notice")
                    }

                }
            }

            if (tradeIdx > -1) {

                for (var i = 0; i < tradeAmt; i++) {
                    gamePage.diplomacyTab.racePanels[tradeIdx].tradeBtn.tradeMultiple(1);
                    if (tradeIdx == 4 && myRes['titanium'].value >= myRes['titanium'].maxValue - 1) break;
                }// foods
                if (tradeAmt > 10) {
                    gp.msg(tradeAmt + " Trades completed.", "notice")
                }
            }

            if (gamePage.activeTabId != origTab) {
                gamePage.activeTabId = origTab;
                gamePage.render();
            }
        }

        //wood
        if (myRes['catnip'].value > (myRes['catnip'].maxValue * .9999)) {
            //console.log(myRes['catnip'].perTickUI, myRes['catnip'].perTickUI * 5, (myRes['catnip'].perTickUI * 5) * 60, parseInt(((myRes['catnip'].perTickUI * 5) * 60) / 50))
            var amt = parseInt(((myRes['catnip'].perTickUI * 5) * 600) / 50);
            if (amt < 1 || amt > parseInt(myRes['catnip'].value / 50 * .1)) { amt = parseInt(myRes['catnip'].value / 50 * .1) }
            if (amt < 1) { amt = 1; }
            gp.msg("Crafted: " + amt + " wood.", "notice");
            gp.craft('wood', amt, true);
        }


    };

    setInterval(autoRun, 5000);


};
setTimeout(kittenBot, 1000);