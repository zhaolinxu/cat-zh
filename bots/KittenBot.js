//localStorage.setItem("lastname", "Smith");
//localStorage.getItem("lastname");
//Monkey Wapper - Delete in monkey
var unsafeWindow = window;
var GM_setValue = function (key, value) {
    //console.log('setValue', key, value);
    localStorage.setItem(key, JSON.stringify(value));
};
var GM_getValue = function (key, value) {
    var ret = localStorage.getItem(key);
    //console.log('getValue', key, ret);
    if (!ret) { ret = JSON.parse(value); }
    if (ret == "true") ret = true;
    if (ret == "false") ret = false;
    return ret;
};
//-----------------------

// Your code here...


if (unsafeWindow && unsafeWindow.jQuery) {
    $ = unsafeWindow.jQuery;
}

var kittenBot = function () {


        var gp;

        if (unsafeWindow && unsafeWindow.gamePage) {
            gp = unsafeWindow.gamePage;
        } else {
            if (gamePage) { gp = gamePage; }
        }


        console.log("AutoClicker Running: " + new Date());
        //var res = $(".resourceRow")`
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
                if (myResIdx[i].name) myRes[myResIdx[i].name.toLowerCase()] = myResIdx[i];
            }
        };

        getResources();

        myRes['energy'] = {value: 0, maxValue: 0};
        if (gp.resPool.energyProd && gp.resPool.energyCons) {
            myRes['energy'] = {value: gp.resPool.energyProd - gp.resPool.energyCons, maxValue: gp.resPool.energyProd}
        }


        var scriptEnabled = GM_getValue('scriptEnabled', true);

        var crafts = $("#craftContainer .craftTable .resourceRow");
        var myCrafts = {};
        var sciTime = new Date();
        var sciDelay = 60000;
        var sciMaxTime = new Date();

        var noTopSci = false;
        var isDevel = false;

        var isReset = false;

        var eludiumDate = new Date();
        var eludiumDelay = 60000;

        //how ofther to reload the page (clear memoray leaks.)
        var refreshInt = 6 * 20; //6 * 30 //30 minutes.
        var refreshCnt = 0;

        var popMode = false; // GM_getValue('popMode', true);

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
        var bar = $('<div id="devInfo" style="font-size: 70%; margin-top: 10px;"><div id="devBuild">Orders</div><div id="devSci">Sci</div><div id="devCraft">Craft</div><div id="leviathansDur"></div></div>' +
            '<div id="devLog" style="margin-top: 10px;">' +
            '<div style="opacity: 0.7; padding-top: 5px;">Kittens Built:</div><div id="logBuild" style="font-size: 80%;"></div>' +
            '<div style="opacity: 0.7; padding-top: 5px;">Kittens Researched:</div><div id="logSci" style="font-size: 80%;"></div>' +
            '<div style="opacity: 0.7; padding-top: 5px;">Kittens Crafted:</div><div id="logCraft" style="font-size: 80%;"></div></div>'
        );
        $('#gameLog').before(bar);


        var smartOrder = [
            ['build', 'Library', 1],
            ['build', 'Workshop', 1],
            ['build', 'Hut', 2],
            ['build', 'Catnip', 10],
            ['science'],
            ['build', 'Mine', 10],
            ['build', 'Hut', 5],
            ['build', 'Temple', 10],
            ['workshop'],
            ['upgrades'],
            ['buildAny', ['Factory', 'Factory', 'Factory', 'Mansion', 'Mansion', 'Mansion', 'Mansion', 'Hydro Plant', 'Solar Farm', 'Broadcast', 'Temple'], 1],
            ['workshop'],
            ['done']
        ];


        var smartTimeReset = function () {
                if (!scriptEnabled || gp.activeTabId == 'Small village') {
                    setTimeout(smartTimeReset, 1000);
                    return;
                }
                var order = smartOrder[0];
                var label = '';
                console.log(order[0], order[1], JSON.stringify[order]);

                var isEnabled = function (uiButton) {
                    var ret = true;
                    if (uiButton.find("span").hasClass('limited')) ret = false;
                    if (uiButton.parent().hasClass('disabled')) ret = false;
                    if (uiButton.parent().css('display') == "none") ret = false;
                    return ret;
                };

                if (order[0] == 'done') {
                    gamePage.activeTabId = 'Bonfire';
                    gamePage.render();
                    smartFaith();

                    uBtn = $(".btnContent:contains('Harbour')");
                    if (uBtn) {
                        uBtn.click();
                        uBtn.click();
                        uBtn.click();
                    }
                    isReset = false;
                    return;
                }

                if (order[0] == 'upgrades') {
                    gamePage.activeTabId = 'Bonfire';
                    gamePage.render();
                    for (var i in ['amphitheatre', 'pasture', 'aqueduct']) {
                        meta = gp.bld.getBuilding(['amphitheatre', 'pasture', 'aqueduct'][i]);
                        //console.log(meta.upgradable, meta.stage, meta.stages[1].stageUnlocked)
                        if (meta.upgradable && meta.stage == 0 && meta.stages[1].stageUnlocked) {
                            meta.stage = meta.stage || 0;
                            meta.stage++;

                            meta.val = 0;
                            if (meta.calculateEffects) {
                                meta.calculateEffects(meta, gp);
                            }
                            gp.render();
                        }
                    }

                    smartOrder.shift()
                }
                if (order[0] == 'buildAny') {
                    //smartOrder.shift()
                    gamePage.activeTabId = 'Bonfire';
                    gamePage.render();

                    for (var i in order[1]) {
                        var bldName = order[1][i];
                        console.log(bldName, i)
                        label = bldName;
                        var built = false;
                        var uiButton = $(".btnContent:contains('" + label + "')");
                        var cnt = 0;
                        if (uiButton) {
                            var numStr = uiButton.text().split("(")[1].split(")")[0];
                            if (numStr.indexOf("/") > 0) numStr = numStr.split("/")[1]
                            cnt = parseInt(numStr);
                            //console.log(cnt);
                            if (isEnabled(uiButton)) {
                                built = true;
                                uiButton.click();
                                //} else {
                                //smartOrder.shift()
                            }
                        }
                    }

                    if (!built) {
                        smartOrder.shift()
                    }

                }
                if (order[0] == 'workshop') {
                    gp.activeTabId = 'Workshop';
                    gp.render();
                    var clicked = false;

                    uiButtons = $(".btnContent:contains('Huts')");
                    console.log('Huts', uiButtons.length);
                    uiButtons.each(function (idx, itm) {
                        if (!clicked && isEnabled($(itm))) {
                            clicked = true;
                            console.log(idx, $(itm).text());
                            $(itm).click()
                        }
                    });
                    if (!clicked) {
                        var btns = $('#midColumn .tabInner .panelContainer:eq(0) .btn .btnContent');
                        console.log(btns.length);
                        btns.each(function (idx, itm) {
                            if (!clicked && isEnabled($(itm))) {
                                clicked = true;
                                console.log(idx, $(itm).text());
                                $(itm).click()
                            }

                        });
                    }
                    if (!clicked) {
                        smartOrder.shift()
                    }

                }

                if (order[0] == 'science') {
                    gp.activeTabId = 'Science';
                    gp.render();
                    var clicked = false;


                    var btns = $('#midColumn .tabInner>table .btn .btnContent');
                    console.log(btns.length);
                    btns.each(function (idx, itm) {
                        if (isEnabled($(itm))) {
                            clicked = true;
                            console.log(idx, $(itm).text());
                            $(itm).click()
                        }

                    });


                    if (!clicked) {
                        smartOrder.shift()
                    }

                }

                if (order[0] == 'build') {
                    gp.activeTabId = 'Bonfire';
                    gp.render();
                    label = order[1];
                    var uiButton = $(".btnContent:contains('" + label + "')");
                    var cnt = 0;
                    if (uiButton) {
                        var numStr = uiButton.text().split("(")[1].split(")")[0];
                        if (numStr.indexOf("/") > 0) numStr = numStr.split("/")[1]
                        cnt = parseInt(numStr);
                        //console.log(cnt);
                        if (cnt < order[2] && isEnabled(uiButton)) {
                            uiButton.click()
                        } else {
                            smartOrder.shift()
                        }
                    }

                }
                setTimeout(smartTimeReset, 1000);
            }
            ;

        if (myRes['kittens'].value < 100 && myRes['titanium'].value > 10000 && myRes['uranium'].value > 10) {
            isReset = true;
            setTimeout(smartTimeReset, 1000);
        }

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

        var craftLogs = {'Craft': [], 'Sci': [], "Build": []};
        var smartLog = function (msg, area) {
            var date = new Date();
            var hour = date.getHours();
            if (hour > 12) hour -= 12;
            if (area) {

                var cl = $('<div>' + msg + '. (' + hour + ':' + date.getMinutes() + ':' + date.getSeconds() + ')</div>');
                $("#log" + area).prepend(cl);
                if ($("#log" + area + " div").length > 10) {
                    $("#log" + area + " div:last-child").remove();
                }
                ;
            } else {
                gp.msg(msg);
            }
            console.log(msg)
        };


        //Smart-Craft ('Called by auto-build')
        var smartCraftRequest = {}; //'beam' = 50;
        var smartCraftAddRequest = function (item, amt) { //add a requet and it will be granted.
            //console.log(item, amt)
            if (!smartCraftRequest[item]) smartCraftRequest[item] = amt;
            if (smartCraftRequest[item] < amt) smartCraftRequest[item] = amt;
            //console.log(JSON.stringify(smartCraftRequest))
        };
        var smartCraftClearRequest = function (item, amt) { //add a requet and it will be granted.
            //console.log(item, myRes[item].value, smartCraftRequest[item])
            if (!amt) amt = 0;
            if (smartCraftRequest[item] && myRes[item].value >= smartCraftRequest[item] && smartCraftRequest[item] <= amt + 1) {
                smartCraftRequest[item] = 0;
            }
        };


        var smartCraftTime = 1000;
        var smartCraftPause = false;
        var smartCraftPauseTime = 0;
        var smartCraft = function () {

            if (!scriptEnabled || isReset) return;

            smartCraftPauseTime++;

            //console.log(smartCraftTime)
            if (smartCraftPause) {
                if (smartCraftPauseTime > 10) {
                    smartCraftPause = false;
                    smartCraftPauseTime = 0;
                }
                return;
            } else {
                if (smartCraftPauseTime > 60 * 5) { //Pause every 5 minutes.
                    smartCraftPause = true;
                    smartCraftPauseTime = 0;
                }
            }

            //for (key in myRes) {
            //    console.log(key, myRes[key].value, myRes[key].visible)
            //}

            var craftMsgs = [];
            //console.log(c)
            $("#devCraft").text('Craft: :' + JSON.stringify(smartCraftRequest).replace(/\{/g, "").replace(/\}/g, "").replace(/",/g, ":").replace(/"/g, "").replace(/null/, "").replace(/,/g, ", "));
            var getMax = function (values) {
                var max = 0;
                for (i in values) {
                    if (values[i] > max) max = parseInt(values[i]);
                }
                return max;
            };

            var buildValues;
            var buildValue;
            var buildType;
            var maxRatio = .99;
            var smartCraft = false;
            var smartCraftWait = false;

            if (myRes['iron'].perTickUI > 1000000) maxRatio = .9;
            if (myRes['iron'].perTickUI > 5000000) maxRatio = .85;

            var minBuild = function (buildValue, resName, resDefalt) {
                if (buildValue < 1 && myRes[resName].value >= myRes[resName].maxValue - 1) {
                    //console.log(myRes[resName].perTickUI, (smartCraftTime / 200), resDefalt)
                    buildValue = parseInt(myRes[resName].perTickUI * (smartCraftTime / 200) / resDefalt);
                    if (buildValue < 1) buildValue = 1;
                }
                return buildValue;
            }

            //Wood
            buildValues = [];
            buildValue = 0;
            buildType = 'wood';
            if (myRes['catnip'].value >= myRes['catnip'].maxValue * maxRatio) {
                if (myRes['catnip'].value > (myRes['catnip'].maxValue - (myRes['catnip'].perTickUI * 5 * 11))) buildValues.push(((myRes['catnip'].perTickUI * 5 * 120) / 100) + 1);
                buildValue = getMax(buildValues)
                if (buildValue * 100 > myRes['catnip'].value) buildValue = parseInt((myRes['catnip'].value / 100)) - 1;
                buildValue = minBuild(buildValue, "catnip", 100)
                if (buildValue > 0) {
                    gp.craft(buildType, buildValue, true);
                    craftMsgs.push(buildValue + " Wood")
                }
            }

            //Beam
            var craftBeam = function () {


                buildValues = [];
                buildValue = 0;
                buildType = 'beam';
                if (gp.workshop.getCraft(buildType).unlocked) {

                    smartCraft = false;
                    smartCraftWait = false;
                    if (smartCraftRequest[buildType] && myRes[buildType].value < smartCraftRequest[buildType]) smartCraft = true;
                    if (smartCraftRequest['wood']) smartCraftWait = true;
                    if (myRes['minerals'].value >= myRes['minerals'].maxValue - 1) smartCraftWait = false;

                    if (myRes['wood'].value > myRes[buildType].value * 175) buildValues.push(parseInt((myRes['wood'].value - (myRes[buildType].value * 175)) / 175));
                    if (!smartCraftWait) {
                        var beamRatio = gp.getResCraftRatio({name: buildType});
                        var scaffRatio = gp.getResCraftRatio({name: 'scaffold'});
                        if (myRes['wood'].value > (myRes['wood'].maxValue - (myRes['wood'].perTickUI * 5 * 6))) buildValues.push(((myRes['wood'].perTickUI * 5 * 120) / 175) + 1);
                        if (smartCraft) buildValues.push((smartCraftRequest[buildType] - myRes[buildType].value) / beamRatio);
                        if (smartCraftRequest['scaffold'] && myRes[buildType].value < (smartCraftRequest['scaffold'] * 50) / scaffRatio && ((smartCraftRequest['scaffold'] * 50) / scaffRatio) * (175 / beamRatio) < myRes['wood'].maxValue * 4) buildValues.push((((smartCraftRequest['scaffold'] * 50) / scaffRatio) - myRes[buildType].value) / beamRatio);
                    }
                    buildValue = getMax(buildValues)
                    if (buildValue * 175 > myRes['wood'].value) buildValue = parseInt((myRes['wood'].value / 175)) - 1;
                    buildValue = minBuild(buildValue, "wood", 175)


                    if (buildValue > 0) {
                        gp.craft(buildType, buildValue, true);
                        craftMsgs.push(buildValue + " Beams")
                    }
                }
            }
            craftBeam();
            //Scaffold
            buildValues = [];
            buildValue = 0;
            buildType = 'scaffold';
            if (gp.workshop.getCraft(buildType).unlocked) {
                if (myRes['beam'].value > (myRes[buildType].value + 1) * 3) buildValues.push((myRes['beam'].value - (myRes[buildType].value + 1) * 3) / 50);
                //TODO: Build If CraftDemand.
                buildValue = getMax(buildValues);
                if (buildValue * 50 > myRes['beam'].value) buildValue = parseInt((myRes['beam'].value / 50)) - 1;

                if (buildValue > 0) {
                    gp.craft(buildType, buildValue, true);
                    craftMsgs.push(buildValue + " Scaffolds");
                }
                //smartCraftClearRequest(buildType);
            }

            //Slab
            var craftSlab = function () {

                buildValues = [];
                buildValue = 0;
                buildType = 'slab';
                if (gp.workshop.getCraft(buildType).unlocked && myRes['minerals'].value > 250) {
                    smartCraft = false;
                    smartCraftWait = false;
                    if (smartCraftRequest[buildType] && myRes[buildType].value < smartCraftRequest[buildType]) smartCraft = true;
                    if (smartCraftRequest['minerals']) smartCraftWait = true;
                    if (myRes['minerals'].value > myRes[buildType].value * 250) buildValues.push(parseInt((myRes['minerals'].value - (myRes[buildType].value * 250)) / 250));
                    if (!smartCraftWait && myRes['minerals'].value > (myRes['minerals'].maxValue - (myRes['minerals'].perTickUI * 5 * 6))) buildValues.push(((myRes['minerals'].perTickUI * 5 * 120) / 250) + 1);
                    if (!smartCraftWait && smartCraft) buildValues.push(smartCraftRequest[buildType] - myRes[buildType].value);
                    buildValue = getMax(buildValues);


                    buildValue = minBuild(buildValue, "minerals", 250);

                    if (buildValue * 250 > myRes['minerals'].value) buildValue = Math.floor((myRes['minerals'].value / 250));


                    if (buildValue > 0) {
                        gp.craft(buildType, buildValue, true);
                        craftMsgs.push(buildValue + " Slabs");
                    }

                }
            }
            craftSlab();

            //Steel
            var craftSteel = function () {
                buildValues = [];
                buildValue = 0;
                buildType = 'steel';
                if (gp.workshop.getCraft(buildType).unlocked && myRes['coal'].value >= (myRes['coal'].maxValue - myRes['coal'].perTickUI) * maxRatio) {
                    if (myRes['iron'].value > 10000000 && myRes['plate'].value < myRes['steel'].value / 3) return; //Exit need plate.
                    smartCraftWait = false;
                    if (smartCraftRequest['iron'] && (!smartCraftRequest[buildType] || smartCraftRequest[buildType] <= 0) && myRes['iron'].perTickUI < (myRes['coal'].perTickUI * 2) && myRes['iron'].value < smartCraftRequest['iron'] && smartCraftRequest['iron'] < myRes['iron'].maxValue) {
                        smartCraftWait = true;
                    }
                    if (smartCraftRequest['iron'] && smartCraftRequest[buildType] && myRes[buildType].value > smartCraftRequest[buildType] && myRes['iron'].perTickUI < (myRes['coal'].perTickUI * 2) && smartCraftRequest['iron'] < myRes['iron'].maxValue - 1 && myRes['iron'].value < smartCraftRequest['iron']) smartCraftWait = true;
                    if (!smartCraftWait && myRes['coal'].value > myRes[buildType].value * 100) buildValues.push(parseInt((myRes['coal'].value - (myRes[buildType].value * 100)) / 100));
                    if (!smartCraftWait && myRes['coal'].value > (myRes['coal'].maxValue - (myRes['coal'].perTickUI * 5 * 11))) buildValues.push(((myRes['coal'].perTickUI * 5 * 120) / 100) + 1);
                    //TODO: Build If CraftDemand.
                    buildValue = getMax(buildValues);
                    //console.log('steel', buildValue, smartCraftWait)
                    if (buildValue * 100 > myRes['coal'].value) buildValue = parseInt((myRes['coal'].value / 100)) - 1;
                    if (buildValue * 100 > myRes['iron'].value) buildValue = parseInt((myRes['iron'].value / 100)) - 1;
                    if (!smartCraftWait && myRes['coal'].perTickUI < myRes['iron'].perTickUI) buildValue = minBuild(buildValue, "coal", 100);
                    if (buildValue > 0) {
                        gp.craft(buildType, buildValue, true);
                        craftMsgs.push(buildValue + " Steel");
                    }
                }
            }
            craftSteel();

            //Alloy //75 s, 10 t
            var craftAlloy = function () {
                buildValues = [];
                buildValue = 0;
                buildType = 'alloy';
                if (gp.workshop.getCraft(buildType).unlocked && myRes['steel'].value > 75 && myRes['titanium'].value > 10) {
                    var alloyRatio = gp.getResCraftRatio({name: buildType});
                    var toSteelRatio = 20;
                    if (myRes['steel'].value > 10000000) toSteelRatio = 10;
                    if (myRes['steel'].value > 50000000) toSteelRatio = 5;
                    if (myRes['steel'].value > 100000000) toSteelRatio = 3;
                    if (myRes['steel'].value > myRes['gold'].maxValue * 1.5 && myRes['steel'].value > ((myRes[buildType].value + 1) * toSteelRatio)) {
                        buildValues.push((myRes['steel'].value - ((myRes[buildType].value + 1) * toSteelRatio)) / 75);
                    }
                    if (smartCraftRequest['alloy'] && myRes[buildType].value < smartCraftRequest[buildType]) {
                        buildValues.push(Math.ceil((smartCraftRequest[buildType] - myRes[buildType].value) / alloyRatio))
                    }
                    //if (myRes['steel'].value > myRes[buildType].value * 75) {
                    //    buildValues.push((myRes['steel'].value - (myRes[buildType].value * 75)) / 75);
                    //}
                    buildValue = getMax(buildValues);
                    var bonus = 0;
                    var bonusTita = 0;
                    if (smartCraftRequest['steel']) bonus += smartCraftRequest['steel'];
                    if (smartCraftRequest['titanium']) bonusTita += smartCraftRequest['titanium'];
                    if (buildValue * 75 > myRes['steel'].value - bonus) buildValue = Math.floor(((myRes['steel'].value - bonus) / 75));
                    if (buildValue * 10 > myRes['titanium'].value - bonusTita) buildValue = Math.floor(((myRes['titanium'].value - bonusTita) / 10));
                    if (buildValue > 0) {
                        gp.craft(buildType, buildValue, true);
                        craftMsgs.push(buildValue + " Alloy");
                    }
                }
            }
            craftAlloy();

            var craftEludium = function () {
                buildValues = [];
                buildValue = 0;
                buildType = 'eludium';
                if (gp.workshop.getCraft(buildType).unlocked && myRes['alloy'].value > 2500 && myRes['unobtainium'].value > 1000) {
                    var eludiumRatio = gp.getResCraftRatio({name: buildType});

                    if (myRes['unobtainium'].value > (myRes['unobtainium'].maxValue - (myRes['unobtainium'].perTickUI * 5 * 6))) buildValues.push(((myRes['unobtainium'].perTickUI * 5 * 120) / 1000) + 1);

                    if (myRes['unobtainium'].value > myRes[buildType].value * .3 * 1000 && myRes['alloy'].value > 5000) {
                        buildValues.push(Math.floor((myRes['unobtainium'].value - (myRes[buildType].value * .3 * 1000)) / 1000));
                    }

                    buildValue = getMax(buildValues);

                    if (buildValue * 2500 > myRes['alloy'].value) buildValue = Math.floor(((myRes['alloy'].value) / 2500));
                    if (buildValue * 1000 > myRes['unobtainium'].value) buildValue = Math.floor(((myRes['unobtainium'].value) / 1000));
                    if (buildValue > 0) {
                        gp.craft(buildType, buildValue, true);
                        craftMsgs.push(buildValue + " Eludium");
                    }
                }
            }
            craftEludium();

            var craftConcrete = function () {
                buildValues = [];
                buildValue = 0;
                buildType = 'concrate';
                if (gp.workshop.getCraft(buildType).unlocked && myRes['slab'].value > 2500 && myRes['steel'].value > 25) {
                    var concrateRatio = gp.getResCraftRatio({name: buildType});

                    smartCraft = false;
                    smartCraftWait = false;
                    if (smartCraftRequest[buildType] && myRes[buildType].value < smartCraftRequest[buildType]) smartCraft = true;
                    if (myRes['slab'].value > myRes[buildType].value * 2500) {
                        buildValues.push(Math.floor((myRes['slab'].value - (myRes[buildType].value * 2500)) / 2500));
                    }

                    if (myRes['slab'].value > myRes[buildType].value * 100 && myRes['slab'].value > 100000000) { //GReater then 100 mil.
                        buildValues.push(Math.floor((myRes['slab'].value - (myRes[buildType].value * 100) - 100000000) / 2500));
                    }
                    if (!smartCraftWait && smartCraft) buildValues.push(Math.ceil(smartCraftRequest[buildType] - myRes[buildType].value));

                    buildValue = getMax(buildValues);

                    if (buildValue * 2500 > myRes['slab'].value) buildValue = Math.floor(((myRes['slab'].value) / 2500));
                    if (buildValue * 25 > myRes['steel'].value) buildValue = Math.floor(((myRes['steel'].value) / 25));
                    if (buildValue > 0) {
                        gp.craft(buildType, buildValue, true);
                        craftMsgs.push(buildValue + " Concrete");
                    }
                }
            }
            craftConcrete();

            var craftTanker = function () {
                buildValues = [];
                buildValue = 0;
                buildType = 'tanker';
                if (gp.workshop.getCraft(buildType).unlocked && myRes['ship'].value > 200 && myRes['alloy'].value > 1250 && myRes['blueprint'].value > 5 && myRes['ship'].value > 2000) {
                    var tankerRatio = gp.getResCraftRatio({name: buildType});


                    if (myRes['ship'].value > myRes[buildType].value * 200 && myRes['alloy'].value > myRes[buildType].value * 300) {
                        buildValues.push(Math.floor((myRes['ship'].value - (myRes[buildType].value * 200)) / 200));
                    }


                    buildValue = getMax(buildValues);

                    if (buildValue * 200 > myRes['ship'].value) buildValue = Math.floor(((myRes['ship'].value) / 200));
                    if (buildValue * 1250 > myRes['alloy'].value) buildValue = Math.floor(((myRes['alloy'].value) / 1250));
                    if (buildValue * 5 > myRes['blueprint'].value) buildValue = Math.floor(((myRes['blueprint'].value) / 5));
                    if (buildValue > 0) {
                        gp.craft(buildType, buildValue, true);
                        craftMsgs.push(buildValue + " Tanker");
                    }
                }
            }
            craftTanker();


            var craftMegalith = function () {
                buildValues = [];
                buildValue = 0;
                buildType = 'megalith';
                if (gp.workshop.getCraft(buildType).unlocked && myRes['slab'].value > 100000000 && myRes['beam'].value > 35 && myRes['plate'].value > 5) {
                    var tankerRatio = gp.getResCraftRatio({name: buildType});


                    if (myRes['slab'].value > 100000000 + (myRes[buildType].value * 75) && myRes['beam'].value > 100000000 + (myRes[buildType].value * 35) && myRes['plate'].value > myRes[buildType].value * 5) {
                        buildValues.push(Math.floor((myRes['slab'].value - (100000000 + (myRes[buildType].value * 75))) / 75));
                    }


                    buildValue = getMax(buildValues);

                    if (buildValue * 75 > myRes['slab'].value) buildValue = Math.floor(((myRes['slab'].value) / 75));
                    if (buildValue * 35 > myRes['beam'].value) buildValue = Math.floor(((myRes['beam'].value) / 35));
                    if (buildValue * 5 > myRes['plate'].value) buildValue = Math.floor(((myRes['plate'].value) / 5));
                    if (buildValue > 0) {
                        gp.craft(buildType, buildValue, true);
                        craftMsgs.push(buildValue + " Megalith");
                    }
                }
            }
            craftMegalith();


            var craftShip = function () {
                buildValues = [];
                buildValue = 0;
                buildType = 'ship';
                if (gp.workshop.getCraft(buildType).unlocked && myRes['starchart'].value >= 25 && myRes['scaffold'].value > 100 && myRes['plate'].value > 150) {
                    var shipRatio = gp.getResCraftRatio({name: buildType});

                    if (myRes[buildType].value > 100000 && myRes['starchart'].value > 250000 && myRes['alloy'].value < myRes[buildType].value / 10) return;
                    if (myRes[buildType].value > 1000000 && myRes['starchart'].value > 2500000 && myRes['plate'].value < myRes[buildType].value) return;
                    if (myRes[buildType].value > myRes['plate'].value) return;
                    if (myRes[buildType].value < 10) { //Less then 10 rules
                        buildValues.push(1);
                    } else if (myRes[buildType].value < 100) { //Less then 100 rules
                        buildValues.push(Math.floor(myRes['starchart'].value / 25));
                    } else if (myRes[buildType].value < 1000) { //Less then 1000
                        if (myRes['scaffold'].value > myRes[buildType].value * 100) buildValues.push(Math.floor((myRes['scaffold'].value - (myRes[buildType].value * 100)) / 100));
                        if (myRes['starchart'].value > myRes[buildType].value * 3) buildValues.push(Math.floor((myRes['starchart'].value - (myRes[buildType].value * 3)) / 25));
                    } else if (myRes['scaffold'].value > myRes[buildType].value * 2 * 100 && myRes['plate'].value > myRes[buildType].value * 2 * 150 && myRes['starchart'].value > myRes[buildType].value * 25) {
                        buildValues.push(Math.floor((myRes['starchart'].value - (myRes[buildType].value * 25)) / 25));
                    } else {
                        if (myRes['starchart'].value > 100 + (myRes[buildType].value / 10) && myRes['titanium'].value < myRes['titanium'].maxValue * .2) { buildValues.push(1); }
                        if (myRes[buildType].value > 20000 && myRes['starchart'].value > myRes[buildType].value * 5) { buildValues.push((myRes['starchart'].value - (myRes[buildType].value * 5)) / 25); }
                    }

                    buildValue = getMax(buildValues);
                    var bonus = 0;
                    if (smartCraftRequest['starchart'] && smartCraftRequest['starchart'] != 25 && myRes[buildType].value > 10) bonus += smartCraftRequest['starchart'];
                    if (buildValue * 25 > myRes['starchart'].value - bonus) buildValue = Math.floor(((myRes['starchart'].value - bonus) / 25));
                    if (buildValue * 100 > myRes['scaffold'].value) buildValue = Math.floor(((myRes['scaffold'].value) / 100));
                    if (buildValue * 150 > myRes['plate'].value) buildValue = Math.floor(((myRes['plate'].value) / 150));
                    if (buildValue > 0) {
                        gp.craft(buildType, buildValue, true);
                        craftMsgs.push(buildValue + " Ships");
                    }
                }
            };
            craftShip();

            //Plate
            var craftPlate = function () {
                buildValues = [];
                buildValue = 0;
                buildType = 'plate';
                //console.log(myRes['iron'].value >= myRes['iron'].maxValue * maxRatio, myRes['iron'].maxValue * maxRatio, myRes['iron'].value)

                if (gp.workshop.getCraft(buildType).unlocked && myRes['iron'].value > 125 && (myRes['iron'].value >= (myRes['iron'].maxValue - myRes['iron'].perTickUI) * maxRatio || smartCraftRequest[buildType] || myRes['plate'].value < myRes['steel'].value * 3)) {

                    smartCraft = false;
                    smartCraftWait = false;
                    if (smartCraftRequest[buildType] && myRes[buildType].value < smartCraftRequest[buildType]) smartCraft = true;
                    if ((!smartCraftRequest[buildType] || smartCraftRequest[buildType] <= 0) && myRes['iron'].value < smartCraftRequest['iron']) smartCraftWait = true;
                    //console.log(((myRes['iron'].perTickUI * 5 * 120) / 125) + 1);
                    if (!smartCraftWait && myRes['iron'].value > myRes[buildType].value * 125) buildValues.push((myRes['iron'].value - (myRes[buildType].value * 125)) / 125);
                    if (!smartCraftWait && myRes['iron'].value > (myRes['iron'].maxValue - (myRes['iron'].perTickUI * 5 * 11))) buildValues.push(((myRes['iron'].perTickUI * 5 * 120) / 125) + 1);
                    if (!smartCraftWait && smartCraft) buildValues.push(Math.ceil(smartCraftRequest[buildType] - myRes[buildType].value));

                    //TODO: Build If CraftDemand.
                    buildValue = getMax(buildValues);
                    if (buildValue * 125 > myRes['iron'].value) buildValue = parseInt((myRes['iron'].value / 125)) - 1;
                    if (myRes['iron'].maxValue < 10000000 && buildValue * 125 > myRes['coal'].value) buildValue = parseInt((myRes['coal'].value / 125)) - 1; //Keep pase with coal for steel. :)
                    buildValue = minBuild(buildValue, "iron", 125);

                    if (buildValue > 0) {
                        gp.craft(buildType, buildValue, true);
                        craftMsgs.push(buildValue + " Plates");
                    }
                    //smartCraftClearRequest(buildType);
                }
            }
            craftPlate();

            //Gear
            buildValues = [];
            buildValue = 0;
            buildType = 'gear';
            if (gp.workshop.getCraft(buildType).unlocked && myRes['steel'].value > 15) {
                var gearRatio = gp.getResCraftRatio({name: buildType});
                if (myRes['steel'].value > myRes['gold'].maxValue * 1.5 && myRes['steel'].value > (myRes[buildType].value * 30) + 15) {
                    buildValues.push((myRes['steel'].value - (myRes[buildType].value * 30)) / 15);
                }
                if (smartCraftRequest['gear'] && myRes[buildType].value < smartCraftRequest[buildType]) {
                    buildValues.push(Math.ceil((smartCraftRequest[buildType] - myRes[buildType].value) / gearRatio))
                }
                buildValue = getMax(buildValues);
                var bonus = 0;
                if (smartCraftRequest['steel']) bonus += smartCraftRequest['steel'];
                if (buildValue * 15 > myRes['steel'].value - bonus) buildValue = Math.floor(((myRes['steel'].value - bonus) / 15));

                if (buildValue > 0) {
                    gp.craft(buildType, buildValue, true);
                    craftMsgs.push(buildValue + " Gears");
                }
                //smartCraftClearRequest(buildType);
            }

            //Parchment
            buildValues = [];
            buildValue = 0;
            buildType = 'parchment';
            //TODO: Build If CraftDemand.
            if (gp.workshop.getCraft(buildType).unlocked && myRes['furs'].value > myRes['wood'].maxValue || myRes['furs'].value > 100000) {
                if (myRes['furs'].value > (myRes['wood'].maxValue)) buildValues.push((myRes['furs'].value - myRes['wood'].maxValue) / 175);
                if (myRes['furs'].value > 100000) buildValues.push((myRes['furs'].value - 100000) / 175);
                buildValue = getMax(buildValues);
                if (buildValue * 175 > myRes['furs'].value) buildValue = Math.floor((myRes['furs'].value / 175));

                if (buildValue > 0) {
                    gp.craft(buildType, buildValue, true);
                    craftMsgs.push(buildValue + " Parchment");
                }
                //smartCraftClearRequest(buildType);
            }

            //manuscript
            buildValues = [];
            buildValue = 0;
            buildType = 'manuscript';
            if (gp.workshop.getCraft(buildType).unlocked && myRes['culture'].value > 400 && myRes['parchment'].value > 50 && !(tradeLevel < 4 &&
                myRes['culture'].maxValue > 1500) && (myRes['culture'].value > myRes['culture'].perTickUI * 5 * 30 || myRes['culture'].value > 100000 || myRes['culture'].value > myRes['culture'].maxValue * .9)) { //Insure we've unlock trade.
                //TODO: Build If CraftDemand.

                var manuscriptRatio = gp.getResCraftRatio({name: buildType});
                if (myRes['parchment'].value > (myRes[buildType].value * 2)) buildValues.push((myRes['parchment'].value - (myRes[buildType].value * 2)) / 25);
                if (myRes['parchment'].value > (myRes['culture'].value * 1.2)) buildValues.push((myRes['parchment'].value - (myRes['culture'].value * 1.2)) / 25);
                buildValue = getMax(buildValues);
                if (buildValue * 25 > myRes['parchment'].value) buildValue = Math.floor((myRes['parchment'].value / 25));
                if (buildValue * 400 > myRes['culture'].value) buildValue = Math.floor((myRes['culture'].value / 400));
                if (buildValue > 0) {
                    gp.craft(buildType, buildValue, true);
                    craftMsgs.push(buildValue + " Manuscripts");
                }
                //smartCraftClearRequest(buildType);
            }

            //compendium
            var craftCompendium = function () {
                buildValues = [];
                buildValue = 0;
                buildBase = 50;
                buildType = 'compedium';
                if (gp.workshop.getCraft(buildType).unlocked && myRes['science'].value > myRes['science'].maxValue * .1 && myRes['science'].value > 10000 && myRes['manuscript'].value > buildBase &&
                    myRes['compedium'].value < (myRes['blueprint'].value + 1) * 100) {
                    var compediumRatio = gp.getResCraftRatio({name: buildType});
                    //TODO: Build If CraftDemand.

                    smartCraftWait = false;
                    if ((!smartCraftRequest[buildType] || myRes[buildType].value >= smartCraftRequest[buildType]) && myRes['science'].value < smartCraftRequest['science']) smartCraftWait = true;
                    //TODO: Require last of (manuscript) sciences is researched. (i.e. it won't need manuscripts any more)
                    if (!smartCraftWait && myRes['manuscript'].value > (myRes[buildType].value * 2)) buildValues.push((myRes['manuscript'].value - (myRes[buildType].value * 2)) / buildBase);
                    //console.log((myRes['manuscript'].value * 10) - 10000);
                    if (!smartCraftWait && myRes['manuscript'].value > 10000 && (myRes['manuscript'].value * 10) - 10000 > myRes[buildType].value) buildValues.push((((myRes['manuscript'].value * 10) - 10000) - myRes[buildType].value) / compediumRatio);
                    buildValue = getMax(buildValues);
                    if (buildValue * buildBase > myRes['manuscript'].value) buildValue = Math.floor((myRes['manuscript'].value / buildBase));
                    if (buildValue * 10000 > myRes['science'].value) buildValue = Math.floor((myRes['science'].value / 10000));

                    //Build If CraftDemand is Not Manuscript.
                    var bonus = 0;
                    if (smartCraftRequest['manuscript']) bonus += smartCraftRequest['manuscript'];
                    //console.log(bonus, myRes['manuscript'].value - bonus, Math.floor(((myRes['manuscript'].value - bonus) / buildBase)))
                    if (buildValue * buildBase > myRes['manuscript'].value - bonus) buildValue = Math.floor(((myRes['manuscript'].value - bonus) / buildBase));

                    if (buildValue > 0) {
                        gp.craft(buildType, buildValue, true);
                        craftMsgs.push(buildValue + " Compendiums");
                    }
                    //smartCraftClearRequest(buildType);
                }
            }
            craftCompendium();

            //blueprint
            var craftBlueprint = function () {
                buildValues = [];
                buildValue = 0;
                buildBase = 25;
                buildType = 'blueprint';
                if (gp.workshop.getCraft(buildType).unlocked && myRes['science'].value > myRes['science'].maxValue * .1 && myRes['science'].value > 25000 && myRes['compedium'].value > buildBase) {
                    var blueprintRatio = gp.getResCraftRatio({name: buildType});
                    //TODO: Build If CraftDemand.
                    smartCraftWait = false;
                    if ((!smartCraftRequest[buildType] || smartCraftRequest[buildType] <= 0) && myRes['science'].value < smartCraftRequest['science']) smartCraftWait = true;
                    if (smartCraftRequest['science'] + 25000 > myRes['science'].value) smartCraftWait = true;
                    //TODO: Require last of (compedium) sciences is researched. (i.e. it won't need compediums any more)
                    if (!smartCraftWait && myRes['compedium'].value > ((myRes[buildType].value + 1) * 10) && myRes[buildType].value < 10000) buildValues.push((myRes['compedium'].value - ((myRes[buildType].value + 1) * 10)) / buildBase);
                    if (!smartCraftWait && myRes['compedium'].value > ((myRes[buildType].value + 1) * 100)) buildValues.push((myRes['compedium'].value - ((myRes[buildType].value + 1) * 100)) / buildBase);
                    buildValue = getMax(buildValues);
                    if (buildValue * buildBase > myRes['compedium'].value) buildValue = Math.floor((myRes['compedium'].value / buildBase));


                    //Build If CraftDemand is Not Manuscript.
                    var bonus = 0;
                    var bonusSci = 0;
                    if (smartCraftWait && smartCraftRequest['science'] > myRes['science'].value) bonusSci = smartCraftRequest['science'];
                    if (smartCraftRequest['compedium']) bonus += smartCraftRequest['compedium'];
                    if (buildValue * buildBase > myRes['compedium'].value - bonus) buildValue = Math.floor(((myRes['compedium'].value - bonus) / buildBase));

                    if (buildValue * 25000 > myRes['science'].value + bonusSci) buildValue = Math.floor(((myRes['science'].value - bonusSci) / 25000));

                    if (buildValue > 0) {
                        gp.craft(buildType, buildValue, true);
                        craftMsgs.push(buildValue + " Blueprints");
                    }
                }
            }
            craftBlueprint();

            //kerosene
            var craftKerosene = function () {
                buildValues = [];
                buildValue = 0;
                buildType = 'kerosene';
                if (gp.workshop.getCraft(buildType).unlocked && myRes['oil'].value > 7500) {
                    if (myRes['oil'].value > myRes['oil'].maxValue * .99) buildValues.push(((myRes['oil'].perTickUI * 5 * 120) / 7500) + 1);
                    //TODO: Build If CraftDemand.
                    buildValue = getMax(buildValues);
                    if (buildValue * 7500 > myRes['oil'].value) buildValue = Math.floor(myRes['oil'].value / 7500);

                    if (buildValue > 0) {
                        gp.craft(buildType, buildValue, true);
                        craftMsgs.push(buildValue + " Kerosene");
                    }
                }
            }
            craftKerosene();


            //Write Crafts to log.
            if (craftMsgs.length > 0) smartLog(craftMsgs.join(", "), "Craft");

        };
        var smartCraftTmr;
        smartCraftTmr = setInterval(smartCraft, smartCraftTime);

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
            if (!scriptEnabled || isReset) return;
            if ((myRes['catpower'].value > (myRes['catpower'].maxValue * .8) || (myRes['furs'].value < 10)) && myRes['catpower'].value > 100) {
                $("#fastHuntContainer a").click();
            }
            if (myRes['catpower'].value > 10000 && myRes['catpower'].perTickUI > 200) {
                $("#fastHuntContainer a").click();
            }

            return false;
        }

        var fastHuntTmr = null;
        var smartHuntTwo = function () {
            if (myRes['catpower'].perTickUI * 5 > myRes['catpower'].maxValue) {
                if (!fastHuntTmr) {
                    console.log('Start Fast Hunt');
                    fastHuntTmr = setInterval(smartHunt, 600);
                }
            } else {
                if (fastHuntTmr) clearInterval(fastHuntTmr)
            }
        };

        var faithRate = .1;
        var faithAmt = 100;
        var smartFaith = function () {

            //Ziggurats


            //Religioin
            if (myRes['faith'].value < faithAmt && faithAmt < myRes['faith'].maxValue - 1) return false;

            if (gamePage.activeTabId != 'Bonfire') return false;
            if (gp.religionTab.visible) {


                var canReseach = function () {

                    gamePage.activeTabId = 'Religion';
                    gamePage.render();

                    var isEnabled = function (btn) {
                        if (btn && (btn.parent().css('display') == "none" || btn.parent().hasClass('disabled'))) { return false }
                        return true;
                    };

                    if (myRes['unicorns'].value > 10000) {
                        if (myRes['unicorns'].value > myRes['unicorns'].perTickUI * 5 * 60 * 10) {
                            console.log(myRes['unicorns'].perTickUI * 5 * 60 * 10);
                            smartLog(Math.floor(myRes['unicorns'].value / 2500) + " Tears", "Craft");
                            var zBtn = game.religionTab.sacrificeBtn.all.link;
                            zBtn.click();
                        }

                        if (myRes['sorrow'].value < myRes['sorrow'].maxValue) {
                            var uTears = $(".btnContent:contains('Refine')");
                            if (uTears && isEnabled(uTears)) {
                                smartLog("Refine Tears", "Sci");
                                uTears.click()
                            }
                        }

                        var uBlack = $(".btnContent:contains('Black')");
                        if (uBlack && isEnabled(uBlack)) {
                            smartLog("Black Pyramid", "Sci");
                            uBlack.click()
                        }

                        var uMark = $(".btnContent:contains('Marker')");
                        if (uMark && isEnabled(uMark)) {
                            var numStr = uMark.text().split("(")[1].split(")")[0];
                            if (numStr.indexOf("/") > 0) numStr = numStr.split("/")[1];
                            cnt = parseInt(numStr);
                            if (cnt < 15) {
                                smartLog("Marker", "Sci");
                                uMark.click()
                            }
                        }

                        var uUtopia = $(".btnContent:contains('Unicorn Utopia')");
                        if (uUtopia && isEnabled(uUtopia)) {
                            //console.log('build utopia');
                            smartLog("Unicorn Utopia", "Sci");
                            uUtopia.click()
                        } else {
                            var uSky = $(".btnContent:contains('Sky Palace')");
                            if (uSky && isEnabled(uSky)) {
                                smartLog("Sky Palace", "Sci");
                                //console.log('build sky');
                                uSky.click()
                            } else {

                                var uTower = $(".btnContent:contains('Tower')");
                                if (uTower && isEnabled(uTower)) {
                                    smartLog("Ivory Tower", "Sci");
                                    //console.log('build sky');
                                    uTower.click()
                                } else {
                                    var uCita = $(".btnContent:contains('Citadel')");
                                    if (uCita && isEnabled(uCita)) {
                                        smartLog("Ivory Citadel", "Sci");
                                        //console.log('build sky');
                                        uCita.click()
                                    } else {
                                        var uTomb = $(".btnContent:contains('Tomb')");
                                        if (uTomb && isEnabled(uTomb)) {
                                            smartLog("Unicorn Tomb", "Sci");
                                            //console.log('build sky');
                                            uTomb.click()
                                        }
                                    }
                                }
                            }
                        }


                    }


                    var faithBtns = [
                        $(".btnContent:contains('Praise the sun')"), //0
                        $(".btnContent:contains('Golden Spire')"),//1
                        $(".btnContent:contains('Solar Chant')"),//2
                        $(".btnContent:contains('Scholasticism')"),//3
                        $(".btnContent:contains('Sun Altar')"),//4
                        $(".btnContent:contains('Solar Revolution')"),//5
                        $(".btnContent:contains('Basilica')"),//6
                        $(".btnContent:contains('Templars')"),//7
                        $(".btnContent:contains('Apocrypha')"),//8
                        $(".btnContent:contains('Transcendence')"),//9
                        $(".btnContent:contains('Stained Glass')")//10
                    ];

                    //if (myRes['gold'].value < 7500 && myRes['faith'].value < (myRes['faith'].maxValue - 10) * .95) {
                    //    return false;
                    //}

                    if (faithBtns[0].text().indexOf('(') > 0) {
                        faithHasSolar = true;
                    }


                    var canBuildSecondary = (myRes['faith'].maxValue > 10000 && myRes['gold'].maxValue > 8000 && myRes['gold'].value > myRes['gold'].maxValue * .5);

                    //Click Order
                    if (isEnabled(faithBtns[5])) {
                        faithBtns[5].click();
                        smartLog(faithBtns[5].text(), "Sci");
                    } //Revolution
                    if (isEnabled(faithBtns[9]) && canBuildSecondary) {
                        faithBtns[9].click();
                        smartLog(faithBtns[9].text(), "Sci");
                    } //Transcendence
                    if (isEnabled(faithBtns[2])) {
                        faithBtns[2].click();
                        smartLog(faithBtns[2].text(), "Sci");
                    } //Chant
                    if (isEnabled(faithBtns[1]) && canBuildSecondary) {
                        faithBtns[1].click();
                        smartLog(faithBtns[1].text(), "Sci");
                    } //Spire
                    if (isEnabled(faithBtns[3]) && canBuildSecondary) {
                        faithBtns[3].click();
                        smartLog(faithBtns[3].text(), "Sci");
                    } //Scholasticism
                    if (isEnabled(faithBtns[4]) && canBuildSecondary) {
                        faithBtns[4].click();
                        smartLog(faithBtns[4].text(), "Sci");
                    } //Altar
                    if (isEnabled(faithBtns[10]) && canBuildSecondary) {
                        faithBtns[10].click();
                        smartLog(faithBtns[10].text(), "Sci");
                    } //Glass
                    if (isEnabled(faithBtns[6]) && canBuildSecondary) {
                        faithBtns[6].click();
                        smartLog(faithBtns[6].text(), "Sci");
                    } //Basilica
                    if (isEnabled(faithBtns[7]) && canBuildSecondary) {
                        faithBtns[7].click();
                        smartLog(faithBtns[7].text(), "Sci");
                    } //Templars
                    if (isEnabled(faithBtns[8]) && canBuildSecondary) {
                        faithBtns[8].click();
                        smartLog(faithBtns[8].text(), "Sci");
                    } //Apocrypha

                    var hasBtn = false;
                    for (i in faithBtns) {
                        if (i != 0 && faithBtns[i] && faithBtns[i].text().indexOf("(comp") < 1 && faithBtns[i].parent().css('display') != "none" && !faithBtns[i].find("span").hasClass('limited')) {


                            if ((i == 8 || i == 7 || i == 6 || i == 9 || i == 1 || i == 3 || i == 4 || i == 10) && !canBuildSecondary) {
                            } else {
                                if (myRes['gold'].value > 500) {
                                    hasBtn = true;
                                }
                            }


                            //console.log('is enabled', i, faithBtns[i].text(), faithBtns[i].attr('class'), faithBtns[i].text().indexOf("(comp"), faithBtns[i].parent().css('display'), faithBtns[i].find("span").hasClass('limited'))
                        }
                    }

                    if (hasBtn) { faithAmt += Math.ceil(myRes['faith'].maxValue / 20); } else { faithAmt = myRes['faith'].maxValue * faithRate; }

                    //console.log(hasBtn)

                    if ((!hasBtn && isEnabled(faithBtns[0])) || myRes['faith'].value >= myRes['faith'].maxValue - 1) {
                        faithBtns[0].click();
                    } //Praise
                    //console.log('run faith', hasBtn, faithAmt, isEnabled(faithBtns[0]))
                    gamePage.activeTabId = 'Bonfire';
                    gamePage.render();
                    return hasBtn;
                }
                var fResearch = false;
                fResearch = canReseach();

            }
            return false;
        }

        var tradeLevel = 0;
        var tradeYear = 1;
        var smartTradeUnlock = function () {

            if (gp.diplomacyTab.visible) {
                //console.log('trade', tradeLevel);
                var clickTrade = function () {
                    gamePage.activeTabId = 'Trade';
                    gamePage.render();
                    $(".btnContent:contains('Send explorers')").click();
                    tradeLevel = gp.diplomacyTab.racePanels.length;

                    gamePage.activeTabId = 'Bonfire';
                    gamePage.render();
                };
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
                    if (myRes['ship'].value > 0 && myRes['catpower'].value > 2000) {
                        clickTrade();
                    }
                } else if (tradeLevel == 5) { //Spiders
                    if (myRes['ship'].value > 100 && myRes['science'].value > 125000 && myRes['catpower'].value > 1000) {
                        clickTrade();
                    }
                } else if (tradeLevel == 6) { //Dragons
                    if (myRes['science'].value > 150000 && myRes['catpower'].value > 1000) {
                        var tech = gp.science.get('nuclearFission');
                        if (tech.unlocked && tech.researched) {
                            clickTrade();
                            if (tradeLevel > 6) {
                                return true;
                            } //Trades Finished.
                        }
                    }
                } else {
                    if (myRes['catpower'].value > 1000) {
                        clickTrade();
                        return true;
                    }

                }

            }
            return false;
        };

        var smartTrade = function () {
            if (tradeLevel < 4 || myRes['catpower'].value < 50 || gamePage.activeTabId != 'Bonfire') return false;
            var perGold = Math.ceil(myRes['gold'].perTickUI * 5);
            //console.log('smartTrade', myRes['catpower'].value, gp.resPool.get('manpower').value)
            var uraniumPass = (myRes['gold'].value > (myRes['gold'].maxValue - (perGold * 5)));
            if (tradeLevel > 6 && myRes['uranium'].value < 50) { uraniumPass = true; }
            if (tradeLevel > 4 && smartCraftRequest['titanium'] && myRes['titanium'].value < smartCraftRequest['titanium'] && myRes['titanium'].maxValue > smartCraftRequest['titanium']) { uraniumPass = true; }
            var goldBase = 15;
            if (smartCraftRequest['gold']) { goldBase += smartCraftRequest['gold']; }
            if (gp.diplomacyTab.visible && myRes['gold'].value > goldBase && uraniumPass) {

                var tradeAmt = 1;

                var getTradeBtn = function (tradeIdx) {
                    if (gamePage.diplomacyTab.racePanels[tradeIdx] && gamePage.diplomacyTab.racePanels[tradeIdx].tradeBtn) {
                        return gamePage.diplomacyTab.racePanels[tradeIdx].tradeBtn
                    }
                    return null
                }


                var btn = null;

                if (tradeLevel > 6 && myRes['unobtainium'].maxValue > 100000) {
                    if (gp.diplomacy.get('leviathans').duration > 1) {
                        $('#leviathansDur').text(gp.diplomacy.get('leviathans').duration + " leviathan days remaining.");
                    } else {
                        $('#leviathansDur').text("");
                    }
                }

                //console.log(tradeLevel, myRes['spice'].value < 1000000, myRes['scaffold'].value > 100000)
                if (tradeLevel > 6 && myRes['unobtainium'].maxValue > 100000 && myRes['unobtainium'].value > 5000
                    && gp.diplomacy.get('leviathans').unlocked && gp.diplomacy.get('leviathans').duration > 1
                    && myRes['timeCrystal'].value * 3 < myRes['eludium'].value) { //Levi


                    //console.log('trade', gp.diplomacy.get('leviathans').unlocked);

                    gamePage.activeTabId = 'Trade';
                    gamePage.render();
                    if (gamePage.diplomacyTab.racePanels[7]) {
                        gamePage.diplomacyTab.racePanels[7].tradeBtn.tradeMultiple(1);
                    }
                    gamePage.activeTabId = 'Bonfire';
                    gamePage.render();

                }
                else if (tradeLevel > 6 && myRes['uranium'].value < 50 && myRes['titanium'].value > 500) { //Dragons
                    console.log('Trade Uranium');
                    gamePage.activeTabId = 'Trade';
                    gamePage.render();
                    gamePage.diplomacyTab.racePanels[6].tradeBtn.tradeMultiple(1);
                    gamePage.activeTabId = 'Bonfire';
                    gamePage.render();

                } else if (tradeLevel > 4 && myRes['slab'].value > 200 && myRes['titanium'].value < myRes['titanium'].maxValue - 100) { ////Zebras
                    console.log('Trade Zebras');
                    gamePage.activeTabId = 'Trade';
                    gamePage.render();
                    try {
                        tradeAmt = Math.ceil((myRes['gold'].value * .5) / 15);
                        if (myRes['slab'].value < tradeAmt * 200) tradeAmt = parseInt(myRes['slab'].value / 200) - 1;
                        if (myRes['catpower'].value < tradeAmt * 50) tradeAmt = parseInt(myRes['catpower'].value / 50) - 1;
                        if (tradeAmt < 1) tradeAmt = 1;
                        console.log('Trade count: ', tradeAmt, myRes['catpower'].value);
                        btn = getTradeBtn(4);
                        if (btn) {
                            for (var i = 0; i < tradeAmt; i++) {
                                btn.tradeMultiple(1);
                                if (myRes['titanium'].value >= myRes['titanium'].maxValue - 1) break;
                            }
                        }

                    } catch (er) {}
                    gamePage.activeTabId = 'Bonfire';
                    gamePage.render();
                } else if (tradeLevel >= 6 && myRes['spice'].value < 1000000 && myRes['scaffold'].value > 100000) { //Spiders
                    console.log('try spiders')
                    gamePage.activeTabId = 'Trade';
                    gamePage.render();
                    tradeAmt = parseInt((perGold * 20) / 15);
                    if (tradeAmt > 50) { tradeAmt = 50 }
                    if (tradeAmt < 1) tradeAmt = 1;
                    //console.log('Trade count: ', tradeAmt, myRes['catpower'].value);
                    btn = getTradeBtn(5);
                    if (btn) {
                        for (var i = 0; i < tradeAmt; i++) {
                            btn.tradeMultiple(1);
                        }
                    }
                    gamePage.activeTabId = 'Bonfire';
                    gamePage.render();

                } else if (tradeLevel >= 4 && myRes['ivory'].value > (myRes['gold'].maxValue) + 1200 && myRes['gold'].value > myRes['gold'].maxValue * .5) { //Nagas

                    if (myRes['furs'] < 10000 || gp.getResCraftRatio({name: 'manuscript'}) > 6.7) return false;
                    console.log('Trade Naga');
                    gamePage.activeTabId = 'Trade';
                    gamePage.render();
                    tradeAmt = parseInt((perGold * 20) / 15);
                    if (myRes['ivory'].value < tradeAmt * 500) tradeAmt = parseInt(myRes['ivory'].value / 500) - 1;
                    if (myRes['catpower'].value < tradeAmt * 100) tradeAmt = parseInt(myRes['catpower'].value / 100) - 1;
                    if (tradeAmt < 1) tradeAmt = 1;
                    //console.log('Trade count: ', tradeAmt, myRes['catpower'].value);
                    btn = getTradeBtn(3);
                    if (btn) {
                        for (var i = 0; i < tradeAmt; i++) {
                            btn.tradeMultiple(1);
                        }
                    }
                    gamePage.activeTabId = 'Bonfire';
                    gamePage.render();

                } //else if (blueprints low; trade with others....
            }
            return false;
        }

        var smartShip = function () {
            var shipCraft = gp.workshop.getCraft('ship');
            if (myRes['starchart'].value >= 25 && shipCraft.unlocked && myRes['ship'].value < 2) {
                //console.log('try ship', JSON.stringify(shipCraft), JSON.stringify(shipCraft.prices))
                for (iType in shipCraft.prices) {
                    //console.log(shipCraft.prices[iType].name, Math.ceil(shipCraft.prices[iType].val))
                    smartCraftAddRequest(shipCraft.prices[iType].name, Math.ceil(shipCraft.prices[iType].val));
                }

                if (gp.resPool.hasRes(shipCraft.prices)) {
                    console.log('build ship');
                    gp.craft('ship', 1, true);
                }
            }
            if (myRes['ship'].value >= 1) {
                for (iType in shipCraft.prices) {
                    smartCraftClearRequest(shipCraft.prices[iType].name, Math.ceil(shipCraft.prices[iType].val));
                }
                return true;
            }
            return false;
        };

        var smartUnicorn = function () {
            //if (myRes['unicorns'].value>50000) {
            //    console.log(myRes['unicorns'].value);
            //    var amt = 1;
            //    gp.resPool.get("unicorns").value -= amt * 2500;
            //    gp.religion.sacrifice(amt);
            //    gp.religion.update();
            //}
            return true;
        };

        var faithHasSolar = false;
        var smartStartFaith = function () {

            if (faithHasSolar || myRes['faith'].maxValue > 10000) {
                if (smartCraftRequest['gold'] && smartCraftRequest['gold'] == 500) {
                    smartCraftRequest['gold'] = 0;
                }
                return true;
            }
            if (myRes['ship'].value >= 1 && gp.religionTab.visible) {
                if (myRes['faith'].value > 750 && myRes['gold'].value > 500) {

                    gamePage.activeTabId = 'Religion';
                    gamePage.render();
                    var solar = $(".btnContent:contains('Solar Revolution')");

                    if (solar.text().indexOf('(') > 0) {
                        if (smartCraftRequest['gold'] && smartCraftRequest['gold'] == 500) {
                            smartCraftRequest['gold'] = 0;
                        }
                        gamePage.activeTabId = 'Bonfire';
                        gamePage.render();
                        faithHasSolar = true;
                        return true;
                    }
                    if (!solar.parent().hasClass('disabled')) {
                        smartCraftClearRequest('gold', 500);
                        solar.click();
                        smartLog(solar.text(), "Sci");
                        faithHasSolar = true;
                        gamePage.activeTabId = 'Bonfire';
                        gamePage.render();
                        return true;
                    } else {
                        $(".btnContent:contains('Praise the sun')").click();
                    }
                    gamePage.activeTabId = 'Bonfire';
                    gamePage.render();
                } else {

                    if (!faithHasSolar) { smartCraftAddRequest('gold', 500); }
                }
            }
            return false;
        };


        var smartEvents = [
            function () { return smartFaith() },
            function () { return smartTrade() },
            function () { return smartHunt() },
            function () { return smartObserveAstro() },
            function () { return smartTradeUnlock() },
            function () { return smartShip() },
            function () { return smartStartFaith() },
            function () { return smartUnicorn() },
            function () { return smartHuntTwo() },
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
            if (!scriptEnabled || isReset) return;


            //console.log('events', JSON.stringify(smartEvents))
            for (fn in smartEvents) {
                var result = smartEvents[fn]();
                if (result) smartEvents.splice(fn, 1);
                if (result) break;
            }

            if (smartEvents.length == 0) clearInterval(smartEventTmr);

            if (myRes['catpower'].perTickUI > 10000) {
                clearInterval(smartEventTmr);
                smartEventTmr = setInterval(smartEvent, 1000);
            }
            return true;

        }
        var smartEventTmr;
        smartEventTmr = setInterval(smartEvent, 3000);

//Smart-Sci
        var smartSciOrders = [
            ['Science', 'calendar'],
            ['Science', 'agriculture'],
            ['Science', 'mining'],
            ['Science', 'archery'],
            ['Science', 'metal'],
            ['Workshop', 'mineralAxes', true],
            ['Workshop', 'mineralHoes'],
            ['Workshop', 'bolas'],
            ['Science', 'animal'],
            ['Workshop', 'ironAxes'],
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
            ['Workshop', 'crossbow'],
            ['Workshop', 'coalFurnace'],
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
            ['Workshop', 'steelSaw'],
            ['Workshop', 'pyrolysis'],
            ['Science', 'chemistry'],
            ['Science', 'acoustics'],
            ['Science', 'archeology'],
            ['Science', 'electricity'],
            ['Workshop', 'cargoShips'],
            ['Science', 'industrialization'],
            ['Science', 'biology'],
            ['Workshop', 'geodesy'],
            ['Workshop', 'silos'],
            ['Workshop', 'astrolabe'],
            ['Workshop', 'alloyAxe'],
            ['Workshop', 'titaniumSaw'],
            ['Workshop', 'titaniumWarehouses'],
            ['Workshop', 'alloyArmor'],
            ['Workshop', 'alloySaw'],
            ['Workshop', 'alloyBarns'],
            ['Workshop', 'alloyWarehouses'],
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
            ['Workshop', 'pneumaticPress'],
            ['Workshop', 'offsetPress'],//Offset Press
            ['Workshop', 'oilRefinery'],//Oil Refinery
            ['Workshop', 'combustionEngine'],
            ['Science', 'robotics'],//Robotics,
            ['Workshop', 'steelPlants'],//
            ['Science', 'nuclearFission'],//,Nuckear Fission
            ['Science', 'rocketry'],//,Rocketry
            ['Science', 'particlePhysics'],//,Particle Physics
            ['Workshop', 'rotaryKiln'],//
            ['Workshop', 'nuclearSmelters'],//
            ['Workshop', 'reactorVessel'],//
            ['Workshop', 'enrichedUranium'],//
            ['Workshop', 'railgun'],//
            ['Workshop', 'oilDistillation'],//
            ['Workshop', 'refrigeration'],//CAD System
            ['Science', 'nanotechnology'],//,Nanotech
            ['Workshop', 'augumentation'],//
            ['Workshop', 'nanosuits'],//
            ['Workshop', 'photovoltaic'],//
            ['Workshop', 'fluidizedReactors'],//
            ['Science', 'sattelites'],//,Satellites
            ['Science', 'oilProcessing'],//,Oil Processing
            ['Workshop', 'factoryProcessing'],//
            ['Science', 'orbitalEngineering'],//,Orbital Engineering
            ['Workshop', 'hubbleTelescope'],//
            ['Workshop', 'solarSatellites'],//
            ['Workshop', 'satnav'],//
            ['Workshop', 'barges'],//
            ['Workshop', 'automatedPlants'],//
            ['Workshop', 'photolithography'],//
            ['Workshop', 'satelliteRadio'],//
            ['Science', 'genetics'],//,Genetics
            ['Science', 'exogeology'],//,Exogeology
            ['Science', 'superconductors'],//,Superconductors
            ['Science', 'advExogeology'],//,Advanced Exogeology
            ['Workshop', 'unicornSelection'],//
            ['Workshop', 'gmo'],//
            ['Science', 'metaphysics'],//,Metaphysics
            ['Workshop', 'unobtainiumHuts'],//
            ['Workshop', 'unobtainiumDrill'],//
            ['Workshop', 'hydroPlantTurbines'],//
            ['Workshop', 'unobtainiumReflectors'],//
            ['Workshop', 'astrophysicists'],//
            ['Workshop', 'storageBunkers'],//
            ['Workshop', 'factoryLogistics'],//
            ['Workshop', 'mWReactor'],//
            ['Workshop', 'spaceManufacturing'],//
            ['Workshop', 'eludiumReflectors'],//
            ['Workshop', 'coldFusion'],//
            ['Workshop', 'eludiumHuts'],//
            ['Workshop', 'eludiumCracker'],//
            ['Science', 'dimensionalPhysics'],//,Dimension Physics
            ['Workshop', 'energyRifts'],//
            ['Workshop', 'lhc'],//
            ['Science', 'chronophysics'],//Chronophysics,
            ['Workshop', 'stasisChambers'],//
            ['Workshop', 'fluxCondensator'],//
            ['Workshop', 'voidEnergy'],//
            ['Workshop', 'darkEnergy'],//
            ['Science', 'antimatter', true],//Antimatter,
            ['Workshop', 'amReactors'],//
            ['Workshop', 'amBases'],//
            ['Science', 'tachyonTheory'],//tachyonTheory,
            ['Workshop', 'tachyonAccelerators']//
            //['Workshop', 'chronoforge']//
            // , , , , , , , , , , , , Chronophysics
        ];

        var smartSci = function (idx) {

            if (!scriptEnabled || isReset) return;
            if (smartSciOrders.length < 1) return;
            if (smartSciOrders.length <= idx) return;
            idx = idx || 0;
            var sciOrder = smartSciOrders[idx];
            var techName = sciOrder[1];
            var tech;

            if (sciOrder[0] == "Science") {
                tech = gp.science.get(techName);
            } else {
                tech = gp.workshop.get(techName);
            }

            //console.log(idx, JSON.stringify(tech.title));

            if (tech.researched) {
                //console.log('delete', smartSciOrders[0][1], smartSciOrders[idx][1]);
                smartSciOrders.splice(idx, 1);
                //console.log('is first', smartSciOrders[0][1]);
                if (idx == 0) smartSci();
                return;
            }

            if (tech.unlocked) {
                var canGet = false;
                var prices = {};
                if (tech.cost) prices = [{name: "science", val: tech.cost}];
                if (tech.prices) prices = tech.prices;
                canGet = gp.resPool.hasRes(prices);

                if (canGet) {
                    gamePage.activeTabId = sciOrder[0];
                    gamePage.render();
                    var btn = smartGetButton(sciOrder[0], tech.title);
                    //console.log(btn);
                    if (btn && btn.enabled && btn.visible && btn.handler) {
                        smartLog(tech.title, "Sci");
                        for (iType in prices) {
                            smartCraftClearRequest(prices[iType].name, prices[iType].val)
                        }
                        $(".btnContent:contains('" + tech.title + "')").click();

                        smartSciOrders.splice(idx, 1);
                    }
                    gamePage.activeTabId = 'Bonfire';
                    gamePage.render();
                } else {
                    //Let's ask for resources
                    if (idx == 0) {
                        $("#devSci").text('Science: ' + tech.title);
                        for (iType in prices) {
                            smartCraftAddRequest(prices[iType].name, prices[iType].val)
                        }
                    }

                    //Try next Science; until reached unlock.
                    if (sciOrder.length < 3 || !sciOrder[2]) {
                        if (idx < 6) {
                            smartSci(idx + 1);
                        }
                    }
                }
            } else {
                //console.log('Not unolocked', tech.title, tech.name)
            }

            //console.log(btn && btn.enabled && btn.visible)
        }
        var smartSciTmr;
        smartSciTmr = setInterval(smartSci, 1000);

//Smart-Pop
// Woodcutter, Farmer, Scholar, Hunter, Miner, Priest, Geologist
        var smartPopOrders = [
            [2, 0, 2, 0, 0, 0, 0],
            [3, 1, 2, 0, 0, 0, 0],
            [4, 1, 2, 0, 1, 0, 0],
            [4, 1, 2, 1, 2, 0, 0],
            [14, 2, 3, 3, 3, 0, 0],
            [30, 2, 4, 10, 10, 0, 0],
            [35, 2, 4, 20, 12, 0, 0],
            [40, 2, 6, 25, 13, 15, 0],
            [50, 2, 6, 25, 14, 20, 20],
            [60, 2, 10, 60, 15, 25, 60],
            [60, 2, 10, 60, 30, 60, 70],
            [60, 2, 10, 80, 32, 80, 80],
            [60, 2, 10, 90, 18, 90, 90],
            [60, 2, 15, 100, 18, 100, 100],
            [60, 2, 25, 100, 18, 1000, 100]
        ];
        var smartPopOrdersLast = 0;
        var smartPopTmr;
        var smartPopTmrDelay = 1000;
        var smartPopIsAssign = false;
        var smartPopRefresh = {};
        if (myRes['kittens'].value > 100) smartPopRefresh[100] = true;
        if (myRes['kittens'].value > 200) smartPopRefresh[200] = true;
        if (myRes['kittens'].value > 300) smartPopRefresh[300] = true;
        if (myRes['kittens'].value > 400) smartPopRefresh[400] = true;
        if (myRes['kittens'].value > 450) smartPopRefresh[450] = true;
        if (myRes['kittens'].value > 475) smartPopRefresh[475] = true;
        if (myRes['kittens'].value > 500) smartPopRefresh[500] = true;
        if (myRes['kittens'].value > 550) smartPopRefresh[550] = true;
        if (myRes['kittens'].value > 600) smartPopRefresh[600] = true;
        if (myRes['kittens'].value > 700) smartPopRefresh[700] = true;
        var smartPop = function () {
            //console.log('pop');
            //console.log('try kittens', smartPopTmrDelay);
            if (!scriptEnabled || (gamePage.activeTabId != 'Bonfire' && !smartPopIsAssign)) {
                clearTimeout(smartPopTmr);
                smartPopTmr = setTimeout(smartPop, 5000);
                return;
            }

            //ASsign all kittens, then go back to Bonfire

            var freeKittens = gp.village.getFreeKittens();

            if (freeKittens > 0) {
                smartPopIsAssign = true;
                gamePage.activeTabId = 'Small village';
                gamePage.render();

                var getBtn = function (idx) {
                    if (gp.villageTab.buttons[idx].visible) {
                        return gp.villageTab.buttons[idx];
                        //gp.villageTab.buttons[i].handler();
                        //smartLog("Kittens Assigned: " + gp.village.jobs[i].title)
                    }
                };

                var isNext = false;
                var assignKitten = function (idx) {
                    if (gp.villageTab.buttons[idx].visible) {
                        gp.villageTab.buttons[idx].handler();
                        smartLog("Kittens Assigned: " + gp.village.jobs[idx].title, "Sci")
                    }
                };

                var wood = getBtn(0);
                var woodCnt = gp.village.jobs[0].value;
                var miner = getBtn(4);
                var minerCnt = gp.village.jobs[4].value;
                var farmer = getBtn(1);
                var farmerCnt = gp.village.jobs[1].value;
                var priest = getBtn(5);
                var priestCnt = gp.village.jobs[5].value;
                var scholar = getBtn(2);
                var scholarCnt = gp.village.jobs[2].value;
                var hunter = getBtn(3);
                var hunterCnt = gp.village.jobs[3].value;
                if (!priest) priestCnt = 100;
                var geo = getBtn(6);
                var geoCnt = gp.village.jobs[6].value;
                var maxWoodTick = (myRes['wood'].maxValue / 5) / 120;
                var maxMinerTick = (myRes['minerals'].maxValue / 5) / 120;
                var maxGeoCoalTick = (myRes['coal'].maxValue / 5) / 5;
                var maxGeoGoldTick = (myRes['gold'].maxValue / 5) / 5;
                var maxSciTick = (myRes['science'].maxValue / 5) / 600;
                var geoToPriestRatio = 1.3;
                var scholarToPriestRatio = .1;
                var ironToCoalRatio = .8;
                var catToMineralRatio = .1;
                var maxScholar = 2;
                var maxHunter = 100;
                var maxGeo = 100;
                if (geoCnt > 70) geoToPriestRatio = 1;
                if (geoCnt > 100) geoToPriestRatio = .7;
                var maxFarmer = 1;
                if (myRes['kittens'].value > 10) {
                    if (myRes['paragon'].value < 200) maxFarmer = 4;
                    if (myRes['paragon'].value < 600) maxFarmer = 2;
                    maxScholar = 3;
                }
                if (myRes['kittens'].value > 100) {
                    maxWoodTick = maxWoodTick * 2;
                    maxMinerTick = maxMinerTick * 2;
                    maxScholar = 6;
                    catToMineralRatio = .1;
                }
                if (myRes['kittens'].value > 200) {
                    maxWoodTick = maxWoodTick * 2;
                    maxMinerTick = maxMinerTick * 2;
                    maxScholar = 10;
                    ironToCoalRatio = .6;
                }
                if (myRes['kittens'].value > 400) {
                    maxWoodTick = maxWoodTick * 1.5;
                    maxMinerTick = maxMinerTick * .9;
                    maxScholar = 20;
                    ironToCoalRatio = .6;
                    scholarToPriestRatio = .07;
                }

                var checkRefresh = function (num) {
                    if (!smartPopRefresh[num] && myRes['kittens'].value > num) {
                        gp.village.clearJobs();
                        smartPopRefresh[num] = true;
                    }
                };

                checkRefresh(100);
                checkRefresh(200);
                checkRefresh(300);
                checkRefresh(400);
                checkRefresh(450);
                checkRefresh(475);
                checkRefresh(500);
                checkRefresh(550);
                checkRefresh(600);
                checkRefresh(700);

                //console.log(maxWoodTick, maxMinerTick, maxGeoCoalTick, maxGeoGoldTick);
                if (scholar && myRes['manuscript'].value > myRes['compendium'].value / 8 && scholarCnt < geoCnt / 3) {
                    assignKitten(2);
                }
                else if (myRes['wood'].perTickUI <= maxWoodTick && myRes['wood'].perTickUI < myRes['minerals'].perTickUI) {
                    assignKitten(0);
                } else if (farmer && //farmer
                    (farmerCnt < maxFarmer)) {
                    assignKitten(1);
                } else if (scholar && //scholar
                    (((myRes['science'].perTickUI < maxSciTick && scholarCnt < maxScholar) && woodCnt > scholarCnt)
                    || (priest && scholarCnt < priestCnt * scholarToPriestRatio))) {
                    assignKitten(2);
                } else if (priest && //priest
                    (priestCnt < minerCnt && priestCnt < geoCnt / 2)) {
                    assignKitten(5);
                } else if (geo && geoCnt < maxGeo && //Geo
                    (myRes['coal'].perTickUI <= myRes['minerals'].perTickUI * .05) &&
                    (myRes['minerals'].perTickUI > maxMinerTick * .5) &&
                    (geoCnt < hunterCnt + 1) &&
                    (geoCnt <= priestCnt * .7)) {
                    assignKitten(6);
                } else if (hunter && hunterCnt < maxHunter && //hunter
                    (myRes['catpower'].perTickUI < myRes['minerals'].perTickUI * catToMineralRatio) &&
                    (woodCnt > hunterCnt || geoCnt > hunterCnt) && minerCnt > 1 &&
                    (!priest || hunterCnt < priestCnt * 2) &&
                    (!geo || geoCnt > hunterCnt - 1)) {
                    assignKitten(3);
                } else if (miner && //Miner
                    myRes['minerals'].perTickUI <= maxMinerTick &&
                    (minerCnt * .6 < priestCnt || !priest) &&
                    (geoCnt > hunterCnt - 1 || !geo)) {
                    assignKitten(4);
                } else if (geo && geoCnt < maxGeo && //Geo
                    (myRes['coal'].perTickUI <= maxGeoCoalTick || myRes['gold'].perTickUI <= maxGeoGoldTick) &&
                    (myRes['coal'].perTickUI <= myRes['iron'].perTickUI * ironToCoalRatio) &&
                    (geoCnt < hunterCnt + 1) &&
                    (geoCnt <= priestCnt * geoToPriestRatio)) {
                    assignKitten(6);
                } else {

                    //assign priest; or woodcutter if not unlocked.
                    if (priest) { assignKitten(5); } else {
                        if (miner) { assignKitten(4); } else {
                            assignKitten(0); //woodcutter.
                        }
                    }
                    //priest
                }

                //console.log(wood, maxWoodTick)

            } else {
                if (smartPopIsAssign && gamePage.activeTabId == 'Small village') {
                    gamePage.activeTabId = 'Bonfire';
                    gamePage.render();
                }
                smartPopIsAssign = false;

            }

            smartPopTmrDelay += 100;
            if (smartPopTmrDelay > 10000 || myRes['kittens'].value == gp.village.maxKittens) smartPopTmrDelay = 10000;
            if (freeKittens > 0 && smartPopTmrDelay > 50) smartPopTmrDelay = 50;
            clearTimeout(smartPopTmr);
            smartPopTmr = setTimeout(smartPop, smartPopTmrDelay);

            //return;
            //if (freeKittens > 0) {
            //
            //    var amtKittens = smartPopOrders[0];
            //
            //    var popAssign = 0;
            //
            //    //run simulation
            //    var kittensSim = [0, 0, 0, 0, 0, 0, 0];
            //    var kittensCnt = myRes['kittens'].value;
            //    var hasKitten = false;
            //    do {
            //        hasKitten = false;
            //        for (i = 0; i < kittensSim.length; i++) {
            //            if (kittensSim[i] < amtKittens[i]) {
            //                kittensSim[i]++
            //                kittensCnt--;
            //                hasKitten = true;
            //            }
            //        }
            //    } while (kittensCnt > 0 && hasKitten);
            //
            //    amtKittens = kittensSim;
            //
            //    do {
            //
            //        if (smartPopOrdersLast + 1 > amtKittens.length - 1) smartPopOrdersLast = -1;
            //        for (var i = smartPopOrdersLast + 1; i < amtKittens.length; i++) {
            //            var desire = amtKittens[i];
            //            var current = gp.village.jobs[i].value;
            //
            //            if (desire > current) {
            //                //console.log('add: ' + gp.village.jobs[i].title)
            //                if (gp.villageTab.buttons[i].visible) {
            //                    gp.villageTab.buttons[i].handler();
            //                    smartLog("Kittens Assigned: " + gp.village.jobs[i].title)
            //                }
            //                freeKittens--;
            //            }
            //
            //            smartPopOrdersLast = i;
            //            GM_setValue('smartPopOrdersLast', smartPopOrdersLast);
            //        }
            //        popAssign++;
            //    } while (freeKittens > 0 && popAssign < 100)
            //
            //    var next = true
            //    for (var i = 0; i < amtKittens.length; i++) {
            //        var desire = amtKittens[i];
            //        var current = gp.village.jobs[i].value;
            //        if (desire > current) {
            //            next = false;
            //        }
            //    }
            //
            //    if (next) smartPopOrders.shift();
            //    if (freeKittens > 0) { smartPop() } //Try again.
            //
            //    gamePage.activeTabId = 'Bonfire';
            //    gamePage.render();
            //}
            //
            //smartPopTmrDelay += 100;
            //if (smartPopTmrDelay > 30000 || myRes['kittens'].value == gp.village.maxKittens) smartPopTmrDelay = 30000;
            //if (freeKittens > 0 && smartPopTmrDelay > 1000) smartPopTmrDelay = 1000;
            //clearTimeout(smartPopTmr);
            //smartPopTmr = setTimeout(smartPop, smartPopTmrDelay);

        };

        smartPopTmr = setTimeout(smartPop, smartPopTmrDelay);

//Smart-Build
        var priceToKey = function (prices) {
            var ret = {}
            for (resPri in prices) {
                ret[prices[resPri].name] = prices[resPri].val
            }
            return ret;
        }

        var priceCheck = function (bld, prices, req) {
            var isMaxLimited = false
            var canBuild = true
            var priceName = priceToKey(prices);
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
            if (bld.val < 5) return [true, false];
            return priceCheck(bld, prices, {
                'beam': (prices[0].val) + 25,
                'slab': (prices[1].val) + 10
            })
        };

        var buildCheckObservatory = function (bld, prices) {
            return priceCheck(bld, prices, {
                'scaffold': parseInt(prices[0].val * (2 - (.01 * bld.val)) - prices[0].val),
                'slab': parseInt(prices[1].val * (2 - (.01 * bld.val))) - prices[1].val
            })
        };

        var bioLabCheck = function (bld, prices) {
            if (bld.val > 100) return [false, true]
            return priceCheck(bld, prices, {
                'slab': parseInt(prices[0].val * 1.5),
                'alloy': parseInt(prices[1].val * 1.5)
            })
        };

        var broadcastTowerCheck = function (bld, prices) {
            if (bld.val < myRes['kittens'].value / 7 && (myRes['titanium'].value > myRes['titanium'].maxValue * .9 || myRes['titanium'].value > prices[1].val * 2)) return [true, false];
            if (myRes['plate'].value > myRes['titanium'].maxValue * 10) return [true, false];
            return priceCheck(bld, prices, {
                'iron': parseInt(prices[0].val * 5)
            })
        };

        var craftBldEnabledCheck = function (bld, prices) {
            var canBuild = true;
            var workshop = gp.bld.getPrices('workshop');
            var factory = gp.bld.getPrices('factory');

            if (gp.bld.getBuilding('workshop').unlocked) {
                canBuild = gp.resPool.isStorageLimited(workshop);
            }
            if (canBuild && gp.bld.getBuilding('factory')) {
                canBuild = gp.resPool.isStorageLimited(factory);
            }

            return [canBuild, false];
        };

        var buildCheckPrimaryBldCheck = function (bld, prices) {
            var ret = craftBldEnabledCheck(bld, prices);
            var canBuild = ret[0];

            if (canBuild) {
                var hut = gp.bld.getPrices('hut');
                var logHouse = gp.bld.getPrices('logHouse');
                var mansion = gp.bld.getPrices('mansion');

                if (gp.bld.getBuilding('hut').unlocked) {
                    canBuild = gp.resPool.isStorageLimited(hut);
                }
                if (canBuild && gp.bld.getBuilding('logHouse')) {
                    canBuild = gp.resPool.isStorageLimited(logHouse);
                }
                if (canBuild && gp.bld.getBuilding('mansion') && myRes['ship'].value > 1000) {
                    //Does not run until ships are higher then 1000;
                    canBuild = gp.resPool.isStorageLimited(mansion);
                }
            }
            //insure at least 5 of a new building are built.
            if (!canBuild && bld.val < 5) { canBuild = true; }
            if (!canBuild && bld.name == 'smelter' && myRes['iron'].perTickUI > myRes['coal'].perTickUI * .7) { canBuild = true; }
            if (!canBuild) {
                //Try override: if building cost less then 1/3 current value
                var priceName = priceToKey(prices);
                var wood = (priceName['wood']) ? Math.ceil(priceName['wood'] * 3) : 0;
                if (myRes['wood'].value > myRes['minerals'].value * 1.1) {
                    wood = (priceName['wood']) ? Math.ceil(priceName['wood'] * 1.5) : 0;
                }
                var minerals = (priceName['minerals']) ? Math.ceil(priceName['minerals'] * 3) : 0;
                var steel = (priceName['steel']) ? Math.ceil(priceName['steel'] * 3) : 0;
                var iron = (priceName['iron']) ? Math.ceil(priceName['iron'] * 3) : 0;
                var check = priceCheck(bld, prices, {
                    'wood': wood,
                    'minerals': minerals,
                    'steel': steel,
                    'iron': iron
                })
                canBuild = check[0];
                //console.log(bld.name, canBuild, minerals, priceName['minerals'])
                //if (priceName['minerals']) console.log(JSON.stringify(priceName['minerals']))
            }

            return [canBuild, false];
        };

        var buildCheckMansion = function (bld, prices) {
            if (bld.val > 5 && myRes['titanium'].value < 300 + prices[2].val) return [false, false];
            if (bld.val > 10 && myRes['titanium'].value < 500 + prices[2].val) return [false, false];
            if (smartCraftRequest['titanium'] && myRes['titanium'].value < smartCraftRequest['titanium'] + prices[2].val && smartCraftRequest['titanium'] != Math.ceil(prices[2].val)) return [false, false];
            return [true, false]
        }

        var buildCraftEludiumReq = function (bld, prices) {//eludium
            //Focus on Obs to get starcharts.
            if (smartCraftRequest['eludium'] && myRes['eludium'].value - smartCraftRequest['eludium'] > 1) {
                var priceName = priceToKey(prices);
                if (priceName['eludium'] == smartCraftRequest['eludium']) { return [true, false] }
                if (myRes['eludium'].value - priceName['eludium'] - smartCraftRequest['eludium'] > 1) { return [true, false] }
            } else if (!smartCraftRequest['eludium']) {
                return [true, false]
            }

            return [false, false]
        }

        var buildCraftStarchartReq = function (bld, prices) {
            //Focus on Obs to get starcharts.
            if (bld.val < 50 && smartCraftRequest['starchart'] && smartCraftRequest['starchart'] > 0 && prices[2].val < myRes['iron'].maxValue) {
                makePriority(bld, prices)
                return [true, false]
            }
            return [false, false]
        }

        var buildCheckGoldTrade = function (bld, prices) {

            if (tradeLevel > 4 && myRes['titanium'].value < myRes['titanium'].maxValue * .1) {
                return [false, false]
            }
            return [true, false]
        }

        var buildCheckPasture = function (bld, prices) {
            if (bld.val > 50)  return [false, true]; //Has reached end of build cycle.
            if (myRes['wood'].perTickUI < bld.val / 10)  return [false, true]; //Has reached end of build cycle.
            return [true, false]
        };

        var buildCheckElectric = function (bld, prices) {
            if (myRes['energy'].value < 10.1)  return [false, true]; //Has reached end of build cycle.
            return [true, false]
        }

        var buildCheckElectricSmall = function (bld, prices) { //OilWell
            if (bld.val > 10 && myRes['energy'].value < 2.1)  return [false, true]; //Has reached end of build cycle.
            return [true, false]
        };

        var buildCheckAqueduct = function (bld, prices) {

            if (bld.val > 100)  return [false, true]; //Has reached end of build cycle.
            if (myRes['minerals'].perTickUI < bld.val)  return [false, true]; //Has reached end of build cycle.
            return [true, false]
        };

        var buildCheckSolarFarm = function (bld, prices) {
            if ((!smartCraftRequest['titanium'] || smartCraftRequest['titanium'] < 1) && myRes['titanium'].value > myRes['titanium'].maxValue - 1) return [true, false];
            if ((smartCraftRequest['titanium'] > 0 && myRes['energy'].value > 5) || myRes['energy'].value > 100) return [false, false]; //Don't build to much power.
            if (myRes['titanium'].value > myRes['titanium'].maxValue * .9 || myRes['energy'].value < 5) return [true, false];
            return [false, false]
        };

        var buildCheckTradepost = function (bld, prices) {
            if (bld.val < 20 && (myRes['gold'].value < myRes['gold'].maxValue - 1 || myRes['gold'].value < prices[2].val * 11)) return [false, false];
            if (bld.val > 10 && (myRes['ship'].value < 10)) return [false, false];
            if (smartCraftRequest['gold'] && myRes['gold'].value < myRes['gold'].maxValue - 10) return [false, false]; //Let get the gold first...
            return [true, false]
        };
        var buildCheckHydra = function (bld, prices) {
            if (bld.val > 10 && myRes['kerosene'].value > 1000000) return [false, false];
            return [true, false]
        };


        var buildCheckOil = function (bld, prices) {
            if (bld.val > 100 && myRes['oil'].perTickUI > myRes['culture'].perTickUI / 1.7) return [false, false];
            return [true, false]
        };
        var buildCheckCalciner = function (bld, prices) {
            if (bld.val > 50 && myRes['iron'].perTickUI > myRes['coal'].perTickUI * 4) return [false, false];
            return [true, false]
        };

        var buildCheckChrono = function (bld, prices) {
            if (bld.val > 14) return [false, false];
            return [true, false]
        };

        var buildCheckCracker = function (bld, prices) {
            if (myRes['uranium'].perTickUI > 50) return [false, false];
            return [true, false]
        };

        var buildCheckMoonBase = function (bld, prices) {
            //if (bld.val > 30) return [false, false];
            return [true, false]
        };

        var buildCheckTemple = function (bld, prices) {
            if (bld.val > 10 && myRes['ship'].value < 1 && gamePage.workshop.getCraft('ship').unlocked) return [false, false]; //Let ships build first
            if (smartCraftRequest['gold'] && myRes['gold'].value - prices[2].val < smartCraftRequest['gold'] * 1.1) return [false, false]; //Let get the gold first...
            return [true, false]
        };
        var buildCheckHarbour = function (bld, prices) {
            if (bld.val > 0 && myRes['ship'].value < 1 && gamePage.workshop.getCraft('ship').unlocked) return [false, false]; //Let ships build first
            return [true, false]
        };
//This makes sure all Improtant buildings are ('MAXED')
        var primaryBldEnabledCheck = function (bld, prices) {

            return buildCheckPrimaryBldCheck(bld, prices)
        };

        var popModeCheck = function (bld, prices) {
            return [true, false];
        };

        var bluePrintCheck = function (bld, prices) {
            var pricesKey = priceToKey(prices);
            if (pricesKey['blueprint'] && pricesKey['blueprint'] * 5 < myRes['blueprint'].value) return [true, false];
            return priceCheck(bld, prices, {
                'blueprint': 1000
            })
        };

        var makePriority = function (bld, prices) {
            //Allows for crafting to be on hold, until demands are met.
            if (!gp.resPool.isStorageLimited(prices)) {
                for (iType in prices) {
                    smartCraftAddRequest(prices[iType].name, Math.ceil(prices[iType].val))
                }
            }

            return [true, false];
        };


//GM_setValue('buildDex', 19)
        var buildDex = 1; //GM_getValue('buildDex', 1);

        var lastBuildOrders = [
            ['space', 'kairo', 'spaceBeacon', 10000, [buildCheckElectric]],
            ['space', 'piscine', 'orbitalArray', 10000, [buildCheckElectric, buildCraftEludiumReq]],
            ['space', 'piscine', 'researchVessel', 10000],
            ['space', 'moon', 'moonBase', 10000, [buildCheckElectric, buildCheckMoonBase]],
            ['space', 'dune', 'hydrofracturer', 10000, [buildCheckHydra]],
            ['space', 'dune', 'planetCracker', 10000, [buildCheckCracker]],
            ['space', 'moon', 'moonOutpost', 10000, [buildCheckElectric]],
            ['space', 'helios', 'sunlifter', 10000, [buildCraftEludiumReq]],
            ['space', 'terminus', 'cryostation', 10000, [buildCraftEludiumReq]],
            ['space', 'cath', 'sattelite', 10000],
            ['space', 'cath', 'spaceElevator', 10000],
            ['space', 'cath', 'spaceStation', 10000],
            ['chronosphere', 10000, [primaryBldEnabledCheck, buildCheckChrono]],
            ['ziggurat', 10000, [bluePrintCheck, primaryBldEnabledCheck]],
            ['unicornPasture', 10000],
            ['amphitheatre', 10000, [primaryBldEnabledCheck]],
            ['broadcastTower', 10000, [broadcastTowerCheck, primaryBldEnabledCheck]],
            ['mint', 10000, [buildCheckGoldTrade]],
            ['tradepost', 10000, [buildCheckGoldTrade, buildCheckTradepost]],
            ['accelerator', 10000, [buildCheckElectric]],
            ['oilWell', 10000, [primaryBldEnabledCheck, buildCheckElectricSmall, buildCheckOil]],
            ['lumberMill', 10000, [primaryBldEnabledCheck]],
            ['magneto', 10000, [bluePrintCheck]],
            ['reactor', 10000, [bluePrintCheck]],
            ['steamworks', 10000, [bluePrintCheck, primaryBldEnabledCheck]],
            ['calciner', 10000, [bluePrintCheck, primaryBldEnabledCheck, buildCheckElectric, buildCheckCalciner]],
            ['smelter', 10000, [primaryBldEnabledCheck]],
            ['quarry', 10000, [primaryBldEnabledCheck]],
            ['mine', 10000, [primaryBldEnabledCheck]],
            ['harbor', 10000, [buildCheckHarbour]],
            ['warehouse', 10000, [primaryBldEnabledCheck, warehouseCheck]],
            ['barn', 10000],
            ['biolab', 10000, [bioLabCheck, primaryBldEnabledCheck]],
            ['observatory', 10000, [primaryBldEnabledCheck]],
            ['academy', 10000, [primaryBldEnabledCheck]],
            ['library', 10000, [primaryBldEnabledCheck]],
            ['aqueduct', 10000, [buildCheckAqueduct, primaryBldEnabledCheck]],
            ['hydroPlant', 10000, [buildCheckSolarFarm]],
            ['pasture', 10000, [buildCheckPasture, primaryBldEnabledCheck]],
            ['solarFarm', 10000, [buildCheckSolarFarm]],
            ['field', 10000],
            ['temple', 10000, [buildCheckGoldTrade, buildCheckTemple]],
            ['chapel', 10000],
            ['mansion', 10000, [makePriority, buildCheckMansion]],
            ['logHouse', 10000, [makePriority]],
            ['hut', 10000, [makePriority]],
            ['factory', 10000, [makePriority]],
            ['workshop', 10000, [makePriority]],
            ['observatory', 10000, [buildCraftStarchartReq]]
        ];
        //lastBuildOrders = [
        //    ['broadcastTower', 10000, [popModeCheck, primaryBldEnabledCheck]]
        //]

        var smartBuildOrdersFn = function () {
            return [ //-1 means build until other condition are met.
                [['hut', -1], ['field', 20], ['hut', 1]], //1
                [['library', 1], ['hut', 2]], //2
                [['field', 30], ['library', 3], ['hut', 3]],//3
                [['field', 40], ['library', 4], ['hut', 4]],//4
                [['library', -1], ['hut', -1], ['field', -1], ['Science', 'mining']],//5 (//Mining)
                [['hut', -1], ['field', 50], ['mine', 1]], //6
                [['hut', -1], ['hut', 5]], //6
                [['mine', -1], ['hut', -1], ['field', 50], ['mine', 2], ['workshop', 1], ['barn', 3], ['library', 8]], //7
                [['hut', -1], ['field', 60], ['library', 10], ['hut', 6]], //8
                [['hut', -1], ['workshop', -1], ['mine', -1], ['field', -1], ['Science', 'animal']], //Wait for mineral hoe, axe, bola, make more mines. //9 (Hunters)
                [['hut', -1], ['smelter', 1], ['workshop', 2], ['field', 90], ['library', 12], ['pasture', -1], ['mine', 5], ['barn', 4]],
                [['mine', 7], ['hut', 7]],
                [['hut', -1], ['field', -1], ['smelter', 2], ['logHouse', 5]], //12
                [['hut', -1], ['field', -1], ['logHouse', -1], ['aqueduct', -1], ['academy', -1], ['workshop', -1], ['logHouse', 8], ['lumberMill', 2]]//,
                //[['workshop', -1], ['hut', -1], ['logHouse', -1], ['field', -1],
                //    ['mine', -1], ['warehouse', -1, [warehouseCheck]], ['barn', -1], ['library', -1], ['hut', 10000], ['workshop', 10000], ['unicornPasture', 10000]],
                //[['workshop', -1], ['hut', -1], ['logHouse', -1], ['field', -1],
                //    ['warehouse', -1, [warehouseCheck]], ['amphitheatre', 2], ['tradepost', 1], ['academy', 20], ['lumberMill', 6], ['warehouse', 6], ['smelter', 12], ['barn', 10], ['logHouse', 35], ['hut', 8]],
                //[['workshop', -1], ['hut', -1], ['logHouse', -1], ['field', -1],
                //    ['lumberMill', 20], ['warehouse', 20], ['smelter', 14], ['mine', 30], ['workshop', 10000], ['logHouse', 10000], ['hut', 10000]],
                //[['workshop', -1], ['hut', -1], ['logHouse', -1], ['field', -1],
                //    ['amphitheatre', 14], ['lumberMill', 28], ['tradepost', 16], ['smelter', 31], ['mine', 38], ['pasture', 45], ['academy', 38],
                //    ['library', 50], ['aqueduct', 50], ['barn', 10000], ['workshop', 10000], ['logHouse', 10000], ['hut', 10000],
                //    ['warehouse', 30], ['unicornPasture', 10000]], //17
                //[['workshop', -1], ['hut', -1], ['logHouse', -1], ['field', -1],
                //    ['temple', 1], ['amphitheatre', 21], ['lumberMill', 34], ['tradepost', 22], ['smelter', 39], ['mine', 44],
                //    ['academy', 46], ['library', 56], ['aqueduct', 60], ['barn', 10000], ['workshop', 10000], ['logHouse', 10000], ['hut', 10000],
                //    ['warehouse', 42], ['unicornPasture', 10000]], //18
                //[['workshop', -1], ['hut', -1], ['logHouse', -1], ['field', -1],
                //    ['observatory', -1, [buildCheckObservatory]], ['observatory', 7],
                //    ['temple', 5], ['amphitheatre', 28], ['lumberMill', 37], ['tradepost', 27], ['smelter', 51], ['mine', 57],
                //    ['academy', 58], ['library', 62], ['aqueduct', 68], ['barn', 10000], ['workshop', 10000], ['logHouse', 10000], ['hut', 10000],
                //    ['warehouse', 46], ['unicornPasture', 10000]], //19
                //[['workshop', -1], ['hut', -1], ['logHouse', -1], ['field', -1],
                //    ['mine', -1], ['lumberMill', -1], ['academy', -1], ['Science', 'navigation']],
                //[['workshop', -1], ['hut', -1], ['logHouse', -1], ['field', -1],
                //    ['harbor', 7]],
                //[['workshop', -1], ['hut', -1], ['logHouse', -1], ['field', -1],
                //    ['observatory', -1, [buildCheckObservatory]], ['observatory', 7], ['temple', 5], ['amphitheatre', 28], ['lumberMill', 10000],
                //    ['tradepost', 27], ['smelter', 51], ['mine', 10000], ['harbor', 8],
                //    ['academy', 58], ['library', 62], ['aqueduct', 68], ['barn', 10000], ['workshop', 10000], ['logHouse', 10000], ['hut', 10000],
                //    ['warehouse', 46], ['unicornPasture', 10000]], //19
                //[['warehouse', 50, [warehouseCheck]], ['observatory', 50]]
            ]
        };

        var smartBuildOrders = smartBuildOrdersFn();
        if (myRes['titanium'].value > 50000) smartBuildOrders = [];
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
                        if (meta && (bldName == 'aqueduct' || bldName == 'amphitheatre' || bldName == 'pasture') && meta.stage > 0) {
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
            console.log('init indx', index);
            buildDex = index;
        }
        validateBuildOrders();

        smartBuildOrders.splice(0, buildDex - 1); //Destory to step

        var endBuild = false;

        var smartBuild = function () {

            if (!scriptEnabled || isReset) return;


            //console.log(JSON.stringify(smartBuildOrders))
            //console.log(JSON.stringify(smartBuildOrders[0]))
            if (gamePage.activeTabId != 'Bonfire') return;

            if (gp.resPool.energyProd && gp.resPool.energyCons) {
                myRes['energy'] = {
                    value: gp.resPool.energyProd - gp.resPool.energyCons,
                    maxValue: gp.resPool.energyProd
                }
            }

            if (!endBuild && smartBuildOrders.length == 0 || (smartBuildOrders.length == 1 && buildDex > smartBuildOrders.length)) {
                var cln = $.extend(true, [], lastBuildOrders);
                smartBuildOrders = [];
                smartBuildOrders.push(cln);
                endBuild = true;
                //clearInterval(smartBuildTmr);
                //return true;
            }

            var runAgain = false;
            //console.log('-----------------');
            //console.log(JSON.stringify(smartBuildOrders));
            for (iI = smartBuildOrders[0].length - 1; iI >= 0; iI--) {
                var buildId = smartBuildOrders[0][iI];
                var bldName = buildId[0];
                var buildCnt = buildId[1];
                var buildCheck = null;
                if (buildId[2]) buildCheck = buildId[2];
                var bldArea = "home";

                if (bldName == "Science") {
                    var techName = buildId[1];
                    var tech = gp.science.get(techName);
                    if (tech.researched) {
                        smartBuildOrders[0].splice(iI, 1);
                        runAgain = true;
                    }
                    //Find and Try and Build Resources for 'Tech'
                } else {
                    //console.log('try build', bldName)
                    var isSpace = false;
                    //console.log('try', bldName);
                    if (bldName == "space") {
                        //Handle space buildings.

                        if (gp.spaceTab.visible) {
                            bldArea = buildId[1];
                            bldName = buildId[2];
                            buildCnt = buildId[3];
                            if (buildId[4]) { buildCheck = buildId[4] } else { buildCheck = null }
                            isSpace = true;
                            //console.log(JSON.stringify(smartBuildOrders[0][iI]));

                        } else {
                            runAgain = true;
                            break; //Move on no space yet.
                        }
                    }

                    //Check if it is in stage 2


                    var originalBldName = bldName;
                    if (bldName == 'broadcastTower') bldName = 'amphitheatre';
                    if (bldName == 'solarFarm') bldName = 'pasture';
                    if (bldName == 'hydroPlant') bldName = 'aqueduct';


                    var meta = null;
                    //var btn = null;


                    if (isSpace) {
                        //Loop Programs
                        if (bldArea == "program") {
                            meta = gp.space.getProgram(bldName)
                        } else {
                            //console.log('try', bldArea, bldName)
                            var area = gp.space.getPlanet(bldArea);
                            var bldss = area.buildings;

                            if (area.unlocked) {
                                for (iBld in bldss) {
                                    if (bldss[iBld].name == bldName) {
                                        meta = bldss[iBld];
                                        break;
                                    }
                                }
                            }

                            //console.log('here', JSON.stringify(meta));
//console.log(JSON.stringify(gp.space.getPlanet(bldArea)));
                        }

                        //Loop Planets
                        //Loop Buildings
                    } else {
                        meta = gp.bld.getBuilding(bldName);
                    }


                    if ((originalBldName == 'broadcastTower' || originalBldName == 'solarFarm' || originalBldName == 'hydroPlant') && meta.stage != 1) {
                        meta = null; //Building is not availble.
                        console.log('is null')
                    }


                    if (meta) {

                        //console.log('try cnt', bldName, buildCnt);
                        if (meta.upgradable && meta.stage == 0 && meta.stages[1].stageUnlocked) {
                            meta.stage = meta.stage || 0;
                            meta.stage++;
                            meta.val = 0;

                            if (meta.calculateEffects) {
                                meta.calculateEffects(meta, gp);
                            }
                            gp.render();
                            console.log('upgrade', bldName);
                        }
                        if (bldName == 'steamworks' && meta.togglable && !meta.enabled && meta.val > 10) {
                            meta.enabled = !meta.enabled;
                            meta.on = meta.enabled ? meta.val : 0;
                            gp.upgrade(meta.upgrades);
                            console.log('turn on', bldName)
                        }
                        var isObs = (originalBldName == bldName && (bldName == 'aqueduct' || bldName == 'amphitheatre' || bldName == 'pasture') && meta.stage > 0);


                        if (!isObs) {

                            //buildCnt = 0; //Skip; unless
                            //check on
                            //check upgrade


                            if (buildCnt == -1) {
                                for (iA = smartBuildOrders[0].length - 1; iA >= 0; iA--) {

                                    if (smartBuildOrders[0][iA][1] != -1) {
                                        buildCnt = 10000; //Build to whenever.
                                        break;
                                    }
                                }
                            }


                            if (meta.unlocked && (meta.on || meta.on === 0) && meta.on < meta.val) {
                                meta.on = meta.val;
                                gp.upgrade(meta.upgrades);
                            }
                            //console.log(bldName, buildCnt)


                            if (meta.unlocked && meta.val < buildCnt) {

                                var prices = {};
                                if (isSpace) {
                                    var spaceGetPrices = function (program) {
                                        //var program = meta;
                                        var ratio = program.priceRatio || 1.15;

                                        var prices = dojo.clone(program.prices);
                                        if (program.upgradable) {
                                            for (var i = 0; i < prices.length; i++) {
                                                if (prices[i].name !== "oil") {
                                                    prices[i].val = prices[i].val * Math.pow(ratio, program.val);
                                                } else {
                                                    prices[i].val = prices[i].val * Math.pow(1.05, program.val);
                                                }
                                            }
                                        }
                                        for (var i = 0; i < prices.length; i++) {
                                            if (prices[i].name == "oil") {
                                                var reductionRatio = gp.bld.getHyperbolicEffect(gp.space.getEffect("oilReductionRatio"), 0.75);
                                                prices[i].val *= (1 - reductionRatio);
                                            }
                                        }

                                        return prices;
                                    }

                                    prices = spaceGetPrices(meta);

                                    //console.log(meta.title, JSON.stringify(prices));
                                } else {
                                    prices = gp.bld.getPrices(bldName);
                                }

//console.log('try build', JSON.stringify(new Date().toString()), 'hi');
                                var canBuild = false;
                                var cB = true;
                                var iM = false;
                                //Run checks.


                                if (buildCheck) {//Has + resources.

                                    for (fnI in buildCheck) {
                                        var check = buildCheck[fnI](meta, prices);
                                        if (!check[0] && cB) cB = false;
                                        if (check[1] && !iM) iM = true;
                                    }

                                }
                                //if (bldName == 'library') console.log('try lib', meta, canBuild, cB)
                                if (cB) { canBuild = gp.resPool.hasRes(prices); } else { canBuild = false; }
                                //if (bldName == "aqueduct") {
                                //    console.log('out check', cB, canBuild, originalBldName)
                                //}

                                //if (bldName == 'cryostation') console.log('try build cryostation', cB, canBuild, bldName, JSON.stringify(meta), JSON.stringify(prices));

                                var isMaxLimited = iM;

                                //if (bldName == 'warehouse') {
                                //console.log(canBuild, isMaxLimited, 'yes', JSON.stringify(warehouseCheck(meta, prices)))
                                //}

                                //console.log('try', canBuild, cB, isObs, meta.name, smartBuildOrders[0].length, originalBldName, buildCnt);

                                if (canBuild) {
                                    var label;
                                    if (meta.stages) {
                                        //console.log(bldName)
                                        var stageC = (meta.stage) ? meta.stage : 0;
                                        label = meta.stages[meta.stage].label
                                    } else {
                                        if (meta.label) label = meta.label
                                        if (meta.title) label = meta.title
                                    }
                                    var button = null;
                                    if (isSpace) {
                                        //console.log('goto space', bldName)
                                        if (gamePage.activeTabId != 'Space') {
                                            gamePage.activeTabId = 'Space';
                                            gamePage.render();
                                        }

                                        var uiButton = $(".btnContent:contains('" + label + "')");
                                        button = {enabled: true, visible: true}
                                        if (!uiButton) button = {enabled: false, visible: false}
                                        if (button.enabled && uiButton.find("span").hasClass('limited')) button.enabled = false;
                                        if (button.enabled && uiButton.parent().hasClass('disabled')) button.enabled = false;
                                        if (button.visible && uiButton.parent().css('display') == "none") button.visible = false;
                                        //if (isSpace) console.log(meta.title, JSON.stringify(prices), buildCheck, canBuild, button);
                                    } else {
                                        button = smartGetButton('Bonfire', label)
                                    }

                                    //console.log(bldName, button)
                                    if (button && button.enabled && button.visible) {
                                        smartLog(label, "Build");
                                        //clear request
                                        for (iType in prices) {
                                            smartCraftClearRequest(prices[iType].name, prices[iType].val)
                                        }
                                        $(".btnContent:contains('" + label + "')").click();

                                        if (meta.unlocked && (meta.on || meta.on === 0) && meta.on < meta.val) {
                                            meta.on = meta.val;
                                            gp.upgrade(meta.upgrades);
                                        }
                                        //if (bldName == "smelter" || bldName == "magneto" || bldName == "calciner") {
                                        //    if ($(".btnContent:contains('" + label + "')").text().indexOf("0/1")) {
                                        //
                                        //        var building = meta;

                                        //    }
                                        //}
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
                                if (!endBuild) smartBuildOrders[0].splice(iI, 1);
                                runAgain = true;
                            }
                        }
                    }
                }
            }

            if (isSpace && gamePage.activeTabId != 'Bonfire') {
                gamePage.activeTabId = 'Bonfire';
                gamePage.render();
            }

            if (smartBuildOrders.length > 0) {
                var msgB = "<div>" + (parseInt(buildDex) + 1) + " of " + smartBuildOrders.length + " (" +
                    JSON.stringify(smartBuildOrders[0]).replace(/\[/g, "").replace(/\]/g, "").replace(/",/g, ":").replace(/"/g, "").replace(/null/g, "").replace(/,/g, ", ")
                    + ")</div>";

                if (msgB.length > 1000) msgB = msgB.substring(0, 1000);
                if (endBuild) msgB = 'Build: End build';
                $("#devBuild").html(msgB);
                //console.log(smartBuildOrders[0].length, buildDex+1, JSON.stringify(smartBuildOrders[0]))
            }

            //console.log(JSON.stringify(smartBuildOrders[0]))
            if (smartBuildOrders[0].length == 0) {
                smartBuildOrders.shift();
                buildDex++;
                GM_setValue('buildDex', buildDex);
                runAgain = true;
                //if (smartBuildOrders.length>0) smartLog("New Build Orders: " +  buildDex + ' - ' + JSON.stringify(smartBuildOrders[0]));
            }


            if (smartBuildOrders.length == 0) {
                //    clearInterval(smartBuildTmr);
                runAgain = false;
                return true;
            }


            if (runAgain && smartBuildOrders.length > 1 && !endBuild) {
                //console.log('try again')
                smartBuild();
            }

            if (myRes['kittens'].value < gp.village.maxKittens) {
                smartPopTmrDelay = 500;
                smartPop();
            }


        }
        var smartBuildTmr;
        smartBuildTmr = setInterval(smartBuild, 2000);


//Smart Cat-Nip + Inital Wood
        var smartCipMax = 40000; //STop clicking catnip at
        var smartCatnipTmr;

        var smartCatnip = function () {
            if (!scriptEnabled || isReset) return;
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
            //popMode = !popMode
            $('.togglePop').text((popMode) ? ' - P: ON ' : ' - P: OFF ')
            //GM_setValue('popMode', popMode)
        })

        $("#topBar>div:eq(0)>span:eq(0)").append($('<span style="opacity: .8; font-size: 8pt">').html(' - PPC: <span class="ppc" style="color: lightblue; opacity: .9">0</span> | ' +
                'DPM: <span class="dpm" style="color: lightblue; opacity: .9">0</span> | ' +
                'MPY: <span class="mpy" style="color: lightblue; opacity: .9">0</span> | ' +
                'PPH: <span class="pph" style="color: lightblue; opacity: .9">0</span> | ' +
                '(<span class="dpmp" style="color: lightblue; opacity: .9">100%</span>, <span class="dpmpl" style="color: lightblue; opacity: .9">100%</span>) ')
            .append(toggleScript, toggleFaith, togglePop))


        var refreshFn = function () {
            $("#headerLinks>a:contains('Save')").click();

            if (location.href.indexOf("file://") == 0) {
                console.log('run refresh');
                setTimeout(function () {
                    location.reload();
                }, 1000)
            } else {
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
            }

        }

        var refreshCount = 0;
        var statFn = function () {
            //paragon per year
            //Kittens-70 / Year
            var cDay = ((gp.calendar.year * 400) + ((gp.calendar.season - 1) * 100) + gp.calendar.day);
            var ppy = (parseInt(myRes['kittens'].value - 70) / (cDay / 400));
            if (ppy < 0) ppy = 0;
            var ppc = ppy * 100;

            $(".ppy").text(ppy.toFixed(3));
            $(".ppc").text(ppc.toFixed(1));


            //Days per minute

            //cDay = 1 //Year * 400 + Day.
            if (days.length >= 14) days.pop();
            days.unshift([cDay, new Date()]);

            if (!dayLng) dayLng = [cDay, new Date()];

            var avgTime = days[0][1] - days[days.length - 1][1];
            var avgDays = days[0][0] - days[days.length - 1][0];
            var dpm = 60 / ((avgTime / 1000) / avgDays);
            dayCnt += avgDays;
            if (!dpm) dpm = 30;
            //console.log(avgTime, avgDays , dpm, days[0][0], days[days.length-1][0], days)
            $(".dpm").text(dpm.toFixed(1));
            //Day per minute %
            //100% = 30
            //(dpm / 30) * 100
            var dpmp = (dpm / 30) * 100;
            $(".dpmp").text(dpmp.toFixed(1) + '%');

            var dpmpl = ((60 / (((days[0][1] - dayLng[1]) / 1000) / (days[0][0] - dayLng[0]))) / 30) * 100;
            if (!dpmpl) dpmpl = 100;
            var activeDays = (days[0][0] - dayLng[0]).toFixed(0);
            $(".dpmpl").text(dpmpl.toFixed(1) + '% / ' + activeDays);

            //minutes per yer
            //400 / dpm
            var mpy = (400 / dpm);
            $(".mpy").text(mpy.toFixed(1));

            ////pargon per hour (real time)
            //400 / Days Per Minute = (Real Time Year in minutes) 400 / 2 = 200 Minutes (per year)
            // 60 / (Real Time Year in minutes) (60 / 200) = 0.3 Years per Hour.
            // paragon per hour = (paragon per year) * (Years Per hour)

            var pph = (60 / mpy) * ppy;
            $(".pph").text(pph.toFixed(1));

            //Handle Refreah for bad proformance:
            if ((activeDays > 100 && dpmpl < 95) || activeDays > 6000) {
                refreshCount++;
                console.log('refresh', refreshCount);
                $("#headerLinks>a:contains('Save')").click();
                if (refreshCount > 2) refreshFn();
            }

        }

        setInterval(statFn, 10000);
        statFn();

        var autoRun = function () {

            if (isDevel) return;

            if (!scriptEnabled || isReset) return;

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

            if (gamePage.activeTabId == "Bonfire" && (myRes['parchment'].value > 10000) && myRes['catpower'].perTickUI > 100) { autoFestival() }


        };

        setInterval(autoRun, 5000);


    }
    ;
setTimeout(kittenBot, 1000);